import { NextResponse } from 'next/server';
import { connectMongo } from '@/utils/mongodb';
import ManualInvoice from '@/models/ManualInvoice';
import Invoice from '@/models/Invoice';

export async function GET(req: Request) {
  try {
    await connectMongo();

    const { searchParams } = new URL(req.url);
    const invoiceId = searchParams.get('invoiceId');

    if (!invoiceId) {
      return NextResponse.json({ error: 'Invoice ID required' }, { status: 400 });
    }

    // Try to find in both collections
    let invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      invoice = await ManualInvoice.findById(invoiceId);
    }

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      invoiceNumber: invoice.invoiceNumber,
      dueDate: invoice.dueDate,
      installmentPayments: invoice.installmentPayments || [],
      debug: {
        hasInstallmentPayments: !!invoice.installmentPayments,
        installmentCount: invoice.installmentPayments?.length || 0,
        installmentDetails: invoice.installmentPayments?.map((p: any, i: number) => ({
          number: i + 1,
          amount: p.amount,
          paidDate: p.paidDate,
          dueDate: p.dueDate || 'NULL',
          nextDueDate: p.nextDueDate || 'NULL',
          hasDueDate: !!p.dueDate,
          hasNextDueDate: !!p.nextDueDate
        }))
      }
    });

  } catch (error: any) {
    console.error('Debug error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
