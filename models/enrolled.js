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
    advance: { type: Boolean, default: false },
    advanceAmount: { type: Number, default: 0 },
    finalPayment: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
    verifyPayment: { type: Boolean, default: false },
    receiptNo: { type: String, default: "" },
    feeType: { type: String, default: "" },
    dueDate: { type: String, default: "" },
    courseCompletion: { type: Boolean, default: false },
    certificate: {
      type: certificateSchema,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Enrolled ||
  mongoose.model("Enrolled", enrolledSchema);
