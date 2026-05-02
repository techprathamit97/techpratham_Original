import { NextResponse } from "next/server";
import { connectMongo } from "@/utils/mongodb";
import ManualInvoice from "@/models/ManualInvoice.js";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();
    
    const data = await req.json();
    
    // Generate student ID
    const studentCount = await ManualInvoice.countDocuments({ isManual: true });
    const studentId = `STU${String(studentCount + 1).padStart(4, '0')}`;
    
    // Create enrollment data structure for ManualInvoice
    const enrollmentData = {
      receiptNo: `RCP${Date.now()}`,
      isManual: true,
      source: 'manual_entry',
      
      customerDetails: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        studentId: studentId
      },
      
      courseDetails: {
        title: data.course_title,
        link: data.course_link,
        category: data.category || 'General',
        duration: data.duration || 'N/A',
        level: data.level || 'Beginner'
      },
      
      items: [{
        description: data.course_title,
        quantity: 1,
        unitPrice: data.totalAmount || 0,
        amount: data.totalAmount || 0
      }],
      
      subtotal: data.totalAmount || 0,
      totalAmount: data.totalAmount || 0,
      paidAmount: data.advanceAmount || 0,
      pendingAmount: (data.totalAmount || 0) - (data.advanceAmount || 0),
      
      feeType: data.feeType || 'Full Payment',
      paymentMode: 'online',
      
      status: data.advanceAmount > 0 ? 
        (data.advanceAmount >= data.totalAmount ? 'paid' : 'partial') : 'due',
      
      isApproved: false,
      certificateApproved: false,
      invoiceDate: new Date()
    };

    // Save to ManualInvoice model
    const invoice = new ManualInvoice(enrollmentData);
    await invoice.save();

    return NextResponse.json({ 
      message: "Student enrolled successfully",
      enrollment: invoice,
      studentId: studentId
    }, { status: 201 });
  } catch (error: any) {
    console.error("Enrollment error:", error);
    return NextResponse.json(
      { error: "Failed to enroll student" },
      { status: 500 }
    );
  }
}