import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/models/user';
import bcrypt from 'bcryptjs';
import { connectMongo } from '@/utils/mongodb';

export const POST = async (request: NextRequest) => {
  try {
    const { email, password, name, phone } = await request.json();

    // Validate required fields
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    await connectMongo();
    console.log("connected with db");

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email is already in use' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 5);
    const newUser = new User({
      email,
      name,
      phone,
      password: hashedPassword,
    });

    await newUser.save();
    
    return NextResponse.json(
      { message: 'User registered successfully', success: true },
      { status: 200 }
    );
    
  } catch (err: any) {
    console.error('Registration error:', err);
    return NextResponse.json(
      { error: 'Failed to register user', details: err.message },
      { status: 500 }
    );
  }
};
