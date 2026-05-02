import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/utils/mongodb';
import Quiz from '@/models/Quiz';

export async function GET(request: NextRequest) {
  try {
    await connectMongo();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const isActive = searchParams.get('active');
    
    let filter: any = {};
    
    if (category) {
      filter.category = category;
    }
    
    if (isActive !== null) {
      filter.isActive = isActive === 'true';
    }
    
    const quizzes = await Quiz.find(filter)
      .sort({ createdAt: -1 })
      .lean();
    
    // Filter out quizzes with invalid IDs (must be 24 characters)
    const validQuizzes = quizzes.filter((quiz: any) => {
      const idString = quiz._id.toString();
      if (idString.length !== 24) {
        console.warn(`Quiz with invalid ID found: ${idString} (length: ${idString.length})`);
        return false;
      }
      return true;
    });
    
    return NextResponse.json(validQuizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quizzes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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
      createdBy
    } = body;
    
    // Validate required fields
    if (!title || !category || !createdBy) {
      return NextResponse.json(
        { error: 'Title, category, and createdBy are required' },
        { status: 400 }
      );
    }

    // Validate based on quiz type
    if (quizType === 'multi_step') {
      if (!steps || steps.length === 0) {
        return NextResponse.json(
          { error: 'Steps are required for multi-step quizzes' },
          { status: 400 }
        );
      }
      
      // Validate each step
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        if (!step.stepTitle || !step.questions || step.questions.length === 0) {
          return NextResponse.json(
            { error: `Step ${i + 1} must have a title and at least one question` },
            { status: 400 }
          );
        }
      }
    } else {
      // Single step validation (backward compatibility)
      if (!timing || !passingMarks || !maxMarks || !eachQuestionMarks || !questions) {
        return NextResponse.json(
          { error: 'Missing required fields for single-step quiz' },
          { status: 400 }
        );
      }
      
      if (!Array.isArray(questions) || questions.length === 0) {
        return NextResponse.json(
          { error: 'At least one question is required' },
          { status: 400 }
        );
      }
    }

    const quizData: any = {
      title,
      category,
      description,
      quizType: quizType || 'single_step',
      eachQuestionMarks: eachQuestionMarks || 1,
      negativeMarking: negativeMarking || { enabled: false, marksDeducted: 0 },
      createdBy,
      isActive: true
    };

    if (quizType === 'multi_step') {
      quizData.steps = steps;
      quizData.allowStepNavigation = allowStepNavigation || false;
      quizData.requireSequentialCompletion = requireSequentialCompletion !== false;
      quizData.showStepResults = showStepResults || false;
      quizData.overallPassingPercentage = overallPassingPercentage || 70;
    } else {
      // Single-step quiz (backward compatibility)
      quizData.timing = timing;
      quizData.passingMarks = passingMarks;
      quizData.maxMarks = questions.length * eachQuestionMarks;
      quizData.questions = questions;
    }
    
    const quiz = new Quiz(quizData);
    await quiz.save();
    
    return NextResponse.json(quiz, { status: 201 });
  } catch (error) {
    console.error('Error creating quiz:', error);
    return NextResponse.json(
      { error: 'Failed to create quiz' },
      { status: 500 }
    );
  }
}