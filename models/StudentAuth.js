import mongoose from "mongoose";

const studentAuthSchema = new mongoose.Schema(
  {
    studentId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Enrolled' }],
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.StudentAuth || mongoose.model("StudentAuth", studentAuthSchema);
