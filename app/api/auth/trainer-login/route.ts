import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/utils/mongodb';
import TrainerAuth from '@/models/TrainerAuth';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    await connectMongo();
    
    const { trainerId, password } = await req.json();

    if (!trainerId || !password) {
      return NextResponse.json(
        { error: 'Login ID and password are required' },
        { status: 400 }
      );
    }

    console.log('=== TRAINER LOGIN DEBUG ===');
    console.log('Attempting login for trainerId:', trainerId);
    
    // Check all trainers in TrainerAuth database
    const allTrainers = await TrainerAuth.find({}).lean();
    console.log('All trainers in TrainerAuth database:', allTrainers.map(t => ({ trainerId: (t as any).trainerId, name: (t as any).name })));

    // Find trainer by trainerId in TrainerAuth table
    const trainerAuth = await TrainerAuth.findOne({ trainerId }).lean();
    console.log('TrainerAuth found for', trainerId, ':', trainerAuth ? (trainerAuth as any).name : 'NOT FOUND');

    if (!trainerAuth) {
      return NextResponse.json(
        { error: `Trainer with ID ${trainerId} not found. Available trainers: ${allTrainers.map(t => (t as any).trainerId).join(', ')}` },
        { status: 404 }
      );
    }

    // Check password (assuming it's hashed with bcrypt)
    let passwordValid = false;
    try {
      passwordValid = await bcrypt.compare(password, (trainerAuth as any).password);
    } catch (bcryptError) {
      // If bcrypt fails, try plain text comparison (for development)
      passwordValid = password === (trainerAuth as any).password;
    }
    
    if (!passwordValid) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Update last login
    await TrainerAuth.findByIdAndUpdate((trainerAuth as any)._id, { lastLogin: new Date() });

    // Return trainer data (excluding sensitive information)
    const trainerData = {
      trainerId: (trainerAuth as any).trainerId,
      name: (trainerAuth as any).name,
      email: (trainerAuth as any).email,
      phone: (trainerAuth as any).phone
    };

    console.log('Login successful for trainer:', trainerData);

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      trainer: trainerData
    });
  } catch (error: any) {
    console.error('Trainer login error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
