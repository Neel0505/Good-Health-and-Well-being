const mongoose = require('mongoose');

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

const foodLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    foodId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Food',
      required: [true, 'Food is required'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0.1, 'Quantity must be positive'],
    },
    mealType: {
      type: String,
      required: [true, 'Meal type is required'],
      enum: MEAL_TYPES,
    },
    calories: {
      type: Number,
      required: true,
      min: 0,
    },
    protein: {
      type: Number,
      required: true,
      min: 0,
    },
    carbs: {
      type: Number,
      required: true,
      min: 0,
    },
    fat: {
      type: Number,
      required: true,
      min: 0,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

foodLogSchema.index({ userId: 1, date: 1 });

module.exports = mongoose.model('FoodLog', foodLogSchema);
module.exports.MEAL_TYPES = MEAL_TYPES;
