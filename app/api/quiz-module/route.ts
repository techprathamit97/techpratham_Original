import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/utils/mongodb';
import QuizModule from '@/models/QuizModule';

export async function GET(request: NextRequest) {
  try {
    await connectMongo();
    
    const { searchParams } = new URL(request.url);
    const active = searchParams.get('active');
    const category = searchParams.get('category');
    
    let query: any = {};
    
    if (active === 'true') {
      query.isActive = true;
    }
    
    if (category) {
      query.category = category;
    }
    
    const quizModules = await QuizModule.find(query)
      .sort({ createdAt: -1 })
      .lean();
    
    return NextResponse.json(quizModules);
  } catch (error) {
    console.error('Error fetching quiz modules:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz modules  to verify' },
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
      createdBy
    } = body;

    // Validate required fields
    if (!title || !category || !createdBy) {
      return NextResponse.json(
        { error: 'Title, category, and createdBy are required' },
        { status: 400 }
      );
    }

    // Validate module type specific requirements
    if (moduleType === 'multi_step') {
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
      // Single step validation
      if (!questions || questions.length === 0) {
        return NextResponse.json(
          { error: 'Questions are required for single-step quizzes' },
          { status: 400 }
        );
      }
    }

    const quizModule = new QuizModule({
      title,
      category,
      description,
      moduleType: moduleType || 'multi_step',
      steps: moduleType === 'multi_step' ? steps : undefined,
      timing: moduleType === 'single_step' ? timing : undefined,
      passingMarks: moduleType === 'single_step' ? passingMarks : undefined,
      maxMarks: moduleType === 'single_step' ? maxMarks : undefined,
      eachQuestionMarks: eachQuestionMarks || 1,
      negativeMarking: negativeMarking || { enabled: false, marksDeducted: 0 },
      questions: moduleType === 'single_step' ? questions : undefined,
      allowStepNavigation: allowStepNavigation || false,
      requireSequentialCompletion: requireSequentialCompletion !== false,
      showStepResults: showStepResults || false,
      overallPassingPercentage: overallPassingPercentage || 70,
      createdBy
    });

    await quizModule.save();
    
    return NextResponse.json(quizModule, { status: 201 });
  } catch (error) {
    console.error('Error creating quiz module:', error);
    return NextResponse.json(
      { error: 'Failed to create quiz module' },
      { status: 500 }
    );
  }
}