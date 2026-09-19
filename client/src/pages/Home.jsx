import React from 'react';
import { Link } from 'react-router-dom';
import Hero3DMotion from '../components/Hero3DMotion';
import {
  Brain,
  Flame,
  Dumbbell,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Zap,
  Activity,
  Layers,
  HeartPulse,
} from 'lucide-react';

export const Home = () => {
  return (
    <div style={{ width: '100%', maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
      {/* 3D Motion Hero Section */}
      <Hero3DMotion />

      {/* Feature Value Grid */}
      <div style={{ marginTop: '3.5rem', marginBottom: '4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div className="hero-badge" style={{ marginBottom: '0.75rem' }}>
            <Sparkles size={14} />
            <span>Engineered for Peak Performance</span>
          </div>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>
            Next-Gen AI Fitness Telemetry
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '620px', margin: '0 auto' }}>
            FitPulse AI combines sports science, real-time volume periodization, and Anthropic Claude AI
            to deliver elite athletic coaching.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <div className="glass-card preview-card">
            <div>
              <div className="preview-icon-badge" style={{ background: 'rgba(139, 92, 246, 0.15)', color: 'var(--accent-purple)' }}>
                <Brain size={24} />
              </div>
              <div className="preview-tag">Adaptive Intelligence</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>AI Workout Periodization</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Dynamically generated routines that adapt to your fatigue levels, recovery state, and training schedule.
              </p>
            </div>
            <div style={{ marginTop: '1.5rem' }}>
              <Link to="/ai-coach" style={{ color: 'var(--accent-purple)', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <span>Try AI Coach</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          <div className="glass-card preview-card">
            <div>
              <div className="preview-icon-badge" style={{ background: 'rgba(0, 245, 155, 0.15)', color: 'var(--accent-primary)' }}>
                <Dumbbell size={24} />
              </div>
              <div className="preview-tag">Progressive Overload</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Volume & 1RM Telemetry</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Multi-set tracking, automatic volume calculations (kg lifted), and interactive Recharts progression curves.
              </p>
            </div>
            <div style={{ marginTop: '1.5rem' }}>
              <Link to="/workouts" style={{ color: 'var(--accent-primary)', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <span>Explore Workouts</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          <div className="glass-card preview-card">
            <div>
              <div className="preview-icon-badge" style={{ background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-secondary)' }}>
                <Layers size={24} />
              </div>
              <div className="preview-tag">Knowledge Base</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Exercise Reference Library</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                34+ curated exercises with technique guides, targeted muscle groups, difficulty ratings, and execution cues.
              </p>
            </div>
            <div style={{ marginTop: '1.5rem' }}>
              <Link to="/exercises" style={{ color: 'var(--accent-secondary)', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <span>Browse Library</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Banner */}
      <div
        className="glass-card"
        style={{
          padding: '3rem 2rem',
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(0, 245, 155, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)',
          border: '1px solid rgba(0, 245, 155, 0.3)',
          boxShadow: 'var(--glow-shadow)',
          marginBottom: '4rem',
        }}
      >
        <h2 style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>
          Ready to Elevate Your Fitness?
        </h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '520px', margin: '0 auto 1.75rem', fontSize: '1.05rem' }}>
          Join FitPulse AI today. Start logging sessions, tracking overload volume, and generating custom AI routines.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/register" className="btn btn-primary" style={{ padding: '0.9rem 2.25rem', fontSize: '1.05rem' }}>
            <span>Create Free Account</span>
            <ArrowRight size={18} />
          </Link>
          <Link to="/login" className="btn btn-secondary" style={{ padding: '0.9rem 2rem', fontSize: '1.05rem' }}>
            <span>Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
