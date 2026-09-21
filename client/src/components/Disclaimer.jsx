import { DISCLAIMER } from '../utils/helpers';

const Disclaimer = ({ compact = false }) => (
  <div className={`disclaimer ${compact ? 'disclaimer-compact' : ''}`}>
    <i className="bi bi-info-circle me-2" />
    <span>{DISCLAIMER}</span>
  </div>
);

export default Disclaimer;
