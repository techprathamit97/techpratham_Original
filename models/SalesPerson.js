import mongoose from "mongoose";

const salesPersonSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true // Ensure unique names
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    collection: 'salespersons' // Use different collection name to avoid old indexes
  }
);

// Create indexes for the new collection
salesPersonSchema.index({ name: 1 }, { unique: true });
salesPersonSchema.index({ isActive: 1 });

// Ensure model is not re-compiled
const SalesPerson = mongoose.models.SalesPerson || mongoose.model("SalesPerson", salesPersonSchema);

export default SalesPerson;