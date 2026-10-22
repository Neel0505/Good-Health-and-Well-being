const express = require('express');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validate');
const {
  getOverview,
  getUsers,
  getAdminFoods,
  createCatalogFood,
  updateCatalogFood,
  deleteCatalogFood,
  getAdminExercises,
  createExercise,
  updateExercise,
  deleteExercise,
  reseedCatalog,
  optimizeDatabase,
  catalogFoodValidators,
  exerciseValidators,
} = require('../controllers/adminController');

const router = express.Router();

router.use(protect, adminOnly);

router.get('/overview', getOverview);
router.get('/users', getUsers);
router.post('/optimize', optimizeDatabase);
router.post('/seed', reseedCatalog);

router.get('/foods', getAdminFoods);
router.post('/foods', catalogFoodValidators, validate, createCatalogFood);
router.put('/foods/:id', catalogFoodValidators, validate, updateCatalogFood);
router.delete('/foods/:id', deleteCatalogFood);

router.get('/exercises', getAdminExercises);
router.post('/exercises', exerciseValidators, validate, createExercise);
router.put('/exercises/:id', exerciseValidators, validate, updateExercise);
router.delete('/exercises/:id', deleteExercise);

module.exports = router;
