import mongoose from 'mongoose';

const StepAttemptSchema = new mongoose.Schema({
  stepId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  stepNumber: {
    type: Number,
    required: true
  },
  stepTitle: {
    type: String,
    required: true
  },
  answers: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    selectedAnswer: {
      type: mongoose.Schema.Types.Mixed, // Can be number (for multiple choice) or boolean (for true/false)
      required: true
    },
    isCorrect: {
      type: Boolean,
      required: true
    },
    marksAwarded: {
      type: Number,
      required: true
    }
  }],
  totalMarks: {
    type: Number,
    required: true
  },
  maxMarks: {
    type: Number,
    required: true
  },
  percentage: {
    type: Number,
    required: true
  },
  passed: {
    type: Boolean,
    required: true
  },
  timeSpent: {
    type: Number, // in seconds
    required: true
  },
  startedAt: {
    type: Date,
    required: true
  },
  completedAt: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['completed', 'in_progress', 'not_started'],
    default: 'completed'
  }
}, { _id: true });

const QuizModuleAttemptSchema = new mongoose.Schema({
  quizModuleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'QuizModule',
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  moduleType: {
    type: String,
    enum: ['single_step', 'multi_step'],
    required: true
  },
  // For multi-step quizzes
  stepAttempts: [StepAttemptSchema],
  currentStep: {
    type: Number,
    default: 1
  },
  // For single-step quizzes (backward compatibility)
  answers: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    selectedAnswer: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    isCorrect: {
      type: Boolean,
      required: true
    },
    marksAwarded: {
      type: Number,
      required: true
    }
  }],
  // Overall results
  totalMarks: {
    type: Number,
    required: true
  },
  maxMarks: {
    type: Number,
    required: true
  },
  percentage: {
    type: Number,
    required: true
  },
  passed: {
    type: Boolean,
    required: true
  },
  overallTimeSpent: {
    type: Number, // in seconds
    required: true
  },
  status: {
    type: String,
    enum: ['completed', 'in_progress', 'not_started'],
    default: 'in_progress'
  },
  startedAt: {
    type: Date,
    required: true
  },
  completedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
QuizModuleAttemptSchema.index({ quizModuleId: 1, userId: 1 });
QuizModuleAttemptSchema.index({ quizModuleId: 1, createdAt: -1 });
QuizModuleAttemptSchema.index({ userId: 1, createdAt: -1 });

// Virtual for completed steps count
QuizModuleAttemptSchema.virtual('completedStepsCount').get(function() {
  if (this.moduleType === 'multi_step') {
    return this.stepAttempts.filter(step => step.status === 'completed').length;
  }
  return this.status === 'completed' ? 1 : 0;
});

// Virtual for total steps count
QuizModuleAttemptSchema.virtual('totalStepsCount').get(function() {
  if (this.moduleType === 'multi_step') {
    return this.stepAttempts.length;
  }
  return 1;
});

// Virtual for progress percentage
QuizModuleAttemptSchema.virtual('progressPercentage').get(function() {
  if (this.moduleType === 'multi_step') {
    const completed = this.stepAttempts.filter(step => step.status === 'completed').length;
    return Math.round((completed / this.stepAttempts.length) * 100);
  }
  return this.status === 'completed' ? 100 : 0;
});

export default mongoose.models.QuizModuleAttempt || mongoose.model('QuizModuleAttempt', QuizModuleAttemptSchema);