import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      
      {/* Top strip */}
      <div className="navbar-top-strip">
        <p>
          Welcome to Friends of Christ Assembly - Kyanja • Worship • Fellowship • Growth in Christ
        </p>
      </div>

      <div className="navbar-inner">
        
        {/* Brand */}
        <NavLink to="/" className="brand-wrap" onClick={closeMenu}>
          <div className="logo-ring">
            {/* FIXED LOGO PATH */}
            <img src="/logo.jpeg" alt="FOCA logo" className="brand-logo" />
          </div>

          <div className="brand-text">
            <h2>Friends of Christ Assembly</h2>
            <span>FOCA Connect • Kyanja Campus</span>
          </div>
        </NavLink>

        {/* Links */}
        <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
          
          <NavLink to="/" onClick={closeMenu}>Home</NavLink>
          <NavLink to="/about" onClick={closeMenu}>Our Church</NavLink>
          <NavLink to="/ministries" onClick={closeMenu}>Ministries</NavLink>
          <NavLink to="/sermons" onClick={closeMenu}>Sermons</NavLink>
          <NavLink to="/events" onClick={closeMenu}>Events</NavLink>
          <NavLink to="/giving" onClick={closeMenu}>Give</NavLink>
          <NavLink to="/contact" onClick={closeMenu}>Contact</NavLink>

          <NavLink
            to="/login"
            onClick={closeMenu}
            className="nav-btn nav-login-btn"
          >
            Login
          </NavLink>
        </nav>

        {/* Mobile toggle */}
        <button
          className={`menu-toggle ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          type="button"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Backdrop */}
      {menuOpen && <div className="nav-backdrop" onClick={closeMenu}></div>}
    </header>
  );
}