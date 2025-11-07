const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    matchId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Match', 
        required: true 
    },
    sender: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    recipient: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    content: { 
        type: String, 
        required: true,
        trim: true
    },
    contentType: { 
        type: String, 
        enum: ['text', 'image', 'gif'], 
        default: 'text' 
    },
    read: { 
        type: Boolean, 
        default: false 
    }
}, { timestamps: true });

// Create and export the model
const Message = mongoose.model('Message', MessageSchema);
module.exports = Message;
