import { NextResponse } from 'next/server';
import { connectMongo } from '@/utils/mongodb';
import { User } from '@/models/user';

export async function PATCH(req: Request) {
  try {
    await connectMongo();

    const body = await req.json();
    const { email, roleType, position } = body;

    if (!email || !roleType) {
      return NextResponse.json(
        { error: 'Email and role type are required' },
        { status: 400 }
      );
    }

    // Validate role type
    const validRoles = ['user', 'admin', 'accountant'];
    if (!validRoles.includes(roleType)) {
      return NextResponse.json(
        { error: 'Invalid role type. Must be one of: user, admin, accountant' },
        { status: 400 }
      );
    }

    // Find and update user
    const user = await User.findOneAndUpdate(
      { email },
      { 
        'role.type': roleType,
        'role.position': position || ''
      },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `User role updated to ${roleType}`,
      user: {
        email: user.email,
        name: user.name,
        role: user.role
      }
    });

  } catch (error: any) {
    console.error('UPDATE ROLE ERROR:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update user role' },
      { status: 500 }
    );
  }
}