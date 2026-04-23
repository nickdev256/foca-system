import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import DashboardSidebar from '../../components/layout/DashboardSidebar';
import {
  FaUsers,
  FaUserShield,
  FaChurch,
  FaCalendarAlt,
  FaPrayingHands,
  FaMoneyBillWave,
  FaChartBar,
  FaBullhorn,
  FaCog,
  FaShieldAlt,
  FaExclamationTriangle,
  FaGlobe,
  FaUserFriends,
  FaArrowRight,
  FaHeart,
  FaBroadcastTower,
  FaUserCheck,
  FaDatabase,
  FaClipboardList,
  FaBell,
} from 'react-icons/fa';
import './SuperAdminDashboard.css';

const privilegeGroups = [
  {
    title: 'User & Access Control',
    items: [
      'Create and manage all users',
      'Assign and change roles',
      'Activate or suspend accounts',
      'Oversee platform-wide access',
    ],
  },
  {
    title: 'Church Operations Control',
    items: [
      'Manage members and visitors',
      'Monitor events and communication',
      'Oversee sermons and announcements',
      'Supervise prayer and counseling flow',
    ],
  },
  {
    title: 'Executive Oversight',
    items: [
      'Access finance and budget functions',
      'Open full reports and analytics',
      'Monitor key activity across modules',
      'Control the whole FOCA system direction',
    ],
  },
];

const controlCards = [
  {
    title: 'User & Role Management',
    icon: <FaUserShield />,
    text: 'Control all user accounts, permissions, roles, and access levels across FOCA Connect.',
    status: 'Core Access',
    actions: [
      { label: 'Open Users', to: '/dashboard/users' },
      { label: 'Manage Access', to: '/dashboard/users' },
    ],
  },
  {
    title: 'Members Management',
    icon: <FaUsers />,
    text: 'Manage church member records, membership visibility, and administrative member operations.',
    status: 'Members',
    actions: [
      { label: 'Open Members', to: '/dashboard/members' },
      { label: 'Member Records', to: '/dashboard/members' },
    ],
  },
  {
    title: 'Visitors & Follow-Up',
    icon: <FaUserFriends />,
    text: 'Review visitors, monitor visitor tracking, and oversee follow-up related records.',
    status: 'Visitors',
    actions: [
      { label: 'Open Visitors', to: '/dashboard/visitors' },
      { label: 'Follow-Up Flow', to: '/dashboard/visitors' },
    ],
  },
  {
    title: 'Events & Attendance',
    icon: <FaCalendarAlt />,
    text: 'Supervise event operations and move quickly into the event and attendance workflow area.',
    status: 'Operations',
    actions: [
      { label: 'Open Events', to: '/dashboard/events' },
      { label: 'Attendance View', to: '/dashboard/events' },
    ],
  },
  {
    title: 'Sermons & Media',
    icon: <FaBroadcastTower />,
    text: 'Control sermon publishing, media-related ministry content, and digital ministry presentation.',
    status: 'Media',
    actions: [
      { label: 'Open Sermons', to: '/dashboard/sermons' },
      { label: 'Content Control', to: '/dashboard/sermons' },
    ],
  },
  {
    title: 'Announcements Center',
    icon: <FaBullhorn />,
    text: 'Oversee notices, communication flow, and announcement publishing inside the system.',
    status: 'Communication',
    actions: [
      { label: 'Open Announcements', to: '/dashboard/announcements' },
      { label: 'Notice Control', to: '/dashboard/announcements' },
    ],
  },
  {
    title: 'Prayer Requests',
    icon: <FaPrayingHands />,
    text: 'Review and supervise submitted prayer requests and related spiritual care activity.',
    status: 'Prayer Care',
    actions: [
      { label: 'Open Prayer Desk', to: '/dashboard/prayer' },
      { label: 'Prayer Oversight', to: '/dashboard/prayer' },
    ],
  },
  {
    title: 'Counseling & Care',
    icon: <FaHeart />,
    text: 'Access counseling flow and care-related operations for deeper ministry oversight.',
    status: 'Pastoral Care',
    actions: [
      { label: 'Open Counseling', to: '/dashboard/counseling' },
      { label: 'Care Workflow', to: '/dashboard/counseling' },
    ],
  },
  {
    title: 'Finance Center',
    icon: <FaMoneyBillWave />,
    text: 'Open financial operations, stewardship review, and budget-related executive functions.',
    status: 'Finance',
    actions: [
      { label: 'Open Finance', to: '/dashboard/finance-center' },
      { label: 'Budget Oversight', to: '/dashboard/finance-center' },
    ],
  },
  {
    title: 'Reports & Analytics',
    icon: <FaChartBar />,
    text: 'Open full reports and analytics for growth, operations, church activity, and visibility.',
    status: 'Insights',
    actions: [
      { label: 'Open Reports', to: '/dashboard/report-center' },
      { label: 'Analytics View', to: '/dashboard/report-center' },
    ],
  },
  {
    title: 'Public Ministry Presence',
    icon: <FaGlobe />,
    text: 'Move into public-facing ministry content areas that shape FOCA Connect’s digital experience.',
    status: 'Public Presence',
    actions: [
      { label: 'Public Sermons', to: '/dashboard/sermons' },
      { label: 'Public Notices', to: '/dashboard/announcements' },
    ],
  },
  {
    title: 'System Master Control',
    icon: <FaExclamationTriangle />,
    text: 'Final executive oversight over all secured modules, major flows, and high-level platform control.',
    status: 'Critical',
    danger: true,
    actions: [
      { label: 'Users Control', to: '/dashboard/users' },
      { label: 'Reports Center', to: '/dashboard/report-center' },
    ],
  },
];

const quickActions = [
  { label: 'Go to Users', to: '/dashboard/users', danger: false },
  { label: 'Go to Members', to: '/dashboard/members', danger: false },
  { label: 'Go to Visitors', to: '/dashboard/visitors', danger: false },
  { label: 'Go to Events', to: '/dashboard/events', danger: false },
  { label: 'Go to Finance', to: '/dashboard/finance-center', danger: false },
  { label: 'Go to Reports', to: '/dashboard/report-center', danger: true },
];

const defaultSummary = {
  topStats: {
    totalUsers: 0,
    activeUsers: 0,
    totalMembers: 0,
    totalVisitors: 0,
    newVisitors: 0,
    upcomingEvents: 0,
    totalSermons: 0,
    openPrayerRequests: 0,
    openCounselingSessions: 0,
    totalMinistries: 0,
    pendingBudgetRequests: 0,
    totalBudgetRequests: 0,
    totalIncome: 0,
    totalExpense: 0,
    totalTransactions: 0,
    systemStatus: 'Operational',
  },
  alerts: [],
  recentActivities: [],
};

export default function SuperAdminDashboard() {
  const [summary, setSummary] = useState(defaultSummary);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const { data } = await api.get('/super-admin/summary');

        if (data?.success) {
          setSummary(data.data);
        }
      } catch (error) {
        console.error('Failed to load super admin summary:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  const topStats = useMemo(
    () => [
      {
        title: 'Total Users',
        value: loading ? '...' : summary.topStats.totalUsers,
        icon: <FaUserShield />,
      },
      {
        title: 'Total Members',
        value: loading ? '...' : summary.topStats.totalMembers,
        icon: <FaUsers />,
      },
      {
        title: 'Visitors',
        value: loading ? '...' : summary.topStats.totalVisitors,
        icon: <FaUserFriends />,
      },
      {
        title: 'Upcoming Events',
        value: loading ? '...' : summary.topStats.upcomingEvents,
        icon: <FaCalendarAlt />,
      },
      {
        title: 'Prayer Requests',
        value: loading ? '...' : summary.topStats.openPrayerRequests,
        icon: <FaPrayingHands />,
      },
      {
        title: 'Budget Requests',
        value: loading ? '...' : summary.topStats.pendingBudgetRequests,
        icon: <FaMoneyBillWave />,
      },
    ],
    [loading, summary]
  );

  const alerts = summary.alerts?.length
    ? summary.alerts
    : [
        { label: 'Pending prayer follow-up cases', value: 0 },
        { label: 'New visitors awaiting review', value: 0 },
        { label: 'Upcoming events', value: 0 },
        { label: 'Pending budget requests', value: 0 },
      ];

  const recentActivities = summary.recentActivities?.length
    ? summary.recentActivities.map((item) => item.text)
    : ['No recent activity available yet.'];

  return (
    <main className="super-admin-page">
      <section className="super-admin-hero">
        <div className="super-admin-hero-content">
          <span className="super-admin-tag">FOCA Connect • Executive Control Center</span>
          <h1>Super Admin Dashboard</h1>
          <p>
            This is the master control center of FOCA Connect. From here, the Super Admin
            oversees users, church records, visitors, ministry communication, spiritual care,
            finance, reports, and whole-system administrative direction.
          </p>

          <div className="super-admin-hero-actions">
            <Link to="/dashboard/report-center" className="primary-super-btn">
              Open Report Center <FaArrowRight />
            </Link>
            <Link to="/dashboard/users" className="secondary-super-btn">
              Manage Users
            </Link>
          </div>
        </div>

        <div className="super-admin-hero-panel">
          <div className="hero-panel-card">
            <small>Access Level</small>
            <strong>Super Admin</strong>
            <span>Full system authority</span>
          </div>
          <div className="hero-panel-card">
            <small>System Status</small>
            <strong>{loading ? 'Loading...' : summary.topStats.systemStatus}</strong>
            <span>Whole platform visibility</span>
          </div>
          <div className="hero-panel-card">
            <small>Active Users</small>
            <strong>{loading ? '...' : summary.topStats.activeUsers}</strong>
            <span>Currently active accounts in the system</span>
          </div>
        </div>
      </section>

      <section className="super-admin-stats-grid">
        {topStats.map((item) => (
          <article className="super-stat-card" key={item.title}>
            <div className="super-stat-icon">{item.icon}</div>
            <div>
              <strong>{item.value}</strong>
              <span>{item.title}</span>
            </div>
          </article>
        ))}
      </section>

      <section className="super-admin-finance-strip">
        <article className="finance-strip-card">
          <small>Total Income</small>
          <strong>
            {loading ? '...' : `UGX ${Number(summary.topStats.totalIncome || 0).toLocaleString()}`}
          </strong>
        </article>
        <article className="finance-strip-card">
          <small>Total Expense</small>
          <strong>
            {loading ? '...' : `UGX ${Number(summary.topStats.totalExpense || 0).toLocaleString()}`}
          </strong>
        </article>
        <article className="finance-strip-card">
          <small>Total Transactions</small>
          <strong>{loading ? '...' : summary.topStats.totalTransactions}</strong>
        </article>
        <article className="finance-strip-card">
          <small>Total Sermons</small>
          <strong>{loading ? '...' : summary.topStats.totalSermons}</strong>
        </article>
      </section>

      <section className="super-admin-section-head">
        <div>
          <span className="section-mini-tag">FOCA Connect Privileges</span>
          <h2>Super Admin Privilege Scope</h2>
        </div>
        <p>
          The Super Admin controls the whole FOCA Connect system through secured dashboard
          routes, administrative modules, and executive oversight features.
        </p>
      </section>

      <section className="privileges-grid">
        {privilegeGroups.map((group) => (
          <article className="privilege-card" key={group.title}>
            <h3>{group.title}</h3>
            <ul>
              {group.items.map((item) => (
                <li key={item}>
                  <FaUserCheck />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="super-admin-section-head">
        <div>
          <span className="section-mini-tag">Whole System Control</span>
          <h2>Administrative Control Panels</h2>
        </div>
        <p>
          These cards open your existing FOCA modules and dashboards so the Super Admin can
          control the whole system from one place.
        </p>
      </section>

      <section className="super-admin-control-grid">
        {controlCards.map((card) => (
          <article
            key={card.title}
            className={`super-control-card ${card.danger ? 'danger-card' : ''}`}
          >
            <div className="super-control-card-top">
              <div className="super-control-icon">{card.icon}</div>
              <span className={`super-status-badge ${card.danger ? 'critical' : ''}`}>
                {card.status}
              </span>
            </div>

            <h3>{card.title}</h3>
            <p>{card.text}</p>

            <div className="super-control-actions">
              {card.actions.map((action) => (
                <Link key={action.label} to={action.to} className="control-action-btn">
                  {action.label}
                </Link>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="super-admin-bottom-grid">
        <article className="super-bottom-card">
          <div className="bottom-card-head">
            <h3>Recent System Activity</h3>
            <Link to="/dashboard/report-center">Open Reports</Link>
          </div>

          <ul className="activity-list">
            {recentActivities.map((activity, index) => (
              <li key={index}>{activity}</li>
            ))}
          </ul>
        </article>

        <article className="super-bottom-card">
          <div className="bottom-card-head">
            <h3>Critical Quick Access</h3>
          </div>

          <div className="quick-actions-grid">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                to={action.to}
                className={`quick-action-btn ${action.danger ? 'danger' : ''}`}
              >
                {action.label}
              </Link>
            ))}
          </div>
        </article>
      </section>

      <section className="super-admin-bottom-grid">
        <article className="super-bottom-card">
          <div className="bottom-card-head">
            <h3>System Alerts & Attention Area</h3>
          </div>

          <div className="alerts-grid">
            {alerts.map((item) => (
              <div className="alert-mini-card" key={item.label}>
                <div className="alert-mini-icon">
                  <FaBell />
                </div>
                <div>
                  <strong>{loading ? '...' : item.value}</strong>
                  <span>{item.label}</span>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="super-bottom-card">
          <div className="bottom-card-head">
            <h3>Executive Shortcuts</h3>
          </div>

          <div className="executive-shortcuts">
            <Link to="/dashboard/users" className="executive-shortcut-card">
              <FaShieldAlt />
              <div>
                <strong>User Governance</strong>
                <span>Open account and access control</span>
              </div>
            </Link>

            <Link to="/dashboard/members" className="executive-shortcut-card">
              <FaClipboardList />
              <div>
                <strong>Church Records</strong>
                <span>Review member records and details</span>
              </div>
            </Link>

            <Link to="/dashboard/report-center" className="executive-shortcut-card">
              <FaChartBar />
              <div>
                <strong>Reports Center</strong>
                <span>Open system-wide reporting</span>
              </div>
            </Link>

            <Link to="/dashboard/finance-center" className="executive-shortcut-card">
              <FaMoneyBillWave />
              <div>
                <strong>Finance Oversight</strong>
                <span>Review finance and related activity</span>
              </div>
            </Link>
          </div>
        </article>
      </section>

      <section className="super-admin-bottom-grid single-grid">
        <article className="super-bottom-card">
          <div className="bottom-card-head">
            <h3>FOCA Connect Super Admin Privileges List</h3>
          </div>

          <div className="privilege-list-block">
            <div className="privilege-list-item">
              <FaShieldAlt />
              <span>Manage all users and assign roles across the system.</span>
            </div>
            <div className="privilege-list-item">
              <FaUsers />
              <span>View and control members, visitors, and related records.</span>
            </div>
            <div className="privilege-list-item">
              <FaChurch />
              <span>Oversee ministry operations and church administration.</span>
            </div>
            <div className="privilege-list-item">
              <FaCalendarAlt />
              <span>Monitor events and connected attendance activity.</span>
            </div>
            <div className="privilege-list-item">
              <FaBroadcastTower />
              <span>Control sermons, announcements, and communication flow.</span>
            </div>
            <div className="privilege-list-item">
              <FaPrayingHands />
              <span>Access prayer requests and spiritual care workflow.</span>
            </div>
            <div className="privilege-list-item">
              <FaHeart />
              <span>Access counseling and care-centered administrative areas.</span>
            </div>
            <div className="privilege-list-item">
              <FaMoneyBillWave />
              <span>Open finance and budget-related executive pages.</span>
            </div>
            <div className="privilege-list-item">
              <FaChartBar />
              <span>Access the report center for full oversight and analytics.</span>
            </div>
            <div className="privilege-list-item">
              <FaCog />
              <span>Maintain top-level control over the whole FOCA Connect structure.</span>
            </div>
            <div className="privilege-list-item">
              <FaDatabase />
              <span>Oversee platform-wide activity and central administrative direction.</span>
            </div>
            <div className="privilege-list-item">
              <FaExclamationTriangle />
              <span>Act as the final secured authority over the whole system.</span>
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}