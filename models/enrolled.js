import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema({
  enrolledDate: { type: Date, required: true },
  completionDate: { type: Date, required: true },
  certificateId: { type: String, required: true },
});

const enrolledSchema = new mongoose.Schema(
  {
    course_link: { type: String, required: true },
    course_title: { type: String, required: true },
    course_desc: { type: String, required: true },
    duration: { type: String, required: true },
    level: { type: String, required: true },
    category: { type: String, required: true },
    email: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    studentId: { type: String, default: "" },
    batchId: { type: String, default: "" }, // Link to batch
    trainerId: { type: String, default: "" }, // Link to trainer
    advance: { type: Boolean, default: false },
    advanceAmount: { type: Number, default: 0 },
    finalPayment: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
    verifyPayment: { type: Boolean, default: false },
    receiptNo: { type: String, default: "" },
    feeType: { 
      type: String, 
      enum: ['Full Payment', '2 Installments', '3 Installments', '4 Installments'],
      default: 'Full Payment' 
    },
    installmentDates: [{
      installmentNumber: { type: Number },
      dueDate: { type: Date },
      amount: { type: Number },
      paid: { type: Boolean, default: false },
      paidDate: { type: Date }
    }],
    dueDate: { type: String, default: "" },
    courseCompletion: { type: Boolean, default: false },
    progressPercentage: { type: Number, default: 0 }, // Track learning progress
    lastAccessedAt: { type: Date, default: Date.now }, // Track engagement
    quizScores: [{
      quizId: { type: String },
      score: { type: Number },
      attempts: { type: Number, default: 1 },
      passed: { type: Boolean, default: false },
      completedAt: { type: Date, default: Date.now }
    }],
    certificate: {
      type: certificateSchema,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate student ID
enrolledSchema.pre('save', async function(next) {
  if (!this.studentId || this.studentId === '' || this.studentId === 'N/A') {
    try {
      const count = await this.constructor.countDocuments();
      this.studentId = `TP${String(count + 1).padStart(6, '0')}`;
    } catch (error) {
      // Fallback to timestamp-based ID
      this.studentId = `TP${Date.now()}`;
    }
  }
  next();
});

export default mongoose.models.Enrolled ||
  mongoose.model("Enrolled", enrolledSchema);
