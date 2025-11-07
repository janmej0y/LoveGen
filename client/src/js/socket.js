const socket = io("http://localhost:5000"); // Your server URL

export function connectSocket() {
    const userId = localStorage.getItem('userId'); // Assuming userId is stored after login

    socket.on('connect', () => {
        console.log('Connected to socket server!');
        // Announce user is online
        socket.emit('user_connect', userId);
    });

    socket.on('new_message', (message) => {
        console.log('New message received:', message);
        // TODO: Find the active chat window and append the message
        // Example: if (isChatOpen(message.matchId)) { appendMessage(message); }
    });
    
    socket.on('typing_indicator', ({ isTyping }) => {
        // TODO: Show/hide the "User is typing..." indicator in the chat window
    });

    socket.on('disconnect', () => {
        console.log('Disconnected from socket server.');
    });
}

export function sendMessage(matchId, senderId, recipientId, content) {
    socket.emit('private_message', { matchId, senderId, recipientId, content });
}

export function sendTypingEvent(recipientId, isTyping) {
    socket.emit('typing', { recipientId, isTyping });
}