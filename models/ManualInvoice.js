import mongoose from "mongoose";
import { generateUniqueInvoiceNumber } from "../utils/invoiceNumberGenerator.js";

const invoiceItemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
  unitPrice: { type: Number, required: true },
  amount: { type: Number, required: true }
});

const manualInvoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: { 
      type: String, 
      unique: true,
      index: true 
    },
    receiptNo: { type: String, required: true },
    
    // Optional references (not required for manual invoices)
    enrollmentId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Enrolled', 
      required: false,
      default: null
    },
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: false,
      default: null
    },
    
    // Manual invoice tracking
    isManual: { type: Boolean, default: true },
    source: { 
      type: String, 
      enum: ['manual_entry', 'instagram_lead', 'facebook_lead', 'direct_payment', 'referral'],
      default: 'manual_entry'
    },
    
    // Customer Details (all required for manual invoices)
    customerDetails: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      studentId: { type: String, required: true }
    },
    
    // Course Details (flexible for manual invoices)
    courseDetails: {
      title: { type: String, required: true },
      link: { type: String, default: 'https://techpratham.com' },
      category: { type: String, required: true },
      duration: { type: String, default: 'N/A' },
      level: { type: String, default: 'Beginner' }
    },
    
    // Invoice Items
    items: [invoiceItemSchema],
    
    // Financial Details
    subtotal: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    pendingAmount: { type: Number, required: true },
    
    // Payment Details
    feeType: { type: String, required: true, default: 'Full Payment' },
    installmentDates: [{
      installmentNumber: { type: Number },
      dueDate: { type: Date },
      amount: { type: Number }
    }],
    installmentPayments: [{
      installmentNumber: { type: Number },
      paidDate: { type: Date },
      amount: { type: Number },
      paymentMode: { type: String }
    }],
    paymentMode: { 
      type: String, 
      enum: ['online', 'cash', 'credit_card', 'debit_card', 'bank_transfer', 'cheque', 'upi'],
      default: 'online'
    },
    dueDate: { type: Date },
    paidDate: { type: Date },
    paymentScreenshot: { type: String }, // URL to payment screenshot
    paymentScreenshots: [{
      url: { type: String, required: true },
      uploadDate: { type: Date, default: Date.now },
      paymentNumber: { type: Number, required: true }
    }], // Array of payment screenshots
    
    // Status
    status: {
      type: String,
      enum: ['paid', 'partial', 'due', 'overdue'],
      default: 'due'
    },
    
    // Approval & Certificate
    isApproved: { type: Boolean, default: false },
    certificateApproved: { type: Boolean, default: false },
    
    // Dates
    invoiceDate: { type: Date, default: Date.now },
    approvedDate: { type: Date },
    certificateApprovedDate: { type: Date },
    
    // Remark
    remark: { type: String, default: null },
    
    // Sales Person (internal use only, not shown in PDF)
    salesPerson: { type: String, default: null }
  },
  {
    timestamps: true,
  }
);

// Auto-generate invoice number with duplicate handling
manualInvoiceSchema.pre('save', async function(next) {
  if (!this.invoiceNumber) {
    try {
      this.invoiceNumber = await generateUniqueInvoiceNumber();
    } catch (error) {
      console.error('Error generating invoice number:', error);
      // Ultimate fallback to timestamp-based number
      this.invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    }
  }
  
  // Calculate pending amount
  this.pendingAmount = this.totalAmount - this.paidAmount;
  
  // Update status based on payment
  if (this.paidAmount >= this.totalAmount) {
    this.status = 'paid';
    if (!this.paidDate) {
      this.paidDate = new Date();
    }
  } else if (this.paidAmount > 0) {
    this.status = 'partial';
  } else if (this.dueDate && new Date() > this.dueDate) {
    this.status = 'overdue';
  } else {
    this.status = 'due';
  }
  
  next();
});

// Indexes for better performance
manualInvoiceSchema.index({ 'customerDetails.email': 1, status: 1 });
manualInvoiceSchema.index({ invoiceDate: -1 });
manualInvoiceSchema.index({ source: 1 });

export default mongoose.models.ManualInvoice || mongoose.model("ManualInvoice", manualInvoiceSchema);