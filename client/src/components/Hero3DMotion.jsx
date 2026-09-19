import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
  Layers,
  Radio,
  Brain,
  LogIn,
  UserPlus,
  LayoutDashboard,
  LogOut,
  Target,
  Gauge,
} from 'lucide-react';

export const Hero3DMotion = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  // Interaction State (Stable, No Tilting)
  const [scanPulse, setScanPulse] = useState(false);

  // Active Interactive Simulation Mode: 'hypertrophy' | 'metabolic' | 'biometric'
  const [activeMode, setActiveMode] = useState('hypertrophy');

  // Mode-based Dynamic Telemetry Data
  const modeData = {
    hypertrophy: {
      name: 'Hypertrophy Overload',
      heartRateBase: 158,
      repTarget: 12,
      muscleLoad: 94,
      calorieBurn: '580 kcal/hr',
      formScore: '98.4%',
      targetMuscle: 'Pectoralis & Anterior Deltoid',
      accentColor: 'var(--accent-primary)',
    },
    metabolic: {
      name: 'HIIT Metabolic Burn',
      heartRateBase: 176,
      repTarget: 20,
      muscleLoad: 88,
      calorieBurn: '740 kcal/hr',
      formScore: '96.8%',
      targetMuscle: 'Full Body & Core Matrix',
      accentColor: 'var(--accent-secondary)',
    },
    biometric: {
      name: 'AI Periodization Scan',
      heartRateBase: 142,
      repTarget: 8,
      muscleLoad: 96,
      calorieBurn: '490 kcal/hr',
      formScore: '99.2%',
      targetMuscle: 'Posterior Chain & Lats',
      accentColor: 'var(--accent-purple)',
    },
  };

  const currentMode = modeData[activeMode];

  // Simulated Live Biometrics with Ticker
  const [heartRate, setHeartRate] = useState(currentMode.heartRateBase);
  const [repCount, setRepCount] = useState(10);
  const [muscleLoad, setMuscleLoad] = useState(currentMode.muscleLoad);

  // Live telemetry pulse ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setHeartRate(currentMode.heartRateBase + Math.floor(Math.random() * 8) - 3);
      setMuscleLoad(currentMode.muscleLoad + Math.floor(Math.random() * 5) - 2);
    }, 1600);
    return () => clearInterval(interval);
  }, [activeMode, currentMode]);

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
      speedY: Math.random() * -0.6 - 0.2,
      speedX: (Math.random() - 0.5) * 0.35,
      opacity: Math.random() * 0.65 + 0.25,
      hue: Math.random() > 0.5 ? 165 : 188, // Emerald & Cyan
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
        ctx.shadowBlur = 12;
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

  // Trigger holographic muscle scan
  const triggerScan = () => {
    setScanPulse(true);
    setRepCount((prev) => (prev >= currentMode.repTarget ? 1 : prev + 1));
    setTimeout(() => setScanPulse(false), 2400);
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        height: '100vh',
        margin: 0,
        overflow: 'hidden',
        background: '#03060c',
      }}
    >
      {/* 3D Motion Stage Container (Completely Stable, Zero Tilt) */}
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflow: 'hidden',
          background: 'radial-gradient(ellipse at center, #091220 0%, #020408 100%)',
        }}
      >
        {/* Layer 1: Fullscreen 3D Background Image fitting entire screen */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url('/hero-3d.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            opacity: 0.94,
            filter: 'contrast(1.1) brightness(0.95)',
          }}
        />

        {/* Ambient Holographic Radial Overlays for Cinematic Depth */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at 75% 35%, rgba(0, 245, 155, 0.2) 0%, transparent 60%), radial-gradient(circle at 20% 80%, rgba(6, 182, 212, 0.22) 0%, transparent 60%), linear-gradient(to top, rgba(2, 4, 8, 0.95) 0%, rgba(2, 4, 8, 0.25) 50%, rgba(2, 4, 8, 0.75) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Layer 1.5: Cybernetic Holographic Target Reticle & Radar Pulse */}
        <div
          style={{
            position: 'absolute',
            top: '46%',
            left: '52%',
            width: '460px',
            height: '460px',
            pointerEvents: 'none',
            opacity: 0.75,
          }}
        >
          {/* Outer Rotating Cyber Ring */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '420px',
              height: '420px',
              borderRadius: '50%',
              border: '2px dashed rgba(0, 245, 155, 0.4)',
              animation: 'cyberRotate 24s linear infinite',
            }}
          />

          {/* Inner Counter-Rotating Ring */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '320px',
              height: '320px',
              borderRadius: '50%',
              border: '1px dotted rgba(6, 182, 212, 0.5)',
              animation: 'cyberRotateReverse 18s linear infinite',
            }}
          />

          {/* Radar Pulse Expanding Wave */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '280px',
              height: '280px',
              borderRadius: '50%',
              border: '1px solid rgba(0, 245, 155, 0.6)',
              boxShadow: '0 0 30px rgba(0, 245, 155, 0.3)',
              animation: 'radarPulse 3s ease-out infinite',
            }}
          />
        </div>

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
              ? 'linear-gradient(180deg, transparent 0%, rgba(0, 245, 155, 0.45) 50%, transparent 100%)'
              : 'linear-gradient(180deg, transparent 0%, rgba(0, 245, 155, 0.08) 50%, transparent 100%)',
            backgroundSize: '100% 160px',
            animation: scanPulse ? 'laserScanFast 1.2s ease-in-out infinite' : 'laserScanSlow 6s linear infinite',
          }}
        />

        {/* Layer 4: Interactive HUD & Content */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            padding: '1.5rem clamp(1.5rem, 4vw, 4rem)',
            width: '100%',
            maxWidth: '1650px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
            minHeight: '100vh',
          }}
        >
          {/* ================= TOP HUD ACTION BAR ================= */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1.25rem',
              padding: '0.85rem 1.4rem',
              background: 'rgba(8, 14, 26, 0.8)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              borderRadius: '1.25rem',
              border: '1px solid rgba(0, 245, 155, 0.25)',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6)',
            }}
          >
            {/* Brand Logo */}
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
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
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.45rem', fontWeight: 900, letterSpacing: '-0.02em', color: '#fff' }}>
                Fit<span style={{ color: 'var(--accent-primary)' }}>Pulse</span> AI
              </span>
            </Link>

            {/* Middle Nav Links */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
              <Link
                to="/ai-coach"
                style={{
                  color: 'var(--text-secondary)',
                  textDecoration: 'none',
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'color 0.2s ease',
                }}
              >
                <Brain size={16} color="var(--accent-purple)" />
                <span>AI Coach</span>
              </Link>

              <Link
                to="/workouts"
                style={{
                  color: 'var(--text-secondary)',
                  textDecoration: 'none',
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'color 0.2s ease',
                }}
              >
                <Dumbbell size={16} color="var(--accent-primary)" />
                <span>Workouts</span>
              </Link>

              <Link
                to="/exercises"
                style={{
                  color: 'var(--text-secondary)',
                  textDecoration: 'none',
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'color 0.2s ease',
                }}
              >
                <Layers size={16} color="var(--accent-secondary)" />
                <span>Exercises</span>
              </Link>
            </div>

            {/* Right Action & Auth Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              {/* Trigger Body Scan Button */}
              <button
                onClick={triggerScan}
                className="btn btn-sm"
                style={{
                  background: scanPulse ? 'rgba(0, 245, 155, 0.3)' : 'rgba(0, 245, 155, 0.15)',
                  border: '1px solid rgba(0, 245, 155, 0.45)',
                  color: 'var(--accent-primary)',
                  backdropFilter: 'blur(10px)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  cursor: 'pointer',
                  padding: '0.45rem 0.95rem',
                  borderRadius: '0.75rem',
                  boxShadow: scanPulse ? '0 0 25px rgba(0, 245, 155, 0.5)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                <Radio size={14} className={scanPulse ? 'spinner' : ''} />
                <span>{scanPulse ? 'Scanning Biometrics...' : 'Trigger Body Scan'}</span>
              </button>

              {/* Login & Register or Dashboard Actions */}
              {isAuthenticated ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <Link
                    to="/dashboard"
                    className="btn btn-primary btn-sm"
                    style={{
                      padding: '0.45rem 1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      borderRadius: '0.75rem',
                    }}
                  >
                    <LayoutDashboard size={15} />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="btn btn-secondary btn-sm"
                    style={{
                      padding: '0.45rem 0.75rem',
                      background: 'rgba(239, 68, 68, 0.15)',
                      border: '1px solid rgba(239, 68, 68, 0.35)',
                      color: '#f87171',
                      borderRadius: '0.75rem',
                      cursor: 'pointer',
                    }}
                    title="Logout"
                  >
                    <LogOut size={15} />
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <Link
                    to="/login"
                    className="btn btn-secondary btn-sm"
                    style={{
                      padding: '0.45rem 1rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      borderRadius: '0.75rem',
                      textDecoration: 'none',
                    }}
                  >
                    <LogIn size={15} />
                    <span>Sign In</span>
                  </Link>

                  <Link
                    to="/register"
                    className="btn btn-primary btn-sm"
                    style={{
                      padding: '0.45rem 1.15rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      borderRadius: '0.75rem',
                      boxShadow: '0 0 25px rgba(0, 245, 155, 0.45)',
                      textDecoration: 'none',
                    }}
                  >
                    <UserPlus size={15} />
                    <span>Register Free</span>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* ================= MAIN HERO BODY ================= */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '3.5rem',
              alignItems: 'center',
              margin: 'auto 0',
              padding: '2.5rem 0',
            }}
          >
            {/* Left Column: Headline, Interactive Mode Selector & CTAs */}
            <div style={{ maxWidth: '620px' }}>
              {/* Telemetry Tag Badge */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'rgba(0, 245, 155, 0.12)',
                  border: '1px solid rgba(0, 245, 155, 0.35)',
                  color: 'var(--accent-primary)',
                  padding: '0.4rem 1rem',
                  borderRadius: '9999px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  marginBottom: '1.25rem',
                  boxShadow: '0 0 20px rgba(0, 245, 155, 0.25)',
                }}
              >
                <Sparkles size={15} />
                <span>Next-Generation AI Fitness Matrix</span>
              </div>

              {/* Main Headline */}
              <h1
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(2.8rem, 5.8vw, 4.4rem)',
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
                    filter: 'drop-shadow(0 0 35px rgba(0, 245, 155, 0.6))',
                  }}
                >
                  Fitness
                </span>
              </h1>

              {/* Description */}
              <p
                style={{
                  fontSize: '1.15rem',
                  lineHeight: 1.65,
                  color: '#cbd5e1',
                  marginBottom: '1.75rem',
                  textShadow: '0 2px 12px rgba(0, 0, 0, 0.9)',
                }}
              >
                Smarter training. Better results. Personalized workouts, real-time telemetry guidance,
                and progressive overload periodization engineered by Claude AI.
              </p>

              {/* Interactive Training Mode Pills */}
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.65rem', fontWeight: 700 }}>
                  Select Live Biometric Simulation Mode:
                </div>
                <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                  {[
                    { id: 'hypertrophy', label: '⚡ Hypertrophy', icon: Dumbbell },
                    { id: 'metabolic', label: '🔥 HIIT Burn', icon: Flame },
                    { id: 'biometric', label: '🧠 AI Periodization', icon: Brain },
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => setActiveMode(mode.id)}
                      style={{
                        padding: '0.5rem 0.95rem',
                        borderRadius: '0.75rem',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        background: activeMode === mode.id ? 'rgba(0, 245, 155, 0.25)' : 'rgba(15, 23, 42, 0.75)',
                        border: activeMode === mode.id ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
                        color: activeMode === mode.id ? '#ffffff' : 'var(--text-secondary)',
                        boxShadow: activeMode === mode.id ? '0 0 20px rgba(0, 245, 155, 0.35)' : 'none',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <span>{mode.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons: Register / Login / AI Coach */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link
                  to={isAuthenticated ? '/dashboard' : '/register'}
                  className="btn btn-primary"
                  style={{
                    padding: '1rem 2.25rem',
                    fontSize: '1.1rem',
                    boxShadow: '0 0 35px rgba(0, 245, 155, 0.5)',
                  }}
                >
                  <span>{isAuthenticated ? 'Go to Dashboard' : 'Start Your Journey'}</span>
                  <ArrowRight size={20} />
                </Link>

                {!isAuthenticated && (
                  <Link
                    to="/login"
                    className="btn btn-secondary"
                    style={{
                      padding: '1rem 1.85rem',
                      fontSize: '1.1rem',
                      background: 'rgba(15, 23, 42, 0.85)',
                      backdropFilter: 'blur(16px)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                    }}
                  >
                    <LogIn size={18} />
                    <span>Sign In</span>
                  </Link>
                )}

                <Link
                  to="/ai-coach"
                  className="btn btn-secondary"
                  style={{
                    padding: '1rem 1.85rem',
                    fontSize: '1.1rem',
                    background: 'rgba(15, 23, 42, 0.85)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    color: 'var(--accent-purple)',
                  }}
                >
                  <Brain size={18} />
                  <span>Try AI Coach</span>
                </Link>
              </div>
            </div>

            {/* Right Column: HUD Cards & Biometric Telemetry */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                alignItems: 'flex-end',
              }}
            >
              {/* Floating Live Calorie & Muscle Group HUD Pill */}
              <div
                className="float-tag-anim"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  background: 'rgba(15, 23, 42, 0.85)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(0, 245, 155, 0.4)',
                  padding: '0.65rem 1.15rem',
                  borderRadius: '9999px',
                  boxShadow: '0 15px 35px rgba(0, 0, 0, 0.7), 0 0 20px rgba(0, 245, 155, 0.25)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-primary)', fontSize: '0.82rem', fontWeight: 800 }}>
                  <Target size={15} />
                  <span>{currentMode.targetMuscle}</span>
                </div>
                <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--border-color)' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--accent-secondary)', fontSize: '0.82rem', fontWeight: 800 }}>
                  <Flame size={15} />
                  <span>{currentMode.calorieBurn}</span>
                </div>
              </div>

              {/* Card 1: AI Coach Assistant Card */}
              <div
                className="floating-card-motion-1"
                style={{
                  width: '100%',
                  maxWidth: '390px',
                  background: 'rgba(15, 23, 42, 0.85)',
                  backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)',
                  border: '1px solid rgba(0, 245, 155, 0.4)',
                  borderRadius: '1.4rem',
                  padding: '1.5rem',
                  boxShadow: '0 25px 50px rgba(0, 0, 0, 0.85), 0 0 30px rgba(0, 245, 155, 0.2)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.15rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
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
                      <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#fff' }}>AI Coach</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Adaptive Periodization Active</div>
                    </div>
                  </div>

                  {/* Equalizer Wave Micro-Bars */}
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '28px' }}>
                    <div style={{ width: '3px', background: 'var(--accent-primary)', borderRadius: '2px', animation: 'eqBounce1 1.2s ease-in-out infinite' }} />
                    <div style={{ width: '3px', background: 'var(--accent-secondary)', borderRadius: '2px', animation: 'eqBounce2 0.9s ease-in-out infinite' }} />
                    <div style={{ width: '3px', background: 'var(--accent-purple)', borderRadius: '2px', animation: 'eqBounce3 1.4s ease-in-out infinite' }} />
                    <div style={{ width: '3px', background: 'var(--accent-primary)', borderRadius: '2px', animation: 'eqBounce4 1.1s ease-in-out infinite' }} />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.65rem 0.85rem', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '0.65rem', border: '1px solid var(--border-color)' }}>
                    <Dumbbell size={18} color="var(--accent-primary)" />
                    <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>Mode: {currentMode.name}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.65rem 0.85rem', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '0.65rem', border: '1px solid var(--border-color)' }}>
                    <Gauge size={18} color="var(--accent-secondary)" />
                    <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>Form Accuracy: {currentMode.formScore}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.65rem 0.85rem', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '0.65rem', border: '1px solid var(--border-color)' }}>
                    <TrendingUp size={18} color="var(--accent-purple)" />
                    <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>Progressive Overload Tracking</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Real-Time Biometric Hologram HUD */}
              <div
                className="floating-card-motion-2"
                style={{
                  width: '100%',
                  maxWidth: '390px',
                  background: 'rgba(8, 14, 26, 0.9)',
                  backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)',
                  border: '1px solid rgba(6, 182, 212, 0.4)',
                  borderRadius: '1.4rem',
                  padding: '1.4rem',
                  boxShadow: '0 25px 50px rgba(0, 0, 0, 0.85), 0 0 30px rgba(6, 182, 212, 0.2)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.6rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--accent-secondary)', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase' }}>
                    <Zap size={15} />
                    <span>Muscle Load: {muscleLoad}%</span>
                  </div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--accent-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <ShieldCheck size={14} />
                    Form Optimal
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.85rem' }}>
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.6rem 0.85rem', borderRadius: '0.65rem', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Heart Rate</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f87171', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Heart size={16} className="heart-pulse-anim" />
                      <span>{heartRate} <small style={{ fontSize: '0.7rem' }}>BPM</small></span>
                    </div>
                  </div>

                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.6rem 0.85rem', borderRadius: '0.65rem', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Live Reps</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                      {repCount} / {currentMode.repTarget}
                    </div>
                  </div>
                </div>

                {/* Animated Waveform SVG */}
                <div style={{ height: '44px', width: '100%', position: 'relative', overflow: 'hidden' }}>
                  <svg width="100%" height="44" viewBox="0 0 300 44" fill="none" preserveAspectRatio="none">
                    <path
                      d="M0 22 Q 30 5, 60 22 T 120 22 T 180 8 T 240 30 T 300 15"
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

          {/* ================= BOTTOM FEATURE PILLARS ================= */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
              gap: '1rem',
              marginTop: 'auto',
              paddingTop: '1.5rem',
              paddingBottom: '1rem',
            }}
          >
            {[
              { title: 'AI Personalization', icon: Brain, subtitle: 'Claude 3.5 Sonnet' },
              { title: 'Goal Based Plans', icon: Flame, subtitle: 'Fatigue & Volume' },
              { title: 'Volume Overload', icon: Dumbbell, subtitle: 'Automatic 1RM' },
              { title: 'Real-Time Telemetry', icon: Activity, subtitle: 'Biometric HUD' },
            ].map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.85rem 1.15rem',
                    background: 'rgba(15, 23, 42, 0.8)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '1rem',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: 'rgba(0, 245, 155, 0.12)',
                      color: 'var(--accent-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {feat.title}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {feat.subtitle}
                    </div>
                  </div>
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
