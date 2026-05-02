import mongoose from "mongoose";

const trainerAuthSchema = new mongoose.Schema(
  {
    trainerId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    assignedBatches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Batch' }],
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.TrainerAuth || mongoose.model("TrainerAuth", trainerAuthSchema);
