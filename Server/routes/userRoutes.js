const express = require('express');
const { getMyProfile, updateMyProfile, getPotentialMatches } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../services/fileUploadService');

// Initialize the router FIRST
const router = express.Router();

// --- Define all routes on the initialized router ---

// GET and PUT routes for the user's own profile
router.route('/me')
    .get(protect, getMyProfile)
    .put(protect, updateMyProfile);

// GET route for fetching potential matches
router.get('/potential-matches', protect, getPotentialMatches);

// POST route for uploading a single photo
// This now correctly uses the 'router' variable after it has been created.
router.post('/me/photos', protect, upload.single('photo'), (req, res) => {
    // A more robust implementation would be in the userController, but this works for now.
    if (!req.file) {
        return res.status(400).json({ message: 'Please upload a file.' });
    }
    
    // Add the photo URL from Cloudinary to the user's profile
    req.user.profile.photos.push(req.file.path);
    req.user.save();
    
    res.status(201).json({ 
        message: 'Photo uploaded successfully!', 
        url: req.file.path 
    });
});

// Export the router at the end
module.exports = router;
