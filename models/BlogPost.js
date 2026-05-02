import mongoose from "mongoose";

const blogPostSchema = new mongoose.Schema(
  {
    // Basic fields
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    excerpt: { type: String, required: true, maxlength: 150 },
    author: { type: String, required: true, default: "TechPratham Team" },
    category: { type: String, required: true },
    categorySlug: { type: String, required: true },
    tags: [{ type: String }],
    
    // Images
    featuredImage: { 
      url: { type: String, required: true },
      alt: { type: String, required: true },
      caption: { type: String },
      fileKey: { type: String } // For AWS S3 file management
    },
    
    // Publishing
    publishedAt: { type: Date, default: Date.now },
    scheduledAt: { type: Date },
    status: { 
      type: String, 
      enum: ['draft', 'under-review', 'published', 'archived'], 
      default: 'draft' 
    },
    
    // Rich content using Puck.js (same as e-book)
    puckData: {
      type: mongoose.Schema.Types.Mixed,
      default: { root: {}, content: [] }
    },
    
    // SEO fields (comprehensive)
    seo: {
      metaTitle: { type: String, maxlength: 60 },
      metaDescription: { type: String, maxlength: 160 },
      focusKeyword: { type: String },
      secondaryKeywords: [{ type: String }],
      canonicalUrl: { type: String },
      
      // Open Graph
      ogTitle: { type: String, maxlength: 60 },
      ogDescription: { type: String, maxlength: 200 },
      ogImage: { type: String },
      
      // Twitter
      twitterCardType: { 
        type: String, 
        enum: ['summary', 'summary_large_image', 'app', 'player'],
        default: 'summary_large_image'
      },
      
      // Robots
      robotsDirective: { 
        type: String, 
        enum: ['index,follow', 'noindex,nofollow', 'index,nofollow', 'noindex,follow'],
        default: 'index,follow'
      },
      
      // Schema
      schemaType: {
        type: String,
        enum: ['Article', 'HowTo', 'FAQPage', 'NewsArticle'],
        default: 'Article'
      }
    },
    
    // Content features
    tableOfContents: {
      enabled: { type: Boolean, default: false },
      items: [{
        level: Number,
        title: String,
        anchor: String
      }]
    },
    
    faqSection: [{
      question: { type: String, required: true },
      answer: { type: String, required: true }
    }],
    
    // Analytics
    viewCount: { type: Number, default: 0 },
    readingTime: { type: Number }, // in minutes
    
    // Auto-generated fields
    wordCount: { type: Number, default: 0 },
    lastModified: { type: Date, default: Date.now },
    
    // Redirects (for slug changes)
    oldSlugs: [{ type: String }]
  },
  {
    timestamps: true,
  }
);

// Auto-generate reading time based on word count
blogPostSchema.pre('save', function(next) {
  if (this.wordCount) {
    this.readingTime = Math.ceil(this.wordCount / 200); // 200 words per minute
  }
  this.lastModified = new Date();
  next();
});

// Indexes for better performance
blogPostSchema.index({ status: 1, publishedAt: -1 });
blogPostSchema.index({ category: 1, status: 1 });
blogPostSchema.index({ categorySlug: 1, status: 1 });
blogPostSchema.index({ tags: 1, status: 1 });
blogPostSchema.index({ slug: 1 }, { unique: true });
blogPostSchema.index({ oldSlugs: 1 });
blogPostSchema.index({ 'seo.focusKeyword': 1 });

export default mongoose.models.BlogPost || mongoose.model("BlogPost", blogPostSchema);