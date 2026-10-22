const { body } = require('express-validator');
const User = require('../models/User');
const Food = require('../models/Food');
const FoodLog = require('../models/FoodLog');
const Exercise = require('../models/Exercise');
const Workout = require('../models/Workout');
const HealthLog = require('../models/HealthLog');
const AppError = require('../utils/AppError');
const { asyncHandler } = require('../middleware/errorMiddleware');
const foodsSeed = require('../seed/foods');
const exercisesSeed = require('../seed/exercises');

const catalogFoodValidators = [
  body('name').trim().notEmpty().withMessage('Food name is required').isLength({ max: 120 }),
  body('category').isIn(Food.FOOD_CATEGORIES).withMessage('Invalid category'),
  body('servingSize').isFloat({ gt: 0 }).withMessage('Serving size must be positive'),
  body('servingUnit').isIn(Food.SERVING_UNITS).withMessage('Invalid serving unit'),
  body('calories').isFloat({ min: 0 }).withMessage('Calories must be a non-negative number'),
  body('protein').isFloat({ min: 0 }).withMessage('Protein must be a non-negative number'),
  body('carbs').isFloat({ min: 0 }).withMessage('Carbs must be a non-negative number'),
  body('fat').isFloat({ min: 0 }).withMessage('Fat must be a non-negative number'),
];

const exerciseValidators = [
  body('name').trim().notEmpty().withMessage('Exercise name is required').isLength({ max: 120 }),
  body('category').isIn(Exercise.EXERCISE_CATEGORIES).withMessage('Invalid category'),
  body('muscleGroup').isIn(Exercise.MUSCLE_GROUPS).withMessage('Invalid muscle group'),
  body('difficulty').isIn(Exercise.DIFFICULTIES).withMessage('Invalid difficulty'),
  body('instructions').trim().notEmpty().withMessage('Instructions are required').isLength({ max: 1000 }),
];

const getOverview = asyncHandler(async (req, res) => {
  const [
    users,
    foods,
    customFoods,
    foodLogs,
    exercises,
    workouts,
    healthLogs,
    recentLogs,
  ] = await Promise.all([
    User.countDocuments(),
    Food.countDocuments({ isCustom: false }),
    Food.countDocuments({ isCustom: true }),
    FoodLog.countDocuments(),
    Exercise.countDocuments(),
    Workout.countDocuments(),
    HealthLog.countDocuments(),
    FoodLog.find()
      .sort({ createdAt: -1 })
      .limit(8)
      .populate('foodId', 'name')
      .populate('userId', 'name email'),
  ]);

  const topFoods = await FoodLog.aggregate([
    { $group: { _id: '$foodId', count: { $sum: 1 }, calories: { $sum: '$calories' } } },
    { $sort: { count: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: 'foods',
        localField: '_id',
        foreignField: '_id',
        as: 'food',
      },
    },
    { $unwind: { path: '$food', preserveNullAndEmptyArrays: true } },
  ]);

  res.json({
    success: true,
    data: {
      collections: {
        users,
        foods,
        customFoods,
        foodLogs,
        exercises,
        workouts,
        healthLogs,
      },
      topFoods: topFoods.map((item) => ({
        name: item.food?.name || 'Unknown',
        count: item.count,
        calories: Math.round(item.calories * 10) / 10,
      })),
      recentLogs,
    },
  });
});

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 }).select('-password');
  res.json({
    success: true,
    data: {
      users: users.map((u) => u.toSafeObject()),
    },
  });
});

const getAdminFoods = asyncHandler(async (req, res) => {
  const foods = await Food.find({ isCustom: false }).sort({ name: 1 });
  res.json({ success: true, data: { foods } });
});

const createCatalogFood = asyncHandler(async (req, res) => {
  const food = await Food.create({
    ...req.body,
    isCustom: false,
    createdBy: null,
  });
  res.status(201).json({ success: true, data: { food } });
});

const updateCatalogFood = asyncHandler(async (req, res) => {
  const food = await Food.findById(req.params.id);
  if (!food) throw new AppError('Food not found', 404);
  if (food.isCustom) throw new AppError('Use the nutrition page to edit custom foods', 400);

  ['name', 'category', 'servingSize', 'servingUnit', 'calories', 'protein', 'carbs', 'fat'].forEach(
    (field) => {
      if (req.body[field] !== undefined) food[field] = req.body[field];
    }
  );

  await food.save();
  res.json({ success: true, data: { food } });
});

const deleteCatalogFood = asyncHandler(async (req, res) => {
  const food = await Food.findById(req.params.id);
  if (!food) throw new AppError('Food not found', 404);
  if (food.isCustom) throw new AppError('You can only delete catalog foods here', 400);

  const used = await FoodLog.countDocuments({ foodId: food._id });
  if (used > 0) {
    throw new AppError(`Cannot delete. This food is used in ${used} food log(s).`, 400);
  }

  await food.deleteOne();
  res.json({ success: true, data: { message: 'Food deleted' } });
});

const getAdminExercises = asyncHandler(async (req, res) => {
  const exercises = await Exercise.find().sort({ name: 1 });
  res.json({ success: true, data: { exercises } });
});

const createExercise = asyncHandler(async (req, res) => {
  const exercise = await Exercise.create(req.body);
  res.status(201).json({ success: true, data: { exercise } });
});

const updateExercise = asyncHandler(async (req, res) => {
  const exercise = await Exercise.findById(req.params.id);
  if (!exercise) throw new AppError('Exercise not found', 404);

  ['name', 'category', 'muscleGroup', 'difficulty', 'instructions'].forEach((field) => {
    if (req.body[field] !== undefined) exercise[field] = req.body[field];
  });

  await exercise.save();
  res.json({ success: true, data: { exercise } });
});

const deleteExercise = asyncHandler(async (req, res) => {
  const exercise = await Exercise.findById(req.params.id);
  if (!exercise) throw new AppError('Exercise not found', 404);

  const used = await Workout.countDocuments({ 'exercises.exerciseId': exercise._id });
  if (used > 0) {
    throw new AppError(`Cannot delete. This exercise is used in ${used} workout(s).`, 400);
  }

  await exercise.deleteOne();
  res.json({ success: true, data: { message: 'Exercise deleted' } });
});

const reseedCatalog = asyncHandler(async (req, res) => {
  await Food.deleteMany({ isCustom: false });
  await Exercise.deleteMany({});

  const foods = await Food.insertMany(
    foodsSeed.map((f) => ({ ...f, isCustom: false, createdBy: null }))
  );
  const exercises = await Exercise.insertMany(exercisesSeed);

  res.json({
    success: true,
    data: {
      foods: foods.length,
      exercises: exercises.length,
      message: 'Catalog reseeding completed. User logs were not deleted.',
    },
  });
});

const optimizeDatabase = asyncHandler(async (req, res) => {
  const models = [User, Food, FoodLog, Exercise, Workout, HealthLog];
  const indexResults = [];

  for (const model of models) {
    await model.syncIndexes();
    const indexes = await model.collection.indexes();
    indexResults.push({
      collection: model.collection.collectionName,
      indexes: indexes.map((i) => i.name),
    });
  }

  const duplicateFoods = await Food.aggregate([
    { $match: { isCustom: false } },
    { $group: { _id: { name: '$name', category: '$category' }, count: { $sum: 1 }, ids: { $push: '$_id' } } },
    { $match: { count: { $gt: 1 } } },
  ]);

  const collections = {
    users: await User.countDocuments(),
    foods: await Food.countDocuments(),
    foodlogs: await FoodLog.countDocuments(),
    healthlogs: await HealthLog.countDocuments(),
    exercises: await Exercise.countDocuments(),
    workouts: await Workout.countDocuments(),
  };

  res.json({
    success: true,
    data: {
      message: 'Indexes synced and collections verified.',
      collections,
      indexes: indexResults,
      duplicateCatalogFoods: duplicateFoods.length,
    },
  });
});

module.exports = {
  getOverview,
  getUsers,
  getAdminFoods,
  createCatalogFood,
  updateCatalogFood,
  deleteCatalogFood,
  getAdminExercises,
  createExercise,
  updateExercise,
  deleteExercise,
  reseedCatalog,
  optimizeDatabase,
  catalogFoodValidators,
  exerciseValidators,
};
