import UserProfile from '../models/UserProfile.js';

/**
 * @desc    Get current user's fitness profile
 * @route   GET /api/profile
 * @access  Private
 */
export const getProfile = async (req, res, next) => {
  try {
    const profile = await UserProfile.findOne({ userId: req.user._id || req.user.id });

    if (!profile) {
      return res.status(200).json({
        success: true,
        hasProfile: false,
        profile: null,
      });
    }

    res.status(200).json({
      success: true,
      hasProfile: true,
      profile,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create or update user's fitness profile
 * @route   PUT /api/profile
 * @access  Private
 */
export const updateProfile = async (req, res, next) => {
  try {
    const {
      age,
      heightCm,
      weightKg,
      fitnessGoal,
      experienceLevel,
      availableDaysPerWeek,
      preferredSplit,
      injuriesOrLimitations,
    } = req.body;

    const userId = req.user._id || req.user.id;

    // Validate required fields
    if (!age || !heightCm || !weightKg || !fitnessGoal || !experienceLevel) {
      return res.status(400).json({
        success: false,
        message: 'Please provide age, height, weight, fitness goal, and experience level.',
      });
    }

    const validGoals = ['weight_loss', 'muscle_gain', 'endurance', 'general_fitness'];
    if (!validGoals.includes(fitnessGoal)) {
      return res.status(400).json({
        success: false,
        message: `Fitness goal must be one of: ${validGoals.join(', ')}`,
      });
    }

    const validLevels = ['beginner', 'intermediate', 'advanced'];
    if (!validLevels.includes(experienceLevel)) {
      return res.status(400).json({
        success: false,
        message: `Experience level must be one of: ${validLevels.join(', ')}`,
      });
    }

    const profileData = {
      userId,
      age: Number(age),
      heightCm: Number(heightCm),
      weightKg: Number(weightKg),
      fitnessGoal,
      experienceLevel,
      availableDaysPerWeek: availableDaysPerWeek ? Number(availableDaysPerWeek) : 4,
      preferredSplit: preferredSplit || 'full_body',
      injuriesOrLimitations: injuriesOrLimitations ? injuriesOrLimitations.trim() : '',
    };

    const profile = await UserProfile.findOneAndUpdate(
      { userId },
      { $set: profileData },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Fitness profile updated successfully.',
      hasProfile: true,
      profile,
    });
  } catch (error) {
    next(error);
  }
};
