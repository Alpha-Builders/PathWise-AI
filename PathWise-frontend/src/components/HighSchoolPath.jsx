import React, { useState, useEffect } from 'react';
import { BookOpen, Beaker, TrendingUp, ArrowRight, ArrowLeft, X, Bell, User, Sparkles } from 'lucide-react';
import { scienceQuestions, artQuestions, commercialQuestions } from "../data/HighSchoolQuestions";

const SHARED_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --green-core: #22c55e; --green-bright: #4ade80; --green-deep: #15803d;
    --amber: #f59e0b;
    --surface: rgba(255,255,255,0.03); --surface-2: rgba(255,255,255,0.06);
    --border: rgba(255,255,255,0.08); --border-green: rgba(34,197,94,0.35);
    --text-primary: #f0fdf4; --text-muted: #6b7280; --bg: #080d0a;
  }
  .hs-root { min-height: 100vh; background: var(--bg); color: var(--text-primary); font-family: 'Poppins', sans-serif; position: relative; overflow-x: hidden; }
  .hs-root::before { content: ''; position: fixed; inset: 0; background-image: linear-gradient(rgba(34,197,94,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.04) 1px, transparent 1px); background-size: 60px 60px; pointer-events: none; z-index: 0; }
  .hs-orb { position: fixed; border-radius: 50%; pointer-events: none; filter: blur(130px); z-index: 0; }
  .hs-orb-1 { width: 700px; height: 700px; background: radial-gradient(circle, rgba(34,197,94,0.09) 0%, transparent 70%); top: -250px; left: -150px; animation: orb-drift 9s ease-in-out infinite alternate; }
  .hs-orb-2 { width: 550px; height: 550px; background: radial-gradient(circle, rgba(21,128,61,0.08) 0%, transparent 70%); bottom: -200px; right: -100px; animation: orb-drift 12s ease-in-out infinite alternate-reverse; }
  @keyframes orb-drift { from { transform: translate(0,0); } to { transform: translate(50px,40px); } }

  .hs-header { position: relative; z-index: 20; display: flex; justify-content: space-between; align-items: center; padding: 20px 40px; border-bottom: 1px solid var(--border); backdrop-filter: blur(12px); }
  .hs-logo { display: flex; align-items: center; gap: 10px; }
  .hs-logo-mark { width: 36px; height: 36px; background: linear-gradient(135deg, var(--green-core), var(--green-deep)); border-radius: 10px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 20px rgba(34,197,94,0.4); }
  .hs-logo-text { font-family: 'Poppins', sans-serif; font-size: 22px; background: linear-gradient(90deg, #fff, var(--green-bright)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .hs-header-right { display: flex; gap: 8px; }
  .hs-icon-btn { position: relative; width: 40px; height: 40px; background: var(--surface); border: 1px solid var(--border); border-radius: 12px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; color: var(--text-muted); }
  .hs-icon-btn:hover { background: var(--surface-2); border-color: var(--border-green); color: var(--green-bright); }
  .hs-notif-dot { position: absolute; top: 8px; right: 8px; width: 7px; height: 7px; background: var(--green-core); border-radius: 50%; border: 1.5px solid var(--bg); animation: pulse-dot 2s ease infinite; }
  @keyframes pulse-dot { 0%,100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.5); } 50% { box-shadow: 0 0 0 4px rgba(34,197,94,0); } }

  .hs-main { position: relative; z-index: 10; max-width: 960px; margin: 0 auto; padding: 64px 40px 80px; }
  .hs-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(34,197,94,0.08); border: 1px solid var(--border-green); border-radius: 100px; padding: 6px 16px; font-size: 12px; font-weight: 500; color: var(--green-bright); letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 24px; opacity: 0; animation: fade-up 0.6s 0.1s ease forwards; }
  .hs-headline { font-family: 'Poppins', sans-serif; font-size: clamp(36px, 5vw, 60px); line-height: 1.1; font-weight: 400; color: var(--text-primary); margin-bottom: 14px; opacity: 0; animation: fade-up 0.6s 0.2s ease forwards; }
  .hs-headline em { font-style: italic; background: linear-gradient(90deg, var(--green-core), var(--green-bright)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .hs-subtext { font-size: 16px; line-height: 1.7; color: var(--text-muted); max-width: 520px; margin: 0 auto; opacity: 0; animation: fade-up 0.6s 0.3s ease forwards; }

  @keyframes fade-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  @media (max-width: 640px) { .hs-main { padding: 48px 20px 60px; } .hs-header { padding: 16px 20px; } }
`;

function HighSchoolPath() {
  const [currentPage, setCurrentPage] = useState('fieldSelection');
  const [selectedField, setSelectedField] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState([]);
  const [firstname, setFirstname] = useState('');

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

  const getQuestionsForField = (field) => {
    switch(field) {
      case 'science': return scienceQuestions;
      case 'art': return artQuestions;
      case 'commercial': return commercialQuestions;
      default: return [];
    }
  };

  const handleFieldSelection = (field) => { setSelectedField(field); setCurrentPage('questions'); setCurrentQuestion(0); setAnswers({}); };
  const handleAnswer = (answer) => {
    const questions = getQuestionsForField(selectedField);
    const newAnswers = { ...answers, [currentQuestion]: answer };
    setAnswers(newAnswers);
    if (currentQuestion < questions.length - 1) setCurrentQuestion(currentQuestion + 1);
    else calculateResults(newAnswers, questions);
  };
  const handleBack = () => { if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1); };
  const handleCancel = () => { setCurrentPage('fieldSelection'); setSelectedField(null); setCurrentQuestion(0); setAnswers({}); };
  const calculateResults = (finalAnswers, questions) => {
    const careerScores = {};
    questions.forEach((q, index) => {
      const answer = finalAnswers[index];
      const weight = answer === 'yes' ? 1 : answer === 'maybe' ? 0.5 : 0;
      Object.entries(q.careerTags).forEach(([career, tagWeight]) => {
        if (!careerScores[career]) careerScores[career] = 0;
        careerScores[career] += weight * tagWeight;
      });
    });
    const sortedCareers = Object.entries(careerScores).sort((a,b) => b[1]-a[1]).slice(0,3).map(([career,score]) => ({career,score}));
    setResults(sortedCareers);
    setCurrentPage('results');
  };
  const resetQuiz = () => { setCurrentPage('fieldSelection'); setSelectedField(null); setCurrentQuestion(0); setAnswers({}); setResults([]); };

  const fields = [
    { key: 'science', icon: Beaker, label: 'Science', desc: 'Medicine, Engineering, Research & Technology', color: '#22c55e', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.3)' },
    { key: 'art', icon: BookOpen, label: 'Arts', desc: 'Design, Media, Entertainment & Creative Fields', color: '#a78bfa', bg: 'rgba(167,139,250,0.08)', border: 'rgba(167,139,250,0.3)' },
    { key: 'commercial', icon: TrendingUp, label: 'Commercial', desc: 'Business, Finance, Marketing & Management', color: '#60a5fa', bg: 'rgba(96,165,250,0.08)', border: 'rgba(96,165,250,0.3)' },
  ];

  // ── FIELD SELECTION ──────────────────────────────────────────────
  if (currentPage === 'fieldSelection') return (
    <>
      <style>{SHARED_CSS}{`
        .hs-hero { text-align: center; margin-bottom: 56px; }
        .hs-panel { background: var(--surface); border: 1px solid var(--border); border-radius: 28px; padding: 40px; position: relative; overflow: hidden; opacity: 0; animation: fade-up 0.6s 0.4s ease forwards; margin-bottom: 48px; }
        .hs-panel::before { content: ''; position: absolute; top: 0; left: 32px; right: 32px; height: 1px; background: linear-gradient(90deg, transparent, var(--border-green), transparent); }
        .hs-panel-label { text-align: center; font-family: 'Poppins', sans-serif; font-size: 22px; font-weight: 400; color: var(--text-primary); margin-bottom: 8px; }
        .hs-panel-sub { text-align: center; font-size: 13px; color: var(--text-muted); margin-bottom: 36px; }
        .hs-fields-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 0; }
        @media (max-width: 680px) { .hs-fields-grid { grid-template-columns: 1fr; } }
        .hs-field-card { position: relative; background: var(--surface); border: 2px solid var(--border); border-radius: 22px; padding: 32px 24px; cursor: pointer; transition: all 0.35s cubic-bezier(0.34,1.56,0.64,1); overflow: hidden; text-align: center; }
        .hs-field-card::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(34,197,94,0.07), transparent 60%); opacity: 0; transition: opacity 0.35s; border-radius: inherit; }
        .hs-field-card:hover { transform: translateY(-4px); }
        .hs-field-card:hover::before { opacity: 1; }
        .hs-field-icon { width: 64px; height: 64px; border-radius: 18px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; transition: all 0.3s ease; }
        .hs-field-card:hover .hs-field-icon { box-shadow: 0 0 24px rgba(255,255,255,0.1); }
        .hs-field-name { font-family: 'Poppins', sans-serif; font-size: 26px; font-weight: 400; color: var(--text-primary); margin-bottom: 8px; }
        .hs-field-desc { font-size: 13px; color: var(--text-muted); line-height: 1.6; }
        .hs-popular { opacity: 0; animation: fade-up 0.6s 0.55s ease forwards; }
        .hs-popular-label { text-align: center; font-size: 13px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; color: var(--text-muted); margin-bottom: 16px; }
        .hs-popular-pills { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; }
        .hs-pill { padding: 8px 20px; border-radius: 100px; background: var(--surface); border: 1px solid var(--border); color: var(--text-muted); font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s; font-family: 'Poppins', sans-serif; }
        .hs-pill:hover { border-color: var(--border-green); color: var(--green-bright); background: rgba(34,197,94,0.06); }
      `}</style>
      <div className="hs-root">
        <div className="hs-orb hs-orb-1" /><div className="hs-orb hs-orb-2" />
        <header className="hs-header">
          <div className="hs-logo"><div className="hs-logo-mark"><Sparkles size={16} color="#fff" /></div><span className="hs-logo-text">Pathwise AI</span></div>
          <div className="hs-header-right">
            <button className="hs-icon-btn"><Bell size={16} /><span className="hs-notif-dot" /></button>
            <button className="hs-icon-btn"><User size={16} /></button>
          </div>
        </header>
        <main className="hs-main">
          <div className="hs-hero" style={{ textAlign: 'center' }}>
            <div className="hs-badge"><Sparkles size={11} />High School Path</div>
            <h1 className="hs-headline">Let's find your <em>perfect career!</em></h1>
            <p className="hs-subtext">Select your field of study to get personalized career recommendations based on your interests and skills.</p>
          </div>

          <div className="hs-panel">
            <p className="hs-panel-label">What field are you studying?</p>
            <p className="hs-panel-sub">Choose your field to answer 15 tailored questions</p>
            <div className="hs-fields-grid">
              {fields.map((f, i) => {
                const Icon = f.icon;
                return (
                  <button
                    key={f.key}
                    className="hs-field-card"
                    onClick={() => handleFieldSelection(f.key)}
                    style={{ borderColor: 'var(--border)', animationDelay: `${0.45 + i * 0.08}s`, opacity: 0, animation: `fade-up 0.5s ${0.45 + i * 0.08}s ease forwards` }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = f.border; e.currentTarget.style.boxShadow = `0 16px 48px rgba(0,0,0,0.4)`; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <div className="hs-field-icon" style={{ background: f.bg, border: `1px solid ${f.border}` }}>
                      <Icon size={28} color={f.color} />
                    </div>
                    <h3 className="hs-field-name">{f.label}</h3>
                    <p className="hs-field-desc">{f.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="hs-popular">
            <p className="hs-popular-label">Quick Select</p>
            <div className="hs-popular-pills">
              {fields.map(f => (
                <button key={f.key} className="hs-pill" onClick={() => handleFieldSelection(f.key)}>{f.label}</button>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );

  // ── QUESTIONS ────────────────────────────────────────────────────
  if (currentPage === 'questions') {
    const questions = getQuestionsForField(selectedField);
    const currentQ = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    const fieldMeta = fields.find(f => f.key === selectedField);

    return (
      <>
        <style>{SHARED_CSS}{`
          .hs-q-header { position: relative; z-index: 20; display: flex; justify-content: space-between; align-items: center; padding: 20px 40px; border-bottom: 1px solid var(--border); backdrop-filter: blur(12px); }
          .hs-cancel-btn { display: flex; align-items: center; gap: 7px; padding: 9px 18px; border-radius: 12px; background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.3); color: #f87171; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: 'Poppins', sans-serif; }
          .hs-cancel-btn:hover { background: rgba(239,68,68,0.14); }
          .hs-q-main { position: relative; z-index: 10; max-width: 700px; margin: 0 auto; padding: 64px 40px 80px; }
          .hs-q-card { background: var(--surface); border: 1px solid var(--border); border-radius: 28px; padding: 40px; position: relative; overflow: hidden; }
          .hs-q-card::before { content: ''; position: absolute; top: 0; left: 32px; right: 32px; height: 1px; background: linear-gradient(90deg, transparent, var(--border-green), transparent); }
          .hs-q-meta { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
          .hs-q-counter { font-size: 13px; color: var(--text-muted); }
          .hs-q-field-tag { font-size: 11px; font-weight: 600; padding: 4px 14px; border-radius: 100px; text-transform: capitalize; letter-spacing: 0.3px; }
          .hs-q-bar { width: 100%; height: 4px; background: rgba(255,255,255,0.06); border-radius: 100px; overflow: hidden; margin-bottom: 36px; }
          .hs-q-bar-fill { height: 100%; border-radius: 100px; background: linear-gradient(90deg, var(--green-deep), var(--green-bright)); transition: width 0.4s ease; }
          .hs-q-text { font-family: 'Poppins', sans-serif; font-size: clamp(20px, 3.5vw, 30px); font-weight: 400; color: var(--text-primary); text-align: center; margin-bottom: 36px; line-height: 1.35; }
          .hs-answer-btn { width: 100%; padding: 20px 24px; border-radius: 16px; text-align: left; cursor: pointer; transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1); margin-bottom: 10px; background: var(--surface); border: 1px solid var(--border); font-family: 'Poppins', sans-serif; }
          .hs-answer-btn:last-of-type { margin-bottom: 0; }
          .hs-answer-btn:hover { transform: translateY(-2px); }
          .hs-answer-yes { }
          .hs-answer-yes:hover { border-color: rgba(34,197,94,0.4); background: rgba(34,197,94,0.06); }
          .hs-answer-maybe:hover { border-color: rgba(251,191,36,0.4); background: rgba(251,191,36,0.06); }
          .hs-answer-no:hover { border-color: rgba(248,113,113,0.4); background: rgba(248,113,113,0.06); }
          .hs-answer-label { font-size: 17px; font-weight: 600; }
          .hs-back-wrap { display: flex; justify-content: center; margin-top: 28px; }
          .hs-back-btn { display: inline-flex; align-items: center; gap: 8px; padding: 11px 24px; border-radius: 14px; background: var(--surface); border: 1px solid var(--border); color: var(--text-muted); font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s; font-family: 'Poppins', sans-serif; }
          .hs-back-btn:hover { border-color: var(--border-green); color: var(--green-bright); }
          @media (max-width: 640px) { .hs-q-main { padding: 40px 20px 60px; } .hs-q-header { padding: 16px 20px; } }
        `}</style>
        <div className="hs-root">
          <div className="hs-orb hs-orb-1" /><div className="hs-orb hs-orb-2" />
          <header className="hs-q-header">
            <div className="hs-logo"><div className="hs-logo-mark"><Sparkles size={16} color="#fff" /></div><span className="hs-logo-text">Pathwise AI</span></div>
            <button className="hs-cancel-btn" onClick={handleCancel}><X size={14} />Cancel</button>
          </header>
          <main className="hs-q-main">
            <div className="hs-q-card">
              <div className="hs-q-meta">
                <span className="hs-q-counter">Question {currentQuestion + 1} of {questions.length}</span>
                <span className="hs-q-field-tag" style={{ background: fieldMeta?.bg, border: `1px solid ${fieldMeta?.border}`, color: fieldMeta?.color }}>{selectedField}</span>
              </div>
              <div className="hs-q-bar"><div className="hs-q-bar-fill" style={{ width: `${progress}%` }} /></div>
              <p className="hs-q-text">{currentQ.question}</p>
              <div>
                <button className="hs-answer-btn hs-answer-yes" onClick={() => handleAnswer('yes')}>
                  <span className="hs-answer-label" style={{ color: '#4ade80' }}>Yes, definitely!</span>
                </button>
                <button className="hs-answer-btn hs-answer-maybe" onClick={() => handleAnswer('maybe')}>
                  <span className="hs-answer-label" style={{ color: '#fbbf24' }}>Maybe / Sometimes</span>
                </button>
                <button className="hs-answer-btn hs-answer-no" onClick={() => handleAnswer('no')}>
                  <span className="hs-answer-label" style={{ color: '#f87171' }}>No, not really</span>
                </button>
              </div>
              {currentQuestion > 0 && (
                <div className="hs-back-wrap">
                  <button className="hs-back-btn" onClick={handleBack}><ArrowLeft size={15} />Previous Question</button>
                </div>
              )}
            </div>
          </main>
        </div>
      </>
    );
  }

  // ── RESULTS ──────────────────────────────────────────────────────
  if (currentPage === 'results') return (
    <>
      <style>{SHARED_CSS}{`
        .hs-res-hero { text-align: center; margin-bottom: 48px; }
        .hs-res-panel { background: var(--surface); border: 1px solid var(--border); border-radius: 28px; padding: 40px; position: relative; overflow: hidden; opacity: 0; animation: fade-up 0.6s 0.4s ease forwards; margin-bottom: 32px; }
        .hs-res-panel::before { content: ''; position: absolute; top: 0; left: 32px; right: 32px; height: 1px; background: linear-gradient(90deg, transparent, var(--border-green), transparent); }
        .hs-res-panel-title { font-family: 'Poppins', sans-serif; font-size: 24px; font-weight: 400; color: var(--text-primary); text-align: center; margin-bottom: 6px; }
        .hs-res-panel-sub { font-size: 13px; color: var(--text-muted); text-align: center; margin-bottom: 32px; }
        .hs-result-list { display: flex; flex-direction: column; gap: 14px; margin-bottom: 36px; }
        .hs-result-item { background: rgba(0,0,0,0.2); border: 1px solid var(--border); border-radius: 18px; padding: 22px 24px; transition: border-color 0.3s; }
        .hs-result-item:hover { border-color: var(--border-green); }
        .hs-result-top { display: flex; align-items: center; gap: 14px; margin-bottom: 14px; }
        .hs-result-rank { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, var(--green-core), var(--green-deep)); display: flex; align-items: center; justify-content: center; font-family: 'Poppins', sans-serif; font-size: 16px; color: #fff; flex-shrink: 0; box-shadow: 0 0 14px rgba(34,197,94,0.4); }
        .hs-result-career { font-family: 'Poppins', sans-serif; font-size: 22px; font-weight: 400; color: var(--text-primary); }
        .hs-result-bar-row { display: flex; align-items: center; gap: 12px; }
        .hs-result-bar-track { flex: 1; height: 6px; background: rgba(255,255,255,0.06); border-radius: 100px; overflow: hidden; }
        .hs-result-bar-fill { height: 100%; border-radius: 100px; background: linear-gradient(90deg, var(--green-deep), var(--green-bright)); transition: width 0.6s ease; }
        .hs-result-pct { font-size: 12px; font-weight: 700; color: var(--green-bright); white-space: nowrap; }
        .hs-reset-wrap { display: flex; justify-content: center; }
        .hs-reset-btn { display: inline-flex; align-items: center; gap: 10px; padding: 16px 40px; border-radius: 16px; background: linear-gradient(135deg, var(--green-core), var(--green-deep)); color: #fff; font-size: 15px; font-weight: 600; cursor: pointer; border: none; font-family: 'Poppins', sans-serif; transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1); box-shadow: 0 8px 24px rgba(34,197,94,0.35); position: relative; overflow: hidden; }
        .hs-reset-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(34,197,94,0.5); }
        .hs-reset-btn::after { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(255,255,255,0.12), transparent); pointer-events: none; }
      `}</style>
      <div className="hs-root">
        <div className="hs-orb hs-orb-1" /><div className="hs-orb hs-orb-2" />
        <header className="hs-header">
          <div className="hs-logo"><div className="hs-logo-mark"><Sparkles size={16} color="#fff" /></div><span className="hs-logo-text">Pathwise AI</span></div>
          <div className="hs-header-right">
            <button className="hs-icon-btn"><Bell size={16} /><span className="hs-notif-dot" /></button>
            <button className="hs-icon-btn"><User size={16} /></button>
          </div>
        </header>
        <main className="hs-main">
          <div className="hs-res-hero">
            <div className="hs-badge"><Sparkles size={11} />Your Results</div>
            <h1 className="hs-headline">Your Career <em>Matches! 🎯</em></h1>
            <p className="hs-subtext">Based on your answers, here are the career paths that align best with you.</p>
          </div>

          <div className="hs-res-panel">
            <p className="hs-res-panel-title">Top 3 Career Paths for You</p>
            <p className="hs-res-panel-sub">These careers align best with your interests and strengths</p>
            <div className="hs-result-list">
              {results.map((result, index) => (
                <div key={index} className="hs-result-item">
                  <div className="hs-result-top">
                    <div className="hs-result-rank">{index + 1}</div>
                    <span className="hs-result-career">{result.career}</span>
                  </div>
                  <div className="hs-result-bar-row">
                    <div className="hs-result-bar-track">
                      <div className="hs-result-bar-fill" style={{ width: `${(result.score / results[0].score) * 100}%` }} />
                    </div>
                    <span className="hs-result-pct">{Math.round((result.score / results[0].score) * 100)}% match</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="hs-reset-wrap">
              <button className="hs-reset-btn" onClick={resetQuiz}>Take Quiz Again <ArrowRight size={16} /></button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default HighSchoolPath;