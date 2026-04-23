import EntityModule from '../../components/common/EntityModule';
import './FinancePage.css';

export default function FinancePage() {
  return (
    <div className="finance-page">
      <section className="finance-hero">
        <div className="finance-hero-text">
          <span className="finance-badge">FOCA Connect</span>
          <h1>Church Finance Center</h1>
          <p>
            Record and monitor giving, offerings, tithe, pledges, project
            contributions, welfare support, and ministry expenses in one secure
            financial workspace.
          </p>
        </div>

        <div className="finance-hero-card">
          <h3>Finance Desk</h3>
          <p>
            Manage transactions clearly for accountability and transparency.
          </p>
          <ul>
            <li>Track income and expenses</li>
            <li>Organize categories and payment methods</li>
            <li>Support ministry accountability</li>
          </ul>
        </div>
      </section>

      <section className="finance-module-section">
        <div className="section-heading">
          <h2>Manage Transactions</h2>
          <p>Add and maintain financial records.</p>
        </div>

        <EntityModule
          endpoint="/finance"
          title="Transaction"
          fields={[
            { name: 'type', label: 'Type' },
            { name: 'amount', label: 'Amount', type: 'number' },
            { name: 'memberName', label: 'Member' },
            { name: 'category', label: 'Category' },
            { name: 'method', label: 'Method' },
          ]}
        />
      </section>
    </div>
  );
}