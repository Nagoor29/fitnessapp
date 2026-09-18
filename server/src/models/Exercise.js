import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Exercise name is required'],
      unique: true,
      trim: true,
      index: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['strength', 'cardio', 'mobility', 'hiit'],
        message: 'Category must be strength, cardio, mobility, or hiit',
      },
      index: true,
    },
    muscleGroups: {
      type: [String],
      required: [true, 'At least one target muscle group is required'],
      index: true,
    },
    equipment: {
      type: String,
      required: [true, 'Equipment requirement is required'],
      enum: ['bodyweight', 'barbell', 'dumbbell', 'cable', 'machine', 'kettlebell', 'bands', 'cardio_machine', 'other'],
      default: 'bodyweight',
    },
    difficulty: {
      type: String,
      required: true,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    instructions: {
      type: String,
      required: [true, 'Exercise instructions are required'],
    },
    tips: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Text index for fast multi-field search
exerciseSchema.index({ name: 'text', instructions: 'text' });

const Exercise = mongoose.model('Exercise', exerciseSchema);

export default Exercise;
