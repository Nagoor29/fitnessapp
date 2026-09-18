import mongoose from 'mongoose';

const aiSuggestionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    prompt: {
      type: String,
      required: true,
    },
    focusArea: {
      type: String,
      default: 'Full Body',
    },
    generatedPlan: {
      title: { type: String, required: true },
      rationale: { type: String, default: '' },
      estimatedDurationMin: { type: Number, default: 45 },
      difficulty: { type: String, default: 'intermediate' },
      exercises: [
        {
          exerciseName: { type: String, required: true },
          exerciseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' },
          targetSets: { type: Number, required: true },
          targetReps: { type: Number, default: 10 },
          targetWeightKg: { type: Number, default: 0 },
          durationMin: { type: Number, default: 0 },
          restSeconds: { type: Number, default: 60 },
          formTips: { type: String, default: '' },
        },
      ],
    },
    accepted: {
      type: Boolean,
      default: false,
      index: true,
    },
    workoutSessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WorkoutSession',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const AiSuggestion = mongoose.model('AiSuggestion', aiSuggestionSchema);

export default AiSuggestion;
