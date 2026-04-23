import { Link } from "react-router-dom";
import "./GivingPage.css";

export default function GivingPage() {
  return (
    <div className="page">

      <section className="section">
        <h2>Give & Support</h2>
        <p>
          Your giving supports ministry, outreach, and transforming lives.
        </p>
      </section>

      <section className="section grid grid-3">
        <div className="card">
          <h3>Outreach</h3>
          <p>Helping communities in need.</p>
        </div>

        <div className="card">
          <h3>Youth Programs</h3>
          <p>Empowering the next generation.</p>
        </div>

        <div className="card">
          <h3>Church Growth</h3>
          <p>Supporting ministry expansion.</p>
        </div>
      </section>

      <div className="cta">
        <Link to="/contact" className="btn">
          Need Help? Contact Us →
        </Link>
      </div>

    </div>
  );
}