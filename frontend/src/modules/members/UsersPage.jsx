import EntityModule from '../../components/common/EntityModule';
import './UsersPage.css';

export default function UsersPage() {
  return (
    <div className="users-page">

      <section className="users-hero">
        <span className="users-badge">FOCA Connect</span>

        <h1>User Management</h1>

        <p>
          Manage users, roles, and permissions across the FOCA system.
        </p>
      </section>

      <section className="users-module-section">

        <h2>Manage Users</h2>

        <EntityModule
          endpoint="/users"
          title="User"
          fields={[
            { name: 'fullName', label: 'Full Name' },
            { name: 'email', label: 'Email' },
            { name: 'role', label: 'Role' },
            { name: 'phone', label: 'Phone' },
            { name: 'password', label: 'Password' },
          ]}
        />

      </section>

    </div>
  );
}