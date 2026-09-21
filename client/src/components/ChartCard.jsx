const ChartCard = ({ title, subtitle, children, empty }) => (
  <div className="chart-card h-100">
    <div className="mb-3">
      <h3 className="h6 mb-1">{title}</h3>
      {subtitle && <p className="text-muted small mb-0">{subtitle}</p>}
    </div>
    {empty ? (
      <div className="chart-empty text-muted small">No data available for this period yet.</div>
    ) : (
      <div className="chart-wrap">{children}</div>
    )}
  </div>
);

export default ChartCard;
