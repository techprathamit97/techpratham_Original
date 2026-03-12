
import mongoose from "mongoose";

/* ---------------- SUB-SECTION ---------------- */
const subSectionSchema = new mongoose.Schema({
  type: { type: String, required: true },
  title: { type: String, required: true },
  slug: { type: String, required: true },
  link: { type: String },
  puckData: {
    type: mongoose.Schema.Types.Mixed,
    default: { root: {}, content: [] }
  }
});

/* ---------------- SECTION ---------------- */
const sectionSchema = new mongoose.Schema({
  type: { type: String, required: true },
  title: { type: String, required: true },
  slug: { type: String, required: true },
  link: { type: String },

  puckData: {
    type: mongoose.Schema.Types.Mixed,
    default: { root: {}, content: [] }
  },

  // ✅ NEW: sub-sections
  subSections: {
    type: [subSectionSchema],
    default: []
  }
});

/* ---------------- LESSON ---------------- */
const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true },
  link: { type: String },

  puckData: {
    type: mongoose.Schema.Types.Mixed,
    default: { root: {}, content: [] }
  },

  sections: [sectionSchema]
});

/* ---------------- PAGE (LMS CONTENT) ---------------- */
const lmsContentSchema = new mongoose.Schema(
  {
    courseId: { type: String, required: true, unique: true, index: true },
    title: String,
    sidebar: [lessonSchema]
  },
  { timestamps: true }
);

lessonSchema.index({ slug: 1 });
sectionSchema.index({ slug: 1 });
subSectionSchema.index({ slug: 1 });

// Add compound index for faster queries
lmsContentSchema.index({ courseId: 1, "sidebar.slug": 1 });
lmsContentSchema.index({ courseId: 1, "sidebar.sections.slug": 1 });
lmsContentSchema.index({ courseId: 1, "sidebar.sections.subSections.slug": 1 });


export default mongoose.models.LmsContent ||
  mongoose.model("LmsContent", lmsContentSchema);
