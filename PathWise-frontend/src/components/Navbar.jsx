import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on route-like navigation
  const closeMenu = () => setMenuOpen(false);

  const links = [
    { label: 'Resources', href: '#resources' },
    { label: 'About Us',  href: '#about'     },
    { label: 'Contact',   href: '#contact'   },
  ];

  return (
    <>
      <header className={`navbar-root ${scrolled ? 'navbar-scrolled' : ''}`}>
        <nav className="navbar-inner">
          {/* Gradient border */}
          <div className="navbar-border" />

          {/* Logo */}
          <Link to="/" className="navbar-logo" onClick={closeMenu}>
            <span className="logo-icon">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 2L15 6V12L9 16L3 12V6L9 2Z" stroke="#00a73e" strokeWidth="1.5" fill="none"/>
                <circle cx="9" cy="9" r="2.5" fill="#00a73e" opacity="0.8"/>
              </svg>
            </span>
            <span className="logo-text">PathWise<span className="logo-ai"> AI</span></span>
          </Link>

          {/* Desktop links */}
          <ul className="navbar-links">
            {links.map(({ label, href }) => (
              <li key={label}>
                <a href={href} className="nav-link">
                  {label}
                </a>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div className="navbar-cta">
            <a href="/auth" className="btn-ghost">Sign In</a>
            <Link to="/select-path" className="btn-launch">
              <span>Launch</span>
              <span className="btn-launch-arrow">→</span>
              <div className="btn-launch-shine" />
            </Link>
          </div>

          {/* Hamburger */}
          <button
            className={`hamburger ${menuOpen ? 'hamburger-open' : ''}`}
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </nav>

        {/* Mobile drawer */}
        <div className={`mobile-drawer ${menuOpen ? 'drawer-open' : ''}`}>
          <ul className="drawer-links">
            {links.map(({ label, href }) => (
              <li key={label}>
                <a href={href} className="drawer-link" onClick={closeMenu}>{label}</a>
              </li>
            ))}
          </ul>
          <div className="drawer-actions">
            <a href="/auth" className="drawer-ghost" onClick={closeMenu}>Sign In</a>
            <Link to="/select-path" className="drawer-launch" onClick={closeMenu}>
              Launch →
            </Link>
          </div>
        </div>
      </header>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600&display=swap');

        .navbar-root {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 1000;
          padding: 20px 24px 0;
          font-family: 'Geist', sans-serif;
          transition: padding 0.4s cubic-bezier(0.16,1,0.3,1);
        }
        .navbar-scrolled {
          padding: 10px 24px 0;
        }

        .navbar-inner {
          position: relative;
          max-width: 1100px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 24px;
          border-radius: 16px;
          background: rgba(10, 17, 32, 0.7);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          transition: background 0.4s, box-shadow 0.4s;
        }
        .navbar-scrolled .navbar-inner {
          background: rgba(8, 14, 26, 0.88);
          box-shadow: 0 8px 40px rgba(0,0,0,0.4);
        }

        /* gradient border */
        .navbar-border {
          position: absolute;
          inset: 0;
          border-radius: 16px;
          padding: 1px;
          background: linear-gradient(160deg, rgba(180,180,180,0.18) 0%, rgba(0,148,56,0.45) 100%);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }

        /* Logo */
        .navbar-logo {
          display: flex;
          align-items: center;
          gap: 9px;
          text-decoration: none;
          flex-shrink: 0;
        }
        .logo-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 30px; height: 30px;
          border-radius: 8px;
          background: rgba(0,167,62,0.1);
          border: 1px solid rgba(0,167,62,0.2);
          flex-shrink: 0;
        }
        .logo-text {
          font-family: 'Instrument Serif', serif;
          font-size: 1.15rem;
          color: #fff;
          letter-spacing: -0.01em;
          line-height: 1;
        }
        .logo-ai {
          color: #4ade80;
          font-style: italic;
        }

        /* Desktop nav links */
        .navbar-links {
          display: flex;
          align-items: center;
          gap: 4px;
          list-style: none;
          margin: 0; padding: 0;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }
        .nav-link {
          display: block;
          padding: 7px 14px;
          font-size: 0.88rem;
          font-weight: 400;
          color: rgba(255,255,255,0.5);
          text-decoration: none;
          border-radius: 8px;
          transition: color 0.2s, background 0.2s;
          white-space: nowrap;
        }
        .nav-link:hover {
          color: rgba(255,255,255,0.9);
          background: rgba(255,255,255,0.05);
        }

        /* CTA */
        .navbar-cta {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }
        .btn-ghost {
          padding: 7px 14px;
          font-size: 0.88rem;
          font-weight: 400;
          color: rgba(255,255,255,0.5);
          text-decoration: none;
          border-radius: 8px;
          transition: color 0.2s, background 0.2s;
          white-space: nowrap;
        }
        .btn-ghost:hover {
          color: rgba(255,255,255,0.9);
          background: rgba(255,255,255,0.05);
        }
        .btn-launch {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 8px 18px;
          background: linear-gradient(135deg, #00a73e, #00c44a);
          color: #fff;
          font-family: 'Geist', sans-serif;
          font-size: 0.88rem;
          font-weight: 500;
          border-radius: 10px;
          text-decoration: none;
          overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 0 0 1px rgba(0,167,62,0.4), 0 4px 16px rgba(0,167,62,0.2);
          white-space: nowrap;
        }
        .btn-launch:hover {
          transform: translateY(-1px);
          box-shadow: 0 0 0 1px rgba(0,167,62,0.6), 0 6px 24px rgba(0,167,62,0.35);
        }
        .btn-launch-arrow { transition: transform 0.2s; font-size: 0.85rem; }
        .btn-launch:hover .btn-launch-arrow { transform: translateX(3px); }
        .btn-launch-shine {
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.14) 0%, transparent 55%);
          pointer-events: none;
        }

        /* Hamburger */
        .hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          z-index: 10;
        }
        .hamburger span {
          display: block;
          width: 22px; height: 1.5px;
          background: rgba(255,255,255,0.65);
          border-radius: 2px;
          transition: transform 0.3s, opacity 0.3s, width 0.3s;
          transform-origin: center;
        }
        .hamburger-open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
        .hamburger-open span:nth-child(2) { opacity: 0; width: 0; }
        .hamburger-open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

        /* Mobile drawer */
        .mobile-drawer {
          max-width: 1100px;
          margin: 0 auto;
          overflow: hidden;
          max-height: 0;
          transition: max-height 0.4s cubic-bezier(0.16,1,0.3,1), opacity 0.3s;
          opacity: 0;
        }
        .drawer-open {
          max-height: 320px;
          opacity: 1;
        }
        .drawer-links {
          list-style: none;
          margin: 0; padding: 12px 24px 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .drawer-link {
          display: block;
          padding: 11px 4px;
          font-size: 0.95rem;
          color: rgba(255,255,255,0.55);
          text-decoration: none;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          transition: color 0.2s;
        }
        .drawer-link:hover { color: #fff; }
        .drawer-actions {
          display: flex;
          gap: 10px;
          padding: 16px 24px 24px;
        }
        .drawer-ghost {
          flex: 1;
          text-align: center;
          padding: 11px;
          font-size: 0.9rem;
          color: rgba(255,255,255,0.5);
          text-decoration: none;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          transition: color 0.2s, background 0.2s;
        }
        .drawer-ghost:hover { color: #fff; background: rgba(255,255,255,0.05); }
        .drawer-launch {
          flex: 1;
          text-align: center;
          padding: 11px;
          font-size: 0.9rem;
          font-weight: 500;
          color: #fff;
          text-decoration: none;
          background: linear-gradient(135deg, #00a73e, #00c44a);
          border-radius: 10px;
          transition: opacity 0.2s;
        }
        .drawer-launch:hover { opacity: 0.9; }

        /* Responsive */
        @media (max-width: 768px) {
          .navbar-links { display: none; }
          .navbar-cta { display: none; }
          .hamburger { display: flex; }
        }
        @media (max-width: 480px) {
          .navbar-root { padding: 12px 16px 0; }
          .navbar-inner { padding: 10px 16px; }
        }
      `}</style>
    </>
  );
};

export default Navbar;