import { NextResponse } from 'next/server';
import { connectMongo } from '@/utils/mongodb';
import ManualInvoice from '@/models/ManualInvoice';
import Invoice from '@/models/Invoice';

export async function POST() {
  try {
    await connectMongo();
    
    // Add paymentScreenshot field to existing ManualInvoices that don't have it
    const manualResult = await ManualInvoice.updateMany(
      { paymentScreenshot: { $exists: false } },
      { $set: { paymentScreenshot: null } }
    );
    
    // Add paymentScreenshot field to existing Invoices that don't have it  
    const invoiceResult = await Invoice.updateMany(
      { paymentScreenshot: { $exists: false } },
      { $set: { paymentScreenshot: null } }
    );
    
    return NextResponse.json({
      success: true,
      message: 'Payment screenshot field added to existing invoices',
      manualInvoicesUpdated: manualResult.modifiedCount,
      invoicesUpdated: invoiceResult.modifiedCount
    });
  } catch (error: any) {
    console.error('Fix payment screenshot error:', error);
    return NextResponse.json({
      error: error.message
    }, { status: 500 });
  }
}