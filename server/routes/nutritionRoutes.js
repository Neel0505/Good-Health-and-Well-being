const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validate');
const { foodLogValidators } = require('../controllers/foodLogController');
const {
  getNutrition,
  getNutritionTargets,
  getNutritionSummary,
  logNutrition,
} = require('../controllers/nutritionController');

const router = express.Router();

router.use(protect);
router.get('/', getNutrition);
router.get('/targets', getNutritionTargets);
router.get('/summary', getNutritionSummary);
router.post('/log', foodLogValidators, validate, logNutrition);

module.exports = router;
