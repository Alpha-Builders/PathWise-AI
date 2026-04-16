import React, { useEffect, useRef, useState } from 'react';
import { Link } from "react-router-dom";

const HeroSection = () => {
  const canvasRef = useRef(null);
  const [videoOpen, setVideoOpen] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let particles = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.3;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.color = Math.random() > 0.7 ? '#00a73e' : '#ffffff';
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    for (let i = 0; i < 120; i++) particles.push(new Particle());

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <section className="hero-section">
      <canvas ref={canvasRef} className="hero-canvas" />
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />
      <div className="grid-overlay" />

      <div className="hero-content">
        <div className="hero-badge">
          <span className="badge-dot" />
          <span>AI-Powered Career Intelligence</span>
        </div>

        <h1 className="hero-title">
          <span className="title-line title-line-1">Find Your</span>
          <span className="title-line title-line-2">
            <span className="title-highlight">Career Path</span>
          </span>
          <span className="title-line title-line-3">With Confidence</span>
        </h1>

        <p className="hero-subtitle">
          PathWise AI guides you to discover, plan, and succeed in<br className="subtitle-br" />
          the career you're meant for — powered by intelligent insights.
        </p>

        <div className="hero-actions">
          <Link to="/register" className="btn-primary">
            <span className="btn-label">Get Started Free</span>
            <span className="btn-arrow">→</span>
            <div className="btn-shine" />
          </Link>
          <button className="btn-secondary" onClick={() => setVideoOpen(true)}>
            <span className="play-icon">▶</span>
            Watch Demo
          </button>
        </div>

        {videoOpen && (
          <div className="video-overlay" onClick={() => setVideoOpen(false)}>
            <div className="video-modal" onClick={e => e.stopPropagation()}>
              <button className="video-close" onClick={() => setVideoOpen(false)}>✕</button>
              <div className="video-wrapper">
                <iframe
                  src="https://www.youtube.com/embed/-KFVOsCwN7s?autoplay=1&rel=0"
                  title="PathWise AI Demo"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        )}

        <div className="hero-stats">
          {[
            { value: '50K+', label: 'Careers Mapped' },
            { value: '94%', label: 'Success Rate' },
            { value: '200+', label: 'Career Paths' },
          ].map(({ value, label }) => (
            <div className="stat-item" key={label}>
              <span className="stat-value">{value}</span>
              <span className="stat-label">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="hero-image-container">
        <div className="image-glow" />
        <div className="image-frame">
          <img src="/images/journey.png" alt="Career journey illustration" className="hero-image" />
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600&display=swap');

        .hero-section {
          position: relative;
          background: #0a1120;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          padding: 80px 24px 0;
          font-family: 'Geist', sans-serif;
        }
        .hero-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }
        .grid-overlay {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(0,167,62,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,167,62,0.03) 1px, transparent 1px);
          background-size: 60px 60px;
          z-index: 1;
          mask-image: radial-gradient(ellipse 80% 60% at 50% 50%, black, transparent);
        }
        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          z-index: 1;
        }
        .blob-1 { width: 500px; height: 250px; background: #014d22; top: 10%; left: 5%; opacity: 0.35; animation: blobFloat 8s ease-in-out infinite; }
        .blob-2 { width: 400px; height: 200px; background: #016b2e; top: 55%; right: 5%; opacity: 0.25; animation: blobFloat 10s ease-in-out infinite reverse; }
        .blob-3 { width: 300px; height: 150px; background: #00a73e; bottom: 15%; left: 30%; opacity: 0.12; animation: blobFloat 12s ease-in-out infinite 2s; }
        @keyframes blobFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(20px, -20px) scale(1.05); }
          66% { transform: translate(-15px, 10px) scale(0.97); }
        }
        .hero-content {
          position: relative;
          z-index: 10;
          text-align: center;
          max-width: 800px;
          width: 100%;
          animation: fadeUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(0, 167, 62, 0.08);
          border: 1px solid rgba(0, 167, 62, 0.25);
          border-radius: 100px;
          padding: 6px 16px;
          color: #4ade80;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: 32px;
          animation: fadeUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;
        }
        .badge-dot {
          width: 6px; height: 6px;
          background: #00a73e;
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
          flex-shrink: 0;
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(0, 167, 62, 0.5); }
          50% { box-shadow: 0 0 0 5px rgba(0, 167, 62, 0); }
        }
        .hero-title {
          font-family: 'Instrument Serif', serif;
          font-weight: 400;
          line-height: 1.05;
          color: #fff;
          margin: 0 0 28px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          animation: fadeUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both;
        }
        .title-line { display: block; }
        .title-line-1 { font-size: clamp(2rem, 5.5vw, 4rem); color: rgba(255,255,255,0.55); font-style: italic; }
        .title-line-2 { font-size: clamp(2.8rem, 7.5vw, 5.6rem); }
        .title-line-3 { font-size: clamp(2rem, 5.5vw, 4rem); color: rgba(255,255,255,0.55); font-style: italic; }
        .title-highlight {
          background: linear-gradient(135deg, #00c44a 0%, #00ff6a 50%, #00a73e 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          position: relative;
        }
        .title-highlight::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, transparent, #00a73e, transparent);
          border-radius: 2px;
        }
        .hero-subtitle {
          font-size: clamp(1rem, 2.5vw, 1.2rem);
          color: rgba(255,255,255,0.55);
          line-height: 1.7;
          margin: 0 0 40px;
          font-weight: 300;
          animation: fadeUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both;
        }
        .subtitle-br { display: none; }
        @media (min-width: 640px) { .subtitle-br { display: block; } }
        .hero-actions {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 48px;
          animation: fadeUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both;
        }
        .btn-primary {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: linear-gradient(135deg, #00a73e, #00c44a);
          color: #fff;
          font-family: 'Geist', sans-serif;
          font-weight: 500;
          font-size: 1rem;
          padding: 14px 28px;
          border-radius: 12px;
          text-decoration: none;
          overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 0 0 1px rgba(0,167,62,0.5), 0 8px 32px rgba(0,167,62,0.25);
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 0 1px rgba(0,167,62,0.7), 0 12px 40px rgba(0,167,62,0.4);
        }
        .btn-shine {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%);
          pointer-events: none;
        }
        .btn-arrow { font-size: 1.1rem; transition: transform 0.2s; }
        .btn-primary:hover .btn-arrow { transform: translateX(4px); }
        .btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.75);
          font-family: 'Geist', sans-serif;
          font-weight: 400;
          font-size: 1rem;
          padding: 14px 28px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
          backdrop-filter: blur(10px);
        }
        .btn-secondary:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.2);
          color: #fff;
          transform: translateY(-2px);
        }
        .play-icon {
          font-size: 0.7rem;
          background: rgba(255,255,255,0.15);
          border-radius: 50%;
          width: 26px; height: 26px;
          display: flex; align-items: center; justify-content: center;
          padding-left: 2px;
          flex-shrink: 0;
        }
        .hero-stats {
          display: flex;
          gap: 0;
          justify-content: center;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          background: rgba(255,255,255,0.03);
          backdrop-filter: blur(10px);
          overflow: hidden;
          animation: fadeUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both;
          max-width: 480px;
          margin: 0 auto;
        }
        .stat-item {
          flex: 1;
          padding: 20px 16px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          align-items: center;
          border-right: 1px solid rgba(255,255,255,0.08);
        }
        .stat-item:last-child { border-right: none; }
        .stat-value {
          font-family: 'Geist', sans-serif;
          font-weight: 600;
          font-size: 1.5rem;
          background: linear-gradient(135deg, #00c44a, #4ade80);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .stat-label {
          font-size: 0.7rem;
          color: rgba(255,255,255,0.4);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          font-weight: 500;
        }
        .hero-image-container {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 1100px;
          margin-top: 56px;
          animation: fadeUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.6s both;
        }
        .image-glow {
          position: absolute;
          top: -40px;
          left: 50%;
          transform: translateX(-50%);
          width: 60%;
          height: 100px;
          background: radial-gradient(ellipse, rgba(0,167,62,0.3) 0%, transparent 70%);
          pointer-events: none;
        }
        .image-frame {
          border-radius: 24px 24px 0 0;
          overflow: hidden;
          border: 1px solid rgba(0,167,62,0.15);
          border-bottom: none;
          background: rgba(255,255,255,0.02);
          backdrop-filter: blur(4px);
        }
        .hero-image { width: 100%; height: auto; display: block; }
        @media (max-width: 640px) {
          .hero-section { padding: 70px 20px 0; }
          .hero-badge { font-size: 10px; }
          .hero-stats { max-width: 100%; }
          .stat-item { padding: 16px 10px; }
          .stat-value { font-size: 1.2rem; }
          .hero-actions { flex-direction: column; align-items: center; }
          .btn-primary, .btn-secondary { width: 100%; max-width: 280px; justify-content: center; }
        }
        .video-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(8px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          animation: overlayIn 0.25s ease both;
        }
        @keyframes overlayIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .video-modal {
          position: relative;
          width: 100%;
          max-width: 900px;
          background: #0d1b2a;
          border: 1px solid rgba(0, 167, 62, 0.2);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 0 0 1px rgba(0,167,62,0.1), 0 40px 80px rgba(0,0,0,0.6);
          animation: modalIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.94) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .video-close {
          position: absolute;
          top: 14px; right: 14px;
          z-index: 10;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.7);
          font-size: 0.85rem;
          width: 32px; height: 32px;
          border-radius: 50%;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s, color 0.2s;
          font-family: 'Geist', sans-serif;
        }
        .video-close:hover { background: rgba(255,255,255,0.15); color: #fff; }
        .video-wrapper {
          position: relative;
          padding-bottom: 56.25%;
          height: 0;
        }
        .video-wrapper iframe {
          position: absolute;
          inset: 0;
          width: 100%; height: 100%;
          border: none;
          display: block;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;