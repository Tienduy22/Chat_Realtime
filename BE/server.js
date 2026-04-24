require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const http = require("http");
const { Server } = require("socket.io");
const cookieParser = require('cookie-parser');
const { sequelize } = require("./src/models");
const initRoutes = require("./src/routes/indexRoute");
const errorMiddleware = require("./src/middlewares/error.middleware");
const messageHandlers = require("./src/socket/messageHandlers");

const app = express();
const PORT = process.env.PORT || 8080;

// =====================================================
// MIDDLEWARES
// =====================================================

app.use(helmet());
app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:5174",
        credentials: true,
    })
);

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
} else {
    app.use(morgan("combined"));
}

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// =====================================================
// ROUTES
// =====================================================

app.get("/health", (req, res) => {
    res.json({
        status: "OK",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || "development",
    });
});

app.get("/", (req, res) => {
    res.json({
        message: "Chat Realtime API",
        version: "1.0.0",
        documentation: "/api/docs",
    });
});

initRoutes(app);

app.use(errorMiddleware.notFound);
app.use(errorMiddleware.handleError);

// =====================================================
// SOCKET.IO SETUP
// =====================================================

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
});

io.engine.use(cookieParser());
io.on('connection', (socket) => {
  messageHandlers(io, socket);
});

global.io = io;

// =====================================================
// START SERVER
// =====================================================

const startServer = async () => {
    try {
        // ⭐ CHỈ CONNECT, KHÔNG SYNC!
        await sequelize.authenticate();
        console.log("✅ Database connected successfully");

        // ⚠️ KHÔNG sync ở đây nữa!
        // Dùng script riêng: npm run db:sync

        server.listen(PORT, () => {
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            console.log("🚀 Server Information");
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            console.log(
                `   Environment: ${process.env.NODE_ENV || "development"}`
            );
            console.log(`   Port: ${PORT}`);
            console.log(`   URL: http://localhost:${PORT}`);
            console.log(`   Health: http://localhost:${PORT}/health`);
            console.log(`   Socket.IO: Ready ✅`);
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        });
    } catch (error) {
        console.error("❌ Unable to start server:", error);
        process.exit(1);
    }
};

process.on("unhandledRejection", (err) => {
    console.error("❌ Unhandled Promise Rejection:", err);
    server.close(() => process.exit(1));
});

process.on("uncaughtException", (err) => {
    console.error("❌ Uncaught Exception:", err);
    process.exit(1);
});

process.on("SIGTERM", () => {
    console.log("👋 SIGTERM received, shutting down gracefully");
    server.close(() => {
        console.log("✅ Server closed");
        sequelize.close();
        process.exit(0);
    });
});

startServer();

module.exports = { app, server, io };
