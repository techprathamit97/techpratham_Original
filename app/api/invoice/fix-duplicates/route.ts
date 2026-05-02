import { NextResponse } from 'next/server';
import { connectMongo } from '@/utils/mongodb';
import mongoose from 'mongoose';
import Invoice from '@/models/Invoice';
import ManualInvoice from '@/models/ManualInvoice';
import { generateUniqueInvoiceNumber } from '@/utils/invoiceNumberGenerator';

// ✅ Define types
type InvoiceDoc = {
  _id: mongoose.Types.ObjectId;
  invoiceNumber?: string;
};

type InvoiceGroupItem = InvoiceDoc & {
  type: 'regular' | 'manual';
};

export async function POST(req: Request) {
  try {
    await connectMongo();

    console.log('Starting duplicate invoice number cleanup...');

    // ✅ Fetch invoices with proper typing
    const [regularInvoicesRaw, manualInvoicesRaw] = await Promise.all([
      Invoice.find({}).select('_id invoiceNumber').lean(),
      ManualInvoice.find({}).select('_id invoiceNumber').lean()
    ]);

    const regularInvoices = (regularInvoicesRaw as InvoiceDoc[]) || [];
    const manualInvoices = (manualInvoicesRaw as InvoiceDoc[]) || [];

    // ✅ Properly typed object (FIXED ERROR)
    const invoiceGroups: Record<string, InvoiceGroupItem[]> = {};

    // ✅ Group regular invoices
    regularInvoices.forEach((invoice) => {
      if (!invoice.invoiceNumber) return;

      if (!invoiceGroups[invoice.invoiceNumber]) {
        invoiceGroups[invoice.invoiceNumber] = [];
      }

      invoiceGroups[invoice.invoiceNumber].push({
        ...invoice,
        type: 'regular'
      });
    });

    // ✅ Group manual invoices
    manualInvoices.forEach((invoice) => {
      if (!invoice.invoiceNumber) return;

      if (!invoiceGroups[invoice.invoiceNumber]) {
        invoiceGroups[invoice.invoiceNumber] = [];
      }

      invoiceGroups[invoice.invoiceNumber].push({
        ...invoice,
        type: 'manual'
      });
    });

    // ✅ Find duplicates
    const duplicates = Object.entries(invoiceGroups).filter(
      ([_, invoices]) => invoices.length > 1
    );

    if (duplicates.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No duplicate invoice numbers found',
        fixed: 0
      });
    }

    console.log(`Found ${duplicates.length} duplicate invoice numbers`);

    let fixedCount = 0;

    // ✅ Fix duplicates
    for (const [duplicateNumber, invoices] of duplicates) {
      console.log(
        `Fixing duplicate invoice number: ${duplicateNumber} (${invoices.length} occurrences)`
      );

      // Keep first, update rest
      for (let i = 1; i < invoices.length; i++) {
        const invoice = invoices[i];
        const newInvoiceNumber = await generateUniqueInvoiceNumber();

        if (invoice.type === 'regular') {
          await Invoice.findByIdAndUpdate(invoice._id, {
            invoiceNumber: newInvoiceNumber
          });
        } else {
          await ManualInvoice.findByIdAndUpdate(invoice._id, {
            invoiceNumber: newInvoiceNumber
          });
        }

        console.log(
          `Updated ${invoice.type} invoice ${invoice._id}: ${duplicateNumber} → ${newInvoiceNumber}`
        );

        fixedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Fixed ${fixedCount} duplicate invoice numbers`,
      fixed: fixedCount,
      duplicatesFound: duplicates.length
    });

  } catch (error) {
    console.error('FIX DUPLICATES ERROR:', error);

    const message =
      error instanceof Error
        ? error.message
        : 'Failed to fix duplicate invoice numbers';

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}