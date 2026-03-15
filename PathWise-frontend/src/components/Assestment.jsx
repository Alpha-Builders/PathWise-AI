import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Brain, Clock, Target, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";

export default function Assesment() {
  const navigate = useNavigate();
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedPath, setSelectedPath] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setSelectedCourse(urlParams.get('course') || "Computer Science");
    setSelectedPath(urlParams.get('path') || "fintech");
    setSelectedRole(urlParams.get('role') || "software-engineer");
    setSelectedSkill(urlParams.get('skill') || "javascript");
  }, []);
const createPageUrl = (pageName) => {
  const pageRoutes = {
    SkillsPage: "/skills",          
    CareerPathPage: "/career-path",   
    JobRolePage: "/job-roles",       
    Assessment: "/assessment",       
    Result: "/result" ,          
     TestPage: "/test",            
  };

  return pageRoutes[pageName] || "/";
};

  const handleStartAssessment = () => {
    navigate(createPageUrl("TestPage") + `?course=${encodeURIComponent(selectedCourse)}&path=${selectedPath}&role=${selectedRole}&skill=${selectedSkill}`);
  };

  const skillNames = {
    javascript: "JavaScript Fundamentals",
    react: "React Development", 
    nodejs: "Node.js Backend",
    databases: "Database Management",
    git: "Version Control (Git)",
    "network-security": "Network Security",
    "incident-response": "Incident Response",
    "risk-assessment": "Risk Assessment"
  };

  const skillName = skillNames[selectedSkill] || "Programming Skill";

  return (
    <div style={{ minHeight: '100vh', background: '#080d0a', color: '#f0fdf4', fontFamily: "'DM Sans', sans-serif", position: 'relative' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        :root { --green-core: #22c55e; --green-bright: #4ade80; --green-deep: #15803d; --surface: rgba(255,255,255,0.03); --surface-2: rgba(255,255,255,0.06); --border: rgba(255,255,255,0.08); --border-green: rgba(34,197,94,0.35); --text-primary: #f0fdf4; --text-muted: #6b7280; --bg: #080d0a; }
        .as-root::before { content: ''; position: fixed; inset: 0; background-image: linear-gradient(rgba(34,197,94,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.04) 1px, transparent 1px); background-size: 60px 60px; pointer-events: none; z-index: 0; }
        .as-header { position: relative; z-index: 20; display: flex; justify-content: space-between; align-items: center; padding: 20px 40px; border-bottom: 1px solid var(--border); backdrop-filter: blur(12px); }
        .as-logo { display: flex; align-items: center; gap: 10px; }
        .as-logo-mark { width: 36px; height: 36px; background: linear-gradient(135deg, var(--green-core), var(--green-deep)); border-radius: 10px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 20px rgba(34,197,94,0.4); }
        .as-logo-text { font-family: 'Instrument Serif', serif; font-size: 22px; background: linear-gradient(90deg, #fff, var(--green-bright)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .as-header-right { display: flex; gap: 8px; align-items: center; }
        .as-icon-btn { position: relative; width: 40px; height: 40px; background: var(--surface); border: 1px solid var(--border); border-radius: 12px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s ease; color: var(--text-muted); }
        .as-icon-btn:hover { background: var(--surface-2); border-color: var(--border-green); color: var(--green-bright); }
        .as-notif-dot { position: absolute; top: 8px; right: 8px; width: 7px; height: 7px; background: var(--green-core); border-radius: 50%; border: 1.5px solid var(--bg); animation: as-pulse 2s ease infinite; }
        @keyframes as-pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.5); } 50% { box-shadow: 0 0 0 4px rgba(34,197,94,0); } }
        .as-premium-btn { display: flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 10px; background: linear-gradient(135deg, var(--green-core), var(--green-deep)); color: #fff; font-size: 12px; font-weight: 600; letter-spacing: 0.8px; text-transform: uppercase; cursor: pointer; transition: all 0.25s ease; border: none; font-family: 'DM Sans', sans-serif; box-shadow: 0 4px 16px rgba(34,197,94,0.3); }
        .as-premium-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(34,197,94,0.45); }
        @keyframes fade-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 640px) { .as-header { padding: 16px 20px; } }
      `}</style>

      <div className="as-root" style={{ minHeight: '100vh', background: '#080d0a' }}>
        {/* Header */}
        <header className="as-header">
          <div className="as-logo">
            <div className="as-logo-mark"><Sparkles size={16} color="#fff" /></div>
            <span className="as-logo-text">Pathwise AI</span>
          </div>
          <div className="as-header-right">
            <button className="as-premium-btn"><Sparkles size={12} />Premium</button>
            <button className="as-icon-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <span className="as-notif-dot" />
            </button>
            <button className="as-icon-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </button>
          </div>
        </header>
          
          <h1 className="text-5xl  font-bold text-white mb-6">
            Skill Assessment Ready! 🎯
          </h1>
          <p className="text-lg text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            Great job marking <span className="font-semibold text-green-500">{skillName}</span> as completed! 
            Now let's test your knowledge to verify your understanding.
          </p>
        </div>

        {/* Assessment Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-green-100 p-8 md:p-12 mb-8">
          {/* Skill Badge */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-50 to-indigo-50 px-6 py-3 rounded-2xl border border-purple-200">
              <div className="w-8 h-8 bg-green-500  rounded-xl flex items-center justify-center">
                <Target className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold ">{skillName} Assessment</span>
            </div>
          </div>

          {/* Assessment Details */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-6 bg-blue-50 rounded-2xl border border-blue-200">
              <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">20 Questions</h3>
              <p className="text-sm text-gray-600">Multiple choice format</p>
            </div>

            <div className="text-center p-6 bg-green-50 rounded-2xl border border-green-200">
              <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">30 Minutes</h3>
              <p className="text-sm text-gray-600">Recommended time limit</p>
            </div>

            <div className="text-center p-6 bg-purple-50 rounded-2xl border border-purple-200">
              <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">75% to Pass</h3>
              <p className="text-sm text-gray-600">Minimum passing score</p>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200 mb-8">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-amber-900 mb-2">Assessment Guidelines</h4>
                <ul className="text-sm text-amber-800 space-y-1">
                  <li>• Answer all questions to the best of your ability</li>
                  <li>• You can review and change answers before submitting</li>
                  <li>• Passing score is 75% (15 out of 20 questions)</li>
                  <li>• You can retake the assessment if needed</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              variant="outline"
              onClick={() => navigate(createPageUrl("SkillsPage") + `?course=${encodeURIComponent(selectedCourse)}&path=${selectedPath}&role=${selectedRole}`)}
              className="border-gray-200 text-zinc-300 cursor-pointer hover:text-black hover:bg-green-50 px-8 py-3 rounded-2xl"
            >
              ← Back to Skills
            </button>
            
            <button
              onClick={handleStartAssessment}
              size="lg"
              className="bg-green-500 flex cursor-pointer hover:from-green-700 hover:to-indigo-700 text-white px-15 py-4 text-lg font-semibold rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Start Assessment
              <ArrowRight className="w-5 h-5 ml-2 mt-1.5" />
            </button>
          </div>
        </div>

        {/* Confidence Boost */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-green-500 bg-purple-50 px-4 py-2 rounded-full">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-medium">You've got this! Take your time and trust your knowledge.</span>
          </div>
        </div>
    </div>
    
  );
}