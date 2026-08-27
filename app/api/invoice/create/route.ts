import { NextResponse } from 'next/server';
import { connectMongo } from '@/utils/mongodb';
// Import models in dependency order to ensure proper registration
import { User } from '@/models/user';
import Enrolled from '@/models/enrolled';
import Invoice from '@/models/Invoice';
import { generateReceiptNumber } from '@/utils/receiptGenerator';
import { requireRole, LEAD_ACCESS_ROLES } from '@/lib/apiAuth';

export async function POST(req: Request) {
 
  try {
    const denied = await requireRole(LEAD_ACCESS_ROLES);
    if (denied) return denied;

    await connectMongo();
    console.log('MongoDB connected');

    const body = await req.json();
   
    
    const { enrollmentId, items, tax = 0, paymentMode = 'online', feeType, installmentDates, dueDate, paidDate } = body;

    if (!enrollmentId || !items || !Array.isArray(items) || items.length === 0) {
     
      return NextResponse.json(
        { error: 'Enrollment ID and items are required' },
        { status: 400 }
      );
    }


    // Fetch enrollment details
    const enrollment = await Enrolled.findById(enrollmentId);
    if (!enrollment) {
   
      return NextResponse.json(
        { error: 'Enrollment not found' },
        { status: 404 }
      );
    }
  

    // Fetch user details (optional - create placeholder if not found)
    let user = await User.findOne({ email: enrollment.email });
    let userId = null;
    
    if (!user) {
      
      // Create a placeholder user for invoice purposes
      try {
        user = await User.create({
          name: enrollment.name,
          email: enrollment.email,
          phone: enrollment.phone,
          isPlaceholder: true // Mark as placeholder user
        });
        userId = user._id;
     
      } catch (userError: any) {
      
        userId = null;
      }
    } else {
      userId = user._id;
     
    }

    // Calculate amounts
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const totalAmount = subtotal + tax;
    const paidAmount = enrollment.advanceAmount || 0;

   

    // Helper function to clean HTML tags
    const cleanHtml = (str: string) => {
      if (!str) return '';
      return str.replace(/<[^>]*>/g, '').trim();
    };

    // Create invoice
    const invoiceData = {
      enrollmentId: enrollment._id,
      userId: userId, // Can be null if no user account exists
      receiptNo: enrollment.receiptNo || generateReceiptNumber(),
      
      customerDetails: {
        name: enrollment.name || 'Unknown',
        email: enrollment.email || '',
        phone: enrollment.phone || '',
        studentId: enrollment.studentId || ''
      },
      
      courseDetails: {
        title: cleanHtml(enrollment.course_title) || 'Course',
        link: enrollment.course_link || '',
        category: enrollment.category || 'General',
        duration: enrollment.duration || 'N/A',
        level: enrollment.level || 'Beginner'
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
      paidAmount,
      pendingAmount: totalAmount - paidAmount,
      feeType: feeType || enrollment.feeType || 'Full Payment',
      installmentDates: installmentDates || [],
      paymentMode,
      dueDate: dueDate ? new Date(dueDate) : ((feeType || enrollment.feeType) === 'Full Payment' ? null : (enrollment.dueDate ? new Date(enrollment.dueDate) : null)),
      paidDate: paidDate ? new Date(paidDate) : (paidAmount > 0 ? new Date() : null)
    };

   
    const invoice = new Invoice(invoiceData);
    await invoice.save();


    return NextResponse.json({
      success: true,
      message: 'Invoice created successfully',
      invoice
    });

  } catch (error: any) {
    console.error('CREATE INVOICE ERROR:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create invoice' },
      { status: 500 }
    );
  }
}