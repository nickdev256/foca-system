import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AccessDeniedPage from '../../pages/shared/AccessDeniedPage';

function normalizeRole(role = '') {
  return String(role)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_');
}

export default function ProtectedRoute({ children, roles = [] }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // 🔄 Prevent infinite loading screen
  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={{ marginTop: 10 }}>Checking access...</p>
      </div>
    );
  }

  // 🔒 If no user → redirect to login
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  // 🧠 Normalize user roles safely
  const userRoles = Array.isArray(user.roles)
    ? user.roles.map(normalizeRole)
    : user.role
    ? [normalizeRole(user.role)]
    : [];

  // 🧠 Normalize allowed roles
  const allowedRoles = Array.isArray(roles)
    ? roles.map(normalizeRole)
    : roles
    ? [normalizeRole(roles)]
    : [];

  // 🚀 Super admin always allowed
  if (userRoles.includes('super_admin')) {
    return children;
  }

  // 🔐 If no role restriction → allow access
  if (allowedRoles.length === 0) {
    return children;
  }

  // 🔐 Role check
  const hasAccess = userRoles.some((role) =>
    allowedRoles.includes(role)
  );

  if (!hasAccess) {
    return <AccessDeniedPage />;
  }

  return children;
}

// 🎨 Simple inline styles (removes dependency on broken CSS)
const styles = {
  loadingContainer: {
    height: '60vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'sans-serif',
  },
  spinner: {
    width: 35,
    height: 35,
    border: '4px solid #ccc',
    borderTop: '4px solid #333',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
};