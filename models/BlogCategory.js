import mongoose from "mongoose";

const blogCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String },
    
    // SEO fields for category pages
    seo: {
      metaTitle: { type: String, maxlength: 60 },
      metaDescription: { type: String, maxlength: 160 },
      ogTitle: { type: String, maxlength: 60 },
      ogDescription: { type: String, maxlength: 200 },
      ogImage: { type: String },
      robotsDirective: { 
        type: String, 
        enum: ['index,follow', 'noindex,nofollow', 'index,nofollow', 'noindex,follow'],
        default: 'index,follow'
      }
    },
    
    // Optional parent category for nested structure
    parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'BlogCategory' },
    
    // Display order
    order: { type: Number, default: 0 },
    
    // Status
    isActive: { type: Boolean, default: true }
  },
  {
    timestamps: true,
  }
);

// Indexes
blogCategorySchema.index({ slug: 1 }, { unique: true });
blogCategorySchema.index({ isActive: 1, order: 1 });
blogCategorySchema.index({ parentCategory: 1 });

export default mongoose.models.BlogCategory || mongoose.model("BlogCategory", blogCategorySchema);