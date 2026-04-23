import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './AnnouncementsPage.css';

export default function AnnouncementsPage() {
  const { user } = useAuth();

  const role = user?.role || 'member';

  const canCreate = role === 'admin' || role === 'pastor' || role === 'super_admin';

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState('all');

  const [form, setForm] = useState({
    title: '',
    audience: 'all',
    body: '',
  });

  // LOAD DATA
  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/announcements');
        setAnnouncements(res.data || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // FILTER VIEW
  const filtered = useMemo(() => {
    if (filter === 'all') return announcements;

    return announcements.filter(
      (a) => a.audience === filter || a.audience === 'all'
    );
  }, [announcements, filter]);

  // CREATE ANNOUNCEMENT (ONLY ADMIN / PASTOR)
  const createAnnouncement = async () => {
    try {
      await api.post('/announcements', form);

      const res = await api.get('/announcements');
      setAnnouncements(res.data || []);

      setForm({ title: '', audience: 'all', body: '' });
    } catch (err) {
      alert('Failed to create announcement');
    }
  };

  return (
    <div className="announcements-page">

      {/* HERO */}
      <div className="announcements-hero">
        <h1>Church Announcements</h1>
        <p>
          {canCreate
            ? 'Create and manage announcements for your ministry'
            : 'Stay updated with church announcements'}
        </p>
      </div>

      {/* FILTERS (ALL ROLES) */}
      <div className="announcement-filters">
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('member')}>Members</button>
        <button onClick={() => setFilter('ministry')}>Ministry</button>
        <button onClick={() => setFilter('pastor')}>Pastor</button>
      </div>

      {/* CREATE FORM (ONLY ADMIN + PASTOR) */}
      {canCreate && (
        <div className="announcement-form">
          <h2>Create Announcement</h2>

          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
          />

          <select
            value={form.audience}
            onChange={(e) =>
              setForm({ ...form, audience: e.target.value })
            }
          >
            <option value="all">All</option>
            <option value="member">Members</option>
            <option value="ministry">Ministry</option>
            <option value="pastor">Pastor</option>
          </select>

          <textarea
            placeholder="Message"
            value={form.body}
            onChange={(e) =>
              setForm({ ...form, body: e.target.value })
            }
          />

          <button onClick={createAnnouncement}>
            Publish Announcement
          </button>
        </div>
      )}

      {/* VIEW ONLY (EVERYONE) */}
      <div className="announcement-list">

        {loading ? (
          <p>Loading...</p>
        ) : filtered.length ? (
          filtered.map((a) => (
            <div key={a._id} className="announcement-card">
              <h3>{a.title}</h3>
              <p>{a.body}</p>
              <small>Audience: {a.audience}</small>
            </div>
          ))
        ) : (
          <p>No announcements found</p>
        )}

      </div>

    </div>
  );
}