import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaArrowRight,
  FaChurch,
  FaClock,
} from 'react-icons/fa';
import './Footer.css';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setMessageType('');

    try {
      const res = await fetch('http://localhost:5000/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, source: 'footer' }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage(data.message || 'You have subscribed successfully.');
        setMessageType('success');
        setEmail('');
      } else {
        setMessage(data.message || 'Subscription failed.');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Unable to connect to the server.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="foca-footer">
      <div className="foca-footer-container">
        <div className="footer-newsletter-card">
          <div className="newsletter-copy">
            <Link to="/" className="footer-chip footer-chip-link">
              Friends of Christ Assembly
            </Link>

            <h2>Stay connected to worship, fellowship, and the life of the church.</h2>

            <p>
              Receive updates on church services, prayer gatherings, upcoming
              events, ministry programs, sermons, and important announcements
              from FOCA Kyanja.
            </p>
          </div>

          <form className="newsletter-form" onSubmit={handleSubscribe}>
            <div className="newsletter-input-wrap">
              <FaEnvelope className="newsletter-icon" />
              <input
                type="email"
                placeholder="Enter your email address"
                aria-label="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? 'Subscribing...' : <>Join Us <FaArrowRight /></>}
            </button>

            {message && (
              <p className={`newsletter-message ${messageType}`}>
                {message}
              </p>
            )}
          </form>
        </div>

        <div className="footer-main-grid">
          <div className="footer-brand-block">
            <Link to="/" className="footer-brand-top footer-brand-link">
              <div className="footer-brand-icon">
                <FaChurch />
              </div>

              <div>
                <h3>FOCA Connect</h3>
                <span>Friends of Christ Assembly – Kyanja</span>
              </div>
            </Link>

            <p className="footer-brand-text">
              A digital home for worship, discipleship, fellowship, and member
              care at Friends of Christ Assembly. We are committed to sharing
              the love of Christ, building faith, and serving the church family
              with excellence.
            </p>

            <div className="footer-socials">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
                <FaFacebookF />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube">
                <FaYoutube />
              </a>
            </div>
          </div>

          <div className="footer-column">
            <h4>Church</h4>
            <Link to="/">Home</Link>
            <Link to="/about">About FOCA</Link>
            <Link to="/sermons">Sermons</Link>
            <Link to="/events">Church Events</Link>
            <Link to="/giving">Give Online</Link>
            <Link to="/plan-visit">Plan a Visit</Link>
          </div>

          <div className="footer-column">
            <h4>Ministry Life</h4>
            <Link to="/ministries">Departments & Ministries</Link>
            <Link to="/announcements">Announcements</Link>
            <Link to="/prayer-request">Prayer Requests</Link>
            <Link to="/counseling">Counseling</Link>
            <Link to="/members">Member Care</Link>
            <Link to="/login">Church Portal</Link>
          </div>

          <div className="footer-column">
            <h4>Contact Us</h4>

            <a
              className="footer-contact-item"
              href="https://www.google.com/maps/search/?api=1&query=Kyanja+Kampala+Uganda"
              target="_blank"
              rel="noreferrer"
            >
              <FaMapMarkerAlt />
              <span>Kyanja, Kampala, Uganda</span>
            </a>

            <a className="footer-contact-item" href="tel:+256781102421">
              <FaPhoneAlt />
              <span>+256 781 102421</span>
            </a>

            <a className="footer-contact-item" href="mailto:info@focaconnect.org">
              <FaEnvelope />
              <span>info@focaconnect.org</span>
            </a>

            <Link className="footer-contact-item" to="/services">
              <FaClock />
              <span>Sunday Worship Service: 8:00 AM – 11:30 AM</span>
            </Link>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <p className="footer-bottom-link">
            © {new Date().getFullYear()} Friends of Christ Assembly – Kyanja. All rights reserved.
          </p>

          <p className="footer-scripture">
            “I have called you friends.” — John 15:15
          </p>
        </div>
      </div>
    </footer>
  );
}