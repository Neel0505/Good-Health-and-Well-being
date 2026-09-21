const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validate');
const {
  register,
  login,
  getMe,
  registerValidators,
  loginValidators,
} = require('../controllers/authController');

const router = express.Router();

router.post('/register', registerValidators, validate, register);
router.post('/login', loginValidators, validate, login);
router.get('/me', protect, getMe);

module.exports = router;
