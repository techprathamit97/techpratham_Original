import mongoose from "mongoose";

const categoryHierarchySchema = new mongoose.Schema(
  {
    position: { type: Number, default: 1 },
    title: { type: String, required: true },
    slug: { type: String, required: true },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'CategoryHierarchy', default: null },
    level: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true
  }
);

// Use a different collection name to avoid the old indexes
categoryHierarchySchema.index({ parentId: 1, position: 1 });

export const CategoryHierarchy = mongoose.models.CategoryHierarchy ||
  mongoose.model("CategoryHierarchy", categoryHierarchySchema, "categoryHierarchy");