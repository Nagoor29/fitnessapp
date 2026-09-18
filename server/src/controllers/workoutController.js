import WorkoutSession from '../models/WorkoutSession.js';
import Exercise from '../models/Exercise.js';

/**
 * @desc    Log a new workout session
 * @route   POST /api/workouts
 * @access  Private
 */
export const createWorkout = async (req, res, next) => {
  try {
    const { title, date, exercises, totalDurationMin, notes, source, aiSuggestionId } = req.body;
    const userId = req.user._id || req.user.id;

    if (!exercises || !Array.isArray(exercises) || exercises.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'A workout must contain at least one exercise.',
      });
    }

    // Validate exercise items
    for (const item of exercises) {
      if (!item.exerciseName || !item.exerciseName.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Each exercise must have a valid exercise name.',
        });
      }
      if (!item.sets || item.sets < 1) {
        return res.status(400).json({
          success: false,
          message: `Sets for ${item.exerciseName} must be at least 1.`,
        });
      }
      if (item.reps !== undefined && item.reps < 0) {
        return res.status(400).json({
          success: false,
          message: `Reps for ${item.exerciseName} cannot be negative.`,
        });
      }
      if (item.weightKg !== undefined && item.weightKg < 0) {
        return res.status(400).json({
          success: false,
          message: `Weight for ${item.exerciseName} cannot be negative.`,
        });
      }
    }

    const workout = await WorkoutSession.create({
      userId,
      title: title ? title.trim() : 'Workout Session',
      date: date ? new Date(date) : new Date(),
      exercises,
      totalDurationMin: totalDurationMin ? Number(totalDurationMin) : 45,
      notes: notes ? notes.trim() : '',
      source: source === 'ai_generated' ? 'ai_generated' : 'manual',
      aiSuggestionId: aiSuggestionId || null,
    });

    res.status(201).json({
      success: true,
      message: 'Workout logged successfully.',
      workout,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user workouts with pagination and optional date range
 * @route   GET /api/workouts
 * @access  Private
 */
export const getWorkouts = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const { startDate, endDate, limit = 20, page = 1 } = req.query;

    const query = { userId };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const parsedLimit = Math.min(Number(limit) || 20, 100);
    const parsedPage = Math.max(Number(page) || 1, 1);
    const skip = (parsedPage - 1) * parsedLimit;

    const [workouts, total] = await Promise.all([
      WorkoutSession.find(query)
        .sort({ date: -1, createdAt: -1 })
        .skip(skip)
        .limit(parsedLimit),
      WorkoutSession.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: workouts.length,
      total,
      page: parsedPage,
      totalPages: Math.ceil(total / parsedLimit),
      workouts,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single workout by ID
 * @route   GET /api/workouts/:id
 * @access  Private
 */
export const getWorkoutById = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const workout = await WorkoutSession.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: 'Workout not found.',
      });
    }

    // Enforce ownership
    if (workout.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to this workout.',
      });
    }

    res.status(200).json({
      success: true,
      workout,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a workout session
 * @route   PUT /api/workouts/:id
 * @access  Private
 */
export const updateWorkout = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const workout = await WorkoutSession.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: 'Workout not found.',
      });
    }

    // Enforce ownership
    if (workout.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to modify this workout.',
      });
    }

    const { title, date, exercises, totalDurationMin, notes } = req.body;

    if (exercises && Array.isArray(exercises)) {
      if (exercises.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'A workout must have at least one exercise.',
        });
      }
      workout.exercises = exercises;
    }

    if (title) workout.title = title.trim();
    if (date) workout.date = new Date(date);
    if (totalDurationMin !== undefined) workout.totalDurationMin = Number(totalDurationMin);
    if (notes !== undefined) workout.notes = notes.trim();

    await workout.save();

    res.status(200).json({
      success: true,
      message: 'Workout updated successfully.',
      workout,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a workout session
 * @route   DELETE /api/workouts/:id
 * @access  Private
 */
export const deleteWorkout = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const workout = await WorkoutSession.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: 'Workout not found.',
      });
    }

    // Enforce ownership
    if (workout.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to delete this workout.',
      });
    }

    await WorkoutSession.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Workout deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get aggregated workout stats and chart data for dashboard
 * @route   GET /api/workouts/stats
 * @access  Private
 */
export const getWorkoutStats = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;

    // Fetch all user workouts sorted ascending by date
    const allWorkouts = await WorkoutSession.find({ userId }).sort({ date: 1 });

    const totalWorkouts = allWorkouts.length;
    let totalVolumeKg = 0;
    let totalDurationMin = 0;

    // Last 30 days cutoff
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    let workoutsLast30Days = 0;
    const volumeProgression = [];
    const workoutsByDayMap = {};

    allWorkouts.forEach((w) => {
      const vol = w.totalVolumeKg || 0;
      totalVolumeKg += vol;
      totalDurationMin += w.totalDurationMin || 0;

      const d = new Date(w.date);
      const dateStr = d.toISOString().split('T')[0];

      if (d >= thirtyDaysAgo) {
        workoutsLast30Days++;
        workoutsByDayMap[dateStr] = (workoutsByDayMap[dateStr] || 0) + 1;
      }

      // Add to volume progression history
      volumeProgression.push({
        date: dateStr,
        volumeKg: Math.round(vol),
        durationMin: w.totalDurationMin || 0,
        title: w.title,
      });
    });

    // Compute weekly frequency chart data for the last 4 weeks
    const weeklyFrequency = [];
    for (let i = 3; i >= 0; i--) {
      const start = new Date();
      start.setDate(start.getDate() - (i + 1) * 7);
      const end = new Date();
      end.setDate(end.getDate() - i * 7);

      const count = allWorkouts.filter((w) => {
        const d = new Date(w.date);
        return d >= start && d < end;
      }).length;

      weeklyFrequency.push({
        week: i === 0 ? 'This Week' : `${i}w ago`,
        workouts: count,
      });
    }

    // Calculate current workout streak
    let streak = 0;
    if (allWorkouts.length > 0) {
      // Get unique workout dates in YYYY-MM-DD
      const uniqueDates = Array.from(
        new Set(allWorkouts.map((w) => new Date(w.date).toISOString().split('T')[0]))
      ).sort().reverse();

      const todayStr = new Date().toISOString().split('T')[0];
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      // Check if user worked out today or yesterday to maintain streak
      let checkDate = new Date();
      if (uniqueDates[0] === todayStr) {
        streak = 1;
        checkDate.setDate(checkDate.getDate() - 1);
      } else if (uniqueDates[0] === yesterdayStr) {
        streak = 1;
        checkDate.setDate(checkDate.getDate() - 2);
      }

      if (streak > 0) {
        for (let i = 1; i < uniqueDates.length; i++) {
          const expectedStr = checkDate.toISOString().split('T')[0];
          if (uniqueDates[i] === expectedStr) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
          } else {
            break;
          }
        }
      }
    }

    res.status(200).json({
      success: true,
      stats: {
        totalWorkouts,
        totalVolumeKg: Math.round(totalVolumeKg),
        totalDurationMin,
        workoutsLast30Days,
        currentStreak: streak,
        weeklyFrequency,
        volumeProgression: volumeProgression.slice(-15), // Last 15 data points
      },
    });
  } catch (error) {
    next(error);
  }
};
