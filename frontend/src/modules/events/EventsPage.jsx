import EntityModule from '../../components/common/EntityModule';
import './EventsPage.css';

export default function EventsPage() {
  return (
    <div className="events-page">

      {/* HERO SECTION */}
      <section className="events-hero">
        <div className="events-hero-text">
          <span className="events-badge">FOCA Connect</span>
          <h1>Church Events Management</h1>
          <p>
            Plan, schedule, and manage church services, conferences, fellowships,
            crusades, ministry meetings, and special programs in one organized
            ministry space.
          </p>
        </div>

        <div className="events-hero-card">
          <h3>Events Desk</h3>
          <p>
            Keep church programs well arranged so leaders, members, and ministry
            departments can stay informed about upcoming activities.
          </p>

          <ul>
            <li>Create and organize church events</li>
            <li>Assign locations and categories clearly</li>
            <li>Track important ministry programs professionally</li>
          </ul>
        </div>
      </section>

      {/* MODULE SECTION */}
      <section className="events-module-section">
        <div className="section-heading">
          <h2>Manage Events</h2>
          <p>
            Add upcoming programs, edit event details, and maintain an orderly
            events calendar for FOCA Connect.
          </p>
        </div>

        <div className="events-module-card">
          <EntityModule
            endpoint="/events"
            title="Event"
            fields={[
              { name: 'title', label: 'Title' },
              { name: 'location', label: 'Location' },
              { name: 'category', label: 'Category' },
              { name: 'startDate', label: 'Start Date', type: 'date' },
              { name: 'description', label: 'Description', type: 'textarea' },
            ]}
          />
        </div>
      </section>

    </div>
  );
}