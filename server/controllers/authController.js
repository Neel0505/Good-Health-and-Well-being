const { body } = require('express-validator');
const User = require('../models/User');
const { generateToken } = require('../utils/generateToken');
const AppError = require('../utils/AppError');
const { asyncHandler } = require('../middleware/errorMiddleware');

const registerValidators = [
  body('name').trim().notEmpty().withMessage('Full name is required').isLength({ max: 80 }),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    return true;
  }),
];

const loginValidators = [
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) {
    throw new AppError('Email already registered', 400);
  }

  const user = await User.create({ name, email, password });
  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    data: {
      user: user.toSafeObject(),
      token,
    },
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = generateToken(user._id);

  res.json({
    success: true,
    data: {
      user: user.toSafeObject(),
      token,
    },
  });
});

const getMe = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: { user: req.user.toSafeObject() },
  });
});

module.exports = {
  register,
  login,
  getMe,
  registerValidators,
  loginValidators,
};
