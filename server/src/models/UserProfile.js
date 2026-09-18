import mongoose from 'mongoose';

const userProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required for profile'],
      unique: true,
      index: true,
    },
    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: [12, 'Age must be at least 12'],
      max: [120, 'Age must be under 120'],
    },
    heightCm: {
      type: Number,
      required: [true, 'Height in cm is required'],
      min: [50, 'Height must be at least 50 cm'],
      max: [280, 'Height must be under 280 cm'],
    },
    weightKg: {
      type: Number,
      required: [true, 'Weight in kg is required'],
      min: [20, 'Weight must be at least 20 kg'],
      max: [400, 'Weight must be under 400 kg'],
    },
    fitnessGoal: {
      type: String,
      required: [true, 'Fitness goal is required'],
      enum: {
        values: ['weight_loss', 'muscle_gain', 'endurance', 'general_fitness'],
        message: 'Invalid fitness goal. Must be weight_loss, muscle_gain, endurance, or general_fitness',
      },
    },
    experienceLevel: {
      type: String,
      required: [true, 'Experience level is required'],
      enum: {
        values: ['beginner', 'intermediate', 'advanced'],
        message: 'Invalid experience level. Must be beginner, intermediate, or advanced',
      },
    },
    availableDaysPerWeek: {
      type: Number,
      required: [true, 'Available training days per week is required'],
      min: [1, 'Must train at least 1 day per week'],
      max: [7, 'Maximum 7 days per week'],
      default: 4,
    },
    preferredSplit: {
      type: String,
      enum: ['full_body', 'push_pull_legs', 'upper_lower', 'body_part', 'custom'],
      default: 'full_body',
    },
    injuriesOrLimitations: {
      type: String,
      trim: true,
      default: '',
      maxlength: [500, 'Limitations notes cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Virtual field to calculate approximate BMI
userProfileSchema.virtual('bmi').get(function () {
  if (this.heightCm && this.weightKg) {
    const heightM = this.heightCm / 100;
    return parseFloat((this.weightKg / (heightM * heightM)).toFixed(1));
  }
  return null;
});

userProfileSchema.set('toJSON', { virtuals: true });
userProfileSchema.set('toObject', { virtuals: true });

const UserProfile = mongoose.model('UserProfile', userProfileSchema);

export default UserProfile;
