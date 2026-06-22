// import mongoose from "mongoose";
// import { type } from "os";
// import { number } from "zod";

// const categorySchema = new mongoose.Schema(
//    {
//     index: {type: Number, require:true, unique: true},
//   },
//   {
//     name: { type: String, required: true, unique: true },
//     description: { type: String, required: true },
//   },
//   {
//     timestamps: true,
//   }
// );

// export const Category =
//   mongoose.models.Category || mongoose.model("Category", categorySchema);

import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    position: { type: Number, default: 1 },
    name: { type: String, required: true }, // Changed from title to name for consistency
    slug: { type: String, required: true },
    description: { type: String, default: '' }, // Optional description

    // Hierarchical structure fields
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
    level: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    displayInNavbar: { type: Boolean, default: true },
    
    // Nested subcategories as JSON array
    subcategories: { type: Array, default: [] }, // Array of nested subcategory objects
  },
  {
    timestamps: true
  }
);

// Simple indexes (no unique constraints)
categorySchema.index({ parentId: 1, position: 1 });
categorySchema.index({ slug: 1 });

// Force delete cached model to use new schema
if (mongoose.models.Category) {
  delete mongoose.models.Category;
}

export const Category = mongoose.model("Category", categorySchema);
