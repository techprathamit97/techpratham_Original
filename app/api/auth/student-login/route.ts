import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/utils/mongodb';
import Enrolled from '@/models/enrolled';

export async function POST(req: NextRequest) {
  try {
    await connectMongo();
    
    const { studentId, password } = await req.json();

    if (!studentId || !password) {
      return NextResponse.json(
        { error: 'Student ID and password are required' },
        { status: 400 }
      );
    }

    // Find student by studentId
    const student = await Enrolled.findOne({ studentId }).lean();

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    // For now, we'll use a simple password check
    // In production, you should use proper password hashing
    const defaultPassword = 'student123'; // Default password for all students
    
    if (password !== defaultPassword) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Return student data (excluding sensitive information)
    const studentData = {
      studentId: (student as any).studentId,
      name: (student as any).name,
      email: (student as any).email,
      phone: (student as any).phone
    };

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      student: studentData
    });
  } catch (error: any) {
    console.error('Student login error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}