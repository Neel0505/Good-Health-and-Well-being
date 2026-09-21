const Exercise = require('../models/Exercise');
const AppError = require('../utils/AppError');
const { asyncHandler } = require('../middleware/errorMiddleware');

const getExercises = asyncHandler(async (req, res) => {
  const { search, category, muscleGroup } = req.query;
  const filter = {};

  if (category && category !== 'All') filter.category = category;
  if (muscleGroup && muscleGroup !== 'All') filter.muscleGroup = muscleGroup;
  if (search && search.trim()) {
    filter.name = { $regex: search.trim(), $options: 'i' };
  }

  const exercises = await Exercise.find(filter).sort({ name: 1 });
  res.json({ success: true, data: { exercises } });
});

const getExerciseById = asyncHandler(async (req, res) => {
  const exercise = await Exercise.findById(req.params.id);
  if (!exercise) throw new AppError('Exercise not found', 404);
  res.json({ success: true, data: { exercise } });
});

module.exports = { getExercises, getExerciseById };
