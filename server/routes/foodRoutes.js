const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validate');
const {
  getFoods,
  getFoodById,
  createCustomFood,
  deleteFood,
  customFoodValidators,
} = require('../controllers/foodController');

const router = express.Router();

router.use(protect);
router.get('/', getFoods);
router.get('/:id', getFoodById);
router.post('/custom', customFoodValidators, validate, createCustomFood);
router.delete('/:id', deleteFood);

module.exports = router;
