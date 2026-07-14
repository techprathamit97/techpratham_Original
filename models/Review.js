import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5']
    },
    review: {
      type: String,
      required: [true, 'Review text is required'],
      trim: true,
      minlength: [10, 'Review must be at least 10 characters'],
      maxlength: [1000, 'Review cannot exceed 1000 characters']
    },
    email: {
      type: String,
      default: null
    },
    profileImage: {
      type: String,
      default: null
    },
    profileImageKey: {
      type: String,
      default: null
    },
    publishDate: {
      type: Date,
      required: [true, 'Publish date is required'],
      default: Date.now
    },
    isApproved: {
      type: Boolean,
      default: false
    },
    isPublished: {
      type: Boolean,
      default: false
    },
    isFeatured: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Index for faster queries
ReviewSchema.index({ isApproved: 1, isPublished: 1 });
ReviewSchema.index({ rating: -1 });
ReviewSchema.index({ publishDate: -1 });
ReviewSchema.index({ createdAt: -1 });

export default mongoose.models.Review || mongoose.model('Review', ReviewSchema);
