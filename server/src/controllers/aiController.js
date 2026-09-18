import Anthropic from '@anthropic-ai/sdk';
import UserProfile from '../models/UserProfile.js';
import WorkoutSession from '../models/WorkoutSession.js';
import Exercise from '../models/Exercise.js';
import AiSuggestion from '../models/AiSuggestion.js';

/**
 * Intelligent rule-based workout synthesis fallback
 * Generates tailored workout routines when Anthropic API key is absent or unreachable
 */
const synthesizeRuleBasedWorkout = async (profile, focusArea = 'Full Body', recentWorkouts = []) => {
  const goal = profile?.fitnessGoal || 'general_fitness';
  const level = profile?.experienceLevel || 'intermediate';

  // Determine target sets & reps based on goal
  let targetSets = 3;
  let targetReps = 10;
  let restSeconds = 60;

  if (goal === 'muscle_gain') {
    targetSets = level === 'advanced' ? 4 : 3;
    targetReps = 10;
    restSeconds = 90;
  } else if (goal === 'endurance') {
    targetSets = 3;
    targetReps = 15;
    restSeconds = 45;
  } else if (goal === 'weight_loss') {
    targetSets = 3;
    targetReps = 12;
    restSeconds = 45;
  }

  // Fetch relevant exercises from library
  let query = {};
  const normalizedFocus = focusArea.toLowerCase();

  if (normalizedFocus.includes('push') || normalizedFocus.includes('chest')) {
    query = { muscleGroups: { $in: ['chest', 'shoulders', 'triceps'] } };
  } else if (normalizedFocus.includes('pull') || normalizedFocus.includes('back')) {
    query = { muscleGroups: { $in: ['back', 'biceps'] } };
  } else if (normalizedFocus.includes('leg') || normalizedFocus.includes('lower')) {
    query = { muscleGroups: { $in: ['quads', 'hamstrings', 'glutes', 'calves'] } };
  } else if (normalizedFocus.includes('cardio') || normalizedFocus.includes('hiit')) {
    query = { category: { $in: ['cardio', 'hiit'] } };
  }

  let dbExercises = await Exercise.find(query).limit(10);
  if (dbExercises.length < 4) {
    dbExercises = await Exercise.find({}).limit(8);
  }

  // Pick 4-5 exercises
  const selected = dbExercises.slice(0, 5).map((ex) => ({
    exerciseName: ex.name,
    exerciseId: ex._id,
    targetSets,
    targetReps: ex.category === 'cardio' ? 0 : targetReps,
    durationMin: ex.category === 'cardio' ? 15 : 0,
    targetWeightKg: level === 'beginner' ? 20 : level === 'intermediate' ? 40 : 60,
    restSeconds,
    formTips: ex.tips?.[0] || ex.instructions.substring(0, 100) + '...',
  }));

  return {
    title: `${focusArea} Optimization Routine`,
    rationale: `Designed for your ${goal.replace('_', ' ')} goal and ${level} experience level, focusing on ${focusArea} hypertrophy and functional endurance.`,
    estimatedDurationMin: 45,
    difficulty: level,
    exercises: selected,
  };
};

/**
 * @desc    Generate an AI workout suggestion using Claude API (with synthesis fallback)
 * @route   POST /api/ai/suggest-workout
 * @access  Private
 */
export const suggestWorkout = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const { focusArea = 'Full Body', additionalPreferences = '' } = req.body;

    // 1. Gather context
    const [profile, recentWorkouts, allExercises] = await Promise.all([
      UserProfile.findOne({ userId }),
      WorkoutSession.find({ userId })
        .sort({ date: -1 })
        .limit(6)
        .select('title date exercises totalDurationMin source'),
      Exercise.find({}).select('name category muscleGroups equipment difficulty'),
    ]);

    const userProfileSummary = profile
      ? `Goal: ${profile.fitnessGoal}, Level: ${profile.experienceLevel}, Age: ${profile.age}, Weight: ${profile.weightKg}kg, Height: ${profile.heightCm}cm, Training Days: ${profile.availableDaysPerWeek}/week. Limitations: ${profile.injuriesOrLimitations || 'None'}`
      : 'Goal: General Fitness, Level: Intermediate, Limitations: None';

    const recentWorkoutSummary = recentWorkouts.length
      ? recentWorkouts.map((w) => `${w.date.toISOString().split('T')[0]}: ${w.title} (${w.exercises.map((e) => e.exerciseName).join(', ')})`).join('\n')
      : 'No prior workouts logged yet.';

    const availableExerciseNames = allExercises.map((e) => e.name).slice(0, 30).join(', ');

    // 2. Build structured prompt for Claude
    const prompt = `You are FitPulse AI, an elite strength and conditioning coach.
Generate a structured, scientifically periodized workout routine tailored to this athlete.

ATHLETE PROFILE:
${userProfileSummary}

RECENT WORKOUT HISTORY (Last 2 Weeks):
${recentWorkoutSummary}

REQUESTED FOCUS AREA: ${focusArea}
ADDITIONAL PREFERENCES: ${additionalPreferences || 'None'}

AVAILABLE EXERCISES:
${availableExerciseNames}

CRITICAL REQUIREMENT:
You MUST respond ONLY with valid JSON matching this exact schema (no preamble, no backticks, no markdown codeblocks):
{
  "title": "Workout Title",
  "rationale": "Brief 1-2 sentence coach explanation of why this routine was chosen",
  "estimatedDurationMin": 45,
  "difficulty": "beginner | intermediate | advanced",
  "exercises": [
    {
      "exerciseName": "Name of exercise",
      "targetSets": 3,
      "targetReps": 10,
      "targetWeightKg": 0,
      "durationMin": 0,
      "restSeconds": 60,
      "formTips": "Key cue for proper execution"
    }
  ]
}`;

    let plan = null;
    let engineSource = 'fallback_synthesis';

    // 3. Attempt Anthropic Claude API if API key is provided
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (apiKey && apiKey !== 'your_anthropic_api_key_here' && !apiKey.startsWith('demo_')) {
      try {
        const anthropic = new Anthropic({ apiKey });

        const response = await anthropic.messages.create({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1500,
          system: 'You are an expert AI strength coach. You always respond strictly in valid JSON without markdown wrapping.',
          messages: [{ role: 'user', content: prompt }],
        });

        const rawText = response.content[0]?.text?.trim();
        // Clean any potential markdown fences
        const jsonText = rawText.replace(/^```json\s*/, '').replace(/```$/, '').trim();
        const parsed = JSON.parse(jsonText);

        if (parsed.title && Array.isArray(parsed.exercises) && parsed.exercises.length > 0) {
          plan = parsed;
          engineSource = 'claude-3-5-sonnet';
        }
      } catch (anthropicErr) {
        console.warn('[AI Controller] Claude API call failed or unconfigured, switching to synthesis fallback:', anthropicErr.message);
      }
    }

    // 4. Fallback synthesis if Claude was not used or failed
    if (!plan) {
      plan = await synthesizeRuleBasedWorkout(profile, focusArea, recentWorkouts);
      engineSource = 'fitpulse_synthesis_engine';
    }

    // Match exerciseIds from DB where possible
    for (const item of plan.exercises) {
      const match = allExercises.find(
        (e) => e.name.toLowerCase() === item.exerciseName.toLowerCase()
      );
      if (match) {
        item.exerciseId = match._id;
      }
    }

    // 5. Store in AiSuggestion collection
    const suggestion = await AiSuggestion.create({
      userId,
      prompt: `Focus: ${focusArea} | Pref: ${additionalPreferences || 'None'}`,
      focusArea,
      generatedPlan: plan,
      accepted: false,
    });

    res.status(200).json({
      success: true,
      message: 'Workout suggestion generated successfully.',
      engineSource,
      suggestionId: suggestion._id,
      plan: suggestion.generatedPlan,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Accept an AI workout suggestion and convert it into a logged WorkoutSession
 * @route   POST /api/ai/suggestions/:id/accept
 * @access  Private
 */
export const acceptSuggestion = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const suggestion = await AiSuggestion.findById(req.params.id);

    if (!suggestion) {
      return res.status(404).json({
        success: false,
        message: 'AI suggestion not found.',
      });
    }

    if (suggestion.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to this suggestion.',
      });
    }

    if (suggestion.accepted && suggestion.workoutSessionId) {
      const existing = await WorkoutSession.findById(suggestion.workoutSessionId);
      if (existing) {
        return res.status(200).json({
          success: true,
          message: 'Suggestion was already accepted and logged.',
          workout: existing,
        });
      }
    }

    // Map suggested exercises to WorkoutSession format
    const exercisesToLog = suggestion.generatedPlan.exercises.map((item) => ({
      exerciseId: item.exerciseId || undefined,
      exerciseName: item.exerciseName,
      sets: item.targetSets || 3,
      reps: item.targetReps || 10,
      weightKg: item.targetWeightKg || 0,
      durationMin: item.durationMin || 0,
      notes: item.formTips ? `AI Form Cue: ${item.formTips}` : '',
    }));

    // Create WorkoutSession
    const newWorkout = await WorkoutSession.create({
      userId,
      title: suggestion.generatedPlan.title || `${suggestion.focusArea} Routine`,
      date: new Date(),
      exercises: exercisesToLog,
      totalDurationMin: suggestion.generatedPlan.estimatedDurationMin || 45,
      source: 'ai_generated',
      aiSuggestionId: suggestion._id,
      notes: suggestion.generatedPlan.rationale || 'Generated by FitPulse AI Coach.',
    });

    // Mark suggestion as accepted
    suggestion.accepted = true;
    suggestion.workoutSessionId = newWorkout._id;
    await suggestion.save();

    res.status(201).json({
      success: true,
      message: 'AI Workout routine accepted and logged to your history!',
      workout: newWorkout,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user's AI suggestions history
 * @route   GET /api/ai/suggestions
 * @access  Private
 */
export const getSuggestions = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const suggestions = await AiSuggestion.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      count: suggestions.length,
      suggestions,
    });
  } catch (error) {
    next(error);
  }
};
