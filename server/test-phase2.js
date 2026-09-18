import dotenv from 'dotenv';
import mongoose from 'mongoose';
import dns from 'node:dns';
import User from './src/models/User.js';
import UserProfile from './src/models/UserProfile.js';
import WorkoutSession from './src/models/WorkoutSession.js';
import AiSuggestion from './src/models/AiSuggestion.js';

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

dotenv.config();

const BASE_URL = 'http://localhost:5000/api';

const runPhase2Tests = async () => {
  console.log('====================================================');
  console.log('🧪 RUNNING PHASE 2 CORE DATA + AI INTEGRATION TESTS');
  console.log('====================================================');

  const testEmailA = `athlete_p2_a_${Date.now()}@fitpulse.ai`;
  const testEmailB = `athlete_p2_b_${Date.now()}@fitpulse.ai`;
  const testPassword = 'Password2026!@#';

  let tokenA = null;
  let tokenB = null;
  let userAId = null;
  let userBId = null;
  let createdWorkoutId = null;
  let suggestionId = null;

  try {
    // 1. Setup 2 test users for ownership verification
    console.log('\n[SETUP] Registering User A and User B...');
    const regResA = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Jordan Hayes', email: testEmailA, password: testPassword }),
    });
    const regDataA = await regResA.json();
    tokenA = regDataA.accessToken;
    userAId = regDataA.user?.id;

    const regResB = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Sam Taylor', email: testEmailB, password: testPassword }),
    });
    const regDataB = await regResB.json();
    tokenB = regDataB.accessToken;
    userBId = regDataB.user?.id;

    console.log('✅ User A ID:', userAId);
    console.log('✅ User B ID:', userBId);

    // 2. Profile initial check & update
    console.log('\n[TEST 1] GET /api/profile (Before setup)');
    const profInitRes = await fetch(`${BASE_URL}/profile`, {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    const profInitData = await profInitRes.json();
    console.log(`Has profile? ${profInitData.hasProfile}`);
    if (profInitData.hasProfile !== false) {
      throw new Error('New user should not have a profile initially');
    }
    console.log('✅ TEST 1 PASSED: Correctly reported no profile initially');

    console.log('\n[TEST 2] PUT /api/profile (Create User Profile)');
    const profUpdateRes = await fetch(`${BASE_URL}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({
        age: 28,
        heightCm: 180,
        weightKg: 82,
        fitnessGoal: 'muscle_gain',
        experienceLevel: 'intermediate',
        availableDaysPerWeek: 4,
        preferredSplit: 'push_pull_legs',
        injuriesOrLimitations: 'Mild right shoulder tightness',
      }),
    });
    const profUpdateData = await profUpdateRes.json();
    console.log('Updated profile:', profUpdateData.profile);
    if (profUpdateRes.status !== 200 || profUpdateData.profile?.fitnessGoal !== 'muscle_gain') {
      throw new Error('Failed to create/update user profile');
    }
    console.log('✅ TEST 2 PASSED: User profile saved with calculated BMI:', profUpdateData.profile?.bmi);

    // 3. Exercise Library
    console.log('\n[TEST 3] GET /api/exercises (Exercise Library & Filtering)');
    const exRes = await fetch(`${BASE_URL}/exercises`, {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    const exData = await exRes.json();
    console.log(`Total exercises found: ${exData.count}`);
    if (exRes.status !== 200 || exData.count < 20) {
      throw new Error('Exercise library did not return seeded items');
    }

    const filterRes = await fetch(`${BASE_URL}/exercises?category=strength&muscleGroup=chest`, {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    const filterData = await filterRes.json();
    console.log(`Chest strength exercises found: ${filterData.count}`);
    if (filterData.count === 0) {
      throw new Error('Category and muscle group filtering failed');
    }
    console.log('✅ TEST 3 PASSED: Exercise library and filters working');

    // 4. Workout Session CRUD
    console.log('\n[TEST 4] POST /api/workouts (Log Manual Workout)');
    const workoutRes = await fetch(`${BASE_URL}/workouts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({
        title: 'Push Day - Hypertrophy',
        date: new Date(),
        totalDurationMin: 55,
        exercises: [
          {
            exerciseName: 'Barbell Bench Press',
            sets: 4,
            reps: 8,
            weightKg: 85,
            notes: 'Felt solid on top set',
          },
          {
            exerciseName: 'Incline Dumbbell Press',
            sets: 3,
            reps: 10,
            weightKg: 28,
            notes: '',
          },
        ],
        notes: 'Great pump and energy today.',
      }),
    });
    const workoutData = await workoutRes.json();
    createdWorkoutId = workoutData.workout?._id;
    console.log(`Status: ${workoutRes.status}, Created Workout ID: ${createdWorkoutId}`);
    if (workoutRes.status !== 201 || !createdWorkoutId) {
      throw new Error('Failed to create workout session');
    }
    console.log('✅ TEST 4 PASSED: Workout session logged');

    // 5. Workouts list & stats
    console.log('\n[TEST 5] GET /api/workouts/stats (Dashboard Analytics)');
    const statsRes = await fetch(`${BASE_URL}/workouts/stats`, {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    const statsData = await statsRes.json();
    console.log('Workout stats:', statsData.stats);
    if (statsRes.status !== 200 || statsData.stats?.totalWorkouts < 1 || statsData.stats?.totalVolumeKg < 1000) {
      throw new Error('Stats aggregation calculation failed');
    }
    console.log('✅ TEST 5 PASSED: Workout stats and volume calculated');

    // 6. Security & Ownership isolation check
    console.log('\n[TEST 6] GET /api/workouts/:id (Ownership Check - User B accessing User A workout)');
    const crossUserRes = await fetch(`${BASE_URL}/workouts/${createdWorkoutId}`, {
      headers: { Authorization: `Bearer ${tokenB}` },
    });
    console.log(`Cross-user access status: ${crossUserRes.status}`);
    if (crossUserRes.status !== 403) {
      throw new Error('Cross-user access was not blocked with 403 Forbidden');
    }
    console.log('✅ TEST 6 PASSED: Cross-user data isolation verified');

    // 7. AI Workout Suggestion
    console.log('\n[TEST 7] POST /api/ai/suggest-workout (Generate Routine)');
    const aiRes = await fetch(`${BASE_URL}/ai/suggest-workout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({
        focusArea: 'Pull Focus',
        additionalPreferences: 'Focus on lat width',
      }),
    });
    const aiData = await aiRes.json();
    suggestionId = aiData.suggestionId;
    console.log(`Status: ${aiRes.status}, Engine: ${aiData.engineSource}`);
    console.log(`Suggested Routine Title: "${aiData.plan?.title}"`);
    console.log(`Exercises count: ${aiData.plan?.exercises?.length}`);
    if (aiRes.status !== 200 || !suggestionId || !aiData.plan?.exercises?.length) {
      throw new Error('AI Suggestion generation failed');
    }
    console.log('✅ TEST 7 PASSED: AI Suggestion returned structured schema');

    // 8. Accept Suggestion & convert to WorkoutSession
    console.log('\n[TEST 8] POST /api/ai/suggestions/:id/accept (Convert to Workout)');
    const acceptRes = await fetch(`${BASE_URL}/ai/suggestions/${suggestionId}/accept`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenA}`,
      },
    });
    const acceptData = await acceptRes.json();
    console.log(`Status: ${acceptRes.status}, Source: ${acceptData.workout?.source}`);
    if (acceptRes.status !== 201 || acceptData.workout?.source !== 'ai_generated') {
      throw new Error('AI suggestion acceptance failed to create ai_generated workout');
    }
    console.log('✅ TEST 8 PASSED: Suggestion converted to real WorkoutSession');

    console.log('\n====================================================');
    console.log('🎉 ALL PHASE 2 INTEGRATION TESTS PASSED!');
    console.log('====================================================');
  } catch (err) {
    console.error('\n❌ PHASE 2 TEST FAILED:', err.message);
  } finally {
    // Clean up test records
    try {
      const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fitness_assistant';
      await mongoose.connect(mongoUri);
      if (userAId) {
        await User.findByIdAndDelete(userAId);
        await UserProfile.deleteMany({ userId: userAId });
        await WorkoutSession.deleteMany({ userId: userAId });
        await AiSuggestion.deleteMany({ userId: userAId });
      }
      if (userBId) {
        await User.findByIdAndDelete(userBId);
        await UserProfile.deleteMany({ userId: userBId });
        await WorkoutSession.deleteMany({ userId: userBId });
        await AiSuggestion.deleteMany({ userId: userBId });
      }
      console.log('[Cleanup] Phase 2 test records cleaned up from MongoDB Atlas.');
      await mongoose.disconnect();
    } catch (cleanupErr) {
      console.warn('[Cleanup Warning]:', cleanupErr.message);
    }
    process.exit(0);
  }
};

runPhase2Tests();
