export const FITNESS_GOALS = ['Weight Loss', 'Maintenance', 'Muscle Gain', 'General Fitness'];
export const ACTIVITY_LEVELS = ['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active'];
export const GENDERS = ['Male', 'Female', 'Other', 'Prefer not to say'];
export const FOOD_CATEGORIES = ['Protein', 'Grains', 'Fruits', 'Vegetables', 'Snacks', 'Others'];
export const SERVING_UNITS = ['g', 'ml', 'piece', 'cup', 'tbsp', 'serving'];
export const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
export const EXERCISE_CATEGORIES = ['Strength', 'Cardio', 'Bodyweight', 'Flexibility'];
export const MUSCLE_GROUPS = ['Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core', 'Full Body'];

export const DISCLAIMER =
  'Nutritional and fitness calculations are estimates intended for general tracking and educational purposes. Individual needs may vary.';

export const scaleNutrition = (food, quantity) => {
  if (!food || !quantity || food.servingSize <= 0) {
    return { calories: 0, protein: 0, carbs: 0, fat: 0 };
  }
  const factor = Number(quantity) / food.servingSize;
  const round1 = (n) => Math.round(n * 10) / 10;
  return {
    calories: round1(food.calories * factor),
    protein: round1(food.protein * factor),
    carbs: round1(food.carbs * factor),
    fat: round1(food.fat * factor),
  };
};

export const formatDate = (date = new Date()) =>
  new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

export const percent = (value, target) => {
  if (!target || target <= 0) return 0;
  return Math.min(100, Math.round((value / target) * 100));
};
