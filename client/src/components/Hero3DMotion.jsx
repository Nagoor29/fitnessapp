import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Zap,
  Activity,
  Heart,
  Dumbbell,
  ShieldCheck,
  Flame,
  ArrowRight,
  TrendingUp,
  Rotate3d,
  Layers,
  Radio,
  Brain,
} from 'lucide-react';

export const Hero3DMotion = ({ onGetStarted }) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  // 3D Tilt State
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [autoMotion, setAutoMotion] = useState(true);
  const [scanPulse, setScanPulse] = useState(false);

  // Simulated Live Biometrics
  const [heartRate, setHeartRate] = useState(164);
  const [repCount, setRepCount] = useState(14);
  const [muscleLoad, setMuscleLoad] = useState(94);

  // Live telemetry pulse ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setHeartRate((prev) => 160 + Math.floor(Math.random() * 9));
      setMuscleLoad((prev) => 92 + Math.floor(Math.random() * 6));
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  // Ambient floating neon particles canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animationFrameId;

    const getDimensions = () => {
      const parent = canvas.parentElement;
      return {
        w: parent ? parent.offsetWidth || 1000 : 1000,
        h: parent ? parent.offsetHeight || 680 : 680,
      };
    };

    let { w: width, h: height } = getDimensions();
    canvas.width = width;
    canvas.height = height;

    const particles = Array.from({ length: 30 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.5 + 1,
      speedY: Math.random() * -0.5 - 0.2,
      speedX: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.6 + 0.2,
      hue: Math.random() > 0.5 ? 165 : 185, // Cyan & Emerald
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;

        if (p.y < 0) p.y = height;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 100%, 65%, ${p.opacity})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `hsla(${p.hue}, 100%, 50%, 0.8)`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      const dim = getDimensions();
      width = canvas.width = dim.w;
      height = canvas.height = dim.h;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Smooth mouse move 3D parallax tracking
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    setAutoMotion(false);
    setIsHovered(true);

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const deltaX = (x - centerX) / centerX;
    const deltaY = (y - centerY) / centerY;

    // Calculate rotation (-14 to +14 deg)
    setRotateX(-deltaY * 12);
    setRotateY(deltaX * 16);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setAutoMotion(true);
  };

  // Trigger holographic muscle scan
  const triggerScan = () => {
    setScanPulse(true);
    setRepCount((prev) => (prev >= 15 ? 1 : prev + 1));
    setTimeout(() => setScanPulse(false), 2400);
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        perspective: '1400px',
        margin: '0 auto 2.5rem',
      }}
    >
      {/* 3D Motion Container */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={autoMotion ? 'motion-3d-auto-drift' : ''}
        style={{
          position: 'relative',
          width: '100%',
          minHeight: '680px',
          borderRadius: '1.75rem',
          overflow: 'hidden',
          border: '1px solid rgba(0, 245, 155, 0.25)',
          background: 'radial-gradient(ellipse at center, #0a121e 0%, #05080e 100%)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 35px rgba(0, 245, 155, 0.15)',
          transformStyle: 'preserve-3d',
          transform: autoMotion
            ? undefined
            : `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transition: isHovered ? 'transform 0.08s ease-out' : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Layer 1: Background 3D Render Image with breathing depth */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url('/hero-3d.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 20%',
            opacity: 0.88,
            transform: 'translateZ(-30px) scale(1.08)',
            filter: 'contrast(1.08) brightness(0.92)',
            transition: 'transform 0.4s ease-out',
          }}
        />

        {/* Ambient Gradient Overlays */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at 75% 35%, rgba(0, 245, 155, 0.15) 0%, transparent 55%), radial-gradient(circle at 20% 80%, rgba(6, 182, 212, 0.2) 0%, transparent 60%), linear-gradient(to top, rgba(5, 8, 14, 0.95) 0%, rgba(5, 8, 14, 0.2) 60%, rgba(5, 8, 14, 0.6) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Layer 2: Particle Canvas */}
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 2,
          }}
        />

        {/* Layer 3: Dynamic Hologram Scanline */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 3,
            background: scanPulse
              ? 'linear-gradient(180deg, transparent 0%, rgba(0, 245, 155, 0.3) 50%, transparent 100%)'
              : 'linear-gradient(180deg, transparent 0%, rgba(0, 245, 155, 0.08) 50%, transparent 100%)',
            backgroundSize: '100% 120px',
            animation: scanPulse ? 'laserScanFast 1.2s ease-in-out infinite' : 'laserScanSlow 6s linear infinite',
          }}
        />

        {/* Layer 4: Interactive 3D Content & Glass Floating Cards */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            padding: '3rem 2.5rem',
            minHeight: '680px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Top Bar inside 3D Hero */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              transform: 'translateZ(60px)',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#04100c',
                  fontWeight: 900,
                  boxShadow: 'var(--glow-shadow)',
                }}
              >
                <Activity size={20} />
              </div>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>
                Fit<span style={{ color: 'var(--accent-primary)' }}>Pulse</span> AI
              </span>
            </div>

            {/* Interactive Mode Badges */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <button
                onClick={triggerScan}
                className="btn btn-sm"
                style={{
                  background: 'rgba(0, 245, 155, 0.15)',
                  border: '1px solid rgba(0, 245, 155, 0.4)',
                  color: 'var(--accent-primary)',
                  backdropFilter: 'blur(10px)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <Radio size={14} className={scanPulse ? 'spinner' : ''} />
                <span>{scanPulse ? 'Scanning Biometrics...' : 'Trigger Body Scan'}</span>
              </button>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)',
                  background: 'rgba(15, 23, 42, 0.75)',
                  padding: '0.4rem 0.75rem',
                  borderRadius: '9999px',
                  border: '1px solid var(--border-color)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <Rotate3d size={14} color="var(--accent-secondary)" />
                <span>Move mouse for 3D depth</span>
              </div>
            </div>
          </div>

          {/* Main Hero Split: Left Copy, Right Floating Holographic HUDs */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2.5rem',
              alignItems: 'center',
              margin: '2.5rem 0',
            }}
          >
            {/* Left Headline Column (translateZ 80px) */}
            <div style={{ transform: 'translateZ(80px)', maxWidth: '520px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  background: 'rgba(0, 245, 155, 0.12)',
                  border: '1px solid rgba(0, 245, 155, 0.3)',
                  color: 'var(--accent-primary)',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '9999px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  marginBottom: '1rem',
                  boxShadow: '0 0 15px rgba(0, 245, 155, 0.2)',
                }}
              >
                <Sparkles size={14} />
                <span>Next-Generation AI Fitness</span>
              </div>

              <h1
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(2.5rem, 5vw, 3.8rem)',
                  fontWeight: 900,
                  lineHeight: 1.05,
                  letterSpacing: '-0.03em',
                  marginBottom: '1.25rem',
                  color: '#ffffff',
                  textShadow: '0 4px 30px rgba(0, 0, 0, 0.9)',
                }}
              >
                AI Powered{' '}
                <span
                  style={{
                    background: 'linear-gradient(135deg, #00f59b 0%, #06b6d4 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: 'none',
                    filter: 'drop-shadow(0 0 25px rgba(0, 245, 155, 0.5))',
                  }}
                >
                  Fitness
                </span>
              </h1>

              <p
                style={{
                  fontSize: '1.1rem',
                  lineHeight: 1.6,
                  color: '#cbd5e1',
                  marginBottom: '2rem',
                  textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)',
                }}
              >
                Smarter training. Better results. Personalized workouts, real-time telemetry guidance,
                and progressive overload periodization engineered by Claude AI.
              </p>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link
                  to="/register"
                  className="btn btn-primary"
                  style={{
                    padding: '0.9rem 2rem',
                    fontSize: '1.05rem',
                    boxShadow: '0 0 30px rgba(0, 245, 155, 0.45)',
                  }}
                >
                  <span>Start Your Journey</span>
                  <ArrowRight size={20} />
                </Link>

                <Link
                  to="/ai-coach"
                  className="btn btn-secondary"
                  style={{
                    padding: '0.9rem 1.75rem',
                    fontSize: '1.05rem',
                    background: 'rgba(15, 23, 42, 0.75)',
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  <Brain size={18} color="var(--accent-purple)" />
                  <span>Try AI Coach</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Floating 3D Holographic HUD Cards (translateZ 120px to 160px) */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
                alignItems: 'flex-end',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Card 1: AI Coach Assistant Card (translateZ 150px) */}
              <div
                className="floating-card-motion-1"
                style={{
                  width: '100%',
                  maxWidth: '360px',
                  background: 'rgba(15, 23, 42, 0.75)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(0, 245, 155, 0.35)',
                  borderRadius: '1.25rem',
                  padding: '1.35rem',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.7), 0 0 25px rgba(0, 245, 155, 0.15)',
                  transform: 'translateZ(150px)',
                  transition: 'transform 0.3s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'rgba(0, 245, 155, 0.15)',
                      color: 'var(--accent-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>AI Coach</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Your personal fitness assistant</div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.55rem 0.75rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '0.6rem', border: '1px solid var(--border-color)' }}>
                    <Dumbbell size={16} color="var(--accent-primary)" />
                    <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Custom Workout Plan</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.55rem 0.75rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '0.6rem', border: '1px solid var(--border-color)' }}>
                    <Flame size={16} color="var(--accent-secondary)" />
                    <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Fatigue & Recovery Tuning</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.55rem 0.75rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '0.6rem', border: '1px solid var(--border-color)' }}>
                    <TrendingUp size={16} color="var(--accent-purple)" />
                    <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Overload Volume Tracking</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Real-Time Biometric Hologram HUD (translateZ 120px) */}
              <div
                className="floating-card-motion-2"
                style={{
                  width: '100%',
                  maxWidth: '360px',
                  background: 'rgba(8, 12, 20, 0.82)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(6, 182, 212, 0.35)',
                  borderRadius: '1.25rem',
                  padding: '1.25rem',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.7), 0 0 25px rgba(6, 182, 212, 0.15)',
                  transform: 'translateZ(120px)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-secondary)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>
                    <Zap size={14} />
                    <span>Muscle Engagement: {muscleLoad}%</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <ShieldCheck size={13} />
                    Form Optimal
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', marginBottom: '0.75rem' }}>
                  <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Heart Rate</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f87171', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Heart size={14} className="heart-pulse-anim" />
                      <span>{heartRate} <small style={{ fontSize: '0.65rem' }}>BPM</small></span>
                    </div>
                  </div>

                  <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Live Reps</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                      {repCount} / 15
                    </div>
                  </div>
                </div>

                {/* Animated Waveform SVG */}
                <div style={{ height: '38px', width: '100%', position: 'relative', overflow: 'hidden' }}>
                  <svg width="100%" height="38" viewBox="0 0 300 38" fill="none" preserveAspectRatio="none">
                    <path
                      d="M0 20 Q 30 5, 60 20 T 120 20 T 180 10 T 240 25 T 300 15"
                      stroke="var(--accent-secondary)"
                      strokeWidth="2.5"
                      fill="none"
                      style={{
                        strokeDasharray: '400',
                        animation: 'dashWave 3s linear infinite',
                      }}
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Feature Badges Bar (translateZ 70px) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '0.85rem',
              transform: 'translateZ(70px)',
              marginTop: 'auto',
            }}
          >
            {[
              { title: 'AI Personalization', icon: Brain },
              { title: 'Goal Based Plans', icon: Flame },
              { title: 'Volume Overload', icon: Dumbbell },
              { title: 'Real-Time Telemetry', icon: Activity },
            ].map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.65rem 0.9rem',
                    background: 'rgba(15, 23, 42, 0.65)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: '0.75rem',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <Icon size={16} color="var(--accent-primary)" />
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {feat.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero3DMotion;
