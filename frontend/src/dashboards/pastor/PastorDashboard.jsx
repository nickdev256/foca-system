import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import DashboardSidebar from '../../components/layout/DashboardSidebar';
import './PastorDashboard.css';

export default function PastorDashboard() {
  const [summary, setSummary] = useState({
    members: 0,
    prayers: 0,
    counseling: 0,
    events: 0,
    announcements: 0,
  });

  const [prayers, setPrayers] = useState([]);
  const [counseling, setCounseling] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  /* =========================
     LOAD DATA
  ========================= */
  const load = async () => {
    setLoading(true);
    setError('');

    try {
      const [summaryRes, prayerRes, counselingRes] = await Promise.all([
        api.get('/dashboard/summary'),
        api.get('/prayer/incoming'),
        api.get('/counseling/incoming'),
      ]);

      setSummary({
        members: summaryRes.data?.stats?.members ?? 0,
        prayers: summaryRes.data?.stats?.prayers ?? 0,
        counseling: summaryRes.data?.stats?.counseling ?? 0,
        events: summaryRes.data?.stats?.events ?? 0,
        announcements: summaryRes.data?.stats?.announcements ?? 0,
      });

      setPrayers(prayerRes.data || []);
      setCounseling(counselingRes.data || []);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Failed to load pastoral dashboard.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  /* =========================
     UPDATE PRAYER STATUS
  ========================= */
  const updatePrayerStatus = async (id, status) => {
    try {
      await api.put(`/prayer/${id}`, { status });
      load(); // refresh
    } catch (err) {
      alert('Failed to update prayer');
    }
  };

  /* =========================
     UPDATE COUNSELING STATUS
  ========================= */
  const updateCounselingStatus = async (id, status) => {
    try {
      await api.put(`/counseling/${id}`, { status });
      load();
    } catch (err) {
      alert('Failed to update counseling');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <DashboardSidebar />

      <div className="dashboard-page pastor-dashboard-page" style={{ flex: 1 }}>

        {/* HERO */}
        <section className="dashboard-hero">
          <div className="dashboard-hero-main pastor-hero-main">
            <span className="dashboard-badge">FOCA Connect</span>
            <h1>Pastoral Control Center</h1>
            <p>Manage member care and ministry in one place.</p>

            <div className="pastor-hero-actions">
              <Link to="/dashboard/members" className="primary-btn">
                View Members
              </Link>
              <Link to="/dashboard/prayer" className="pastor-secondary-btn">
                Prayer Desk
              </Link>
              <Link to="/dashboard/counseling" className="pastor-secondary-btn">
                Counseling
              </Link>
            </div>
          </div>
        </section>

        {/* ERROR */}
        {error && <div className="pastor-alert error">{error}</div>}

        {/* STATS */}
        <section className="stats-grid">
          {["Members", "Prayer Requests", "Counseling", "Events"].map((label, i) => {
            const keys = ["members", "prayers", "counseling", "events"];
            return (
              <div className="stat-card" key={label}>
                <h4>{label}</h4>
                <strong>{loading ? "..." : summary[keys[i]]}</strong>
              </div>
            );
          })}
        </section>

        {/* PRAYER REQUESTS */}
        <section className="panel">
          <h2>🙏 Incoming Prayer Requests</h2>

          {loading ? (
            <p>Loading...</p>
          ) : prayers.length === 0 ? (
            <p>No prayer requests</p>
          ) : (
            prayers.map((p) => (
              <div key={p._id} className="item">
                <p>{p.request}</p>
                <small>Status: {p.status}</small>

                <div className="actions">
                  <button onClick={() => updatePrayerStatus(p._id, 'reviewed')}>
                    Review
                  </button>

                  <button onClick={() => updatePrayerStatus(p._id, 'in_prayer')}>
                    Start Praying
                  </button>

                  <button onClick={() => updatePrayerStatus(p._id, 'closed')}>
                    Close
                  </button>
                </div>
              </div>
            ))
          )}
        </section>

        {/* COUNSELING */}
        <section className="panel">
          <h2>💬 Counseling Requests</h2>

          {loading ? (
            <p>Loading...</p>
          ) : counseling.length === 0 ? (
            <p>No counseling requests</p>
          ) : (
            counseling.map((c) => (
              <div key={c._id} className="item">
                <p>{c.topic || c.notes}</p>
                <small>Status: {c.status}</small>

                <div className="actions">
                  <button onClick={() => updateCounselingStatus(c._id, 'reviewed')}>
                    Review
                  </button>

                  <button onClick={() => updateCounselingStatus(c._id, 'open')}>
                    Start Session
                  </button>

                  <button onClick={() => updateCounselingStatus(c._id, 'closed')}>
                    Close
                  </button>
                </div>
              </div>
            ))
          )}
        </section>

      </div>
    </div>
  );
}