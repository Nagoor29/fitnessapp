import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFitness } from '../context/FitnessContext';
import Notification from '../components/Notification';
import {
  Flame,
  Dumbbell,
  HeartPulse,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Activity,
  ShieldAlert,
} from 'lucide-react';

export const Onboarding = () => {
  const { saveProfile } = useFitness();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    age: '26',
    heightCm: '178',
    weightKg: '75',
    fitnessGoal: 'muscle_gain',
    experienceLevel: 'intermediate',
    availableDaysPerWeek: 4,
    preferredSplit: 'push_pull_legs',
    injuriesOrLimitations: '',
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Live BMI calculator
  const liveBmi = useMemo(() => {
    const h = parseFloat(formData.heightCm);
    const w = parseFloat(formData.weightKg);
    if (h > 50 && w > 20) {
      const heightM = h / 100;
      return (w / (heightM * heightM)).toFixed(1);
    }
    return null;
  }, [formData.heightCm, formData.weightKg]);

  const goals = [
    { id: 'muscle_gain', title: 'Muscle Gain & Hypertrophy', desc: 'Build lean muscle and strength', icon: Dumbbell },
    { id: 'weight_loss', title: 'Fat Loss & Conditioning', desc: 'Caloric burn and body recomposition', icon: Flame },
    { id: 'endurance', title: 'Endurance & Stamina', desc: 'Aerobic threshold and capacity', icon: HeartPulse },
    { id: 'general_fitness', title: 'General Fitness & Health', desc: 'Balanced functional fitness', icon: Activity },
  ];

  const levels = [
    { id: 'beginner', title: 'Beginner', desc: '< 1 year training' },
    { id: 'intermediate', title: 'Intermediate', desc: '1 - 3 years consistent training' },
    { id: 'advanced', title: 'Advanced', desc: '3+ years structured lifting' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.age || !formData.heightCm || !formData.weightKg) {
      setError('Please provide your age, height, and weight.');
      return;
    }

    setSubmitting(true);
    const result = await saveProfile(formData);
    setSubmitting(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="onboarding-wrapper" style={{ width: '100%', maxWidth: '820px', margin: '1rem auto' }}>
      <div className="glass-card" style={{ padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="hero-badge" style={{ marginBottom: '0.75rem' }}>
            <Sparkles size={14} />
            <span>Personalize Your Experience</span>
          </div>
          <h1 style={{ fontSize: '2.1rem', marginBottom: '0.5rem' }}>Athlete Profile Setup</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            FitPulse AI personalizes your training periods, volume benchmarks, and routine suggestions using your biometric profile.
          </p>
        </div>

        <Notification type="error" message={error} onClose={() => setError('')} />

        <form onSubmit={handleSubmit} id="onboarding-form">
          {/* Step 1: Goal Selection */}
          <div style={{ marginBottom: '2rem' }}>
            <label className="form-label" style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              1. What is your primary fitness goal?
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.85rem' }}>
              {goals.map((g) => {
                const Icon = g.icon;
                const isSelected = formData.fitnessGoal === g.id;
                return (
                  <div
                    key={g.id}
                    onClick={() => setFormData({ ...formData, fitnessGoal: g.id })}
                    style={{
                      padding: '1.15rem',
                      borderRadius: '0.85rem',
                      border: isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                      background: isSelected ? 'rgba(0, 245, 155, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                      <Icon size={20} color={isSelected ? 'var(--accent-primary)' : 'var(--text-muted)'} />
                      <div style={{ fontWeight: 600, color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                        {g.title}
                      </div>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{g.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 2: Experience Level */}
          <div style={{ marginBottom: '2rem' }}>
            <label className="form-label" style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              2. Experience Level
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem' }}>
              {levels.map((lvl) => {
                const isSelected = formData.experienceLevel === lvl.id;
                return (
                  <div
                    key={lvl.id}
                    onClick={() => setFormData({ ...formData, experienceLevel: lvl.id })}
                    style={{
                      padding: '1rem',
                      borderRadius: '0.85rem',
                      border: isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                      background: isSelected ? 'rgba(0, 245, 155, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontWeight: 600, color: isSelected ? 'var(--accent-primary)' : 'var(--text-primary)', marginBottom: '0.2rem' }}>
                      {lvl.title}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{lvl.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 3: Biometric Stats */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <label className="form-label" style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                3. Physical Stats
              </label>
              {liveBmi && (
                <span className="token-pill" style={{ color: 'var(--accent-primary)' }}>
                  Estimated BMI: {liveBmi}
                </span>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="age-input">Age</label>
                <input
                  id="age-input"
                  type="number"
                  min="12"
                  max="120"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="form-input"
                  style={{ paddingLeft: '1rem' }}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="height-input">Height (cm)</label>
                <input
                  id="height-input"
                  type="number"
                  min="50"
                  max="280"
                  value={formData.heightCm}
                  onChange={(e) => setFormData({ ...formData, heightCm: e.target.value })}
                  className="form-input"
                  style={{ paddingLeft: '1rem' }}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="weight-input">Weight (kg)</label>
                <input
                  id="weight-input"
                  type="number"
                  min="20"
                  max="400"
                  step="0.5"
                  value={formData.weightKg}
                  onChange={(e) => setFormData({ ...formData, weightKg: e.target.value })}
                  className="form-input"
                  style={{ paddingLeft: '1rem' }}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="days-input">Days / Week</label>
                <select
                  id="days-input"
                  value={formData.availableDaysPerWeek}
                  onChange={(e) => setFormData({ ...formData, availableDaysPerWeek: Number(e.target.value) })}
                  className="form-input"
                  style={{ paddingLeft: '1rem' }}
                >
                  <option value={2}>2 days / week</option>
                  <option value={3}>3 days / week</option>
                  <option value={4}>4 days / week (Recommended)</option>
                  <option value={5}>5 days / week</option>
                  <option value={6}>6 days / week</option>
                  <option value={7}>7 days / week</option>
                </select>
              </div>
            </div>
          </div>

          {/* Step 4: Limitations / Notes */}
          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label" htmlFor="limitations-input">
              <span>Injuries or Limitations (Optional)</span>
              <ShieldAlert size={14} color="var(--text-muted)" />
            </label>
            <input
              id="limitations-input"
              type="text"
              placeholder="e.g. Lower back sensitivity, right shoulder impingement"
              value={formData.injuriesOrLimitations}
              onChange={(e) => setFormData({ ...formData, injuriesOrLimitations: e.target.value })}
              className="form-input"
              style={{ paddingLeft: '1rem' }}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            id="save-profile-btn"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <div className="spinner"></div>
                <span>Saving Profile...</span>
              </>
            ) : (
              <>
                <span>Save Profile & Enter Dashboard</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
