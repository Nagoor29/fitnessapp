import React, { useState, useEffect } from 'react';
import { useFitness } from '../context/FitnessContext';
import {
  Search,
  Dumbbell,
  HeartPulse,
  Flame,
  Activity,
  Layers,
  Info,
  X,
  Sparkles,
} from 'lucide-react';

export const Exercises = () => {
  const { exercises, loadingExercises, fetchExercises } = useFitness();

  const [category, setCategory] = useState('');
  const [muscleGroup, setMuscleGroup] = useState('');
  const [search, setSearch] = useState('');
  const [selectedExercise, setSelectedExercise] = useState(null);

  useEffect(() => {
    const filters = {};
    if (category) filters.category = category;
    if (muscleGroup) filters.muscleGroup = muscleGroup;
    if (search) filters.search = search;
    fetchExercises(filters);
  }, [category, muscleGroup, search, fetchExercises]);

  const categories = [
    { id: '', label: 'All Categories' },
    { id: 'strength', label: '🏋️ Strength' },
    { id: 'cardio', label: '🏃 Cardio' },
    { id: 'hiit', label: '⚡ HIIT' },
    { id: 'mobility', label: '🧘 Mobility' },
  ];

  const muscleGroups = [
    '', 'chest', 'back', 'shoulders', 'biceps', 'triceps', 'quads', 'hamstrings', 'glutes', 'calves', 'core'
  ];

  return (
    <div className="dashboard-container" id="exercises-page">
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Exercise Library</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Browse reference technique guides, targeted muscle groups, and coach execution cues.
        </p>
      </div>

      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: '0.65rem', marginBottom: '1.25rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setCategory(c.id)}
            className={`btn btn-sm ${category === c.id ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: '9999px', whiteSpace: 'nowrap' }}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Search and Muscle Group filter */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div className="input-wrapper" style={{ flex: 2, minWidth: '240px' }}>
          <span className="input-icon">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Search exercises by name, equipment, or technique..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
          />
        </div>

        <div style={{ flex: 1, minWidth: '180px' }}>
          <select
            value={muscleGroup}
            onChange={(e) => setMuscleGroup(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '1rem' }}
          >
            <option value="">All Muscle Groups</option>
            {muscleGroups.filter(Boolean).map((mg) => (
              <option key={mg} value={mg}>
                {mg.charAt(0).toUpperCase() + mg.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Exercises Grid */}
      {loadingExercises ? (
        <div className="loading-screen" style={{ minHeight: '30vh' }}>
          <div className="spinner spinner-lg"></div>
          <p style={{ color: 'var(--text-secondary)' }}>Loading exercise reference library...</p>
        </div>
      ) : exercises.length === 0 ? (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
          <Dumbbell size={40} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
          <h3>No Exercises Matched</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            Try adjusting your search terms or clearing muscle group filters.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {exercises.map((ex) => (
            <div
              key={ex._id}
              className="glass-card"
              onClick={() => setSelectedExercise(ex)}
              style={{
                padding: '1.35rem',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all var(--transition-fast)',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      padding: '0.2rem 0.55rem',
                      borderRadius: '0.4rem',
                      background: 'rgba(0, 245, 155, 0.12)',
                      color: 'var(--accent-primary)',
                      border: '1px solid rgba(0, 245, 155, 0.25)',
                    }}
                  >
                    {ex.category}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                    {ex.difficulty}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                  {ex.name}
                </h3>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {ex.instructions}
                </p>
              </div>

              <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                  {ex.muscleGroups?.slice(0, 2).map((mg, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: '0.7rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        padding: '0.15rem 0.45rem',
                        borderRadius: '0.35rem',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {mg}
                    </span>
                  ))}
                  {ex.muscleGroups?.length > 2 && (
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>+{ex.muscleGroups.length - 2}</span>
                  )}
                </div>

                <span style={{ fontSize: '0.75rem', color: 'var(--accent-secondary)', fontWeight: 600 }}>
                  View Technique →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Exercise Detail Modal */}
      {selectedExercise && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
        >
          <div className="glass-card" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div>
                <span className="hero-badge" style={{ marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                  {selectedExercise.category} • {selectedExercise.difficulty}
                </span>
                <h2 style={{ fontSize: '1.6rem' }}>{selectedExercise.name}</h2>
              </div>
              <button
                onClick={() => setSelectedExercise(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={22} />
              </button>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
              {selectedExercise.muscleGroups?.map((mg, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: '0.75rem',
                    background: 'rgba(0, 245, 155, 0.1)',
                    color: 'var(--accent-primary)',
                    padding: '0.25rem 0.65rem',
                    borderRadius: '9999px',
                    border: '1px solid rgba(0, 245, 155, 0.2)',
                  }}
                >
                  🎯 {mg}
                </span>
              ))}
              <span
                style={{
                  fontSize: '0.75rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'var(--text-secondary)',
                  padding: '0.25rem 0.65rem',
                  borderRadius: '9999px',
                  border: '1px solid var(--border-color)',
                }}
              >
                ⚙️ {selectedExercise.equipment}
              </span>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                Execution Instructions
              </h4>
              <p style={{ lineHeight: '1.6', color: 'var(--text-primary)' }}>
                {selectedExercise.instructions}
              </p>
            </div>

            {selectedExercise.tips?.length > 0 && (
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-color)', borderRadius: '0.75rem', padding: '1rem', marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.5rem' }}>
                  <Sparkles size={16} />
                  <span>Coach Form Tips</span>
                </h4>
                <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  {selectedExercise.tips.map((tip, i) => (
                    <li key={i} style={{ marginBottom: '0.25rem' }}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}

            <button onClick={() => setSelectedExercise(null)} className="btn btn-primary btn-full">
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Exercises;
