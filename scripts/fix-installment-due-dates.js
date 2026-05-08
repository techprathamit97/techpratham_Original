// Script to fix existing installments by adding dueDate field
// Run this once to update all existing invoices

const mongoose = require('mongoose');

// MongoDB connection string
const MONGODB_URI = 'mongodb://13.127.51.162:27017/database';

async function fixInstallmentDueDates() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected successfully!');

    // Get both Invoice and ManualInvoice collections
    const Invoice = mongoose.connection.collection('invoices');
    const ManualInvoice = mongoose.connection.collection('manualinvoices');

    // Process regular invoices
    console.log('\n=== Processing Regular Invoices ===');
    const regularInvoices = await Invoice.find({
      feeType: 'Installments',
      installmentPayments: { $exists: true, $ne: [] }
    }).toArray();

    console.log(`Found ${regularInvoices.length} regular invoices with installments`);

    for (const invoice of regularInvoices) {
      let updated = false;
      const updatedPayments = invoice.installmentPayments.map((payment, index) => {
        // If dueDate is missing, set it to the paidDate (best guess)
        if (!payment.dueDate) {
          console.log(`  - Invoice ${invoice.invoiceNumber}, Installment ${index + 1}: Adding dueDate = ${payment.paidDate}`);
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
        console.log(`  ✓ Updated invoice ${invoice.invoiceNumber}`);
      }
    }

    // Process manual invoices
    console.log('\n=== Processing Manual Invoices ===');
    const manualInvoices = await ManualInvoice.find({
      feeType: 'Installments',
      installmentPayments: { $exists: true, $ne: [] }
    }).toArray();

    console.log(`Found ${manualInvoices.length} manual invoices with installments`);

    for (const invoice of manualInvoices) {
      let updated = false;
      const updatedPayments = invoice.installmentPayments.map((payment, index) => {
        // If dueDate is missing, set it to the paidDate (best guess)
        if (!payment.dueDate) {
          console.log(`  - Invoice ${invoice.invoiceNumber}, Installment ${index + 1}: Adding dueDate = ${payment.paidDate}`);
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
        console.log(`  ✓ Updated invoice ${invoice.invoiceNumber}`);
      }
    }

    console.log('\n=== Migration Complete! ===');
    console.log('All existing installments now have dueDate field.');
    console.log('Note: Due dates were set to payment dates as best guess.');
    console.log('You can edit individual installments to correct the due dates if needed.');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
  }
}

// Run the migration
fixInstallmentDueDates();
