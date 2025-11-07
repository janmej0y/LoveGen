const Message = require('../models/Message');
const Match = require('../models/Match');

// @desc    Get messages for a specific match
// @route   GET /api/messages/:matchId
const getMessagesForMatch = async (req, res, next) => {
    try {
        const { matchId } = req.params;
        const currentUserId = req.user.id;

        // First, verify that the current user is part of the match they are trying to access
        const match = await Match.findOne({ _id: matchId, users: currentUserId });
        if (!match) {
            return res.status(403).json({ message: "Forbidden: You are not authorized to view these messages." });
        }

        // If authorized, fetch all messages for that match
        const messages = await Message.find({ matchId })
            .populate('sender', 'username') // Populate sender's username
            .sort({ createdAt: 'asc' });   // Sort messages chronologically

        res.json(messages);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getMessagesForMatch,
};

