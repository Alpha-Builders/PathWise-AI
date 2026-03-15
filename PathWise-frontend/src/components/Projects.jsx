import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import roleProjectSets from '../data/roleProjectSets';
import {
  CheckCircle2, Lock, Play, Award, Code, Zap, Brain,
  ArrowRight, Clock, Trophy, X, Star, Target, Monitor,
  ImageIcon, ChevronRight, Users, Briefcase, Loader2,
  AlertCircle, CheckCircle, XCircle, Sparkles, ChevronLeft,
} from 'lucide-react';

const enhanceLevels = (data) => {
  data.beginner.icon = Code;
  data.beginner.color = 'from-emerald-500 to-teal-600';
  data.beginner.bgColor = 'bg-emerald-50';
  data.beginner.textColor = 'text-emerald-700';
  data.beginner.borderColor = 'border-emerald-200';
  data.intermediate.icon = Zap;
  data.intermediate.color = 'from-blue-500 to-indigo-600';
  data.intermediate.bgColor = 'bg-blue-50';
  data.intermediate.textColor = 'text-blue-700';
  data.intermediate.borderColor = 'border-blue-200';
  data.advanced.icon = Brain;
  data.advanced.color = 'from-purple-500 to-pink-600';
  data.advanced.bgColor = 'bg-purple-50';
  data.advanced.textColor = 'text-purple-700';
  data.advanced.borderColor = 'border-purple-200';
  return data;
};

// CSS vars per level for the dark theme
const levelTheme = {
  beginner:     { accent: '#10b981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.3)', text: '#6ee7b7' },
  intermediate: { accent: '#3b82f6', bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.3)', text: '#93c5fd' },
  advanced:     { accent: '#a855f7', bg: 'rgba(168,85,247,0.08)', border: 'rgba(168,85,247,0.3)', text: '#d8b4fe' },
};

export default function ProjectStage() {
  const roleId = 'frontend-developer';
  const initialData = useMemo(() => {
    const rawData = roleProjectSets[roleId] || roleProjectSets['frontend-developer'];
    return enhanceLevels(JSON.parse(JSON.stringify(rawData)));
  }, [roleId]);

  const [projectData, setProjectData] = useState(initialData);
  const [currentLevel, setCurrentLevel] = useState('beginner');
  const [currentView, setCurrentView] = useState('projects');
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedProjectForWork, setSelectedProjectForWork] = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(false);

  const [userCode, setUserCode] = useState('');
  const [isValidatingCode, setIsValidatingCode] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [validationError, setValidationError] = useState(null);

  const API_BASE_URL = 'http://localhost:3001/api';

  const validateCodeWithAI = async (code, project) => {
    setIsValidatingCode(true);
    setValidationResult(null);
    setValidationError(null);
    try {
      const validationPrompt = `You are an expert code reviewer. Please analyze this code submission for a ${project.difficulty} level project titled "${project.title}". Technologies: ${project.technologies.join(', ')}. Code: \`\`\`${code}\`\`\`. Respond ONLY in JSON: { "isValid": boolean, "score": number, "feedback": { "overall": "string", "strengths": [], "improvements": [], "errors": [], "suggestions": [] }, "technicalAnalysis": { "correctness": "string", "bestPractices": "string", "completeness": "string", "codeQuality": "string" }, "passed": boolean, "nextSteps": "string" }`;
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: validationPrompt }] })
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      const data = await response.json();
      const botResponse = data.choices?.[0]?.message?.content || data.response || data.output || data.value || (typeof data === 'string' ? data : 'No validation response');
      setValidationResult(parseValidationResponse(botResponse));
    } catch (error) {
      try {
        const fallbackResponse = await fetch(`${API_BASE_URL}/generate`, {
          method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ input_message: `Review this code for a ${project.title} project: ${code}` })
        });
        if (!fallbackResponse.ok) throw new Error(`HTTP ${fallbackResponse.status}`);
        const fallbackData = await fallbackResponse.json();
        setValidationResult(parseValidationResponse(fallbackData.value || fallbackData.response || fallbackData.output || 'Validation unavailable'));
      } catch {
        setValidationError(`Code validation failed: ${error.message}`);
      }
    } finally {
      setIsValidatingCode(false);
    }
  };

  const parseValidationResponse = (aiResponse) => {
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) return JSON.parse(jsonMatch[0]);
      const isPositive = /good|correct|valid|well|excellent|great|pass/i.test(aiResponse);
      const hasErrors = /error|wrong|incorrect|fail|issue|problem/i.test(aiResponse);
      return {
        isValid: isPositive && !hasErrors, score: isPositive ? (hasErrors ? 65 : 85) : 45,
        feedback: { overall: aiResponse.substring(0, 200) + '...', strengths: isPositive ? ['Code shows good understanding'] : [], improvements: hasErrors ? ['Review feedback and make corrections'] : [], errors: hasErrors ? ['Some issues were identified'] : [], suggestions: ['Continue practicing and refining your code'] },
        technicalAnalysis: { correctness: isPositive ? 'Generally correct' : 'Needs improvement', bestPractices: 'Review recommended', completeness: 'Partial assessment', codeQuality: isPositive ? 'Acceptable' : 'Needs work' },
        passed: isPositive && !hasErrors, nextSteps: isPositive ? 'Great work! Continue to the next project.' : 'Please review the feedback and try again.'
      };
    } catch {
      return { isValid: false, score: 0, feedback: { overall: 'Unable to validate. Check your code and try again.', strengths: [], improvements: ['Validation encountered an error'], errors: ['Validation service error'], suggestions: ['Try submitting again'] }, technicalAnalysis: { correctness: 'Unable to assess', bestPractices: 'Unable to assess', completeness: 'Unable to assess', codeQuality: 'Unable to assess' }, passed: false, nextSteps: 'Please try validating again.' };
    }
  };

  const handleTestCode = () => {
    if (!userCode.trim()) { setValidationError('Please write some code before testing.'); return; }
    validateCodeWithAI(userCode, selectedProjectForWork);
  };

  const handleSubmitCode = () => {
    if (validationResult?.passed) handleProjectComplete();
    else setValidationError('Please fix the issues before submitting.');
  };

  const toggleProjectCompletion = (levelKey, projectId) => {
    setProjectData(prev => {
      const updatedLevel = { ...prev[levelKey] };
      updatedLevel.projects = updatedLevel.projects.map(p => p.id === projectId ? { ...p, completed: !p.completed } : p);
      return { ...prev, [levelKey]: updatedLevel };
    });
  };

  const getLevelProgress = (levelKey) => {
    const projects = projectData[levelKey]?.projects || [];
    const completed = projects.filter(p => p.completed).length;
    return { completed, total: projects.length, percentage: projects.length === 0 ? 0 : (completed / projects.length) * 100 };
  };

  const levelKeys = ['beginner', 'intermediate', 'advanced'];
  const overallCompleted = levelKeys.reduce((s, k) => s + getLevelProgress(k).completed, 0);
  const overallTotal = levelKeys.reduce((s, k) => s + getLevelProgress(k).total, 0);
  const overallPercentage = overallTotal === 0 ? 0 : (overallCompleted / overallTotal) * 100;

  const canAccessLevel = (level) => {
    if (level === 'beginner') return true;
    if (level === 'intermediate') return getLevelProgress('beginner').percentage === 100;
    if (level === 'advanced') return getLevelProgress('intermediate').percentage === 100;
    return false;
  };

  const isCurrentLevelComplete = () => getLevelProgress(currentLevel).percentage === 100;
  const getNextLevel = () => { const i = levelKeys.indexOf(currentLevel); return i < levelKeys.length - 1 ? levelKeys[i + 1] : null; };

  const handleProjectClick = (project) => { setSelectedProject(project); setShowProjectModal(true); };
  const handleStartProject = () => {
    if (selectedProject) { setSelectedProjectForWork(selectedProject); setCurrentView('workspace'); setShowProjectModal(false); setUserCode(''); setValidationResult(null); setValidationError(null); }
  };
  const handleProjectComplete = () => {
    if (selectedProjectForWork) toggleProjectCompletion(currentLevel, selectedProjectForWork.id);
    setCurrentView('projects'); setSelectedProjectForWork(null); setUserCode(''); setValidationResult(null); setValidationError(null);
  };
  const handleBackToProjects = () => { setCurrentView('projects'); setSelectedProjectForWork(null); setUserCode(''); setValidationResult(null); setValidationError(null); };

  // ─── PROJECT MODAL ────────────────────────────────────────────────────────
  const ProjectModal = () => (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center p-4 z-50"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(16px)' }}
      onClick={() => setShowProjectModal(false)}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        style={{ background: '#0d1610', border: '1px solid rgba(34,197,94,0.35)', borderRadius: '28px', maxWidth: '580px', width: '100%', maxHeight: '85vh', overflowY: 'auto', position: 'relative' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Top shimmer */}
        <div style={{ position: 'absolute', top: 0, left: 32, right: 32, height: '1px', background: 'linear-gradient(90deg, transparent, #22c55e, transparent)' }} />
        <div style={{ padding: '36px 36px 32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
            <div>
              <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: '26px', fontWeight: 400, color: '#f0fdf4', marginBottom: '10px', lineHeight: 1.2 }}>{selectedProject?.title}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, padding: '4px 12px', borderRadius: '100px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#4ade80' }}>{selectedProject?.difficulty}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#6b7280' }}><Clock size={12} />{selectedProject?.duration}</span>
              </div>
            </div>
            <button onClick={() => setShowProjectModal(false)} style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#6b7280', flexShrink: 0 }}>
              <X size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h3 style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase', color: '#6b7280', marginBottom: '10px' }}>Description</h3>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.65 }}>{selectedProject?.description}</p>
            </div>
            <div>
              <h3 style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase', color: '#6b7280', marginBottom: '10px' }}>Learning Objectives</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedProject?.objectives?.map((obj, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>
                    <Target size={12} color="#22c55e" style={{ flexShrink: 0 }} />{obj}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase', color: '#6b7280', marginBottom: '10px' }}>Technologies</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {selectedProject?.technologies?.map((tech, i) => (
                  <span key={i} style={{ fontSize: '11px', fontWeight: 500, padding: '4px 12px', borderRadius: '100px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', color: '#4ade80' }}>{tech}</span>
                ))}
              </div>
            </div>
            {selectedProject?.hasVisual && (
              <div>
                <h3 style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase', color: '#6b7280', marginBottom: '10px' }}>Expected Output</h3>
                <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '8px' }}>
                  <Monitor size={32} color="#6b7280" /><p style={{ fontSize: '13px', color: '#6b7280' }}>Project preview will be shown here</p>
                </div>
              </div>
            )}
            <div style={{ display: 'flex', gap: '12px', paddingTop: '8px' }}>
              <button onClick={() => setShowProjectModal(false)} style={{ flex: 1, padding: '14px', borderRadius: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#6b7280', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>Cancel</button>
              <button onClick={handleStartProject} style={{ flex: 2, padding: '14px', borderRadius: '14px', background: 'linear-gradient(135deg, #22c55e, #15803d)', color: '#fff', fontSize: '14px', fontWeight: 700, cursor: 'pointer', border: 'none', fontFamily: 'DM Sans, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 8px 24px rgba(34,197,94,0.35)' }}>
                <Play size={15} />Start Project
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  // ─── WORKSPACE VIEW ───────────────────────────────────────────────────────
  const WorkspaceView = () => (
    <>
      <style>{`
        .ws-root { min-height: 100vh; background: #080d0a; font-family: 'DM Sans', sans-serif; }
        .ws-root::before { content: ''; position: fixed; inset: 0; background-image: linear-gradient(rgba(34,197,94,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.04) 1px, transparent 1px); background-size: 60px 60px; pointer-events: none; z-index: 0; }
        .ws-header { position: relative; z-index: 20; display: flex; justify-content: space-between; align-items: center; padding: 18px 40px; border-bottom: 1px solid rgba(255,255,255,0.08); backdrop-filter: blur(12px); }
        .ws-back { display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 8px 16px; color: rgba(255,255,255,0.6); font-size: 13px; cursor: pointer; transition: all 0.2s; font-family: 'DM Sans', sans-serif; }
        .ws-back:hover { border-color: rgba(34,197,94,0.35); color: #4ade80; }
        .ws-title-block {}
        .ws-title { font-family: 'Instrument Serif', serif; font-size: 20px; font-weight: 400; color: #f0fdf4; }
        .ws-meta { display: flex; align-items: center; gap: 16px; font-size: 12px; color: #6b7280; margin-top: 3px; }
        .ws-header-actions { display: flex; gap: 10px; }
        .ws-btn-submit { padding: 10px 22px; border-radius: 12px; background: linear-gradient(135deg, #22c55e, #15803d); color: #fff; font-size: 13px; font-weight: 700; cursor: pointer; border: none; font-family: 'DM Sans', sans-serif; display: flex; align-items: center; gap: 7px; box-shadow: 0 4px 16px rgba(34,197,94,0.35); }
        .ws-btn-reset { padding: 10px 18px; border-radius: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); color: rgba(255,255,255,0.5); font-size: 13px; cursor: pointer; font-family: 'DM Sans', sans-serif; }
        .ws-body { position: relative; z-index: 10; max-width: 1200px; margin: 0 auto; padding: 36px 40px 60px; }
        .ws-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        @media (max-width: 900px) { .ws-grid { grid-template-columns: 1fr; } .ws-body { padding: 24px 20px 40px; } .ws-header { padding: 16px 20px; } }

        .ws-panel { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 24px; overflow: hidden; }
        .ws-panel-header { display: flex; align-items: center; gap: 10px; padding: 16px 20px; border-bottom: 1px solid rgba(255,255,255,0.06); background: rgba(0,0,0,0.2); }
        .ws-panel-title { font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.7); letter-spacing: 0.3px; }
        .ws-panel-body { padding: 20px; }

        .ws-info-block { background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; padding: 16px; margin-bottom: 12px; }
        .ws-info-block:last-child { margin-bottom: 0; }
        .ws-info-label { font-size: 10px; font-weight: 600; letter-spacing: 0.8px; text-transform: uppercase; color: #6b7280; margin-bottom: 8px; }
        .ws-info-text { font-size: 13px; color: rgba(255,255,255,0.7); line-height: 1.6; }
        .ws-obj-row { display: flex; align-items: flex-start; gap: 8px; font-size: 13px; color: rgba(255,255,255,0.7); margin-bottom: 6px; }
        .ws-tech-tag { display: inline-block; font-size: 11px; font-weight: 500; padding: 4px 12px; border-radius: 100px; background: rgba(34,197,94,0.08); border: 1px solid rgba(34,197,94,0.2); color: #4ade80; margin: 3px; }

        .ws-editor { font-family: 'Monaco, Consolas, Liberation Mono, Courier New, monospace'; font-size: 13px; width: 100%; height: 340px; background: rgba(0,0,0,0.4); color: #e2e8f0; border: none; border-radius: 0; padding: 20px; resize: none; outline: none; line-height: 1.6; }
        .ws-editor::placeholder { color: #4b5563; }
        .ws-editor-footer { display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; border-top: 1px solid rgba(255,255,255,0.06); background: rgba(0,0,0,0.2); }
        .ws-editor-hint { font-size: 12px; color: #6b7280; }
        .ws-btn-test { padding: 9px 20px; border-radius: 11px; background: linear-gradient(135deg, #22c55e, #15803d); color: #fff; font-size: 12px; font-weight: 700; cursor: pointer; border: none; font-family: 'DM Sans', sans-serif; display: flex; align-items: center; gap: 6px; transition: all 0.2s; }
        .ws-btn-test:disabled { background: rgba(255,255,255,0.08); color: #4b5563; cursor: not-allowed; }

        /* Validation */
        .ws-validation { margin-top: 20px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 24px; padding: 28px; }
        .ws-val-title { font-family: 'Instrument Serif', serif; font-size: 22px; font-weight: 400; color: #f0fdf4; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
        .ws-val-banner { padding: 18px 20px; border-radius: 16px; margin-bottom: 20px; }
        .ws-val-banner.passed { background: rgba(34,197,94,0.08); border: 1px solid rgba(34,197,94,0.25); }
        .ws-val-banner.failed { background: rgba(251,191,36,0.08); border: 1px solid rgba(251,191,36,0.25); }
        .ws-val-status { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
        .ws-val-status-text { font-size: 14px; font-weight: 600; }
        .ws-val-status-text.passed { color: #4ade80; }
        .ws-val-status-text.failed { color: #fbbf24; }
        .ws-val-score { font-size: 18px; font-weight: 700; color: #f0fdf4; }
        .ws-val-overall { font-size: 13px; color: rgba(255,255,255,0.6); line-height: 1.6; }
        .ws-val-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; }
        .ws-val-section { padding: 16px; border-radius: 14px; }
        .ws-val-section.strengths { background: rgba(34,197,94,0.06); border: 1px solid rgba(34,197,94,0.2); }
        .ws-val-section.improvements { background: rgba(59,130,246,0.06); border: 1px solid rgba(59,130,246,0.2); }
        .ws-val-section.errors { background: rgba(239,68,68,0.06); border: 1px solid rgba(239,68,68,0.2); }
        .ws-val-section.suggestions { background: rgba(168,85,247,0.06); border: 1px solid rgba(168,85,247,0.2); }
        .ws-val-section-title { font-size: 12px; font-weight: 600; margin-bottom: 10px; display: flex; align-items: center; gap: 6px; }
        .ws-val-section-title.green { color: #4ade80; }
        .ws-val-section-title.blue { color: #93c5fd; }
        .ws-val-section-title.red { color: #f87171; }
        .ws-val-section-title.purple { color: #d8b4fe; }
        .ws-val-item { font-size: 12px; color: rgba(255,255,255,0.65); margin-bottom: 5px; padding-left: 12px; position: relative; }
        .ws-val-item::before { content: '•'; position: absolute; left: 0; }
        .ws-val-next { background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; padding: 16px; }
        .ws-val-next-label { font-size: 10px; font-weight: 600; letter-spacing: 0.8px; text-transform: uppercase; color: #6b7280; margin-bottom: 8px; }
        .ws-val-next-text { font-size: 13px; color: rgba(255,255,255,0.6); line-height: 1.6; }
        .ws-val-error { background: rgba(239,68,68,0.06); border: 1px solid rgba(239,68,68,0.2); border-radius: 14px; padding: 16px; display: flex; align-items: flex-start; gap: 10px; font-size: 13px; color: #f87171; }

        /* Preview */
        .ws-preview { margin-top: 20px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 24px; overflow: hidden; }
        .ws-preview-header { display: flex; align-items: center; gap: 10px; padding: 18px 24px; border-bottom: 1px solid rgba(255,255,255,0.06); background: rgba(0,0,0,0.2); }
        .ws-preview-title { font-size: 14px; font-weight: 600; color: rgba(255,255,255,0.7); }
        .ws-preview-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 48px; gap: 10px; }
        .ws-preview-empty p { font-size: 13px; color: #6b7280; }
      `}</style>

      <div className="ws-root">
        {/* Header */}
        <header className="ws-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button className="ws-back" onClick={handleBackToProjects}>
              <ChevronLeft size={15} />Back
            </button>
            <div className="ws-title-block">
              <div className="ws-title">{selectedProjectForWork.title}</div>
              <div className="ws-meta">
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={11} />{selectedProjectForWork.duration}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Target size={11} />{selectedProjectForWork.difficulty || 'Beginner'}</span>
              </div>
            </div>
          </div>
          <div className="ws-header-actions">
            {validationResult?.passed && (
              <button className="ws-btn-submit" onClick={handleSubmitCode}>
                <CheckCircle2 size={14} />Submit Project
              </button>
            )}
            <button className="ws-btn-reset" onClick={() => setValidationResult(null)}>Reset</button>
          </div>
        </header>

        <div className="ws-body">
          <div className="ws-grid">
            {/* Instructions panel */}
            <div className="ws-panel">
              <div className="ws-panel-header"><Target size={15} color="#22c55e" /><span className="ws-panel-title">Project Instructions</span></div>
              <div className="ws-panel-body">
                <div className="ws-info-block">
                  <div className="ws-info-label">Description</div>
                  <p className="ws-info-text">{selectedProjectForWork.description}</p>
                </div>
                <div className="ws-info-block">
                  <div className="ws-info-label">Learning Objectives</div>
                  {selectedProjectForWork.objectives?.map((obj, i) => (
                    <div key={i} className="ws-obj-row"><Target size={11} color="#22c55e" style={{ flexShrink: 0, marginTop: 2 }} />{obj}</div>
                  ))}
                </div>
                <div className="ws-info-block">
                  <div className="ws-info-label">Technologies</div>
                  <div>{selectedProjectForWork.technologies?.map((tech, i) => <span key={i} className="ws-tech-tag">{tech}</span>)}</div>
                </div>
              </div>
            </div>

            {/* Code editor panel */}
            <div className="ws-panel">
              <div className="ws-panel-header"><Code size={15} color="#22c55e" /><span className="ws-panel-title">Code Editor</span></div>
              <textarea
                className="ws-editor"
                value={userCode}
                onChange={e => setUserCode(e.target.value)}
                placeholder="Start writing your code here..."
              />
              <div className="ws-editor-footer">
                <span className="ws-editor-hint">{isValidatingCode ? 'AI is reviewing your code…' : 'AI will validate your code when you test it'}</span>
                <button className="ws-btn-test" onClick={handleTestCode} disabled={isValidatingCode || !userCode.trim()}>
                  {isValidatingCode ? <><Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} />Validating…</> : <><CheckCircle size={13} />Test Code</>}
                </button>
              </div>
            </div>
          </div>

          {/* Validation results */}
          {(validationResult || validationError) && (
            <div className="ws-validation">
              <div className="ws-val-title">
                🤖 AI Validation Results
                {validationResult?.passed && <CheckCircle size={18} color="#4ade80" />}
                {validationResult && !validationResult.passed && <XCircle size={18} color="#f87171" />}
              </div>
              {validationError ? (
                <div className="ws-val-error"><AlertCircle size={14} />{validationError}</div>
              ) : validationResult && (
                <>
                  <div className={`ws-val-banner ${validationResult.passed ? 'passed' : 'failed'}`}>
                    <div className="ws-val-status">
                      <span className={`ws-val-status-text ${validationResult.passed ? 'passed' : 'failed'}`}>
                        {validationResult.passed ? '✅ Validation Passed!' : '⚠️ Needs Improvement'}
                      </span>
                      <span className="ws-val-score">Score: {validationResult.score}/100</span>
                    </div>
                    <p className="ws-val-overall">{validationResult.feedback.overall}</p>
                  </div>
                  <div className="ws-val-grid">
                    {validationResult.feedback.strengths.length > 0 && (
                      <div className="ws-val-section strengths">
                        <div className="ws-val-section-title green"><CheckCircle size={12} />Strengths</div>
                        {validationResult.feedback.strengths.map((s, i) => <div key={i} className="ws-val-item">{s}</div>)}
                      </div>
                    )}
                    {validationResult.feedback.improvements.length > 0 && (
                      <div className="ws-val-section improvements">
                        <div className="ws-val-section-title blue"><Target size={12} />Improvements</div>
                        {validationResult.feedback.improvements.map((s, i) => <div key={i} className="ws-val-item">{s}</div>)}
                      </div>
                    )}
                    {validationResult.feedback.errors.length > 0 && (
                      <div className="ws-val-section errors">
                        <div className="ws-val-section-title red"><XCircle size={12} />Critical Issues</div>
                        {validationResult.feedback.errors.map((s, i) => <div key={i} className="ws-val-item">{s}</div>)}
                      </div>
                    )}
                    {validationResult.feedback.suggestions.length > 0 && (
                      <div className="ws-val-section suggestions">
                        <div className="ws-val-section-title purple"><Star size={12} />Suggestions</div>
                        {validationResult.feedback.suggestions.map((s, i) => <div key={i} className="ws-val-item">{s}</div>)}
                      </div>
                    )}
                  </div>
                  <div className="ws-val-next">
                    <div className="ws-val-next-label">Next Steps</div>
                    <p className="ws-val-next-text">{validationResult.nextSteps}</p>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Preview */}
          {selectedProjectForWork.hasVisual && (
            <div className="ws-preview">
              <div className="ws-preview-header"><Monitor size={15} color="#22c55e" /><span className="ws-preview-title">Live Preview</span></div>
              {userCode?.trim() ? (
                <iframe
                  srcDoc={`<html><head><style>body{font-family:sans-serif;margin:0;padding:1rem}</style></head><body>${userCode}</body></html>`}
                  title="Live Preview" sandbox="allow-scripts allow-same-origin"
                  frameBorder="0" style={{ width: '100%', height: '380px', background: '#fff', display: 'block' }}
                />
              ) : (
                <div className="ws-preview-empty">
                  <ImageIcon size={36} color="#4b5563" />
                  <p>Your project output will appear here when you run the code</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );

  // ─── PROJECTS VIEW ────────────────────────────────────────────────────────
  const ProjectsView = () => {
    const currentLevelData = projectData[currentLevel];
    const progress = getLevelProgress(currentLevel);
    const nextLevel = getNextLevel();
    const theme = levelTheme[currentLevel];

    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          :root { --green-core: #22c55e; --green-bright: #4ade80; --green-deep: #15803d; --surface: rgba(255,255,255,0.03); --surface-2: rgba(255,255,255,0.06); --border: rgba(255,255,255,0.08); --border-green: rgba(34,197,94,0.35); --text-primary: #f0fdf4; --text-muted: #6b7280; --bg: #080d0a; }
          .pv-root { min-height: 100vh; background: var(--bg); color: var(--text-primary); font-family: 'DM Sans', sans-serif; position: relative; overflow-x: hidden; }
          .pv-root::before { content: ''; position: fixed; inset: 0; background-image: linear-gradient(rgba(34,197,94,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.04) 1px, transparent 1px); background-size: 60px 60px; pointer-events: none; z-index: 0; }
          .pv-orb { position: fixed; border-radius: 50%; pointer-events: none; filter: blur(130px); z-index: 0; }
          .pv-orb-1 { width: 700px; height: 700px; background: radial-gradient(circle, rgba(34,197,94,0.09) 0%, transparent 70%); top: -250px; left: -150px; animation: orb-drift 9s ease-in-out infinite alternate; }
          .pv-orb-2 { width: 550px; height: 550px; background: radial-gradient(circle, rgba(21,128,61,0.08) 0%, transparent 70%); bottom: -200px; right: -100px; animation: orb-drift 12s ease-in-out infinite alternate-reverse; }
          @keyframes orb-drift { from { transform: translate(0,0); } to { transform: translate(50px, 40px); } }
          .pv-header { position: relative; z-index: 20; display: flex; justify-content: space-between; align-items: center; padding: 20px 40px; border-bottom: 1px solid var(--border); backdrop-filter: blur(12px); }
          .pv-logo { display: flex; align-items: center; gap: 10px; }
          .pv-logo-mark { width: 36px; height: 36px; background: linear-gradient(135deg, var(--green-core), var(--green-deep)); border-radius: 10px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 20px rgba(34,197,94,0.4); }
          .pv-logo-text { font-family: 'Instrument Serif', serif; font-size: 22px; background: linear-gradient(90deg, #fff, var(--green-bright)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
          .pv-header-right { display: flex; gap: 8px; align-items: center; }
          .pv-icon-btn { position: relative; width: 40px; height: 40px; background: var(--surface); border: 1px solid var(--border); border-radius: 12px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s ease; color: var(--text-muted); }
          .pv-icon-btn:hover { background: var(--surface-2); border-color: var(--border-green); color: var(--green-bright); }
          .pv-notif-dot { position: absolute; top: 8px; right: 8px; width: 7px; height: 7px; background: var(--green-core); border-radius: 50%; border: 1.5px solid var(--bg); animation: pv-pulse 2s ease infinite; }
          @keyframes pv-pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.5); } 50% { box-shadow: 0 0 0 4px rgba(34,197,94,0); } }
          .pv-premium-btn { display: flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 10px; background: linear-gradient(135deg, var(--green-core), var(--green-deep)); color: #fff; font-size: 12px; font-weight: 600; letter-spacing: 0.8px; text-transform: uppercase; cursor: pointer; transition: all 0.25s ease; border: none; font-family: 'DM Sans', sans-serif; box-shadow: 0 4px 16px rgba(34,197,94,0.3); }
          .pv-premium-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(34,197,94,0.45); }
          .pv-main { position: relative; z-index: 10; max-width: 1200px; margin: 0 auto; padding: 56px 40px 80px; }

          /* Hero row */
          .pv-hero { display: flex; align-items: flex-start; justify-content: space-between; gap: 24px; margin-bottom: 48px; flex-wrap: wrap; }
          .pv-hero-left {}
          .pv-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(34,197,94,0.08); border: 1px solid var(--border-green); border-radius: 100px; padding: 6px 16px; font-size: 12px; font-weight: 500; color: var(--green-bright); letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 16px; }
          .pv-headline { font-family: 'Instrument Serif', serif; font-size: clamp(28px, 4vw, 44px); font-weight: 400; color: var(--text-primary); margin-bottom: 8px; line-height: 1.1; }
          .pv-headline em { font-style: italic; background: linear-gradient(90deg, var(--green-core), var(--green-bright)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
          .pv-subtext { font-size: 14px; color: var(--text-muted); }
          .pv-hero-right { display: flex; align-items: center; gap: 20px; }
          .pv-overall-label { font-size: 11px; color: var(--text-muted); text-align: right; margin-bottom: 6px; }
          .pv-overall-bar { display: flex; align-items: center; gap: 10px; }
          .pv-bar-track { width: 140px; height: 6px; background: rgba(255,255,255,0.06); border-radius: 100px; overflow: hidden; }
          .pv-bar-fill { height: 100%; background: linear-gradient(90deg, var(--green-deep), var(--green-bright)); border-radius: 100px; transition: width 0.5s ease; }
          .pv-overall-count { font-size: 13px; font-weight: 600; color: var(--text-primary); white-space: nowrap; }
          .pv-trophy-block { text-align: center; }
          .pv-trophy-pct { font-size: 11px; color: var(--text-muted); margin-top: 4px; }

          /* Level tabs */
          .pv-tabs { display: flex; gap: 10px; margin-bottom: 40px; background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: 20px; padding: 8px; }
          @media (max-width: 700px) { .pv-tabs { flex-direction: column; } .pv-main { padding: 40px 20px 60px; } .pv-header { padding: 16px 20px; } .pv-hero { flex-direction: column; } }
          .pv-tab { flex: 1; padding: 14px 16px; border-radius: 14px; cursor: pointer; transition: all 0.25s ease; text-align: left; border: 1px solid transparent; background: none; font-family: 'DM Sans', sans-serif; }
          .pv-tab:disabled { cursor: not-allowed; opacity: 0.5; }
          .pv-tab-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
          .pv-tab-name { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; text-transform: capitalize; }
          .pv-tab-bar { width: 100%; height: 4px; border-radius: 100px; overflow: hidden; background: rgba(255,255,255,0.06); }
          .pv-tab-bar-fill { height: 100%; border-radius: 100px; transition: width 0.4s ease; }
          .pv-tab-progress { display: flex; justify-content: space-between; font-size: 11px; margin-top: 5px; }

          /* Level header */
          .pv-level-header { border-radius: 24px; padding: 28px 32px; margin-bottom: 32px; position: relative; overflow: hidden; }
          .pv-level-header::before { content: ''; position: absolute; top: 0; left: 24px; right: 24px; height: 1px; }
          .pv-level-inner { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; gap: 16px; }
          .pv-level-icon { width: 56px; height: 56px; border-radius: 16px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
          .pv-level-title { font-family: 'Instrument Serif', serif; font-size: 26px; font-weight: 400; text-transform: capitalize; margin-bottom: 4px; }
          .pv-level-desc { font-size: 13px; opacity: 0.7; }
          .pv-level-stats { text-align: right; }
          .pv-level-count { font-size: 24px; font-weight: 700; font-family: 'Instrument Serif', serif; }
          .pv-level-count-label { font-size: 11px; opacity: 0.6; margin-top: 2px; }
          .pv-level-progress-row { display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 6px; }
          .pv-level-bar { height: 6px; border-radius: 100px; overflow: hidden; background: rgba(0,0,0,0.2); }
          .pv-level-bar-fill { height: 100%; border-radius: 100px; transition: width 0.5s ease; }
          .pv-unlock-banner { margin-top: 20px; background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 16px 20px; display: flex; align-items: center; justify-content: space-between; gap: 16px; }
          .pv-unlock-text { font-size: 13px; color: rgba(255,255,255,0.8); font-weight: 500; }
          .pv-unlock-sub { font-size: 12px; color: rgba(255,255,255,0.5); margin-top: 2px; }
          .pv-btn-unlock { padding: 10px 20px; border-radius: 12px; background: linear-gradient(135deg, var(--green-core), var(--green-deep)); color: #fff; font-size: 13px; font-weight: 700; cursor: pointer; border: none; font-family: 'DM Sans', sans-serif; display: flex; align-items: center; gap: 6px; white-space: nowrap; box-shadow: 0 4px 16px rgba(34,197,94,0.35); }

          /* Project grid */
          .pv-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
          @media (max-width: 1000px) { .pv-grid { grid-template-columns: repeat(2, 1fr); } }
          @media (max-width: 640px) { .pv-grid { grid-template-columns: 1fr; } }

          .pv-project-card { background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 22px; cursor: pointer; transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1); position: relative; overflow: hidden; }
          .pv-project-card::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(34,197,94,0.06), transparent 60%); opacity: 0; transition: opacity 0.3s; border-radius: inherit; }
          .pv-project-card:hover { border-color: var(--border-green); transform: translateY(-3px); box-shadow: 0 16px 48px rgba(0,0,0,0.4); }
          .pv-project-card:hover::before { opacity: 1; }
          .pv-project-card.done { border-color: rgba(34,197,94,0.2); background: rgba(34,197,94,0.03); }

          .pv-card-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 14px; gap: 10px; }
          .pv-card-title { font-family: 'Instrument Serif', serif; font-size: 17px; font-weight: 400; color: var(--text-primary); margin-bottom: 6px; line-height: 1.2; transition: color 0.2s; }
          .pv-project-card:hover .pv-card-title { color: var(--green-bright); }
          .pv-card-desc { font-size: 12px; color: var(--text-muted); line-height: 1.55; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
          .pv-card-check { width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0; }
          .pv-card-check.done { background: var(--green-core); display: flex; align-items: center; justify-content: center; box-shadow: 0 0 12px rgba(34,197,94,0.4); }
          .pv-card-check.empty { border: 2px solid rgba(255,255,255,0.12); transition: border-color 0.2s; }
          .pv-project-card:hover .pv-card-check.empty { border-color: var(--border-green); }

          .pv-card-meta { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; font-size: 12px; color: var(--text-muted); }
          .pv-card-meta-item { display: flex; align-items: center; gap: 5px; }
          .pv-card-techs { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 14px; }
          .pv-card-tech { font-size: 10px; font-weight: 500; padding: 3px 10px; border-radius: 100px; background: rgba(34,197,94,0.08); border: 1px solid rgba(34,197,94,0.2); color: var(--green-bright); }
          .pv-card-tech-more { font-size: 10px; padding: 3px 8px; color: var(--text-muted); }
          .pv-card-cta { display: flex; align-items: center; justify-content: space-between; padding-top: 12px; border-top: 1px solid var(--border); }
          .pv-card-cta-label { font-size: 12px; font-weight: 600; color: var(--green-core); transition: color 0.2s; }
          .pv-project-card:hover .pv-card-cta-label { color: var(--green-bright); }
          .pv-cta-arrow { transition: transform 0.2s; color: var(--text-muted); }
          .pv-project-card:hover .pv-cta-arrow { transform: translateX(4px); color: var(--green-bright); }

          /* Empty */
          .pv-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 64px; gap: 12px; }
          .pv-empty h3 { font-family: 'Instrument Serif', serif; font-size: 22px; font-weight: 400; color: var(--text-muted); }
          .pv-empty p { font-size: 14px; color: #4b5563; }

          @keyframes fade-up { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>

        <div className="pv-root">
          <div className="pv-orb pv-orb-1" />
          <div className="pv-orb pv-orb-2" />

          <header className="pv-header">
            <div className="pv-logo">
              <div className="pv-logo-mark"><Sparkles size={16} color="#fff" /></div>
              <span className="pv-logo-text">Pathwise AI</span>
            </div>
            <div className="pv-header-right">
              <button className="pv-premium-btn"><Sparkles size={12} />Premium</button>
              <button className="pv-icon-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                <span className="pv-notif-dot" />
              </button>
              <button className="pv-icon-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </button>
            </div>
          </header>

          <main className="pv-main">
            {/* Hero */}
            <div className="pv-hero">
              <div className="pv-hero-left">
                <div className="pv-badge"><Sparkles size={11} />Project Stage</div>
                <h1 className="pv-headline">Skills for <em>Frontend Developer</em></h1>
                <p className="pv-subtext">Build real-world projects to master frontend development</p>
              </div>
              <div className="pv-hero-right">
                <div>
                  <div className="pv-overall-label">Overall Progress</div>
                  <div className="pv-overall-bar">
                    <div className="pv-bar-track"><div className="pv-bar-fill" style={{ width: `${overallPercentage}%` }} /></div>
                    <span className="pv-overall-count">{overallCompleted}/{overallTotal}</span>
                  </div>
                </div>
                <div className="pv-trophy-block">
                  <Trophy size={28} color="#f59e0b" />
                  <div className="pv-trophy-pct">{Math.round(overallPercentage)}%</div>
                </div>
              </div>
            </div>

            {/* Level tabs */}
            <div className="pv-tabs">
              {levelKeys.map(levelKey => {
                const lp = getLevelProgress(levelKey);
                const canAccess = canAccessLevel(levelKey);
                const t = levelTheme[levelKey];
                const LIcon = projectData[levelKey].icon;
                const isActive = currentLevel === levelKey;

                return (
                  <button
                    key={levelKey}
                    className="pv-tab"
                    onClick={() => canAccess && setCurrentLevel(levelKey)}
                    disabled={!canAccess}
                    style={isActive ? { background: t.bg, border: `1px solid ${t.border}` } : {}}
                  >
                    <div className="pv-tab-top">
                      <span className="pv-tab-name" style={{ color: isActive ? t.text : canAccess ? 'rgba(255,255,255,0.6)' : '#4b5563' }}>
                        {canAccess ? <LIcon size={14} /> : <Lock size={14} />}
                        {levelKey}
                      </span>
                      {lp.percentage === 100 && <CheckCircle2 size={14} color="#22c55e" />}
                    </div>
                    <div className="pv-tab-bar"><div className="pv-tab-bar-fill" style={{ width: `${lp.percentage}%`, background: `linear-gradient(90deg, ${t.accent}, ${t.text})` }} /></div>
                    <div className="pv-tab-progress">
                      <span style={{ color: isActive ? t.text : '#6b7280', fontSize: '11px' }}>{lp.completed}/{lp.total}</span>
                      <span style={{ color: isActive ? t.text : '#6b7280', fontSize: '11px' }}>{Math.round(lp.percentage)}%</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Level header */}
            <div className="pv-level-header" style={{ background: theme.bg, border: `1px solid ${theme.border}` }}>
              <div style={{ position: 'absolute', top: 0, left: 24, right: 24, height: '1px', background: `linear-gradient(90deg, transparent, ${theme.accent}, transparent)` }} />
              <div className="pv-level-inner">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div className="pv-level-icon" style={{ background: theme.bg, border: `1px solid ${theme.border}` }}>
                    <currentLevelData.icon size={24} color={theme.accent} />
                  </div>
                  <div>
                    <div className="pv-level-title" style={{ color: theme.text }}>{currentLevel} Level</div>
                    <div className="pv-level-desc" style={{ color: theme.text }}>{currentLevelData.description}</div>
                  </div>
                </div>
                <div className="pv-level-stats">
                  <div className="pv-level-count" style={{ color: theme.text }}>{progress.completed}/{progress.total}</div>
                  <div className="pv-level-count-label" style={{ color: theme.text }}>Projects Completed</div>
                </div>
              </div>
              <div className="pv-level-progress-row" style={{ color: theme.text }}>
                <span>Progress</span><span>{Math.round(progress.percentage)}%</span>
              </div>
              <div className="pv-level-bar">
                <div className="pv-level-bar-fill" style={{ width: `${progress.percentage}%`, background: `linear-gradient(90deg, ${theme.accent}, ${theme.text})` }} />
              </div>

              {isCurrentLevelComplete() && getNextLevel() && (
                <div className="pv-unlock-banner">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Award size={20} color="#f59e0b" />
                    <div>
                      <div className="pv-unlock-text">🎉 Level Complete — great work!</div>
                      <div className="pv-unlock-sub">You can now unlock the {getNextLevel()} level</div>
                    </div>
                  </div>
                  <button className="pv-btn-unlock" onClick={() => setCurrentLevel(getNextLevel())}>
                    Unlock {getNextLevel()} <ChevronRight size={14} />
                  </button>
                </div>
              )}
            </div>

            {/* Projects grid */}
            {currentLevelData.projects.length === 0 ? (
              <div className="pv-empty">
                <Briefcase size={40} color="#4b5563" />
                <h3>No projects available</h3>
                <p>Projects for this level are coming soon!</p>
              </div>
            ) : (
              <div className="pv-grid">
                {currentLevelData.projects.map((project, i) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.06 }}
                    className={`pv-project-card${project.completed ? ' done' : ''}`}
                    onClick={() => handleProjectClick(project)}
                  >
                    <div className="pv-card-top">
                      <div style={{ flex: 1 }}>
                        <div className="pv-card-title">{project.title}</div>
                        <div className="pv-card-desc">{project.description}</div>
                      </div>
                      <div className={`pv-card-check ${project.completed ? 'done' : 'empty'}`}>
                        {project.completed && <CheckCircle2 size={16} color="#fff" />}
                      </div>
                    </div>

                    <div className="pv-card-meta">
                      <span className="pv-card-meta-item"><Clock size={11} />{project.duration}</span>
                      <span className="pv-card-meta-item"><Users size={11} />{project.difficulty}</span>
                    </div>

                    <div className="pv-card-techs">
                      {project.technologies?.slice(0, 3).map((tech, idx) => (
                        <span key={idx} className="pv-card-tech">{tech}</span>
                      ))}
                      {project.technologies?.length > 3 && <span className="pv-card-tech-more">+{project.technologies.length - 3}</span>}
                    </div>

                    <div className="pv-card-cta">
                      <span className="pv-card-cta-label">{project.completed ? 'Completed' : 'Start Project'}</span>
                      <ArrowRight size={14} className="pv-cta-arrow" />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </main>
        </div>
      </>
    );
  };

  return (
    <div>
      <AnimatePresence mode="wait">
        {currentView === 'projects' && <ProjectsView key="projects" />}
        {currentView === 'workspace' && <WorkspaceView key="workspace" />}
      </AnimatePresence>
      <AnimatePresence>
        {showProjectModal && selectedProject && <ProjectModal key="modal" />}
      </AnimatePresence>
    </div>
  );
}