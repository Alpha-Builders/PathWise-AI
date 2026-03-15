import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, ChevronLeft } from "lucide-react";
import jobRoles from "../data/RolesData";

export default function Roles() {
  const navigate = useNavigate();
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedPath, setSelectedPath] = useState("");
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const course = urlParams.get("course") || "";
    const path = urlParams.get("path") || "";
    setSelectedCourse(course);
    setSelectedPath(path);

    if (path && Array.isArray(jobRoles[path]) && jobRoles[path].length > 0) {
      setRoles(jobRoles[path]);
    } else {
      setRoles([]);
    }
  }, []);

  const createPageUrl = (pageName) => {
    const pageRoutes = {
      SkillsPage: "/skills",
      CareerPathPage: "/career-path",
      JobRolePage: "/job-roles",
      Assessment: "/assessment",
      ResultPage: "/result",
    };
    return pageRoutes[pageName] || "/";
  };

  const handleRoleSelect = (roleId) => {
    navigate(
      createPageUrl("SkillsPage") +
        `?course=${encodeURIComponent(selectedCourse)}&path=${selectedPath}&role=${roleId}`
    );
  };

  const getPathName = (pathId) => {
    const pathNames = {
      fintech: "Financial Technology",
      banking: "Banking & Finance",
      "tech-companies": "Technology Companies",
      government: "Government & Public Sector",
      startups: "Startups & Innovation",
    };
    return pathNames[pathId] || pathId || "—";
  };

  const getDemandColor = (demand) => {
    if (demand === "Very High") return "var(--green-bright)";
    if (demand === "High") return "#60a5fa";
    return "#facc15";
  };

  const getDemandBg = (demand) => {
    if (demand === "Very High") return "rgba(34,197,94,0.12)";
    if (demand === "High") return "rgba(96,165,250,0.1)";
    return "rgba(250,204,21,0.1)";
  };

  const getDemandBorder = (demand) => {
    if (demand === "Very High") return "rgba(34,197,94,0.3)";
    if (demand === "High") return "rgba(96,165,250,0.3)";
    return "rgba(250,204,21,0.3)";
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --green-core: #22c55e;
          --green-bright: #4ade80;
          --green-deep: #15803d;
          --surface: rgba(255,255,255,0.03);
          --surface-2: rgba(255,255,255,0.06);
          --border: rgba(255,255,255,0.08);
          --border-green: rgba(34,197,94,0.35);
          --text-primary: #f0fdf4;
          --text-muted: #6b7280;
          --bg: #080d0a;
        }

        .roles-root {
          min-height: 100vh;
          background: var(--bg);
          color: var(--text-primary);
          font-family: 'DM Sans', sans-serif;
          position: relative;
          overflow-x: hidden;
        }
        .roles-root::before {
          content: '';
          position: fixed; inset: 0;
          background-image:
            linear-gradient(rgba(34,197,94,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34,197,94,0.04) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none; z-index: 0;
        }

        .roles-orb {
          position: fixed; border-radius: 50%;
          pointer-events: none; filter: blur(130px); z-index: 0;
        }
        .roles-orb-1 {
          width: 700px; height: 700px;
          background: radial-gradient(circle, rgba(34,197,94,0.09) 0%, transparent 70%);
          top: -250px; left: -150px;
          animation: orb-drift 9s ease-in-out infinite alternate;
        }
        .roles-orb-2 {
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
        .roles-header {
          position: relative; z-index: 20;
          display: flex; justify-content: space-between; align-items: center;
          padding: 20px 40px;
          border-bottom: 1px solid var(--border);
          backdrop-filter: blur(12px);
        }
        .roles-logo { display: flex; align-items: center; gap: 10px; }
        .roles-logo-mark {
          width: 36px; height: 36px;
          background: linear-gradient(135deg, var(--green-core), var(--green-deep));
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 20px rgba(34,197,94,0.4);
        }
        .roles-logo-text {
          font-family: 'Instrument Serif', serif; font-size: 22px;
          background: linear-gradient(90deg, #fff, var(--green-bright));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .roles-header-right { display: flex; gap: 8px; align-items: center; }
        .roles-icon-btn {
          position: relative; width: 40px; height: 40px;
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 12px; display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.2s ease; color: var(--text-muted);
        }
        .roles-icon-btn:hover { background: var(--surface-2); border-color: var(--border-green); color: var(--green-bright); }
        .roles-notif-dot {
          position: absolute; top: 8px; right: 8px;
          width: 7px; height: 7px; background: var(--green-core);
          border-radius: 50%; border: 1.5px solid var(--bg);
          animation: pulse-dot 2s ease infinite;
        }
        @keyframes pulse-dot { 0%,100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.5); } 50% { box-shadow: 0 0 0 4px rgba(34,197,94,0); } }
        .roles-premium-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 8px 16px; border-radius: 10px;
          background: linear-gradient(135deg, var(--green-core), var(--green-deep));
          color: #fff; font-size: 12px; font-weight: 600;
          letter-spacing: 0.8px; text-transform: uppercase;
          cursor: pointer; transition: all 0.25s ease;
          border: none; font-family: 'DM Sans', sans-serif;
          box-shadow: 0 4px 16px rgba(34,197,94,0.3);
        }
        .roles-premium-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(34,197,94,0.45); }

        /* Main */
        .roles-main {
          position: relative; z-index: 10;
          max-width: 1100px; margin: 0 auto;
          padding: 64px 40px 80px;
        }

        /* Hero */
        .roles-hero { text-align: center; margin-bottom: 64px; }
        .roles-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(34,197,94,0.08); border: 1px solid var(--border-green);
          border-radius: 100px; padding: 6px 16px;
          font-size: 12px; font-weight: 500; color: var(--green-bright);
          letter-spacing: 0.5px; text-transform: uppercase;
          margin-bottom: 28px;
          opacity: 0; animation: fade-up 0.6s 0.1s ease forwards;
        }
        .roles-headline {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(34px, 5vw, 58px);
          line-height: 1.1; font-weight: 400; color: var(--text-primary);
          margin-bottom: 16px;
          opacity: 0; animation: fade-up 0.6s 0.2s ease forwards;
        }
        .roles-headline em {
          font-style: italic;
          background: linear-gradient(90deg, var(--green-core), var(--green-bright));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .roles-subtext {
          font-size: 16px; line-height: 1.7; color: var(--text-muted);
          max-width: 560px; margin: 0 auto;
          opacity: 0; animation: fade-up 0.6s 0.3s ease forwards;
        }

        /* Empty */
        .roles-empty {
          max-width: 520px; margin: 0 auto 48px;
          background: rgba(239,68,68,0.06);
          border: 1px solid rgba(239,68,68,0.25);
          border-radius: 24px; padding: 40px; text-align: center;
          opacity: 0; animation: fade-up 0.6s 0.4s ease forwards;
        }
        .roles-empty-title { font-size: 18px; font-weight: 600; color: #f87171; margin-bottom: 8px; }
        .roles-empty-sub { font-size: 14px; color: var(--text-muted); line-height: 1.6; }

        /* Grid */
        .roles-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px; margin-bottom: 48px;
        }
        @media (max-width: 720px) {
          .roles-grid { grid-template-columns: 1fr; }
          .roles-main { padding: 48px 20px 60px; }
          .roles-header { padding: 16px 20px; }
        }

        /* Card */
        .roles-card {
          position: relative;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 24px; padding: 28px;
          cursor: pointer;
          transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
          overflow: hidden; opacity: 0;
          display: flex; flex-direction: column;
        }
        .roles-card::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(34,197,94,0.07), transparent 60%);
          opacity: 0; transition: opacity 0.35s; border-radius: inherit;
        }
        .roles-card::after {
          content: '';
          position: absolute; top: 0; left: 24px; right: 24px; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(34,197,94,0.4), transparent);
          opacity: 0; transition: opacity 0.35s;
        }
        .roles-card:hover {
          border-color: var(--border-green);
          transform: translateY(-4px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.4);
        }
        .roles-card:hover::before, .roles-card:hover::after { opacity: 1; }

        /* Card top row */
        .roles-card-top {
          display: flex; align-items: flex-start; justify-content: space-between;
          margin-bottom: 20px; gap: 16px;
        }
        .roles-card-left { display: flex; align-items: flex-start; gap: 16px; flex: 1; }
        .roles-card-icon {
          width: 52px; height: 52px; flex-shrink: 0;
          background: rgba(34,197,94,0.1); border: 1px solid var(--border-green);
          border-radius: 14px; display: flex; align-items: center; justify-content: center;
          color: var(--green-bright); transition: all 0.3s ease;
        }
        .roles-card:hover .roles-card-icon {
          background: rgba(34,197,94,0.18); box-shadow: 0 0 20px rgba(34,197,94,0.2);
        }
        .roles-card-title-wrap {}
        .roles-card-name {
          font-family: 'Instrument Serif', serif;
          font-size: 20px; font-weight: 400; color: var(--text-primary);
          line-height: 1.2; margin-bottom: 6px;
        }
        .roles-card-desc {
          font-size: 13px; line-height: 1.6; color: var(--text-muted);
        }
        .roles-card-arrow {
          color: var(--green-bright); flex-shrink: 0; margin-top: 4px;
          transition: transform 0.25s ease;
        }
        .roles-card:hover .roles-card-arrow { transform: translateX(4px); }

        /* Stats grid */
        .roles-stats {
          display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
          margin-bottom: 20px;
        }
        .roles-stat {
          background: rgba(0,0,0,0.2); border: 1px solid var(--border);
          border-radius: 14px; padding: 14px;
          transition: border-color 0.3s;
        }
        .roles-card:hover .roles-stat { border-color: rgba(255,255,255,0.12); }
        .roles-stat.full { grid-column: span 2; }
        .roles-stat-label {
          font-size: 10px; font-weight: 600; letter-spacing: 0.8px;
          text-transform: uppercase; margin-bottom: 6px;
        }
        .roles-stat-value {
          font-size: 14px; font-weight: 600; color: var(--text-primary);
          display: flex; align-items: center; gap: 8px;
        }
        .roles-demand-dot {
          width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0;
        }

        /* Skills */
        .roles-skills { margin-bottom: 20px; }
        .roles-skills-label {
          font-size: 10px; font-weight: 600; letter-spacing: 0.8px;
          text-transform: uppercase; color: var(--text-muted); margin-bottom: 10px;
        }
        .roles-skill-tags { display: flex; flex-wrap: wrap; gap: 6px; }
        .roles-skill-tag {
          font-size: 11px; font-weight: 500;
          padding: 4px 12px; border-radius: 100px;
          background: rgba(34,197,94,0.08); border: 1px solid rgba(34,197,94,0.2);
          color: var(--green-bright);
          transition: all 0.2s;
        }
        .roles-card:hover .roles-skill-tag {
          background: rgba(34,197,94,0.12); border-color: rgba(34,197,94,0.3);
        }
        .roles-skill-more {
          font-size: 11px; color: var(--text-muted);
          padding: 4px 8px; display: flex; align-items: center;
        }

        /* Card CTA */
        .roles-card-cta {
          display: flex; align-items: center; justify-content: space-between;
          padding-top: 16px; border-top: 1px solid var(--border);
          margin-top: auto;
        }
        .roles-cta-label {
          font-size: 13px; font-weight: 600; color: var(--green-core);
          transition: color 0.2s;
        }
        .roles-card:hover .roles-cta-label { color: var(--green-bright); }
        .roles-cta-circle {
          width: 34px; height: 34px; border-radius: 50%;
          background: rgba(34,197,94,0.1); border: 1px solid var(--border-green);
          display: flex; align-items: center; justify-content: center;
          color: var(--green-bright); transition: all 0.2s;
        }
        .roles-card:hover .roles-cta-circle {
          background: rgba(34,197,94,0.2); box-shadow: 0 0 16px rgba(34,197,94,0.2);
        }

        /* Back */
        .roles-back-wrap {
          display: flex; justify-content: center;
          opacity: 0; animation: fade-up 0.6s 0.5s ease forwards;
        }
        .roles-back-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 12px 28px; border-radius: 14px;
          background: var(--surface); border: 1px solid var(--border);
          color: var(--text-muted); font-size: 14px; font-weight: 500;
          cursor: pointer; transition: all 0.25s ease; font-family: 'DM Sans', sans-serif;
        }
        .roles-back-btn:hover { border-color: var(--border-green); color: var(--green-bright); background: var(--surface-2); }

        @keyframes fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="roles-root">
        <div className="roles-orb roles-orb-1" />
        <div className="roles-orb roles-orb-2" />

        {/* Header */}
        <header className="roles-header">
          <div className="roles-logo">
            <div className="roles-logo-mark">
              <Sparkles size={16} color="#fff" />
            </div>
            <span className="roles-logo-text">Pathwise AI</span>
          </div>
          <div className="roles-header-right">
            <button className="roles-premium-btn">
              <Sparkles size={12} />
              Premium
            </button>
            <button className="roles-icon-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <span className="roles-notif-dot" />
            </button>
            <button className="roles-icon-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </button>
          </div>
        </header>

        <main className="roles-main">
          {/* Hero */}
          <div className="roles-hero">
            <div className="roles-badge">
              <Sparkles size={11} />
              Job Roles
            </div>
            <h1 className="roles-headline">
              Job Roles in{" "}
              <em>{getPathName(selectedPath)}</em>
            </h1>
            <p className="roles-subtext">
              Here are the specific job roles you can explore in the{" "}
              {getPathName(selectedPath)} sector. Each role has different requirements and growth opportunities.
            </p>
          </div>

          {/* Roles or Empty State */}
          {roles.length === 0 ? (
            <div className="roles-empty">
              <p className="roles-empty-title">No roles here.</p>
              <p className="roles-empty-sub">
                The selected path "{selectedPath || "none"}"{selectedCourse && ` for course "${selectedCourse}"`} doesn't have any defined job roles yet.
              </p>
            </div>
          ) : (
            <div className="roles-grid">
              {roles.map((role, i) => {
                const IconComponent = role.icon;
                return (
                  <div
                    key={role.id}
                    className="roles-card"
                    onClick={() => handleRoleSelect(role.id)}
                    style={{ animation: `fade-up 0.55s ${0.35 + i * 0.08}s ease forwards` }}
                  >
                    {/* Top row: icon + name + arrow */}
                    <div className="roles-card-top">
                      <div className="roles-card-left">
                        <div className="roles-card-icon">
                          <IconComponent size={22} />
                        </div>
                        <div className="roles-card-title-wrap">
                          <h3 className="roles-card-name">{role.name}</h3>
                          <p className="roles-card-desc">{role.description}</p>
                        </div>
                      </div>
                      <ArrowRight size={18} className="roles-card-arrow" />
                    </div>

                    {/* Stats grid */}
                    <div className="roles-stats">
                      <div className="roles-stat">
                        <div className="roles-stat-label" style={{ color: '#f97316' }}>Experience Level</div>
                        <div className="roles-stat-value">{role.level}</div>
                      </div>
                      <div className="roles-stat">
                        <div className="roles-stat-label" style={{ color: 'var(--green-bright)' }}>Salary Range</div>
                        <div className="roles-stat-value">{role.avgSalary}</div>
                      </div>
                      <div className="roles-stat full">
                        <div className="roles-stat-label" style={{ color: '#818cf8' }}>Market Demand</div>
                        <div className="roles-stat-value">
                          {role.demand}
                          <span
                            className="roles-demand-dot"
                            style={{ background: getDemandColor(role.demand) }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Key Skills */}
                    <div className="roles-skills">
                      <p className="roles-skills-label">Key Skills Required</p>
                      <div className="roles-skill-tags">
                        {Array.isArray(role.skills) &&
                          role.skills.slice(0, 4).map((skill, index) => (
                            <span key={index} className="roles-skill-tag">{skill}</span>
                          ))}
                        {Array.isArray(role.skills) && role.skills.length > 4 && (
                          <span className="roles-skill-more">+{role.skills.length - 4} more</span>
                        )}
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="roles-card-cta">
                      <span className="roles-cta-label">View Skills Roadmap</span>
                      <div className="roles-cta-circle">
                        <ArrowRight size={15} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Back Button */}
          <div className="roles-back-wrap">
            <button
              className="roles-back-btn"
              onClick={() =>
                navigate(
                  createPageUrl("CareerPathPage") +
                    `?course=${encodeURIComponent(selectedCourse)}`
                )
              }
            >
              <ChevronLeft size={16} />
              Back to Career Paths
            </button>
          </div>
        </main>
      </div>
    </>
  );
}