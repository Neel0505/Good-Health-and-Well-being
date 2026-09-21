import { useEffect, useState } from 'react';
import ExerciseCard from '../components/ExerciseCard';
import WorkoutCard from '../components/WorkoutCard';
import Modal from '../components/Modal';
import FormInput from '../components/FormInput';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { exerciseService, workoutService } from '../services';
import { EXERCISE_CATEGORIES, MUSCLE_GROUPS } from '../utils/helpers';

const emptyEntry = (exercise) => ({
  exerciseId: exercise._id,
  name: exercise.name,
  category: exercise.category,
  sets: exercise.category === 'Cardio' || exercise.category === 'Flexibility' ? 0 : 3,
  reps: exercise.category === 'Cardio' || exercise.category === 'Flexibility' ? 0 : 10,
  weight: 0,
  duration: exercise.category === 'Cardio' || exercise.category === 'Flexibility' ? 20 : 0,
  distance: 0,
});

const Workouts = () => {
  const [exercises, setExercises] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [muscleGroup, setMuscleGroup] = useState('All');
  const [builderOpen, setBuilderOpen] = useState(false);
  const [detail, setDetail] = useState(null);
  const [workoutName, setWorkoutName] = useState('My Workout');
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');
  const [entries, setEntries] = useState([]);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [exRes, woRes] = await Promise.all([
        exerciseService.list({ search, category, muscleGroup }),
        workoutService.list(),
      ]);
      setExercises(exRes.data.data.exercises);
      setWorkouts(woRes.data.data.workouts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [search, category, muscleGroup]);

  const startWithExercise = (exercise) => {
    setEntries([emptyEntry(exercise)]);
    setWorkoutName(`${exercise.name} Session`);
    setDuration('');
    setNotes('');
    setFormError('');
    setBuilderOpen(true);
  };

  const addExerciseToBuilder = (exercise) => {
    setEntries((prev) => [...prev, emptyEntry(exercise)]);
    setBuilderOpen(true);
  };

  const updateEntry = (index, field, value) => {
    setEntries((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const removeEntry = (index) => {
    setEntries((prev) => prev.filter((_, i) => i !== index));
  };

  const saveWorkout = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!workoutName.trim()) return setFormError('Workout name is required');
    if (!entries.length) return setFormError('Add at least one exercise');

    for (const entry of entries) {
      const isCardioLike = entry.category === 'Cardio' || entry.category === 'Flexibility';
      if (isCardioLike) {
        if (Number(entry.duration) <= 0 && Number(entry.distance) <= 0) {
          return setFormError(`Add duration or distance for ${entry.name}`);
        }
      } else if (Number(entry.sets) <= 0 || Number(entry.reps) <= 0) {
        return setFormError(`Sets and reps must be positive for ${entry.name}`);
      }
    }

    setSaving(true);
    try {
      await workoutService.create({
        workoutName: workoutName.trim(),
        duration: Number(duration) || 0,
        notes,
        completed: true,
        exercises: entries.map((entry) => ({
          exerciseId: entry.exerciseId,
          sets: Number(entry.sets) || 0,
          reps: Number(entry.reps) || 0,
          weight: Number(entry.weight) || 0,
          duration: Number(entry.duration) || 0,
          distance: Number(entry.distance) || 0,
        })),
      });
      setBuilderOpen(false);
      setEntries([]);
      await load();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteWorkout = async (workout) => {
    if (!window.confirm(`Delete "${workout.workoutName}"?`)) return;
    try {
      await workoutService.remove(workout._id);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading && exercises.length === 0 && workouts.length === 0) {
    return <LoadingSpinner label="Loading workouts..." />;
  }

  if (error && exercises.length === 0) {
    return (
      <EmptyState
        icon="bi-exclamation-triangle"
        title="Unable to load workouts"
        message={error}
        actionLabel="Retry"
        onAction={load}
      />
    );
  }

  return (
    <div className="page-stack">
      <div className="page-header">
        <div>
          <h1 className="page-title">Workouts</h1>
          <p className="text-muted mb-0">Browse exercises and save completed training sessions.</p>
        </div>
        <button
          type="button"
          className="btn btn-brand"
          onClick={() => {
            setEntries([]);
            setWorkoutName('My Workout');
            setBuilderOpen(true);
          }}
        >
          New Workout
        </button>
      </div>

      <div className="panel">
        <div className="row g-2 align-items-end">
          <div className="col-md-5">
            <label className="form-label">Search exercises</label>
            <input
              className="form-control"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Bench press, squat, running..."
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Category</label>
            <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="All">All</option>
              {EXERCISE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label">Muscle Group</label>
            <select
              className="form-select"
              value={muscleGroup}
              onChange={(e) => setMuscleGroup(e.target.value)}
            >
              <option value="All">All</option>
              {MUSCLE_GROUPS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div>
        <h2 className="h5 mb-3">Exercise Library</h2>
        {exercises.length === 0 ? (
          <EmptyState icon="bi-search" title="No exercises found" message="Try another search or filter." />
        ) : (
          <div className="row g-3">
            {exercises.map((exercise) => (
              <div className="col-md-6 col-xl-4" key={exercise._id}>
                <ExerciseCard
                  exercise={exercise}
                  onSelect={builderOpen && entries.length ? addExerciseToBuilder : startWithExercise}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="h5 mb-3">Workout History</h2>
        {workouts.length === 0 ? (
          <EmptyState
            icon="bi-lightning"
            title="Your workout history is empty."
            message="Log your first session from the exercise library."
            actionLabel="Start Your First Workout"
            onAction={() => setBuilderOpen(true)}
          />
        ) : (
          <div className="row g-3">
            {workouts.map((workout) => (
              <div className="col-md-6" key={workout._id}>
                <WorkoutCard workout={workout} onView={setDetail} onDelete={deleteWorkout} />
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        show={builderOpen}
        title="Workout Tracker"
        onClose={() => setBuilderOpen(false)}
        size="modal-lg"
      >
        <form onSubmit={saveWorkout}>
          {formError && <div className="alert alert-danger py-2">{formError}</div>}
          <div className="row g-2">
            <div className="col-md-8">
              <FormInput
                label="Workout Name"
                name="workoutName"
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
                required
              />
            </div>
            <div className="col-md-4">
              <FormInput
                label="Duration (min)"
                name="duration"
                type="number"
                min="0"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
          </div>

          {entries.length === 0 ? (
            <p className="text-muted">Select exercises from the library to add them here.</p>
          ) : (
            entries.map((entry, index) => {
              const cardioLike = entry.category === 'Cardio' || entry.category === 'Flexibility';
              return (
                <div key={`${entry.exerciseId}-${index}`} className="builder-entry mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <strong>{entry.name}</strong>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => removeEntry(index)}
                    >
                      Remove
                    </button>
                  </div>
                  {cardioLike ? (
                    <div className="row g-2">
                      <div className="col-6">
                        <FormInput
                          label="Duration (min)"
                          name={`duration-${index}`}
                          type="number"
                          min="0"
                          value={entry.duration}
                          onChange={(e) => updateEntry(index, 'duration', e.target.value)}
                        />
                      </div>
                      <div className="col-6">
                        <FormInput
                          label="Distance (km)"
                          name={`distance-${index}`}
                          type="number"
                          min="0"
                          step="0.1"
                          value={entry.distance}
                          onChange={(e) => updateEntry(index, 'distance', e.target.value)}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="row g-2">
                      <div className="col-4">
                        <FormInput
                          label="Sets"
                          name={`sets-${index}`}
                          type="number"
                          min="0"
                          value={entry.sets}
                          onChange={(e) => updateEntry(index, 'sets', e.target.value)}
                        />
                      </div>
                      <div className="col-4">
                        <FormInput
                          label="Reps"
                          name={`reps-${index}`}
                          type="number"
                          min="0"
                          value={entry.reps}
                          onChange={(e) => updateEntry(index, 'reps', e.target.value)}
                        />
                      </div>
                      <div className="col-4">
                        <FormInput
                          label="Weight (kg)"
                          name={`weight-${index}`}
                          type="number"
                          min="0"
                          step="0.5"
                          value={entry.weight}
                          onChange={(e) => updateEntry(index, 'weight', e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}

          <FormInput
            label="Notes"
            name="notes"
            as="textarea"
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <button type="submit" className="btn btn-brand" disabled={saving}>
            {saving ? 'Saving...' : 'Complete & Save Workout'}
          </button>
        </form>
      </Modal>

      <Modal show={Boolean(detail)} title={detail?.workoutName || 'Workout'} onClose={() => setDetail(null)}>
        {detail && (
          <div>
            <p className="text-muted">
              {new Date(detail.date).toLocaleString()} · {detail.duration || 0} min
            </p>
            {detail.notes && <p>{detail.notes}</p>}
            <ul className="list-group list-group-flush">
              {detail.exercises.map((ex, idx) => (
                <li key={idx} className="list-group-item px-0">
                  <strong>{ex.exerciseId?.name || 'Exercise'}</strong>
                  <div className="small text-muted">
                    {ex.sets || ex.reps || ex.weight
                      ? `${ex.sets} sets × ${ex.reps} reps @ ${ex.weight} kg`
                      : `${ex.duration || 0} min${ex.distance ? ` · ${ex.distance} km` : ''}`}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Workouts;
