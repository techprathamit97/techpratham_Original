import mongoose from "mongoose";

const reviewImageSchema = new mongoose.Schema(
  {
    altText: { 
      type: String, 
      required: true,
      trim: true,
      default: "Student review testimonial"
    },
    imageUrl: { 
      type: String, 
      required: true,
      trim: true
    },
    displayOrder: { 
      type: Number, 
      default: 0 
    },
    // S3 file management
    fileKey: { 
      type: String,
      required: false, // Made optional for manual URL entries
      trim: true
    }
  },
  {
    timestamps: true,
  }
);

// Indexes for better performance
reviewImageSchema.index({ displayOrder: 1 });

export default mongoose.models.ReviewImage || mongoose.model("ReviewImage", reviewImageSchema);