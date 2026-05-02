import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/utils/mongodb';
import Quiz from '@/models/Quiz';
import QuizAttempt from '@/models/QuizAttempt';

export async function POST(request: NextRequest) {
  try {
    console.log('Quiz attempt API called');
    await connectMongo();
    
    const body = await request.json();
    console.log('Request body:', body);
    
    const {
      quizId,
      quizType,
      userId,
      userEmail,
      userName,
      answers,
      timeSpent,
      startedAt
    } = body;
    
    // Validate required fields
    if (!quizId || !userId || !userEmail || !userName || !answers || !Array.isArray(answers)) {
      console.log('Missing required fields:', { quizId, userId, userEmail, userName, answers: !!answers });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Get the quiz to calculate marks
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      console.log('Quiz not found:', quizId);
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      );
    }
    
    console.log('Quiz found:', quiz.title, 'Type:', quiz.quizType || quizType);
    
    let totalMarks = 0;
    let maxMarks = 0;
    let processedAnswers: any[] = [];
    let stepResults: any[] = [];
    
    if (quiz.quizType === 'multi_step' || quizType === 'multi_step') {
      // Handle multi-step quiz
      console.log('Processing multi-step quiz with', quiz.steps?.length, 'steps');
      
      if (!quiz.steps || quiz.steps.length === 0) {
        return NextResponse.json(
          { error: 'Multi-step quiz has no steps configured' },
          { status: 400 }
        );
      }
      
      // Process each step
      quiz.steps.forEach((step: any, stepIndex: number) => {
        let stepMarks = 0;
        let stepMaxMarks = step.questions.length * (quiz.eachQuestionMarks || 1);
        let stepCorrect = 0;
        
        const stepAnswers = step.questions.map((question: any, questionIndex: number) => {
          // Find the answer for this step and question
          const answer = answers.find((a: any) => 
            a.stepIndex === stepIndex && a.questionIndex === questionIndex
          );
          
          let isCorrect = false;
          let marksAwarded = 0;
          let selectedAnswerValue = answer?.selectedAnswer ?? null;
          
          // Only process if answer was provided
          if (answer && answer.selectedAnswer !== null && answer.selectedAnswer !== undefined) {
            if (question.questionType === 'multiple_choice') {
              const selectedOption = question.options[answer.selectedAnswer];
              isCorrect = selectedOption?.isCorrect || false;
            } else if (question.questionType === 'true_false') {
              isCorrect = answer.selectedAnswer === question.correctAnswer;
            }
            
            if (isCorrect) {
              marksAwarded = quiz.eachQuestionMarks || 1;
              stepCorrect++;
            }
            // Negative marking removed - incorrect answers get 0 marks
          } else {
            // Unanswered question - no marks, not correct
            isCorrect = false;
            marksAwarded = 0;
            selectedAnswerValue = null;
          }
          
          stepMarks += marksAwarded;
          
          return {
            questionId: question._id,
            questionText: question.questionText,
            selectedAnswer: selectedAnswerValue,
            isCorrect,
            marksAwarded
          };
        });
        
        stepMarks = Math.max(0, stepMarks);
        totalMarks += stepMarks;
        maxMarks += stepMaxMarks;
        
        const stepPercentage = (stepMarks / stepMaxMarks) * 100;
        const stepPassed = stepPercentage >= (step.passingMarks || 70);
        
        stepResults.push({
          stepNumber: step.stepNumber,
          stepTitle: step.stepTitle,
          answers: stepAnswers,
          totalMarks: stepMarks,
          maxMarks: stepMaxMarks,
          percentage: Math.round(stepPercentage * 100) / 100,
          passed: stepPassed,
          correctAnswers: stepCorrect,
          totalQuestions: step.questions.length
        });
        
        processedAnswers.push(...stepAnswers);
      });
      
    } else {
      // Handle single-step quiz
      console.log('Processing single-step quiz with', quiz.questions?.length, 'questions');
      
      if (!quiz.questions || quiz.questions.length === 0) {
        return NextResponse.json(
          { error: 'Quiz has no questions configured' },
          { status: 400 }
        );
      }
      
      maxMarks = quiz.maxMarks || (quiz.questions.length * (quiz.eachQuestionMarks || 1));
      
      processedAnswers = answers.map((answer: any, index: number) => {
        const question = quiz.questions[index];
        let isCorrect = false;
        let marksAwarded = 0;
        let selectedAnswerValue = answer?.selectedAnswer ?? null;
        
        // Only process if answer was provided
        if (answer && answer.selectedAnswer !== null && answer.selectedAnswer !== undefined) {
          if (question.questionType === 'multiple_choice') {
            const selectedOption = question.options[answer.selectedAnswer];
            isCorrect = selectedOption?.isCorrect || false;
          } else if (question.questionType === 'true_false') {
            isCorrect = answer.selectedAnswer === question.correctAnswer;
          }
          
          if (isCorrect) {
            marksAwarded = quiz.eachQuestionMarks || 1;
          }
          // Negative marking removed - incorrect answers get 0 marks
        } else {
          // Unanswered question - no marks, not correct
          isCorrect = false;
          marksAwarded = 0;
          selectedAnswerValue = null;
        }
        
        totalMarks += marksAwarded;
        
        return {
          questionId: question._id,
          selectedAnswer: selectedAnswerValue,
          isCorrect,
          marksAwarded
        };
      });
      
      totalMarks = Math.max(0, totalMarks);
    }
    
    const percentage = (totalMarks / maxMarks) * 100;
    const passingThreshold = quiz.quizType === 'multi_step' 
      ? (quiz.overallPassingPercentage || 70)
      : (quiz.passingMarks || 70);
    const passed = percentage >= passingThreshold;
    
    console.log('Calculated results:', { totalMarks, maxMarks, percentage, passed });
    
    const quizAttemptData: any = {
      quizId,
      userId,
      userEmail,
      userName,
      answers: processedAnswers,
      totalMarks,
      maxMarks,
      percentage: Math.round(percentage * 100) / 100,
      passed,
      timeSpent: timeSpent || 0,
      startedAt: startedAt ? new Date(startedAt) : new Date(),
      completedAt: new Date()
    };
    
    // Add step results for multi-step quizzes
    if (quiz.quizType === 'multi_step' || quizType === 'multi_step') {
      quizAttemptData.stepResults = stepResults;
    }
    
    const quizAttempt = new QuizAttempt(quizAttemptData);
    
    console.log('Saving quiz attempt...');
    await quizAttempt.save();
    console.log('Quiz attempt saved successfully');
    
    // Send email notification to user
    try {
      console.log('Attempting to send completion email...');
      
      const emailResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/quiz/send-completion-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail,
          userName,
          quizTitle: quiz.title,
          totalMarks,
          maxMarks,
          percentage: quizAttempt.percentage,
          passed
        })
      });
      
      const emailResult = await emailResponse.json();
      console.log('Email API response:', emailResult);
      
      if (!emailResponse.ok) {
        console.error('Failed to send completion email:', emailResult);
      }
    } catch (emailError) {
      console.error('Error sending completion email:', emailError);
    }
    
    const responseData: any = {
      attemptId: quizAttempt._id,
      totalMarks,
      maxMarks,
      percentage: quizAttempt.percentage,
      passed,
      correctAnswers: processedAnswers.filter((a: any) => a.isCorrect).length,
      totalQuestions: processedAnswers.length,
      message: 'Quiz completed successfully! Our TechPratham team will get back to you.'
    };
    
    if (stepResults.length > 0) {
      responseData.stepResults = stepResults;
    }
    
    return NextResponse.json(responseData, { status: 201 });
    
  } catch (error) {
    console.error('Error submitting quiz attempt:', error);
    return NextResponse.json(
      { error: 'Failed to submit quiz attempt' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectMongo();
    
    const { searchParams } = new URL(request.url);
    const quizId = searchParams.get('quizId');
    const userId = searchParams.get('userId');
    
    let filter: any = {};
    
    if (quizId) {
      filter.quizId = quizId;
    }
    
    if (userId) {
      filter.userId = userId;
    }
    
    const attempts = await QuizAttempt.find(filter)
      .populate('quizId', 'title category')
      .sort({ createdAt: -1 })
      .lean();
    
    return NextResponse.json(attempts);
  } catch (error) {
    console.error('Error fetching quiz attempts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz attempts' },
      { status: 500 }
    );
  }
}