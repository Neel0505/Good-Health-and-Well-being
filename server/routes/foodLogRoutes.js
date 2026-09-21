const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validate');
const {
  getTodayLogs,
  getFoodLogs,
  createFoodLog,
  updateFoodLog,
  deleteFoodLog,
  foodLogValidators,
  updateFoodLogValidators,
} = require('../controllers/foodLogController');

const router = express.Router();

router.use(protect);
router.get('/today', getTodayLogs);
router.get('/', getFoodLogs);
router.post('/', foodLogValidators, validate, createFoodLog);
router.put('/:id', updateFoodLogValidators, validate, updateFoodLog);
router.delete('/:id', deleteFoodLog);

module.exports = router;
