const { body } = require('express-validator');
const Food = require('../models/Food');
const AppError = require('../utils/AppError');
const { asyncHandler } = require('../middleware/errorMiddleware');

const customFoodValidators = [
  body('name').trim().notEmpty().withMessage('Food name is required').isLength({ max: 120 }),
  body('category').isIn(Food.FOOD_CATEGORIES).withMessage('Invalid category'),
  body('servingSize').isFloat({ gt: 0 }).withMessage('Serving size must be positive'),
  body('servingUnit').isIn(Food.SERVING_UNITS).withMessage('Invalid serving unit'),
  body('calories').isFloat({ min: 0 }).withMessage('Calories must be a non-negative number'),
  body('protein').isFloat({ min: 0 }).withMessage('Protein must be a non-negative number'),
  body('carbs').isFloat({ min: 0 }).withMessage('Carbs must be a non-negative number'),
  body('fat').isFloat({ min: 0 }).withMessage('Fat must be a non-negative number'),
];

const getFoods = asyncHandler(async (req, res) => {
  const { search, category } = req.query;
  const filter = {
    $or: [{ isCustom: false }, { isCustom: true, createdBy: req.user._id }],
  };

  if (category && category !== 'All') {
    filter.category = category;
  }

  if (search && search.trim()) {
    filter.name = { $regex: search.trim(), $options: 'i' };
  }

  const foods = await Food.find(filter).sort({ name: 1 });

  res.json({
    success: true,
    data: { foods },
  });
});

const getFoodById = asyncHandler(async (req, res) => {
  const food = await Food.findById(req.params.id);
  if (!food) throw new AppError('Food not found', 404);

  if (food.isCustom && String(food.createdBy) !== String(req.user._id)) {
    throw new AppError('Not authorized to view this food', 403);
  }

  res.json({ success: true, data: { food } });
});

const createCustomFood = asyncHandler(async (req, res) => {
  const food = await Food.create({
    ...req.body,
    isCustom: true,
    createdBy: req.user._id,
  });

  res.status(201).json({ success: true, data: { food } });
});

const deleteFood = asyncHandler(async (req, res) => {
  const food = await Food.findById(req.params.id);
  if (!food) throw new AppError('Food not found', 404);

  if (!food.isCustom || String(food.createdBy) !== String(req.user._id)) {
    throw new AppError('You can only delete your own custom foods', 403);
  }

  await food.deleteOne();
  res.json({ success: true, data: { message: 'Custom food deleted' } });
});

module.exports = {
  getFoods,
  getFoodById,
  createCustomFood,
  deleteFood,
  customFoodValidators,
};
