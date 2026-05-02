import { NextResponse } from 'next/server';
import { connectMongo } from '@/utils/mongodb';
import { User } from '@/models/user';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    await connectMongo();

    const body = await req.json();
    const { email, password, adminKey } = body;

    // Simple admin key check (you should use a proper admin authentication)
    if (adminKey !== 'admin123') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Update user password
    await User.findByIdAndUpdate(user._id, { password: hashedPassword });

    console.log(`Password set for user: ${email}`);

    return NextResponse.json({
      success: true,
      message: 'Password set successfully',
      user: {
        email: user.email,
        name: user.name,
        role: user.role?.type
      }
    });

  } catch (error: any) {
    console.error('SET PASSWORD ERROR:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to set password' },
      { status: 500 }
    );
  }
}