import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/utils/mongodb';
import QuizModule from '@/models/QuizModule';
import QuizModuleAttempt from '@/models/QuizModuleAttempt';

export async function POST(request: NextRequest) {
  try {
    await connectMongo();
    
    const body = await request.json();
    const {
      quizModuleId,
      userId,
      userEmail,
      userName,
      stepNumber,
      stepAnswers,
      timeSpent,
      startedAt
    } = body;

    // Validate required fields
    if (!quizModuleId || !userId || !userEmail || !userName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get the quiz module
    const quizModule = await QuizModule.findById(quizModuleId);
    if (!quizModule) {
      return NextResponse.json(
        { error: 'Quiz module not found' },
        { status: 404 }
      );
    }

    // Check if user already has an attempt
    let attempt = await QuizModuleAttempt.findOne({
      quizModuleId,
      userId
    });

    if (quizModule.moduleType === 'single_step') {
      // Handle single-step quiz (backward compatibility)
      if (attempt && attempt.status === 'completed') {
        return NextResponse.json(
          { error: 'You have already completed this quiz' },
          { status: 403 }
        );
      }

      // Calculate results for single-step
      const results = calculateQuizResults(quizModule.questions, stepAnswers, quizModule.eachQuestionMarks, quizModule.negativeMarking);
      
      const attemptData = {
        quizModuleId,
        userId,
        userEmail,
        userName,
        moduleType: 'single_step',
        answers: results.answers,
        totalMarks: results.totalMarks,
        maxMarks: results.maxMarks,
        percentage: results.percentage,
        passed: results.percentage >= quizModule.passingMarks,
        overallTimeSpent: timeSpent,
        status: 'completed',
        startedAt: new Date(startedAt),
        completedAt: new Date()
      };

      if (attempt) {
        // Update existing attempt
        Object.assign(attempt, attemptData);
        await attempt.save();
      } else {
        // Create new attempt
        attempt = new QuizModuleAttempt(attemptData);
        await attempt.save();
      }

      return NextResponse.json({
        success: true,
        message: 'Quiz completed successfully',
        attemptId: attempt._id,
        results: {
          totalMarks: results.totalMarks,
          maxMarks: results.maxMarks,
          percentage: results.percentage,
          passed: results.percentage >= quizModule.passingMarks
        }
      });
    } else {
      // Handle multi-step quiz
      if (!stepNumber || !stepAnswers) {
        return NextResponse.json(
          { error: 'Step number and answers are required for multi-step quizzes' },
          { status: 400 }
        );
      }

      // Find the step
      const step = quizModule.steps.find((s: any) => s.stepNumber === stepNumber);
      if (!step) {
        return NextResponse.json(
          { error: 'Step not found' },
          { status: 404 }
        );
      }

      // Calculate results for this step
      const stepResults = calculateQuizResults(step.questions, stepAnswers, quizModule.eachQuestionMarks, quizModule.negativeMarking);
      
      const stepAttempt = {
        stepId: step._id,
        stepNumber: step.stepNumber,
        stepTitle: step.stepTitle,
        answers: stepResults.answers,
        totalMarks: stepResults.totalMarks,
        maxMarks: stepResults.maxMarks,
        percentage: stepResults.percentage,
        passed: stepResults.percentage >= step.passingMarks,
        timeSpent,
        startedAt: new Date(startedAt),
        completedAt: new Date(),
        status: 'completed'
      };

      if (!attempt) {
        // Create new attempt
        attempt = new QuizModuleAttempt({
          quizModuleId,
          userId,
          userEmail,
          userName,
          moduleType: 'multi_step',
          stepAttempts: [stepAttempt],
          currentStep: stepNumber + 1,
          totalMarks: stepResults.totalMarks,
          maxMarks: stepResults.maxMarks,
          percentage: stepResults.percentage,
          passed: false, // Will be calculated when all steps are completed
          overallTimeSpent: timeSpent,
          status: stepNumber >= quizModule.steps.length ? 'completed' : 'in_progress',
          startedAt: new Date(startedAt),
          completedAt: stepNumber >= quizModule.steps.length ? new Date() : undefined
        });
      } else {
        // Update existing attempt
        const existingStepIndex = attempt.stepAttempts.findIndex((sa: any) => sa.stepNumber === stepNumber);
        
        if (existingStepIndex >= 0) {
          // Update existing step attempt
          attempt.stepAttempts[existingStepIndex] = stepAttempt;
        } else {
          // Add new step attempt
          attempt.stepAttempts.push(stepAttempt);
        }

        // Update overall progress
        attempt.currentStep = Math.max(attempt.currentStep, stepNumber + 1);
        attempt.overallTimeSpent += timeSpent;

        // Calculate overall results if all steps are completed
        if (attempt.stepAttempts.length >= quizModule.steps.length) {
          const overallResults = calculateOverallResults(attempt.stepAttempts);
          attempt.totalMarks = overallResults.totalMarks;
          attempt.maxMarks = overallResults.maxMarks;
          attempt.percentage = overallResults.percentage;
          attempt.passed = overallResults.percentage >= quizModule.overallPassingPercentage;
          attempt.status = 'completed';
          attempt.completedAt = new Date();
        }
      }

      await attempt.save();

      return NextResponse.json({
        success: true,
        message: `Step ${stepNumber} completed successfully`,
        attemptId: attempt._id,
        stepResults: {
          stepNumber,
          totalMarks: stepResults.totalMarks,
          maxMarks: stepResults.maxMarks,
          percentage: stepResults.percentage,
          passed: stepResults.percentage >= step.passingMarks
        },
        overallProgress: {
          completedSteps: attempt.stepAttempts.length,
          totalSteps: quizModule.steps.length,
          currentStep: attempt.currentStep,
          isCompleted: attempt.status === 'completed',
          overallPassed: attempt.passed
        }
      });
    }
  } catch (error) {
    console.error('Error submitting quiz module attempt:', error);
    return NextResponse.json(
      { error: 'Failed to submit quiz attempt' },
      { status: 500 }
    );
  }
}

function calculateQuizResults(questions: any[], answers: any[], eachQuestionMarks: number, negativeMarking: any) {
  let totalMarks = 0;
  const maxMarks = questions.length * eachQuestionMarks;
  const processedAnswers = [];

  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
    const userAnswer = answers[i];
    let isCorrect = false;
    let marksAwarded = 0;

    if (question.questionType === 'multiple_choice') {
      const correctOptionIndex = question.options.findIndex((opt: any) => opt.isCorrect);
      isCorrect = userAnswer?.selectedAnswer === correctOptionIndex;
    } else if (question.questionType === 'true_false') {
      isCorrect = userAnswer?.selectedAnswer === question.correctAnswer;
    }

    if (isCorrect) {
      marksAwarded = eachQuestionMarks;
    } else if (negativeMarking.enabled && userAnswer?.selectedAnswer !== null && userAnswer?.selectedAnswer !== undefined) {
      marksAwarded = -negativeMarking.marksDeducted;
    }

    totalMarks += marksAwarded;

    processedAnswers.push({
      questionId: question._id,
      selectedAnswer: userAnswer?.selectedAnswer,
      isCorrect,
      marksAwarded
    });
  }

  // Ensure total marks is not negative
  totalMarks = Math.max(0, totalMarks);
  const percentage = Math.round((totalMarks / maxMarks) * 100);

  return {
    answers: processedAnswers,
    totalMarks,
    maxMarks,
    percentage
  };
}

function calculateOverallResults(stepAttempts: any[]) {
  const totalMarks = stepAttempts.reduce((sum, step) => sum + step.totalMarks, 0);
  const maxMarks = stepAttempts.reduce((sum, step) => sum + step.maxMarks, 0);
  const percentage = Math.round((totalMarks / maxMarks) * 100);

  return {
    totalMarks,
    maxMarks,
    percentage
  };
}