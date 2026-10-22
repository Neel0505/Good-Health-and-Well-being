const Food = require('../models/Food');
const FoodLog = require('../models/FoodLog');
const AppError = require('../utils/AppError');
const { asyncHandler } = require('../middleware/errorMiddleware');
const {
  calculateTargets,
  scaleNutrition,
  parseDateParam,
  startOfDay,
  endOfDay,
  daysAgo,
} = require('../utils/nutrition');

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

const getNutrition = asyncHandler(async (req, res) => {
  const day = parseDateParam(req.query.date);
  if (!day) throw new AppError('Invalid date', 400);

  const logs = await FoodLog.find({
    userId: req.user._id,
    date: { $gte: day, $lte: endOfDay(day) },
  })
    .populate('foodId', 'name category servingSize servingUnit')
    .sort({ createdAt: 1 });

  const { totals, grouped } = summarizeLogs(logs);
  const targets = calculateTargets(req.user);
  const remaining = {
    calories: Math.round((targets.calorieTarget - totals.calories) * 10) / 10,
    protein: Math.round((targets.proteinTarget - totals.protein) * 10) / 10,
  };

  res.json({
    success: true,
    data: {
      date: day,
      logs,
      totals,
      grouped,
      targets,
      remaining,
    },
  });
});

const getNutritionTargets = asyncHandler(async (req, res) => {
  const targets = calculateTargets(req.user);
  res.json({ success: true, data: { targets } });
});

const getNutritionSummary = asyncHandler(async (req, res) => {
  const days = Number(req.query.days) || 7;
  if (days < 1 || days > 90) throw new AppError('Days must be between 1 and 90', 400);

  const from = daysAgo(days - 1);
  const to = endOfDay();
  const logs = await FoodLog.find({
    userId: req.user._id,
    date: { $gte: from, $lte: to },
  });

  const series = [];
  const round1 = (n) => Math.round(n * 10) / 10;

  for (let i = days - 1; i >= 0; i -= 1) {
    const day = daysAgo(i);
    const next = endOfDay(day);
    const dayLogs = logs.filter((f) => f.date >= day && f.date <= next);
    series.push({
      date: day.toISOString().slice(0, 10),
      calories: round1(dayLogs.reduce((s, f) => s + f.calories, 0)),
      protein: round1(dayLogs.reduce((s, f) => s + f.protein, 0)),
      carbs: round1(dayLogs.reduce((s, f) => s + f.carbs, 0)),
      fat: round1(dayLogs.reduce((s, f) => s + f.fat, 0)),
      entries: dayLogs.length,
    });
  }

  res.json({
    success: true,
    data: {
      days,
      series,
      totals: {
        calories: round1(logs.reduce((s, f) => s + f.calories, 0)),
        protein: round1(logs.reduce((s, f) => s + f.protein, 0)),
        entries: logs.length,
      },
    },
  });
});

const logNutrition = asyncHandler(async (req, res) => {
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

module.exports = {
  getNutrition,
  getNutritionTargets,
  getNutritionSummary,
  logNutrition,
};
