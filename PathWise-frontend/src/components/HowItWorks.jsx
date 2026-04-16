import React, { useEffect, useRef, useState } from 'react';

const steps = [
  {
    number: '01',
    title: 'Discover Paths Tailored to You',
    description: 'Answer a few questions about your interests, skills, and goals. Our AI maps out career options uniquely matched to who you are.',
    image: '/images/box-1.jpg',
    accent: '#00a73e',
  },
  {
    number: '02',
    title: 'Know What Skills to Learn & When',
    description: 'Get a precise roadmap of skills to acquire, in the right order, with curated resources for each milestone.',
    image: '/images/box-2.jpg',
    accent: '#00c44a',
  },
  {
    number: '03',
    title: 'Track Progress to Your Dream Role',
    description: 'See exactly how close you are to your target role with real-time progress insights and gap analysis.',
    image: '/images/box-3.jpg',
    accent: '#4ade80',
  },
];

const testimonials = [
  {
    name: 'Martin Goutry',
    role: 'Software Engineer',
    text: 'PathWise AI made choosing a career less overwhelming. It gave me clarity and confidence to pursue a path that fits both my personality and skills.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face',
    rotate: '-4deg',
    delay: 0,
  },
  {
    name: 'Agnes Remi',
    role: 'UX Designer',
    text: 'The career roadmap feature changed how I think about growth. I finally know exactly what steps to take next — no more guesswork.',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face',
    rotate: '3deg',
    delay: 100,
  },
  {
    name: 'Theo Champion',
    role: 'Product Manager',
    text: 'I went from totally lost to landing my dream PM role in 8 months. The skill roadmap was spot-on and the progress tracking kept me motivated.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face',
    rotate: '-2deg',
    delay: 200,
  },
];

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [visibleCards, setVisibleCards] = useState(new Set());
  const testimonialsRef = useRef(null);
  const stepRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = parseInt(entry.target.dataset.step, 10);
            if (!isNaN(idx)) setActiveStep(idx);
          }
        });
      },
      { threshold: 0.5 }
    );
    stepRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const cardEls = testimonialsRef.current?.querySelectorAll('[data-card]');
    if (!cardEls) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = parseInt(entry.target.dataset.card, 10);
            setVisibleCards((prev) => new Set([...prev, idx]));
          }
        });
      },
      { threshold: 0.1 }
    );
    cardEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* ─── How It Works ─── */}
      <section className="hiw-section">
        <div className="hiw-blob hiw-blob-1" />
        <div className="hiw-blob hiw-blob-2" />
        <div className="hiw-grid" />

        <div className="hiw-inner">
          <div className="section-label">
            <span className="section-dot" />
            The Process
          </div>
          <h2 className="section-heading">How It Works</h2>
          <p className="section-sub">Three simple steps from confusion to clarity.</p>

          <div className="hiw-steps">
            {/* sticky image panel */}
            <div className="hiw-image-panel">
              {steps.map((step, i) => (
                <div
                  key={i}
                  className={`step-image-wrap ${activeStep === i ? 'step-image-active' : ''}`}
                >
                  <div className="step-img-glow" style={{ background: step.accent }} />
                  <img
                    src={step.image}
                    alt={step.title}
                    className="step-img"
                  />
                  <div className="step-img-badge">{step.number}</div>
                </div>
              ))}
            </div>

            {/* scrollable steps */}
            <div className="hiw-step-list">
              {steps.map((step, i) => (
                <div
                  key={i}
                  ref={(el) => (stepRefs.current[i] = el)}
                  data-step={i}
                  className={`hiw-step ${activeStep === i ? 'hiw-step-active' : ''}`}
                >
                  <div className="step-number-badge">{step.number}</div>
                  <div className="step-connector" />
                  <div className="step-body">
                    <h3 className="step-title">{step.title}</h3>
                    <p className="step-desc">{step.description}</p>
                    <div className="step-indicator">
                      <div className="step-ind-bar" style={{ background: step.accent }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* mobile card grid */}
          <div className="hiw-mobile-grid">
            {steps.map((step, i) => (
              <div className="mobile-step-card" key={i} style={{ '--accent': step.accent }}>
                <div className="mobile-card-img-wrap">
                  <img src={step.image} alt={step.title} className="mobile-card-img" />
                  <span className="mobile-card-badge">{step.number}</span>
                </div>
                <h3 className="mobile-card-title">{step.title}</h3>
                <p className="mobile-card-desc">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section className="testi-section" ref={testimonialsRef}>
        <div className="testi-blob testi-blob-1" />
        <div className="testi-blob testi-blob-2" />

        <div className="testi-inner">
          <div className="section-label">
            <span className="section-dot" />
            Social Proof
          </div>
          <h2 className="section-heading">Trusted by Students & Professionals</h2>
          <p className="section-sub">Real results from real people who found their path.</p>

          <div className="testi-grid">
            {testimonials.map((t, i) => (
              <div
                key={i}
                data-card={i}
                className={`testi-card ${visibleCards.has(i) ? 'testi-card-visible' : ''}`}
                style={{ '--delay': `${t.delay}ms`, '--rotate': t.rotate }}
              >
                <div className="testi-quote">"</div>
                <p className="testi-text">{t.text}</p>
                <div className="testi-author">
                  <img src={t.image} alt={t.name} className="testi-avatar" />
                  <div>
                    <div className="testi-name">{t.name}</div>
                    <div className="testi-role">{t.role}</div>
                  </div>
                </div>
                <div className="testi-stars">★★★★★</div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="cta-block">
            <div className="cta-glow" />
            <div className="cta-content">
              <div className="section-label" style={{ justifyContent: 'center' }}>
                <span className="section-dot" />
                Get Started Today
              </div>
              <h3 className="cta-heading">Start Your Career With PathWise AI</h3>
              <p className="cta-sub">
                Get personalized career guidance in minutes.<br />Free to start, no credit card required.
              </p>
              <a href="/register" className="cta-btn">
                <span>Sign Up Free</span>
                <span className="cta-arrow">→</span>
                <div className="cta-btn-shine" />
              </a>
              <p className="cta-note">Join 50,000+ people already on their path</p>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; }

        /* ── SHARED ── */
        .section-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #4ade80;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 16px;
          font-family: 'Geist', sans-serif;
        }
        .section-dot {
          width: 6px; height: 6px;
          background: #00a73e;
          border-radius: 50%;
          flex-shrink: 0;
          box-shadow: 0 0 8px #00a73e;
        }
        .section-heading {
          font-family: 'Instrument Serif', serif;
          font-weight: 400;
          font-size: clamp(1.8rem, 4vw, 2.8rem);
          color: #fff;
          margin: 0 0 12px;
          line-height: 1.1;
        }
        .section-sub {
          font-family: 'Geist', sans-serif;
          font-size: clamp(0.95rem, 2vw, 1.1rem);
          color: rgba(255,255,255,0.45);
          margin: 0 0 64px;
          font-weight: 300;
        }

        /* ── HOW IT WORKS ── */
        .hiw-section {
          position: relative;
          background: #0a1120;
          padding: 96px 24px 80px;
          overflow: hidden;
          font-family: 'Geist', sans-serif;
        }
        .hiw-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          pointer-events: none;
          z-index: 1;
        }
        .hiw-blob-1 { width: 500px; height: 250px; background: #013d1b; top: 10%; left: 5%; opacity: 0.6; }
        .hiw-blob-2 { width: 400px; height: 200px; background: #014d22; bottom: 20%; right: 5%; opacity: 0.5; }
        .hiw-grid {
          position: absolute; inset: 0; z-index: 1;
          background-image: linear-gradient(rgba(0,167,62,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,167,62,0.025) 1px, transparent 1px);
          background-size: 60px 60px;
        }
        .hiw-inner {
          position: relative; z-index: 10;
          max-width: 1100px; margin: 0 auto;
        }

        /* desktop layout */
        .hiw-steps {
          display: none;
          gap: 80px;
          align-items: flex-start;
        }
        @media (min-width: 900px) {
          .hiw-steps { display: flex; }
          .hiw-mobile-grid { display: none !important; }
        }

        .hiw-image-panel {
          flex: 1;
          position: sticky;
          top: 120px;
          height: 340px;
        }
        .step-image-wrap {
          position: absolute; inset: 0;
          opacity: 0;
          transform: scale(0.96) translateY(12px);
          transition: opacity 0.5s cubic-bezier(0.16,1,0.3,1), transform 0.5s cubic-bezier(0.16,1,0.3,1);
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid rgba(0,167,62,0.15);
        }
        .step-image-active {
          opacity: 1 !important;
          transform: scale(1) translateY(0) !important;
        }
        .step-img-glow {
          position: absolute; top: -30px; left: 50%;
          transform: translateX(-50%);
          width: 80%; height: 80px;
          filter: blur(40px);
          opacity: 0.4;
          z-index: 1;
        }
        .step-img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .step-img-badge {
          position: absolute; top: 16px; left: 16px;
          background: rgba(0,0,0,0.7);
          border: 1px solid rgba(0,167,62,0.4);
          color: #4ade80;
          font-family: 'Instrument Serif', serif;
          font-weight: 400;
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          padding: 4px 10px;
          border-radius: 6px;
          backdrop-filter: blur(8px);
          z-index: 5;
        }

        .hiw-step-list { flex: 1; display: flex; flex-direction: column; gap: 0; }
        .hiw-step {
          position: relative;
          padding: 40px 0 40px 64px;
          cursor: default;
          border-left: 2px solid rgba(255,255,255,0.06);
          transition: border-color 0.3s;
        }
        .hiw-step-active { border-color: rgba(0,167,62,0.5); }
        .step-number-badge {
          position: absolute;
          left: -14px;
          top: 44px;
          width: 26px; height: 26px;
          border-radius: 50%;
          background: #0a1120;
          border: 2px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.3);
          font-family: 'Instrument Serif', serif;
          font-size: 0.65rem;
          font-weight: 400;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.3s;
        }
        .hiw-step-active .step-number-badge {
          background: #00a73e;
          border-color: #00a73e;
          color: #fff;
          box-shadow: 0 0 16px rgba(0,167,62,0.5);
        }
        .step-title {
          font-family: 'Instrument Serif', serif;
          font-weight: 400;
          font-size: clamp(1.1rem, 2.5vw, 1.4rem);
          color: rgba(255,255,255,0.45);
          margin: 0 0 12px;
          transition: color 0.3s;
        }
        .hiw-step-active .step-title { color: #fff; }
        .step-desc {
          font-size: 0.95rem;
          color: rgba(255,255,255,0.3);
          line-height: 1.7;
          margin: 0 0 16px;
          transition: color 0.3s;
          max-width: 420px;
        }
        .hiw-step-active .step-desc { color: rgba(255,255,255,0.6); }
        .step-indicator { height: 2px; width: 0; background: transparent; transition: width 0.4s, background 0.3s; }
        .hiw-step-active .step-indicator { width: 48px; }
        .step-ind-bar { height: 100%; border-radius: 2px; }

        /* mobile card grid */
        .hiw-mobile-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }
        @media (min-width: 540px) {
          .hiw-mobile-grid { grid-template-columns: 1fr 1fr; }
        }
        .mobile-step-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 18px;
          overflow: hidden;
          transition: transform 0.3s, border-color 0.3s;
        }
        .mobile-step-card:hover {
          transform: translateY(-4px);
          border-color: rgba(0,167,62,0.3);
        }
        .mobile-card-img-wrap {
          position: relative;
          height: 180px;
          overflow: hidden;
        }
        .mobile-card-img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .mobile-card-badge {
          position: absolute; top: 12px; left: 12px;
          background: rgba(0,0,0,0.65);
          border: 1px solid rgba(0,167,62,0.5);
          color: #4ade80;
          font-family: 'Instrument Serif', serif;
          font-weight: 400;
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          padding: 3px 9px;
          border-radius: 6px;
          backdrop-filter: blur(6px);
        }
        .mobile-card-title {
          font-family: 'Instrument Serif', serif;
          font-weight: 400;
          font-size: 1rem;
          color: #fff;
          margin: 0;
          padding: 16px 18px 8px;
          line-height: 1.3;
        }
        .mobile-card-desc {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.45);
          line-height: 1.6;
          padding: 0 18px 18px;
          margin: 0;
        }

        /* ── TESTIMONIALS ── */
        .testi-section {
          position: relative;
          background: #080f1c;
          padding: 96px 24px 80px;
          overflow: hidden;
          font-family: 'Geist', sans-serif;
        }
        .testi-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          pointer-events: none;
          z-index: 1;
        }
        .testi-blob-1 { width: 500px; height: 250px; background: #012e15; top: 5%; right: 5%; opacity: 0.8; }
        .testi-blob-2 { width: 400px; height: 200px; background: #01451d; bottom: 30%; left: 5%; opacity: 0.6; }
        .testi-inner {
          position: relative; z-index: 10;
          max-width: 1100px; margin: 0 auto;
        }

        .testi-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
          margin-bottom: 80px;
        }
        @media (min-width: 640px) {
          .testi-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (min-width: 960px) {
          .testi-grid { grid-template-columns: 1fr 1fr 1fr; }
        }

        .testi-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          padding: 28px 28px 24px;
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.6s cubic-bezier(0.16,1,0.3,1) var(--delay, 0ms),
                      transform 0.6s cubic-bezier(0.16,1,0.3,1) var(--delay, 0ms),
                      border-color 0.3s, box-shadow 0.3s;
        }
        .testi-card-visible {
          opacity: 1;
          transform: translateY(0) rotate(var(--rotate, 0deg));
        }
        .testi-card:hover {
          border-color: rgba(0,167,62,0.25);
          box-shadow: 0 8px 40px rgba(0,0,0,0.3);
        }
        .testi-quote {
          font-family: 'Instrument Serif', serif;
          font-size: 4rem;
          color: rgba(0,167,62,0.25);
          line-height: 0.8;
          margin-bottom: 12px;
        }
        .testi-text {
          font-size: 0.92rem;
          color: rgba(255,255,255,0.6);
          line-height: 1.75;
          margin: 0 0 24px;
        }
        .testi-author {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }
        .testi-avatar {
          width: 44px; height: 44px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid rgba(0,167,62,0.3);
          flex-shrink: 0;
        }
        .testi-name {
          font-family: 'Instrument Serif', serif;
          font-weight: 400;
          font-size: 0.9rem;
          color: #fff;
        }
        .testi-role {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.35);
          margin-top: 2px;
        }
        .testi-stars {
          font-size: 0.7rem;
          color: #fbbf24;
          letter-spacing: 2px;
        }

        /* ── CTA ── */
        .cta-block {
          position: relative;
          border-radius: 28px;
          border: 1px solid rgba(0,167,62,0.2);
          background: rgba(0,167,62,0.04);
          backdrop-filter: blur(20px);
          padding: 64px 32px;
          text-align: center;
          overflow: hidden;
        }
        .cta-glow {
          position: absolute;
          top: 0; left: 50%;
          transform: translateX(-50%);
          width: 60%; height: 2px;
          background: linear-gradient(90deg, transparent, rgba(0,167,62,0.6), transparent);
        }
        .cta-content { position: relative; z-index: 2; }
        .cta-heading {
          font-family: 'Instrument Serif', serif;
          font-weight: 400;
          font-style: italic;
          font-size: clamp(1.5rem, 3.5vw, 2.4rem);
          color: #fff;
          margin: 0 0 16px;
          line-height: 1.15;
        }
        .cta-sub {
          font-size: clamp(0.9rem, 2vw, 1.05rem);
          color: rgba(255,255,255,0.45);
          line-height: 1.7;
          margin: 0 0 36px;
          font-weight: 300;
        }
        .cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: linear-gradient(135deg, #00a73e, #00c44a);
          color: #fff;
          font-family: 'Geist', sans-serif;
          font-weight: 500;
          font-size: 1rem;
          padding: 15px 32px;
          border-radius: 12px;
          text-decoration: none;
          position: relative;
          overflow: hidden;
          box-shadow: 0 0 0 1px rgba(0,167,62,0.5), 0 8px 32px rgba(0,167,62,0.3);
          transition: transform 0.2s, box-shadow 0.2s;
          margin-bottom: 20px;
        }
        .cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 0 1px rgba(0,167,62,0.7), 0 12px 40px rgba(0,167,62,0.45);
        }
        .cta-arrow { transition: transform 0.2s; }
        .cta-btn:hover .cta-arrow { transform: translateX(4px); }
        .cta-btn-shine {
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%);
          pointer-events: none;
        }
        .cta-note {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.3);
          margin: 0;
        }
      `}</style>
    </>
  );
};

export default HowItWorks;