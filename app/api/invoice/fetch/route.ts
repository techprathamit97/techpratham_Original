import { NextResponse } from 'next/server';
import { connectMongo } from '@/utils/mongodb';
import mongoose from 'mongoose';
// Import models in dependency order to ensure proper registration
import { User } from '@/models/user';
import Enrolled from '@/models/enrolled';
import Invoice from '@/models/Invoice';
import ManualInvoice from '@/models/ManualInvoice';
import { requireRole, LEAD_ACCESS_ROLES } from '@/lib/apiAuth';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');
    const invoiceId = searchParams.get('invoiceId');

    /**
     * Listing every invoice is restricted to admin and accountant.
     *
     * Without this, GET /api/invoice/fetch returned every customer's name,
     * email, phone and payment amount to anyone, including from Postman.
     *
     * A single invoice requested by id is deliberately NOT restricted here,
     * because pages/invoice/[invoiceId].tsx is a public page with no login and
     * is how customers and students open their own invoice (window.open from
     * pages/student/invoices.tsx and the admin dashboards). Guarding it would
     * stop customers reaching their invoices.
     */
    if (!invoiceId) {
      const denied = await requireRole(LEAD_ACCESS_ROLES);
      if (denied) return denied;
    }

    await connectMongo();

    // If specific invoice requested
    if (invoiceId) {
      try {
        let invoice = null;
        
        // Try to find in regular invoices first
        try {
          invoice = await Invoice.findById(invoiceId)
            .populate('userId', 'name email phone')
            .populate('enrollmentId', 'course_title course_link category');
        } catch (error: any) {
          console.log('Not found in regular invoices, trying manual invoices');
        }
        
        // If not found in regular invoices, try manual invoices
        if (!invoice) {
          invoice = await ManualInvoice.findById(invoiceId);
        }
        
        if (!invoice) {
          return NextResponse.json(
            { error: 'Invoice not found' },
            { status: 404 }
          );
        }

        return NextResponse.json({
          success: true,
          invoice
        });
      } catch (error: any) {
        console.error('Error fetching single invoice:', error);
        return NextResponse.json(
          { error: 'Failed to fetch invoice' },
          { status: 500 }
        );
      }
    }

    const skip = (page - 1) * limit;

    // Build query
    let query: any = {};
    if (userId) {
      query.userId = userId;
    }
    if (status && status !== 'all') {
      query.status = status;
    }

    try {
      // Try to get invoices with population
      let invoices = [];
      let manualInvoices = [];
      
      try {
        // Get regular invoices
        invoices = await Invoice.find(query)
          .populate('userId', 'name email phone')
          .populate('enrollmentId', 'course_title course_link category')
          .sort({ invoiceDate: -1 })
          .skip(skip)
          .limit(limit)
          .lean();
          
        // Get manual invoices
        manualInvoices = await ManualInvoice.find({
          // Apply similar filters for manual invoices
          ...(status && status !== 'all' ? { status } : {})
        })
          .sort({ invoiceDate: -1 })
          .skip(skip)
          .limit(limit)
          .lean();
          
      } catch (populateError: any) {
        
        // Fallback to basic query without population
        invoices = await Invoice.find(query)
          .sort({ invoiceDate: -1 })
          .skip(skip)
          .limit(limit)
          .lean();
          
        manualInvoices = await ManualInvoice.find({
          ...(status && status !== 'all' ? { status } : {})
        })
          .sort({ invoiceDate: -1 })
          .skip(skip)
          .limit(limit)
          .lean();
      }

      // Combine and sort all invoices
      const allInvoices = [...invoices, ...manualInvoices].sort((a, b) => 
        new Date(b.invoiceDate).getTime() - new Date(a.invoiceDate).getTime()
      );

      const regularTotal = await Invoice.countDocuments(query);
      const manualTotal = await ManualInvoice.countDocuments({
        ...(status && status !== 'all' ? { status } : {})
      });
      const total = regularTotal + manualTotal;

      return NextResponse.json({
        success: true,
        invoices: allInvoices,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error: any) {
      console.error('Error fetching invoices:', error);
      return NextResponse.json(
        { error: 'Failed to fetch invoices' },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error('FETCH INVOICES ERROR:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch invoices' },
      { status: 500 }
    );
  }
}