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
  Maximize2,
  Minimize2,
  ChevronDown,
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
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Simulated Live Biometrics
  const [heartRate, setHeartRate] = useState(164);
  const [repCount, setRepCount] = useState(14);
  const [muscleLoad, setMuscleLoad] = useState(94);

  // Escape key to exit fullscreen mode
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFullScreen) {
        setIsFullScreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullScreen]);

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
        w: parent ? parent.offsetWidth || window.innerWidth : window.innerWidth,
        h: parent ? parent.offsetHeight || window.innerHeight : window.innerHeight,
      };
    };

    let { w: width, h: height } = getDimensions();
    canvas.width = width;
    canvas.height = height;

    const particles = Array.from({ length: 45 }, () => ({
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
  }, [isFullScreen]);

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

    // Calculate rotation (-12 to +12 deg)
    setRotateX(-deltaY * 10);
    setRotateY(deltaX * 14);
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
      className={isFullScreen ? 'hero-3d-fullscreen-active' : ''}
      style={{
        position: isFullScreen ? 'fixed' : 'relative',
        inset: isFullScreen ? 0 : 'auto',
        width: '100%',
        minHeight: isFullScreen ? '100vh' : 'calc(100vh - 72px)',
        height: isFullScreen ? '100vh' : 'auto',
        zIndex: isFullScreen ? 99999 : 1,
        perspective: '1400px',
        margin: 0,
        overflow: 'hidden',
        background: '#040810',
      }}
    >
      {/* 3D Motion Container */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`hero-3d-inner ${autoMotion ? 'motion-3d-auto-drift' : ''}`}
        style={{
          position: 'relative',
          width: '100%',
          minHeight: isFullScreen ? '100vh' : 'calc(100vh - 72px)',
          height: isFullScreen ? '100vh' : 'auto',
          overflow: 'hidden',
          borderBottom: isFullScreen ? 'none' : '1px solid rgba(0, 245, 155, 0.25)',
          background: 'radial-gradient(ellipse at center, #0a1424 0%, #03060a 100%)',
          boxShadow: isFullScreen
            ? 'none'
            : '0 25px 60px -12px rgba(0, 0, 0, 0.9), 0 0 45px rgba(0, 245, 155, 0.15)',
          transformStyle: 'preserve-3d',
          transform: autoMotion
            ? undefined
            : `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transition: isHovered ? 'transform 0.08s ease-out' : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Layer 1: Background 3D Render Image fitting entire screen with breathing depth */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url('/hero-3d.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            opacity: 0.92,
            transform: 'translateZ(-40px) scale(1.12)',
            filter: 'contrast(1.08) brightness(0.95)',
            transition: 'transform 0.4s ease-out',
          }}
        />

        {/* Ambient Gradient Overlays for Cinematic Depth */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at 75% 35%, rgba(0, 245, 155, 0.18) 0%, transparent 60%), radial-gradient(circle at 20% 80%, rgba(6, 182, 212, 0.22) 0%, transparent 60%), linear-gradient(to top, rgba(3, 6, 12, 0.95) 0%, rgba(3, 6, 12, 0.25) 50%, rgba(3, 6, 12, 0.65) 100%)',
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
              ? 'linear-gradient(180deg, transparent 0%, rgba(0, 245, 155, 0.35) 50%, transparent 100%)'
              : 'linear-gradient(180deg, transparent 0%, rgba(0, 245, 155, 0.08) 50%, transparent 100%)',
            backgroundSize: '100% 140px',
            animation: scanPulse ? 'laserScanFast 1.2s ease-in-out infinite' : 'laserScanSlow 6s linear infinite',
          }}
        />

        {/* Layer 4: Interactive 3D Content & Glass Floating Cards */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            padding: '2.5rem clamp(1.5rem, 4vw, 4rem)',
            minHeight: isFullScreen ? '100vh' : 'calc(100vh - 72px)',
            maxWidth: '1600px',
            margin: '0 auto',
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
              marginBottom: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
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
                <Activity size={22} />
              </div>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.45rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>
                Fit<span style={{ color: 'var(--accent-primary)' }}>Pulse</span> AI
              </span>
            </div>

            {/* Interactive Mode Badges & Full Screen Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
              <button
                onClick={triggerScan}
                className="btn btn-sm"
                style={{
                  background: scanPulse ? 'rgba(0, 245, 155, 0.28)' : 'rgba(0, 245, 155, 0.15)',
                  border: '1px solid rgba(0, 245, 155, 0.45)',
                  color: 'var(--accent-primary)',
                  backdropFilter: 'blur(12px)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  cursor: 'pointer',
                  boxShadow: scanPulse ? '0 0 20px rgba(0, 245, 155, 0.4)' : 'none',
                  transition: 'all 0.2s ease',
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
                <span>Mouse 3D Parallax</span>
              </div>

              {/* Full Screen Mode Toggle Button */}
              <button
                onClick={() => setIsFullScreen(!isFullScreen)}
                className="btn btn-sm"
                style={{
                  background: isFullScreen ? 'rgba(0, 245, 155, 0.25)' : 'rgba(15, 23, 42, 0.85)',
                  border: '1px solid rgba(0, 245, 155, 0.4)',
                  color: isFullScreen ? '#ffffff' : 'var(--accent-primary)',
                  backdropFilter: 'blur(10px)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  cursor: 'pointer',
                  padding: '0.4rem 0.85rem',
                  borderRadius: '9999px',
                }}
                title={isFullScreen ? 'Exit Full Screen (ESC)' : 'Expand to Full Screen'}
              >
                {isFullScreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
                <span>{isFullScreen ? 'Exit Full Screen' : 'Full Screen'}</span>
              </button>
            </div>
          </div>

          {/* Main Hero Split: Left Copy, Right Floating Holographic HUDs */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '3rem',
              alignItems: 'center',
              margin: 'auto 0',
              padding: '1.5rem 0',
            }}
          >
            {/* Left Headline Column (translateZ 80px) */}
            <div style={{ transform: 'translateZ(80px)', maxWidth: '580px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  background: 'rgba(0, 245, 155, 0.12)',
                  border: '1px solid rgba(0, 245, 155, 0.35)',
                  color: 'var(--accent-primary)',
                  padding: '0.4rem 0.95rem',
                  borderRadius: '9999px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  marginBottom: '1.25rem',
                  boxShadow: '0 0 20px rgba(0, 245, 155, 0.25)',
                }}
              >
                <Sparkles size={14} />
                <span>Next-Generation AI Fitness</span>
              </div>

              <h1
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(2.8rem, 5.5vw, 4.2rem)',
                  fontWeight: 900,
                  lineHeight: 1.05,
                  letterSpacing: '-0.03em',
                  marginBottom: '1.35rem',
                  color: '#ffffff',
                  textShadow: '0 4px 30px rgba(0, 0, 0, 0.95)',
                }}
              >
                AI Powered{' '}
                <span
                  style={{
                    background: 'linear-gradient(135deg, #00f59b 0%, #06b6d4 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: 'none',
                    filter: 'drop-shadow(0 0 30px rgba(0, 245, 155, 0.55))',
                  }}
                >
                  Fitness
                </span>
              </h1>

              <p
                style={{
                  fontSize: '1.15rem',
                  lineHeight: 1.65,
                  color: '#cbd5e1',
                  marginBottom: '2.25rem',
                  textShadow: '0 2px 12px rgba(0, 0, 0, 0.9)',
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
                    padding: '1rem 2.25rem',
                    fontSize: '1.1rem',
                    boxShadow: '0 0 35px rgba(0, 245, 155, 0.5)',
                  }}
                >
                  <span>Start Your Journey</span>
                  <ArrowRight size={20} />
                </Link>

                <Link
                  to="/ai-coach"
                  className="btn btn-secondary"
                  style={{
                    padding: '1rem 2rem',
                    fontSize: '1.1rem',
                    background: 'rgba(15, 23, 42, 0.85)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                  }}
                >
                  <Brain size={20} color="var(--accent-purple)" />
                  <span>Try AI Coach</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Floating 3D Holographic HUD Cards (translateZ 120px to 160px) */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                alignItems: 'flex-end',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Card 1: AI Coach Assistant Card (translateZ 150px) */}
              <div
                className="floating-card-motion-1"
                style={{
                  width: '100%',
                  maxWidth: '380px',
                  background: 'rgba(15, 23, 42, 0.82)',
                  backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)',
                  border: '1px solid rgba(0, 245, 155, 0.4)',
                  borderRadius: '1.35rem',
                  padding: '1.5rem',
                  boxShadow: '0 25px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 245, 155, 0.2)',
                  transform: 'translateZ(150px)',
                  transition: 'transform 0.3s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.15rem' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: 'rgba(0, 245, 155, 0.2)',
                      color: 'var(--accent-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1rem', color: '#fff' }}>AI Coach</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Your personal fitness assistant</div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.65rem 0.85rem', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '0.65rem', border: '1px solid var(--border-color)' }}>
                    <Dumbbell size={18} color="var(--accent-primary)" />
                    <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>Custom Workout Plan</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.65rem 0.85rem', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '0.65rem', border: '1px solid var(--border-color)' }}>
                    <Flame size={18} color="var(--accent-secondary)" />
                    <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>Fatigue & Recovery Tuning</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.65rem 0.85rem', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '0.65rem', border: '1px solid var(--border-color)' }}>
                    <TrendingUp size={18} color="var(--accent-purple)" />
                    <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>Overload Volume Tracking</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Real-Time Biometric Hologram HUD (translateZ 120px) */}
              <div
                className="floating-card-motion-2"
                style={{
                  width: '100%',
                  maxWidth: '380px',
                  background: 'rgba(8, 14, 24, 0.88)',
                  backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)',
                  border: '1px solid rgba(6, 182, 212, 0.4)',
                  borderRadius: '1.35rem',
                  padding: '1.4rem',
                  boxShadow: '0 25px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(6, 182, 212, 0.2)',
                  transform: 'translateZ(120px)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.6rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--accent-secondary)', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase' }}>
                    <Zap size={15} />
                    <span>Muscle Engagement: {muscleLoad}%</span>
                  </div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--accent-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <ShieldCheck size={14} />
                    Form Optimal
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.85rem' }}>
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.6rem 0.85rem', borderRadius: '0.6rem', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Heart Rate</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f87171', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Heart size={16} className="heart-pulse-anim" />
                      <span>{heartRate} <small style={{ fontSize: '0.7rem' }}>BPM</small></span>
                    </div>
                  </div>

                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.6rem 0.85rem', borderRadius: '0.6rem', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Live Reps</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                      {repCount} / 15
                    </div>
                  </div>
                </div>

                {/* Animated Waveform SVG */}
                <div style={{ height: '42px', width: '100%', position: 'relative', overflow: 'hidden' }}>
                  <svg width="100%" height="42" viewBox="0 0 300 42" fill="none" preserveAspectRatio="none">
                    <path
                      d="M0 21 Q 30 5, 60 21 T 120 21 T 180 8 T 240 28 T 300 15"
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
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '1rem',
              transform: 'translateZ(70px)',
              marginTop: 'auto',
              paddingTop: '1rem',
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
                    gap: '0.65rem',
                    padding: '0.75rem 1rem',
                    background: 'rgba(15, 23, 42, 0.75)',
                    backdropFilter: 'blur(16px)',
                    borderRadius: '0.85rem',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <Icon size={18} color="var(--accent-primary)" />
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
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
