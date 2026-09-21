const FoodLogCard = ({ log, onEdit, onDelete }) => (
  <div className="food-log-item">
    <div>
      <p className="mb-0 fw-semibold">{log.foodId?.name || 'Food'}</p>
      <small className="text-muted">
        {log.quantity} {log.foodId?.servingUnit || 'units'} · {log.calories} kcal · {log.protein}g
        protein
      </small>
    </div>
    <div className="d-flex gap-2">
      {onEdit && (
        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => onEdit(log)}>
          Edit
        </button>
      )}
      {onDelete && (
        <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => onDelete(log)}>
          Delete
        </button>
      )}
    </div>
  </div>
);

export default FoodLogCard;
