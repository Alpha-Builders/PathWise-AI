import React, { useState, useEffect, useRef } from 'react'
import { School, GraduationCap, Bell, User, ArrowRight, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom';

const SelectPath = () => {
  const [selectedPath, setSelectedPath] = useState(null);
  const [hoveredPath, setHoveredPath] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [openNotif, setOpenNotif] = useState(false);
  const [user, setUser] = useState(null);
  const [notifications] = useState([]);

  const profileRef = useRef(null);
  const notifRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => { setMounted(true); }, []);

  // Fetch current user
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch('/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => setUser(data))
      .catch(() => {
        localStorage.removeItem('token');
        setUser(null);
      });
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setOpenProfile(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setOpenNotif(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleContinue = () => {
    if (!selectedPath) return;
    if (selectedPath === 'high-school') navigate('/highschool-path');
    else if (selectedPath === 'college') navigate('/course-selection');
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setOpenProfile(false);
    navigate('/auth');
  };

  const getInitials = (u) => {
    if (!u) return null;
    const f = u.first_name?.[0] ?? '';
    const l = u.last_name?.[0] ?? '';
    return (f + l).toUpperCase() || u.email?.[0]?.toUpperCase() || '?';
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --green-core: #22c55e;
          --green-bright: #4ade80;
          --green-deep: #15803d;
          --green-glow: rgba(34,197,94,0.15);
          --green-muted: rgba(34,197,94,0.08);
          --surface: rgba(255,255,255,0.03);
          --surface-hover: rgba(255,255,255,0.06);
          --border: rgba(255,255,255,0.08);
          --border-green: rgba(34,197,94,0.4);
          --text-primary: #f0fdf4;
          --text-secondary: #86efac;
          --text-muted: #6b7280;
        }

        .sp-root {
          min-height: 100vh;
          background: #080d0a;
          color: var(--text-primary);
          font-family: 'DM Sans', sans-serif;
          position: relative;
          overflow: hidden;
        }

        .sp-root::before {
          content: '';
          position: fixed; inset: 0;
          background-image:
            linear-gradient(rgba(34,197,94,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34,197,94,0.04) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
          z-index: 0;
        }

        .orb { position: fixed; border-radius: 50%; pointer-events: none; filter: blur(120px); z-index: 0; }
        .orb-1 { width:600px; height:600px; background: radial-gradient(circle, rgba(34,197,94,0.12) 0%, transparent 70%); top:-200px; left:-100px; animation: orb-drift 8s ease-in-out infinite alternate; }
        .orb-2 { width:500px; height:500px; background: radial-gradient(circle, rgba(21,128,61,0.1) 0%, transparent 70%); bottom:-150px; right:-100px; animation: orb-drift 10s ease-in-out infinite alternate-reverse; }
        @keyframes orb-drift {
          from { transform: translate(0,0) scale(1); }
          to   { transform: translate(40px,30px) scale(1.05); }
        }

        /* ── Header ── */
        .sp-header {
          position: relative; z-index: 10;
          display: flex; justify-content: space-between; align-items: center;
          padding: 20px 40px;
          border-bottom: 1px solid var(--border);
          backdrop-filter: blur(12px);
        }
        .sp-logo { display:flex; align-items:center; gap:10px; text-decoration:none; cursor:pointer; }
        .sp-logo-mark {
          width:36px; height:36px;
          background: linear-gradient(135deg, var(--green-core), var(--green-deep));
          border-radius:10px;
          display:flex; align-items:center; justify-content:center;
          box-shadow: 0 0 20px rgba(34,197,94,0.4);
        }
        .sp-logo-text {
          font-family: 'DM Sans', sans-serif;
          font-size:22px; letter-spacing:0.5px;
          background: linear-gradient(90deg, #fff, var(--green-bright));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .sp-header-actions { display:flex; gap:8px; align-items:center; }

        .sp-icon-btn {
          position: relative;
          width:40px; height:40px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius:12px;
          display:flex; align-items:center; justify-content:center;
          cursor:pointer;
          transition: all 0.2s ease;
          color: var(--text-muted);
        }
        .sp-icon-btn:hover {
          background: var(--surface-hover);
          border-color: var(--border-green);
          color: var(--green-bright);
        }
        .sp-notif-dot {
          position:absolute; top:8px; right:8px;
          width:7px; height:7px;
          background: var(--green-core); border-radius:50%;
          border: 1.5px solid #080d0a;
          animation: pulse-dot 2s ease infinite;
        }
        @keyframes pulse-dot {
          0%,100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.5); }
          50%      { box-shadow: 0 0 0 4px rgba(34,197,94,0); }
        }

        /* Avatar */
        .sp-avatar {
          width:32px; height:32px; border-radius:50%;
          background: linear-gradient(135deg, var(--green-core), var(--green-deep));
          display:flex; align-items:center; justify-content:center;
          font-size:0.72rem; font-weight:600; color:#fff;
          letter-spacing:0.05em;
          border: 2px solid rgba(74,222,128,0.35);
        }

        /* Dropdown shared */
        .sp-dropdown-wrap { position:relative; }
        .sp-dropdown {
          position:absolute; top:calc(100% + 10px); right:0;
          background: #0c2414;
          border: 1px solid rgba(74,222,128,0.2);
          border-radius:14px;
          box-shadow: 0 16px 48px rgba(0,0,0,0.6);
          overflow:hidden;
          z-index:200;
          animation: drop-in 0.18s cubic-bezier(0.16,1,0.3,1);
          min-width:200px;
        }
        @keyframes drop-in {
          from { opacity:0; transform:translateY(-6px) scale(0.97); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }
        .sp-dropdown-header {
          padding:12px 14px 10px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .sp-dropdown-name { font-size:0.88rem; font-weight:500; color:#fff; }
        .sp-dropdown-email { font-size:0.76rem; color:rgba(255,255,255,0.4); margin-top:2px; }
        .sp-dropdown-item {
          display:flex; align-items:center; gap:9px;
          width:100%; padding:10px 14px;
          font-size:0.84rem; color:rgba(255,255,255,0.7);
          text-decoration:none; background:none; border:none;
          cursor:pointer; text-align:left; font-family:'DM Sans',sans-serif;
          transition: background 0.15s, color 0.15s;
        }
        .sp-dropdown-item:hover { background:rgba(74,222,128,0.08); color:#fff; }
        .sp-dropdown-item-danger { color:rgba(239,68,68,0.75); }
        .sp-dropdown-item-danger:hover { background:rgba(239,68,68,0.08); color:#ef4444; }
        .sp-dropdown-divider { height:1px; background:rgba(255,255,255,0.06); margin:2px 0; }

        /* Notif dropdown */
        .sp-notif-dropdown { min-width:260px; }
        .sp-notif-empty { padding:20px 14px; font-size:0.82rem; color:rgba(255,255,255,0.35); text-align:center; }
        .sp-notif-item { padding:10px 14px; font-size:0.82rem; color:rgba(255,255,255,0.6); border-bottom:1px solid rgba(255,255,255,0.04); }
        .sp-notif-unread { color:#fff; background:rgba(74,222,128,0.05); }
        .sp-badge-count {
          position:absolute; top:-4px; right:-4px;
          min-width:16px; height:16px; padding:0 4px;
          background:#ef4444; border:1.5px solid #080d0a;
          border-radius:999px; font-size:0.62rem; font-weight:600; color:#fff;
          display:flex; align-items:center; justify-content:center;
        }

        /* ── Main ── */
        .sp-main {
          position:relative; z-index:10;
          display:flex; flex-direction:column; align-items:center;
          padding:80px 40px 60px;
          max-width:1000px; margin:0 auto;
        }
        .sp-badge {
          display:inline-flex; align-items:center; gap:6px;
          background: var(--green-muted);
          border: 1px solid var(--border-green);
          border-radius:100px; padding:6px 16px;
          font-size:12px; font-weight:500;
          color: var(--green-bright);
          letter-spacing:0.5px; text-transform:uppercase;
          margin-bottom:32px;
          opacity:0; animation: fade-up 0.6s 0.1s ease forwards;
        }
        .sp-headline {
          text-align:center; margin-bottom:16px;
          opacity:0; animation: fade-up 0.6s 0.2s ease forwards;
        }
        .sp-headline h2 {
          font-family:'DM Sans',sans-serif;
          font-size: clamp(42px,6vw,72px);
          line-height:1.1; font-weight:400;
          color: var(--text-primary);
        }
        .sp-headline h2 em {
          font-style:italic;
          background: linear-gradient(90deg, var(--green-core), var(--green-bright));
          -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
        }
        .sp-subtext {
          text-align:center; font-size:16px; line-height:1.7;
          color: var(--text-muted); max-width:480px; margin-bottom:72px;
          opacity:0; animation: fade-up 0.6s 0.3s ease forwards;
        }

        /* Cards */
        .sp-cards { display:grid; grid-template-columns:1fr 1fr; gap:20px; width:100%; margin-bottom:48px; }
        @media (max-width:640px) {
          .sp-cards { grid-template-columns:1fr; }
          .sp-main  { padding:60px 20px 40px; }
          .sp-header { padding:16px 20px; }
        }

        .sp-card {
          position:relative;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius:24px; padding:36px 32px;
          cursor:pointer;
          transition: all 0.35s cubic-bezier(0.34,1.56,0.64,1);
          overflow:hidden; opacity:0; text-align:left;
        }
        .sp-card:nth-child(1) { animation: fade-up 0.6s 0.4s ease forwards; }
        .sp-card:nth-child(2) { animation: fade-up 0.6s 0.5s ease forwards; }
        .sp-card::before {
          content:''; position:absolute; inset:0;
          background: linear-gradient(135deg, rgba(34,197,94,0.08), transparent 60%);
          opacity:0; transition:opacity 0.35s ease; border-radius:inherit;
        }
        .sp-card:hover::before, .sp-card.active::before { opacity:1; }
        .sp-card:hover {
          border-color: var(--border-green);
          transform: translateY(-4px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(34,197,94,0.1);
        }
        .sp-card.active {
          border-color: var(--green-core);
          transform: translateY(-4px);
          box-shadow: 0 24px 64px rgba(0,0,0,0.5), 0 0 40px rgba(34,197,94,0.15);
          background: rgba(34,197,94,0.05);
        }
        .sp-card-num {
          position:absolute; top:24px; right:28px;
          font-size:11px; font-weight:500; color:var(--text-muted);
          letter-spacing:1px; transition:color 0.3s;
        }
        .sp-card.active .sp-card-num,
        .sp-card:hover .sp-card-num { color: var(--green-bright); }
        .sp-card-icon {
          width:64px; height:64px;
          background: var(--surface-hover);
          border: 1px solid var(--border);
          border-radius:18px;
          display:flex; align-items:center; justify-content:center;
          margin-bottom:28px;
          transition: all 0.35s ease;
          color: var(--text-muted);
        }
        .sp-card:hover .sp-card-icon,
        .sp-card.active .sp-card-icon {
          background: rgba(34,197,94,0.12);
          border-color: var(--border-green);
          color: var(--green-bright);
          box-shadow: 0 0 24px rgba(34,197,94,0.2);
        }
        .sp-card-title {
          font-family:'DM Sans',sans-serif;
          font-size:32px; font-weight:400;
          color: var(--text-primary); margin-bottom:10px; line-height:1.1;
        }
        .sp-card-desc {
          font-size:14px; line-height:1.65;
          color: var(--text-muted); max-width:260px; margin-bottom:28px;
        }
        .sp-card-tags { display:flex; flex-wrap:wrap; gap:8px; }
        .sp-tag {
          font-size:11px; font-weight:500; padding:4px 12px;
          border-radius:100px;
          background: var(--surface-hover);
          border: 1px solid var(--border);
          color: var(--text-muted); letter-spacing:0.3px; transition:all 0.3s;
        }
        .sp-card.active .sp-tag,
        .sp-card:hover .sp-tag { border-color:rgba(34,197,94,0.25); color:var(--green-bright); }
        .sp-card-check {
          position:absolute; top:24px; right:26px;
          width:28px; height:28px;
          background: var(--green-core); border-radius:50%;
          display:flex; align-items:center; justify-content:center;
          box-shadow: 0 0 16px rgba(34,197,94,0.6);
          animation: pop-in 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards;
        }
        @keyframes pop-in {
          from { transform:scale(0); opacity:0; }
          to   { transform:scale(1); opacity:1; }
        }
        .sp-card-line {
          position:absolute; bottom:0; left:32px; right:32px; height:1px;
          background: linear-gradient(90deg, transparent, var(--green-core), transparent);
          opacity:0; transition:opacity 0.35s ease;
        }
        .sp-card.active .sp-card-line { opacity:1; }

        /* CTA */
        .sp-cta {
          display:flex; flex-direction:column; align-items:center; gap:16px;
          opacity:0; animation: fade-up 0.6s 0.6s ease forwards;
        }
        .sp-continue-btn {
          position:relative;
          display:inline-flex; align-items:center; gap:10px;
          padding:16px 40px; border-radius:16px;
          font-size:15px; font-weight:600;
          font-family:'DM Sans',sans-serif;
          cursor:pointer; transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
          letter-spacing:0.2px; border:none; overflow:hidden;
        }
        .sp-continue-btn.enabled {
          background: linear-gradient(135deg, var(--green-core), var(--green-deep));
          color:#fff; box-shadow: 0 8px 32px rgba(34,197,94,0.35);
        }
        .sp-continue-btn.enabled:hover {
          transform:translateY(-2px) scale(1.02);
          box-shadow: 0 14px 40px rgba(34,197,94,0.5);
        }
        .sp-continue-btn.enabled:hover .btn-arrow { transform:translateX(4px); }
        .sp-continue-btn.enabled::after {
          content:''; position:absolute; inset:0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
          pointer-events:none;
        }
        .sp-continue-btn.disabled {
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--border);
          color: var(--text-muted); cursor:not-allowed;
        }
        .btn-arrow { transition:transform 0.3s ease; }
        .sp-hint { font-size:13px; color:var(--text-muted); letter-spacing:0.2px; }
        .sp-hint span { color:var(--green-bright); font-weight:500; }

        @keyframes fade-up {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}</style>

      <div className="sp-root">
        <div className="orb orb-1" />
        <div className="orb orb-2" />

        {/* Header */}
        <header className="sp-header">
          <div className="sp-logo" onClick={() => navigate('/')}>
            <div className="sp-logo-mark">
              <Sparkles size={16} color="#fff" />
            </div>
            <span className="sp-logo-text">Pathwise AI</span>
          </div>

          <div className="sp-header-actions">

            {/* Notification Bell */}
            <div className="sp-dropdown-wrap" ref={notifRef}>
              <button
                className="sp-icon-btn"
                onClick={() => { setOpenNotif(v => !v); setOpenProfile(false); }}
                aria-label="Notifications"
              >
                <Bell size={16} />
                {unreadCount > 0
                  ? <span className="sp-badge-count">{unreadCount}</span>
                  : <span className="sp-notif-dot" />
                }
              </button>

              {openNotif && (
                <div className="sp-dropdown sp-notif-dropdown">
                  <div className="sp-dropdown-header">
                    <span className="sp-dropdown-name">Notifications</span>
                  </div>
                  {notifications.length === 0 ? (
                    <div className="sp-notif-empty">You're all caught up 🎉</div>
                  ) : (
                    notifications.map((n, i) => (
                      <div key={i} className={`sp-notif-item ${!n.read ? 'sp-notif-unread' : ''}`}>
                        {n.message}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="sp-dropdown-wrap" ref={profileRef}>
              <button
                className="sp-icon-btn"
                onClick={() => { setOpenProfile(v => !v); setOpenNotif(false); }}
                aria-label="Profile menu"
              >
                {user
                  ? <span className="sp-avatar">{getInitials(user)}</span>
                  : <User size={16} />
                }
              </button>

              {openProfile && (
                <div className="sp-dropdown">
                  {user && (
                    <div className="sp-dropdown-header">
                      <div className="sp-dropdown-name">{user.first_name} {user.last_name}</div>
                      <div className="sp-dropdown-email">{user.email}</div>
                    </div>
                  )}
                  <button
                    className="sp-dropdown-item"
                    onClick={() => { navigate('/profile'); setOpenProfile(false); }}
                  >
                    <User size={14} />
                    View Profile
                  </button>
                  <div className="sp-dropdown-divider" />
                  <button className="sp-dropdown-item sp-dropdown-item-danger" onClick={handleLogout}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                      <polyline points="16 17 21 12 16 7"/>
                      <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* Main */}
        <main className="sp-main">
          <div className="sp-badge">
            <Sparkles size={11} />
            Academic Path Selection
          </div>

          <div className="sp-headline">
            <h2>Where does your<br /><em>journey begin?</em></h2>
          </div>

          <p className="sp-subtext">
            Choose your academic level so we can tailor your experience
            and give you the most relevant guidance.
          </p>

          <div className="sp-cards">
            {/* High School */}
            <button
              className={`sp-card ${selectedPath === 'high-school' ? 'active' : ''}`}
              onClick={() => setSelectedPath('high-school')}
              onMouseEnter={() => setHoveredPath('high-school')}
              onMouseLeave={() => setHoveredPath(null)}
            >
              {selectedPath === 'high-school' ? (
                <div className="sp-card-check">
                  <svg width="14" height="14" viewBox="0 0 20 20" fill="white">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              ) : (
                <div className="sp-card-num">01</div>
              )}
              <div className="sp-card-icon"><School size={28} /></div>
              <h3 className="sp-card-title">High School</h3>
              <p className="sp-card-desc">For students in grades 9–12. Get guidance on college prep, subject selection, and early career direction.</p>
              <div className="sp-card-tags">
                <span className="sp-tag">Grades 9–12</span>
                <span className="sp-tag">College Prep</span>
                <span className="sp-tag">Career Exploration</span>
              </div>
              <div className="sp-card-line" />
            </button>

            {/* College */}
            <button
              className={`sp-card ${selectedPath === 'college' ? 'active' : ''}`}
              onClick={() => setSelectedPath('college')}
              onMouseEnter={() => setHoveredPath('college')}
              onMouseLeave={() => setHoveredPath(null)}
            >
              {selectedPath === 'college' ? (
                <div className="sp-card-check">
                  <svg width="14" height="14" viewBox="0 0 20 20" fill="white">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              ) : (
                <div className="sp-card-num">02</div>
              )}
              <div className="sp-card-icon"><GraduationCap size={28} /></div>
              <h3 className="sp-card-title">College</h3>
              <p className="sp-card-desc">For undergraduate students. Navigate your major, build your career path, and make the most of your degree.</p>
              <div className="sp-card-tags">
                <span className="sp-tag">Undergraduate</span>
                <span className="sp-tag">Major Selection</span>
                <span className="sp-tag">Career Development</span>
              </div>
              <div className="sp-card-line" />
            </button>
          </div>

          <div className="sp-cta">
            <button
              onClick={handleContinue}
              disabled={!selectedPath}
              className={`sp-continue-btn ${selectedPath ? 'enabled' : 'disabled'}`}
            >
              Continue
              <ArrowRight size={18} className="btn-arrow" />
            </button>
            <p className="sp-hint">
              {selectedPath
                ? <><span>{selectedPath === 'high-school' ? 'High School' : 'College'}</span> selected — click continue to proceed</>
                : 'Select a path above to continue'
              }
            </p>
          </div>
        </main>
      </div>
    </>
  );
};

export default SelectPath;