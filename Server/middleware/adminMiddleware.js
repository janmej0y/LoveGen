exports.isAdmin = (req, res, next) => {
    // Assumes 'protect' middleware has already run and attached the user
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Forbidden: Admin access required' });
    }
};