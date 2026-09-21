const mongoose = require('mongoose');

const healthLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    water: {
      type: Number,
      min: [0, 'Water cannot be negative'],
      max: [20000, 'Water amount looks unrealistic'],
      default: 0,
    },
    sleep: {
      type: Number,
      min: [0, 'Sleep cannot be negative'],
      max: [24, 'Sleep cannot exceed 24 hours'],
      default: 0,
    },
    weight: {
      type: Number,
      min: [20, 'Weight must be at least 20 kg'],
      max: [500, 'Weight must be realistic'],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [300, 'Notes cannot exceed 300 characters'],
      default: '',
    },
  },
  { timestamps: true }
);

healthLogSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('HealthLog', healthLogSchema);
