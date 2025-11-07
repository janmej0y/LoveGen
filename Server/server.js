// 1. REQUIRE MODULES
require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

// --- Import all route files ---
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const matchRoutes = require('./routes/matchRoutes');
const adminRoutes = require('./routes/adminRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const messageRoutes = require('./routes/messageRoutes'); // Assuming you create this for message endpoints

// --- Import middleware and handlers ---
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const initializeSocket = require('./sockets/chatHandler');

// 2. INITIALIZE APP & DATABASE
connectDB();
const app = express(); // Initialize express app here

// 3. SETUP MIDDLEWARE
app.use(cors());
app.use(helmet());
// Special setup for Stripe webhook before other body parsers
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
});
app.use(limiter);

// 4. DEFINE ROUTES
app.get('/', (req, res) => res.send('LoveGen API is running...'));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/messages', messageRoutes); // Add message routes

// 5. SETUP SERVER & SOCKET.IO
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || "http://127.0.0.1:5500",
        methods: ["GET", "POST"]
    }
});
initializeSocket(io);

// 6. SETUP ERROR HANDLING
app.use(notFound);
app.use(errorHandler);

// 7. START SERVER
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
