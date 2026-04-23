import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import './MediaDashboard.css';

export default function MediaDashboard() {
  const [summary, setSummary] = useState({
    sermons: 0,
    announcements: 0,
    events: 0,
    activities: 0,
    pendingMediaRequests: 0,
    scheduledContent: 0,
    upcomingLivestreams: 0,
    mediaAssets: 0,
    completedMediaRequests: 0,
    recentSermons: [],
    recentMediaRequests: [],
    recentSchedules: [],
    recentLivestreams: [],
    recentAssets: [],
    activityFeed: [],
    mediaNotes: [],
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
          sermons: data?.stats?.sermons ?? 0,
          announcements: data?.stats?.announcements ?? 0,
          events: data?.stats?.events ?? 0,
          activities: data?.stats?.activities ?? 0,
          pendingMediaRequests: data?.stats?.pendingMediaRequests ?? 0,
          scheduledContent: data?.stats?.scheduledContent ?? 0,
          upcomingLivestreams: data?.stats?.upcomingLivestreams ?? 0,
          mediaAssets: data?.stats?.mediaAssets ?? 0,
          completedMediaRequests: data?.stats?.completedMediaRequests ?? 0,
          recentSermons: Array.isArray(data?.recentSermons) ? data.recentSermons : [],
          recentMediaRequests: Array.isArray(data?.recentMediaRequests) ? data.recentMediaRequests : [],
          recentSchedules: Array.isArray(data?.recentSchedules) ? data.recentSchedules : [],
          recentLivestreams: Array.isArray(data?.recentLivestreams) ? data.recentLivestreams : [],
          recentAssets: Array.isArray(data?.recentAssets) ? data.recentAssets : [],
          activityFeed: Array.isArray(data?.activities) ? data.activities : [],
          mediaNotes: Array.isArray(data?.mediaNotes) ? data.mediaNotes : [],
        });
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load media dashboard.');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const stats = [
    { label: 'Sermons', value: summary.sermons, note: 'Archived sermons and messages' },
    { label: 'Announcements', value: summary.announcements, note: 'Communication items and notices' },
    { label: 'Events', value: summary.events, note: 'Programs needing media visibility' },
    { label: 'Pending Requests', value: summary.pendingMediaRequests, note: 'Media work awaiting action' },
    { label: 'Scheduled Content', value: summary.scheduledContent, note: 'Planned posts and content releases' },
    { label: 'Livestreams', value: summary.upcomingLivestreams, note: 'Planned and ready broadcasts' },
    { label: 'Media Assets', value: summary.mediaAssets, note: 'Files stored in media library' },
    { label: 'Completed Requests', value: summary.completedMediaRequests, note: 'Finished media assignments' },
  ];

  const requestTypeLabel = (value) =>
    String(value || 'request')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());

  const statusLabel = (value) =>
    String(value || 'pending')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <div className="dashboard-page media-dashboard-page">

      <section className="dashboard-hero">
        <div className="dashboard-hero-main media-hero-main">
          <span className="dashboard-badge">FOCA Connect</span>
          <h1>Media & Communication Dashboard</h1>
          <p>
            Handle church communication, sermon media, design work, content scheduling,
            livestream readiness, and digital ministry visibility.
          </p>

          <div className="media-hero-actions">
            <Link to="/dashboard/sermons" className="primary-btn">
              Upload Sermon
            </Link>
            <Link to="/dashboard/announcements" className="media-secondary-btn">
              Create Announcement
            </Link>
            <Link to="/dashboard/events" className="media-secondary-btn">
              Event Coverage
            </Link>
          </div>
        </div>
      </section>

      {error && <div className="media-alert error">{error}</div>}

      <section className="media-stats-grid">
        {stats.map((card) => (
          <article className="stat-card media-stat-card" key={card.label}>
            <h4>{card.label}</h4>
            <strong>{loading ? '...' : card.value}</strong>
            <p>{card.note}</p>
          </article>
        ))}
      </section>

    </div>
  );
}