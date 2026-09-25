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
    loginOtpHash: { type: String }, // Hashed login OTP (admin/accountant 2FA)
    loginOtpExpiry: { type: Date }, // Expiry for the login OTP
    // Proof that OTP was verified — required by NextAuth authorize() for
    // admin/accountant so OTP cannot be bypassed via the normal login page.
    loginOtpProofHash: { type: String },
    loginOtpProofExpiry: { type: Date },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.models.User || mongoose.model("User", userSchema);