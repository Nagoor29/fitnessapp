import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFitness } from '../context/FitnessContext';
import Notification from '../components/Notification';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  Sparkles,
  Flame,
  Dumbbell,
  TrendingUp,
  Brain,
  Calendar,
  Clock,
  Plus,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export const Dashboard = () => {
  const { user } = useAuth();
  const { profile, workouts, workoutStats, loadingStats } = useFitness();
  const navigate = useNavigate();

  // Custom Dark Tooltip for Recharts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid var(--border-color)',
            padding: '0.65rem 0.9rem',
            borderRadius: '0.6rem',
            boxShadow: 'var(--card-shadow)',
          }}
        >
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>
            {label}
          </div>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
            {payload[0].value.toLocaleString()} {payload[0].name === 'volumeKg' ? 'kg' : 'workouts'}
          </div>
        </div>
      );
    }
    return null;
  };

  const frequencyData = workoutStats?.weeklyFrequency || [
    { week: '3w ago', workouts: 0 },
    { week: '2w ago', workouts: 0 },
    { week: '1w ago', workouts: 0 },
    { week: 'This Week', workouts: 0 },
  ];

  const volumeData = workoutStats?.volumeProgression || [];

  return (
    <div className="dashboard-container" id="dashboard-page">
      {/* Hero Welcome Banner */}
      <div className="dashboard-hero">
        <div className="hero-content">
          <div>
            <div className="hero-badge">
              <Sparkles size={14} />
              <span>AI Fitness Telemetry Active</span>
            </div>
            <h1 className="hero-title">Welcome back, {user?.name || 'Athlete'}</h1>
            <p className="hero-subtitle">
              Goal: <strong style={{ color: 'var(--accent-primary)', textTransform: 'capitalize' }}>{profile?.fitnessGoal?.replace('_', ' ') || 'General Fitness'}</strong> • Training split: <span style={{ textTransform: 'capitalize' }}>{profile?.preferredSplit?.replace(/_/g, ' ') || 'Full Body'}</span>
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/workouts" className="btn btn-primary" id="dash-log-btn">
              <Plus size={18} />
              <span>Log Workout</span>
            </Link>
            <Link to="/ai-coach" className="btn btn-secondary" id="dash-ai-btn">
              <Brain size={18} color="var(--accent-purple)" />
              <span>AI Coach</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metric KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.12)', color: '#f87171', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Flame size={26} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Current Streak
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {workoutStats?.currentStreak || 0} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-secondary)' }}>days</span>
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(0, 245, 155, 0.12)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Dumbbell size={26} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Total Workouts
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {workoutStats?.totalWorkouts || 0} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-secondary)' }}>sessions</span>
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.12)', color: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp size={26} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Total Volume
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {(workoutStats?.totalVolumeKg || 0).toLocaleString()} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-secondary)' }}>kg</span>
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.12)', color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Calendar size={26} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Last 30 Days
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {workoutStats?.workoutsLast30Days || 0} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-secondary)' }}>sessions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Weekly Frequency Chart */}
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem' }}>Weekly Workout Frequency</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Last 4 Weeks</span>
          </div>

          <div style={{ height: '220px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={frequencyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
                <XAxis dataKey="week" stroke="var(--text-muted)" fontSize={12} tickLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} allowDecimals={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="workouts" fill="var(--accent-primary)" radius={[6, 6, 0, 0]} barSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Volume Progression Area Chart */}
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem' }}>Volume Progression (kg)</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-secondary)' }}>Overload Trend</span>
          </div>

          <div style={{ height: '220px', width: '100%' }}>
            {volumeData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={volumeData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorVol" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--accent-secondary)" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="var(--accent-secondary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
                  <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="volumeKg"
                    stroke="var(--accent-secondary)"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorVol)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <TrendingUp size={32} style={{ marginBottom: '0.5rem', opacity: 0.4 }} />
                <span>Log workouts with weights to visualize volume trends</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Quick Coach Banner */}
      <div
        className="glass-card"
        style={{
          padding: '2rem',
          marginBottom: '2rem',
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(6, 182, 212, 0.04) 100%)',
          border: '1px solid rgba(139, 92, 246, 0.25)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-purple)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              <Brain size={16} />
              <span>Next Training Session Ready</span>
            </div>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '0.35rem' }}>Need a Periodized Workout Today?</h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '560px' }}>
              FitPulse AI analyzes your recent training volume and designs a customized workout matching your schedule and fatigue levels.
            </p>
          </div>

          <Link to="/ai-coach" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, var(--accent-purple), #7c3aed)', color: 'white', boxShadow: '0 4px 14px var(--accent-purple-glow)' }}>
            <Sparkles size={18} />
            <span>Generate Today's Routine</span>
          </Link>
        </div>
      </div>

      {/* Recent Workouts List */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.25rem' }}>Recent Workouts</h3>
          <Link to="/workouts" style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 600 }}>
            View All ({workouts.length}) →
          </Link>
        </div>

        {workouts.length === 0 ? (
          <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>No workouts recorded yet.</p>
            <Link to="/workouts" className="btn btn-primary btn-sm">
              <Plus size={16} />
              <span>Log Your First Session</span>
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
            {workouts.slice(0, 3).map((w) => (
              <div key={w._id} className="glass-card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h4 style={{ fontSize: '1.05rem' }}>{w.title}</h4>
                  {w.source === 'ai_generated' ? (
                    <span style={{ fontSize: '0.7rem', color: 'var(--accent-purple)', fontWeight: 600 }}>AI Suggested</span>
                  ) : (
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Manual</span>
                  )}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                  {new Date(w.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {w.exercises?.length || 0} exercises • {w.totalDurationMin}m
                </div>
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                  {w.exercises?.slice(0, 3).map((e, idx) => (
                    <span key={idx} style={{ fontSize: '0.75rem', background: 'rgba(255, 255, 255, 0.04)', padding: '0.2rem 0.5rem', borderRadius: '0.35rem', color: 'var(--text-secondary)' }}>
                      {e.exerciseName}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
