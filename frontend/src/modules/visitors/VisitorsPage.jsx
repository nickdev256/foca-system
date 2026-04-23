import EntityModule from '../../components/common/EntityModule';
import './VisitorsPage.css';

export default function VisitorsPage() {
  return (
    <div className="visitors-page">

      {/* HERO */}
      <section className="visitors-hero">
        <div className="visitors-hero-text">
          <span className="visitors-badge">FOCA Connect</span>
          <h1>Visitor Management</h1>
          <p>
            Capture visitor information, track first-time guests, manage follow-up,
            and support church hospitality and assimilation processes.
          </p>
        </div>

        <div className="visitors-hero-card">
          <h3>Visitor Desk</h3>
          <p>
            Help the church follow up visitors well and turn first contact into
            lasting connection.
          </p>

          <ul>
            <li>Register new visitors</li>
            <li>Track service attendance</li>
            <li>Monitor follow-up progress</li>
          </ul>
        </div>
      </section>

      {/* MODULE */}
      <section className="visitors-module-section">
        <div className="section-heading">
          <h2>Manage Visitors</h2>
          <p>Maintain clean guest records and follow-up workflows for the church.</p>
        </div>

        <div className="visitors-module-card">
          <EntityModule
            endpoint="/visitors"
            title="Visitor"
            fields={[
              { name: 'fullName', label: 'Full Name' },
              { name: 'phone', label: 'Phone' },
              { name: 'serviceAttended', label: 'Service' },
              { name: 'source', label: 'Source' },
              { name: 'followUpStatus', label: 'Follow-Up' },
            ]}
          />
        </div>
      </section>

    </div>
  );
}