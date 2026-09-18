import React, { useState } from 'react';
import { useFitness } from '../context/FitnessContext';
import Notification from '../components/Notification';
import {
  Plus,
  Dumbbell,
  Calendar,
  Clock,
  Trash2,
  Sparkles,
  Search,
  Filter,
  Flame,
  CheckCircle2,
  X,
  Zap,
} from 'lucide-react';

export const Workouts = () => {
  const { workouts, loadingWorkouts, logWorkout, deleteWorkout, exercises } = useFitness();

  const [showModal, setShowModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Workout form state
  const [newWorkout, setNewWorkout] = useState({
    title: 'Strength Training Session',
    date: new Date().toISOString().split('T')[0],
    totalDurationMin: 50,
    notes: '',
    exercises: [
      { exerciseName: 'Barbell Bench Press', sets: 3, reps: 10, weightKg: 60, notes: '' },
    ],
  });

  const handleAddExerciseRow = () => {
    setNewWorkout({
      ...newWorkout,
      exercises: [
        ...newWorkout.exercises,
        { exerciseName: 'Barbell Back Squat', sets: 3, reps: 10, weightKg: 70, notes: '' },
      ],
    });
  };

  const handleRemoveExerciseRow = (index) => {
    if (newWorkout.exercises.length === 1) return;
    const updated = newWorkout.exercises.filter((_, i) => i !== index);
    setNewWorkout({ ...newWorkout, exercises: updated });
  };

  const handleExerciseChange = (index, field, value) => {
    const updated = [...newWorkout.exercises];
    updated[index] = { ...updated[index], [field]: value };
    setNewWorkout({ ...newWorkout, exercises: updated });
  };

  const handleLogSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setNotification(null);

    const payload = {
      ...newWorkout,
      exercises: newWorkout.exercises.map((ex) => ({
        ...ex,
        sets: Number(ex.sets) || 1,
        reps: Number(ex.reps) || 0,
        weightKg: Number(ex.weightKg) || 0,
      })),
    };

    const result = await logWorkout(payload);
    setSubmitting(false);

    if (result.success) {
      setShowModal(false);
      setNotification({ type: 'success', message: 'Workout logged successfully!' });
      // Reset form
      setNewWorkout({
        title: 'Strength Training Session',
        date: new Date().toISOString().split('T')[0],
        totalDurationMin: 50,
        notes: '',
        exercises: [{ exerciseName: 'Barbell Bench Press', sets: 3, reps: 10, weightKg: 60, notes: '' }],
      });
    } else {
      setNotification({ type: 'error', message: result.error });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this workout entry?')) {
      const res = await deleteWorkout(id);
      if (res.success) {
        setNotification({ type: 'success', message: 'Workout deleted.' });
      } else {
        setNotification({ type: 'error', message: res.error });
      }
    }
  };

  const filteredWorkouts = workouts.filter((w) => {
    const matchesSearch =
      w.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.exercises.some((e) => e.exerciseName.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  return (
    <div className="dashboard-container" id="workouts-page">
      {/* Header bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Workout Log</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Track sessions, total volume load, and progressive overload history.</p>
        </div>

        <button onClick={() => setShowModal(true)} className="btn btn-primary" id="open-log-workout-btn">
          <Plus size={18} />
          <span>Log Workout</span>
        </button>
      </div>

      {notification && (
        <Notification type={notification.type} message={notification.message} onClose={() => setNotification(null)} />
      )}

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div className="input-wrapper" style={{ flex: 1, minWidth: '260px' }}>
          <span className="input-icon">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Search workouts by name or exercise..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
          />
        </div>
      </div>

      {/* Workout History List */}
      {loadingWorkouts ? (
        <div className="loading-screen" style={{ minHeight: '30vh' }}>
          <div className="spinner spinner-lg"></div>
          <p style={{ color: 'var(--text-secondary)' }}>Loading workout history...</p>
        </div>
      ) : filteredWorkouts.length === 0 ? (
        <div className="glass-card" style={{ padding: '3.5rem 2rem', textAlign: 'center' }}>
          <Dumbbell size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>No Workouts Found</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
            {searchTerm
              ? 'No logged sessions matched your search term.'
              : 'You have not logged any workouts yet. Click "Log Workout" or visit the AI Coach to generate a routine.'}
          </p>
          <button onClick={() => setShowModal(true)} className="btn btn-primary btn-sm">
            <Plus size={16} />
            <span>Log First Workout</span>
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {filteredWorkouts.map((w) => {
            const dateFormatted = new Date(w.date).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });

            const totalVol = w.exercises?.reduce((sum, ex) => sum + (ex.weightKg || 0) * (ex.reps || 0) * (ex.sets || 1), 0);

            return (
              <div key={w._id} className="glass-card" style={{ padding: '1.5rem', transition: 'all var(--transition-fast)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                      <h3 style={{ fontSize: '1.25rem' }}>{w.title}</h3>
                      {w.source === 'ai_generated' ? (
                        <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '9999px', background: 'rgba(139, 92, 246, 0.15)', color: 'var(--accent-purple)', border: '1px solid rgba(139, 92, 246, 0.3)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Sparkles size={12} />
                          AI Suggested
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '9999px', background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-muted)', border: '1px solid var(--border-color)', fontWeight: 600 }}>
                          Manual Log
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Calendar size={14} />
                        {dateFormatted}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Clock size={14} />
                        {w.totalDurationMin} mins
                      </span>
                      {totalVol > 0 && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                          <Flame size={14} />
                          {totalVol.toLocaleString()} kg Total Volume
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(w._id)}
                    className="btn btn-secondary btn-sm"
                    style={{ color: '#f87171' }}
                    title="Delete workout entry"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Exercises pill list */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', marginTop: '0.75rem' }}>
                  {w.exercises?.map((ex, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '0.75rem 1rem',
                        background: 'rgba(255, 255, 255, 0.02)',
                        borderRadius: '0.6rem',
                        border: '1px solid var(--border-color)',
                      }}
                    >
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>
                        {ex.exerciseName}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {ex.sets} sets × {ex.reps > 0 ? `${ex.reps} reps` : `${ex.durationMin}m`}
                        {ex.weightKg > 0 && <span style={{ color: 'var(--accent-secondary)', fontWeight: 600 }}> @ {ex.weightKg}kg</span>}
                      </div>
                      {ex.notes && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', fontStyle: 'italic' }}>
                          "{ex.notes}"
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {w.notes && (
                  <div style={{ marginTop: '0.85rem', fontSize: '0.85rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '0.65rem' }}>
                    <strong>Notes:</strong> {w.notes}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Log Workout Modal */}
      {showModal && (
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
          <div className="glass-card" style={{ width: '100%', maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Dumbbell size={22} color="var(--accent-primary)" />
                <h2 style={{ fontSize: '1.4rem' }}>Log Workout Session</h2>
              </div>
              <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleLogSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label">Workout Title</label>
                  <input
                    type="text"
                    value={newWorkout.title}
                    onChange={(e) => setNewWorkout({ ...newWorkout, title: e.target.value })}
                    className="form-input"
                    style={{ paddingLeft: '1rem' }}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    value={newWorkout.date}
                    onChange={(e) => setNewWorkout({ ...newWorkout, date: e.target.value })}
                    className="form-input"
                    style={{ paddingLeft: '1rem' }}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Duration (min)</label>
                  <input
                    type="number"
                    min="1"
                    value={newWorkout.totalDurationMin}
                    onChange={(e) => setNewWorkout({ ...newWorkout, totalDurationMin: e.target.value })}
                    className="form-input"
                    style={{ paddingLeft: '1rem' }}
                    required
                  />
                </div>
              </div>

              {/* Exercises Multi-Set Builder */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <label className="form-label" style={{ fontWeight: 600 }}>Exercises</label>
                  <button type="button" onClick={handleAddExerciseRow} className="btn btn-secondary btn-sm">
                    <Plus size={14} />
                    <span>Add Exercise</span>
                  </button>
                </div>

                {newWorkout.exercises.map((ex, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '1rem',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '0.75rem',
                      marginBottom: '0.75rem',
                    }}
                  >
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: '0.65rem', alignItems: 'center' }}>
                      <div>
                        <input
                          type="text"
                          placeholder="Exercise name"
                          list="exercise-suggestions"
                          value={ex.exerciseName}
                          onChange={(e) => handleExerciseChange(idx, 'exerciseName', e.target.value)}
                          className="form-input"
                          style={{ paddingLeft: '0.75rem' }}
                          required
                        />
                        <datalist id="exercise-suggestions">
                          {exercises.map((item) => (
                            <option key={item._id} value={item.name} />
                          ))}
                        </datalist>
                      </div>

                      <input
                        type="number"
                        placeholder="Sets"
                        min="1"
                        value={ex.sets}
                        onChange={(e) => handleExerciseChange(idx, 'sets', e.target.value)}
                        className="form-input"
                        style={{ paddingLeft: '0.75rem' }}
                        title="Sets"
                        required
                      />

                      <input
                        type="number"
                        placeholder="Reps"
                        min="0"
                        value={ex.reps}
                        onChange={(e) => handleExerciseChange(idx, 'reps', e.target.value)}
                        className="form-input"
                        style={{ paddingLeft: '0.75rem' }}
                        title="Reps"
                      />

                      <input
                        type="number"
                        placeholder="Kg"
                        min="0"
                        step="0.5"
                        value={ex.weightKg}
                        onChange={(e) => handleExerciseChange(idx, 'weightKg', e.target.value)}
                        className="form-input"
                        style={{ paddingLeft: '0.75rem' }}
                        title="Weight (kg)"
                      />

                      {newWorkout.exercises.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveExerciseRow(idx)}
                          style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer', padding: '0.4rem' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Notes & Reflections (Optional)</label>
                <textarea
                  value={newWorkout.notes}
                  onChange={(e) => setNewWorkout({ ...newWorkout, notes: e.target.value })}
                  placeholder="How did the session feel? Energy levels, soreness..."
                  className="form-input"
                  style={{ paddingLeft: '1rem', minHeight: '70px', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? (
                    <>
                      <div className="spinner"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Workout</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Workouts;
