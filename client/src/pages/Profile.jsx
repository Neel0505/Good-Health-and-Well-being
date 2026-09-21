import { useEffect, useState } from 'react';
import FormInput from '../components/FormInput';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Disclaimer from '../components/Disclaimer';
import { userService } from '../services';
import { useAuth } from '../context/AuthContext';
import {
  ACTIVITY_LEVELS,
  FITNESS_GOALS,
  GENDERS,
} from '../utils/helpers';

const Profile = () => {
  const { updateUser } = useAuth();
  const [form, setForm] = useState(null);
  const [targets, setTargets] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await userService.getProfile();
        const { user, targets: t } = res.data.data;
        setForm({
          name: user.name || '',
          email: user.email || '',
          age: user.age ?? '',
          gender: user.gender || '',
          height: user.height ?? '',
          weight: user.weight ?? '',
          fitnessGoal: user.fitnessGoal || 'General Fitness',
          activityLevel: user.activityLevel || 'Moderately Active',
          waterTarget: user.waterTarget || 2500,
        });
        setTargets(t);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Name is required';
    if (form.age !== '' && (Number(form.age) < 13 || Number(form.age) > 120)) {
      next.age = 'Age must be between 13 and 120';
    }
    if (form.height !== '' && (Number(form.height) < 50 || Number(form.height) > 300)) {
      next.height = 'Height must be 50–300 cm';
    }
    if (form.weight !== '' && (Number(form.weight) < 20 || Number(form.weight) > 500)) {
      next.weight = 'Weight must be 20–500 kg';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        age: form.age === '' ? null : Number(form.age),
        gender: form.gender || undefined,
        height: form.height === '' ? null : Number(form.height),
        weight: form.weight === '' ? null : Number(form.weight),
        fitnessGoal: form.fitnessGoal,
        activityLevel: form.activityLevel,
        waterTarget: Number(form.waterTarget) || 2500,
      };
      const res = await userService.updateProfile(payload);
      setTargets(res.data.data.targets);
      updateUser(res.data.data.user);
      setMessage('Profile updated successfully.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading profile..." />;
  if (error && !form) {
    return <EmptyState icon="bi-exclamation-triangle" title="Unable to load profile" message={error} />;
  }

  return (
    <div className="page-stack">
      <div className="page-header">
        <div>
          <h1 className="page-title">Profile</h1>
          <p className="text-muted mb-0">Manage your details and fitness goals.</p>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-7">
          <div className="panel">
            {message && <div className="alert alert-success py-2">{message}</div>}
            {error && <div className="alert alert-danger py-2">{error}</div>}
            <form onSubmit={onSubmit}>
              <div className="row g-2">
                <div className="col-md-6">
                  <FormInput
                    label="Name"
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    error={errors.name}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Email</label>
                  <input className="form-control" value={form.email} readOnly />
                  <div className="form-text">Email cannot be changed here.</div>
                </div>
                <div className="col-md-4">
                  <FormInput
                    label="Age"
                    name="age"
                    type="number"
                    min="13"
                    max="120"
                    value={form.age}
                    onChange={onChange}
                    error={errors.age}
                  />
                </div>
                <div className="col-md-4">
                  <FormInput
                    label="Gender"
                    name="gender"
                    as="select"
                    value={form.gender}
                    onChange={onChange}
                    options={[{ value: '', label: 'Select' }, ...GENDERS.map((g) => ({ value: g, label: g }))]}
                  />
                </div>
                <div className="col-md-4">
                  <FormInput
                    label="Height (cm)"
                    name="height"
                    type="number"
                    min="50"
                    max="300"
                    value={form.height}
                    onChange={onChange}
                    error={errors.height}
                  />
                </div>
                <div className="col-md-4">
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
                  />
                </div>
                <div className="col-md-4">
                  <FormInput
                    label="Fitness Goal"
                    name="fitnessGoal"
                    as="select"
                    value={form.fitnessGoal}
                    onChange={onChange}
                    options={FITNESS_GOALS}
                  />
                </div>
                <div className="col-md-4">
                  <FormInput
                    label="Activity Level"
                    name="activityLevel"
                    as="select"
                    value={form.activityLevel}
                    onChange={onChange}
                    options={ACTIVITY_LEVELS}
                  />
                </div>
                <div className="col-md-4">
                  <FormInput
                    label="Water Target (ml)"
                    name="waterTarget"
                    type="number"
                    min="500"
                    value={form.waterTarget}
                    onChange={onChange}
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-brand" disabled={saving}>
                {saving ? 'Saving...' : 'Update Profile'}
              </button>
            </form>
          </div>
        </div>
        <div className="col-lg-5">
          <div className="panel targets-panel">
            <h2 className="h6 mb-3">Estimated Daily Targets</h2>
            {targets ? (
              <>
                <div className="target-item">
                  <span>Daily Calorie Target</span>
                  <strong>{targets.calorieTarget} kcal</strong>
                </div>
                <div className="target-item">
                  <span>Daily Protein Target</span>
                  <strong>{targets.proteinTarget} g</strong>
                </div>
                {targets.bmr && (
                  <p className="small text-muted mt-3 mb-0">
                    Based on Mifflin-St Jeor BMR ({targets.bmr} kcal) and activity adjustment
                    (TDEE {targets.tdee} kcal).
                  </p>
                )}
                {targets.incompleteProfile && (
                  <p className="small text-warning mt-3 mb-0">
                    Add age, height, weight and gender for personalized estimates.
                  </p>
                )}
              </>
            ) : (
              <p className="text-muted mb-0">Targets unavailable.</p>
            )}
          </div>
        </div>
      </div>

      <Disclaimer />
    </div>
  );
};

export default Profile;
