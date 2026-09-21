import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import FormInput from '../components/FormInput';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const validate = () => {
    const next = {};
    if (!form.email.trim()) next.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email';
    if (!form.password) next.password = 'Password is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;
    setSubmitting(true);
    try {
      await login(form.email.trim(), form.password);
      const redirectTo = location.state?.from || '/app/dashboard';
      navigate(redirectTo, { replace: true });
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
          <h1 className="h3 mb-1">Welcome back</h1>
          <p className="text-muted mb-4">Log in to continue tracking your health progress.</p>
          {apiError && <div className="alert alert-danger">{apiError}</div>}
          <form onSubmit={onSubmit} noValidate>
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
              required
            />
            <button type="submit" className="btn btn-brand w-100" disabled={submitting}>
              {submitting ? 'Signing in...' : 'Login'}
            </button>
          </form>
          <p className="mt-3 mb-0 text-center small">
            New to FitTrack? <Link to="/register">Create an account</Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;
