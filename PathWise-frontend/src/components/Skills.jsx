import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  ExternalLink,
  CheckCircle,
  Circle,
  ArrowRight,
  Clock,
  Trophy,
  Loader2,
  AlertCircle,
  Video,
  X,
  Sparkles,
  ChevronLeft,
} from "lucide-react";
import skillsData from "../data/SkillsData";

const normalizeRoleKey = (raw) => {
  if (!raw) return "";
  return raw.toString().trim().toLowerCase()
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/\s+/g, "-")
    .replace(/_+/g, "-")
    .replace(/-+/g, "-");
};

export default function Skills() {
  const navigate = useNavigate();
  const [selectedCourse, setSelectedCourse] = useState("Computer Science");
  const [selectedPath, setSelectedPath] = useState("fintech");
  const [selectedRole, setSelectedRole] = useState("");
  const [skills, setSkills] = useState([]);
  const [completedSkills, setCompletedSkills] = useState(new Set());
  const [showVideo, setShowVideo] = useState(false);

  const [skillResources, setSkillResources] = useState({});
  const [loadingResources, setLoadingResources] = useState({});
  const [resourceErrors, setResourceErrors] = useState({});

  const API_BASE_URL = 'http://localhost:3001/api';

  const pageRoutes = useMemo(() => ({
    SkillsPage: "/skills",
    CareerPathPage: "/career-path",
    JobRolePage: "/job-roles",
    Assessment: "/assessment",
    ResultPage: "/result",
  }), []);

  const getYouTubeId = (url) => {
    const urlObj = new URL(url);
    return urlObj.searchParams.get("v");
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const course = urlParams.get("course") || "Computer Science";
    const path = urlParams.get("path") || "fintech";
    const rawRole = urlParams.get("role") || "";
    setSelectedCourse(course);
    setSelectedPath(path);
    const normalized = normalizeRoleKey(rawRole);
    setSelectedRole(normalized);
    if (normalized && skillsData[normalized] && Array.isArray(skillsData[normalized].skills) && skillsData[normalized].skills.length > 0) {
      setSkills(skillsData[normalized].skills);
    } else {
      setSkills([]);
    }
    try {
      const key = `completedSkills:${course}:${path}:${normalized}`;
      const saved = sessionStorage.getItem(key);
      if (saved) setCompletedSkills(new Set(JSON.parse(saved)));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      const key = `completedSkills:${selectedCourse}:${selectedPath}:${selectedRole}`;
      sessionStorage.setItem(key, JSON.stringify(Array.from(completedSkills)));
    } catch {}
  }, [completedSkills, selectedCourse, selectedPath, selectedRole]);

  const fetchResourcesForSkill = async (skillId, skillName) => {
    setLoadingResources(prev => ({ ...prev, [skillId]: true }));
    setResourceErrors(prev => ({ ...prev, [skillId]: null }));
    try {
      const message = `Find REAL, EXISTING learning resources for the skill: "${skillName}". CRITICAL: Only provide URLs that you know actually exist. Please provide exactly: 1. One high-quality online resource (course, article, or guide) with REAL title and REAL URL 2. One YouTube video tutorial with REAL title and REAL URL from an actual channel. Format the response as JSON: { "resource": { "title": "Actual Resource Title", "url": "https://actual-working-url.com", "type": "course/article/guide" }, "video": { "title": "Actual Video Title", "url": "https://youtube.com/watch?v=REAL_VIDEO_ID", "channel": "Real Channel Name" } }`;
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: message }] })
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      const data = await response.json();
      let botResponse = data.choices?.[0]?.message?.content || data.response || data.output || data.value || (typeof data === 'string' ? data : 'No response content received from agent');
      const resources = parseResourcesFromResponse(botResponse);
      if ((!resources.resource || !resources.video) && !resources.resource?.url && !resources.video?.url) {
        const fallback = getFallbackResources(skillName);
        if (fallback) { setSkillResources(prev => ({ ...prev, [skillId]: fallback })); return; }
      }
      setSkillResources(prev => ({ ...prev, [skillId]: resources }));
    } catch (error) {
      try {
        const fallbackResponse = await fetch(`${API_BASE_URL}/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ input_message: `Find learning resources for the skill: "${skillName}". Please provide one online resource and one YouTube video with titles and URLs.` })
        });
        if (!fallbackResponse.ok) throw new Error(`HTTP ${fallbackResponse.status}`);
        const fallbackData = await fallbackResponse.json();
        const resources = parseResourcesFromResponse(fallbackData.value || fallbackData.response || fallbackData.output || 'Resource service unavailable');
        setSkillResources(prev => ({ ...prev, [skillId]: resources }));
      } catch {
        setResourceErrors(prev => ({ ...prev, [skillId]: `Failed to fetch resources: ${error.message}` }));
      }
    } finally {
      setLoadingResources(prev => ({ ...prev, [skillId]: false }));
    }
  };

  const getFallbackResources = (skillName) => {
    const fallbacks = {
      'javascript': { resource: { title: "JavaScript Guide - MDN", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide", type: "guide" }, video: { title: "JavaScript Tutorial for Beginners", url: "https://youtube.com/watch?v=W6NZfCO5SIk", channel: "Programming with Mosh" } },
      'html': { resource: { title: "HTML Tutorial - W3Schools", url: "https://www.w3schools.com/html/", type: "course" }, video: { title: "HTML Full Course - Build a Website Tutorial", url: "https://youtube.com/watch?v=pQN-pnXPaVg", channel: "freeCodeCamp.org" } },
      'css': { resource: { title: "CSS Tutorial - W3Schools", url: "https://www.w3schools.com/css/", type: "course" }, video: { title: "CSS Tutorial - Zero to Hero", url: "https://youtube.com/watch?v=1Rs2ND1ryYc", channel: "freeCodeCamp.org" } },
      'react': { resource: { title: "React Documentation", url: "https://react.dev/learn", type: "guide" }, video: { title: "React Course - Beginner's Tutorial", url: "https://youtube.com/watch?v=bMknfKXIFA8", channel: "freeCodeCamp.org" } }
    };
    const skillKey = skillName.toLowerCase().replace(/[^a-z]/g, '');
    for (const [key, resources] of Object.entries(fallbacks)) {
      if (skillKey.includes(key)) return resources;
    }
    return null;
  };

  const isValidYouTubeUrl = (url) => {
    if (!url) return false;
    return /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/.test(url);
  };

  const isValidUrl = (url) => { try { new URL(url); return true; } catch { return false; } };

  const parseResourcesFromResponse = (aiResponse) => {
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) return JSON.parse(jsonMatch[0]);
      const resourceMatch = aiResponse.match(/(?:resource|course|article|guide).*?title[:\s]*["']([^"']+)["'].*?url[:\s]*["']([^"']+)["']/is);
      const videoMatch = aiResponse.match(/(?:video|youtube).*?title[:\s]*["']([^"']+)["'].*?url[:\s]*["']([^"']+)["']/is);
      return {
        resource: resourceMatch && isValidUrl(resourceMatch[2]) ? { title: resourceMatch[1], url: resourceMatch[2], type: "resource" } : null,
        video: videoMatch && isValidYouTubeUrl(videoMatch[2]) ? { title: videoMatch[1], url: videoMatch[2], channel: "Unknown Channel" } : null
      };
    } catch { return { resource: null, video: null }; }
  };

  const toggleSkillCompletion = (skillId) => {
    setCompletedSkills((prev) => {
      const copy = new Set(prev);
      if (copy.has(skillId)) copy.delete(skillId); else copy.add(skillId);
      return copy;
    });
  };

  const createPageUrl = (pageName) => pageRoutes[pageName] || "/";

  const handleTakeAssessment = (skillId) => {
    navigate(createPageUrl("Assessment") + `?course=${encodeURIComponent(selectedCourse)}&path=${encodeURIComponent(selectedPath)}&role=${encodeURIComponent(selectedRole)}&skill=${encodeURIComponent(skillId)}`);
  };

  const handleFetchResources = (skillId, skillName) => {
    if (!skillResources[skillId] && !loadingResources[skillId]) fetchResourcesForSkill(skillId, skillName);
  };

  const openExternalLink = (url) => window.open(url, '_blank', 'noopener,noreferrer');

  const completionPercentage = skills.length > 0 ? Math.round((completedSkills.size / skills.length) * 100) : 0;
  const roleData = selectedRole && skillsData[selectedRole] ? skillsData[selectedRole] : { roleName: selectedRole ? selectedRole.replace(/-/g, " ") : "Unknown Role" };

  const getDifficultyStyle = (difficulty) => {
    switch (difficulty) {
      case "Beginner": return { color: 'var(--green-bright)', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.3)' };
      case "Intermediate": return { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.3)' };
      case "Advanced": return { color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.3)' };
      default: return { color: 'var(--text-muted)', bg: 'rgba(255,255,255,0.05)', border: 'var(--border)' };
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --green-core: #22c55e; --green-bright: #4ade80; --green-deep: #15803d;
          --surface: rgba(255,255,255,0.03); --surface-2: rgba(255,255,255,0.06);
          --border: rgba(255,255,255,0.08); --border-green: rgba(34,197,94,0.35);
          --text-primary: #f0fdf4; --text-muted: #6b7280; --bg: #080d0a;
        }
        .sk-root { min-height: 100vh; background: var(--bg); color: var(--text-primary); font-family: 'DM Sans', sans-serif; position: relative; overflow-x: hidden; }
        .sk-root::before { content: ''; position: fixed; inset: 0; background-image: linear-gradient(rgba(34,197,94,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.04) 1px, transparent 1px); background-size: 60px 60px; pointer-events: none; z-index: 0; }
        .sk-orb { position: fixed; border-radius: 50%; pointer-events: none; filter: blur(130px); z-index: 0; }
        .sk-orb-1 { width: 700px; height: 700px; background: radial-gradient(circle, rgba(34,197,94,0.09) 0%, transparent 70%); top: -250px; left: -150px; animation: orb-drift 9s ease-in-out infinite alternate; }
        .sk-orb-2 { width: 550px; height: 550px; background: radial-gradient(circle, rgba(21,128,61,0.08) 0%, transparent 70%); bottom: -200px; right: -100px; animation: orb-drift 12s ease-in-out infinite alternate-reverse; }
        @keyframes orb-drift { from { transform: translate(0,0); } to { transform: translate(50px, 40px); } }

        .sk-header { position: relative; z-index: 20; display: flex; justify-content: space-between; align-items: center; padding: 20px 40px; border-bottom: 1px solid var(--border); backdrop-filter: blur(12px); }
        .sk-logo { display: flex; align-items: center; gap: 10px; }
        .sk-logo-mark { width: 36px; height: 36px; background: linear-gradient(135deg, var(--green-core), var(--green-deep)); border-radius: 10px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 20px rgba(34,197,94,0.4); }
        .sk-logo-text { font-family: 'Instrument Serif', serif; font-size: 22px; background: linear-gradient(90deg, #fff, var(--green-bright)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .sk-header-right { display: flex; gap: 8px; align-items: center; }
        .sk-icon-btn { position: relative; width: 40px; height: 40px; background: var(--surface); border: 1px solid var(--border); border-radius: 12px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s ease; color: var(--text-muted); }
        .sk-icon-btn:hover { background: var(--surface-2); border-color: var(--border-green); color: var(--green-bright); }
        .sk-notif-dot { position: absolute; top: 8px; right: 8px; width: 7px; height: 7px; background: var(--green-core); border-radius: 50%; border: 1.5px solid var(--bg); animation: pulse-dot 2s ease infinite; }
        @keyframes pulse-dot { 0%,100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.5); } 50% { box-shadow: 0 0 0 4px rgba(34,197,94,0); } }
        .sk-premium-btn { display: flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 10px; background: linear-gradient(135deg, var(--green-core), var(--green-deep)); color: #fff; font-size: 12px; font-weight: 600; letter-spacing: 0.8px; text-transform: uppercase; cursor: pointer; transition: all 0.25s ease; border: none; font-family: 'DM Sans', sans-serif; box-shadow: 0 4px 16px rgba(34,197,94,0.3); }
        .sk-premium-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(34,197,94,0.45); }

        .sk-main { position: relative; z-index: 10; max-width: 860px; margin: 0 auto; padding: 64px 40px 80px; }

        .sk-hero { text-align: center; margin-bottom: 48px; }
        .sk-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(34,197,94,0.08); border: 1px solid var(--border-green); border-radius: 100px; padding: 6px 16px; font-size: 12px; font-weight: 500; color: var(--green-bright); letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 24px; opacity: 0; animation: fade-up 0.6s 0.1s ease forwards; }
        .sk-headline { font-family: 'Instrument Serif', serif; font-size: clamp(32px, 5vw, 54px); line-height: 1.1; font-weight: 400; color: var(--text-primary); margin-bottom: 14px; opacity: 0; animation: fade-up 0.6s 0.2s ease forwards; }
        .sk-headline em { font-style: italic; background: linear-gradient(90deg, var(--green-core), var(--green-bright)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .sk-subtext { font-size: 15px; line-height: 1.7; color: var(--text-muted); max-width: 500px; margin: 0 auto; opacity: 0; animation: fade-up 0.6s 0.3s ease forwards; }

        /* Progress card */
        .sk-progress-card { background: var(--surface); border: 1px solid var(--border); border-radius: 24px; padding: 28px 32px; margin-bottom: 48px; position: relative; overflow: hidden; opacity: 0; animation: fade-up 0.6s 0.4s ease forwards; }
        .sk-progress-card::before { content: ''; position: absolute; top: 0; left: 24px; right: 24px; height: 1px; background: linear-gradient(90deg, transparent, var(--border-green), transparent); }
        .sk-progress-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
        .sk-progress-label { font-size: 15px; font-weight: 600; color: var(--text-primary); }
        .sk-progress-count { display: flex; align-items: center; gap: 8px; font-size: 15px; font-weight: 700; color: var(--text-primary); }
        .sk-progress-track { width: 100%; height: 8px; background: rgba(255,255,255,0.06); border-radius: 100px; overflow: hidden; margin-bottom: 10px; }
        .sk-progress-fill { height: 100%; border-radius: 100px; background: linear-gradient(90deg, var(--green-deep), var(--green-bright)); transition: width 0.5s ease; }
        .sk-progress-pct { font-size: 12px; color: var(--text-muted); }

        /* Empty */
        .sk-empty { background: rgba(239,68,68,0.06); border: 1px solid rgba(239,68,68,0.25); border-radius: 24px; padding: 40px; text-align: center; opacity: 0; animation: fade-up 0.6s 0.5s ease forwards; }
        .sk-empty-title { font-size: 18px; font-weight: 600; color: #f87171; margin-bottom: 8px; }
        .sk-empty-sub { font-size: 14px; color: var(--text-muted); line-height: 1.6; }

        /* Skill cards */
        .sk-list { display: flex; flex-direction: column; gap: 16px; margin-bottom: 48px; }
        .sk-card { background: var(--surface); border: 1px solid var(--border); border-radius: 24px; padding: 28px; transition: all 0.3s ease; overflow: hidden; position: relative; opacity: 0; }
        .sk-card::after { content: ''; position: absolute; top: 0; left: 24px; right: 24px; height: 1px; background: linear-gradient(90deg, transparent, rgba(34,197,94,0.4), transparent); opacity: 0; transition: opacity 0.3s; }
        .sk-card:hover { border-color: var(--border-green); box-shadow: 0 12px 40px rgba(0,0,0,0.3); }
        .sk-card:hover::after { opacity: 1; }
        .sk-card.completed { border-color: rgba(34,197,94,0.2); background: rgba(34,197,94,0.03); }

        .sk-card-inner { display: flex; gap: 20px; align-items: flex-start; }
        .sk-check-btn { background: none; border: none; cursor: pointer; padding: 4px; flex-shrink: 0; margin-top: 2px; transition: transform 0.2s ease; }
        .sk-check-btn:hover { transform: scale(1.15); }
        .sk-card-body { flex: 1; min-width: 0; }
        .sk-card-top { display: flex; flex-direction: column; gap: 12px; margin-bottom: 16px; }
        @media (min-width: 640px) { .sk-card-top { flex-direction: row; align-items: flex-start; justify-content: space-between; } }

        .sk-card-info {}
        .sk-card-name { font-family: 'Instrument Serif', serif; font-size: 20px; font-weight: 400; color: var(--text-primary); margin-bottom: 6px; line-height: 1.2; }
        .sk-card-desc { font-size: 13px; color: var(--text-muted); line-height: 1.6; margin-bottom: 12px; }
        .sk-card-tags { display: flex; flex-wrap: wrap; gap: 8px; }
        .sk-tag { font-size: 11px; font-weight: 500; padding: 4px 12px; border-radius: 100px; display: inline-flex; align-items: center; gap: 5px; }
        .sk-tag-time { background: rgba(96,165,250,0.1); border: 1px solid rgba(96,165,250,0.3); color: #93c5fd; }

        .sk-card-actions { display: flex; flex-direction: column; gap: 8px; flex-shrink: 0; }
        .sk-btn-assess { padding: 10px 20px; border-radius: 12px; background: linear-gradient(135deg, var(--green-core), var(--green-deep)); color: #fff; font-size: 13px; font-weight: 600; cursor: pointer; border: none; font-family: 'DM Sans', sans-serif; transition: all 0.25s ease; box-shadow: 0 4px 16px rgba(34,197,94,0.3); white-space: nowrap; }
        .sk-btn-assess:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(34,197,94,0.4); }
        .sk-btn-toggle { padding: 10px 20px; border-radius: 12px; background: var(--surface-2); border: 1px solid var(--border); color: var(--text-muted); font-size: 13px; font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s ease; white-space: nowrap; }
        .sk-btn-toggle:hover { border-color: var(--border-green); color: var(--green-bright); }
        .sk-btn-toggle.completed-btn { border-color: rgba(248,113,113,0.3); color: #fca5a5; }
        .sk-btn-toggle.completed-btn:hover { background: rgba(248,113,113,0.08); border-color: rgba(248,113,113,0.5); }

        /* Resources section */
        .sk-resources { margin-top: 20px; padding-top: 20px; border-top: 1px solid var(--border); }
        .sk-resources-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
        .sk-resources-title { font-size: 12px; font-weight: 600; color: var(--text-muted); letter-spacing: 0.5px; text-transform: uppercase; display: flex; align-items: center; gap: 6px; }
        .sk-btn-get { font-size: 11px; font-weight: 600; padding: 6px 14px; border-radius: 100px; background: rgba(34,197,94,0.1); border: 1px solid var(--border-green); color: var(--green-bright); cursor: pointer; transition: all 0.2s; font-family: 'DM Sans', sans-serif; }
        .sk-btn-get:hover { background: rgba(34,197,94,0.18); }

        .sk-loading { display: flex; align-items: center; gap: 10px; padding: 16px; background: rgba(0,0,0,0.2); border-radius: 14px; border: 1px solid var(--border); }
        .sk-loading span { font-size: 13px; color: var(--text-muted); }
        .sk-error { background: rgba(239,68,68,0.06); border: 1px solid rgba(239,68,68,0.2); border-radius: 14px; padding: 14px; }
        .sk-error-msg { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #f87171; margin-bottom: 8px; }
        .sk-btn-retry { font-size: 12px; color: #60a5fa; cursor: pointer; background: none; border: none; font-family: 'DM Sans', sans-serif; }
        .sk-btn-retry:hover { text-decoration: underline; }
        .sk-empty-resources { background: rgba(0,0,0,0.15); border: 1px solid var(--border); border-radius: 14px; padding: 16px; text-align: center; }
        .sk-empty-resources p { font-size: 13px; color: var(--text-muted); }

        .sk-resource-item { display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-radius: 14px; cursor: pointer; transition: all 0.2s; margin-bottom: 8px; }
        .sk-resource-item:last-child { margin-bottom: 0; }
        .sk-resource-item.resource-link { background: rgba(96,165,250,0.06); border: 1px solid rgba(96,165,250,0.2); }
        .sk-resource-item.resource-link:hover { background: rgba(96,165,250,0.12); border-color: rgba(96,165,250,0.4); }
        .sk-resource-item.video-link { background: rgba(248,113,113,0.06); border: 1px solid rgba(248,113,113,0.2); }
        .sk-resource-item.video-link:hover { background: rgba(248,113,113,0.12); border-color: rgba(248,113,113,0.4); }
        .sk-resource-icon { width: 32px; height: 32px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .sk-resource-icon.blue { background: rgba(96,165,250,0.12); color: #60a5fa; }
        .sk-resource-icon.red { background: rgba(248,113,113,0.12); color: #f87171; }
        .sk-resource-meta { flex: 1; min-width: 0; }
        .sk-resource-name { font-size: 13px; font-weight: 500; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 2px; }
        .sk-resource-type { font-size: 10px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; }
        .sk-resource-type.blue { color: #60a5fa; }
        .sk-resource-type.red { color: #f87171; }

        /* Video popup */
        .sk-video-popup { position: fixed; bottom: 20px; left: 20px; background: #0d1610; border: 1px solid var(--border-green); border-radius: 20px; padding: 12px; width: 340px; z-index: 9999; box-shadow: 0 24px 60px rgba(0,0,0,0.6); animation: pop-up 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        @keyframes pop-up { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .sk-video-close { position: absolute; top: 10px; right: 10px; width: 28px; height: 28px; background: var(--surface-2); border: 1px solid var(--border); border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--text-muted); z-index: 2; }
        .sk-video-close:hover { color: #f87171; border-color: rgba(248,113,113,0.4); }

        /* Bottom actions */
        .sk-actions { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; align-items: center; opacity: 0; animation: fade-up 0.6s 0.5s ease forwards; }
        .sk-btn-back { display: inline-flex; align-items: center; gap: 8px; padding: 12px 28px; border-radius: 14px; background: var(--surface); border: 1px solid var(--border); color: var(--text-muted); font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.25s ease; font-family: 'DM Sans', sans-serif; }
        .sk-btn-back:hover { border-color: var(--border-green); color: var(--green-bright); background: var(--surface-2); }
        .sk-btn-roadmap { display: inline-flex; align-items: center; gap: 8px; padding: 12px 28px; border-radius: 14px; background: linear-gradient(135deg, var(--green-core), var(--green-deep)); color: #fff; font-size: 14px; font-weight: 600; cursor: pointer; border: none; font-family: 'DM Sans', sans-serif; transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1); box-shadow: 0 8px 24px rgba(34,197,94,0.35); position: relative; overflow: hidden; }
        .sk-btn-roadmap:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(34,197,94,0.5); }
        .sk-btn-roadmap::after { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(255,255,255,0.12), transparent); pointer-events: none; }

        /* SkillTracker congrats modal */
        .sk-tracker { padding: 24px 0 0; opacity: 0; animation: fade-up 0.6s 0.6s ease forwards; }
        .sk-tracker-pct { font-size: 14px; color: var(--text-muted); text-align: center; }

        @keyframes fade-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 640px) { .sk-main { padding: 48px 20px 60px; } .sk-header { padding: 16px 20px; } }
      `}</style>

      <div className="sk-root">
        <div className="sk-orb sk-orb-1" />
        <div className="sk-orb sk-orb-2" />

        {/* Header */}
        <header className="sk-header">
          <div className="sk-logo">
            <div className="sk-logo-mark"><Sparkles size={16} color="#fff" /></div>
            <span className="sk-logo-text">Pathwise AI</span>
          </div>
          <div className="sk-header-right">
            <button className="sk-premium-btn"><Sparkles size={12} />Premium</button>
            <button className="sk-icon-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <span className="sk-notif-dot" />
            </button>
            <button className="sk-icon-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </button>
          </div>
        </header>

        <main className="sk-main">
          {/* Hero */}
          <div className="sk-hero">
            <div className="sk-badge"><Sparkles size={11} />Skills Roadmap</div>
            <h1 className="sk-headline">Skills for <em>{roleData.roleName}</em></h1>
            <p className="sk-subtext">Master these essential skills to become job-ready. Track your progress and get AI-curated learning resources.</p>
          </div>

          {/* Progress */}
          <div className="sk-progress-card">
            <div className="sk-progress-top">
              <span className="sk-progress-label">Learning Progress</span>
              <div className="sk-progress-count">
                <Trophy size={16} color="#f59e0b" />
                {completedSkills.size}/{skills.length} Skills
              </div>
            </div>
            <div className="sk-progress-track">
              <div className="sk-progress-fill" style={{ width: `${completionPercentage}%` }} />
            </div>
            <p className="sk-progress-pct">{completionPercentage}% Complete</p>
          </div>

          {/* Skills or Empty */}
          {skills.length === 0 ? (
            <div className="sk-empty">
              <p className="sk-empty-title">No skills under this.</p>
              <p className="sk-empty-sub">The selected role ({selectedRole || "none"}) doesn't have any defined skills yet.</p>
            </div>
          ) : (
            <div className="sk-list">
              {skills.map((skill, i) => {
                const isCompleted = completedSkills.has(skill.id);
                const resources = skillResources[skill.id];
                const isLoadingResources = loadingResources[skill.id];
                const resourceError = resourceErrors[skill.id];
                const diffStyle = getDifficultyStyle(skill.difficulty);

                return (
                  <div
                    key={skill.id}
                    className={`sk-card${isCompleted ? ' completed' : ''}`}
                    style={{ animation: `fade-up 0.5s ${0.45 + i * 0.07}s ease forwards` }}
                  >
                    <div className="sk-card-inner">
                      <button className="sk-check-btn" onClick={() => toggleSkillCompletion(skill.id)}>
                        {isCompleted
                          ? <CheckCircle size={26} color="var(--green-bright)" />
                          : <Circle size={26} color="var(--text-muted)" />}
                      </button>

                      <div className="sk-card-body">
                        <div className="sk-card-top">
                          <div className="sk-card-info">
                            <h3 className="sk-card-name">{skill.name}</h3>
                            <p className="sk-card-desc">{skill.description}</p>
                            <div className="sk-card-tags">
                              <span className="sk-tag" style={{ background: diffStyle.bg, border: `1px solid ${diffStyle.border}`, color: diffStyle.color }}>{skill.difficulty}</span>
                              <span className="sk-tag sk-tag-time"><Clock size={10} />{skill.timeEstimate}</span>
                            </div>
                          </div>

                          <div className="sk-card-actions">
                            {isCompleted && (
                              <button className="sk-btn-assess" onClick={() => handleTakeAssessment(skill.id)}>Take Assessment</button>
                            )}
                            <button
                              className={`sk-btn-toggle${isCompleted ? ' completed-btn' : ''}`}
                              onClick={() => toggleSkillCompletion(skill.id)}
                            >
                              {isCompleted ? "Mark Incomplete" : "Mark Complete"}
                            </button>
                          </div>
                        </div>

                        {/* Resources */}
                        <div className="sk-resources">
                          <div className="sk-resources-header">
                            <span className="sk-resources-title"><BookOpen size={12} />AI-Curated Resources</span>
                            {!resources && !isLoadingResources && !resourceError && (
                              <button className="sk-btn-get" onClick={() => handleFetchResources(skill.id, skill.name)}>Get Resources</button>
                            )}
                          </div>

                          {isLoadingResources ? (
                            <div className="sk-loading">
                              <Loader2 size={16} color="var(--green-bright)" style={{ animation: 'spin 1s linear infinite' }} />
                              <span>Fetching personalized resources from AI…</span>
                            </div>
                          ) : resourceError ? (
                            <div className="sk-error">
                              <div className="sk-error-msg"><AlertCircle size={14} />{resourceError}</div>
                              <button className="sk-btn-retry" onClick={() => fetchResourcesForSkill(skill.id, skill.name)}>Try again</button>
                            </div>
                          ) : resources ? (
                            <div>
                              {resources.resource && (
                                <div className="sk-resource-item resource-link" onClick={() => openExternalLink(resources.resource.url)}>
                                  <div className="sk-resource-icon blue"><BookOpen size={14} /></div>
                                  <div className="sk-resource-meta">
                                    <div className="sk-resource-name">{resources.resource.title}</div>
                                    <div className="sk-resource-type blue">{resources.resource.type?.toUpperCase() || 'RESOURCE'}</div>
                                  </div>
                                  <ExternalLink size={13} color="#60a5fa" />
                                </div>
                              )}
                              {resources.video && (
                                <div className="sk-resource-item video-link" onClick={() => setShowVideo(true)}>
                                  <div className="sk-resource-icon red"><Video size={14} /></div>
                                  <div className="sk-resource-meta">
                                    <div className="sk-resource-name">{resources.video.title}</div>
                                    <div className="sk-resource-type red">YOUTUBE {resources.video.channel && `· ${resources.video.channel}`}</div>
                                  </div>
                                  <ExternalLink size={13} color="#f87171" />
                                </div>
                              )}
                              {showVideo && resources.video && (
                                <div className="sk-video-popup">
                                  <button className="sk-video-close" onClick={() => setShowVideo(false)}><X size={12} /></button>
                                  <iframe
                                    style={{ width: '100%', height: '180px', borderRadius: '12px', display: 'block' }}
                                    src={`https://www.youtube.com/embed/${getYouTubeId(resources.video.url)}`}
                                    title={resources.video.title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                  />
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="sk-empty-resources">
                              <p>Click "Get Resources" to fetch AI-curated learning materials for this skill</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Bottom actions */}
          <div className="sk-actions">
            <button className="sk-btn-back" onClick={() => navigate(createPageUrl("JobRolePage") + `?course=${encodeURIComponent(selectedCourse)}&path=${encodeURIComponent(selectedPath)}`)}>
              <ChevronLeft size={16} />Back to Job Roles
            </button>
            {completionPercentage === 100 && (
              <button className="sk-btn-roadmap" onClick={() => navigate(createPageUrl("ResultPage") + `?course=${encodeURIComponent(selectedCourse)}&path=${encodeURIComponent(selectedPath)}&role=${encodeURIComponent(selectedRole)}`)}>
                View Career Roadmap <ArrowRight size={16} />
              </button>
            )}
          </div>

          <SkillTracker skills={skills} completedSkills={completedSkills} />
        </main>
      </div>
    </>
  );
}

// SkillTracker — design only, logic untouched
const SkillTracker = ({ skills, completedSkills }) => {
  const [showCongrats, setShowCongrats] = useState(false);
  const navigate = useNavigate();

  const completionPercentage = skills.length > 0 ? Math.round((completedSkills.size / skills.length) * 100) : 0;

  useEffect(() => {
    if (completionPercentage === 100) setShowCongrats(true);
  }, [completionPercentage]);

  const handleClose = () => setShowCongrats(false);
  const handleContinue = () => navigate('/project-page');

  return (
    <>
      <style>{`
        .sk-congrats-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.75); backdrop-filter: blur(16px); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .sk-congrats-modal { background: #0d1610; border: 1px solid rgba(34,197,94,0.4); border-radius: 28px; padding: 52px 44px; max-width: 480px; width: 100%; text-align: center; position: relative; box-shadow: 0 40px 100px rgba(0,0,0,0.7), 0 0 60px rgba(34,197,94,0.1); }
        .sk-congrats-modal::before { content: ''; position: absolute; top: 0; left: 32px; right: 32px; height: 1px; background: linear-gradient(90deg, transparent, #22c55e, transparent); }
        .sk-congrats-emoji { font-size: 52px; margin-bottom: 20px; display: block; }
        .sk-congrats-title { font-family: 'Instrument Serif', serif; font-size: 36px; font-weight: 400; color: #4ade80; margin-bottom: 10px; }
        .sk-congrats-sub { font-size: 16px; color: rgba(255,255,255,0.7); margin-bottom: 36px; line-height: 1.6; }
        .sk-congrats-actions { display: flex; gap: 12px; justify-content: center; }
        .sk-congrats-continue { padding: 14px 28px; border-radius: 14px; background: linear-gradient(135deg, #22c55e, #15803d); color: #fff; font-size: 14px; font-weight: 700; cursor: pointer; border: none; font-family: 'DM Sans', sans-serif; transition: all 0.3s; box-shadow: 0 8px 24px rgba(34,197,94,0.35); }
        .sk-congrats-continue:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(34,197,94,0.5); }
        .sk-congrats-close { padding: 14px 24px; border-radius: 14px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); color: rgba(255,255,255,0.5); font-size: 14px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
        .sk-congrats-close:hover { color: #fff; background: rgba(255,255,255,0.08); }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      <div className="sk-tracker">
        <p className="sk-tracker-pct">Completion: {completionPercentage}%</p>
      </div>

      <AnimatePresence>
        {showCongrats && (
          <motion.div className="sk-congrats-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="sk-congrats-modal" initial={{ y: "-100vh", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "-100vh", opacity: 0 }} transition={{ duration: 0.4 }}>
              <span className="sk-congrats-emoji">🎉</span>
              <h2 className="sk-congrats-title">Congratulations!</h2>
              <p className="sk-congrats-sub">You've completed all skills for this role. Time to put your knowledge to work.</p>
              <div className="sk-congrats-actions">
                <button className="sk-congrats-continue" onClick={handleContinue}>Continue to Project Page</button>
                <button className="sk-congrats-close" onClick={handleClose}>Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};