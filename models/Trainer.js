import mongoose from "mongoose";

const trainerSchema = new mongoose.Schema(
  {
    trainerId: { type: String, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    profile: { type: String, default: "" }, // Profile image URL
    experience: { type: String, required: true }, // e.g., "5+ years"
    expertise: [{ type: String }], // Array of skills/technologies
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    bio: { type: String, default: "" },
    linkedIn: { type: String, default: "" },
    github: { type: String, default: "" },
    portfolio: { type: String, default: "" },
    assignedBatches: [{ type: String }], // Array of batch IDs
    totalStudents: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    joinedAt: { type: Date, default: Date.now },
    salary: { type: Number, default: 0 },
    paymentMode: { 
      type: String, 
      enum: ['Monthly', 'Per Batch', 'Per Student', 'Hourly'],
      default: 'Monthly' 
    }
  },
  {
    timestamps: true,
  }
);

// Auto-generate trainer ID
trainerSchema.pre('save', async function(next) {
  if (!this.trainerId) {
    const count = await this.constructor.countDocuments();
    this.trainerId = `TR${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

export default mongoose.models.Trainer || mongoose.model("Trainer", trainerSchema);