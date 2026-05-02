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
    position: { type: Number, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    // Priority field for additional ordering control (higher number = higher priority)
    priority: { type: Number, default: 0, index: true },
    displayInNavbar: { type: Boolean, default: true }, // Control navbar visibility
  },
  {
    timestamps: true,
  }
);

export const Category =
  mongoose.models.Category ||
  mongoose.model("Category", categorySchema);
