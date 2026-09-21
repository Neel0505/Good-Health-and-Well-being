const mongoose = require('mongoose');

const EXERCISE_CATEGORIES = ['Strength', 'Cardio', 'Bodyweight', 'Flexibility'];
const MUSCLE_GROUPS = ['Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core', 'Full Body'];
const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'];

const exerciseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Exercise name is required'],
      trim: true,
      maxlength: [120, 'Exercise name cannot exceed 120 characters'],
    },
    category: {
      type: String,
      required: true,
      enum: EXERCISE_CATEGORIES,
    },
    muscleGroup: {
      type: String,
      required: true,
      enum: MUSCLE_GROUPS,
    },
    difficulty: {
      type: String,
      required: true,
      enum: DIFFICULTIES,
      default: 'Beginner',
    },
    instructions: {
      type: String,
      required: [true, 'Instructions are required'],
      trim: true,
      maxlength: [1000, 'Instructions cannot exceed 1000 characters'],
    },
  },
  { timestamps: true }
);

exerciseSchema.index({ name: 'text', category: 1, muscleGroup: 1 });

module.exports = mongoose.model('Exercise', exerciseSchema);
module.exports.EXERCISE_CATEGORIES = EXERCISE_CATEGORIES;
module.exports.MUSCLE_GROUPS = MUSCLE_GROUPS;
module.exports.DIFFICULTIES = DIFFICULTIES;
