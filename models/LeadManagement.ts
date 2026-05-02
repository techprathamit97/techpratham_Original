import mongoose, { Schema, model, models } from "mongoose";

const LeadManagementSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      required: true,
      enum: ['instagram', 'facebook', 'website', 'referral', 'other'],
      default: 'other'
    },
    course: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      required: true,
      enum: ['new', 'contacted', 'interested', 'converted', 'closed'],
      default: 'new'
    },
    notes: {
      type: String,
      default: '',
    },
    assignedTo: {
      type: String,
      default: '',
    },
    convertedToInvoice: {
      type: Boolean,
      default: false,
    },
    invoiceId: {
      type: String,
      default: '',
    }
  },
  { 
    timestamps: true,
    collection: 'lead_management' // Separate collection from form leads
  }
);

export const LeadManagement = 
  models.LeadManagement || model("LeadManagement", LeadManagementSchema);