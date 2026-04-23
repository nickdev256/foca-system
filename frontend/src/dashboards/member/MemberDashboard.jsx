import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import DashboardSidebar from '../../components/layout/DashboardSidebar';
import './MemberDashboard.css';

export default function MemberDashboard() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);

  const [data, setData] = useState({
    events: [],
    announcements: [],
  });

  // ✅ SIMPLIFIED STATE
  const [prayer, setPrayer] = useState('');
  const [counseling, setCounseling] = useState('');
  const [giving, setGiving] = useState({ amount: '', message: '' });

  const name = useMemo(
    () => user?.fullName || user?.name || 'Member',
    [user]
  );

  /* =========================
     LOAD DASHBOARD DATA
  ========================= */
  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/dashboard/summary');

        setData({
          events: res.data?.upcomingEvents || [],
          announcements: res.data?.recentAnnouncements || [],
        });
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  /* =========================
     PRAYER REQUEST
  ========================= */
  const sendPrayer = async () => {
    try {
      if (!prayer.trim()) {
        alert('Please enter a prayer request');
        return;
      }

      await api.post('/prayer', {
        request: prayer, // ✅ FIXED
        sentTo: ['pastor', 'admin'],
      });

      alert('Prayer request sent successfully');
      setPrayer('');
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to send prayer request');
    }
  };

  /* =========================
     COUNSELING REQUEST
  ========================= */
  const sendCounseling = async () => {
    try {
      if (!counseling.trim()) {
        alert('Please describe your counseling need');
        return;
      }

      await api.post('/counseling', {
        topic: counseling, // ✅ FIXED
        sentTo: ['pastor', 'admin'],
      });

      alert('Counseling request sent');
      setCounseling('');
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to send counseling request');
    }
  };

  /* =========================
     GIVING
  ========================= */
  const sendGiving = async () => {
    try {
      if (!giving.amount) {
        alert('Please enter amount');
        return;
      }

      await api.post('/donations', {
        amount: giving.amount,
        message: giving.message,
        sentTo: ['finance'],
      });

      alert('Donation sent successfully');
      setGiving({ amount: '', message: '' });
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to send donation');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>

      {/* SIDEBAR */}
      <DashboardSidebar />

      {/* MAIN */}
      <div className="member-dashboard" style={{ flex: 1 }}>

        {/* HERO */}
        <div className="member-hero">
          <h1>Welcome, {name}</h1>
          <p>FOCA Connect Member Portal</p>
        </div>

        {/* EVENTS */}
        <div className="member-section">
          <h2>Upcoming Events</h2>

          {loading ? (
            <p>Loading...</p>
          ) : data.events.length ? (
            data.events.map(e => (
              <div key={e._id} className="card">
                <strong>{e.title}</strong>
                <p>{e.date}</p>
                <p>{e.description}</p>
              </div>
            ))
          ) : (
            <p>No upcoming events</p>
          )}
        </div>

        {/* ANNOUNCEMENTS */}
        <div className="member-section">
          <h2>Announcements</h2>

          {data.announcements.length ? (
            data.announcements.map(a => (
              <div key={a._id} className="card">
                <strong>{a.title}</strong>
                <p>{a.content}</p>
              </div>
            ))
          ) : (
            <p>No announcements</p>
          )}
        </div>

        {/* PRAYER */}
        <div className="member-section">
          <h2>Send Prayer Request</h2>

          <textarea
            placeholder="Write your prayer request..."
            value={prayer}
            onChange={(e) => setPrayer(e.target.value)}
          />

          <button onClick={sendPrayer}>
            Send to Pastor & Admin
          </button>
        </div>

        {/* COUNSELING */}
        <div className="member-section">
          <h2>Request Counseling</h2>

          <textarea
            placeholder="Describe your counseling need..."
            value={counseling}
            onChange={(e) => setCounseling(e.target.value)}
          />

          <button onClick={sendCounseling}>
            Send Counseling Request
          </button>
        </div>

        {/* GIVING */}
        <div className="member-section">
          <h2>Online Giving</h2>

          <input
            type="number"
            placeholder="Amount"
            value={giving.amount}
            onChange={(e) =>
              setGiving({ ...giving, amount: e.target.value })
            }
          />

          <textarea
            placeholder="Message (optional)"
            value={giving.message}
            onChange={(e) =>
              setGiving({ ...giving, message: e.target.value })
            }
          />

          <button onClick={sendGiving}>
            Send to Finance
          </button>
        </div>

      </div>
    </div>
  );
}