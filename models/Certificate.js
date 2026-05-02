import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    certificateId: { type: String, unique: true },
    studentName: { type: String, required: true },
    studentEmail: { type: String, required: true },
    courseName: { type: String, required: true },
    courseCategory: { type: String, required: true },
    completionDate: { type: Date, default: Date.now },
    issueDate: { type: Date },
    grade: { 
      type: String, 
      enum: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F'],
      required: true 
    },
    score: { type: Number, required: true, min: 0, max: 100 },
    batchId: { type: String, default: "" },
    trainerName: { type: String, default: "" },
    status: { 
      type: String, 
      enum: ['pending', 'issued', 'revoked'], 
      default: 'pending' 
    },
    certificateUrl: { type: String, default: "" },
    verificationCode: { type: String, unique: true },
    template: { 
      type: String, 
      enum: ['standard', 'premium', 'modern', 'classic'],
      default: 'standard' 
    },
    customMessage: { type: String, default: "" },
    metadata: {
      duration: { type: String, default: "" },
      skills: [{ type: String }],
      projects: [{ type: String }]
    }
  },
  {
    timestamps: true,
  }
);

// Auto-generate certificate ID and verification code
certificateSchema.pre('save', async function(next) {
  if (!this.certificateId) {
    const count = await this.constructor.countDocuments();
    this.certificateId = `CERT${String(count + 1).padStart(6, '0')}`;
  }
  
  if (!this.verificationCode) {
    this.verificationCode = `TP${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
  }
  
  // Set issue date when status changes to issued
  if (this.status === 'issued' && !this.issueDate) {
    this.issueDate = new Date();
  }
  
  next();
});

export default mongoose.models.Certificate || mongoose.model("Certificate", certificateSchema);