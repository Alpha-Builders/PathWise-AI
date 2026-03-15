import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, Sparkles, ChevronLeft, X, CheckCircle2 } from "lucide-react";

import careerPaths from "../data/CareerpathData";

export default function CareerPathPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [paths, setPaths] = useState([]);

  // 🔑 handle unlock click
  const toggleUnlock = () => {
    setIsProModalOpen(true);
  };

  const closeModal = () => {
    setIsProModalOpen(false);
  };

  const createPageUrl = (pageName) => {
    const pageRoutes = {
      SkillsPage: "/skills",
      CareerPathPage: "/career-path",
      JobRolePage: "/job-roles",
      CourseSelectionPage: "/course-selection",
    };
    return pageRoutes[pageName] || "/";
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const course = urlParams.get("course") || "";
    setSelectedCourse(course);

    if (
      course &&
      Array.isArray(careerPaths[course]) &&
      careerPaths[course].length > 0
    ) {
      setPaths(careerPaths[course]);
    } else {
      setPaths([]);
    }
  }, [location.search]);

  const handlePathSelect = (pathId) => {
    navigate(
      createPageUrl("JobRolePage") +
        `?course=${encodeURIComponent(selectedCourse)}&path=${pathId}`
    );
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --green-core: #22c55e;
          --green-bright: #4ade80;
          --green-deep: #15803d;
          --amber: #f59e0b;
          --amber-dim: rgba(245,158,11,0.1);
          --amber-border: rgba(245,158,11,0.3);
          --surface: rgba(255,255,255,0.03);
          --surface-2: rgba(255,255,255,0.06);
          --border: rgba(255,255,255,0.08);
          --border-green: rgba(34,197,94,0.35);
          --text-primary: #f0fdf4;
          --text-muted: #6b7280;
          --bg: #080d0a;
        }

        .cp-root {
          min-height: 100vh;
          background: var(--bg);
          color: var(--text-primary);
          font-family: 'Poppins', sans-serif;
          position: relative;
          overflow-x: hidden;
        }
        .cp-root::before {
          content: '';
          position: fixed; inset: 0;
          background-image:
            linear-gradient(rgba(34,197,94,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34,197,94,0.04) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none; z-index: 0;
        }

        .cp-orb {
          position: fixed; border-radius: 50%;
          pointer-events: none; filter: blur(130px); z-index: 0;
        }
        .cp-orb-1 {
          width: 700px; height: 700px;
          background: radial-gradient(circle, rgba(34,197,94,0.09) 0%, transparent 70%);
          top: -250px; left: -150px;
          animation: orb-drift 9s ease-in-out infinite alternate;
        }
        .cp-orb-2 {
          width: 550px; height: 550px;
          background: radial-gradient(circle, rgba(21,128,61,0.08) 0%, transparent 70%);
          bottom: -200px; right: -100px;
          animation: orb-drift 12s ease-in-out infinite alternate-reverse;
        }
        @keyframes orb-drift {
          from { transform: translate(0,0); }
          to   { transform: translate(50px, 40px); }
        }

        /* Header */
        .cp-header {
          position: relative; z-index: 20;
          display: flex; justify-content: space-between; align-items: center;
          padding: 20px 40px;
          border-bottom: 1px solid var(--border);
          backdrop-filter: blur(12px);
        }
        .cp-logo { display: flex; align-items: center; gap: 10px; }
        .cp-logo-mark {
          width: 36px; height: 36px;
          background: linear-gradient(135deg, var(--green-core), var(--green-deep));
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 20px rgba(34,197,94,0.4);
        }
        .cp-logo-text {
          font-family: 'Poppins', sans-serif; font-size: 22px;
          background: linear-gradient(90deg, #fff, var(--green-bright));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }

        /* Main */
        .cp-main {
          position: relative; z-index: 10;
          max-width: 1200px; margin: 0 auto;
          padding: 64px 40px 80px;
        }

        /* Hero */
        .cp-hero { text-align: center; margin-bottom: 64px; }
        .cp-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(34,197,94,0.08); border: 1px solid var(--border-green);
          border-radius: 100px; padding: 6px 16px;
          font-size: 12px; font-weight: 500; color: var(--green-bright);
          letter-spacing: 0.5px; text-transform: uppercase;
          margin-bottom: 28px;
          opacity: 0; animation: fade-up 0.6s 0.1s ease forwards;
        }
        .cp-headline {
          font-family: 'Poppins', sans-serif;
          font-size: clamp(36px, 5vw, 62px);
          line-height: 1.1; font-weight: 400; color: var(--text-primary);
          margin-bottom: 16px;
          opacity: 0; animation: fade-up 0.6s 0.2s ease forwards;
        }
        .cp-headline em {
          font-style: italic;
          background: linear-gradient(90deg, var(--green-core), var(--green-bright));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .cp-subtext {
          font-size: 16px; line-height: 1.7; color: var(--text-muted);
          max-width: 520px; margin: 0 auto;
          opacity: 0; animation: fade-up 0.6s 0.3s ease forwards;
        }

        /* Empty state */
        .cp-empty {
          max-width: 520px; margin: 0 auto 48px;
          background: rgba(239,68,68,0.06);
          border: 1px solid rgba(239,68,68,0.25);
          border-radius: 24px; padding: 40px; text-align: center;
          opacity: 0; animation: fade-up 0.6s 0.4s ease forwards;
        }
        .cp-empty-title { font-size: 18px; font-weight: 600; color: #f87171; margin-bottom: 8px; }
        .cp-empty-sub { font-size: 14px; color: var(--text-muted); line-height: 1.6; }

        /* Grid */
        .cp-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px; margin-bottom: 48px;
        }
        @media (max-width: 960px) { .cp-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 640px) {
          .cp-grid { grid-template-columns: 1fr; }
          .cp-main { padding: 48px 20px 60px; }
          .cp-header { padding: 16px 20px; }
        }

        /* Card */
        .cp-card {
          position: relative;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 24px; padding: 28px;
          display: flex; flex-direction: column;
          transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
          overflow: hidden; opacity: 0;
        }
        .cp-card::before {
          content: '';
            pointer-events: none;
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(34,197,94,0.07), transparent 60%);
          opacity: 0; transition: opacity 0.35s; border-radius: inherit;
        }
        .cp-card::after {
          content: '';
            pointer-events: none;
          position: absolute; top: 0; left: 24px; right: 24px; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(34,197,94,0.4), transparent);
          opacity: 0; transition: opacity 0.35s;
        }
        .cp-card:hover { border-color: var(--border-green); transform: translateY(-4px); box-shadow: 0 20px 60px rgba(0,0,0,0.4); }
        .cp-card:hover::before, .cp-card:hover::after { opacity: 1; }

        .cp-card-header { display: flex; align-items: center; gap: 16px; margin-bottom: 16px; }
        .cp-card-icon-wrap {
          width: 56px; height: 56px; flex-shrink: 0;
          background: rgba(34,197,94,0.1); border: 1px solid var(--border-green);
          border-radius: 16px; display: flex; align-items: center; justify-content: center;
          color: var(--green-bright); transition: all 0.3s ease;
        }
        .cp-card:hover .cp-card-icon-wrap {
          background: rgba(34,197,94,0.18); box-shadow: 0 0 24px rgba(34,197,94,0.2);
        }
        .cp-card-name {
          font-family: 'Poppins', sans-serif;
          font-size: 20px; font-weight: 400; color: var(--text-primary); line-height: 1.2;
        }
        .cp-card-desc {
          font-size: 13px; line-height: 1.65;
          color: var(--text-muted); margin-bottom: 20px; flex: 1;
        }

        /* Stats box */
        .cp-stats-box {
          background: rgba(0,0,0,0.2); border: 1px solid var(--border);
          border-radius: 14px; padding: 14px 16px; margin-bottom: 20px;
          min-height: 52px; display: flex; align-items: center;
        }
        .cp-stats-inner { width: 100%; }
        .cp-stat-row {
          display: flex; align-items: center; justify-content: space-between;
          padding: 7px 0; border-bottom: 1px solid rgba(255,255,255,0.04);
          font-size: 13px;
        }
        .cp-stat-row:last-child { border-bottom: none; padding-bottom: 0; }
        .cp-stat-row:first-child { padding-top: 0; }
        .cp-stat-label { color: var(--text-muted); }
        .cp-stat-val-orange { font-weight: 600; color: #f97316; }
        .cp-stat-val-green  { font-weight: 600; color: var(--green-bright); }
        .cp-stat-val-purple { font-weight: 600; color: #a78bfa; }

        /* Lock row */
        .cp-lock-row {
          display: flex; align-items: center; gap: 10px; cursor: pointer; width: 100%;
        }
        .cp-lock-icon-wrap {
          width: 28px; height: 28px; border-radius: 8px;
          background: var(--amber-dim); border: 1px solid var(--amber-border);
          display: flex; align-items: center; justify-content: center;
          color: var(--amber); flex-shrink: 0; transition: all 0.2s;
        }
        .cp-lock-row:hover .cp-lock-icon-wrap { background: rgba(245,158,11,0.18); }
        .cp-lock-hint { font-size: 12px; color: rgba(245,158,11,0.65); font-style: italic; transition: color 0.2s; }
        .cp-lock-row:hover .cp-lock-hint { color: var(--amber); }

        /* Companies */
        .cp-companies { margin-bottom: 20px; }
        .cp-companies-label {
          font-size: 10px; font-weight: 600; letter-spacing: 1px;
          color: var(--text-muted); text-transform: uppercase; margin-bottom: 8px;
        }
        .cp-company-tags { display: flex; flex-wrap: wrap; gap: 6px; }
        .cp-company-tag {
          font-size: 11px; font-weight: 500; padding: 4px 12px;
          border-radius: 100px; background: rgba(34,197,94,0.08);
          border: 1px solid rgba(34,197,94,0.2); color: var(--green-bright);
        }

        /* Card CTA */
        .cp-card-cta {
          display: flex; align-items: center; justify-content: space-between;
          cursor: pointer; padding-top: 16px;
          border-top: 1px solid var(--border); transition: all 0.2s; margin-top: auto;
        }
        .cp-cta-label { font-size: 13px; font-weight: 600; color: var(--green-core); transition: color 0.2s; }
        .cp-card-cta:hover .cp-cta-label { color: var(--green-bright); }
        .cp-cta-circle {
          width: 36px; height: 36px; border-radius: 50%;
          background: rgba(34,197,94,0.1); border: 1px solid var(--border-green);
          display: flex; align-items: center; justify-content: center;
          color: var(--green-bright); transition: all 0.2s;
        }
        .cp-card-cta:hover .cp-cta-circle { background: rgba(34,197,94,0.2); box-shadow: 0 0 16px rgba(34,197,94,0.2); }
        .cp-cta-arrow { transition: transform 0.2s ease; }
        .cp-card-cta:hover .cp-cta-arrow { transform: translateX(4px); }

        /* Back */
        .cp-back-wrap {
          display: flex; justify-content: center; margin-top: 16px;
          opacity: 0; animation: fade-up 0.6s 0.5s ease forwards;
        }
        .cp-back-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 12px 28px; border-radius: 14px;
          background: var(--surface); border: 1px solid var(--border);
          color: var(--text-muted); font-size: 14px; font-weight: 500;
          cursor: pointer; transition: all 0.25s ease; font-family: 'Poppins', sans-serif;
        }
        .cp-back-btn:hover { border-color: var(--border-green); color: var(--green-bright); background: var(--surface-2); }

        /* Modal */
        .cp-modal-backdrop {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.75); backdrop-filter: blur(16px);
          z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px;
          animation: backdrop-in 0.25s ease forwards;
        }
        @keyframes backdrop-in { from { opacity: 0; } to { opacity: 1; } }
        .cp-modal {
          background: #0d1610; border: 1px solid var(--border-green);
          border-radius: 28px; padding: 44px 40px;
          max-width: 460px; width: 100%; position: relative;
          box-shadow: 0 40px 100px rgba(0,0,0,0.7), 0 0 60px rgba(34,197,94,0.08);
          animation: modal-pop 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards;
        }
        @keyframes modal-pop {
          from { opacity: 0; transform: scale(0.92) translateY(20px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .cp-modal::before {
          content: '';
          position: absolute; top: 0; left: 32px; right: 32px; height: 1px;
          background: linear-gradient(90deg, transparent, var(--green-core), transparent);
        }
        .cp-modal-close {
          position: absolute; top: 18px; right: 18px;
          width: 32px; height: 32px; border-radius: 10px;
          background: var(--surface); border: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: var(--text-muted); transition: all 0.2s;
        }
        .cp-modal-close:hover { border-color: rgba(239,68,68,0.4); color: #f87171; background: rgba(239,68,68,0.08); }

        .cp-modal-emoji { font-size: 36px; margin-bottom: 20px; display: block; }
        .cp-modal-title {
          font-family: 'Poppins', sans-serif;
          font-size: 28px; font-weight: 400; color: var(--text-primary);
          margin-bottom: 6px; line-height: 1.2;
        }
        .cp-modal-price-row { display: flex; align-items: baseline; gap: 3px; margin-bottom: 20px; }
        .cp-modal-currency { font-size: 18px; color: var(--text-muted); }
        .cp-modal-amount { font-family: 'Poppins', sans-serif; font-size: 34px; font-weight: 400; color: var(--text-primary); }

        .cp-modal-sub { font-size: 14px; color: var(--text-muted); line-height: 1.65; margin-bottom: 24px; }
        .cp-modal-features { display: flex; flex-direction: column; gap: 12px; margin-bottom: 32px; }
        .cp-modal-feat { display: flex; align-items: center; gap: 12px; font-size: 14px; color: rgba(255,255,255,0.8); }
        .cp-feat-check {
          width: 22px; height: 22px; border-radius: 50%; flex-shrink: 0;
          background: rgba(34,197,94,0.1); border: 1px solid var(--border-green);
          display: flex; align-items: center; justify-content: center; color: var(--green-bright);
        }

        .cp-modal-actions { display: flex; gap: 12px; }
        .cp-modal-cancel {
          flex: 1; padding: 14px; border-radius: 14px;
          background: var(--surface); border: 1px solid var(--border);
          color: var(--text-muted); font-size: 14px; font-weight: 600;
          cursor: pointer; transition: all 0.2s; font-family: 'Poppins', sans-serif;
        }
        .cp-modal-cancel:hover { color: var(--text-primary); background: var(--surface-2); }
        .cp-modal-subscribe {
          flex: 2; padding: 14px; border-radius: 14px;
          background: linear-gradient(135deg, var(--amber), #d97706);
          color: #fff; font-size: 14px; font-weight: 700;
          cursor: pointer; border: none; font-family: 'Poppins', sans-serif;
          transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
          box-shadow: 0 8px 24px rgba(245,158,11,0.3);
          position: relative; overflow: hidden;
        }
        .cp-modal-subscribe:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(245,158,11,0.45); }
        .cp-modal-subscribe::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.12), transparent); pointer-events: none;
        }

        @keyframes fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="cp-root">
        <div className="cp-orb cp-orb-1" />
        <div className="cp-orb cp-orb-2" />

        {/* Header */}
        <header className="cp-header">
          <div className="cp-logo">
            <div className="cp-logo-mark">
              <Sparkles size={16} color="#fff" />
            </div>
            <span className="cp-logo-text">Pathwise AI</span>
          </div>
        </header>

        <main className="cp-main">
          {/* Hero */}
          <div className="cp-hero">
            <div className="cp-badge">
              <Sparkles size={11} />
              Career Discovery
            </div>
            <h1 className="cp-headline">
              Career Paths for{" "}
              <em>{selectedCourse || "—"}</em>
            </h1>
            <p className="cp-subtext">
              Here are some exciting career paths
              {selectedCourse ? ` in Nigeria for ${selectedCourse} graduates` : ""}.
            </p>
          </div>

          {/* Career Path Cards */}
          {paths.length === 0 ? (
            <div className="cp-empty">
              <p className="cp-empty-title">No career paths here.</p>
              <p className="cp-empty-sub">
                The selected course "{selectedCourse || "none"}" doesn't have any defined career paths yet.
              </p>
            </div>
          ) : (
            <div className="cp-grid">
              {paths.map((path, i) => {
                const IconComponent = path.icon;
                return (
                  <div
                    key={path.id}
                    className="cp-card"
                    style={{ animation: `fade-up 0.55s ${0.35 + i * 0.08}s ease forwards` }}
                  >
                    {/* Icon and Header */}
                    <div className="cp-card-header">
                      <div className="cp-card-icon-wrap">
                        <IconComponent size={24} />
                      </div>
                      <h3 className="cp-card-name">{path.name}</h3>
                    </div>

                    <p className="cp-card-desc">{path.description}</p>

                    {/* Stats */}
                    <div className="cp-stats-box">
                      <button
                        onClick={toggleUnlock}
                        className="cp-lock-row"
                        style={{ background: 'none', border: 'none', padding: 0, marginBottom: isUnlocked ? '12px' : 0 }}
                      >
                        <div className="cp-lock-icon-wrap">
                          {isUnlocked ? <Eye size={13} /> : <EyeOff size={13} />}
                        </div>
                        <span className="cp-lock-hint">
                          {isUnlocked ? "Viewing pro features" : "Unlock this pro feature"}
                        </span>
                      </button>
                      {isUnlocked && (
                        <div className="cp-stats-inner">
                          <div className="cp-stat-row">
                            <span className="cp-stat-label">Available Jobs</span>
                            <span className="cp-stat-val-orange">{path.jobCount}</span>
                          </div>
                          <div className="cp-stat-row">
                            <span className="cp-stat-label">Salary Range</span>
                            <span className="cp-stat-val-green">{path.salaryRange}</span>
                          </div>
                          <div className="cp-stat-row">
                            <span className="cp-stat-label">Growth Rate</span>
                            <span className="cp-stat-val-purple">{path.growth}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Top Companies */}
                    <div className="cp-companies">
                      <p className="cp-companies-label">Top Companies</p>
                      <div className="cp-company-tags">
                        {Array.isArray(path.companies) &&
                          path.companies.slice(0, 3).map((company, index) => (
                            <span key={index} className="cp-company-tag">{company}</span>
                          ))}
                      </div>
                    </div>

                    {/* CTA */}
                    <div
                      className="cp-card-cta"
                      onClick={() => handlePathSelect(path.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && handlePathSelect(path.id)}
                    >
                      <span className="cp-cta-label">Explore Roles</span>
                      <div className="cp-cta-circle">
                        <ArrowRight size={16} className="cp-cta-arrow" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Back Button */}
          <div className="cp-back-wrap">
            <button
              className="cp-back-btn"
              onClick={() => navigate(createPageUrl("CourseSelectionPage"))}
            >
              <ChevronLeft size={16} />
              Back to Course Selection
            </button>
          </div>
        </main>
      </div>

      {/* 🔥 ONE GLOBAL MODAL */}
      {isProModalOpen && (
        <div className="cp-modal-backdrop" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="cp-modal">
            <button className="cp-modal-close" onClick={closeModal}>
              <X size={14} />
            </button>

            <span className="cp-modal-emoji">🚀</span>

            <h2 className="cp-modal-title">Subscribe to Pro Feature for ₦2,000</h2>

            <p className="cp-modal-sub">Unlock access to premium insights:</p>

            <div className="cp-modal-features">
              {[
                "Real-life job metrics",
                "Mentorship access",
                "AI-guided skill learning paths",
                "Career growth analysis",
              ].map((feat, i) => (
                <div key={i} className="cp-modal-feat">
                  <div className="cp-feat-check">
                    <CheckCircle2 size={12} />
                  </div>
                  {feat}
                </div>
              ))}
            </div>

            <div className="cp-modal-actions">
              <button className="cp-modal-cancel" onClick={closeModal}>
                Close
              </button>
              <button
                className="cp-modal-subscribe"
                onClick={() => {
                  setIsUnlocked(true);
                  closeModal();
                }}
              >
                Subscribe Now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}