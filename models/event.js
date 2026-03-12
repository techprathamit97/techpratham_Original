import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["video", "placement", "hiring"],
      required: true,
    },
    title: String,
    description: String,
    videoUrl: String,
    image: String,
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Event ||
  mongoose.model("Event", EventSchema);
