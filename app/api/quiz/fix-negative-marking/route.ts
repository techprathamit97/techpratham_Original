import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/utils/mongodb';
import QuizAttempt from '@/models/QuizAttempt';
import Quiz from '@/models/Quiz';

export async function POST(request: NextRequest) {
  try {
    await connectMongo();
    
    const { attemptId } = await request.json();
    
    if (!attemptId) {
      return NextResponse.json(
        { error: 'Attempt ID is required' },
        { status: 400 }
      );
    }
    
    // Get the quiz attempt
    const attempt = await QuizAttempt.findById(attemptId);
    
    if (!attempt) {
      return NextResponse.json(
        { error: 'Quiz attempt not found' },
        { status: 404 }
      );
    }
    
    // Get the quiz
    const quiz = await Quiz.findById(attempt.quizId);
    
    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      );
    }
    
    let totalMarks = 0;
    let maxMarks = 0;
    
    // Recalculate for multi-step quiz
    if (quiz.quizType === 'multi_step' && attempt.stepResults) {
      attempt.stepResults.forEach((stepResult: any, stepIndex: number) => {
        let stepMarks = 0;
        const step = quiz.steps[stepIndex];
        const stepMaxMarks = step.questions.length * (quiz.eachQuestionMarks || 1);
        let stepCorrect = 0;
        
        stepResult.answers.forEach((answer: any) => {
          // Recalculate marks without negative marking
          if (answer.isCorrect) {
            answer.marksAwarded = quiz.eachQuestionMarks || 1;
            stepMarks += answer.marksAwarded;
            stepCorrect++;
          } else {
            answer.marksAwarded = 0; // No negative marking
          }
        });
        
        stepResult.totalMarks = Math.max(0, stepMarks);
        stepResult.maxMarks = stepMaxMarks;
        stepResult.percentage = Math.round((stepResult.totalMarks / stepResult.maxMarks) * 100 * 100) / 100;
        stepResult.passed = stepResult.percentage >= (step.passingMarks || 70);
        stepResult.correctAnswers = stepCorrect;
        
        totalMarks += stepResult.totalMarks;
        maxMarks += stepMaxMarks;
      });
    } else {
      // Recalculate for single-step quiz
      maxMarks = quiz.maxMarks || (quiz.questions.length * (quiz.eachQuestionMarks || 1));
      
      attempt.answers.forEach((answer: any) => {
        // Recalculate marks without negative marking
        if (answer.isCorrect) {
          answer.marksAwarded = quiz.eachQuestionMarks || 1;
          totalMarks += answer.marksAwarded;
        } else {
          answer.marksAwarded = 0; // No negative marking
        }
      });
      
      totalMarks = Math.max(0, totalMarks);
    }
    
    // Update attempt with recalculated values
    attempt.totalMarks = totalMarks;
    attempt.maxMarks = maxMarks;
    attempt.percentage = Math.round((totalMarks / maxMarks) * 100 * 100) / 100;
    
    const passingThreshold = quiz.quizType === 'multi_step' 
      ? (quiz.overallPassingPercentage || 70)
      : (quiz.passingMarks || 70);
    attempt.passed = attempt.percentage >= passingThreshold;
    
    await attempt.save();
    
    return NextResponse.json({
      success: true,
      message: 'Quiz attempt recalculated successfully',
      totalMarks,
      maxMarks,
      percentage: attempt.percentage,
      passed: attempt.passed
    });
    
  } catch (error) {
    console.error('Error fixing negative marking:', error);
    return NextResponse.json(
      { error: 'Failed to fix negative marking' },
      { status: 500 }
    );
  }
}

// Fix all attempts for a specific quiz
export async function PUT(request: NextRequest) {
  try {
    await connectMongo();
    
    const { quizId } = await request.json();
    
    if (!quizId) {
      return NextResponse.json(
        { error: 'Quiz ID is required' },
        { status: 400 }
      );
    }
    
    // Get the quiz
    const quiz = await Quiz.findById(quizId);
    
    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      );
    }
    
    // Get all attempts for this quiz
    const attempts = await QuizAttempt.find({ quizId });
    
    let updatedCount = 0;
    
    for (const attempt of attempts) {
      let totalMarks = 0;
      let maxMarks = 0;
      
      // Recalculate for multi-step quiz
      if (quiz.quizType === 'multi_step' && attempt.stepResults) {
        attempt.stepResults.forEach((stepResult: any, stepIndex: number) => {
          let stepMarks = 0;
          const step = quiz.steps[stepIndex];
          const stepMaxMarks = step.questions.length * (quiz.eachQuestionMarks || 1);
          let stepCorrect = 0;
          
          stepResult.answers.forEach((answer: any) => {
            if (answer.isCorrect) {
              answer.marksAwarded = quiz.eachQuestionMarks || 1;
              stepMarks += answer.marksAwarded;
              stepCorrect++;
            } else {
              answer.marksAwarded = 0;
            }
          });
          
          stepResult.totalMarks = Math.max(0, stepMarks);
          stepResult.maxMarks = stepMaxMarks;
          stepResult.percentage = Math.round((stepResult.totalMarks / stepResult.maxMarks) * 100 * 100) / 100;
          stepResult.passed = stepResult.percentage >= (step.passingMarks || 70);
          stepResult.correctAnswers = stepCorrect;
          
          totalMarks += stepResult.totalMarks;
          maxMarks += stepMaxMarks;
        });
      } else {
        maxMarks = quiz.maxMarks || (quiz.questions.length * (quiz.eachQuestionMarks || 1));
        
        attempt.answers.forEach((answer: any) => {
          if (answer.isCorrect) {
            answer.marksAwarded = quiz.eachQuestionMarks || 1;
            totalMarks += answer.marksAwarded;
          } else {
            answer.marksAwarded = 0;
          }
        });
        
        totalMarks = Math.max(0, totalMarks);
      }
      
      attempt.totalMarks = totalMarks;
      attempt.maxMarks = maxMarks;
      attempt.percentage = Math.round((totalMarks / maxMarks) * 100 * 100) / 100;
      
      const passingThreshold = quiz.quizType === 'multi_step' 
        ? (quiz.overallPassingPercentage || 70)
        : (quiz.passingMarks || 70);
      attempt.passed = attempt.percentage >= passingThreshold;
      
      await attempt.save();
      updatedCount++;
    }
    
    return NextResponse.json({
      success: true,
      message: `Successfully recalculated ${updatedCount} quiz attempts`,
      updatedCount
    });
    
  } catch (error) {
    console.error('Error fixing negative marking for all attempts:', error);
    return NextResponse.json(
      { error: 'Failed to fix negative marking for all attempts' },
      { status: 500 }
    );
  }
}
