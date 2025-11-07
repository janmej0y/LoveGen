const Match = require('../models/Match');
const User = require('../models/User');

// @desc    User likes another user (swipe right)
// @route   POST /api/matches/like
const likeUser = async (req, res, next) => {
    try {
        const { targetUserId } = req.body;
        const currentUserId = req.user.id;

        if (targetUserId === currentUserId) {
            return res.status(400).json({ message: "You cannot like yourself." });
        }

        // Check if the other user has already liked the current user
        const existingLike = await Match.findOne({
            users: { $all: [currentUserId, targetUserId] },
            likedBy: targetUserId,
            status: 'pending'
        });

        if (existingLike) {
            // It's a match!
            existingLike.status = 'matched';
            await existingLike.save();

            // In a real app, you would emit a socket event here to notify both users
            return res.status(200).json({ match: true, matchId: existingLike._id });
        } else {
            // This is the first like, create a pending match
            const alreadyLiked = await Match.findOne({
                users: { $all: [currentUserId, targetUserId] },
                likedBy: currentUserId
            });

            if (alreadyLiked) {
                return res.status(400).json({ message: 'You have already liked this user.' });
            }

            const newLike = new Match({
                users: [currentUserId, targetUserId].sort(),
                likedBy: currentUserId,
                status: 'pending'
            });
            await newLike.save();

            return res.status(200).json({ match: false });
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Get all active matches for the current user
// @route   GET /api/matches
const getActiveMatches = async (req, res, next) => {
    try {
        const matches = await Match.find({
            users: req.user.id,
            status: 'matched'
        }).populate('users', 'username profile.photos');

        res.json(matches);
    } catch (error) {
        next(error);
    }
};

// Ensure both functions are exported correctly in an object
module.exports = {
    likeUser,
    getActiveMatches,
};
