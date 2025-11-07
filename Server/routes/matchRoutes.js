const express = require('express');
const { likeUser, getActiveMatches } = require('../controllers/matchController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// The imported 'likeUser' function is now correctly used as the callback.
router.post('/like', protect, likeUser);

router.get('/', protect, getActiveMatches);

module.exports = router;
