const FoodLog = require('../models/FoodLog');
const Workout = require('../models/Workout');
const HealthLog = require('../models/HealthLog');
const AppError = require('../utils/AppError');
const { asyncHandler } = require('../middleware/errorMiddleware');
const { startOfDay, endOfDay, daysAgo } = require('../utils/nutrition');

const RANGE_DAYS = {
  '7d': 7,
  '30d': 30,
  '90d': 90,
};

const getProgress = asyncHandler(async (req, res) => {
  const range = req.query.range || '7d';
  const days = RANGE_DAYS[range];
  if (!days) throw new AppError('Invalid range. Use 7d, 30d, or 90d.', 400);

  const from = daysAgo(days - 1);
  const to = endOfDay();

  const [foodLogs, workouts, healthLogs] = await Promise.all([
    FoodLog.find({
      userId: req.user._id,
      date: { $gte: from, $lte: to },
    }),
    Workout.find({
      userId: req.user._id,
      date: { $gte: from, $lte: to },
      completed: true,
    }),
    HealthLog.find({
      userId: req.user._id,
      date: { $gte: from, $lte: to },
    }).sort({ date: 1 }),
  ]);

  const round1 = (n) => Math.round(n * 10) / 10;
  const series = [];

  for (let i = days - 1; i >= 0; i -= 1) {
    const day = daysAgo(i);
    const next = endOfDay(day);
    const dayFoods = foodLogs.filter((f) => f.date >= day && f.date <= next);
    const dayWorkouts = workouts.filter((w) => w.date >= day && w.date <= next);
    const dayHealth = healthLogs.find((h) => h.date >= day && h.date <= next);

    series.push({
      date: day.toISOString().slice(0, 10),
      label: day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      calories: round1(dayFoods.reduce((s, f) => s + f.calories, 0)),
      protein: round1(dayFoods.reduce((s, f) => s + f.protein, 0)),
      workouts: dayWorkouts.length,
      weight: dayHealth?.weight ?? null,
      water: dayHealth?.water ?? null,
      sleep: dayHealth?.sleep ?? null,
    });
  }

  const weightSeries = series.filter((d) => d.weight !== null && d.weight !== undefined);
  const hasAnyData =
    foodLogs.length > 0 || workouts.length > 0 || healthLogs.length > 0;

  res.json({
    success: true,
    data: {
      range,
      days,
      hasAnyData,
      series,
      weightSeries,
      totals: {
        calories: round1(foodLogs.reduce((s, f) => s + f.calories, 0)),
        protein: round1(foodLogs.reduce((s, f) => s + f.protein, 0)),
        workouts: workouts.length,
      },
    },
  });
});

module.exports = { getProgress };
