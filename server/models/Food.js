const mongoose = require('mongoose');

const FOOD_CATEGORIES = ['Protein', 'Grains', 'Fruits', 'Vegetables', 'Snacks', 'Others'];
const SERVING_UNITS = ['g', 'ml', 'piece', 'cup', 'tbsp', 'serving'];

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Food name is required'],
      trim: true,
      maxlength: [120, 'Food name cannot exceed 120 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: FOOD_CATEGORIES,
    },
    servingSize: {
      type: Number,
      required: [true, 'Serving size is required'],
      min: [0.1, 'Serving size must be positive'],
    },
    servingUnit: {
      type: String,
      required: [true, 'Serving unit is required'],
      enum: SERVING_UNITS,
    },
    calories: {
      type: Number,
      required: [true, 'Calories are required'],
      min: [0, 'Calories cannot be negative'],
    },
    protein: {
      type: Number,
      required: [true, 'Protein is required'],
      min: [0, 'Protein cannot be negative'],
    },
    carbs: {
      type: Number,
      required: [true, 'Carbs are required'],
      min: [0, 'Carbs cannot be negative'],
    },
    fat: {
      type: Number,
      required: [true, 'Fat is required'],
      min: [0, 'Fat cannot be negative'],
    },
    isCustom: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

foodSchema.index({ name: 'text', category: 1 });
foodSchema.index({ createdBy: 1, isCustom: 1 });

module.exports = mongoose.model('Food', foodSchema);
module.exports.FOOD_CATEGORIES = FOOD_CATEGORIES;
module.exports.SERVING_UNITS = SERVING_UNITS;
