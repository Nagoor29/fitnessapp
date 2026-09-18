import Exercise from '../models/Exercise.js';

/**
 * @desc    Get all exercises with filtering and search
 * @route   GET /api/exercises
 * @access  Private
 */
export const getExercises = async (req, res, next) => {
  try {
    const { category, muscleGroup, equipment, difficulty, search } = req.query;

    const query = {};

    if (category) {
      query.category = category;
    }

    if (muscleGroup) {
      query.muscleGroups = { $in: [new RegExp(muscleGroup, 'i')] };
    }

    if (equipment) {
      query.equipment = equipment;
    }

    if (difficulty) {
      query.difficulty = difficulty;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { instructions: { $regex: search, $options: 'i' } },
      ];
    }

    const exercises = await Exercise.find(query).sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: exercises.length,
      exercises,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single exercise by ID
 * @route   GET /api/exercises/:id
 * @access  Private
 */
export const getExerciseById = async (req, res, next) => {
  try {
    const exercise = await Exercise.findById(req.params.id);

    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: 'Exercise not found in library.',
      });
    }

    res.status(200).json({
      success: true,
      exercise,
    });
  } catch (error) {
    next(error);
  }
};
