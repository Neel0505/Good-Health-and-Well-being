const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validate');
const {
  getWorkouts,
  getWorkoutById,
  createWorkout,
  deleteWorkout,
  workoutValidators,
} = require('../controllers/workoutController');

const router = express.Router();

router.use(protect);
router.get('/', getWorkouts);
router.get('/:id', getWorkoutById);
router.post('/', workoutValidators, validate, createWorkout);
router.delete('/:id', deleteWorkout);

module.exports = router;
