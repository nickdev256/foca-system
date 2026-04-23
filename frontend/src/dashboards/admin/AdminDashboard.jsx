import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [summary, setSummary] = useState({
    members: 0,
    visitors: 0,
    events: 0,
    announcements: 0,
    sermons: 0,
    prayers: 0,
    openCounseling: 0,
    activities: [],
    finance: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      setError('');

      try {
        const { data } = await api.get('/dashboard/summary');

        setSummary({
          members: data?.stats?.members ?? 0,
          visitors: data?.stats?.visitors ?? 0,
          events: data?.stats?.events ?? 0,
          announcements: data?.stats?.announcements ?? 0,
          sermons: data?.stats?.sermons ?? 0,
          prayers: data?.stats?.prayers ?? 0,
          openCounseling: data?.stats?.openCounseling ?? 0,
          activities: Array.isArray(data?.activities) ? data.activities : [],
          finance: Array.isArray(data?.finance) ? data.finance : [],
        });
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load admin dashboard.');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const statCards = [
    { label: 'Members', value: summary.members, note: 'Registered members' },
    { label: 'Visitors', value: summary.visitors, note: 'Guest records' },
    { label: 'Events', value: summary.events, note: 'Church programs' },
    { label: 'Announcements', value: summary.announcements, note: 'Church notices' },
    { label: 'Prayer Cases', value: summary.prayers, note: 'Active prayer requests' },
    { label: 'Counseling', value: summary.openCounseling, note: 'Ongoing sessions' },
  ];

  const financeSummary = summary.finance.reduce((acc, item) => {
    if (item?._id) acc[item._id] = item.total || 0;
    return acc;
  }, {});

  return (
    <div className="admin-dashboard-page">

      {/* HERO */}
      <section className="dashboard-hero">
        <div className="dashboard-hero-main">
          <span className="dashboard-badge">FOCA Connect</span>
          <h1>Church Operations Dashboard</h1>
          <p>
            Manage members, visitors, events, announcements and ministry workflows.
          </p>

          <div className="admin-hero-actions">
            <Link to="/dashboard/members">Register Member</Link>
            <Link to="/dashboard/visitors">Add Visitor</Link>
            <Link to="/dashboard/events">Events</Link>
          </div>
        </div>
      </section>

      {/* ERROR */}
      {error && <div className="admin-alert error">{error}</div>}

      {/* STATS */}
      <section className="stats-grid">
        {statCards.map((card) => (
          <div className="stat-card" key={card.label}>
            <h4>{card.label}</h4>
            <strong>{loading ? '...' : card.value}</strong>
            <p>{card.note}</p>
          </div>
        ))}
      </section>

      {/* QUICK ACTIONS */}
      <section className="admin-grid">

        <div className="panel-card">
          <h2>Quick Actions</h2>

          <div className="admin-action-grid">
            <Link to="/dashboard/members">Members</Link>
            <Link to="/dashboard/visitors">Visitors</Link>
            <Link to="/dashboard/events">Events</Link>
            <Link to="/dashboard/announcements">Announcements</Link>
            <Link to="/dashboard/reports">Reports</Link>
            <Link to="/dashboard/prayer">Prayer Desk</Link>
          </div>
        </div>

        {/* ACTIVITY */}
        <div className="panel-card">
          <h2>Recent Activity</h2>

          {loading ? (
            <p>Loading...</p>
          ) : summary.activities.length === 0 ? (
            <p>No activity found.</p>
          ) : (
            summary.activities.map((a, i) => (
              <div key={i}>
                <strong>{a?.actor?.fullName || 'System'}</strong>
                <p>{a?.action || 'Activity'}</p>
              </div>
            ))
          )}
        </div>

      </section>

      {/* FINANCE */}
      <section className="panel-card">
        <h2>Finance Snapshot</h2>

        <div className="finance-grid">
          <div>Tithe: UGX {financeSummary.tithe || 0}</div>
          <div>Offering: UGX {financeSummary.offering || 0}</div>
          <div>Donation: UGX {financeSummary.donation || 0}</div>
          <div>Expense: UGX {financeSummary.expense || 0}</div>
        </div>
      </section>

    </div>
  );
}