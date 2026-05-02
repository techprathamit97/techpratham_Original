import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/utils/mongodb';
import TrainerAuth from '@/models/TrainerAuth';

export async function GET(req: NextRequest) {
  try {
    await connectMongo();
    
    const { searchParams } = new URL(req.url);
    const loginId = searchParams.get('loginId');

    if (!loginId) {
      return NextResponse.json(
        { error: 'Login ID is required' },
        { status: 400 }
      );
    }

    const existingTrainer = await TrainerAuth.findOne({ trainerId: loginId });

    return NextResponse.json({
      available: !existingTrainer
    });
  } catch (error: any) {
    console.error('Check login ID error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
