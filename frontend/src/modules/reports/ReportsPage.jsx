import { useEffect, useState } from 'react';
import api from '../../services/api';
import './ReportsPage.css';

export default function ReportsPage() {
  const [report, setReport] = useState(null);

  useEffect(() => {
    api.get('/dashboard/reports/overview')
      .then(({ data }) => setReport(data))
      .catch(() => setReport(null));
  }, []);

  return (
    <div className="reports-page">

      <section className="reports-hero">
        <span className="reports-badge">FOCA Connect</span>

        <h1>Automatic Report Center</h1>

        <p>
          View ministry insights, attendance, finances, sermons, and church activity.
        </p>

        <ul>
          <li>Track growth</li>
          <li>Monitor finances</li>
          <li>View ministry activity</li>
        </ul>
      </section>

      <section className="reports-stats-grid">

        <div className="report-stat-card">
          <h4>Members</h4>
          <strong>{report?.memberCount ?? 0}</strong>
        </div>

        <div className="report-stat-card">
          <h4>Visitors</h4>
          <strong>{report?.visitorNew ?? 0}</strong>
        </div>

        <div className="report-stat-card">
          <h4>Prayer Requests</h4>
          <strong>{report?.prayerNew ?? 0}</strong>
        </div>

        <div className="report-stat-card">
          <h4>Giving</h4>
          <strong>UGX {report?.titheTotal ?? 0}</strong>
        </div>

        <div className="report-stat-card">
          <h4>Expenses</h4>
          <strong>UGX {report?.expenseTotal ?? 0}</strong>
        </div>

        <div className="report-stat-card">
          <h4>Sermons</h4>
          <strong>{report?.sermonCount ?? 0}</strong>
        </div>

      </section>

      <section className="reports-panel-card">

        <h2>Report Snapshot</h2>

        <pre className="report-box">
          {JSON.stringify(report, null, 2)}
        </pre>

      </section>

    </div>
  );
}