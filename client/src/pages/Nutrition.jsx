import { useCallback, useEffect, useMemo, useState } from 'react';
import FormInput from '../components/FormInput';
import FoodLogCard from '../components/FoodLogCard';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { ProgressCard } from '../components/StatCard';
import Disclaimer from '../components/Disclaimer';
import { foodLogService, foodService, userService } from '../services';
import {
  FOOD_CATEGORIES,
  MEAL_TYPES,
  SERVING_UNITS,
  scaleNutrition,
} from '../utils/helpers';

const Nutrition = () => {
  const [foods, setFoods] = useState([]);
  const [logsData, setLogsData] = useState(null);
  const [targets, setTargets] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [selectedFood, setSelectedFood] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [mealType, setMealType] = useState('Breakfast');
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [editLog, setEditLog] = useState(null);
  const [editQty, setEditQty] = useState('');
  const [showCustom, setShowCustom] = useState(false);
  const [customForm, setCustomForm] = useState({
    name: '',
    category: 'Others',
    servingSize: '',
    servingUnit: 'g',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
  });
  const [customErrors, setCustomErrors] = useState({});

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [foodRes, logRes, profileRes] = await Promise.all([
        foodService.list({ search, category }),
        foodLogService.today(),
        userService.getProfile(),
      ]);
      setFoods(foodRes.data.data.foods);
      setLogsData(logRes.data.data);
      setTargets(profileRes.data.data.targets);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [search, category]);

  useEffect(() => {
    const timer = setTimeout(load, 250);
    return () => clearTimeout(timer);
  }, [load]);

  const preview = useMemo(() => {
    if (!selectedFood || !quantity) return null;
    return scaleNutrition(selectedFood, Number(quantity));
  }, [selectedFood, quantity]);

  const addFood = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!selectedFood) return setFormError('Select a food first');
    if (!quantity || Number(quantity) <= 0) return setFormError('Enter a positive quantity');
    setSaving(true);
    try {
      await foodLogService.create({
        foodId: selectedFood._id,
        quantity: Number(quantity),
        mealType,
      });
      setQuantity('');
      setSelectedFood(null);
      await load();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    if (!editQty || Number(editQty) <= 0) return;
    try {
      await foodLogService.update(editLog._id, { quantity: Number(editQty) });
      setEditLog(null);
      await load();
    } catch (err) {
      setFormError(err.message);
    }
  };

  const removeLog = async (log) => {
    if (!window.confirm(`Remove ${log.foodId?.name}?`)) return;
    try {
      await foodLogService.remove(log._id);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const submitCustom = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!customForm.name.trim()) errs.name = 'Name is required';
    ['servingSize', 'calories', 'protein', 'carbs', 'fat'].forEach((field) => {
      if (customForm[field] === '' || Number(customForm[field]) < 0) {
        errs[field] = 'Enter a valid non-negative number';
      }
    });
    if (Number(customForm.servingSize) <= 0) errs.servingSize = 'Serving size must be positive';
    setCustomErrors(errs);
    if (Object.keys(errs).length) return;

    try {
      const res = await foodService.createCustom({
        ...customForm,
        servingSize: Number(customForm.servingSize),
        calories: Number(customForm.calories),
        protein: Number(customForm.protein),
        carbs: Number(customForm.carbs),
        fat: Number(customForm.fat),
      });
      setShowCustom(false);
      setSelectedFood(res.data.data.food);
      setQuantity(String(res.data.data.food.servingSize));
      await load();
    } catch (err) {
      setCustomErrors({ name: err.message });
    }
  };

  if (loading && !logsData) return <LoadingSpinner label="Loading nutrition..." />;
  if (error && !logsData) {
    return (
      <EmptyState
        icon="bi-exclamation-triangle"
        title="Unable to load nutrition"
        message={error}
        actionLabel="Retry"
        onAction={load}
      />
    );
  }

  const totals = logsData?.totals || { calories: 0, protein: 0, carbs: 0, fat: 0 };
  const grouped = logsData?.grouped || {};

  return (
    <div className="page-stack">
      <div className="page-header">
        <div>
          <h1 className="page-title">Nutrition</h1>
          <p className="text-muted mb-0">Search foods, log meals, and track daily targets.</p>
        </div>
        <button type="button" className="btn btn-outline-brand" onClick={() => setShowCustom(true)}>
          Add Custom Food
        </button>
      </div>

      {targets && (
        <div className="row g-3">
          <div className="col-md-6">
            <ProgressCard
              title="Daily Calories"
              current={totals.calories}
              target={targets.calorieTarget}
              unit="kcal"
            />
          </div>
          <div className="col-md-6">
            <ProgressCard
              title="Daily Protein"
              current={totals.protein}
              target={targets.proteinTarget}
              unit="g"
              tone="amber"
            />
          </div>
        </div>
      )}

      <div className="row g-4">
        <div className="col-lg-5">
          <div className="panel">
            <h2 className="h6 mb-3">Food Search</h2>
            <div className="row g-2 mb-3">
              <div className="col-7">
                <input
                  className="form-control"
                  placeholder="Search foods..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="col-5">
                <select
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="All">All</option>
                  {FOOD_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="food-results">
              {foods.length === 0 ? (
                <p className="text-muted small mb-0">No foods found.</p>
              ) : (
                foods.map((food) => (
                  <button
                    type="button"
                    key={food._id}
                    className={`food-result ${selectedFood?._id === food._id ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedFood(food);
                      setQuantity(String(food.servingSize));
                      setFormError('');
                    }}
                  >
                    <span className="fw-semibold">{food.name}</span>
                    <small className="text-muted">
                      {food.calories} kcal · {food.protein}g protein / {food.servingSize}
                      {food.servingUnit}
                    </small>
                  </button>
                ))
              )}
            </div>

            <p className="form-text mt-2 mb-0">
              Nutritional values are approximate and may vary by brand and preparation.
            </p>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="panel mb-4">
            <h2 className="h6 mb-3">Log Food</h2>
            {formError && <div className="alert alert-danger py-2">{formError}</div>}
            <form onSubmit={addFood}>
              <p className="mb-2">
                Selected:{' '}
                <strong>{selectedFood ? selectedFood.name : 'None'}</strong>
              </p>
              <div className="row g-2">
                <div className="col-md-4">
                  <FormInput
                    label="Quantity"
                    name="quantity"
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <FormInput
                    label="Meal Type"
                    name="mealType"
                    as="select"
                    value={mealType}
                    onChange={(e) => setMealType(e.target.value)}
                    options={MEAL_TYPES}
                  />
                </div>
                <div className="col-md-4 d-flex align-items-end mb-3">
                  <button type="submit" className="btn btn-brand w-100" disabled={saving}>
                    {saving ? 'Adding...' : 'Add to Log'}
                  </button>
                </div>
              </div>
              {preview && (
                <div className="preview-box">
                  <span>{preview.calories} kcal</span>
                  <span>{preview.protein}g protein</span>
                  <span>{preview.carbs}g carbs</span>
                  <span>{preview.fat}g fat</span>
                </div>
              )}
            </form>
          </div>

          <div className="panel">
            <h2 className="h6 mb-3">Today&apos;s Food Log</h2>
            {MEAL_TYPES.map((meal) => (
              <div key={meal} className="meal-group mb-3">
                <h3 className="meal-title">{meal === 'Snack' ? 'Snacks' : meal}</h3>
                {(grouped[meal] || []).length === 0 ? (
                  <p className="text-muted small mb-0">No items logged.</p>
                ) : (
                  grouped[meal].map((log) => (
                    <FoodLogCard
                      key={log._id}
                      log={log}
                      onEdit={(item) => {
                        setEditLog(item);
                        setEditQty(String(item.quantity));
                      }}
                      onDelete={removeLog}
                    />
                  ))
                )}
              </div>
            ))}
            <div className="totals-bar">
              <span>Total Calories: <strong>{totals.calories}</strong></span>
              <span>Protein: <strong>{totals.protein}g</strong></span>
              <span>Carbs: <strong>{totals.carbs}g</strong></span>
              <span>Fat: <strong>{totals.fat}g</strong></span>
            </div>
          </div>
        </div>
      </div>

      <Disclaimer compact />

      <Modal show={Boolean(editLog)} title="Edit Quantity" onClose={() => setEditLog(null)}>
        <form onSubmit={saveEdit}>
          <FormInput
            label="Quantity"
            name="editQty"
            type="number"
            min="0.1"
            step="0.1"
            value={editQty}
            onChange={(e) => setEditQty(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-brand">
            Save Changes
          </button>
        </form>
      </Modal>

      <Modal show={showCustom} title="Add Custom Food" onClose={() => setShowCustom(false)} size="modal-lg">
        <form onSubmit={submitCustom}>
          <div className="row g-2">
            <div className="col-md-6">
              <FormInput
                label="Food Name"
                name="name"
                value={customForm.name}
                onChange={(e) => setCustomForm((p) => ({ ...p, name: e.target.value }))}
                error={customErrors.name}
                required
              />
            </div>
            <div className="col-md-6">
              <FormInput
                label="Category"
                name="category"
                as="select"
                value={customForm.category}
                onChange={(e) => setCustomForm((p) => ({ ...p, category: e.target.value }))}
                options={FOOD_CATEGORIES}
              />
            </div>
            <div className="col-md-4">
              <FormInput
                label="Serving Size"
                name="servingSize"
                type="number"
                min="0.1"
                step="0.1"
                value={customForm.servingSize}
                onChange={(e) => setCustomForm((p) => ({ ...p, servingSize: e.target.value }))}
                error={customErrors.servingSize}
                required
              />
            </div>
            <div className="col-md-4">
              <FormInput
                label="Serving Unit"
                name="servingUnit"
                as="select"
                value={customForm.servingUnit}
                onChange={(e) => setCustomForm((p) => ({ ...p, servingUnit: e.target.value }))}
                options={SERVING_UNITS}
              />
            </div>
            <div className="col-md-4">
              <FormInput
                label="Calories"
                name="calories"
                type="number"
                min="0"
                step="0.1"
                value={customForm.calories}
                onChange={(e) => setCustomForm((p) => ({ ...p, calories: e.target.value }))}
                error={customErrors.calories}
                required
              />
            </div>
            <div className="col-md-4">
              <FormInput
                label="Protein (g)"
                name="protein"
                type="number"
                min="0"
                step="0.1"
                value={customForm.protein}
                onChange={(e) => setCustomForm((p) => ({ ...p, protein: e.target.value }))}
                error={customErrors.protein}
                required
              />
            </div>
            <div className="col-md-4">
              <FormInput
                label="Carbohydrates (g)"
                name="carbs"
                type="number"
                min="0"
                step="0.1"
                value={customForm.carbs}
                onChange={(e) => setCustomForm((p) => ({ ...p, carbs: e.target.value }))}
                error={customErrors.carbs}
                required
              />
            </div>
            <div className="col-md-4">
              <FormInput
                label="Fat (g)"
                name="fat"
                type="number"
                min="0"
                step="0.1"
                value={customForm.fat}
                onChange={(e) => setCustomForm((p) => ({ ...p, fat: e.target.value }))}
                error={customErrors.fat}
                required
              />
            </div>
          </div>
          <button type="submit" className="btn btn-brand">
            Save Custom Food
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Nutrition;
