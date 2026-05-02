import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/utils/mongodb';
import StudentAuth from '@/models/StudentAuth';

export async function GET(req: NextRequest) {
  try {
    await connectMongo();
    
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get('studentId');
    const email = searchParams.get('email');

    if (!studentId && !email) {
      return NextResponse.json(
        { error: 'Student ID or email is required' },
        { status: 400 }
      );
    }

    // Check if student account exists
    const existingStudent = await StudentAuth.findOne({ 
      $or: [
        ...(studentId ? [{ studentId }] : []),
        ...(email ? [{ email }] : [])
      ]
    }).select('studentId email name phone isActive createdAt');

    if (existingStudent) {
      return NextResponse.json({
        success: true,
        exists: true,
        student: {
          studentId: existingStudent.studentId,
          email: existingStudent.email,
          name: existingStudent.name,
          phone: existingStudent.phone,
          isActive: existingStudent.isActive,
          createdAt: existingStudent.createdAt
        }
      });
    } else {
      return NextResponse.json({
        success: true,
        exists: false
      });
    }
  } catch (error: any) {
    console.error('Check student account error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}