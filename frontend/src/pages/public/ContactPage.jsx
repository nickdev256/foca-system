import "./ContactPage.css";

export default function ContactPage() {
  return (
    <div className="page">

      <section className="section">
        <h2>Contact Us</h2>
        <p>We would love to hear from you.</p>
      </section>

      <div className="contact-grid">

        <div className="card">
          <h3>Location</h3>
          <p>Kyanja, Kampala</p>
        </div>

        <div className="card">
          <h3>Phone</h3>
          <p>+256 XXX XXX XXX</p>
        </div>

        <div className="card">
          <h3>Email</h3>
          <p>info@foca.org</p>
        </div>

      </div>

      <form className="contact-form">
        <input type="text" placeholder="Your Name" />
        <input type="email" placeholder="Email" />
        <textarea placeholder="Message"></textarea>

        <button className="btn">Send Message</button>
      </form>

    </div>
  );
}