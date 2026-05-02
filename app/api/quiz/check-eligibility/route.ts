import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { connectMongo } from '@/utils/mongodb';
import QuizAttempt from '@/models/QuizAttempt';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { error: 'Unauthorized', canTakeQuiz: false },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const quizId = searchParams.get('quizId');

    if (!quizId) {
      return NextResponse.json(
        { error: 'Quiz ID is required', canTakeQuiz: false },
        { status: 400 }
      );
    }

    await connectMongo();

    // Find the most recent attempt for this user and quiz
    // Using email as userId since that's what's stored in QuizAttempt
    const lastAttempt = await QuizAttempt.findOne({
      quizId,
      userEmail: session.user.email
    }).sort({ createdAt: -1 });

    if (!lastAttempt) {
      // No previous attempt, user can take the quiz
      return NextResponse.json({
        canTakeQuiz: true,
        message: 'You can take this quiz'
      });
    }

    // Check if 24 hours have passed since last attempt
    const lastAttemptTime = new Date(lastAttempt.createdAt).getTime();
    const currentTime = new Date().getTime();
    const hoursSinceLastAttempt = (currentTime - lastAttemptTime) / (1000 * 60 * 60);

    if (hoursSinceLastAttempt < 24) {
      const hoursRemaining = Math.ceil(24 - hoursSinceLastAttempt);
      return NextResponse.json({
        canTakeQuiz: false,
        message: `You can retake this quiz in ${hoursRemaining} hour${hoursRemaining > 1 ? 's' : ''}`,
        lastAttemptDate: lastAttempt.createdAt,
        nextAvailableTime: new Date(lastAttemptTime + (24 * 60 * 60 * 1000))
      });
    }

    // 24 hours have passed, user can take the quiz again
    return NextResponse.json({
      canTakeQuiz: true,
      message: 'You can take this quiz again'
    });

  } catch (error) {
    console.error('Error checking quiz eligibility:', error);
    return NextResponse.json(
      { error: 'Internal server error', canTakeQuiz: false },
      { status: 500 }
    );
  }
}
