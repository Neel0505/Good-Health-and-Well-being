import { useEffect, useState } from 'react';
import FormInput from '../components/FormInput';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Disclaimer from '../components/Disclaimer';
import { healthService } from '../services';

const Health = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ water: '', sleep: '', weight: '', notes: '' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await healthService.list();
      const items = res.data.data.logs;
      setLogs(items);
      const today = items.find((log) => {
        const d = new Date(log.date);
        const now = new Date();
        return d.toDateString() === now.toDateString();
      });
      if (today) {
        setForm({
          water: today.water ?? '',
          sleep: today.sleep ?? '',
          weight: today.weight ?? '',
          notes: today.notes || '',
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const validate = () => {
    const next = {};
    if (form.water === '' || Number(form.water) < 0) next.water = 'Enter a valid water amount';
    if (form.sleep === '' || Number(form.sleep) < 0 || Number(form.sleep) > 24) {
      next.sleep = 'Sleep must be between 0 and 24 hours';
    }
    if (form.weight !== '' && (Number(form.weight) < 20 || Number(form.weight) > 500)) {
      next.weight = 'Weight must be between 20 and 500 kg';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!validate()) return;
    setSaving(true);
    try {
      await healthService.upsert({
        water: Number(form.water),
        sleep: Number(form.sleep),
        weight: form.weight === '' ? null : Number(form.weight),
        notes: form.notes,
      });
      setMessage('Health log saved for today.');
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const removeLog = async (id) => {
    if (!window.confirm('Delete this health log?')) return;
    try {
      await healthService.remove(id);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <LoadingSpinner label="Loading health logs..." />;
  if (error && logs.length === 0) {
    return (
      <EmptyState
        icon="bi-exclamation-triangle"
        title="Unable to load health data"
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
          <h1 className="page-title">Health Habits</h1>
          <p className="text-muted mb-0">Track water, sleep and weight for daily awareness.</p>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-5">
          <div className="panel">
            <h2 className="h6 mb-3">Today&apos;s Log</h2>
            {message && <div className="alert alert-success py-2">{message}</div>}
            {error && <div className="alert alert-danger py-2">{error}</div>}
            <form onSubmit={onSubmit}>
              <FormInput
                label="Water (ml)"
                name="water"
                type="number"
                min="0"
                value={form.water}
                onChange={onChange}
                error={errors.water}
                required
              />
              <FormInput
                label="Sleep (hours)"
                name="sleep"
                type="number"
                min="0"
                max="24"
                step="0.1"
                value={form.sleep}
                onChange={onChange}
                error={errors.sleep}
                required
              />
              <FormInput
                label="Weight (kg)"
                name="weight"
                type="number"
                min="20"
                max="500"
                step="0.1"
                value={form.weight}
                onChange={onChange}
                error={errors.weight}
                helpText="Optional — updates your profile weight when provided"
              />
              <FormInput
                label="Notes"
                name="notes"
                as="textarea"
                rows={2}
                value={form.notes}
                onChange={onChange}
              />
              <button type="submit" className="btn btn-brand" disabled={saving}>
                {saving ? 'Saving...' : 'Save Health Log'}
              </button>
            </form>
          </div>
        </div>
        <div className="col-lg-7">
          <div className="panel">
            <h2 className="h6 mb-3">Recent Entries</h2>
            {logs.length === 0 ? (
              <EmptyState
                icon="bi-droplet"
                title="No health logs yet"
                message="Save today's water, sleep or weight to get started."
              />
            ) : (
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Water</th>
                      <th>Sleep</th>
                      <th>Weight</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log) => (
                      <tr key={log._id}>
                        <td>{new Date(log.date).toLocaleDateString()}</td>
                        <td>{log.water} ml</td>
                        <td>{log.sleep} h</td>
                        <td>{log.weight ? `${log.weight} kg` : '—'}</td>
                        <td className="text-end">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => removeLog(log._id)}
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
        </div>
      </div>

      <Disclaimer compact />
    </div>
  );
};

export default Health;
