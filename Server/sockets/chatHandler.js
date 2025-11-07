const Message = require('../models/Message');
const User = require('../models/User');

function initializeSocket(io) {
    const users = {}; // Store socket IDs for active users

    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);

        // Store user's socket ID upon login/connection
        socket.on('user_connect', (userId) => {
            users[userId] = socket.id;
            User.findByIdAndUpdate(userId, { online: true }).exec();
            io.emit('user_status_change', { userId, online: true });
        });

        // Handle private messages
        socket.on('private_message', async ({ matchId, senderId, recipientId, content }) => {
            const message = new Message({
                matchId,
                sender: senderId,
                recipient: recipientId,
                content
            });
            await message.save();

            const recipientSocketId = users[recipientId];
            if (recipientSocketId) {
                io.to(recipientSocketId).emit('new_message', message);
            }
        });
        
        // Handle typing indicators
        socket.on('typing', ({ recipientId, isTyping }) => {
            const recipientSocketId = users[recipientId];
            if (recipientSocketId) {
                io.to(recipientSocketId).emit('typing_indicator', { isTyping });
            }
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
            // Find which user disconnected and update their status
            const userId = Object.keys(users).find(key => users[key] === socket.id);
            if (userId) {
                delete users[userId];
                User.findByIdAndUpdate(userId, { online: false, lastSeen: new Date() }).exec();
                io.emit('user_status_change', { userId, online: false });
            }
        });
    });
}

module.exports = initializeSocket;