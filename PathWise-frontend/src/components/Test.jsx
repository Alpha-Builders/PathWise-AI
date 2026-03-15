import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock, ArrowLeft, ArrowRight, CheckCircle, Circle,
  Flag, XCircle, Loader2, AlertCircle, Sparkles,
} from "lucide-react";
import assessmentQuestions from "../data/assessmentQuestions";

export default function Test() {
  const navigate = useNavigate();
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedPath, setSelectedPath] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [aiQuestions, setAiQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [questionError, setQuestionError] = useState(null);
  const [useAiQuestions, setUseAiQuestions] = useState(false);

  const API_BASE_URL = 'http://localhost:3001/api';

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const course = urlParams.get("course") || "";
    const path = urlParams.get("path") || "";
    const role = urlParams.get("role") || "";
    const skill = urlParams.get("skill") || "";
    setSelectedCourse(course); setSelectedPath(path); setSelectedRole(role); setSelectedSkill(skill);
    if (skill) {
      const predefined = assessmentQuestions[skill];
      if (!predefined || predefined.length === 0) fetchQuestionsForSkill(skill);
    }
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && !isSubmitted) {
      const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isSubmitted) {
      handleSubmit();
    }
  }, [timeLeft, isSubmitted]);

  const fetchQuestionsForSkill = async (skillName) => {
    setLoadingQuestions(true); setQuestionError(null);
    try {
      const message = `Generate 20 multiple-choice assessment questions for the skill: "${skillName}". Return ONLY a valid JSON array: [{ "id": 1, "question": "...", "options": ["A","B","C","D"], "correctAnswer": 0 }]. correctAnswer is index 0-3. Make questions specific to ${skillName}.`;
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: message }] })
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      const data = await response.json();
      const botResponse = data.choices?.[0]?.message?.content || data.response || data.output || data.value || (typeof data === 'string' ? data : '');
      const questions = parseQuestionsFromResponse(botResponse);
      if (questions.length > 0) { setAiQuestions(questions); setUseAiQuestions(true); }
      else throw new Error('No valid questions generated');
    } catch (error) {
      try {
        const fallbackResponse = await fetch(`${API_BASE_URL}/generate`, {
          method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ input_message: `Create 20 multiple-choice questions about ${skillName}. Return as JSON array with id, question, options (array of 4), and correctAnswer (index 0-3).` })
        });
        if (!fallbackResponse.ok) throw new Error(`HTTP ${fallbackResponse.status}`);
        const fallbackData = await fallbackResponse.json();
        const questions = parseQuestionsFromResponse(fallbackData.value || fallbackData.response || fallbackData.output || '');
        if (questions.length > 0) { setAiQuestions(questions); setUseAiQuestions(true); }
        else throw new Error('Fallback failed');
      } catch {
        setQuestionError(`Failed to generate questions: ${error.message}`);
      }
    } finally {
      setLoadingQuestions(false);
    }
  };

  const parseQuestionsFromResponse = (aiResponse) => {
    try {
      const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (Array.isArray(parsed)) {
          return parsed.filter(q => q.id !== undefined && q.question && Array.isArray(q.options) && q.options.length === 4 && typeof q.correctAnswer === 'number' && q.correctAnswer >= 0 && q.correctAnswer <= 3);
        }
      }
      const questionMatches = aiResponse.match(/\{[^}]*"question"[^}]*\}/g);
      if (questionMatches) {
        const questions = [];
        questionMatches.forEach((match, index) => {
          try {
            const q = JSON.parse(match);
            if (q.question && q.options && q.correctAnswer !== undefined) {
              questions.push({ id: index + 1, question: q.question, options: Array.isArray(q.options) ? q.options : [], correctAnswer: parseInt(q.correctAnswer) || 0 });
            }
          } catch {}
        });
        return questions;
      }
      return [];
    } catch { return []; }
  };

  const sampleQuestions = useAiQuestions ? aiQuestions :
    (selectedSkill && Array.isArray(assessmentQuestions[selectedSkill]) ? assessmentQuestions[selectedSkill] : []);

  const currentQ = sampleQuestions[currentQuestion] || {};

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const isLowTime = timeLeft < 5 * 60;

  const handleAnswerSelect = (questionId, answerIndex) => {
    if (isSubmitted) return;
    setAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
  };

  const createPageUrl = (pageName) => {
    const pageRoutes = { SkillsPage: "/skills", CareerPathPage: "/career-path", JobRolePage: "/job-roles", Assessment: "/assessment", ResultPage: "/result", TestPage: "/test" };
    return pageRoutes[pageName] || "/";
  };

  const calculateScore = () => {
    if (sampleQuestions.length === 0) return 0;
    let correct = 0;
    sampleQuestions.forEach(q => { if (answers[q.id] === q.correctAnswer) correct++; });
    return Math.round((correct / sampleQuestions.length) * 100);
  };

  const handleSubmit = () => {
    if (isSubmitted) return;
    setIsSubmitted(true);
    const score = calculateScore();
    navigate(createPageUrl("ResultPage") + `?course=${encodeURIComponent(selectedCourse)}&path=${selectedPath}&role=${selectedRole}&skill=${selectedSkill}&score=${score}&useAi=${useAiQuestions}`);
  };

  const progress = sampleQuestions.length ? ((currentQuestion + 1) / sampleQuestions.length) * 100 : 0;
  const answeredCount = Object.keys(answers).length;

  // ── SHARED STYLES ──────────────────────────────────────────────
  const sharedCSS = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root { --green-core: #22c55e; --green-bright: #4ade80; --green-deep: #15803d; --surface: rgba(255,255,255,0.03); --surface-2: rgba(255,255,255,0.06); --border: rgba(255,255,255,0.08); --border-green: rgba(34,197,94,0.35); --text-primary: #f0fdf4; --text-muted: #6b7280; --bg: #080d0a; }
    .test-root { min-height: 100vh; background: var(--bg); color: var(--text-primary); font-family: 'Poppins', sans-serif; position: relative; overflow-x: hidden; }
    .test-root::before { content: ''; position: fixed; inset: 0; background-image: linear-gradient(rgba(34,197,94,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.04) 1px, transparent 1px); background-size: 60px 60px; pointer-events: none; z-index: 0; }
    .test-orb { position: fixed; border-radius: 50%; pointer-events: none; filter: blur(130px); z-index: 0; }
    .test-orb-1 { width: 700px; height: 700px; background: radial-gradient(circle, rgba(34,197,94,0.09) 0%, transparent 70%); top: -250px; left: -150px; animation: orb-drift 9s ease-in-out infinite alternate; }
    .test-orb-2 { width: 550px; height: 550px; background: radial-gradient(circle, rgba(21,128,61,0.08) 0%, transparent 70%); bottom: -200px; right: -100px; animation: orb-drift 12s ease-in-out infinite alternate-reverse; }
    @keyframes orb-drift { from { transform: translate(0,0); } to { transform: translate(50px,40px); } }
    .test-logo { display: flex; align-items: center; gap: 10px; }
    .test-logo-mark { width: 36px; height: 36px; background: linear-gradient(135deg, var(--green-core), var(--green-deep)); border-radius: 10px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 20px rgba(34,197,94,0.4); }
    .test-logo-text { font-family: 'Poppins', sans-serif; font-size: 22px; background: linear-gradient(90deg, #fff, var(--green-bright)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    @keyframes fade-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    @media (max-width: 640px) { .test-root { padding: 0 !important; } }
  `;

  // ── LOADING STATE ──────────────────────────────────────────────
  if (loadingQuestions) return (
    <>
      <style>{sharedCSS}</style>
      <div className="test-root" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div className="test-orb test-orb-1" /><div className="test-orb test-orb-2" />
        <div style={{ position: 'relative', zIndex: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(96,165,250,0.3)', borderRadius: '28px', padding: '48px 40px', maxWidth: '480px', width: '100%', textAlign: 'center' }}>
          <div style={{ position: 'absolute', top: 0, left: 32, right: 32, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(96,165,250,0.5), transparent)' }} />
          <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <Loader2 size={28} color="#93c5fd" style={{ animation: 'spin 1s linear infinite' }} />
          </div>
          <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: '26px', fontWeight: 400, color: '#f0fdf4', marginBottom: '12px' }}>Generating Questions…</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '20px' }}>
            Our AI is creating 20 personalised questions for <strong style={{ color: '#93c5fd' }}>{selectedSkill}</strong>
          </p>
          <div style={{ background: 'rgba(96,165,250,0.06)', border: '1px solid rgba(96,165,250,0.2)', borderRadius: '12px', padding: '14px', fontSize: '13px', color: '#93c5fd' }}>
            🤖 Tailoring questions to your specific skill level
          </div>
        </div>
      </div>
    </>
  );

  // ── ERROR STATE ──────────────────────────────────────────────
  if (questionError) return (
    <>
      <style>{sharedCSS}</style>
      <div className="test-root" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div className="test-orb test-orb-1" /><div className="test-orb test-orb-2" />
        <div style={{ position: 'relative', zIndex: 10, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '28px', padding: '48px 40px', maxWidth: '480px', width: '100%', textAlign: 'center' }}>
          <AlertCircle size={40} color="#f87171" style={{ margin: '0 auto 20px' }} />
          <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: '26px', fontWeight: 400, color: '#f87171', marginBottom: '12px' }}>Generation Failed</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '28px', lineHeight: 1.6 }}>{questionError}</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button onClick={() => fetchQuestionsForSkill(selectedSkill)} style={{ padding: '12px 24px', borderRadius: '14px', background: 'linear-gradient(135deg, var(--green-core), var(--green-deep))', color: '#fff', fontSize: '14px', fontWeight: 700, cursor: 'pointer', border: 'none', fontFamily: 'DM Sans, sans-serif' }}>Try Again</button>
            <button onClick={() => navigate(-1)} style={{ padding: '12px 24px', borderRadius: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-muted)', fontSize: '14px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>Go Back</button>
          </div>
        </div>
      </div>
    </>
  );

  // ── EMPTY STATE ──────────────────────────────────────────────
  if (!selectedSkill || sampleQuestions.length === 0) return (
    <>
      <style>{sharedCSS}</style>
      <div className="test-root" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div className="test-orb test-orb-1" /><div className="test-orb test-orb-2" />
        <div style={{ position: 'relative', zIndex: 10, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '28px', padding: '48px 40px', maxWidth: '520px', width: '100%', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: '26px', fontWeight: 400, color: '#f87171', marginBottom: '12px' }}>Cannot Start Assessment</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px', lineHeight: 1.6 }}>
            {!selectedSkill ? 'No skill selected. Please provide a valid skill in the query string.' : `Failed to load or generate questions for "${selectedSkill}".`}
          </p>
          <p style={{ fontSize: '12px', color: '#4b5563', marginBottom: '28px' }}>
            course="{selectedCourse || 'none'}", path="{selectedPath || 'none'}", role="{selectedRole || 'none'}", skill="{selectedSkill || 'none'}"
          </p>
          <button onClick={() => selectedSkill && fetchQuestionsForSkill(selectedSkill)} disabled={!selectedSkill}
            style={{ padding: '12px 28px', borderRadius: '14px', background: 'linear-gradient(135deg, var(--green-core), var(--green-deep))', color: '#fff', fontSize: '14px', fontWeight: 700, cursor: selectedSkill ? 'pointer' : 'not-allowed', border: 'none', fontFamily: 'DM Sans, sans-serif', opacity: selectedSkill ? 1 : 0.5 }}>
            Generate Questions
          </button>
        </div>
      </div>
    </>
  );

  // ── MAIN ASSESSMENT ──────────────────────────────────────────
  return (
    <>
      <style>{sharedCSS}{`
        .test-header { position: relative; z-index: 20; display: flex; justify-content: space-between; align-items: center; padding: 18px 40px; border-bottom: 1px solid var(--border); backdrop-filter: blur(12px); gap: 16px; flex-wrap: wrap; }
        .test-header-center { display: flex; flex-direction: column; align-items: center; gap: 4px; flex: 1; }
        .test-skill-name { font-family: 'Poppins', sans-serif; font-size: 18px; font-weight: 400; color: var(--text-primary); display: flex; align-items: center; gap: 8px; }
        .test-ai-tag { font-size: 10px; font-weight: 600; padding: 3px 10px; border-radius: 100px; background: rgba(96,165,250,0.1); border: 1px solid rgba(96,165,250,0.3); color: #93c5fd; }
        .test-q-counter { font-size: 12px; color: var(--text-muted); }
        .test-timer { display: flex; align-items: center; gap: 8px; padding: 10px 16px; border-radius: 12px; border: 1px solid; font-family: 'Poppins', monospace; font-size: 16px; font-weight: 700; transition: all 0.3s; }
        .test-answered { font-size: 12px; color: var(--text-muted); white-space: nowrap; }

        .test-progress-bar { position: relative; z-index: 10; width: 100%; height: 3px; background: rgba(255,255,255,0.06); }
        .test-progress-fill { height: 100%; background: linear-gradient(90deg, var(--green-deep), var(--green-bright)); transition: width 0.4s ease; }

        .test-body { position: relative; z-index: 10; display: grid; grid-template-columns: 1fr 280px; gap: 20px; max-width: 1140px; margin: 0 auto; padding: 36px 40px 60px; }
        @media (max-width: 900px) { .test-body { grid-template-columns: 1fr; } .test-sidebar { order: -1; } }
        @media (max-width: 640px) { .test-body { padding: 24px 20px 40px; } .test-header { padding: 14px 20px; } }

        /* Question card */
        .test-q-card { background: var(--surface); border: 1px solid var(--border); border-radius: 24px; padding: 36px; position: relative; overflow: hidden; }
        .test-q-card::before { content: ''; position: absolute; top: 0; left: 24px; right: 24px; height: 1px; background: linear-gradient(90deg, transparent, var(--border-green), transparent); }
        .test-q-num-row { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
        .test-q-num-badge { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, var(--green-core), var(--green-deep)); display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: #fff; flex-shrink: 0; box-shadow: 0 0 12px rgba(34,197,94,0.4); }
        .test-q-label { font-size: 12px; font-weight: 600; color: var(--green-bright); letter-spacing: 0.3px; }
        .test-q-text { font-family: 'Poppins', sans-serif; font-size: clamp(18px, 2.5vw, 24px); font-weight: 400; color: var(--text-primary); line-height: 1.4; margin-bottom: 32px; }

        /* Options */
        .test-options { display: flex; flex-direction: column; gap: 10px; margin-bottom: 32px; }
        .test-option { width: 100%; text-align: left; padding: 18px 20px; border-radius: 16px; cursor: pointer; transition: all 0.2s ease; font-family: 'Poppins', sans-serif; display: flex; align-items: center; gap: 14px; border: 1px solid; }
        .test-option:disabled { cursor: not-allowed; }
        .test-option.default { background: rgba(0,0,0,0.2); border-color: rgba(255,255,255,0.08); }
        .test-option.default:not(:disabled):hover { border-color: var(--border-green); background: rgba(34,197,94,0.06); }
        .test-option.selected { background: rgba(96,165,250,0.08); border-color: rgba(96,165,250,0.4); }
        .test-option.correct { background: rgba(34,197,94,0.1); border-color: rgba(34,197,94,0.4); }
        .test-option.wrong { background: rgba(239,68,68,0.08); border-color: rgba(239,68,68,0.35); }
        .test-option-dot { width: 20px; height: 20px; border-radius: 50%; border: 2px solid; flex-shrink: 0; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
        .test-option.default:not(:disabled):hover .test-option-dot { border-color: var(--green-core); }
        .test-option.selected .test-option-dot { border-color: #60a5fa; background: #60a5fa; }
        .test-option.correct .test-option-dot { border-color: var(--green-core); background: var(--green-core); }
        .test-option.wrong .test-option-dot { border-color: #ef4444; background: #ef4444; }
        .test-option-letter { width: 26px; height: 26px; border-radius: 8px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; color: var(--text-muted); flex-shrink: 0; transition: all 0.2s; }
        .test-option.selected .test-option-letter { background: rgba(96,165,250,0.12); border-color: rgba(96,165,250,0.3); color: #93c5fd; }
        .test-option.correct .test-option-letter { background: rgba(34,197,94,0.12); border-color: rgba(34,197,94,0.3); color: var(--green-bright); }
        .test-option.wrong .test-option-letter { background: rgba(239,68,68,0.1); border-color: rgba(239,68,68,0.3); color: #f87171; }
        .test-option-text { font-size: 14px; font-weight: 500; color: var(--text-primary); line-height: 1.5; flex: 1; }

        /* Nav */
        .test-nav { display: flex; justify-content: space-between; align-items: center; }
        .test-btn-prev { display: inline-flex; align-items: center; gap: 7px; padding: 12px 22px; border-radius: 14px; background: var(--surface); border: 1px solid var(--border); color: var(--text-muted); font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s; font-family: 'Poppins', sans-serif; }
        .test-btn-prev:not(:disabled):hover { border-color: var(--border-green); color: var(--green-bright); }
        .test-btn-prev:disabled { opacity: 0.4; cursor: not-allowed; }
        .test-btn-next { display: inline-flex; align-items: center; gap: 7px; padding: 12px 24px; border-radius: 14px; background: linear-gradient(135deg, var(--green-core), var(--green-deep)); color: #fff; font-size: 13px; font-weight: 700; cursor: pointer; border: none; transition: all 0.3s ease; font-family: 'Poppins', sans-serif; box-shadow: 0 6px 20px rgba(34,197,94,0.3); }
        .test-btn-next:hover { transform: translateY(-1px); box-shadow: 0 10px 28px rgba(34,197,94,0.45); }
        .test-btn-submit { display: inline-flex; align-items: center; gap: 7px; padding: 12px 26px; border-radius: 14px; background: linear-gradient(135deg, #f59e0b, #d97706); color: #fff; font-size: 13px; font-weight: 700; cursor: pointer; border: none; transition: all 0.3s ease; font-family: 'Poppins', sans-serif; box-shadow: 0 6px 20px rgba(245,158,11,0.3); }
        .test-btn-submit:not(:disabled):hover { transform: translateY(-1px); box-shadow: 0 10px 28px rgba(245,158,11,0.45); }
        .test-btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }
        .test-btn-submit::after { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(255,255,255,0.12), transparent); pointer-events: none; border-radius: inherit; }

        /* Sidebar */
        .test-sidebar { display: flex; flex-direction: column; gap: 16px; }
        .test-overview-card { background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 22px; position: relative; overflow: hidden; }
        .test-overview-card::before { content: ''; position: absolute; top: 0; left: 16px; right: 16px; height: 1px; background: linear-gradient(90deg, transparent, var(--border-green), transparent); }
        .test-overview-label { font-size: 11px; font-weight: 600; letter-spacing: 0.8px; text-transform: uppercase; color: var(--text-muted); margin-bottom: 14px; }
        .test-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; }
        .test-grid-btn { aspect-ratio: 1; border-radius: 8px; font-size: 11px; font-weight: 700; cursor: pointer; transition: all 0.15s ease; border: 1px solid; font-family: 'Poppins', sans-serif; display: flex; align-items: center; justify-content: center; }
        .test-grid-btn.answered { background: rgba(34,197,94,0.12); border-color: rgba(34,197,94,0.3); color: var(--green-bright); }
        .test-grid-btn.active { background: var(--green-core); border-color: var(--green-core); color: #fff; box-shadow: 0 0 10px rgba(34,197,94,0.4); }
        .test-grid-btn.unanswered { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.08); color: var(--text-muted); }
        .test-grid-btn:hover { border-color: var(--border-green); }

        .test-stats-card { background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 20px; }
        .test-stat { display: flex; justify-content: space-between; align-items: center; padding: 9px 0; border-bottom: 1px solid rgba(255,255,255,0.04); font-size: 13px; }
        .test-stat:last-child { border-bottom: none; padding-bottom: 0; }
        .test-stat:first-child { padding-top: 0; }
        .test-stat-label { color: var(--text-muted); }
        .test-stat-val { font-weight: 600; color: var(--text-primary); }
      `}</style>

      <div className="test-root">
        <div className="test-orb test-orb-1" /><div className="test-orb test-orb-2" />

        {/* Header */}
        <header className="test-header">
          <div className="test-logo">
            <div className="test-logo-mark"><Sparkles size={16} color="#fff" /></div>
            <span className="test-logo-text">Pathwise AI</span>
          </div>
          <div className="test-header-center">
            <div className="test-skill-name">
              {selectedSkill} Assessment
              {useAiQuestions && <span className="test-ai-tag">🤖 AI Generated</span>}
            </div>
            <span className="test-q-counter">Question {currentQuestion + 1} of {sampleQuestions.length}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div className="test-timer" style={{
              borderColor: isLowTime ? 'rgba(239,68,68,0.4)' : 'rgba(34,197,94,0.3)',
              background: isLowTime ? 'rgba(239,68,68,0.08)' : 'rgba(34,197,94,0.08)',
              color: isLowTime ? '#f87171' : 'var(--green-bright)',
            }}>
              <Clock size={15} />
              {formatTime(timeLeft)}
            </div>
            <span className="test-answered">{answeredCount}/{sampleQuestions.length} answered</span>
          </div>
        </header>

        {/* Progress bar */}
        <div className="test-progress-bar">
          <div className="test-progress-fill" style={{ width: `${progress}%` }} />
        </div>

        {/* Body */}
        <div className="test-body">
          {/* Question card */}
          <div>
            <div className="test-q-card">
              <div className="test-q-num-row">
                <div className="test-q-num-badge">{currentQuestion + 1}</div>
                <span className="test-q-label">
                  Question {currentQuestion + 1}
                  {useAiQuestions && <span style={{ color: '#93c5fd', marginLeft: '6px' }}>· AI Generated</span>}
                </span>
              </div>

              <p className="test-q-text">{currentQ.question}</p>

              <div className="test-options">
                {currentQ.options?.map((option, index) => {
                  const isSelected = answers[currentQ.id] === index;
                  const isCorrect = isSubmitted && currentQ.correctAnswer === index;
                  const isWrong = isSubmitted && isSelected && currentQ.correctAnswer !== index;
                  const stateClass = isCorrect ? 'correct' : isWrong ? 'wrong' : isSelected ? 'selected' : 'default';

                  return (
                    <button key={index} className={`test-option ${stateClass}`}
                      onClick={() => handleAnswerSelect(currentQ.id, index)} disabled={isSubmitted}>
                      <div className="test-option-dot" style={{
                        borderColor: isCorrect ? 'var(--green-core)' : isWrong ? '#ef4444' : isSelected ? '#60a5fa' : 'rgba(255,255,255,0.2)',
                      }}>
                        {isCorrect && <CheckCircle size={11} color="#fff" />}
                        {isWrong && <XCircle size={11} color="#fff" />}
                        {!isCorrect && !isWrong && isSelected && <Circle size={11} color="#fff" />}
                      </div>
                      <div className="test-option-letter">{String.fromCharCode(65 + index)}</div>
                      <span className="test-option-text">{option}</span>
                    </button>
                  );
                })}
              </div>

              <div className="test-nav">
                <button className="test-btn-prev"
                  onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                  disabled={currentQuestion === 0}>
                  <ArrowLeft size={14} />Previous
                </button>
                <div style={{ position: 'relative' }}>
                  {currentQuestion < sampleQuestions.length - 1 ? (
                    <button className="test-btn-next" onClick={() => setCurrentQuestion(currentQuestion + 1)}>
                      Next <ArrowRight size={14} />
                    </button>
                  ) : (
                    <button className="test-btn-submit" onClick={handleSubmit}
                      disabled={answeredCount < sampleQuestions.length} style={{ position: 'relative' }}>
                      <Flag size={14} />Submit Assessment
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="test-sidebar">
            {/* Stats */}
            <div className="test-stats-card">
              <div className="test-stat">
                <span className="test-stat-label">Answered</span>
                <span className="test-stat-val" style={{ color: 'var(--green-bright)' }}>{answeredCount}</span>
              </div>
              <div className="test-stat">
                <span className="test-stat-label">Remaining</span>
                <span className="test-stat-val" style={{ color: '#fbbf24' }}>{sampleQuestions.length - answeredCount}</span>
              </div>
              <div className="test-stat">
                <span className="test-stat-label">Total</span>
                <span className="test-stat-val">{sampleQuestions.length}</span>
              </div>
              <div className="test-stat">
                <span className="test-stat-label">Time left</span>
                <span className="test-stat-val" style={{ color: isLowTime ? '#f87171' : 'var(--text-primary)', fontFamily: 'monospace' }}>{formatTime(timeLeft)}</span>
              </div>
            </div>

            {/* Overview grid */}
            <div className="test-overview-card">
              <div className="test-overview-label">Question Overview</div>
              <div className="test-grid">
                {sampleQuestions.map((_, index) => {
                  const isAnswered = answers[sampleQuestions[index].id] !== undefined;
                  const isActive = index === currentQuestion;
                  return (
                    <button key={index}
                      className={`test-grid-btn ${isActive ? 'active' : isAnswered ? 'answered' : 'unanswered'}`}
                      onClick={() => setCurrentQuestion(index)}>
                      {index + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}