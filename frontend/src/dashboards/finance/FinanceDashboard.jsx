import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import './FinanceDashboard.css';

export default function FinanceDashboard() {
  const [summary, setSummary] = useState({
    income: 0,
    expenses: 0,
    announcements: 0,
    events: 0,
    pendingBudgets: 0,
    approvedBudgets: 0,
    rejectedBudgets: 0,
    recentTransactions: [],
    recentBudgetRequests: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviewingId, setReviewingId] = useState('');
  const [reviewComment, setReviewComment] = useState({});

  const loadDashboard = async () => {
    setLoading(true);
    setError('');

    try {
      const { data } = await api.get('/dashboard/summary');

      setSummary({
        income: data?.stats?.income ?? 0,
        expenses: data?.stats?.expenses ?? 0,
        announcements: data?.stats?.announcements ?? 0,
        events: data?.stats?.events ?? 0,
        pendingBudgets: data?.stats?.pendingBudgets ?? 0,
        approvedBudgets: data?.stats?.approvedBudgets ?? 0,
        rejectedBudgets: data?.stats?.rejectedBudgets ?? 0,
        recentTransactions: Array.isArray(data?.recentTransactions)
          ? data.recentTransactions
          : [],
        recentBudgetRequests: Array.isArray(data?.recentBudgetRequests)
          ? data.recentBudgetRequests
          : [],
      });
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load finance dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const netBalance = useMemo(
    () => Number(summary.income || 0) - Number(summary.expenses || 0),
    [summary.income, summary.expenses]
  );

  const transactionTypeLabel = (type) => {
    if (!type) return 'Transaction';
    return String(type)
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const handleReview = async (id, status) => {
    try {
      setReviewingId(id);

      await api.patch(`/budget-requests/${id}/review`, {
        status,
        financeComment: reviewComment[id] || '',
      });

      await loadDashboard();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to review budget request.');
    } finally {
      setReviewingId('');
    }
  };

  const statCards = [
    { label: 'Total Income', value: `UGX ${summary.income}`, note: 'Church giving received' },
    { label: 'Total Expenses', value: `UGX ${summary.expenses}`, note: 'Recorded expenditure' },
    { label: 'Net Balance', value: `UGX ${netBalance}`, note: 'Income minus expenses' },
    { label: 'Pending Budgets', value: summary.pendingBudgets, note: 'Awaiting finance review' },
    { label: 'Approved Budgets', value: summary.approvedBudgets, note: 'Accepted budget requests' },
    { label: 'Rejected Budgets', value: summary.rejectedBudgets, note: 'Declined budget requests' },
  ];

  return (
    <div className="dashboard-page finance-dashboard-page">

      <section className="dashboard-hero">
        <div className="dashboard-hero-main finance-hero-main">
          <span className="dashboard-badge">FOCA Connect</span>
          <h1>Finance Dashboard</h1>
          <p>
            Manage church finances, monitor transactions, and review ministry budget
            requests through one accountable finance center.
          </p>

          <div className="finance-hero-actions">
            <Link to="/dashboard/finance" className="primary-btn">
              Open Finance Center
            </Link>
            <Link to="/dashboard/reports" className="finance-secondary-btn">
              View Reports
            </Link>
          </div>
        </div>

        <div className="dashboard-hero-side finance-hero-side">
          <h3>Finance Focus</h3>
          <p>
            Track giving, manage expenses, review department budgets, and support
            transparent church financial planning.
          </p>
          <ul>
            <li>Track income and expenditure clearly.</li>
            <li>Review and approve ministry budgets.</li>
            <li>Promote accountability and transparency.</li>
          </ul>
        </div>
      </section>

      {error && <div className="finance-alert error">{error}</div>}

      <section className="stats-grid">
        {statCards.map((card) => (
          <article className="stat-card finance-stat-card" key={card.label}>
            <h4>{card.label}</h4>
            <strong>{loading ? '...' : card.value}</strong>
            <p>{card.note}</p>
          </article>
        ))}
      </section>

      <section className="finance-grid">

        {/* TRANSACTIONS */}
        <section className="panel-card finance-panel">
          <div className="finance-section-head">
            <h2>Recent Transactions</h2>
          </div>

          {loading ? (
            <div className="finance-empty">Loading...</div>
          ) : summary.recentTransactions.length === 0 ? (
            <div className="finance-empty">No transactions found.</div>
          ) : (
            <div className="finance-list">
              {summary.recentTransactions.map((item, index) => (
                <div className="finance-list-item" key={item._id || index}>
                  <div>
                    <h4>{transactionTypeLabel(item.type)}</h4>
                    <p>
                      {item.memberName || 'No member'} • {item.category || 'General'}
                    </p>
                  </div>
                  <span className="finance-chip">UGX {item.amount ?? 0}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* BUDGETS */}
        <section className="panel-card finance-panel">
          <div className="finance-section-head">
            <h2>Budget Requests</h2>
          </div>

          {loading ? (
            <div className="finance-empty">Loading...</div>
          ) : summary.recentBudgetRequests.length === 0 ? (
            <div className="finance-empty">No budget requests found.</div>
          ) : (
            <div className="budget-request-list">
              {summary.recentBudgetRequests.map((item) => (
                <div className="budget-request-card" key={item._id}>

                  <div className="budget-request-top">
                    <div>
                      <h4>{item.title}</h4>
                      <p>
                        {item.department} • UGX {item.amount}
                      </p>
                    </div>

                    <span className={`budget-status ${item.status}`}>
                      {item.status}
                    </span>
                  </div>

                  <p>{item.purpose}</p>

                  <textarea
                    placeholder="Finance comment"
                    value={reviewComment[item._id] || ''}
                    onChange={(e) =>
                      setReviewComment((prev) => ({
                        ...prev,
                        [item._id]: e.target.value,
                      }))
                    }
                  />

                  {item.status === 'pending' ? (
                    <div className="budget-actions">
                      <button
                        onClick={() => handleReview(item._id, 'approved')}
                        disabled={reviewingId === item._id}
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => handleReview(item._id, 'rejected')}
                        disabled={reviewingId === item._id}
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <div>{item.financeComment || 'No comment'}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

      </section>
    </div>
  );
}