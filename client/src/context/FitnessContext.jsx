import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const FitnessContext = createContext(null);

export const FitnessProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();

  // Profile State
  const [profile, setProfile] = useState(null);
  const [hasProfile, setHasProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  // Workouts State
  const [workouts, setWorkouts] = useState([]);
  const [loadingWorkouts, setLoadingWorkouts] = useState(false);
  const [workoutStats, setWorkoutStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);

  // Exercise Library State
  const [exercises, setExercises] = useState([]);
  const [loadingExercises, setLoadingExercises] = useState(false);

  // AI Suggestion State
  const [currentSuggestion, setCurrentSuggestion] = useState(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiError, setAiError] = useState(null);

  /**
   * Fetch user's fitness profile
   */
  const fetchProfile = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoadingProfile(true);
    try {
      const res = await api.get('/profile');
      setHasProfile(res.data.hasProfile);
      setProfile(res.data.profile || null);
    } catch (err) {
      console.warn('[FitnessContext] Failed to fetch profile:', err.message);
    } finally {
      setLoadingProfile(false);
    }
  }, [isAuthenticated]);

  /**
   * Save or update fitness profile
   */
  const saveProfile = async (profileData) => {
    try {
      const res = await api.put('/profile', profileData);
      setProfile(res.data.profile);
      setHasProfile(true);
      return { success: true, profile: res.data.profile };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save profile.';
      return { success: false, error: msg };
    }
  };

  /**
   * Fetch exercise library
   */
  const fetchExercises = useCallback(async (filters = {}) => {
    if (!isAuthenticated) return;
    setLoadingExercises(true);
    try {
      const params = new URLSearchParams(filters);
      const res = await api.get(`/exercises?${params.toString()}`);
      setExercises(res.data.exercises || []);
    } catch (err) {
      console.warn('[FitnessContext] Failed to fetch exercises:', err.message);
    } finally {
      setLoadingExercises(false);
    }
  }, [isAuthenticated]);

  /**
   * Fetch user workouts
   */
  const fetchWorkouts = useCallback(async (params = {}) => {
    if (!isAuthenticated) return;
    setLoadingWorkouts(true);
    try {
      const query = new URLSearchParams(params);
      const res = await api.get(`/workouts?${query.toString()}`);
      setWorkouts(res.data.workouts || []);
    } catch (err) {
      console.warn('[FitnessContext] Failed to fetch workouts:', err.message);
    } finally {
      setLoadingWorkouts(false);
    }
  }, [isAuthenticated]);

  /**
   * Fetch aggregated stats for dashboard
   */
  const fetchStats = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoadingStats(true);
    try {
      const res = await api.get('/workouts/stats');
      setWorkoutStats(res.data.stats || null);
    } catch (err) {
      console.warn('[FitnessContext] Failed to fetch stats:', err.message);
    } finally {
      setLoadingStats(false);
    }
  }, [isAuthenticated]);

  /**
   * Log a new workout session
   */
  const logWorkout = async (workoutData) => {
    try {
      const res = await api.post('/workouts', workoutData);
      await Promise.all([fetchWorkouts(), fetchStats()]);
      return { success: true, workout: res.data.workout };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to log workout.';
      return { success: false, error: msg };
    }
  };

  /**
   * Delete a workout session
   */
  const deleteWorkout = async (workoutId) => {
    try {
      await api.delete(`/workouts/${workoutId}`);
      setWorkouts((prev) => prev.filter((w) => w._id !== workoutId));
      await fetchStats();
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete workout.';
      return { success: false, error: msg };
    }
  };

  /**
   * Request AI Workout Suggestion
   */
  const generateAiWorkout = async (focusArea = 'Full Body', additionalPreferences = '') => {
    setIsGeneratingAi(true);
    setAiError(null);
    try {
      const res = await api.post('/ai/suggest-workout', {
        focusArea,
        additionalPreferences,
      });

      const suggestionData = {
        suggestionId: res.data.suggestionId,
        engineSource: res.data.engineSource,
        plan: res.data.plan,
      };

      setCurrentSuggestion(suggestionData);
      return { success: true, data: suggestionData };
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        'Unable to generate AI workout routine right now. Please try again.';
      setAiError(msg);
      return { success: false, error: msg };
    } finally {
      setIsGeneratingAi(false);
    }
  };

  /**
   * Accept AI Workout Suggestion & Convert to logged workout
   */
  const acceptAiWorkout = async (suggestionId) => {
    try {
      const res = await api.post(`/ai/suggestions/${suggestionId}/accept`);
      await Promise.all([fetchWorkouts(), fetchStats()]);
      if (currentSuggestion?.suggestionId === suggestionId) {
        setCurrentSuggestion(null);
      }
      return { success: true, workout: res.data.workout };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to accept AI workout.';
      return { success: false, error: msg };
    }
  };

  // Initial load when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile();
      fetchExercises();
      fetchWorkouts();
      fetchStats();
    } else {
      setProfile(null);
      setHasProfile(null);
      setWorkouts([]);
      setWorkoutStats(null);
      setExercises([]);
      setCurrentSuggestion(null);
    }
  }, [isAuthenticated, fetchProfile, fetchExercises, fetchWorkouts, fetchStats]);

  const value = {
    profile,
    hasProfile,
    loadingProfile,
    saveProfile,
    fetchProfile,
    workouts,
    loadingWorkouts,
    workoutStats,
    loadingStats,
    logWorkout,
    deleteWorkout,
    fetchWorkouts,
    fetchStats,
    exercises,
    loadingExercises,
    fetchExercises,
    currentSuggestion,
    setCurrentSuggestion,
    isGeneratingAi,
    aiError,
    generateAiWorkout,
    acceptAiWorkout,
  };

  return <FitnessContext.Provider value={value}>{children}</FitnessContext.Provider>;
};

export const useFitness = () => {
  const context = useContext(FitnessContext);
  if (!context) {
    throw new Error('useFitness must be used within a FitnessProvider');
  }
  return context;
};
