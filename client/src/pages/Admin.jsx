import { useEffect, useState } from 'react';
import FormInput from '../components/FormInput';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import { adminService } from '../services';
import {
  FOOD_CATEGORIES,
  SERVING_UNITS,
  EXERCISE_CATEGORIES,
  MUSCLE_GROUPS,
} from '../utils/helpers';

const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'];

const emptyFood = {
  name: '',
  category: 'Others',
  servingSize: '',
  servingUnit: 'g',
  calories: '',
  protein: '',
  carbs: '',
  fat: '',
};

const emptyExercise = {
  name: '',
  category: 'Strength',
  muscleGroup: 'Full Body',
  difficulty: 'Beginner',
  instructions: '',
};

const Admin = () => {
  const [tab, setTab] = useState('overview');
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [foods, setFoods] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [working, setWorking] = useState(false);

  const [foodModal, setFoodModal] = useState(false);
  const [foodForm, setFoodForm] = useState(emptyFood);
  const [editingFood, setEditingFood] = useState(null);

  const [exerciseModal, setExerciseModal] = useState(false);
  const [exerciseForm, setExerciseForm] = useState(emptyExercise);
  const [editingExercise, setEditingExercise] = useState(null);

  const load = async (nextTab = tab) => {
    setLoading(true);
    setError('');
    try {
      if (nextTab === 'overview') {
        const res = await adminService.overview();
        setOverview(res.data.data);
      } else if (nextTab === 'users') {
        const res = await adminService.users();
        setUsers(res.data.data.users);
      } else if (nextTab === 'foods') {
        const res = await adminService.foods();
        setFoods(res.data.data.foods);
      } else if (nextTab === 'exercises') {
        const res = await adminService.exercises();
        setExercises(res.data.data.exercises);
      } else if (nextTab === 'optimize') {
        const res = await adminService.overview();
        setOverview(res.data.data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(tab);
  }, [tab]);

  const runOptimize = async () => {
    setWorking(true);
    setMessage('');
    setError('');
    try {
      const res = await adminService.optimize();
      setMessage(res.data.data.message);
      await load('optimize');
    } catch (err) {
      setError(err.message);
    } finally {
      setWorking(false);
    }
  };

  const runSeed = async () => {
    if (!window.confirm('Reseed catalog foods and exercises? User logs will stay intact.')) return;
    setWorking(true);
    setMessage('');
    setError('');
    try {
      const res = await adminService.seed();
      setMessage(res.data.data.message);
      await load(tab);
    } catch (err) {
      setError(err.message);
    } finally {
      setWorking(false);
    }
  };

  const saveFood = async (e) => {
    e.preventDefault();
    setWorking(true);
    setError('');
    try {
      const payload = {
        ...foodForm,
        servingSize: Number(foodForm.servingSize),
        calories: Number(foodForm.calories),
        protein: Number(foodForm.protein),
        carbs: Number(foodForm.carbs),
        fat: Number(foodForm.fat),
      };
      if (editingFood) await adminService.updateFood(editingFood._id, payload);
      else await adminService.createFood(payload);
      setFoodModal(false);
      setEditingFood(null);
      setFoodForm(emptyFood);
      await load('foods');
      setMessage(editingFood ? 'Food updated.' : 'Food added to catalog.');
    } catch (err) {
      setError(err.message);
    } finally {
      setWorking(false);
    }
  };

  const saveExercise = async (e) => {
    e.preventDefault();
    setWorking(true);
    setError('');
    try {
      if (editingExercise) await adminService.updateExercise(editingExercise._id, exerciseForm);
      else await adminService.createExercise(exerciseForm);
      setExerciseModal(false);
      setEditingExercise(null);
      setExerciseForm(emptyExercise);
      await load('exercises');
      setMessage(editingExercise ? 'Exercise updated.' : 'Exercise added.');
    } catch (err) {
      setError(err.message);
    } finally {
      setWorking(false);
    }
  };

  const removeFood = async (food) => {
    if (!window.confirm(`Delete ${food.name} from the catalog?`)) return;
    try {
      await adminService.deleteFood(food._id);
      await load('foods');
    } catch (err) {
      setError(err.message);
    }
  };

  const removeExercise = async (exercise) => {
    if (!window.confirm(`Delete ${exercise.name}?`)) return;
    try {
      await adminService.deleteExercise(exercise._id);
      await load('exercises');
    } catch (err) {
      setError(err.message);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'foods', label: 'Food Catalog' },
    { id: 'exercises', label: 'Exercises' },
    { id: 'users', label: 'Users' },
    { id: 'optimize', label: 'Optimize' },
  ];

  return (
    <div className="page-stack">
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Optimization</h1>
          <p className="text-muted mb-0">Manage catalog data, inspect collections, and keep the database healthy.</p>
        </div>
      </div>

      <div className="btn-group range-group flex-wrap">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`btn ${tab === item.id ? 'btn-brand' : 'btn-outline-brand'}`}
            onClick={() => {
              setMessage('');
              setError('');
              setTab(item.id);
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {message && <div className="alert alert-success py-2 mb-0">{message}</div>}
      {error && <div className="alert alert-danger py-2 mb-0">{error}</div>}

      {loading ? (
        <LoadingSpinner label="Loading admin data..." />
      ) : (
        <>
          {tab === 'overview' && overview && (
            <>
              <div className="row g-3">
                {Object.entries({
                  Users: overview.collections.users,
                  Foods: overview.collections.foods,
                  'Custom foods': overview.collections.customFoods,
                  'Food logs': overview.collections.foodLogs,
                  Exercises: overview.collections.exercises,
                  Workouts: overview.collections.workouts,
                  'Health logs': overview.collections.healthLogs,
                }).map(([label, value]) => (
                  <div className="col-6 col-md-3" key={label}>
                    <div className="mini-stat">
                      <span>{label}</span>
                      <strong>{value}</strong>
                    </div>
                  </div>
                ))}
              </div>
              <div className="row g-4">
                <div className="col-lg-6">
                  <div className="panel h-100">
                    <h2 className="h6 mb-3">Most logged foods</h2>
                    {overview.topFoods.length === 0 ? (
                      <p className="text-muted mb-0">No food logs yet.</p>
                    ) : (
                      <ul className="habit-list">
                        {overview.topFoods.map((food) => (
                          <li key={food.name}>
                            <span>{food.name}</span>
                            <strong>
                              {food.count} logs · {food.calories} kcal
                            </strong>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="panel h-100">
                    <h2 className="h6 mb-3">Recent food logs</h2>
                    {overview.recentLogs.length === 0 ? (
                      <p className="text-muted mb-0">No recent logs.</p>
                    ) : (
                      overview.recentLogs.map((log) => (
                        <div key={log._id} className="food-log-item">
                          <div>
                            <p className="mb-0 fw-semibold">{log.foodId?.name || 'Food'}</p>
                            <small className="text-muted">
                              {log.userId?.email} · {log.mealType} · {log.calories} kcal
                            </small>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {tab === 'foods' && (
            <div className="panel">
              <div className="panel-header">
                <h2 className="h6 mb-0">Food catalog</h2>
                <button
                  type="button"
                  className="btn btn-brand btn-sm"
                  onClick={() => {
                    setEditingFood(null);
                    setFoodForm(emptyFood);
                    setFoodModal(true);
                  }}
                >
                  Add Food
                </button>
              </div>
              {foods.length === 0 ? (
                <EmptyState title="No catalog foods" message="Add a food or reseed the catalog." />
              ) : (
                <div className="table-responsive">
                  <table className="table align-middle">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Serving</th>
                        <th>Calories</th>
                        <th>Protein</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {foods.map((food) => (
                        <tr key={food._id}>
                          <td>{food.name}</td>
                          <td>{food.category}</td>
                          <td>
                            {food.servingSize}
                            {food.servingUnit}
                          </td>
                          <td>{food.calories}</td>
                          <td>{food.protein}g</td>
                          <td className="text-end">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-secondary me-2"
                              onClick={() => {
                                setEditingFood(food);
                                setFoodForm({
                                  name: food.name,
                                  category: food.category,
                                  servingSize: food.servingSize,
                                  servingUnit: food.servingUnit,
                                  calories: food.calories,
                                  protein: food.protein,
                                  carbs: food.carbs,
                                  fat: food.fat,
                                });
                                setFoodModal(true);
                              }}
                            >
                              Edit
                            </button>
                            <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removeFood(food)}>
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {tab === 'exercises' && (
            <div className="panel">
              <div className="panel-header">
                <h2 className="h6 mb-0">Exercise library</h2>
                <button
                  type="button"
                  className="btn btn-brand btn-sm"
                  onClick={() => {
                    setEditingExercise(null);
                    setExerciseForm(emptyExercise);
                    setExerciseModal(true);
                  }}
                >
                  Add Exercise
                </button>
              </div>
              {exercises.length === 0 ? (
                <EmptyState title="No exercises" message="Add an exercise or reseed the catalog." />
              ) : (
                <div className="table-responsive">
                  <table className="table align-middle">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Muscle</th>
                        <th>Difficulty</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {exercises.map((exercise) => (
                        <tr key={exercise._id}>
                          <td>{exercise.name}</td>
                          <td>{exercise.category}</td>
                          <td>{exercise.muscleGroup}</td>
                          <td>{exercise.difficulty}</td>
                          <td className="text-end">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-secondary me-2"
                              onClick={() => {
                                setEditingExercise(exercise);
                                setExerciseForm({
                                  name: exercise.name,
                                  category: exercise.category,
                                  muscleGroup: exercise.muscleGroup,
                                  difficulty: exercise.difficulty,
                                  instructions: exercise.instructions,
                                });
                                setExerciseModal(true);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => removeExercise(exercise)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {tab === 'users' && (
            <div className="panel">
              <h2 className="h6 mb-3">Registered users</h2>
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Goal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          <span className="chip">{user.role || 'user'}</span>
                        </td>
                        <td>{user.fitnessGoal}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === 'optimize' && (
            <div className="panel">
              <h2 className="h6 mb-3">Database optimization</h2>
              <p className="text-muted">
                Sync MongoDB indexes, verify required collections, and refresh catalog data if needed.
                Required collections: users, foods, foodlogs, healthlogs, exercises.
              </p>
              {overview && (
                <ul className="habit-list mb-4">
                  <li>
                    <span>users</span>
                    <strong>{overview.collections.users}</strong>
                  </li>
                  <li>
                    <span>foods</span>
                    <strong>{overview.collections.foods + overview.collections.customFoods}</strong>
                  </li>
                  <li>
                    <span>foodlogs</span>
                    <strong>{overview.collections.foodLogs}</strong>
                  </li>
                  <li>
                    <span>healthlogs</span>
                    <strong>{overview.collections.healthLogs}</strong>
                  </li>
                  <li>
                    <span>exercises</span>
                    <strong>{overview.collections.exercises}</strong>
                  </li>
                </ul>
              )}
              <div className="d-flex flex-wrap gap-2">
                <button type="button" className="btn btn-brand" disabled={working} onClick={runOptimize}>
                  {working ? 'Working...' : 'Optimize Indexes'}
                </button>
                <button type="button" className="btn btn-outline-brand" disabled={working} onClick={runSeed}>
                  Reseed Foods & Exercises
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <Modal
        show={foodModal}
        title={editingFood ? 'Edit Catalog Food' : 'Add Catalog Food'}
        onClose={() => setFoodModal(false)}
        size="modal-lg"
      >
        <form onSubmit={saveFood}>
          <div className="row g-2">
            <div className="col-md-6">
              <FormInput label="Food Name" name="name" value={foodForm.name} required onChange={(e) => setFoodForm((p) => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="col-md-6">
              <FormInput label="Category" name="category" as="select" options={FOOD_CATEGORIES} value={foodForm.category} onChange={(e) => setFoodForm((p) => ({ ...p, category: e.target.value }))} />
            </div>
            <div className="col-md-4">
              <FormInput label="Serving Size" name="servingSize" type="number" min="0.1" step="0.1" required value={foodForm.servingSize} onChange={(e) => setFoodForm((p) => ({ ...p, servingSize: e.target.value }))} />
            </div>
            <div className="col-md-4">
              <FormInput label="Unit" name="servingUnit" as="select" options={SERVING_UNITS} value={foodForm.servingUnit} onChange={(e) => setFoodForm((p) => ({ ...p, servingUnit: e.target.value }))} />
            </div>
            <div className="col-md-4">
              <FormInput label="Calories" name="calories" type="number" min="0" step="0.1" required value={foodForm.calories} onChange={(e) => setFoodForm((p) => ({ ...p, calories: e.target.value }))} />
            </div>
            <div className="col-md-4">
              <FormInput label="Protein" name="protein" type="number" min="0" step="0.1" required value={foodForm.protein} onChange={(e) => setFoodForm((p) => ({ ...p, protein: e.target.value }))} />
            </div>
            <div className="col-md-4">
              <FormInput label="Carbs" name="carbs" type="number" min="0" step="0.1" required value={foodForm.carbs} onChange={(e) => setFoodForm((p) => ({ ...p, carbs: e.target.value }))} />
            </div>
            <div className="col-md-4">
              <FormInput label="Fat" name="fat" type="number" min="0" step="0.1" required value={foodForm.fat} onChange={(e) => setFoodForm((p) => ({ ...p, fat: e.target.value }))} />
            </div>
          </div>
          <button type="submit" className="btn btn-brand" disabled={working}>
            {working ? 'Saving...' : 'Save Food'}
          </button>
        </form>
      </Modal>

      <Modal
        show={exerciseModal}
        title={editingExercise ? 'Edit Exercise' : 'Add Exercise'}
        onClose={() => setExerciseModal(false)}
        size="modal-lg"
      >
        <form onSubmit={saveExercise}>
          <div className="row g-2">
            <div className="col-md-6">
              <FormInput label="Name" name="ex-name" value={exerciseForm.name} required onChange={(e) => setExerciseForm((p) => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="col-md-6">
              <FormInput label="Category" name="ex-category" as="select" options={EXERCISE_CATEGORIES} value={exerciseForm.category} onChange={(e) => setExerciseForm((p) => ({ ...p, category: e.target.value }))} />
            </div>
            <div className="col-md-6">
              <FormInput label="Muscle Group" name="ex-muscle" as="select" options={MUSCLE_GROUPS} value={exerciseForm.muscleGroup} onChange={(e) => setExerciseForm((p) => ({ ...p, muscleGroup: e.target.value }))} />
            </div>
            <div className="col-md-6">
              <FormInput label="Difficulty" name="ex-diff" as="select" options={DIFFICULTIES} value={exerciseForm.difficulty} onChange={(e) => setExerciseForm((p) => ({ ...p, difficulty: e.target.value }))} />
            </div>
            <div className="col-12">
              <FormInput label="Instructions" name="ex-ins" as="textarea" rows={3} required value={exerciseForm.instructions} onChange={(e) => setExerciseForm((p) => ({ ...p, instructions: e.target.value }))} />
            </div>
          </div>
          <button type="submit" className="btn btn-brand" disabled={working}>
            {working ? 'Saving...' : 'Save Exercise'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Admin;
