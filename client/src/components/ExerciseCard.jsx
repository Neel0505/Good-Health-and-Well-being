const ExerciseCard = ({ exercise, onSelect }) => (
  <div className="exercise-card h-100">
    <div className="d-flex justify-content-between align-items-start mb-2">
      <h3 className="h6 mb-0">{exercise.name}</h3>
      <span className={`badge difficulty-${exercise.difficulty?.toLowerCase()}`}>
        {exercise.difficulty}
      </span>
    </div>
    <div className="d-flex flex-wrap gap-2 mb-3">
      <span className="chip">{exercise.category}</span>
      <span className="chip chip-muted">{exercise.muscleGroup}</span>
    </div>
    <p className="text-muted small mb-3 exercise-instructions">{exercise.instructions}</p>
    {onSelect && (
      <button type="button" className="btn btn-brand btn-sm w-100" onClick={() => onSelect(exercise)}>
        Log Exercise
      </button>
    )}
  </div>
);

export default ExerciseCard;
