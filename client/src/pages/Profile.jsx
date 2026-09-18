import React, { useState, useEffect } from 'react';
import { useFitness } from '../context/FitnessContext';
import { useAuth } from '../context/AuthContext';
import Notification from '../components/Notification';
import {
  User,
  Activity,
  Calendar,
  Sparkles,
  ShieldCheck,
  Dumbbell,
  Flame,
  Scale,
  Check,
} from 'lucide-react';

export const Profile = () => {
  const { user } = useAuth();
  const { profile, saveProfile } = useFitness();

  const [formData, setFormData] = useState({
    age: '',
    heightCm: '',
    weightKg: '',
    fitnessGoal: 'muscle_gain',
    experienceLevel: 'intermediate',
    availableDaysPerWeek: 4,
    preferredSplit: 'push_pull_legs',
    injuriesOrLimitations: '',
  });

  const [notification, setNotification] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        age: profile.age || '',
        heightCm: profile.heightCm || '',
        weightKg: profile.weightKg || '',
        fitnessGoal: profile.fitnessGoal || 'muscle_gain',
        experienceLevel: profile.experienceLevel || 'intermediate',
        availableDaysPerWeek: profile.availableDaysPerWeek || 4,
        preferredSplit: profile.preferredSplit || 'push_pull_legs',
        injuriesOrLimitations: profile.injuriesOrLimitations || '',
      });
    }
  }, [profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setNotification(null);

    const result = await saveProfile(formData);
    setSubmitting(false);

    if (result.success) {
      setNotification({ type: 'success', message: 'Fitness profile updated successfully!' });
    } else {
      setNotification({ type: 'error', message: result.error });
    }
  };

  const getBmiCategory = (bmi) => {
    if (!bmi) return '';
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 24.9) return 'Normal / Optimal';
    if (bmi < 29.9) return 'Overweight';
    return 'High Mass Index';
  };

  return (
    <div className="dashboard-container" id="profile-page">
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Athlete Profile & Settings</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Manage your biometric stats, target objectives, and AI coach training parameters.
        </p>
      </div>

      {notification && (
        <Notification type={notification.type} message={notification.message} onClose={() => setNotification(null)} />
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Profile Summary Card */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: 800,
                color: '#04100c',
              }}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem' }}>{user?.name}</h2>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{user?.email}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="inspector-item">
              <div className="inspector-item-label">Calculated BMI</div>
              <div className="inspector-item-val" style={{ color: 'var(--accent-primary)' }}>
                {profile?.bmi || 'N/A'}{' '}
                {profile?.bmi && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({getBmiCategory(profile.bmi)})</span>}
              </div>
            </div>

            <div className="inspector-item">
              <div className="inspector-item-label">Training Days</div>
              <div className="inspector-item-val">{profile?.availableDaysPerWeek || 4} days / wk</div>
            </div>

            <div className="inspector-item">
              <div className="inspector-item-label">Experience</div>
              <div className="inspector-item-val" style={{ textTransform: 'capitalize' }}>
                {profile?.experienceLevel || 'Intermediate'}
              </div>
            </div>

            <div className="inspector-item">
              <div className="inspector-item-label">Primary Goal</div>
              <div className="inspector-item-val" style={{ textTransform: 'capitalize' }}>
                {profile?.fitnessGoal?.replace('_', ' ') || 'Muscle Gain'}
              </div>
            </div>
          </div>

          <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '0.75rem', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-purple)', fontWeight: 600, marginBottom: '0.35rem' }}>
              <Sparkles size={16} />
              <span>AI Adaptation Active</span>
            </div>
            <p style={{ color: 'var(--text-secondary)' }}>
              Your workouts and progressive overload recommendations adapt based on these parameters and your logged sessions.
            </p>
          </div>
        </div>

        {/* Update Form */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>Update Biometrics</h3>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Age</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="form-input"
                  style={{ paddingLeft: '1rem' }}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Training Days / Wk</label>
                <input
                  type="number"
                  min="1"
                  max="7"
                  value={formData.availableDaysPerWeek}
                  onChange={(e) => setFormData({ ...formData, availableDaysPerWeek: e.target.value })}
                  className="form-input"
                  style={{ paddingLeft: '1rem' }}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Height (cm)</label>
                <input
                  type="number"
                  value={formData.heightCm}
                  onChange={(e) => setFormData({ ...formData, heightCm: e.target.value })}
                  className="form-input"
                  style={{ paddingLeft: '1rem' }}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Weight (kg)</label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.weightKg}
                  onChange={(e) => setFormData({ ...formData, weightKg: e.target.value })}
                  className="form-input"
                  style={{ paddingLeft: '1rem' }}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Fitness Goal</label>
                <select
                  value={formData.fitnessGoal}
                  onChange={(e) => setFormData({ ...formData, fitnessGoal: e.target.value })}
                  className="form-input"
                  style={{ paddingLeft: '1rem' }}
                >
                  <option value="muscle_gain">Muscle Gain</option>
                  <option value="weight_loss">Weight Loss</option>
                  <option value="endurance">Endurance</option>
                  <option value="general_fitness">General Fitness</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Experience Level</label>
                <select
                  value={formData.experienceLevel}
                  onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                  className="form-input"
                  style={{ paddingLeft: '1rem' }}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Injuries or Limitations</label>
              <input
                type="text"
                value={formData.injuriesOrLimitations}
                onChange={(e) => setFormData({ ...formData, injuriesOrLimitations: e.target.value })}
                placeholder="e.g. Mild lower back sensitivity"
                className="form-input"
                style={{ paddingLeft: '1rem' }}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={submitting}>
              {submitting ? 'Updating...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
