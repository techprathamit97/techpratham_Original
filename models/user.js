import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    phone: { type: String, default: "" },
    name: { type: String, default: "" },
    profile: { type: String, default: "" },
    password: { type: String, default: "" },
    role: {
      type: { type: String, default: "user" },
      position: { type: String, default: "" },
      studentId: { type: String, default: "" },
    },
    courses: {
      enrolled: [{ type: String, default: [] }],
      completed: [{ type: String, default: [] }],
    },
    isPlaceholder: { type: Boolean, default: false }, // For users created automatically for invoices
    emailVerified: { type: Boolean, default: false }, // Email verification status
    emailVerificationToken: { type: String }, // Token for email verification
    emailVerificationExpiry: { type: Date }, // Expiry for verification token
    resetPasswordToken: { type: String }, // Token for password reset
    resetPasswordExpiry: { type: Date }, // Expiry for reset token
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.models.User || mongoose.model("User", userSchema);