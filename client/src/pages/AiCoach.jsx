import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFitness } from '../context/FitnessContext';
import Notification from '../components/Notification';
import {
  Sparkles,
  Zap,
  CheckCircle2,
  Clock,
  Dumbbell,
  Brain,
  RotateCw,
  ArrowRight,
  Flame,
  Info,
  ShieldCheck,
} from 'lucide-react';

export const AiCoach = () => {
  const { currentSuggestion, isGeneratingAi, aiError, generateAiWorkout, acceptAiWorkout } = useFitness();
  const navigate = useNavigate();

  const [focusArea, setFocusArea] = useState('Full Body');
  const [preferences, setPreferences] = useState('');
  const [notification, setNotification] = useState(null);
  const [accepting, setAccepting] = useState(false);

  const focusOptions = [
    { id: 'Full Body', label: '⚡ Full Body Power', desc: 'Balanced compound stimulus' },
    { id: 'Push Focus', label: '🛡️ Push (Chest/Shoulders/Triceps)', desc: 'Upper body pushing dynamics' },
    { id: 'Pull Focus', label: '🦅 Pull (Back/Biceps)', desc: 'Lat width & posterior chain' },
    { id: 'Legs & Core', label: '🦵 Legs & Core Hypertrophy', desc: 'Quad & hamstring focus' },
    { id: 'HIIT & Conditioning', label: '🔥 HIIT & Cardio Burn', desc: 'Metabolic rate acceleration' },
  ];

  const handleGenerate = async () => {
    setNotification(null);
    const result = await generateAiWorkout(focusArea, preferences);
    if (result.success) {
      setNotification({
        type: 'success',
        message: 'Personalized workout routine generated using your profile and recent training volume!',
      });
    }
  };

  const handleAccept = async () => {
    if (!currentSuggestion?.suggestionId) return;
    setAccepting(true);
    const result = await acceptAiWorkout(currentSuggestion.suggestionId);
    setAccepting(false);

    if (result.success) {
      navigate('/workouts');
    } else {
      setNotification({ type: 'error', message: result.error });
    }
  };

  const plan = currentSuggestion?.plan;

  return (
    <div className="dashboard-container" id="ai-coach-page">
      {/* Header Banner */}
      <div className="dashboard-hero" style={{ marginBottom: '2rem' }}>
        <div className="hero-content">
          <div>
            <div className="hero-badge" style={{ background: 'rgba(139, 92, 246, 0.15)', borderColor: 'rgba(139, 92, 246, 0.3)', color: 'var(--accent-purple)' }}>
              <Brain size={14} />
              <span>Adaptive AI Periodization Engine</span>
            </div>
            <h1 className="hero-title">FitPulse AI Coach</h1>
            <p className="hero-subtitle">
              Generates periodized, fatigue-managed workout routines calibrated to your recovery state, fitness goals, and previous volume history.
            </p>
          </div>
        </div>
      </div>

      <Notification type="error" message={aiError} />
      {notification && (
        <Notification type={notification.type} message={notification.message} onClose={() => setNotification(null)} />
      )}

      {/* Routine Generator Controls */}
      <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.35rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Zap size={20} color="var(--accent-primary)" />
          <span>Select Target Focus Area</span>
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem', marginBottom: '1.5rem' }}>
          {focusOptions.map((opt) => {
            const isSelected = focusArea === opt.id;
            return (
              <div
                key={opt.id}
                onClick={() => setFocusArea(opt.id)}
                style={{
                  padding: '1rem',
                  borderRadius: '0.85rem',
                  border: isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                  background: isSelected ? 'rgba(0, 245, 155, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <div style={{ fontWeight: 600, fontSize: '0.95rem', color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)', marginBottom: '0.2rem' }}>
                  {opt.label}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{opt.desc}</div>
              </div>
            );
          })}
        </div>

        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label className="form-label">
            <span>Special Focus or Constraints (Optional)</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>e.g. dumbbell-only, focus on lats, time limited to 30 min</span>
          </label>
          <input
            type="text"
            placeholder="Add any specific preferences for today's session..."
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '1rem' }}
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGeneratingAi}
          className="btn btn-primary btn-full"
          id="generate-routine-btn"
          style={{ padding: '0.95rem' }}
        >
          {isGeneratingAi ? (
            <>
              <div className="spinner"></div>
              <span>Synthesizing Optimal Routine with AI Coach...</span>
            </>
          ) : (
            <>
              <Sparkles size={18} />
              <span>Generate Today's Custom Routine</span>
            </>
          )}
        </button>
      </div>

      {/* Rendered Routine Card */}
      {plan && (
        <div className="glass-card" style={{ padding: '2rem', border: '1px solid rgba(0, 245, 155, 0.3)', boxShadow: 'var(--glow-shadow)', animation: 'fadeIn 0.3s ease-out' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <span style={{ background: 'rgba(0, 245, 155, 0.15)', color: 'var(--accent-primary)', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 700 }}>
                  Ready to Train
                </span>
                <span style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-secondary)', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.8rem' }}>
                  ⏱️ {plan.estimatedDurationMin || 45} mins
                </span>
                <span style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-secondary)', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.8rem', textTransform: 'capitalize' }}>
                  ⚡ {plan.difficulty}
                </span>
              </div>
              <h2 style={{ fontSize: '1.8rem', color: 'var(--text-primary)' }}>{plan.title}</h2>
              <p style={{ color: 'var(--text-secondary)', marginTop: '0.35rem', fontSize: '0.95rem' }}>
                💡 <em>{plan.rationale}</em>
              </p>
            </div>

            <button
              onClick={handleAccept}
              disabled={accepting}
              className="btn btn-primary"
              id="accept-workout-btn"
              style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}
            >
              {accepting ? (
                <>
                  <div className="spinner"></div>
                  <span>Logging Session...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  <span>Accept & Log to My Workouts</span>
                </>
              )}
            </button>
          </div>

          {/* Exercise Breakdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginTop: '1.5rem' }}>
            {plan.exercises?.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1.15rem 1.5rem',
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '0.85rem',
                  border: '1px solid var(--border-color)',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'rgba(0, 245, 155, 0.12)',
                      color: 'var(--accent-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                    }}
                  >
                    {idx + 1}
                  </div>
                  <div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {item.exerciseName}
                    </div>
                    {item.formTips && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                        🎯 Cue: {item.formTips}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.9rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                      {item.targetSets} sets × {item.targetReps > 0 ? `${item.targetReps} reps` : `${item.durationMin}m`}
                    </div>
                    {item.targetWeightKg > 0 && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--accent-secondary)', fontWeight: 600 }}>
                        Target: ~{item.targetWeightKg}kg
                      </div>
                    )}
                  </div>

                  <span
                    style={{
                      fontSize: '0.75rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      padding: '0.35rem 0.65rem',
                      borderRadius: '0.45rem',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    Rest {item.restSeconds}s
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AiCoach;
