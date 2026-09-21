const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getExercises, getExerciseById } = require('../controllers/exerciseController');

const router = express.Router();

router.use(protect);
router.get('/', getExercises);
router.get('/:id', getExerciseById);

module.exports = router;
