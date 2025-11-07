const express = require('express');
const { getMessagesForMatch } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

// Initialize the router
const router = express.Router();

// Define the route for getting messages for a specific match
// This route is protected, ensuring only authenticated users can access it.
router.get('/:matchId', protect, getMessagesForMatch);

// Export the router itself, which is a valid middleware function
module.exports = router;

