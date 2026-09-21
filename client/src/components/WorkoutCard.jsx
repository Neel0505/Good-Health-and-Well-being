const WorkoutCard = ({ workout, onView, onDelete }) => (
  <div className="workout-card">
    <div className="d-flex justify-content-between align-items-start">
      <div>
        <h3 className="h6 mb-1">{workout.workoutName}</h3>
        <p className="text-muted small mb-2">
          {new Date(workout.date).toLocaleDateString()} · {workout.exercises?.length || 0} exercises
          {workout.duration ? ` · ${workout.duration} min` : ''}
        </p>
        <div className="d-flex flex-wrap gap-1">
          {(workout.exercises || []).slice(0, 4).map((ex, idx) => (
            <span key={idx} className="chip chip-muted">
              {ex.exerciseId?.name || 'Exercise'}
            </span>
          ))}
        </div>
      </div>
      <span className={`badge ${workout.completed ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'}`}>
        {workout.completed ? 'Completed' : 'Draft'}
      </span>
    </div>
    <div className="d-flex gap-2 mt-3">
      {onView && (
        <button type="button" className="btn btn-sm btn-outline-brand" onClick={() => onView(workout)}>
          Details
        </button>
      )}
      {onDelete && (
        <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => onDelete(workout)}>
          Delete
        </button>
      )}
    </div>
  </div>
);

export default WorkoutCard;
