const mongoose = require('mongoose');

const MatchSchema = new mongoose.Schema({
    // An array of two user IDs that are part of this match/like
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    
    // 'pending' means one user has liked the other.
    // 'matched' means both users have liked each other.
    // 'unmatched' means a match was broken.
    status: { 
        type: String, 
        enum: ['pending', 'matched', 'unmatched'], 
        default: 'pending' 
    },
    
    // The user who initiated the 'like' (created the pending match)
    likedBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    }
}, { timestamps: true });

// Ensure that any pair of users can only have one document in this collection
MatchSchema.index({ users: 1 }, { unique: true });

// Create and export the model
const Match = mongoose.model('Match', MatchSchema);
module.exports = Match;
