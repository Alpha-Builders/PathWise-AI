import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  Trophy, CheckCircle, XCircle, RotateCcw, ArrowRight,
  Award, Star, Target, TrendingUp, Lightbulb, BookOpen,
  Loader2, Sparkles, ChevronLeft,
} from "lucide-react";

export default function Result() {
  const navigate = useNavigate();
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedPath, setSelectedPath] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");
  const [score, setScore] = useState(0);
  const [useAiQuestions, setUseAiQuestions] = useState(false);

  const [aiFeedback, setAiFeedback] = useState(null);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [feedbackError, setFeedbackError] = useState(null);

  const API_BASE_URL = 'http://localhost:3001/api';

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const course = urlParams.get('course') || "Computer Science";
    const path = urlParams.get('path') || "fintech";
    const role = urlParams.get('role') || "software-engineer";
    const skill = urlParams.get('skill') || "javascript";
    const scoreParam = parseInt(urlParams.get('score')) || 85;
    const useAi = urlParams.get('useAi') === 'true';
    setSelectedCourse(course); setSelectedPath(path); setSelectedRole(role);
    setSelectedSkill(skill); setScore(scoreParam); setUseAiQuestions(useAi);
    generateAiFeedback(skill, scoreParam, useAi);
  }, []);

  const generateAiFeedback = async (skillName, userScore, wasAiGenerated) => {
    setLoadingFeedback(true); setFeedbackError(null);
    try {
      const assessmentType = wasAiGenerated ? "AI-generated" : "standard";
      const performanceLevel = userScore >= 90 ? "excellent" : userScore >= 75 ? "good" : userScore >= 60 ? "fair" : "needs improvement";
      const message = `Provide personalized feedback for a student who completed a ${assessmentType} assessment on "${skillName}" and scored ${userScore}%. Performance: ${performanceLevel}. Pass threshold: 75%. FORMAT as JSON: { "analysis": "string", "strengths": [], "improvements": [], "nextSteps": [], "motivation": "string" }. Be specific to ${skillName} and honest but encouraging.`;
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: message }] })
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      const data = await response.json();
      const botResponse = data.choices?.[0]?.message?.content || data.response || data.output || data.value || (typeof data === 'string' ? data : '');
      const feedback = parseFeedbackFromResponse(botResponse);
      if (feedback) setAiFeedback(feedback); else throw new Error('Invalid feedback format');
    } catch (error) {
      try {
        const fallbackResponse = await fetch(`${API_BASE_URL}/generate`, {
          method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ input_message: `Give feedback for ${skillName} assessment with ${userScore}% score. JSON format: analysis, strengths, improvements, nextSteps, motivation.` })
        });
        if (!fallbackResponse.ok) throw new Error(`HTTP ${fallbackResponse.status}`);
        const fallbackData = await fallbackResponse.json();
        const feedback = parseFeedbackFromResponse(fallbackData.value || fallbackData.response || fallbackData.output || '');
        if (feedback) setAiFeedback(feedback); else throw new Error('Fallback failed');
      } catch {
        setFeedbackError(`Failed to generate feedback: ${error.message}`);
      }
    } finally {
      setLoadingFeedback(false);
    }
  };

  const parseFeedbackFromResponse = (aiResponse) => {
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) { const p = JSON.parse(jsonMatch[0]); if (p.analysis) return p; }
      const analysisMatch = aiResponse.match(/analysis["\s:]*([^"]*)/i);
      if (analysisMatch) return {
        analysis: analysisMatch[1].trim(),
        strengths: [], improvements: [], nextSteps: [], motivation: ""
      };
      return null;
    } catch { return null; }
  };

  const handleRetakeTest = () => navigate(`/test?course=${encodeURIComponent(selectedCourse)}&path=${selectedPath}&role=${selectedRole}&skill=${selectedSkill}`);
  const handleContinueLearning = () => navigate('/skills');

  const getScoreTheme = (s) => {
    if (s >= 90) return { color: '#4ade80', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.3)', label: 'Excellent Performance!', icon: Trophy, iconColor: '#f59e0b' };
    if (s >= 75) return { color: '#60a5fa', bg: 'rgba(96,165,250,0.08)', border: 'rgba(96,165,250,0.3)', label: 'Good Performance!', icon: Award, iconColor: '#60a5fa' };
    if (s >= 60) return { color: '#fbbf24', bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.3)', label: 'Fair Performance', icon: Target, iconColor: '#fbbf24' };
    return { color: '#f87171', bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.3)', label: 'Needs Improvement', icon: XCircle, iconColor: '#f87171' };
  };

  const theme = getScoreTheme(score);
  const ScoreIcon = theme.icon;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root { --green-core: #22c55e; --green-bright: #4ade80; --green-deep: #15803d; --surface: rgba(255,255,255,0.03); --surface-2: rgba(255,255,255,0.06); --border: rgba(255,255,255,0.08); --border-green: rgba(34,197,94,0.35); --text-primary: #f0fdf4; --text-muted: #6b7280; --bg: #080d0a; }
        .res-root { min-height: 100vh; background: var(--bg); color: var(--text-primary); font-family: 'Poppins', sans-serif; position: relative; overflow-x: hidden; }
        .res-root::before { content: ''; position: fixed; inset: 0; background-image: linear-gradient(rgba(34,197,94,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.04) 1px, transparent 1px); background-size: 60px 60px; pointer-events: none; z-index: 0; }
        .res-orb { position: fixed; border-radius: 50%; pointer-events: none; filter: blur(130px); z-index: 0; }
        .res-orb-1 { width: 700px; height: 700px; background: radial-gradient(circle, rgba(34,197,94,0.09) 0%, transparent 70%); top: -250px; left: -150px; animation: orb-drift 9s ease-in-out infinite alternate; }
        .res-orb-2 { width: 550px; height: 550px; background: radial-gradient(circle, rgba(21,128,61,0.08) 0%, transparent 70%); bottom: -200px; right: -100px; animation: orb-drift 12s ease-in-out infinite alternate-reverse; }
        @keyframes orb-drift { from { transform: translate(0,0); } to { transform: translate(50px,40px); } }

        .res-header { position: relative; z-index: 20; display: flex; justify-content: space-between; align-items: center; padding: 20px 40px; border-bottom: 1px solid var(--border); backdrop-filter: blur(12px); }
        .res-logo { display: flex; align-items: center; gap: 10px; }
        .res-logo-mark { width: 36px; height: 36px; background: linear-gradient(135deg, var(--green-core), var(--green-deep)); border-radius: 10px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 20px rgba(34,197,94,0.4); }
        .res-logo-text { font-family: 'Poppins', sans-serif; font-size: 22px; background: linear-gradient(90deg, #fff, var(--green-bright)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .res-header-right { display: flex; gap: 8px; align-items: center; }
        .res-icon-btn { position: relative; width: 40px; height: 40px; background: var(--surface); border: 1px solid var(--border); border-radius: 12px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s ease; color: var(--text-muted); }
        .res-icon-btn:hover { background: var(--surface-2); border-color: var(--border-green); color: var(--green-bright); }
        .res-notif-dot { position: absolute; top: 8px; right: 8px; width: 7px; height: 7px; background: var(--green-core); border-radius: 50%; border: 1.5px solid var(--bg); animation: pulse-dot 2s ease infinite; }
        @keyframes pulse-dot { 0%,100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.5); } 50% { box-shadow: 0 0 0 4px rgba(34,197,94,0); } }
        .res-premium-btn { display: flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 10px; background: linear-gradient(135deg, var(--green-core), var(--green-deep)); color: #fff; font-size: 12px; font-weight: 600; letter-spacing: 0.8px; text-transform: uppercase; cursor: pointer; transition: all 0.25s ease; border: none; font-family: 'Poppins', sans-serif; box-shadow: 0 4px 16px rgba(34,197,94,0.3); }
        .res-premium-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(34,197,94,0.45); }
        .res-main { position: relative; z-index: 10; max-width: 800px; margin: 0 auto; padding: 64px 40px 80px; }

        .res-hero { text-align: center; margin-bottom: 40px; }
        .res-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(34,197,94,0.08); border: 1px solid var(--border-green); border-radius: 100px; padding: 6px 16px; font-size: 12px; font-weight: 500; color: var(--green-bright); letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 20px; opacity: 0; animation: fade-up 0.6s 0.1s ease forwards; }
        .res-headline { font-family: 'Poppins', sans-serif; font-size: clamp(32px, 5vw, 52px); line-height: 1.1; font-weight: 400; color: var(--text-primary); margin-bottom: 10px; opacity: 0; animation: fade-up 0.6s 0.2s ease forwards; }
        .res-sub { font-size: 14px; color: var(--text-muted); opacity: 0; animation: fade-up 0.6s 0.3s ease forwards; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .res-ai-tag { font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 100px; background: rgba(96,165,250,0.1); border: 1px solid rgba(96,165,250,0.3); color: #93c5fd; }

        /* Score card */
        .res-score-card { border-radius: 24px; padding: 40px; text-align: center; margin-bottom: 24px; position: relative; overflow: hidden; opacity: 0; animation: fade-up 0.6s 0.4s ease forwards; }
        .res-score-card::before { content: ''; position: absolute; top: 0; left: 32px; right: 32px; height: 1px; }
        .res-score-icon { width: 68px; height: 68px; border-radius: 20px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
        .res-score-num { font-family: 'Poppins', sans-serif; font-size: 80px; line-height: 1; font-weight: 400; margin-bottom: 8px; }
        .res-score-label { font-family: 'Poppins', sans-serif; font-size: 26px; font-weight: 400; margin-bottom: 8px; }
        .res-score-msg { font-size: 13px; color: var(--text-muted); margin-bottom: 24px; }
        .res-score-bar { width: 100%; height: 8px; background: rgba(255,255,255,0.06); border-radius: 100px; overflow: hidden; margin-bottom: 8px; }
        .res-score-bar-fill { height: 100%; border-radius: 100px; transition: width 1s ease; }
        .res-score-pass { font-size: 11px; color: var(--text-muted); }

        /* Panel shared */
        .res-panel { background: var(--surface); border: 1px solid var(--border); border-radius: 24px; padding: 32px; margin-bottom: 20px; position: relative; overflow: hidden; opacity: 0; }
        .res-panel::before { content: ''; position: absolute; top: 0; left: 24px; right: 24px; height: 1px; background: linear-gradient(90deg, transparent, rgba(34,197,94,0.3), transparent); }

        /* Feedback loading */
        .res-loading { display: flex; align-items: center; gap: 12px; }
        .res-loading-text { font-size: 14px; color: var(--text-muted); }
        .res-loading-title { font-family: 'Poppins', sans-serif; font-size: 20px; color: #93c5fd; margin-bottom: 8px; display: flex; align-items: center; gap: 8px; }
        .res-error-title { font-family: 'Poppins', sans-serif; font-size: 20px; color: #f87171; margin-bottom: 8px; display: flex; align-items: center; gap: 8px; }
        .res-error-msg { font-size: 13px; color: var(--text-muted); }

        /* Feedback sections */
        .res-feedback-title { font-family: 'Poppins', sans-serif; font-size: 24px; font-weight: 400; color: var(--text-primary); margin-bottom: 24px; display: flex; align-items: center; gap: 10px; }
        .res-section { margin-bottom: 24px; }
        .res-section:last-child { margin-bottom: 0; }
        .res-section-title { font-size: 13px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 12px; display: flex; align-items: center; gap: 7px; }
        .res-analysis { font-size: 14px; color: rgba(255,255,255,0.7); line-height: 1.7; }
        .res-list { display: flex; flex-direction: column; gap: 8px; }
        .res-list-item { display: flex; align-items: flex-start; gap: 10px; font-size: 14px; color: rgba(255,255,255,0.7); line-height: 1.6; }
        .res-list-icon { flex-shrink: 0; margin-top: 2px; }
        .res-step-num { width: 22px; height: 22px; border-radius: 50%; background: rgba(168,85,247,0.12); border: 1px solid rgba(168,85,247,0.3); display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; color: #d8b4fe; flex-shrink: 0; }
        .res-motivation { background: rgba(96,165,250,0.06); border: 1px solid rgba(96,165,250,0.2); border-radius: 16px; padding: 20px; text-align: center; }
        .res-motivation-text { font-family: 'Poppins', sans-serif; font-size: 18px; font-style: italic; color: #93c5fd; line-height: 1.5; }

        /* Actions */
        .res-actions { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; margin-bottom: 32px; opacity: 0; animation: fade-up 0.6s 0.6s ease forwards; }
        .res-btn-retake { display: inline-flex; align-items: center; gap: 8px; padding: 14px 30px; border-radius: 14px; background: rgba(96,165,250,0.1); border: 1px solid rgba(96,165,250,0.3); color: #93c5fd; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.25s; font-family: 'Poppins', sans-serif; }
        .res-btn-retake:hover { background: rgba(96,165,250,0.18); border-color: rgba(96,165,250,0.5); }
        .res-btn-continue { display: inline-flex; align-items: center; gap: 8px; padding: 14px 30px; border-radius: 14px; background: linear-gradient(135deg, var(--green-core), var(--green-deep)); color: #fff; font-size: 14px; font-weight: 700; cursor: pointer; border: none; font-family: 'Poppins', sans-serif; transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1); box-shadow: 0 8px 24px rgba(34,197,94,0.35); position: relative; overflow: hidden; }
        .res-btn-continue:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(34,197,94,0.5); }
        .res-btn-continue::after { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(255,255,255,0.12), transparent); pointer-events: none; }
        .res-footer { text-align: center; opacity: 0; animation: fade-up 0.6s 0.7s ease forwards; }
        .res-date { font-size: 12px; color: var(--text-muted); margin-top: 12px; }

        @keyframes fade-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 640px) { .res-main { padding: 48px 20px 60px; } .res-header { padding: 16px 20px; } }
      `}</style>

      <div className="res-root">
        <div className="res-orb res-orb-1" /><div className="res-orb res-orb-2" />

        <header className="res-header">
          <div className="res-logo"><div className="res-logo-mark"><Sparkles size={16} color="#fff" /></div><span className="res-logo-text">Pathwise AI</span></div>
          <div className="res-header-right">
            <button className="res-premium-btn"><Sparkles size={12} />Premium</button>
            <button className="res-icon-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              <span className="res-notif-dot" />
            </button>
            <button className="res-icon-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </button>
          </div>
        </header>

        <main className="res-main">
          {/* Hero */}
          <div className="res-hero">
            <div className="res-badge"><Sparkles size={11} />Assessment Results</div>
            <h1 className="res-headline">Assessment Results</h1>
            <p className="res-sub">
              Your performance on the <strong style={{ color: 'var(--text-primary)' }}>{selectedSkill}</strong> assessment
              {useAiQuestions && <span className="res-ai-tag">🤖 AI Generated</span>}
            </p>
          </div>

          {/* Score card */}
          <div className="res-score-card" style={{ background: theme.bg, border: `1px solid ${theme.border}` }}>
            <div style={{ position: 'absolute', top: 0, left: 32, right: 32, height: '1px', background: `linear-gradient(90deg, transparent, ${theme.color}, transparent)` }} />
            <div className="res-score-icon" style={{ background: `${theme.bg}`, border: `1px solid ${theme.border}` }}>
              <ScoreIcon size={30} color={theme.iconColor} />
            </div>
            <div className="res-score-num" style={{ color: theme.color }}>{score}%</div>
            <div className="res-score-label" style={{ color: theme.color }}>{theme.label}</div>
            <p className="res-score-msg">{score >= 75 ? "Congratulations! You've passed the assessment." : "You'll need to retake the assessment to pass."}</p>
            <div className="res-score-bar">
              <div className="res-score-bar-fill" style={{ width: `${score}%`, background: `linear-gradient(90deg, ${theme.color}88, ${theme.color})` }} />
            </div>
            <p className="res-score-pass">Passing score: 75%</p>
          </div>

          {/* Feedback */}
          {loadingFeedback && (
            <div className="res-panel" style={{ opacity: 1, animation: 'none' }}>
              <div className="res-loading-title"><Loader2 size={18} color="#93c5fd" style={{ animation: 'spin 1s linear infinite' }} />Generating Personalised Feedback…</div>
              <p className="res-loading-text">Our AI is analysing your performance and preparing custom recommendations.</p>
            </div>
          )}

          {feedbackError && (
            <div className="res-panel" style={{ opacity: 1, animation: 'none', border: '1px solid rgba(248,113,113,0.25)' }}>
              <div className="res-error-title"><XCircle size={18} color="#f87171" />Feedback Generation Failed</div>
              <p className="res-error-msg">{feedbackError}</p>
            </div>
          )}

          {aiFeedback && (
            <div className="res-panel" style={{ opacity: 0, animation: 'fade-up 0.6s 0.5s ease forwards' }}>
              <div className="res-feedback-title"><Lightbulb size={20} color="#60a5fa" />Personalised AI Feedback</div>

              {/* Analysis */}
              <div className="res-section">
                <div className="res-section-title" style={{ color: '#60a5fa' }}><TrendingUp size={13} />Performance Analysis</div>
                <p className="res-analysis">{aiFeedback.analysis}</p>
              </div>

              {/* Strengths */}
              {aiFeedback.strengths?.length > 0 && (
                <div className="res-section">
                  <div className="res-section-title" style={{ color: '#4ade80' }}><Star size={13} />Your Strengths</div>
                  <div className="res-list">
                    {aiFeedback.strengths.map((s, i) => (
                      <div key={i} className="res-list-item"><CheckCircle size={14} color="#4ade80" className="res-list-icon" />{s}</div>
                    ))}
                  </div>
                </div>
              )}

              {/* Improvements */}
              {aiFeedback.improvements?.length > 0 && (
                <div className="res-section">
                  <div className="res-section-title" style={{ color: '#f97316' }}><Target size={13} />Areas for Improvement</div>
                  <div className="res-list">
                    {aiFeedback.improvements.map((s, i) => (
                      <div key={i} className="res-list-item"><ArrowRight size={14} color="#f97316" className="res-list-icon" />{s}</div>
                    ))}
                  </div>
                </div>
              )}

              {/* Next Steps */}
              {aiFeedback.nextSteps?.length > 0 && (
                <div className="res-section">
                  <div className="res-section-title" style={{ color: '#d8b4fe' }}><BookOpen size={13} />Recommended Next Steps</div>
                  <div className="res-list">
                    {aiFeedback.nextSteps.map((s, i) => (
                      <div key={i} className="res-list-item"><div className="res-step-num">{i + 1}</div>{s}</div>
                    ))}
                  </div>
                </div>
              )}

              {/* Motivation */}
              {aiFeedback.motivation && (
                <div className="res-motivation">
                  <p className="res-motivation-text">"{aiFeedback.motivation}"</p>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="res-actions">
            <button className="res-btn-retake" onClick={handleRetakeTest}><RotateCcw size={15} />Retake Assessment</button>
            <button className="res-btn-continue" onClick={handleContinueLearning}><BookOpen size={15} />Continue Learning</button>
          </div>

          <div className="res-footer">
            <p className="res-date">Assessment completed on {new Date().toLocaleDateString()}</p>
          </div>
        </main>
      </div>
    </>
  );
}