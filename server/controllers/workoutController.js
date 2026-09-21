const { body } = require('express-validator');
const Workout = require('../models/Workout');
const Exercise = require('../models/Exercise');
const AppError = require('../utils/AppError');
const { asyncHandler } = require('../middleware/errorMiddleware');
const { parseDateParam, startOfDay } = require('../utils/nutrition');

const workoutValidators = [
  body('workoutName').trim().notEmpty().withMessage('Workout name is required').isLength({ max: 120 }),
  body('exercises').isArray({ min: 1 }).withMessage('At least one exercise is required'),
  body('exercises.*.exerciseId').notEmpty().withMessage('Exercise ID is required'),
  body('duration').optional().isFloat({ min: 0 }).withMessage('Duration must be non-negative'),
  body('notes').optional().isLength({ max: 500 }),
  body('date').optional().isISO8601().withMessage('Invalid date'),
  body('completed').optional().isBoolean(),
];

const getWorkouts = asyncHandler(async (req, res) => {
  const workouts = await Workout.find({ userId: req.user._id })
    .populate('exercises.exerciseId', 'name category muscleGroup difficulty')
    .sort({ date: -1, createdAt: -1 });

  res.json({ success: true, data: { workouts } });
});

const getWorkoutById = asyncHandler(async (req, res) => {
  const workout = await Workout.findById(req.params.id).populate(
    'exercises.exerciseId',
    'name category muscleGroup difficulty instructions'
  );

  if (!workout) throw new AppError('Workout not found', 404);
  if (String(workout.userId) !== String(req.user._id)) {
    throw new AppError('Not authorized', 403);
  }

  res.json({ success: true, data: { workout } });
});

const createWorkout = asyncHandler(async (req, res) => {
  const { workoutName, exercises, duration, notes, date, completed } = req.body;

  for (const item of exercises) {
    const exists = await Exercise.findById(item.exerciseId);
    if (!exists) throw new AppError(`Exercise not found: ${item.exerciseId}`, 404);

    const hasStrength = (item.sets && item.sets > 0) || (item.reps && item.reps > 0);
    const hasCardio = (item.duration && item.duration > 0) || (item.distance && item.distance > 0);

    if (!hasStrength && !hasCardio) {
      throw new AppError(
        `Provide sets/reps/weight or duration/distance for ${exists.name}`,
        400
      );
    }
  }

  const workoutDate = date ? parseDateParam(date) : startOfDay();
  if (!workoutDate) throw new AppError('Invalid date', 400);

  const workout = await Workout.create({
    userId: req.user._id,
    workoutName,
    exercises,
    duration: duration || 0,
    notes: notes || '',
    date: workoutDate,
    completed: completed !== undefined ? completed : true,
  });

  await workout.populate('exercises.exerciseId', 'name category muscleGroup difficulty');

  res.status(201).json({ success: true, data: { workout } });
});

const deleteWorkout = asyncHandler(async (req, res) => {
  const workout = await Workout.findById(req.params.id);
  if (!workout) throw new AppError('Workout not found', 404);
  if (String(workout.userId) !== String(req.user._id)) {
    throw new AppError('Not authorized', 403);
  }

  await workout.deleteOne();
  res.json({ success: true, data: { message: 'Workout deleted' } });
});

module.exports = {
  getWorkouts,
  getWorkoutById,
  createWorkout,
  deleteWorkout,
  workoutValidators,
};
