const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validate');
const {
  getHealthLogs,
  upsertHealthLog,
  updateHealthLog,
  deleteHealthLog,
  healthValidators,
} = require('../controllers/healthController');

const router = express.Router();

router.use(protect);
router.get('/', getHealthLogs);
router.post('/', healthValidators, validate, upsertHealthLog);
router.put('/:id', healthValidators, validate, updateHealthLog);
router.delete('/:id', deleteHealthLog);

module.exports = router;
