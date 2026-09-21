const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getProgress } = require('../controllers/progressController');

const router = express.Router();

router.get('/', protect, getProgress);

module.exports = router;
