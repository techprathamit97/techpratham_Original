import mongoose from "mongoose";

const batchSchema = new mongoose.Schema(
  {
    batchId: { type: String, unique: true },
    course_link: { type: String, required: true },
    course_title: { type: String, required: true },
    trainerId: { type: String, required: true }, // Trainer's Login ID (e.g., TR0001)
    schedule: {
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true },
      timing: { type: String, required: true }, // e.g., "10:00 AM - 12:00 PM"
      days: [{ type: String }] // e.g., ["Monday", "Wednesday", "Friday"]
    },
    capacity: { type: Number, default: 30 },
    enrolled_students: [{ type: String }], // Array of student IDs from ManualInvoice.customerDetails.studentId
    status: { 
      type: String, 
      enum: ['upcoming', 'ongoing', 'completed'], 
      default: 'upcoming' 
    },
    meetingLink: { type: String, default: "" },
    description: { type: String, default: "" }
  },
  {
    timestamps: true,
  }
);

// Auto-generate batch ID
batchSchema.pre('save', async function(next) {
  if (!this.batchId) {
    const count = await this.constructor.countDocuments();
    this.batchId = `BATCH${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

export default mongoose.models.Batch || mongoose.model("Batch", batchSchema);