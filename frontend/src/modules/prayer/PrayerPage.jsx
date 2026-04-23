import EntityModule from '../../components/common/EntityModule';
import './PrayerPage.css';

export default function PrayerPage() {
  return (
    <div className="prayer-page">

      <section className="prayer-hero">
        <span className="prayer-badge">FOCA Connect</span>

        <h1>Prayer Request Management</h1>

        <p>
          Organize prayer needs for intercession, pastoral care, and follow-up support.
        </p>

        <ul>
          <li>Record prayer requests</li>
          <li>Track status</li>
          <li>Support follow-up</li>
        </ul>
      </section>

      <section className="prayer-module-section">

        <h2>Manage Prayer Requests</h2>

        <EntityModule
          endpoint="/prayer-requests"
          title="Prayer Request"
          fields={[
            { name: 'name', label: 'Name' },
            { name: 'category', label: 'Category' },
            { name: 'request', label: 'Request', type: 'textarea' },
            { name: 'status', label: 'Status' },
          ]}
        />

      </section>

    </div>
  );
}