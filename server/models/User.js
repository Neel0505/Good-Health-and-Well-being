const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const FITNESS_GOALS = ['Weight Loss', 'Maintenance', 'Muscle Gain', 'General Fitness'];
const ACTIVITY_LEVELS = ['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active'];
const GENDERS = ['Male', 'Female', 'Other', 'Prefer not to say'];

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [80, 'Name cannot exceed 80 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    age: {
      type: Number,
      min: [13, 'Age must be at least 13'],
      max: [120, 'Age must be realistic'],
    },
    gender: {
      type: String,
      enum: GENDERS,
    },
    height: {
      type: Number,
      min: [50, 'Height must be at least 50 cm'],
      max: [300, 'Height must be realistic'],
    },
    weight: {
      type: Number,
      min: [20, 'Weight must be at least 20 kg'],
      max: [500, 'Weight must be realistic'],
    },
    fitnessGoal: {
      type: String,
      enum: FITNESS_GOALS,
      default: 'General Fitness',
    },
    activityLevel: {
      type: String,
      enum: ACTIVITY_LEVELS,
      default: 'Moderately Active',
    },
    waterTarget: {
      type: Number,
      default: 2500,
      min: 500,
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function matchPassword(enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.toSafeObject = function toSafeObject() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    age: this.age,
    gender: this.gender,
    height: this.height,
    weight: this.weight,
    fitnessGoal: this.fitnessGoal,
    activityLevel: this.activityLevel,
    waterTarget: this.waterTarget,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

module.exports = mongoose.model('User', userSchema);
module.exports.FITNESS_GOALS = FITNESS_GOALS;
module.exports.ACTIVITY_LEVELS = ACTIVITY_LEVELS;
module.exports.GENDERS = GENDERS;
