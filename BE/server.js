require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const http = require("http");
const { Server } = require("socket.io");
const { sequelize } = require("./src/models");
const initRoutes = require("./src/routes/indexRoute");
const errorMiddleware = require("./src/middlewares/error.middleware");

const app = express();
const PORT = process.env.PORT || 3000;

// =====================================================
// MIDDLEWARES
// =====================================================

app.use(helmet());
app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:3001",
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
        origin: process.env.CLIENT_URL || "http://localhost:3001",
        methods: ["GET", "POST"],
        credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
});

io.on("connection", (socket) => {
    console.log("✅ User connected:", socket.id);

    socket.on("join", (userId) => {
        socket.join(`user:${userId}`);
        console.log(`User ${userId} joined room`);
    });

    socket.on("leave", (userId) => {
        socket.leave(`user:${userId}`);
        console.log(`User ${userId} left room`);
    });

    socket.on("disconnect", () => {
        console.log("❌ User disconnected:", socket.id);
    });

    socket.on("error", (error) => {
        console.error("Socket error:", error);
    });
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
