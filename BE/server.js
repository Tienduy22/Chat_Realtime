require('dotenv').config();
const express = require('express');       
const { sequelize } = require('./src/models');
const http = require('http');
const { Server } = require('socket.io');
const initRoutes = require('./src/routes/indexRoute');
const errorMiddleware = require('./src/middlewares/error.middleware');

const app = express();                    

const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
initRoutes(app);

app.use(errorMiddleware.notFound)
app.use(errorMiddleware.handleError)

app.get('/', (req, res) => {
  res.json({ message: 'Chat Realtime Backend đang chạy!' });
});

// Tạo HTTP server
const server = http.createServer(app);

// Khởi tạo Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3001',
    methods: ['GET', 'POST']
  }
});

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Xuất io toàn cục nếu cần
global.io = io;

// Khởi động server
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully');
    
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true }); 
      console.log('Database synced');
    }
    
    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Socket.IO ready`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

startServer();