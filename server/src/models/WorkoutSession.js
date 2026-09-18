import mongoose from 'mongoose';

const workoutExerciseItemSchema = new mongoose.Schema({
  exerciseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise',
  },
  exerciseName: {
    type: String,
    required: [true, 'Exercise name is required'],
    trim: true,
  },
  sets: {
    type: Number,
    required: [true, 'Sets count is required'],
    min: [1, 'Must have at least 1 set'],
    max: [30, 'Cannot exceed 30 sets per exercise'],
  },
  reps: {
    type: Number,
    default: 0,
    min: [0, 'Reps cannot be negative'],
    max: [500, 'Reps cannot exceed 500'],
  },
  weightKg: {
    type: Number,
    default: 0,
    min: [0, 'Weight cannot be negative'],
    max: [1000, 'Weight cannot exceed 1000 kg'],
  },
  durationMin: {
    type: Number,
    default: 0,
    min: [0, 'Duration cannot be negative'],
  },
  notes: {
    type: String,
    trim: true,
    default: '',
  },
});

const workoutSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    title: {
      type: String,
      trim: true,
      default: 'Workout Session',
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    date: {
      type: Date,
      default: Date.now,
      index: true,
    },
    exercises: {
      type: [workoutExerciseItemSchema],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'A workout must contain at least one exercise',
      },
    },
    totalDurationMin: {
      type: Number,
      default: 45,
      min: [1, 'Workout duration must be at least 1 minute'],
      max: [720, 'Workout duration cannot exceed 12 hours'],
    },
    source: {
      type: String,
      enum: ['manual', 'ai_generated'],
      default: 'manual',
      index: true,
    },
    aiSuggestionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AiSuggestion',
      default: null,
    },
    notes: {
      type: String,
      trim: true,
      default: '',
      maxlength: [1000, 'Workout notes cannot exceed 1000 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for calculating total volume (weightKg * reps * sets)
workoutSessionSchema.virtual('totalVolumeKg').get(function () {
  if (!this.exercises) return 0;
  return this.exercises.reduce((total, ex) => {
    return total + (ex.weightKg || 0) * (ex.reps || 0) * (ex.sets || 1);
  }, 0);
});

workoutSessionSchema.set('toJSON', { virtuals: true });
workoutSessionSchema.set('toObject', { virtuals: true });

const WorkoutSession = mongoose.model('WorkoutSession', workoutSessionSchema);

export default WorkoutSession;
