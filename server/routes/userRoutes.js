const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validate');
const {
  getProfile,
  updateProfile,
  profileValidators,
} = require('../controllers/userController');

const router = express.Router();

router.use(protect);
router.get('/profile', getProfile);
router.put('/profile', profileValidators, validate, updateProfile);

module.exports = router;
