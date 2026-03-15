import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, BookOpen, ArrowRight, Sparkles, X } from 'lucide-react';
import { ExpandProfile } from "./ExpandProfile";
import { useNavigate } from 'react-router-dom';

const courses = [
  "Computer Science","Software Engineering","Information Technology","Law","Economics",
  "Business Administration","Accounting","Finance","Marketing","Mass Communication",
  "Political Science","International Relations","Medicine","Nursing","Pharmacy",
  "Engineering (Civil)","Engineering (Mechanical)","Engineering (Electrical)",
  "Architecture","Psychology","Sociology","English Language","Mathematics",
  "Physics","Chemistry","Biology"
];

const popularCourses = [
  { name: "Computer Science", icon: "💻", tag: "Tech & Innovation" },
  { name: "Law", icon: "⚖️", tag: "Justice & Policy" },
  { name: "Economics", icon: "📈", tag: "Finance & Markets" },
  { name: "Business Administration", icon: "💼", tag: "Leadership & Strategy" },
  { name: "Medicine", icon: "🩺", tag: "Health & Care" },
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
        try { const p = JSON.parse(storedUser); return p.firstName || p.firstname || ''; } catch {}
      }
      return '';
    };
    const rawName = getStoredFirstName();
    if (rawName) setFirstname(rawName.trim().charAt(0).toUpperCase() + rawName.trim().slice(1).toLowerCase());
  }, []);

  const filteredCourses = courses.filter(c => c.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleContinue = () => {
    if (selectedCourse) navigate(`/career-path?course=${encodeURIComponent(selectedCourse)}`);
  };

  const handleCourseSelect = (course) => {
    setSelectedCourse(course); setSearchTerm(course); setIsDropdownOpen(false);
  };

  const handleClear = () => {
    setSelectedCourse(''); setSearchTerm(''); inputRef.current?.focus();
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root { --green-core: #22c55e; --green-bright: #4ade80; --green-deep: #15803d; --surface: rgba(255,255,255,0.03); --surface-2: rgba(255,255,255,0.06); --border: rgba(255,255,255,0.08); --border-green: rgba(34,197,94,0.35); --text-primary: #f0fdf4; --text-muted: #6b7280; --bg: #080d0a; }
        .csh-root { min-height: 100vh; background: var(--bg); color: var(--text-primary); font-family: 'DM Sans', sans-serif; position: relative; overflow-x: hidden; }
        .csh-root::before { content: ''; position: fixed; inset: 0; background-image: linear-gradient(rgba(34,197,94,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.04) 1px, transparent 1px); background-size: 60px 60px; pointer-events: none; z-index: 0; }
        .csh-orb { position: fixed; border-radius: 50%; pointer-events: none; filter: blur(130px); z-index: 0; }
        .csh-orb-1 { width: 700px; height: 700px; background: radial-gradient(circle, rgba(34,197,94,0.09) 0%, transparent 70%); top: -250px; left: -150px; animation: orb-drift 9s ease-in-out infinite alternate; }
        .csh-orb-2 { width: 550px; height: 550px; background: radial-gradient(circle, rgba(21,128,61,0.08) 0%, transparent 70%); bottom: -200px; right: -100px; animation: orb-drift 12s ease-in-out infinite alternate-reverse; }
        @keyframes orb-drift { from { transform: translate(0,0); } to { transform: translate(50px,40px); } }

        .csh-header { position: relative; z-index: 20; display: flex; justify-content: space-between; align-items: center; padding: 20px 40px; border-bottom: 1px solid var(--border); backdrop-filter: blur(12px); }
        .csh-logo { display: flex; align-items: center; gap: 10px; }
        .csh-logo-mark { width: 36px; height: 36px; background: linear-gradient(135deg, var(--green-core), var(--green-deep)); border-radius: 10px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 20px rgba(34,197,94,0.4); }
        .csh-logo-text { font-family: 'Instrument Serif', serif; font-size: 22px; background: linear-gradient(90deg, #fff, var(--green-bright)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }

        .csh-main { position: relative; z-index: 10; max-width: 860px; margin: 0 auto; padding: 64px 40px 80px; }

        /* Greeting hero */
        .csh-hero { text-align: center; margin-bottom: 56px; }
        .csh-greeting { font-family: 'Instrument Serif', serif; font-size: clamp(36px, 6vw, 68px); font-weight: 400; color: var(--text-primary); line-height: 1.1; margin-bottom: 12px; opacity: 0; animation: fade-up 0.6s 0.1s ease forwards; display: flex; align-items: center; justify-content: center; gap: 12px; flex-wrap: wrap; }
        .csh-greeting em { font-style: italic; background: linear-gradient(90deg, var(--green-core), var(--green-bright)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .csh-wave { display: inline-block; animation: wave 1.5s ease-in-out infinite; font-style: normal; -webkit-text-fill-color: initial; background: none; }
        @keyframes wave { 0%,100% { transform: rotate(0deg); } 25% { transform: rotate(20deg); } 75% { transform: rotate(-10deg); } }
        .csh-welcome { font-family: 'Instrument Serif', serif; font-size: clamp(18px, 3vw, 28px); color: var(--green-bright); font-style: italic; margin-bottom: 14px; opacity: 0; animation: fade-up 0.6s 0.2s ease forwards; }
        .csh-subtext { font-size: 15px; line-height: 1.7; color: var(--text-muted); max-width: 460px; margin: 0 auto; opacity: 0; animation: fade-up 0.6s 0.3s ease forwards; }

        /* Search panel */
        .csh-panel { background: var(--surface); border: 1px solid var(--border); border-radius: 28px; padding: 40px 40px 36px; margin-bottom: 24px; position: relative; overflow: hidden; opacity: 0; animation: fade-up 0.6s 0.4s ease forwards; }
        .csh-panel::before { content: ''; position: absolute; top: 0; left: 32px; right: 32px; height: 1px; background: linear-gradient(90deg, transparent, var(--border-green), transparent); }
        .csh-panel-label { text-align: center; font-family: 'Instrument Serif', serif; font-size: 20px; font-weight: 400; color: rgba(255,255,255,0.8); margin-bottom: 28px; }
        .csh-panel-label span { color: var(--green-bright); font-style: italic; }

        /* Input */
        .csh-input-wrap { position: relative; }
        .csh-input-box { position: relative; border-radius: 16px; transition: all 0.3s ease; background: rgba(0,0,0,0.3); border: 1px solid var(--border); }
        .csh-input-box.focused { border-color: var(--border-green); box-shadow: 0 0 0 3px rgba(34,197,94,0.08), 0 8px 32px rgba(0,0,0,0.3); }
        .csh-search-icon { position: absolute; left: 20px; top: 50%; transform: translateY(-50%); color: var(--text-muted); transition: color 0.3s; pointer-events: none; z-index: 2; }
        .csh-input-box.focused .csh-search-icon { color: var(--green-bright); }
        .csh-input { width: 100%; padding: 18px 52px; background: transparent; border: none; outline: none; font-size: 16px; color: var(--text-primary); font-family: 'DM Sans', sans-serif; }
        .csh-input::placeholder { color: var(--text-muted); }
        .csh-chevron { position: absolute; right: 20px; top: 50%; transform: translateY(-50%); color: var(--text-muted); transition: all 0.3s; pointer-events: none; }
        .csh-input-box.focused .csh-chevron { color: var(--green-bright); transform: translateY(-50%) rotate(180deg); }
        .csh-clear-btn { position: absolute; right: 20px; top: 50%; transform: translateY(-50%); width: 28px; height: 28px; border-radius: 50%; background: var(--surface-2); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--text-muted); transition: all 0.2s; z-index: 2; }
        .csh-clear-btn:hover { background: rgba(239,68,68,0.15); border-color: rgba(239,68,68,0.3); color: #f87171; }

        /* Dropdown */
        .csh-dropdown { position: absolute; top: calc(100% + 8px); left: 0; right: 0; background: #0d1610; border: 1px solid var(--border-green); border-radius: 16px; max-height: 260px; overflow-y: auto; z-index: 100; box-shadow: 0 24px 60px rgba(0,0,0,0.6); animation: dropdown-open 0.2s ease forwards; }
        @keyframes dropdown-open { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        .csh-dropdown::-webkit-scrollbar { width: 4px; }
        .csh-dropdown::-webkit-scrollbar-thumb { background: var(--border-green); border-radius: 4px; }
        .csh-dropdown-item { width: 100%; text-align: left; padding: 14px 20px; font-size: 14px; color: rgba(255,255,255,0.8); background: transparent; border: none; cursor: pointer; transition: all 0.15s; border-bottom: 1px solid rgba(255,255,255,0.04); font-family: 'DM Sans', sans-serif; display: flex; align-items: center; gap: 10px; }
        .csh-dropdown-item:last-child { border-bottom: none; }
        .csh-dropdown-item:hover { background: rgba(34,197,94,0.08); color: var(--text-primary); padding-left: 24px; }
        .csh-item-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--border); flex-shrink: 0; transition: background 0.2s; }
        .csh-dropdown-item:hover .csh-item-dot { background: var(--green-core); }
        .csh-dropdown-empty { padding: 20px; text-align: center; color: var(--text-muted); font-size: 13px; }

        /* Selected */
        .csh-selected { margin-top: 20px; background: rgba(34,197,94,0.07); border: 1px solid var(--border-green); border-radius: 16px; padding: 16px 20px; display: flex; align-items: center; gap: 14px; animation: fade-up 0.3s ease forwards; }
        .csh-selected-icon { width: 44px; height: 44px; flex-shrink: 0; background: rgba(34,197,94,0.12); border: 1px solid var(--border-green); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: var(--green-bright); }
        .csh-selected-label { font-size: 11px; font-weight: 500; color: var(--green-bright); text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 3px; }
        .csh-selected-name { font-size: 17px; font-weight: 600; color: var(--text-primary); }

        /* CTA */
        .csh-cta-wrap { display: flex; flex-direction: column; align-items: center; gap: 12px; margin-top: 32px; opacity: 0; animation: fade-up 0.6s 0.5s ease forwards; }
        .csh-continue-btn { display: inline-flex; align-items: center; gap: 10px; padding: 16px 44px; border-radius: 16px; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1); font-family: 'DM Sans', sans-serif; border: none; position: relative; overflow: hidden; }
        .csh-continue-btn.enabled { background: linear-gradient(135deg, var(--green-core), var(--green-deep)); color: #fff; box-shadow: 0 8px 32px rgba(34,197,94,0.35); }
        .csh-continue-btn.enabled:hover { transform: translateY(-2px) scale(1.02); box-shadow: 0 14px 40px rgba(34,197,94,0.5); }
        .csh-continue-btn.enabled::after { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(255,255,255,0.12), transparent); pointer-events: none; }
        .csh-continue-btn.disabled { background: rgba(255,255,255,0.05); border: 1px solid var(--border); color: var(--text-muted); cursor: not-allowed; }
        .csh-btn-arrow { transition: transform 0.3s ease; }
        .csh-continue-btn.enabled:hover .csh-btn-arrow { transform: translateX(4px); }
        .csh-hint { font-size: 13px; color: var(--text-muted); }
        .csh-hint span { color: var(--green-bright); font-weight: 500; }

        /* Popular */
        .csh-popular { margin-top: 64px; opacity: 0; animation: fade-up 0.6s 0.6s ease forwards; }
        .csh-popular-label { text-align: center; font-family: 'Instrument Serif', serif; font-size: 24px; font-weight: 400; color: var(--text-primary); margin-bottom: 24px; }
        .csh-popular-label em { font-style: italic; color: var(--green-bright); }
        .csh-pop-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; }
        @media (max-width: 760px) { .csh-pop-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 480px) { .csh-pop-grid { grid-template-columns: 1fr; } }
        .csh-pop-card { background: var(--surface); border: 1px solid var(--border); border-radius: 18px; padding: 20px 16px; cursor: pointer; transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1); position: relative; overflow: hidden; text-align: center; }
        .csh-pop-card::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(34,197,94,0.07), transparent 60%); opacity: 0; transition: opacity 0.3s; border-radius: inherit; }
        .csh-pop-card:hover { border-color: var(--border-green); transform: translateY(-3px); }
        .csh-pop-card:hover::before { opacity: 1; }
        .csh-pop-card.selected { border-color: var(--green-core); background: rgba(34,197,94,0.05); box-shadow: 0 0 24px rgba(34,197,94,0.12); }
        .csh-pop-card.selected::before { opacity: 1; }
        .csh-pop-emoji { font-size: 28px; margin-bottom: 10px; display: block; }
        .csh-pop-name { font-size: 13px; font-weight: 600; color: var(--text-primary); margin-bottom: 4px; line-height: 1.3; }
        .csh-pop-tag { font-size: 10px; color: var(--text-muted); transition: color 0.2s; }
        .csh-pop-card:hover .csh-pop-tag, .csh-pop-card.selected .csh-pop-tag { color: var(--green-bright); }

        @keyframes fade-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 640px) { .csh-main { padding: 48px 20px 60px; } .csh-header { padding: 16px 20px; } .csh-panel { padding: 28px 20px 24px; } }
      `}</style>

      <div className="csh-root">
        <div className="csh-orb csh-orb-1" /><div className="csh-orb csh-orb-2" />

        <header className="csh-header">
          <div className="csh-logo"><div className="csh-logo-mark"><Sparkles size={16} color="#fff" /></div><span className="csh-logo-text">Pathwise AI</span></div>
          <ExpandProfile />
        </header>

        <main className="csh-main">
          {/* Greeting hero */}
          <div className="csh-hero">
            <h1 className="csh-greeting">
              Hello <em>{firstname || "there"}</em> <span className="csh-wave">👋</span>
            </h1>
            <p className="csh-welcome">Welcome to Pathwise AI!</p>
            <p className="csh-subtext">
              Let's discover your perfect career path. Tell us about your academic background — what course are you studying?
            </p>
          </div>

          {/* Search panel */}
          <div className="csh-panel">
            <p className="csh-panel-label">What course are you studying <span>(or did you study)?</span></p>

            <div className="csh-input-wrap" ref={dropdownRef}>
              <div className={`csh-input-box ${inputFocused ? 'focused' : ''}`}>
                <Search size={18} className="csh-search-icon" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search or type your course…"
                  value={searchTerm}
                  className="csh-input"
                  onChange={e => { setSearchTerm(e.target.value); setSelectedCourse(''); setIsDropdownOpen(true); }}
                  onFocus={() => { setInputFocused(true); setIsDropdownOpen(true); }}
                  onBlur={() => setInputFocused(false)}
                />
                {searchTerm
                  ? <button className="csh-clear-btn" onMouseDown={handleClear}><X size={12} /></button>
                  : <ChevronDown size={18} className="csh-chevron" />
                }
              </div>

              {isDropdownOpen && (
                <div className="csh-dropdown">
                  {filteredCourses.length > 0
                    ? filteredCourses.map((course, i) => (
                      <button key={i} className="csh-dropdown-item" onMouseDown={() => handleCourseSelect(course)}>
                        <span className="csh-item-dot" />{course}
                      </button>
                    ))
                    : <div className="csh-dropdown-empty">No courses found for "{searchTerm}"</div>
                  }
                </div>
              )}
            </div>

            {selectedCourse && (
              <div className="csh-selected">
                <div className="csh-selected-icon"><BookOpen size={20} /></div>
                <div>
                  <div className="csh-selected-label">Selected Course</div>
                  <div className="csh-selected-name">{selectedCourse}</div>
                </div>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="csh-cta-wrap">
            <button
              onClick={handleContinue}
              disabled={!selectedCourse}
              className={`csh-continue-btn ${selectedCourse ? 'enabled' : 'disabled'}`}
            >
              Continue to Career Paths
              <ArrowRight size={18} className="csh-btn-arrow" />
            </button>
            <p className="csh-hint">
              {selectedCourse
                ? <><span>{selectedCourse}</span> selected — click continue to proceed</>
                : 'Select a course above to continue'
              }
            </p>
          </div>

          {/* Popular */}
          <div className="csh-popular">
            <p className="csh-popular-label">Popular <em>courses</em></p>
            <div className="csh-pop-grid">
              {popularCourses.map((course, i) => (
                <button
                  key={i}
                  className={`csh-pop-card ${selectedCourse === course.name ? 'selected' : ''}`}
                  onClick={() => handleCourseSelect(course.name)}
                  style={{ opacity: 0, animation: `fade-up 0.5s ${0.65 + i * 0.07}s ease forwards` }}
                >
                  <span className="csh-pop-emoji">{course.icon}</span>
                  <div className="csh-pop-name">{course.name}</div>
                  <div className="csh-pop-tag">{course.tag}</div>
                </button>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};