const User = require('../models/User');
const matchingService = require('../services/matchingService');

// @desc    Get current user's profile
// @route   GET /api/users/me
exports.getMyProfile = async (req, res, next) => {
    try {
        // req.user is populated by the 'protect' middleware
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        next(error);
    }
};

// @desc    Update user profile
// @route   PUT /api/users/me
exports.updateMyProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update nested profile object
        Object.assign(user.profile, req.body.profile);
        
        const updatedUser = await user.save();
        res.json(updatedUser.profile);
    } catch (error) {
        next(error);
    }
};

// @desc    Get potential matches for the current user
// @route   GET /api/users/potential-matches
exports.getPotentialMatches = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const potentialMatches = await matchingService.findPotentialMatches(userId);
        res.json(potentialMatches);
    } catch (error) {
        next(error);
    }
};