import { NextResponse } from 'next/server';
import { connectMongo } from '@/utils/mongodb';
// Import models in dependency order to ensure proper registration
import { User } from '@/models/user';
import Enrolled from '@/models/enrolled';
import Invoice from '@/models/Invoice';
import { generateReceiptNumber } from '@/utils/receiptGenerator';

export async function POST(req: Request) {
  try {
    await connectMongo();

    const body = await req.json();
    const { enrollmentId } = body;

    if (!enrollmentId) {
      return NextResponse.json(
        { error: 'Enrollment ID is required' },
        { status: 400 }
      );
    }

    // Check if invoice already exists for this enrollment
    const existingInvoice = await Invoice.findOne({ enrollmentId });
    if (existingInvoice) {
      return NextResponse.json(
        { error: 'Invoice already exists for this enrollment' },
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
      console.log('User not found for email:', enrollment.email, '- creating placeholder user');
      // Create a placeholder user for invoice purposes
      try {
        user = await User.create({
          name: enrollment.name,
          email: enrollment.email,
          phone: enrollment.phone,
          isPlaceholder: true // Mark as placeholder user
        });
        userId = user._id;
        console.log('Placeholder user created:', user.name);
      } catch (userError: any) {
        console.log('Could not create placeholder user, proceeding without userId');
        userId = null;
      }
    } else {
      userId = user._id;
      console.log('User found:', user.name);
    }

    // Helper function to clean HTML tags
    const cleanHtml = (str: string) => {
      if (!str) return '';
      return str.replace(/<[^>]*>/g, '').trim();
    };

    // Auto-generate invoice items based on enrollment
    const items = [{
      description: `${cleanHtml(enrollment.course_title)} - ${enrollment.feeType || 'Course Fee'}`,
      quantity: 1,
      unitPrice: enrollment.totalAmount || 0,
      amount: enrollment.totalAmount || 0
    }];

    // Add advance payment item if exists
    if (enrollment.advanceAmount > 0) {
      items.push({
        description: 'Advance Payment',
        quantity: 1,
        unitPrice: -enrollment.advanceAmount,
        amount: -enrollment.advanceAmount
      });
    }

    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const totalAmount = subtotal;
    const paidAmount = enrollment.advanceAmount || 0;

    // Create invoice
    const invoice = new Invoice({
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
      
      items,
      subtotal,
      tax: 0,
      totalAmount,
      paidAmount,
      pendingAmount: totalAmount - paidAmount,
      feeType: enrollment.feeType || 'Full Payment',
      paymentMode: 'online', // Default to online for auto-generated invoices
      dueDate: enrollment.feeType === 'Full Payment' ? null : (enrollment.dueDate ? new Date(enrollment.dueDate) : null),
      paidDate: paidAmount > 0 ? new Date() : null,
      
      // Auto-approve if payment is verified
      isApproved: enrollment.verifyPayment || false
    });

    await invoice.save();

    return NextResponse.json({
      success: true,
      message: 'Invoice created automatically',
      invoice
    });

  } catch (error: any) {
    console.error('AUTO CREATE INVOICE ERROR:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create invoice automatically' },
      { status: 500 }
    );
  }
}