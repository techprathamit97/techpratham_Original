import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/utils/mongodb';
import Quiz from '@/models/Quiz';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectMongo();
    
    const { id } = await params;
    const quiz: any = await Quiz.findById(id).lean();
    
    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      );
    }
    
    // Ensure quizType is set - infer from data if missing
    if (!quiz.quizType) {
      if (quiz.steps && quiz.steps.length > 0) {
        quiz.quizType = 'multi_step';
      } else {
        quiz.quizType = 'single_step';
      }
    }
    
    // Add virtual fields manually for lean queries
    if (quiz.quizType === 'multi_step' && quiz.steps) {
      quiz.totalQuestions = quiz.steps.reduce((total: number, step: any) => total + step.questions.length, 0);
      quiz.totalTiming = quiz.steps.reduce((total: number, step: any) => total + step.timing, 0);
      quiz.totalMaxMarks = quiz.steps.reduce((total: number, step: any) => 
        total + (step.questions.length * (quiz.eachQuestionMarks || 1)), 0);
      quiz.passingPercentage = quiz.overallPassingPercentage?.toString() || '70';
    } else if (quiz.questions) {
      quiz.totalQuestions = quiz.questions.length;
      quiz.totalTiming = quiz.timing;
      quiz.totalMaxMarks = quiz.maxMarks;
      quiz.passingPercentage = quiz.maxMarks ? ((quiz.passingMarks / quiz.maxMarks) * 100).toFixed(2) : '0';
    }
    
    return NextResponse.json(quiz);
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectMongo();
    
    const body = await request.json();
    const {
      title,
      category,
      description,
      quizType,
      steps,
      timing,
      passingMarks,
      maxMarks,
      eachQuestionMarks,
      negativeMarking,
      questions,
      allowStepNavigation,
      requireSequentialCompletion,
      showStepResults,
      overallPassingPercentage,
      isActive
    } = body;

    const { id } = await params;
    
    const updateData: any = {
      title,
      category,
      description,
      quizType,
      eachQuestionMarks,
      negativeMarking,
      isActive,
      updatedAt: new Date()
    };

    if (quizType === 'multi_step') {
      updateData.steps = steps;
      updateData.allowStepNavigation = allowStepNavigation;
      updateData.requireSequentialCompletion = requireSequentialCompletion;
      updateData.showStepResults = showStepResults;
      updateData.overallPassingPercentage = overallPassingPercentage;
      // Clear single-step fields
      updateData.timing = undefined;
      updateData.passingMarks = undefined;
      updateData.maxMarks = undefined;
      updateData.questions = undefined;
    } else {
      // Single-step quiz
      updateData.timing = timing;
      updateData.passingMarks = passingMarks;
      updateData.maxMarks = questions?.length ? questions.length * eachQuestionMarks : maxMarks;
      updateData.questions = questions;
      // Clear multi-step fields
      updateData.steps = undefined;
      updateData.allowStepNavigation = undefined;
      updateData.requireSequentialCompletion = undefined;
      updateData.showStepResults = undefined;
      updateData.overallPassingPercentage = undefined;
    }
    
    const quiz = await Quiz.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    
    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(quiz);
  } catch (error) {
    console.error('Error updating quiz:', error);
    return NextResponse.json(
      { error: 'Failed to update quiz' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectMongo();
    
    const { id } = await params;
    const quiz = await Quiz.findByIdAndDelete(id);
    
    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    console.error('Error deleting quiz:', error);
    return NextResponse.json(
      { error: 'Failed to delete quiz' },
      { status: 500 }
    );
  }
}