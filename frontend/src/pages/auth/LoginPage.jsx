import { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { dashboardPathByRole } from '../../utils/dashboardPathByRole';
import './LoginPage.css';

function normalizeRole(role = '') {
  return String(role).trim().toLowerCase().replace(/\s+/g, '_');
}

export default function LoginPage() {
  const { login, loading, user, isAuthenticated, dashboardPath } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated && user?.role) {
      navigate(dashboardPath || '/dashboard/member', { replace: true });
    }
  }, [isAuthenticated, user, dashboardPath, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const loggedInUser = await login(form);
      const role = normalizeRole(loggedInUser?.role);
      const fallbackPath = dashboardPathByRole[role] || '/dashboard/member';
      const redirectPath = location.state?.from?.pathname || fallbackPath;

      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-overlay"></div>

      <form className="auth-card" onSubmit={submit}>
        
        {/* FIXED LOGO */}
        <img src="/logo.jpeg" alt="FOCA Logo" className="auth-logo" />

        <div className="auth-heading">
          <span className="auth-badge">FOCA Connect</span>
          <h1>Login to FOCA Connect</h1>
          <p>Welcome back. Sign in to access your church dashboard.</p>
        </div>

        {error && <div className="error-box">{error}</div>}

        <div className="auth-field">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="auth-field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="primary-btn auth-submit-btn" disabled={loading}>
          {loading ? 'Please wait...' : 'Login'}
        </button>

        <p className="auth-switch-text">
          No account yet? <Link to="/register">Create one</Link>
        </p>
      </form>
    </div>
  );
}