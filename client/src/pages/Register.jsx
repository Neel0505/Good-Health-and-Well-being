import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FormInput from '../components/FormInput';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Full name is required';
    if (!form.email.trim()) next.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email';
    if (!form.password) next.password = 'Password is required';
    else if (form.password.length < 6) next.password = 'Password must be at least 6 characters';
    if (form.confirmPassword !== form.password) next.confirmPassword = 'Passwords do not match';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;
    setSubmitting(true);
    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
      });
      navigate('/app/profile', { replace: true });
    } catch (err) {
      setApiError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="auth-section">
      <div className="container">
        <div className="auth-card">
          <h1 className="h3 mb-1">Create your account</h1>
          <p className="text-muted mb-4">Start tracking nutrition, workouts and health habits.</p>
          {apiError && <div className="alert alert-danger">{apiError}</div>}
          <form onSubmit={onSubmit} noValidate>
            <FormInput
              label="Full Name"
              name="name"
              value={form.name}
              onChange={onChange}
              error={errors.name}
              required
            />
            <FormInput
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              error={errors.email}
              required
            />
            <FormInput
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={onChange}
              error={errors.password}
              helpText="Minimum 6 characters"
              required
            />
            <FormInput
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={onChange}
              error={errors.confirmPassword}
              required
            />
            <button type="submit" className="btn btn-brand w-100" disabled={submitting}>
              {submitting ? 'Creating account...' : 'Register'}
            </button>
          </form>
          <p className="mt-3 mb-0 text-center small">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Register;
