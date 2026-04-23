import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { dashboardPathByRole } from '../../utils/dashboardPathByRole';
import './LoginPage.css';

function normalizeRole(role = '') {
  return String(role).trim().toLowerCase().replace(/\s+/g, '_');
}

export default function RegisterPage() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
  });

  const [error, setError] = useState('');

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
      const registeredUser = await register(form);
      const role = normalizeRole(registeredUser?.role);
      const redirectPath = dashboardPathByRole[role] || '/dashboard/member';

      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed. Please try again.');
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
          <h1>Create Member Account</h1>
          <p>Join the platform and stay connected to ministry life at FOCA.</p>
        </div>

        {error && <div className="error-box">{error}</div>}

        <div className="auth-field">
          <label htmlFor="fullName">Full Name</label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="Enter your full name"
            value={form.fullName}
            onChange={handleChange}
            required
            autoComplete="name"
          />
        </div>

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
            autoComplete="email"
          />
        </div>

        <div className="auth-field">
          <label htmlFor="phone">Phone Number</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="Enter your phone number"
            value={form.phone}
            onChange={handleChange}
            required
            autoComplete="tel"
          />
        </div>

        <div className="auth-field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Create your password"
            value={form.password}
            onChange={handleChange}
            required
            autoComplete="new-password"
          />
        </div>

        <button type="submit" className="primary-btn auth-submit-btn" disabled={loading}>
          {loading ? 'Please wait...' : 'Register'}
        </button>

        <p className="auth-switch-text">
          Already registered? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}