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
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.models.User || mongoose.model("User", userSchema);