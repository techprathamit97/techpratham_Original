import mongoose from 'mongoose';

const QuizAttemptSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
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
  answers: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    questionText: String, // Store question text for reference
    selectedAnswer: {
      type: mongoose.Schema.Types.Mixed, // Can be number (for multiple choice) or boolean (for true/false) or null (unanswered)
      required: false, // Allow null for unanswered questions
      default: null
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
  // For multi-step quizzes
  stepResults: [{
    stepNumber: Number,
    stepTitle: String,
    answers: [{
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
      },
      questionText: String,
      selectedAnswer: {
        type: mongoose.Schema.Types.Mixed,
        required: false,
        default: null
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
    totalMarks: Number,
    maxMarks: Number,
    percentage: Number,
    passed: Boolean,
    correctAnswers: Number,
    totalQuestions: Number
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
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
QuizAttemptSchema.index({ quizId: 1, userId: 1 });
QuizAttemptSchema.index({ quizId: 1, createdAt: -1 });
QuizAttemptSchema.index({ userId: 1, createdAt: -1 });

// Virtual for attempt duration in minutes
QuizAttemptSchema.virtual('durationMinutes').get(function() {
  return Math.round(this.timeSpent / 60);
});

// Virtual for correct answers count
QuizAttemptSchema.virtual('correctAnswers').get(function() {
  return this.answers.filter(answer => answer.isCorrect).length;
});

// Virtual for incorrect answers count
QuizAttemptSchema.virtual('incorrectAnswers').get(function() {
  return this.answers.filter(answer => !answer.isCorrect).length;
});

export default mongoose.models.QuizAttempt || mongoose.model('QuizAttempt', QuizAttemptSchema);