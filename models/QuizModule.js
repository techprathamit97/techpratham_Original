import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
    trim: true
  },
  questionType: {
    type: String,
    enum: ['multiple_choice', 'true_false'],
    required: true
  },
  // For multiple choice questions
  options: [{
    text: String,
    isCorrect: Boolean
  }],
  // For true/false questions
  correctAnswer: {
    type: Boolean // true or false
  },
  explanation: {
    type: String,
    trim: true
  },
  marks: {
    type: Number,
    required: true,
    min: 1
  }
}, { _id: true });

const ModuleStepSchema = new mongoose.Schema({
  stepNumber: {
    type: Number,
    required: true,
    min: 1
  },
  stepTitle: {
    type: String,
    required: true,
    trim: true
  },
  stepDescription: {
    type: String,
    trim: true
  },
  timing: {
    type: Number, // in minutes for this step
    required: true,
    min: 1
  },
  passingMarks: {
    type: Number,
    required: true,
    min: 0
  },
  questions: [QuestionSchema],
  isActive: {
    type: Boolean,
    default: true
  }
}, { _id: true });

const QuizModuleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  moduleType: {
    type: String,
    enum: ['single_step', 'multi_step'],
    default: 'multi_step'
  },
  // For multi-step quizzes
  steps: [ModuleStepSchema],
  // For single-step quizzes (backward compatibility)
  timing: {
    type: Number, // in minutes
    min: 1
  },
  passingMarks: {
    type: Number,
    min: 0
  },
  maxMarks: {
    type: Number,
    min: 1
  },
  eachQuestionMarks: {
    type: Number,
    min: 1,
    default: 1
  },
  negativeMarking: {
    enabled: {
      type: Boolean,
      default: false
    },
    marksDeducted: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  questions: [QuestionSchema], // For single-step quizzes
  // Module settings
  allowStepNavigation: {
    type: Boolean,
    default: false // If true, users can navigate between steps
  },
  requireSequentialCompletion: {
    type: Boolean,
    default: true // If true, must complete steps in order
  },
  showStepResults: {
    type: Boolean,
    default: false // If true, show results after each step
  },
  overallPassingPercentage: {
    type: Number,
    default: 70 // Overall passing percentage for the entire module
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
QuizModuleSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Calculate total questions for multi-step
QuizModuleSchema.virtual('totalQuestions').get(function() {
  if (this.moduleType === 'multi_step') {
    return this.steps.reduce((total, step) => total + step.questions.length, 0);
  }
  return this.questions.length;
});

// Calculate total timing for multi-step
QuizModuleSchema.virtual('totalTiming').get(function() {
  if (this.moduleType === 'multi_step') {
    return this.steps.reduce((total, step) => total + step.timing, 0);
  }
  return this.timing;
});

// Calculate total max marks for multi-step
QuizModuleSchema.virtual('totalMaxMarks').get(function() {
  if (this.moduleType === 'multi_step') {
    return this.steps.reduce((total, step) => 
      total + (step.questions.length * this.eachQuestionMarks), 0);
  }
  return this.maxMarks;
});

// Calculate passing percentage
QuizModuleSchema.virtual('passingPercentage').get(function() {
  if (this.moduleType === 'multi_step') {
    return this.overallPassingPercentage;
  }
  return ((this.passingMarks / this.maxMarks) * 100).toFixed(2);
});

export default mongoose.models.QuizModule || mongoose.model('QuizModule', QuizModuleSchema);