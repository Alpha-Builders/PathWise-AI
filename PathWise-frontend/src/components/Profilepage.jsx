import React, { useState, useEffect, useRef } from 'react'
import {
  Sparkles, Bell, User, ArrowLeft, Mail, Calendar,
  BookOpen, Edit3, Save, X, GraduationCap, School,
  Shield, LogOut, Camera, Check
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const ProfilePage = () => {
  const [user, setUser] = useState(null)
  const [editing, setEditing] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({})
  const [openProfile, setOpenProfile] = useState(false)
  const [openNotif, setOpenNotif] = useState(false)
  const [notifications] = useState([])
  const [activeTab, setActiveTab] = useState('overview')

  const profileRef = useRef(null)
  const notifRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return
    fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => { setUser(data); setForm(data) })
      .catch(() => { localStorage.removeItem('token'); setUser(null) })
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setOpenProfile(false)
      if (notifRef.current && !notifRef.current.contains(e.target)) setOpenNotif(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const getInitials = (u) => {
    if (!u) return '?'
    const f = u.first_name?.[0] ?? ''
    const l = u.last_name?.[0] ?? ''
    return (f + l).toUpperCase() || u.email?.[0]?.toUpperCase() || '?'
  }

  const handleSave = () => {
    setUser({ ...user, ...form })
    setEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleLogout = () => {
    localStorage.clear()
    setUser(null)
    navigate('/auth')
  }

  const unreadCount = notifications.filter(n => !n.read).length
  const pathLabel = user?.path === 'high-school' ? 'High School' : user?.path === 'college' ? 'College' : null
  const PathIcon = user?.path === 'high-school' ? School : GraduationCap

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

        .pp-root {
          min-height: 100vh;
          background: #080d0a;
          color: var(--text-primary);
          font-family: 'DM Sans', sans-serif;
          position: relative;
          overflow-x: hidden;
        }
        .pp-root::before {
          content: '';
          position: fixed; inset: 0;
          background-image:
            linear-gradient(rgba(34,197,94,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34,197,94,0.04) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none; z-index: 0;
        }
        .orb { position: fixed; border-radius: 50%; pointer-events: none; filter: blur(120px); z-index: 0; }
        .orb-1 { width:600px;height:600px;background:radial-gradient(circle,rgba(34,197,94,0.12) 0%,transparent 70%);top:-200px;left:-100px;animation:orb-drift 8s ease-in-out infinite alternate; }
        .orb-2 { width:500px;height:500px;background:radial-gradient(circle,rgba(21,128,61,0.1) 0%,transparent 70%);bottom:-150px;right:-100px;animation:orb-drift 10s ease-in-out infinite alternate-reverse; }
        @keyframes orb-drift {
          from { transform: translate(0,0) scale(1); }
          to   { transform: translate(40px,30px) scale(1.05); }
        }

        /* ── Header ── */
        .pp-header {
          position: relative; z-index: 10;
          display: flex; justify-content: space-between; align-items: center;
          padding: 20px 40px;
          border-bottom: 1px solid var(--border);
          backdrop-filter: blur(12px);
        }
        .pp-logo { display:flex;align-items:center;gap:10px;text-decoration:none;cursor:pointer; }
        .pp-logo-mark {
          width:36px;height:36px;
          background:linear-gradient(135deg,var(--green-core),var(--green-deep));
          border-radius:10px;display:flex;align-items:center;justify-content:center;
          box-shadow:0 0 20px rgba(34,197,94,0.4);
        }
        .pp-logo-text {
          font-family:'DM Sans',sans-serif;font-size:22px;letter-spacing:0.5px;
          background:linear-gradient(90deg,#fff,var(--green-bright));
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
        }
        .pp-header-actions { display:flex;gap:8px;align-items:center; }
        .pp-icon-btn {
          position:relative;width:40px;height:40px;
          background:var(--surface);border:1px solid var(--border);border-radius:12px;
          display:flex;align-items:center;justify-content:center;
          cursor:pointer;transition:all 0.2s ease;color:var(--text-muted);
        }
        .pp-icon-btn:hover { background:var(--surface-hover);border-color:var(--border-green);color:var(--green-bright); }
        .pp-notif-dot {
          position:absolute;top:8px;right:8px;width:7px;height:7px;
          background:var(--green-core);border-radius:50%;border:1.5px solid #080d0a;
          animation:pulse-dot 2s ease infinite;
        }
        @keyframes pulse-dot {
          0%,100%{box-shadow:0 0 0 0 rgba(34,197,94,0.5);}
          50%{box-shadow:0 0 0 4px rgba(34,197,94,0);}
        }
        .pp-avatar-sm {
          width:32px;height:32px;border-radius:50%;
          background:linear-gradient(135deg,var(--green-core),var(--green-deep));
          display:flex;align-items:center;justify-content:center;
          font-size:0.72rem;font-weight:600;color:#fff;letter-spacing:0.05em;
          border:2px solid rgba(74,222,128,0.35);
        }
        .pp-badge-count {
          position:absolute;top:-4px;right:-4px;min-width:16px;height:16px;padding:0 4px;
          background:#ef4444;border:1.5px solid #080d0a;
          border-radius:999px;font-size:0.62rem;font-weight:600;color:#fff;
          display:flex;align-items:center;justify-content:center;
        }

        /* Dropdown */
        .pp-dropdown-wrap { position:relative; }
        .pp-dropdown {
          position:absolute;top:calc(100% + 10px);right:0;
          background:#0c2414;border:1px solid rgba(74,222,128,0.2);border-radius:14px;
          box-shadow:0 16px 48px rgba(0,0,0,0.6);overflow:hidden;z-index:200;
          animation:drop-in 0.18s cubic-bezier(0.16,1,0.3,1);min-width:200px;
        }
        @keyframes drop-in {
          from{opacity:0;transform:translateY(-6px) scale(0.97);}
          to{opacity:1;transform:translateY(0) scale(1);}
        }
        .pp-dropdown-header{padding:12px 14px 10px;border-bottom:1px solid rgba(255,255,255,0.06);}
        .pp-dropdown-name{font-size:0.88rem;font-weight:500;color:#fff;}
        .pp-dropdown-email{font-size:0.76rem;color:rgba(255,255,255,0.4);margin-top:2px;}
        .pp-dropdown-item {
          display:flex;align-items:center;gap:9px;width:100%;padding:10px 14px;
          font-size:0.84rem;color:rgba(255,255,255,0.7);
          text-decoration:none;background:none;border:none;cursor:pointer;
          text-align:left;font-family:'DM Sans',sans-serif;
          transition:background 0.15s,color 0.15s;
        }
        .pp-dropdown-item:hover{background:rgba(74,222,128,0.08);color:#fff;}
        .pp-dropdown-item-danger{color:rgba(239,68,68,0.75);}
        .pp-dropdown-item-danger:hover{background:rgba(239,68,68,0.08);color:#ef4444;}
        .pp-dropdown-divider{height:1px;background:rgba(255,255,255,0.06);margin:2px 0;}
        .pp-notif-dropdown{min-width:260px;}
        .pp-notif-empty{padding:20px 14px;font-size:0.82rem;color:rgba(255,255,255,0.35);text-align:center;}

        /* ── Page layout ── */
        .pp-page {
          position:relative;z-index:10;
          max-width:900px;margin:0 auto;
          padding:48px 40px 80px;
          animation:fade-up 0.5s 0.05s ease both;
        }

        /* Back link */
        .pp-back {
          display:inline-flex;align-items:center;gap:7px;
          font-size:13px;color:var(--text-muted);
          background:none;border:none;cursor:pointer;
          font-family:'DM Sans',sans-serif;letter-spacing:0.2px;
          margin-bottom:40px;padding:0;
          transition:color 0.2s;
        }
        .pp-back:hover{color:var(--green-bright);}

        /* ── Hero card ── */
        .pp-hero {
          background:var(--surface);
          border:1px solid var(--border);border-radius:28px;
          padding:40px 40px 36px;
          margin-bottom:24px;
          position:relative;overflow:hidden;
        }
        .pp-hero::before {
          content:'';position:absolute;inset:0;
          background:linear-gradient(135deg,rgba(34,197,94,0.06),transparent 60%);
          pointer-events:none;border-radius:inherit;
        }
        .pp-hero-line {
          position:absolute;bottom:0;left:40px;right:40px;height:1px;
          background:linear-gradient(90deg,transparent,var(--green-core),transparent);
          opacity:0.6;
        }
        .pp-hero-top {
          display:flex;align-items:flex-start;justify-content:space-between;
          gap:20px;flex-wrap:wrap;
        }
        .pp-hero-left { display:flex;align-items:center;gap:24px; }

        /* Big avatar */
        .pp-avatar-lg {
          position:relative;flex-shrink:0;
          width:88px;height:88px;border-radius:50%;
          background:linear-gradient(135deg,var(--green-core),var(--green-deep));
          display:flex;align-items:center;justify-content:center;
          font-size:2rem;font-weight:600;color:#fff;letter-spacing:0.05em;
          border:3px solid rgba(74,222,128,0.3);
          box-shadow:0 0 40px rgba(34,197,94,0.25);
        }
        .pp-avatar-camera {
          position:absolute;bottom:-2px;right:-2px;
          width:26px;height:26px;border-radius:50%;
          background:var(--green-core);border:2px solid #080d0a;
          display:flex;align-items:center;justify-content:center;
          cursor:pointer;transition:transform 0.2s;
        }
        .pp-avatar-camera:hover{transform:scale(1.1);}

        .pp-hero-name {
          font-family:'Instrument Serif',serif;
          font-size:clamp(26px,4vw,36px);line-height:1.15;
          color:var(--text-primary);margin-bottom:6px;
        }
        .pp-hero-sub {
          font-size:14px;color:var(--text-muted);
          display:flex;align-items:center;gap:8px;flex-wrap:wrap;
        }
        .pp-hero-sep{color:rgba(255,255,255,0.15);}
        .pp-path-pill {
          display:inline-flex;align-items:center;gap:5px;
          background:var(--green-muted);border:1px solid var(--border-green);
          border-radius:100px;padding:3px 12px;
          font-size:11px;font-weight:500;color:var(--green-bright);letter-spacing:0.4px;
        }

        /* Edit / save buttons */
        .pp-edit-btn {
          display:inline-flex;align-items:center;gap:8px;
          padding:10px 20px;border-radius:12px;font-size:13px;font-weight:500;
          font-family:'DM Sans',sans-serif;cursor:pointer;
          transition:all 0.25s cubic-bezier(0.34,1.56,0.64,1);
          letter-spacing:0.2px;flex-shrink:0;
        }
        .pp-edit-btn-outline {
          background:var(--surface-hover);
          border:1px solid var(--border);color:var(--text-muted);
        }
        .pp-edit-btn-outline:hover{border-color:var(--border-green);color:var(--green-bright);}
        .pp-edit-btn-green {
          background:linear-gradient(135deg,var(--green-core),var(--green-deep));
          border:none;color:#fff;
          box-shadow:0 6px 24px rgba(34,197,94,0.3);
        }
        .pp-edit-btn-green:hover{box-shadow:0 8px 32px rgba(34,197,94,0.5);transform:translateY(-1px);}
        .pp-edit-btn-cancel {
          background:rgba(239,68,68,0.08);
          border:1px solid rgba(239,68,68,0.2);
          color:rgba(239,68,68,0.75);
        }
        .pp-edit-btn-cancel:hover{background:rgba(239,68,68,0.12);color:#ef4444;}
        .pp-btn-row{display:flex;gap:8px;align-items:center;flex-shrink:0;}

        /* Saved toast */
        .pp-saved {
          display:inline-flex;align-items:center;gap:6px;
          background:rgba(34,197,94,0.12);border:1px solid var(--border-green);
          border-radius:100px;padding:5px 14px;
          font-size:12px;font-weight:500;color:var(--green-bright);
          animation:fade-up 0.3s ease both;flex-shrink:0;
        }

        /* ── Stats strip ── */
        .pp-stats {
          display:grid;grid-template-columns:repeat(3,1fr);gap:16px;
          margin-top:32px;padding-top:32px;
          border-top:1px solid var(--border);
        }
        .pp-stat { text-align:center; }
        .pp-stat-val {
          font-family:'Instrument Serif',serif;
          font-size:28px;color:var(--green-bright);line-height:1;margin-bottom:4px;
        }
        .pp-stat-label{font-size:11px;color:var(--text-muted);letter-spacing:0.5px;text-transform:uppercase;}

        /* ── Tabs ── */
        .pp-tabs {
          display:flex;gap:4px;
          background:var(--surface);border:1px solid var(--border);
          border-radius:16px;padding:6px;
          margin-bottom:24px;
        }
        .pp-tab {
          flex:1;padding:10px 16px;border-radius:12px;border:none;
          font-size:13px;font-weight:500;font-family:'DM Sans',sans-serif;
          cursor:pointer;transition:all 0.2s ease;color:var(--text-muted);
          background:none;letter-spacing:0.2px;
        }
        .pp-tab:hover{color:var(--text-primary);}
        .pp-tab.active{background:rgba(34,197,94,0.12);color:var(--green-bright);border:1px solid rgba(34,197,94,0.25);}

        /* ── Detail card ── */
        .pp-card {
          background:var(--surface);border:1px solid var(--border);
          border-radius:24px;padding:32px;margin-bottom:20px;
          animation:fade-up 0.4s ease both;
        }
        .pp-card-title {
          font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;
          color:var(--text-muted);margin-bottom:24px;
          display:flex;align-items:center;gap:8px;
        }
        .pp-card-title-dot{width:4px;height:4px;background:var(--green-core);border-radius:50%;}

        /* Fields */
        .pp-fields { display:grid;grid-template-columns:1fr 1fr;gap:20px; }
        @media(max-width:600px){
          .pp-fields{grid-template-columns:1fr;}
          .pp-page{padding:32px 20px 60px;}
          .pp-header{padding:16px 20px;}
          .pp-hero{padding:28px 24px;}
          .pp-stats{grid-template-columns:repeat(3,1fr);}
          .pp-hero-top{flex-direction:column;}
        }

        .pp-field { display:flex;flex-direction:column;gap:6px; }
        .pp-field-label{font-size:11px;font-weight:500;letter-spacing:0.5px;text-transform:uppercase;color:var(--text-muted);}
        .pp-field-val {
          font-size:15px;color:var(--text-primary);padding:12px 16px;
          background:var(--surface-hover);border:1px solid var(--border);
          border-radius:12px;line-height:1.4;
        }
        .pp-field-val.empty{color:var(--text-muted);font-style:italic;}
        .pp-field-input {
          font-size:15px;color:var(--text-primary);padding:12px 16px;
          background:rgba(34,197,94,0.04);border:1px solid var(--border-green);
          border-radius:12px;line-height:1.4;
          font-family:'DM Sans',sans-serif;outline:none;
          transition:border-color 0.2s,box-shadow 0.2s;
          box-shadow:0 0 0 0 rgba(34,197,94,0);
        }
        .pp-field-input:focus{border-color:var(--green-core);box-shadow:0 0 0 3px rgba(34,197,94,0.1);}
        .pp-field-input::placeholder{color:var(--text-muted);}

        /* Account security card */
        .pp-security-row {
          display:flex;align-items:center;justify-content:space-between;
          padding:16px 0;border-bottom:1px solid var(--border);
        }
        .pp-security-row:last-child{border-bottom:none;padding-bottom:0;}
        .pp-security-row:first-child{padding-top:0;}
        .pp-sec-left{display:flex;align-items:center;gap:12px;}
        .pp-sec-icon {
          width:36px;height:36px;border-radius:10px;
          background:var(--surface-hover);border:1px solid var(--border);
          display:flex;align-items:center;justify-content:center;color:var(--text-muted);
        }
        .pp-sec-label{font-size:14px;color:var(--text-primary);font-weight:500;}
        .pp-sec-sub{font-size:12px;color:var(--text-muted);margin-top:2px;}
        .pp-sec-action {
          font-size:12px;font-weight:500;color:var(--green-bright);
          background:none;border:none;cursor:pointer;
          font-family:'DM Sans',sans-serif;padding:0;
          letter-spacing:0.3px;transition:opacity 0.2s;
        }
        .pp-sec-action:hover{opacity:0.7;}
        .pp-status-dot{
          display:inline-block;width:7px;height:7px;border-radius:50%;
          background:var(--green-core);margin-right:6px;
          box-shadow:0 0 6px rgba(34,197,94,0.6);
        }

        @keyframes fade-up {
          from{opacity:0;transform:translateY(16px);}
          to{opacity:1;transform:translateY(0);}
        }
      `}</style>

      <div className="pp-root">
        <div className="orb orb-1" />
        <div className="orb orb-2" />

        {/* Header */}
        <header className="pp-header">
          <div className="pp-logo" onClick={() => navigate('/')}>
            <div className="pp-logo-mark"><Sparkles size={16} color="#fff" /></div>
            <span className="pp-logo-text">Pathwise AI</span>
          </div>
          <div className="pp-header-actions">

            {/* Notification */}
            <div className="pp-dropdown-wrap" ref={notifRef}>
              <button className="pp-icon-btn" onClick={() => { setOpenNotif(v => !v); setOpenProfile(false) }}>
                <Bell size={16} />
                {unreadCount > 0
                  ? <span className="pp-badge-count">{unreadCount}</span>
                  : <span className="pp-notif-dot" />}
              </button>
              {openNotif && (
                <div className="pp-dropdown pp-notif-dropdown">
                  <div className="pp-dropdown-header">
                    <span className="pp-dropdown-name">Notifications</span>
                  </div>
                  {notifications.length === 0
                    ? <div className="pp-notif-empty">You're all caught up 🎉</div>
                    : notifications.map((n, i) => (
                      <div key={i} className={`pp-notif-item ${!n.read ? 'pp-notif-unread' : ''}`}>{n.message}</div>
                    ))}
                </div>
              )}
            </div>

            {/* Profile dropdown */}
            <div className="pp-dropdown-wrap" ref={profileRef}>
              <button className="pp-icon-btn" onClick={() => { setOpenProfile(v => !v); setOpenNotif(false) }}>
                {user ? <span className="pp-avatar-sm">{getInitials(user)}</span> : <User size={16} />}
              </button>
              {openProfile && (
                <div className="pp-dropdown">
                  {user && (
                    <div className="pp-dropdown-header">
                      <div className="pp-dropdown-name">{user.first_name} {user.last_name}</div>
                      <div className="pp-dropdown-email">{user.email}</div>
                    </div>
                  )}
                  <button className="pp-dropdown-item" onClick={() => { navigate('/select-path'); setOpenProfile(false) }}>
                    <BookOpen size={14} /> Dashboard
                  </button>
                  <div className="pp-dropdown-divider" />
                  <button className="pp-dropdown-item pp-dropdown-item-danger" onClick={handleLogout}>
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="pp-page">

          <button className="pp-back" onClick={() => navigate(-1)}>
            <ArrowLeft size={14} />
            Back
          </button>

          {/* ── Hero card ── */}
          <div className="pp-hero">
            <div className="pp-hero-top">
              <div className="pp-hero-left">
                <div className="pp-avatar-lg">
                  {getInitials(user)}
                  <div className="pp-avatar-camera">
                    <Camera size={11} color="#fff" />
                  </div>
                </div>
                <div>
                  <h1 className="pp-hero-name">
                    {user ? `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim() || 'Your Name' : 'Loading…'}
                  </h1>
                  <div className="pp-hero-sub">
                    {user?.email && <span>{user.email}</span>}
                    {pathLabel && <>
                      <span className="pp-hero-sep">·</span>
                      <span className="pp-path-pill">
                        <PathIcon size={10} />
                        {pathLabel}
                      </span>
                    </>}
                  </div>
                </div>
              </div>

              <div className="pp-btn-row">
                {saved && (
                  <span className="pp-saved"><Check size={12} /> Saved</span>
                )}
                {editing ? (
                  <>
                    <button className="pp-edit-btn pp-edit-btn-cancel" onClick={() => { setEditing(false); setForm(user) }}>
                      <X size={14} /> Cancel
                    </button>
                    <button className="pp-edit-btn pp-edit-btn-green" onClick={handleSave}>
                      <Save size={14} /> Save changes
                    </button>
                  </>
                ) : (
                  <button className="pp-edit-btn pp-edit-btn-outline" onClick={() => setEditing(true)}>
                    <Edit3 size={14} /> Edit profile
                  </button>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="pp-stats">
              <div className="pp-stat">
                <div className="pp-stat-val">0</div>
                <div className="pp-stat-label">Paths explored</div>
              </div>
              <div className="pp-stat">
                <div className="pp-stat-val">0</div>
                <div className="pp-stat-label">Sessions</div>
              </div>
              <div className="pp-stat">
                <div className="pp-stat-val">—</div>
                <div className="pp-stat-label">Member since</div>
              </div>
            </div>

            <div className="pp-hero-line" />
          </div>

          {/* ── Tabs ── */}
          <div className="pp-tabs">
            {['overview', 'academic', 'security'].map(t => (
              <button
                key={t}
                className={`pp-tab ${activeTab === t ? 'active' : ''}`}
                onClick={() => setActiveTab(t)}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {/* ── Overview tab ── */}
          {activeTab === 'overview' && (
            <div className="pp-card" style={{ animationDelay: '0.05s' }}>
              <div className="pp-card-title">
                <span className="pp-card-title-dot" />
                Personal information
              </div>
              <div className="pp-fields">
                {[
                  { key: 'first_name', label: 'First name', placeholder: 'Enter first name' },
                  { key: 'last_name',  label: 'Last name',  placeholder: 'Enter last name'  },
                  { key: 'email',      label: 'Email',      placeholder: 'your@email.com', type: 'email' },
                  { key: 'phone',      label: 'Phone',      placeholder: '+1 (555) 000-0000' },
                  { key: 'school',     label: 'School / Institution', placeholder: 'Your school name' },
                  { key: 'grade',      label: 'Grade / Year', placeholder: 'e.g. 11th Grade' },
                ].map(({ key, label, placeholder, type = 'text' }) => (
                  <div className="pp-field" key={key}>
                    <label className="pp-field-label">{label}</label>
                    {editing ? (
                      <input
                        type={type}
                        className="pp-field-input"
                        value={form[key] ?? ''}
                        placeholder={placeholder}
                        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      />
                    ) : (
                      <div className={`pp-field-val ${!user?.[key] ? 'empty' : ''}`}>
                        {user?.[key] || placeholder}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Academic tab ── */}
          {activeTab === 'academic' && (
            <div className="pp-card" style={{ animationDelay: '0.05s' }}>
              <div className="pp-card-title">
                <span className="pp-card-title-dot" />
                Academic profile
              </div>
              <div className="pp-fields">
                {[
                  { key: 'major',      label: 'Major / Field of interest', placeholder: 'e.g. Computer Science' },
                  { key: 'gpa',        label: 'GPA',                        placeholder: 'e.g. 3.8' },
                  { key: 'sat',        label: 'SAT / ACT score',            placeholder: 'e.g. 1480' },
                  { key: 'grad_year',  label: 'Expected graduation',        placeholder: 'e.g. 2027' },
                  { key: 'interests',  label: 'Career interests',           placeholder: 'e.g. Software engineering' },
                  { key: 'activities', label: 'Extracurriculars',           placeholder: 'e.g. Robotics club, debate' },
                ].map(({ key, label, placeholder }) => (
                  <div className="pp-field" key={key}>
                    <label className="pp-field-label">{label}</label>
                    {editing ? (
                      <input
                        className="pp-field-input"
                        value={form[key] ?? ''}
                        placeholder={placeholder}
                        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      />
                    ) : (
                      <div className={`pp-field-val ${!user?.[key] ? 'empty' : ''}`}>
                        {user?.[key] || placeholder}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Security tab ── */}
          {activeTab === 'security' && (
            <div className="pp-card" style={{ animationDelay: '0.05s' }}>
              <div className="pp-card-title">
                <span className="pp-card-title-dot" />
                Account & security
              </div>
              <div>
                <div className="pp-security-row">
                  <div className="pp-sec-left">
                    <div className="pp-sec-icon"><Mail size={15} /></div>
                    <div>
                      <div className="pp-sec-label">Email address</div>
                      <div className="pp-sec-sub">{user?.email || 'Not set'}</div>
                    </div>
                  </div>
                  <button className="pp-sec-action">Change</button>
                </div>
                <div className="pp-security-row">
                  <div className="pp-sec-left">
                    <div className="pp-sec-icon"><Shield size={15} /></div>
                    <div>
                      <div className="pp-sec-label">Password</div>
                      <div className="pp-sec-sub">Last changed — never</div>
                    </div>
                  </div>
                  <button className="pp-sec-action">Update</button>
                </div>
                <div className="pp-security-row">
                  <div className="pp-sec-left">
                    <div className="pp-sec-icon"><Calendar size={15} /></div>
                    <div>
                      <div className="pp-sec-label">Account status</div>
                      <div className="pp-sec-sub">
                        <span className="pp-status-dot" />
                        Active
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pp-security-row">
                  <div className="pp-sec-left">
                    <div className="pp-sec-icon"><LogOut size={15} /></div>
                    <div>
                      <div className="pp-sec-label">Sign out</div>
                      <div className="pp-sec-sub">Sign out of your account on this device</div>
                    </div>
                  </div>
                  <button className="pp-sec-action" style={{ color: 'rgba(239,68,68,0.75)' }} onClick={handleLogout}>
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  )
}

export default ProfilePage;