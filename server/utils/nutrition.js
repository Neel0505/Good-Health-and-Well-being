/**
 * Nutrition target helpers (educational estimates only).
 *
 * BMR: Mifflin-St Jeor equation
 * TDEE: BMR × activity multiplier
 * Calorie target: adjusted by fitness goal
 * Protein target: fitness-oriented g/kg estimate (not medical advice)
 */

const ACTIVITY_MULTIPLIERS = {
  Sedentary: 1.2,
  'Lightly Active': 1.375,
  'Moderately Active': 1.55,
  'Very Active': 1.725,
};

const GOAL_ADJUSTMENTS = {
  'Weight Loss': -400,
  Maintenance: 0,
  'Muscle Gain': 300,
  'General Fitness': 0,
};

const PROTEIN_PER_KG = {
  'Weight Loss': 1.8,
  Maintenance: 1.4,
  'Muscle Gain': 2.0,
  'General Fitness': 1.4,
};

const calculateBMR = (user) => {
  const { weight, height, age, gender } = user;
  if (!weight || !height || !age) return null;

  // Mifflin-St Jeor
  const base = 10 * weight + 6.25 * height - 5 * age;
  if (gender === 'Male') return base + 5;
  if (gender === 'Female') return base - 161;
  return base - 78; // average midpoint for Other / Prefer not to say
};

const calculateTargets = (user) => {
  const bmr = calculateBMR(user);

  if (!bmr) {
    return {
      calorieTarget: 2000,
      proteinTarget: 100,
      bmr: null,
      tdee: null,
      incompleteProfile: true,
    };
  }

  const activity = user.activityLevel || 'Moderately Active';
  const goal = user.fitnessGoal || 'General Fitness';
  const multiplier = ACTIVITY_MULTIPLIERS[activity] || 1.55;
  const tdee = Math.round(bmr * multiplier);
  const adjustment = GOAL_ADJUSTMENTS[goal] ?? 0;
  const calorieTarget = Math.max(1200, tdee + adjustment);

  const proteinFactor = PROTEIN_PER_KG[goal] || 1.4;
  const proteinTarget = Math.round(user.weight * proteinFactor);

  return {
    calorieTarget,
    proteinTarget,
    bmr: Math.round(bmr),
    tdee,
    incompleteProfile: false,
  };
};

const scaleNutrition = (food, quantity) => {
  const factor = quantity / food.servingSize;
  const round1 = (n) => Math.round(n * 10) / 10;

  return {
    calories: round1(food.calories * factor),
    protein: round1(food.protein * factor),
    carbs: round1(food.carbs * factor),
    fat: round1(food.fat * factor),
  };
};

const startOfDay = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const endOfDay = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

const parseDateParam = (value) => {
  if (!value) return startOfDay();
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return startOfDay(d);
};

const daysAgo = (n) => {
  const d = startOfDay();
  d.setDate(d.getDate() - n);
  return d;
};

module.exports = {
  calculateBMR,
  calculateTargets,
  scaleNutrition,
  startOfDay,
  endOfDay,
  parseDateParam,
  daysAgo,
};
