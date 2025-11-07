const User = require('../models/User');

// @desc    Get all users (for admin)
// @route   GET /api/admin/users
exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        next(error);
    }
};

// @desc    Ban a user (for admin)
// @route   PUT /api/admin/users/:id/ban
exports.banUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // You might add a 'status' field to the User model, e.g., 'active', 'banned'
        // For simplicity, we'll just log it here.
        console.log(`Admin action: Banning user ${user.username}`);
        res.json({ message: `User ${user.username} has been banned.` });
    } catch (error) {
        next(error);
    }
};