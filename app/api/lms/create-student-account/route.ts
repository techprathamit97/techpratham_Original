import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/utils/mongodb';
import StudentAuth from '@/models/StudentAuth';
import Enrolled from '@/models/enrolled';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    await connectMongo();
    
    const { studentId, email, password, name, phone } = await req.json();

    if (!studentId || !email || !password || !name || !phone) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if student already exists
    const existingStudent = await StudentAuth.findOne({ 
      $or: [{ studentId }, { email }] 
    });

    if (existingStudent) {
      return NextResponse.json(
        { error: 'Student ID or email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create student auth account
    const studentAuth = new StudentAuth({
      studentId,
      email,
      password: hashedPassword,
      name,
      phone,
      isActive: true
    });

    await studentAuth.save();

    // Get enrolled courses for this student
    const enrolledCourses = await Enrolled.find({ studentId });
    studentAuth.enrolledCourses = enrolledCourses.map(c => c._id);
    await studentAuth.save();

    return NextResponse.json({
      success: true,
      message: 'Student account created successfully',
      credentials: {
        studentId,
        password: password, // Return plain password for admin to share
        loginUrl: '/student/login'
      }
    });
  } catch (error: any) {
    console.error('Create student account error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
