const EmptyState = ({ icon = 'bi-inbox', title, message, actionLabel, onAction }) => (
  <div className="empty-state text-center py-5 px-3">
    <div className="empty-icon mb-3">
      <i className={`bi ${icon}`} />
    </div>
    <h3 className="h5 mb-2">{title}</h3>
    {message && <p className="text-muted mb-3">{message}</p>}
    {actionLabel && onAction && (
      <button type="button" className="btn btn-brand" onClick={onAction}>
        {actionLabel}
      </button>
    )}
  </div>
);

export default EmptyState;
