import { NextResponse } from 'next/server';
import { connectMongo } from '@/utils/mongodb';
import ManualInvoice from '@/models/ManualInvoice';
import { generateReceiptNumber } from '@/utils/receiptGenerator';

export async function POST(req: Request) {
  console.log('Manual Invoice create API called');
  try {
    await connectMongo();
    console.log('MongoDB connected');

    const body = await req.json();
    console.log('Request body received:', body);
    
    const { 
      customerDetails, 
      courseDetails, 
      items, 
      tax = 0, 
      paymentMode = 'online', 
      feeType = 'Full Payment',
      paidAmount = 0,
      installmentDates,
      dueDate, 
      paidDate,
      paymentScreenshot,
      salesPerson
    } = body;

    console.log('=== CREATE MANUAL INVOICE DEBUG ===');
    console.log('Request body received:', body);
    console.log('PaymentScreenshot value:', paymentScreenshot);
    console.log('PaymentScreenshot type:', typeof paymentScreenshot);
    console.log('PaymentScreenshot exists:', !!paymentScreenshot);

    // Validation
    if (!customerDetails || !customerDetails.name || !customerDetails.email) {
      console.log('Validation failed: missing customer details');
      return NextResponse.json(
        { error: 'Customer name and email are required' },
        { status: 400 }
      );
    }

    if (!courseDetails || !courseDetails.title) {
      console.log('Validation failed: missing course details');
      return NextResponse.json(
        { error: 'Course title is required' },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      console.log('Validation failed: missing items');
      return NextResponse.json(
        { error: 'Invoice items are required' },
        { status: 400 }
      );
    }

    // Calculate amounts
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const totalAmount = subtotal + tax;

    console.log('Calculated amounts:', { subtotal, totalAmount, paidAmount });

    // Helper function to clean HTML tags
    const cleanHtml = (str: string) => {
      if (!str) return '';
      return str.replace(/<[^>]*>/g, '').trim();
    };

    // Generate student ID if not provided
    const studentId = customerDetails.studentId || `TP${Date.now().toString().slice(-6)}`;

    // Initialize installmentPayments array with first payment if applicable
    let installmentPayments = [];
    if (feeType === 'Installments' && paidAmount > 0) {
      installmentPayments.push({
        installmentNumber: 1,
        paidDate: paidDate ? new Date(paidDate) : new Date(),
        amount: paidAmount,
        paymentMode: paymentMode || 'online',
        dueDate: null, // First payment doesn't have a due date (it's being paid now)
        nextDueDate: dueDate ? new Date(dueDate) : null // Store next due date with first payment
      });
    }

    // Create invoice data
    const invoiceData = {
      enrollmentId: null, // Explicitly set to null for manual invoices
      userId: null, // Explicitly set to null for manual invoices
      receiptNo: generateReceiptNumber(),
      invoiceNumber: `INV-${Date.now()}`,
      customerDetails: {
        name: customerDetails.name || 'Unknown',
        email: customerDetails.email || '',
        phone: customerDetails.phone || '',
        studentId: studentId
      },
      
      courseDetails: {
        title: cleanHtml(courseDetails.title) || 'Course',
        link: 'https://techpratham.com', // Default link since field is removed
        category: 'General', // Default category since field is removed
        duration: 'N/A', // Default duration since field is removed
        level: 'Beginner' // Default level since field is removed
      },
      
      items: items.map(item => ({
        description: item.description,
        quantity: item.quantity || 1,
        unitPrice: item.unitPrice,
        amount: (item.quantity || 1) * item.unitPrice
      })),
      
      subtotal,
      tax,
      totalAmount,
      paidAmount: paidAmount || 0,
      pendingAmount: totalAmount - (paidAmount || 0),
      feeType: feeType || 'Full Payment',
      installmentDates: installmentDates || [],
      paymentMode,
      dueDate: dueDate ? new Date(dueDate) : (feeType === 'Full Payment' ? null : null),
      paidDate: paidDate ? new Date(paidDate) : ((paidAmount || 0) > 0 ? new Date() : null),
      paymentScreenshot: paymentScreenshot || null,
      
      // Add installment payments array
      installmentPayments: installmentPayments,
      
      // Mark as manual invoice
      isManual: true,
      source: 'manual_entry', // Track source
      
      // Sales Person (internal use only, not shown in PDF)
      salesPerson: salesPerson || null
    };

    console.log('Invoice data being saved to DB:', {
      ...invoiceData,
      paymentScreenshot: invoiceData.paymentScreenshot
    });
    
    // Try to create the invoice with retry logic for duplicate invoice numbers
    let invoice;
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
      try {
        invoice = new ManualInvoice(invoiceData);
        await invoice.save();
        console.log('Manual invoice saved successfully:', invoice._id);
        console.log('Saved invoice paymentScreenshot:', invoice.paymentScreenshot);
        break;
      } catch (error: any) {
        attempts++;
        
        if (error.code === 11000 && error.message.includes('invoiceNumber')) {
          console.log(`Duplicate invoice number detected, attempt ${attempts}/${maxAttempts}`);
          
          if (attempts >= maxAttempts) {
            // Force a unique invoice number as final attempt
            invoiceData.invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
            invoice = new ManualInvoice(invoiceData);
            await invoice.save();
            console.log('Manual invoice saved with fallback number:', invoice._id);
            console.log('Saved invoice paymentScreenshot:', invoice.paymentScreenshot);
            break;
          }
          
          // Wait a bit before retry to avoid race conditions
          await new Promise(resolve => setTimeout(resolve, 100 * attempts));
          continue;
        } else {
          // Non-duplicate error, throw immediately
          throw error;
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Manual invoice created successfully',
      invoice
    });

  } catch (error: any) {
    console.error('CREATE MANUAL INVOICE ERROR:', error);
    
    // Handle specific error types
    if (error.code === 11000) {
      if (error.message.includes('invoiceNumber')) {
        return NextResponse.json(
          { error: 'Invoice number conflict detected. Please try again.' },
          { status: 409 }
        );
      } else if (error.message.includes('customerDetails.email')) {
        return NextResponse.json(
          { error: 'An invoice with this email already exists.' },
          { status: 409 }
        );
      } else {
        return NextResponse.json(
          { error: 'Duplicate data detected. Please check your input and try again.' },
          { status: 409 }
        );
      }
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: `Validation failed: ${validationErrors.join(', ')}` },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to create manual invoice' },
      { status: 500 }
    );
  }
}