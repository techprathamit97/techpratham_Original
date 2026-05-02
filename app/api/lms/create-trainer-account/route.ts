import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/utils/mongodb';
import TrainerAuth from '@/models/TrainerAuth';
import Trainer from '@/models/Trainer';
import Batch from '@/models/Batch';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    await connectMongo();
    
    const { trainerId, email, password, name, phone } = await req.json();

    if (!trainerId || !email || !password || !name || !phone) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if trainer already exists
    const existingTrainer = await TrainerAuth.findOne({ 
      $or: [{ trainerId }, { email }] 
    });

    if (existingTrainer) {
      return NextResponse.json(
        { error: 'Trainer ID or email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create trainer auth account
    const trainerAuth = new TrainerAuth({
      trainerId,
      email,
      password: hashedPassword,
      name,
      phone,
      isActive: true
    });

    await trainerAuth.save();

    // Get assigned batches for this trainer
    const trainer = await Trainer.findOne({ trainerId });
    if (trainer) {
      const batches = await Batch.find({ 'trainer.email': email });
      trainerAuth.assignedBatches = batches.map(b => b._id);
      await trainerAuth.save();
    }

    return NextResponse.json({
      success: true,
      message: 'Trainer account created successfully',
      credentials: {
        trainerId,
        password: password, // Return plain password for admin to share
        loginUrl: '/trainer/login'
      }
    });
  } catch (error: any) {
    console.error('Create trainer account error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
