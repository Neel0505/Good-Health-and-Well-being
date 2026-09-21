const { body } = require('express-validator');
const Food = require('../models/Food');
const FoodLog = require('../models/FoodLog');
const AppError = require('../utils/AppError');
const { asyncHandler } = require('../middleware/errorMiddleware');
const { scaleNutrition, parseDateParam, startOfDay, endOfDay } = require('../utils/nutrition');

const foodLogValidators = [
  body('foodId').notEmpty().withMessage('Food is required'),
  body('quantity').isFloat({ gt: 0 }).withMessage('Quantity must be positive'),
  body('mealType').isIn(FoodLog.MEAL_TYPES).withMessage('Invalid meal type'),
  body('date').optional().isISO8601().withMessage('Invalid date'),
];

const updateFoodLogValidators = [
  body('quantity').optional().isFloat({ gt: 0 }).withMessage('Quantity must be positive'),
  body('mealType').optional().isIn(FoodLog.MEAL_TYPES).withMessage('Invalid meal type'),
];

const summarizeLogs = (logs) => {
  const totals = logs.reduce(
    (acc, log) => {
      acc.calories += log.calories;
      acc.protein += log.protein;
      acc.carbs += log.carbs;
      acc.fat += log.fat;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const round1 = (n) => Math.round(n * 10) / 10;
  Object.keys(totals).forEach((k) => {
    totals[k] = round1(totals[k]);
  });

  const grouped = {
    Breakfast: [],
    Lunch: [],
    Dinner: [],
    Snack: [],
  };

  logs.forEach((log) => {
    if (grouped[log.mealType]) grouped[log.mealType].push(log);
  });

  return { totals, grouped };
};

const getTodayLogs = asyncHandler(async (req, res) => {
  const day = parseDateParam(req.query.date);
  if (!day) throw new AppError('Invalid date', 400);

  const logs = await FoodLog.find({
    userId: req.user._id,
    date: { $gte: day, $lte: endOfDay(day) },
  })
    .populate('foodId', 'name category servingSize servingUnit')
    .sort({ createdAt: 1 });

  const { totals, grouped } = summarizeLogs(logs);

  res.json({
    success: true,
    data: { logs, totals, grouped, date: day },
  });
});

const getFoodLogs = asyncHandler(async (req, res) => {
  const { from, to } = req.query;
  const filter = { userId: req.user._id };

  if (from || to) {
    filter.date = {};
    if (from) {
      const start = parseDateParam(from);
      if (!start) throw new AppError('Invalid from date', 400);
      filter.date.$gte = start;
    }
    if (to) {
      const end = parseDateParam(to);
      if (!end) throw new AppError('Invalid to date', 400);
      filter.date.$lte = endOfDay(end);
    }
  }

  const logs = await FoodLog.find(filter)
    .populate('foodId', 'name category servingSize servingUnit')
    .sort({ date: -1, createdAt: -1 })
    .limit(500);

  res.json({ success: true, data: { logs } });
});

const createFoodLog = asyncHandler(async (req, res) => {
  const { foodId, quantity, mealType, date } = req.body;

  const food = await Food.findById(foodId);
  if (!food) throw new AppError('Food not found', 404);

  if (food.isCustom && String(food.createdBy) !== String(req.user._id)) {
    throw new AppError('Not authorized to use this food', 403);
  }

  const nutrition = scaleNutrition(food, Number(quantity));
  const logDate = date ? parseDateParam(date) : startOfDay();
  if (!logDate) throw new AppError('Invalid date', 400);

  const log = await FoodLog.create({
    userId: req.user._id,
    foodId: food._id,
    quantity: Number(quantity),
    mealType,
    ...nutrition,
    date: logDate,
  });

  await log.populate('foodId', 'name category servingSize servingUnit');

  res.status(201).json({ success: true, data: { log } });
});

const updateFoodLog = asyncHandler(async (req, res) => {
  const log = await FoodLog.findById(req.params.id);
  if (!log) throw new AppError('Food log not found', 404);
  if (String(log.userId) !== String(req.user._id)) {
    throw new AppError('Not authorized', 403);
  }

  if (req.body.quantity !== undefined) {
    const food = await Food.findById(log.foodId);
    if (!food) throw new AppError('Associated food not found', 404);
    const nutrition = scaleNutrition(food, Number(req.body.quantity));
    log.quantity = Number(req.body.quantity);
    Object.assign(log, nutrition);
  }

  if (req.body.mealType) log.mealType = req.body.mealType;

  await log.save();
  await log.populate('foodId', 'name category servingSize servingUnit');

  res.json({ success: true, data: { log } });
});

const deleteFoodLog = asyncHandler(async (req, res) => {
  const log = await FoodLog.findById(req.params.id);
  if (!log) throw new AppError('Food log not found', 404);
  if (String(log.userId) !== String(req.user._id)) {
    throw new AppError('Not authorized', 403);
  }

  await log.deleteOne();
  res.json({ success: true, data: { message: 'Food log deleted' } });
});

module.exports = {
  getTodayLogs,
  getFoodLogs,
  createFoodLog,
  updateFoodLog,
  deleteFoodLog,
  foodLogValidators,
  updateFoodLogValidators,
};
