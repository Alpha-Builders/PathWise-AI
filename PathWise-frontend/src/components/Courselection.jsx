import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, BookOpen, ArrowRight, Sparkles, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// import nav from '../assets/hamburger.svg';
// import notifi from '../assets/notifi.svg';
// import profile from '../assets/profile.svg';

const courses = [
  "Computer Science",
  "Software Engineering",
  "Information Technology",
  "Law",
  "Economics",
  "Business Administration",
  "Accounting",
  "Finance",
  "Marketing",
  "Mass Communication",
  "Political Science",
  "International Relations",
  "Medicine",
  "Nursing",
  "Pharmacy",
  "Engineering (Civil)",
  "Engineering (Mechanical)",
  "Engineering (Electrical)",
  "Architecture",
  "Psychology",
  "Sociology",
  "English Language",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology"
];

const popularCourses = [
  { name: "Computer Science", icon: "💻", tag: "Tech & Innovation" },
  { name: "Law", icon: "⚖️", tag: "Justice & Policy" },
  { name: "Economics", icon: "📈", tag: "Finance & Markets" },
  { name: "Business Administration", icon: "💼", tag: "Leadership & Strategy" },
  { name: "Medicine", icon: "🩺", tag: "Health & Care" },
  { name: "Architecture", icon: "🏛️", tag: "Design & Space" },
];

export const Courselection = () => {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [firstname, setFirstname] = useState('');
  const [inputFocused, setInputFocused] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getStoredFirstName = () => {
      let name = localStorage.getItem("firstName") || localStorage.getItem("firstname");
      if (name) return name;
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          return parsedUser.firstName || parsedUser.firstname || '';
        } catch (e) { return ''; }
      }
      return '';
    };
    const rawName = getStoredFirstName();
    if (rawName) {
      setFirstname(rawName.trim().charAt(0).toUpperCase() + rawName.trim().slice(1).toLowerCase());
    }
  }, []);

  const filteredCourses = courses.filter(c =>
    c.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleContinue = () => {
    if (selectedCourse) navigate(`/career-path?course=${encodeURIComponent(selectedCourse)}`);
  };

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    setSearchTerm(course);
    setIsDropdownOpen(false);
  };

  const handleClear = () => {
    setSelectedCourse('');
    setSearchTerm('');
    inputRef.current?.focus();
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --green-core: #22c55e;
          --green-bright: #4ade80;
          --green-deep: #15803d;
          --green-glow: rgba(34,197,94,0.15);
          --green-muted: rgba(34,197,94,0.08);
          --surface: rgba(255,255,255,0.03);
          --surface-2: rgba(255,255,255,0.055);
          --border: rgba(255,255,255,0.08);
          --border-green: rgba(34,197,94,0.38);
          --text-primary: #f0fdf4;
          --text-secondary: #86efac;
          --text-muted: #6b7280;
          --bg: #080d0a;
        }

        .cs-root {
          min-height: 100vh;
          background: var(--bg);
          color: var(--text-primary);
          font-family: 'Poppins', sans-serif;
          position: relative;
          overflow-x: hidden;
        }

        /* Grid */
        .cs-root::before {
          content: '';
          position: fixed; inset: 0;
          background-image:
            linear-gradient(rgba(34,197,94,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34,197,94,0.04) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none; z-index: 0;
        }

        /* Orbs */
        .cs-orb {
          position: fixed; border-radius: 50%;
          pointer-events: none; filter: blur(130px); z-index: 0;
        }
        .cs-orb-1 {
          width: 700px; height: 700px;
          background: radial-gradient(circle, rgba(34,197,94,0.1) 0%, transparent 70%);
          top: -250px; left: -150px;
          animation: orb-drift 9s ease-in-out infinite alternate;
        }
        .cs-orb-2 {
          width: 550px; height: 550px;
          background: radial-gradient(circle, rgba(21,128,61,0.09) 0%, transparent 70%);
          bottom: -150px; right: -100px;
          animation: orb-drift 12s ease-in-out infinite alternate-reverse;
        }
        @keyframes orb-drift {
          from { transform: translate(0,0); }
          to   { transform: translate(50px, 40px); }
        }

        /* Header */
        .cs-header {
          position: relative; z-index: 20;
          display: flex; justify-content: space-between; align-items: center;
          padding: 20px 40px;
          border-bottom: 1px solid var(--border);
          backdrop-filter: blur(12px);
        }
        .cs-logo {
          display: flex; align-items: center; gap: 10px;
        }
        .cs-logo-mark {
          width: 36px; height: 36px;
          background: linear-gradient(135deg, var(--green-core), var(--green-deep));
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 20px rgba(34,197,94,0.4);
        }
        .cs-logo-text {
          font-family: 'Poppins', sans-serif;
          font-size: 22px;
          background: linear-gradient(90deg, #fff, var(--green-bright));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .cs-header-right { display: flex; gap: 8px; align-items: center; }
        .cs-icon-btn {
          position: relative; width: 40px; height: 40px;
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 12px; display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.2s ease; color: var(--text-muted);
        }
        .cs-icon-btn:hover {
          background: var(--surface-2); border-color: var(--border-green); color: var(--green-bright);
        }
        .cs-notif-dot {
          position: absolute; top: 8px; right: 8px;
          width: 7px; height: 7px; background: var(--green-core);
          border-radius: 50%; border: 1.5px solid var(--bg);
          animation: pulse-dot 2s ease infinite;
        }
        @keyframes pulse-dot {
          0%,100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.5); }
          50%      { box-shadow: 0 0 0 4px rgba(34,197,94,0); }
        }
        .cs-premium-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 8px 16px; border-radius: 10px;
          background: linear-gradient(135deg, var(--green-core), var(--green-deep));
          color: #fff; font-size: 12px; font-weight: 600;
          letter-spacing: 0.8px; text-transform: uppercase;
          cursor: pointer; transition: all 0.25s ease;
          border: none; font-family: 'Poppins', sans-serif;
          box-shadow: 0 4px 16px rgba(34,197,94,0.3);
        }
        .cs-premium-btn:hover {
          transform: translateY(-1px); box-shadow: 0 8px 24px rgba(34,197,94,0.45);
        }

        /* Main */
        .cs-main {
          position: relative; z-index: 10;
          max-width: 960px; margin: 0 auto;
          padding: 72px 40px 80px;
        }

        /* Hero */
        .cs-hero { text-align: center; margin-bottom: 64px; }
        .cs-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: var(--green-muted); border: 1px solid var(--border-green);
          border-radius: 100px; padding: 6px 16px;
          font-size: 12px; font-weight: 500; color: var(--green-bright);
          letter-spacing: 0.5px; text-transform: uppercase;
          margin-bottom: 28px;
          opacity: 0; animation: fade-up 0.6s 0.1s ease forwards;
        }
        .cs-headline {
          font-family: 'Poppins', sans-serif;
          font-size: clamp(40px, 5.5vw, 68px);
          line-height: 1.08; font-weight: 400; color: var(--text-primary);
          margin-bottom: 18px;
          opacity: 0; animation: fade-up 0.6s 0.2s ease forwards;
        }
        .cs-headline em {
          font-style: italic;
          background: linear-gradient(90deg, var(--green-core), var(--green-bright));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .cs-subtext {
          font-size: 16px; line-height: 1.7; color: var(--text-muted);
          max-width: 500px; margin: 0 auto;
          opacity: 0; animation: fade-up 0.6s 0.3s ease forwards;
        }

        /* Search panel */
        .cs-search-panel {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 28px;
          padding: 40px 40px 36px;
          margin-bottom: 24px;
          opacity: 0; animation: fade-up 0.6s 0.4s ease forwards;
          position: relative;
        }
        .cs-search-panel::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, var(--border-green), transparent);
        }
        .cs-search-label {
          text-align: center; margin-bottom: 28px;
          font-size: 18px; font-weight: 400; color: rgba(255,255,255,0.7);
          font-family: 'Poppins', sans-serif; letter-spacing: 0.2px;
        }
        .cs-search-label span { color: var(--green-bright); font-style: italic; }

        /* Input wrapper */
        .cs-input-wrap {
          position: relative;
        }
        .cs-input-box {
          position: relative;
          border-radius: 16px;
          transition: all 0.3s ease;
          background: rgba(0,0,0,0.3);
          border: 1px solid var(--border);
        }
        .cs-input-box.focused {
          border-color: var(--border-green);
          box-shadow: 0 0 0 3px rgba(34,197,94,0.08), 0 8px 32px rgba(0,0,0,0.3);
        }
        .cs-search-icon {
          position: absolute; left: 20px; top: 50%; transform: translateY(-50%);
          color: var(--text-muted); transition: color 0.3s; pointer-events: none;
          z-index: 2;
        }
        .cs-input-box.focused .cs-search-icon { color: var(--green-bright); }
        .cs-input {
          width: 100%; padding: 18px 52px 18px 52px;
          background: transparent; border: none; outline: none;
          font-size: 16px; color: var(--text-primary);
          font-family: 'Poppins', sans-serif;
        }
        .cs-input::placeholder { color: var(--text-muted); }
        .cs-chevron {
          position: absolute; right: 20px; top: 50%; transform: translateY(-50%);
          color: var(--text-muted); transition: all 0.3s; pointer-events: none;
        }
        .cs-input-box.focused .cs-chevron { color: var(--green-bright); transform: translateY(-50%) rotate(180deg); }
        .cs-clear-btn {
          position: absolute; right: 20px; top: 50%; transform: translateY(-50%);
          width: 28px; height: 28px; border-radius: 50%;
          background: var(--surface-2); border: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: var(--text-muted);
          transition: all 0.2s; z-index: 2;
        }
        .cs-clear-btn:hover { background: rgba(239,68,68,0.15); border-color: rgba(239,68,68,0.3); color: #f87171; }

        /* Dropdown */
        .cs-dropdown {
          position: absolute; top: calc(100% + 8px); left: 0; right: 0;
          background: #0d1610;
          border: 1px solid var(--border-green);
          border-radius: 16px;
          max-height: 260px; overflow-y: auto;
          z-index: 100;
          box-shadow: 0 24px 60px rgba(0,0,0,0.6);
          animation: dropdown-open 0.2s ease forwards;
        }
        @keyframes dropdown-open {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .cs-dropdown::-webkit-scrollbar { width: 4px; }
        .cs-dropdown::-webkit-scrollbar-track { background: transparent; }
        .cs-dropdown::-webkit-scrollbar-thumb { background: var(--border-green); border-radius: 4px; }
        .cs-dropdown-item {
          width: 100%; text-align: left;
          padding: 14px 20px;
          font-size: 15px; color: rgba(255,255,255,0.8);
          background: transparent; border: none; cursor: pointer;
          transition: all 0.15s ease;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          font-family: 'Poppins', sans-serif;
          display: flex; align-items: center; gap: 10px;
        }
        .cs-dropdown-item:last-child { border-bottom: none; }
        .cs-dropdown-item:hover {
          background: rgba(34,197,94,0.08); color: var(--text-primary);
          padding-left: 24px;
        }
        .cs-dropdown-item:hover .cs-item-dot { background: var(--green-core); }
        .cs-item-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--border); flex-shrink: 0;
          transition: background 0.2s;
        }
        .cs-dropdown-empty {
          padding: 20px; text-align: center;
          color: var(--text-muted); font-size: 14px;
        }

        /* Selected course pill */
        .cs-selected {
          margin-top: 20px;
          background: rgba(34,197,94,0.07);
          border: 1px solid var(--border-green);
          border-radius: 16px; padding: 16px 20px;
          display: flex; align-items: center; gap: 14px;
          animation: fade-up 0.3s ease forwards;
        }
        .cs-selected-icon {
          width: 44px; height: 44px; flex-shrink: 0;
          background: rgba(34,197,94,0.12);
          border: 1px solid var(--border-green);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          color: var(--green-bright);
        }
        .cs-selected-label {
          font-size: 11px; font-weight: 500; color: var(--green-bright);
          text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 3px;
        }
        .cs-selected-name {
          font-size: 17px; font-weight: 600; color: var(--text-primary);
        }

        /* CTA */
        .cs-cta-wrap {
          display: flex; justify-content: center; margin-top: 32px;
          opacity: 0; animation: fade-up 0.6s 0.5s ease forwards;
        }
        .cs-continue-btn {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 16px 44px; border-radius: 16px;
          font-size: 15px; font-weight: 600; cursor: pointer;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          font-family: 'Poppins', sans-serif; border: none;
          position: relative; overflow: hidden;
        }
        .cs-continue-btn.enabled {
          background: linear-gradient(135deg, var(--green-core), var(--green-deep));
          color: #fff;
          box-shadow: 0 8px 32px rgba(34,197,94,0.35);
        }
        .cs-continue-btn.enabled:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 14px 40px rgba(34,197,94,0.5);
        }
        .cs-continue-btn.enabled:hover .cs-btn-arrow { transform: translateX(4px); }
        .cs-continue-btn.enabled::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.12), transparent);
          pointer-events: none;
        }
        .cs-continue-btn.disabled {
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--border);
          color: var(--text-muted); cursor: not-allowed;
        }
        .cs-btn-arrow { transition: transform 0.3s ease; }

        /* Popular courses */
        .cs-popular {
          margin-top: 72px;
          opacity: 0; animation: fade-up 0.6s 0.6s ease forwards;
        }
        .cs-popular-header {
          display: flex; align-items: center; justify-content: center; gap: 12px;
          margin-bottom: 32px;
        }
        .cs-popular-title {
          font-family: 'Poppins', sans-serif;
          font-size: 28px; font-weight: 400; color: var(--text-primary);
        }
        .cs-popular-title em {
          font-style: italic; color: var(--green-bright);
        }

        .cs-popular-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;
        }
        @media (max-width: 680px) {
          .cs-popular-grid { grid-template-columns: repeat(2, 1fr); }
          .cs-main { padding: 60px 20px 60px; }
          .cs-header { padding: 16px 20px; }
          .cs-search-panel { padding: 28px 20px 24px; }
        }
        @media (max-width: 420px) {
          .cs-popular-grid { grid-template-columns: 1fr; }
        }

        .cs-pop-card {
          position: relative;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 28px 24px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          overflow: hidden;
          text-align: left;
        }
        .cs-pop-card::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(34,197,94,0.07), transparent 65%);
          opacity: 0; transition: opacity 0.3s; border-radius: inherit;
        }
        .cs-pop-card:hover { border-color: var(--border-green); transform: translateY(-3px); }
        .cs-pop-card:hover::before { opacity: 1; }
        .cs-pop-card.selected-pop {
          border-color: var(--green-core);
          background: rgba(34,197,94,0.05);
          box-shadow: 0 0 32px rgba(34,197,94,0.12);
        }
        .cs-pop-card.selected-pop::before { opacity: 1; }

        .cs-pop-emoji {
          font-size: 32px; margin-bottom: 14px; display: block;
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.4));
        }
        .cs-pop-name {
          font-size: 15px; font-weight: 600; color: var(--text-primary);
          margin-bottom: 6px; line-height: 1.3;
        }
        .cs-pop-tag {
          font-size: 11px; color: var(--text-muted);
          font-weight: 400; letter-spacing: 0.3px;
        }
        .cs-pop-card:hover .cs-pop-tag { color: var(--green-bright); }
        .cs-pop-card.selected-pop .cs-pop-tag { color: var(--green-bright); }

        .cs-pop-check {
          position: absolute; top: 14px; right: 14px;
          width: 22px; height: 22px; border-radius: 50%;
          background: var(--green-core);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 12px rgba(34,197,94,0.5);
          animation: pop-in 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards;
        }
        @keyframes pop-in {
          from { transform: scale(0); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }

        @keyframes fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="cs-root">
        <div className="cs-orb cs-orb-1" />
        <div className="cs-orb cs-orb-2" />

        {/* Header */}
        <header className="cs-header">
          <div className="cs-logo">
            <div className="cs-logo-mark">
              <Sparkles size={16} color="#fff" />
            </div>
            <span className="cs-logo-text">Pathwise AI</span>
          </div>
          <div className="cs-header-right">
            <button className="cs-premium-btn">
              <Sparkles size={12} />
              Premium
            </button>
            <button className="cs-icon-btn">
              {/* Bell icon placeholder — swap with img src={notifi} if needed */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <span className="cs-notif-dot" />
            </button>
            <button className="cs-icon-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </button>
          </div>
        </header>

        <main className="cs-main">
          {/* Hero */}
          <div className="cs-hero">
            <div className="cs-badge">
              <Sparkles size={11} />
              Career Discovery
            </div>
            <h1 className="cs-headline">
              What are you<br />
              <em>studying?</em>
            </h1>
            <p className="cs-subtext">
              Tell us your course and we'll map out a personalised career path
              built around your strengths and the future you want.
            </p>
          </div>

          {/* Search Panel */}
          <div className="cs-search-panel">
            <p className="cs-search-label">
              What course are you studying <span>(or did you study)?</span>
            </p>

            <div className="cs-input-wrap" ref={dropdownRef}>
              <div className={`cs-input-box ${inputFocused ? 'focused' : ''}`}>
                <Search size={18} className="cs-search-icon" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search or type your course…"
                  value={searchTerm}
                  className="cs-input"
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setSelectedCourse('');
                    setIsDropdownOpen(true);
                  }}
                  onFocus={() => { setInputFocused(true); setIsDropdownOpen(true); }}
                  onBlur={() => setInputFocused(false)}
                />
                {searchTerm
                  ? <button className="cs-clear-btn" onMouseDown={handleClear}><X size={12} /></button>
                  : <ChevronDown size={18} className="cs-chevron" />
                }
              </div>

              {isDropdownOpen && (
                <div className="cs-dropdown">
                  {filteredCourses.length > 0
                    ? filteredCourses.map((course, i) => (
                      <button
                        key={i}
                        className="cs-dropdown-item"
                        onMouseDown={() => handleCourseSelect(course)}
                      >
                        <span className="cs-item-dot" />
                        {course}
                      </button>
                    ))
                    : <div className="cs-dropdown-empty">No courses found for "{searchTerm}"</div>
                  }
                </div>
              )}
            </div>

            {/* Selected course display */}
            {selectedCourse && (
              <div className="cs-selected">
                <div className="cs-selected-icon">
                  <BookOpen size={20} />
                </div>
                <div>
                  <div className="cs-selected-label">Selected Course</div>
                  <div className="cs-selected-name">{selectedCourse}</div>
                </div>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="cs-cta-wrap">
            <button
              onClick={handleContinue}
              disabled={!selectedCourse}
              className={`cs-continue-btn ${selectedCourse ? 'enabled' : 'disabled'}`}
            >
              Continue to Career Paths
              <ArrowRight size={18} className="cs-btn-arrow" />
            </button>
          </div>

          {/* Popular Courses */}
          <div className="cs-popular">
            <div className="cs-popular-header">
              <h2 className="cs-popular-title">
                Popular <em>courses</em>
              </h2>
            </div>

            <div className="cs-popular-grid">
              {popularCourses.map((course, i) => (
                <button
                  key={i}
                  className={`cs-pop-card ${selectedCourse === course.name ? 'selected-pop' : ''}`}
                  onClick={() => handleCourseSelect(course.name)}
                  style={{ animationDelay: `${0.65 + i * 0.07}s`, opacity: 0, animation: `fade-up 0.5s ${0.65 + i * 0.07}s ease forwards` }}
                >
                  {selectedCourse === course.name && (
                    <div className="cs-pop-check">
                      <svg width="11" height="11" viewBox="0 0 20 20" fill="white">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                  <span className="cs-pop-emoji">{course.icon}</span>
                  <div className="cs-pop-name">{course.name}</div>
                  <div className="cs-pop-tag">{course.tag}</div>
                </button>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};