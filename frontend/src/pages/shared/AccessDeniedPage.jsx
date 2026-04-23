import { Link } from 'react-router-dom';
import './AccessDeniedPage.css';

export default function AccessDeniedPage() {
  return (
    <section className="access-denied-page">
      <div className="access-denied-card">
        <div className="access-denied-icon">!</div>

        <span className="access-denied-badge">FOCA Connect Security</span>

        <h1>Access Denied</h1>

        <p>
          You do not have permission to open this page. Please contact the
          church administrator or sign in with an account that has the correct
          access rights.
        </p>

        <div className="access-denied-actions">
          <Link to="/login" className="access-btn primary">
            Go to Login
          </Link>

          <Link to="/" className="access-btn secondary">
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
}