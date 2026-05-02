import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/utils/mongodb';
import QuizModule from '@/models/QuizModule';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectMongo();
    
    const { id } = await params;
    const quizModule = await QuizModule.findById(id).lean();
    
    if (!quizModule) {
      return NextResponse.json(
        { error: 'Quiz module not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(quizModule);
  } catch (error) {
    console.error('Error fetching quiz module:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz module' },
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
    
    const { id } = await params;
    const body = await request.json();
    const {
      title,
      category,
      description,
      moduleType,
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

    const updateData: any = {
      title,
      category,
      description,
      moduleType,
      eachQuestionMarks,
      negativeMarking,
      allowStepNavigation,
      requireSequentialCompletion,
      showStepResults,
      overallPassingPercentage,
      isActive,
      updatedAt: new Date()
    };

    if (moduleType === 'multi_step') {
      updateData.steps = steps;
      // Clear single-step fields
      updateData.timing = undefined;
      updateData.passingMarks = undefined;
      updateData.maxMarks = undefined;
      updateData.questions = undefined;
    } else {
      updateData.timing = timing;
      updateData.passingMarks = passingMarks;
      updateData.maxMarks = maxMarks;
      updateData.questions = questions;
      // Clear multi-step fields
      updateData.steps = undefined;
    }
    
    const quizModule = await QuizModule.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    
    if (!quizModule) {
      return NextResponse.json(
        { error: 'Quiz module not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(quizModule);
  } catch (error) {
    console.error('Error updating quiz module:', error);
    return NextResponse.json(
      { error: 'Failed to update quiz module' },
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
    const quizModule = await QuizModule.findByIdAndDelete(id);
    
    if (!quizModule) {
      return NextResponse.json(
        { error: 'Quiz module not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Quiz module deleted successfully' });
  } catch (error) {
    console.error('Error deleting quiz module:', error);
    return NextResponse.json(
      { error: 'Failed to delete quiz module' },
      { status: 500 }
    );
  }
}