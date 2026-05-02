import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/utils/mongodb';
import TrainerAuth from '@/models/TrainerAuth';

export async function GET(req: NextRequest) {
  try {
    await connectMongo();
    
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const trainerAuth = await TrainerAuth.findOne({ email });

    if (!trainerAuth) {
      return NextResponse.json({
        loginId: null,
        message: 'No login credentials found'
      });
    }

    return NextResponse.json({
      loginId: trainerAuth.trainerId
    });
  } catch (error: any) {
    console.error('Get login ID error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
