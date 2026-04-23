import EntityModule from '../../components/common/EntityModule';
import './MembersPage.css';

export default function MembersPage() {
  return (
    <div className="members-page">

      {/* HERO */}
      <section className="members-hero">
        <div className="members-hero-text">
          <span className="members-badge">FOCA Connect</span>
          <h1>Church Member Management</h1>
          <p>
            Maintain a complete and organized member database for discipleship,
            communication, family care, pastoral follow-up, and ministry growth.
          </p>
        </div>

        <div className="members-hero-card">
          <h3>Member Desk</h3>
          <p>
            Keep member records accurate and easy to access for leadership and
            ministry administration.
          </p>

          <ul>
            <li>Register and manage members</li>
            <li>Track household and contact details</li>
            <li>Support pastoral care and follow-up</li>
          </ul>
        </div>
      </section>

      {/* MODULE */}
      <section className="members-module-section">
        <div className="section-heading">
          <h2>Manage Members</h2>
          <p>
            Add, edit, and organize church member records in a professional
            FOCA Connect layout.
          </p>
        </div>

        <div className="members-module-card">
          <EntityModule
            endpoint="/members"
            title="Member"
            fields={[
              { name: 'fullName', label: 'Full Name' },
              { name: 'email', label: 'Email', type: 'email' },
              { name: 'phone', label: 'Phone' },
              { name: 'householdName', label: 'Household' },
              { name: 'status', label: 'Status' },
            ]}
          />
        </div>
      </section>

    </div>
  );
}