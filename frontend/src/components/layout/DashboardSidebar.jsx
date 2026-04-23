import { useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getSidebarItems } from '../../utils/sidebarItems';
import './DashboardSidebar.css';

export default function DashboardSidebar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  // ✅ safer role handling
  const role = useMemo(() => {
    return (user?.role || 'member').toLowerCase();
  }, [user]);

  // ✅ get role-based sidebar items
  const items = useMemo(() => getSidebarItems(role), [role]);

  const roleLabel = useMemo(() => {
    return role.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }, [role]);

  const closeSidebar = () => setOpen(false);

  const handleLogout = () => {
    logout();
    closeSidebar();
  };

  return (
    <>
      {/* Toggle (mobile) */}
      <button
        className="sidebar-toggle"
        onClick={() => setOpen(true)}
        aria-label="Open sidebar"
      >
        ☰
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="sidebar-backdrop"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${open ? 'open' : ''}`}>

        {/* Top */}
        <div className="sidebar-top">
          <button className="sidebar-close" onClick={closeSidebar}>
            ×
          </button>

          <div className="sidebar-brand">
            <img
              src="/logo.jpeg"
              alt="FOCA Logo"
              className="sidebar-logo"
            />

            <div className="sidebar-brand-text">
              <h2>FOCA Connect</h2>
              <p>{roleLabel}</p>
            </div>
          </div>

          <div className="sidebar-user-card">
            <span className="sidebar-user-label">Signed in as</span>
            <h3>{user?.fullName || user?.name || 'User'}</h3>
            <p>{user?.email || 'No email available'}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <div className="sidebar-nav-title">Navigation</div>

          {items.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              onClick={closeSidebar}
              className={({ isActive }) =>
                isActive ? 'sidebar-link active' : 'sidebar-link'
              }
            >
              <span className="sidebar-link-dot" />
              <span className="sidebar-link-text">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="sidebar-footer-card">
            <p>Manage ministry operations with clarity and excellence.</p>

            <button
              className="sidebar-logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>

      </aside>
    </>
  );
}