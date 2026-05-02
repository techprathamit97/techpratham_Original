import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/utils/mongodb';
import QuizAttempt from '@/models/QuizAttempt';
import Quiz from '@/models/Quiz';

export async function GET(request: NextRequest) {
  try {
    await connectMongo();
    
    const { searchParams } = new URL(request.url);
    const quizId = searchParams.get('quizId');
    
    if (!quizId) {
      return NextResponse.json(
        { error: 'Quiz ID is required' },
        { status: 400 }
      );
    }
    
    // Get quiz details
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      );
    }
    
    // Get all attempts for this quiz
    const attempts = await QuizAttempt.find({ quizId })
      .sort({ createdAt: -1 })
      .lean();
    
    // Calculate analytics
    const analytics = {
      quiz: {
        title: quiz.title,
        category: quiz.category,
        totalQuestions: quiz.questions.length,
        maxMarks: quiz.maxMarks,
        passingMarks: quiz.passingMarks
      },
      totalAttempts: attempts.length,
      passedAttempts: attempts.filter(a => a.passed).length,
      failedAttempts: attempts.filter(a => !a.passed).length,
      averageScore: attempts.length > 0 ? 
        Math.round((attempts.reduce((sum, a) => sum + a.percentage, 0) / attempts.length) * 100) / 100 : 0,
      averageMarks: attempts.length > 0 ? 
        Math.round((attempts.reduce((sum, a) => sum + a.totalMarks, 0) / attempts.length) * 100) / 100 : 0,
      highestScore: attempts.length > 0 ? Math.max(...attempts.map(a => a.percentage)) : 0,
      lowestScore: attempts.length > 0 ? Math.min(...attempts.map(a => a.percentage)) : 0,
      averageTimeSpent: attempts.length > 0 ? 
        Math.round(attempts.reduce((sum, a) => sum + a.timeSpent, 0) / attempts.length) : 0,
      attempts: attempts.map(attempt => ({
        _id: attempt._id,
        userName: attempt.userName,
        userEmail: attempt.userEmail,
        totalMarks: attempt.totalMarks,
        maxMarks: attempt.maxMarks,
        percentage: attempt.percentage,
        passed: attempt.passed,
        correctAnswers: attempt.answers.filter((a: any) => a.isCorrect).length,
        incorrectAnswers: attempt.answers.filter((a: any) => !a.isCorrect).length,
        timeSpent: attempt.timeSpent,
        completedAt: attempt.completedAt,
        createdAt: attempt.createdAt
      }))
    };
    
    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Error fetching quiz analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz analytics' },
      { status: 500 }
    );
  }
}