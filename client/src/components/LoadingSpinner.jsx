const LoadingSpinner = ({ label = 'Loading...' }) => (
  <div className="loading-state text-center py-5" role="status" aria-live="polite">
    <div className="spinner-border text-brand" />
    <p className="mt-3 text-muted mb-0">{label}</p>
  </div>
);

export default LoadingSpinner;
