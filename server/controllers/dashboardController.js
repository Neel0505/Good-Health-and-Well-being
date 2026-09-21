const FoodLog = require('../models/FoodLog');
const Workout = require('../models/Workout');
const HealthLog = require('../models/HealthLog');
const { asyncHandler } = require('../middleware/errorMiddleware');
const {
  calculateTargets,
  startOfDay,
  endOfDay,
  daysAgo,
} = require('../utils/nutrition');

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

const getDashboard = asyncHandler(async (req, res) => {
  const today = startOfDay();
  const todayEnd = endOfDay(today);
  const weekStart = daysAgo(6);
  const targets = calculateTargets(req.user);

  const [foodLogs, workoutsToday, healthToday, weekFoods, weekWorkouts, weekHealth] =
    await Promise.all([
      FoodLog.find({
        userId: req.user._id,
        date: { $gte: today, $lte: todayEnd },
      }).populate('foodId', 'name category'),
      Workout.find({
        userId: req.user._id,
        date: { $gte: today, $lte: todayEnd },
        completed: true,
      }).populate('exercises.exerciseId', 'name category muscleGroup'),
      HealthLog.findOne({
        userId: req.user._id,
        date: { $gte: today, $lte: todayEnd },
      }),
      FoodLog.find({
        userId: req.user._id,
        date: { $gte: weekStart, $lte: todayEnd },
      }),
      Workout.find({
        userId: req.user._id,
        date: { $gte: weekStart, $lte: todayEnd },
        completed: true,
      }),
      HealthLog.find({
        userId: req.user._id,
        date: { $gte: weekStart, $lte: todayEnd },
      }),
    ]);

  const nutritionTotals = foodLogs.reduce(
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
  Object.keys(nutritionTotals).forEach((k) => {
    nutritionTotals[k] = round1(nutritionTotals[k]);
  });

  const weekly = [];
  for (let i = 6; i >= 0; i -= 1) {
    const day = daysAgo(i);
    const next = endOfDay(day);
    const label = day.toLocaleDateString('en-US', { weekday: 'short' });

    const dayFoods = weekFoods.filter((f) => f.date >= day && f.date <= next);
    const dayWorkouts = weekWorkouts.filter((w) => w.date >= day && w.date <= next);
    const dayHealth = weekHealth.find((h) => h.date >= day && h.date <= next);

    weekly.push({
      date: day,
      label,
      calories: round1(dayFoods.reduce((s, f) => s + f.calories, 0)),
      protein: round1(dayFoods.reduce((s, f) => s + f.protein, 0)),
      workouts: dayWorkouts.length,
      weight: dayHealth?.weight ?? null,
    });
  }

  res.json({
    success: true,
    data: {
      greeting: getGreeting(),
      userName: req.user.name,
      date: today,
      targets,
      waterTarget: req.user.waterTarget || 2500,
      summary: {
        calories: nutritionTotals.calories,
        protein: nutritionTotals.protein,
        carbs: nutritionTotals.carbs,
        fat: nutritionTotals.fat,
        water: healthToday?.water ?? 0,
        sleep: healthToday?.sleep ?? 0,
        weight: healthToday?.weight ?? req.user.weight ?? null,
        workoutCompleted: workoutsToday.length > 0,
        workoutCount: workoutsToday.length,
      },
      todayNutrition: {
        totals: nutritionTotals,
        logs: foodLogs,
      },
      todayWorkouts: workoutsToday,
      healthToday,
      weekly,
    },
  });
});

module.exports = { getDashboard };
