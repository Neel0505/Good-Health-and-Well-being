import { percent } from '../utils/helpers';

const StatCard = ({ icon, label, value, subtext, tone = 'teal' }) => (
  <div className={`stat-card tone-${tone}`}>
    <div className="stat-icon">
      <i className={`bi ${icon}`} />
    </div>
    <div>
      <p className="stat-label mb-1">{label}</p>
      <p className="stat-value mb-0">{value}</p>
      {subtext && <p className="stat-sub mb-0">{subtext}</p>}
    </div>
  </div>
);

export const ProgressCard = ({
  title,
  current,
  target,
  unit,
  icon = 'bi-bar-chart',
  tone = 'teal',
}) => {
  const pct = percent(current, target);
  return (
    <div className={`progress-card tone-${tone}`}>
      <div className="d-flex justify-content-between align-items-start mb-2">
        <div>
          <p className="progress-title mb-1">
            <i className={`bi ${icon} me-2`} />
            {title}
          </p>
          <p className="progress-values mb-0">
            {current} / {target} {unit}
          </p>
        </div>
        <span className="progress-pct">{pct}%</span>
      </div>
      <div className="progress">
        <div
          className="progress-bar"
          role="progressbar"
          style={{ width: `${pct}%` }}
          aria-valuenow={pct}
          aria-valuemin="0"
          aria-valuemax="100"
        />
      </div>
    </div>
  );
};

export default StatCard;
