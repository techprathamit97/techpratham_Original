import mongoose, { Schema, model, models } from "mongoose";

const LeadSchema = new Schema(
  {
    fullName: String,
    email: String,
    phone: String,
    course: String,
    message: String,

    formType: {
      type: String,
      required: true, // reach-form, lead-form, certificate, etc
    },

    status: {
      type: String,
      enum: ['reached', 'unreached'],
      default: 'unreached'
    },

    ipAddress: String,

    metadata: {
      type: Object, // extra form-specific data
      default: {},
    },
  },
  { timestamps: true }
);

export const Lead =
  models.lead_data || model("lead_data", LeadSchema);
