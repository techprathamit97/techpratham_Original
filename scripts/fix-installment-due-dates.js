// Script to fix existing installments by adding dueDate field
// Run this once to update all existing invoices

const mongoose = require('mongoose');

// MongoDB connection string
const MONGODB_URI = 'mongodb://13.127.51.162:27017/database';

async function fixInstallmentDueDates() {
  try {
 
    await mongoose.connect(MONGODB_URI);
  

    // Get both Invoice and ManualInvoice collections
    const Invoice = mongoose.connection.collection('invoices');
    const ManualInvoice = mongoose.connection.collection('manualinvoices');


    const regularInvoices = await Invoice.find({
      feeType: 'Installments',
      installmentPayments: { $exists: true, $ne: [] }
    }).toArray();

   

    for (const invoice of regularInvoices) {
      let updated = false;
      const updatedPayments = invoice.installmentPayments.map((payment, index) => {
        // If dueDate is missing, set it to the paidDate (best guess)
        if (!payment.dueDate) {
         
          updated = true;
          return {
            ...payment,
            dueDate: payment.paidDate // Use paid date as due date for old records
          };
        }
        return payment;
      });

      if (updated) {
        await Invoice.updateOne(
          { _id: invoice._id },
          { $set: { installmentPayments: updatedPayments } }
        );
      
      }
    }

    // Process manual invoices

    const manualInvoices = await ManualInvoice.find({
      feeType: 'Installments',
      installmentPayments: { $exists: true, $ne: [] }
    }).toArray();

    

    for (const invoice of manualInvoices) {
      let updated = false;
      const updatedPayments = invoice.installmentPayments.map((payment, index) => {
        // If dueDate is missing, set it to the paidDate (best guess)
        if (!payment.dueDate) {
         
          updated = true;
          return {
            ...payment,
            dueDate: payment.paidDate // Use paid date as due date for old records
          };
        }
        return payment;
      });

      if (updated) {
        await ManualInvoice.updateOne(
          { _id: invoice._id },
          { $set: { installmentPayments: updatedPayments } }
        );
       
      }
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    
  }
}

// Run the migration
fixInstallmentDueDates();
