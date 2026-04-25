import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client';

const Navbar = () => {
  const [scrolled, setScrolled]       = useState(false);
  const [menuOpen, setMenuOpen]       = useState(false);
  const [user, setUser]               = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen]     = useState(false);
  const [notifications]               = useState([]);

  const profileRef = useRef(null);
  const notifRef   = useRef(null);
  const navigate   = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { setLoadingUser(false); return; }
    fetch(api.me, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoadingUser(false));
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (notifRef.current  && !notifRef.current.contains(e.target))   setNotifOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setProfileOpen(false);
    navigate('/');
  };

  const getInitials = (u) => {
    if (!u) return '?';
    const first = u.first_name?.[0] ?? '';
    const last  = u.last_name?.[0]  ?? '';
    return (first + last).toUpperCase() || u.email?.[0]?.toUpperCase() || '?';
  };

  const links = [
    { label: 'Resources', href: '#resources' },
    { label: 'About Us',  href: '#about'     },
    { label: 'Contact',   href: '#contact'   },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <header className={`navbar-root ${scrolled ? 'navbar-scrolled' : ''}`}>
        <nav className="navbar-inner">

          {/* Logo */}
          <Link to="/" className="navbar-logo" onClick={closeMenu}>
            <span className="logo-icon">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 2L15 6V12L9 16L3 12V6L9 2Z" stroke="#4ade80" strokeWidth="1.5" fill="none"/>
                <circle cx="9" cy="9" r="2.5" fill="#4ade80" opacity="0.8"/>
              </svg>
            </span>
            <span className="logo-text">PathWise<span className="logo-ai"> AI</span></span>
          </Link>

          {/* Desktop links */}
          <ul className="navbar-links">
            {links.map(({ label, href }) => (
              <li key={label}><a href={href} className="nav-link">{label}</a></li>
            ))}
          </ul>

          {/* CTA / Auth area — desktop only */}
          <div className="navbar-cta">
            {!loadingUser && (
              user ? (
                <>
                  <span className="nav-greeting">Hey, {user.first_name ?? user.email}</span>

                  {/* Notification Bell */}
                  <div className="dropdown-wrap" ref={notifRef}>
                    <button
                      className="icon-btn"
                      onClick={() => { setNotifOpen(v => !v); setProfileOpen(false); }}
                      aria-label="Notifications"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                      </svg>
                      {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
                    </button>

                    {notifOpen && (
                      <div className="dropdown notif-dropdown">
                        <div className="dropdown-header">
                          <span className="dropdown-header-title">Notifications</span>
                        </div>
                        {notifications.length === 0 ? (
                          <div className="dropdown-empty">You're all caught up 🎉</div>
                        ) : (
                          notifications.map((n, i) => (
                            <div key={i} className={`notif-item ${n.read ? '' : 'notif-unread'}`}>
                              {n.message}
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>

                  {/* Profile Avatar + Dropdown */}
                  <div className="dropdown-wrap" ref={profileRef}>
                    <button
                      className="avatar-btn"
                      onClick={() => { setProfileOpen(v => !v); setNotifOpen(false); }}
                      aria-label="Profile menu"
                    >
                      <span className="avatar">{getInitials(user)}</span>
                    </button>

                    {profileOpen && (
                      <div className="dropdown profile-dropdown">
                        <div className="dropdown-header">
                          <div className="profile-name">{user.first_name} {user.last_name}</div>
                          <div className="profile-email">{user.email}</div>
                        </div>
                        <Link
                          to="/profile"
                          className="dropdown-item"
                          onClick={() => setProfileOpen(false)}
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                            <circle cx="12" cy="7" r="4"/>
                          </svg>
                          View Profile
                        </Link>
                        <div className="dropdown-divider" />
                        <button className="dropdown-item dropdown-item-danger" onClick={handleLogout}>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                            <polyline points="16 17 21 12 16 7"/>
                            <line x1="21" y1="12" x2="9" y2="12"/>
                          </svg>
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link to="/auth"     className="btn-ghost">Sign In</Link>
                  <Link to="/register" className="btn-launch">
                    <span>Launch</span>
                    <span className="btn-launch-arrow">→</span>
                    <div className="btn-launch-shine" />
                  </Link>
                </>
              )
            )}
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

        {/* ── Mobile drawer ──
            FIX 1: max-height bumped to 420px so logged-in items aren't clipped.
            FIX 2: background is fully opaque #071a0f — no alpha bleed. */}
        <div className={`mobile-drawer ${menuOpen ? 'drawer-open' : ''}`}>
          <ul className="drawer-links">
            {links.map(({ label, href }) => (
              <li key={label}>
                <a href={href} className="drawer-link" onClick={closeMenu}>{label}</a>
              </li>
            ))}
          </ul>
          <div className="drawer-actions">
            {user ? (
              <>
                {/* FIX: use a proper <Link> rendered as a full-width block button */}
                <Link
                  to="/profile"
                  className="drawer-ghost"
                  onClick={closeMenu}
                >
                  View Profile
                </Link>
                <button
                  className="drawer-launch"
                  onClick={() => { handleLogout(); closeMenu(); }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/auth"     className="drawer-ghost"  onClick={closeMenu}>Sign In</Link>
                <Link to="/register" className="drawer-launch" onClick={closeMenu}>Launch →</Link>
              </>
            )}
          </div>
        </div>
      </header>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600&display=swap');

        /* ── Root ── */
        .navbar-root {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 1000;
          font-family: 'Geist', sans-serif;
          /* FIX: fully opaque — no rgba alpha */
          background: #071a0f;
          border-bottom: 1px solid rgba(0,167,62,0.18);
          transition: box-shadow 0.3s, border-color 0.3s;
        }
        .navbar-scrolled {
          box-shadow: 0 4px 32px rgba(0,0,0,0.5);
          border-color: rgba(0,167,62,0.3);
        }
        .navbar-inner {
          position: relative;
          max-width: 1100px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 13px 24px;
        }

        /* ── Logo ── */
        .navbar-logo { display:flex; align-items:center; gap:9px; text-decoration:none; flex-shrink:0; }
        .logo-icon {
          display:flex; align-items:center; justify-content:center;
          width:30px; height:30px; border-radius:8px;
          background:#0d2e17;
          border:1px solid rgba(74,222,128,0.25);
          flex-shrink:0;
        }
        .logo-text { font-family:'Instrument Serif',serif; font-size:1.15rem; color:#fff; letter-spacing:-0.01em; line-height:1; }
        .logo-ai   { color:#4ade80; font-style:italic; }

        /* ── Desktop nav links ── */
        .navbar-links {
          display:flex; align-items:center; gap:4px; list-style:none; margin:0; padding:0;
          position:absolute; left:50%; transform:translateX(-50%);
        }
        .nav-link {
          display:block; padding:7px 14px;
          font-size:0.88rem; font-weight:400; color:rgba(255,255,255,0.55);
          text-decoration:none; border-radius:8px;
          transition:color 0.2s, background 0.2s; white-space:nowrap;
        }
        .nav-link:hover { color:#fff; background:#0d2e17; }

        /* ── CTA area ── */
        .navbar-cta { display:flex; align-items:center; gap:10px; flex-shrink:0; }
        .nav-greeting { font-size:0.85rem; color:rgba(255,255,255,0.5); white-space:nowrap; }

        /* ── Buttons ── */
        .btn-ghost {
          padding:7px 14px; font-size:0.88rem; color:rgba(255,255,255,0.55);
          text-decoration:none; border-radius:8px;
          transition:color 0.2s, background 0.2s; white-space:nowrap;
        }
        .btn-ghost:hover { color:#fff; background:#0d2e17; }

        .btn-launch {
          position:relative; display:inline-flex; align-items:center; gap:7px;
          padding:8px 18px;
          background:linear-gradient(135deg,#00a73e,#00c44a);
          color:#fff; font-size:0.88rem; font-weight:500;
          border-radius:10px; text-decoration:none; overflow:hidden;
          transition:transform 0.2s, box-shadow 0.2s;
          box-shadow:0 0 0 1px rgba(0,167,62,0.4), 0 4px 16px rgba(0,167,62,0.2);
          white-space:nowrap;
        }
        .btn-launch:hover { transform:translateY(-1px); box-shadow:0 0 0 1px rgba(0,167,62,0.6), 0 6px 24px rgba(0,167,62,0.35); }
        .btn-launch-arrow { transition:transform 0.2s; font-size:0.85rem; }
        .btn-launch:hover .btn-launch-arrow { transform:translateX(3px); }
        .btn-launch-shine {
          position:absolute; inset:0;
          background:linear-gradient(135deg,rgba(255,255,255,0.14) 0%,transparent 55%);
          pointer-events:none;
        }

        /* ── Icon button (bell) ── */
        .icon-btn {
          position:relative; display:flex; align-items:center; justify-content:center;
          width:36px; height:36px;
          /* FIX: opaque background */
          background:#0d2118;
          border:1px solid rgba(255,255,255,0.08);
          border-radius:9px; color:rgba(255,255,255,0.55);
          cursor:pointer; transition:color 0.2s, background 0.2s, border-color 0.2s;
        }
        .icon-btn:hover { color:#fff; background:#0d2e17; border-color:rgba(74,222,128,0.2); }
        .badge {
          position:absolute; top:-4px; right:-4px;
          min-width:16px; height:16px; padding:0 4px;
          background:#ef4444; border:1.5px solid #071a0f;
          border-radius:999px; font-size:0.65rem; font-weight:600; color:#fff;
          display:flex; align-items:center; justify-content:center;
        }

        /* ── Avatar ── */
        .avatar-btn { background:none; border:none; cursor:pointer; padding:0; line-height:0; }
        .avatar {
          display:flex; align-items:center; justify-content:center;
          width:34px; height:34px; border-radius:50%;
          background:linear-gradient(135deg,#00a73e,#00c44a);
          color:#fff; font-size:0.78rem; font-weight:600; letter-spacing:0.05em;
          border:2px solid rgba(74,222,128,0.35);
          transition:border-color 0.2s, transform 0.2s; cursor:pointer;
        }
        .avatar:hover { border-color:rgba(74,222,128,0.7); transform:scale(1.05); }

        /* ── Dropdown shared ── */
        .dropdown-wrap { position:relative; }
        .dropdown {
          position:absolute; top:calc(100% + 10px); right:0;
          min-width:210px;
          /* FIX: fully opaque solid background */
          background: #0a1f12;
          border:1px solid rgba(74,222,128,0.22);
          border-radius:14px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.75), 0 0 0 1px rgba(74,222,128,0.08);
          overflow:hidden;
          z-index:9999;
          animation: dropIn 0.18s cubic-bezier(0.16,1,0.3,1) both;
        }
        @keyframes dropIn {
          from { opacity:0; transform:translateY(-8px) scale(0.97); }
          to   { opacity:1; transform:translateY(0)    scale(1);    }
        }

        .dropdown-header {
          padding:13px 16px 11px;
          border-bottom:1px solid rgba(255,255,255,0.07);
          /* FIX: opaque header background */
          background:#0e2918;
        }
        .dropdown-header-title { font-size:0.88rem; font-weight:500; color:#fff; }
        .profile-name  { font-size:0.88rem; font-weight:600; color:#fff; }
        .profile-email { font-size:0.76rem; color:rgba(255,255,255,0.38); margin-top:3px; }

        .dropdown-item {
          display:flex;
          align-items:center;
          gap:10px;
          width:100%;
          padding:11px 16px;
          font-size:0.85rem;
          color:rgba(255,255,255,0.72);
          text-decoration:none;
          background:none;
          border:none;
          cursor:pointer;
          text-align:left;
          font-family:'Geist', sans-serif;
          box-sizing:border-box;
          transition:background 0.15s, color 0.15s;
          line-height:1.4;
        }
        .dropdown-item:hover { background:#0d2e17; color:#fff; }
        .dropdown-item svg { flex-shrink:0; opacity:0.7; }
        .dropdown-item:hover svg { opacity:1; }

        .dropdown-item-danger { color:rgba(239,68,68,0.8); }
        .dropdown-item-danger:hover { background:#1f0e0e; color:#f87171; }
        .dropdown-item-danger svg { opacity:0.7; }
        .dropdown-item-danger:hover svg { opacity:1; }

        .dropdown-divider { height:1px; background:rgba(255,255,255,0.07); margin:2px 0; }

        /* ── Notification dropdown ── */
        .notif-dropdown { min-width:270px; }
        .dropdown-empty { padding:18px 16px; font-size:0.83rem; color:rgba(255,255,255,0.35); text-align:center; }
        .notif-item {
          padding:11px 16px; font-size:0.83rem; color:rgba(255,255,255,0.6);
          border-bottom:1px solid rgba(255,255,255,0.05);
        }
        .notif-item:last-child { border-bottom:none; }
        /* FIX: opaque unread highlight */
        .notif-unread { color:#fff; background:#0d2e17; }

        /* ── Hamburger ── */
        .hamburger {
          display:none; flex-direction:column; gap:5px;
          background:none; border:none; cursor:pointer; padding:6px;
          border-radius:8px; z-index:10; transition:background 0.2s;
        }
        .hamburger:hover { background:#0d2e17; }
        .hamburger span {
          display:block; width:22px; height:1.5px;
          background:rgba(255,255,255,0.75); border-radius:2px;
          transition:transform 0.3s, opacity 0.3s, width 0.3s;
          transform-origin:center;
        }
        .hamburger-open span:nth-child(1) { transform:translateY(6.5px) rotate(45deg); }
        .hamburger-open span:nth-child(2) { opacity:0; width:0; }
        .hamburger-open span:nth-child(3) { transform:translateY(-6.5px) rotate(-45deg); }

        /* ── Mobile drawer ──
           FIX 1: background fully opaque
           FIX 2: max-height increased to 420px so logged-in rows aren't clipped */
        .mobile-drawer {
          /* FIX: solid opaque background — matches navbar exactly */
          background: #071a0f;
          border-top:1px solid rgba(74,222,128,0.1);
          overflow:hidden;
          max-height:0;
          transition:max-height 0.4s cubic-bezier(0.16,1,0.3,1), opacity 0.3s;
          opacity:0;
        }
        .drawer-open {
          /* FIX: tall enough to show all items without clipping */
          max-height:420px;
          opacity:1;
        }
        .drawer-links { list-style:none; margin:0; padding:8px 20px 0; display:flex; flex-direction:column; }
        .drawer-link {
          display:block; padding:13px 4px; font-size:0.95rem;
          color:rgba(255,255,255,0.6); text-decoration:none;
          border-bottom:1px solid rgba(255,255,255,0.06);
          transition:color 0.2s;
        }
        .drawer-link:hover { color:#fff; }
        .drawer-actions {
          display:flex; gap:10px; padding:16px 20px 24px;
        }

        /* FIX: drawer-ghost works as both <Link> and <button> */
        .drawer-ghost {
          flex:1; text-align:center; padding:12px; font-size:0.9rem;
          color:rgba(255,255,255,0.6); text-decoration:none;
          border:1px solid rgba(255,255,255,0.12); border-radius:10px;
          transition:color 0.2s, background 0.2s, border-color 0.2s;
          /* FIX: fully opaque, no alpha conflict */
          background: #071a0f;
          cursor:pointer;
          font-family:'Geist', sans-serif;
          /* Ensure <Link> renders as a proper block */
          display:flex; align-items:center; justify-content:center;
          box-sizing:border-box;
        }
        .drawer-ghost:hover { color:#fff; background:#0d2e17; border-color:rgba(74,222,128,0.25); }

        .drawer-launch {
          flex:1; text-align:center; padding:12px; font-size:0.9rem; font-weight:500;
          color:#fff; text-decoration:none;
          background:linear-gradient(135deg,#00a73e,#00c44a);
          border-radius:10px; border:none; cursor:pointer;
          font-family:'Geist', sans-serif;
          display:flex; align-items:center; justify-content:center;
          box-sizing:border-box;
          transition:opacity 0.2s, transform 0.2s;
        }
        .drawer-launch:hover { opacity:0.9; transform:translateY(-1px); }

        /* ── Responsive ── */
        @media (max-width:768px) {
          .navbar-links { display:none; }
          .navbar-cta   { display:none; }
          .hamburger    { display:flex; }
        }
        @media (max-width:480px) {
          .navbar-inner { padding:11px 16px; }
        }
      `}</style>
    </>
  );
};

export default Navbar;