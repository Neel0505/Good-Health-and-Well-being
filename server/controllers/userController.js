const { body } = require('express-validator');
const User = require('../models/User');
const { calculateTargets } = require('../utils/nutrition');
const { asyncHandler } = require('../middleware/errorMiddleware');

const profileValidators = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty').isLength({ max: 80 }),
  body('age').optional({ nullable: true }).isInt({ min: 13, max: 120 }).withMessage('Age must be between 13 and 120'),
  body('gender').optional({ nullable: true }).isIn(User.GENDERS).withMessage('Invalid gender'),
  body('height').optional({ nullable: true }).isFloat({ min: 50, max: 300 }).withMessage('Height must be 50–300 cm'),
  body('weight').optional({ nullable: true }).isFloat({ min: 20, max: 500 }).withMessage('Weight must be 20–500 kg'),
  body('fitnessGoal').optional().isIn(User.FITNESS_GOALS).withMessage('Invalid fitness goal'),
  body('activityLevel').optional().isIn(User.ACTIVITY_LEVELS).withMessage('Invalid activity level'),
  body('waterTarget').optional().isFloat({ min: 500, max: 10000 }).withMessage('Water target must be realistic'),
];

const getProfile = asyncHandler(async (req, res) => {
  const targets = calculateTargets(req.user);

  res.json({
    success: true,
    data: {
      user: req.user.toSafeObject(),
      targets,
    },
  });
});

const updateProfile = asyncHandler(async (req, res) => {
  const allowed = [
    'name',
    'age',
    'gender',
    'height',
    'weight',
    'fitnessGoal',
    'activityLevel',
    'waterTarget',
  ];

  allowed.forEach((field) => {
    if (req.body[field] !== undefined) {
      req.user[field] = req.body[field] === '' ? undefined : req.body[field];
    }
  });

  await req.user.save();
  const targets = calculateTargets(req.user);

  res.json({
    success: true,
    data: {
      user: req.user.toSafeObject(),
      targets,
    },
  });
});

module.exports = { getProfile, updateProfile, profileValidators };
