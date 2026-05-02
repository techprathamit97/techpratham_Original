import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/utils/mongodb';
import QuizAttempt from '@/models/QuizAttempt';
import Quiz from '@/models/Quiz';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectMongo();
    
    const { id } = await params;
    const attempt = await QuizAttempt.findById(id)
      .populate('quizId')
      .lean();
    
    if (!attempt) {
      return NextResponse.json(
        { error: 'Quiz attempt not found' },
        { status: 404 }
      );
    }
    
    // Get the quiz details for detailed results
    const quiz = await Quiz.findById((attempt as any).quizId);
    
    if (!quiz) {
      return NextResponse.json(
        { error: 'Associated quiz not found' },
        { status: 404 }
      );
    }
    
    // Combine attempt data with question details for detailed results
    const attemptData = attempt as any;
    
    // Check if it's a multi-step quiz
    if (quiz.quizType === 'multi_step' && quiz.steps && attemptData.stepResults) {
      // Calculate correct and incorrect answers for multi-step
      let totalCorrect = 0;
      let totalIncorrect = 0;
      
      attemptData.stepResults.forEach((stepResult: any) => {
        stepResult.answers.forEach((answer: any) => {
          if (answer.isCorrect) {
            totalCorrect++;
          } else {
            totalIncorrect++;
          }
        });
      });
      
      const detailedResults = {
        ...attemptData,
        quizType: 'multi_step',
        correctAnswers: totalCorrect,
        incorrectAnswers: totalIncorrect,
        quiz: {
          title: quiz.title,
          category: quiz.category,
          description: quiz.description,
          quizType: quiz.quizType,
          overallPassingPercentage: quiz.overallPassingPercentage,
          eachQuestionMarks: quiz.eachQuestionMarks,
          negativeMarking: quiz.negativeMarking
        },
        stepResults: attemptData.stepResults.map((stepResult: any, stepIndex: number) => {
          const step = quiz.steps[stepIndex];
          
          return {
            ...stepResult,
            questions: step.questions.map((question: any, qIndex: number) => {
              const userAnswer = stepResult.answers[qIndex];
              
              return {
                questionText: question.questionText,
                questionType: question.questionType,
                options: question.options,
                correctAnswer: question.correctAnswer,
                explanation: question.explanation,
                marks: quiz.eachQuestionMarks,
                userAnswer: userAnswer?.selectedAnswer,
                isCorrect: userAnswer?.isCorrect || false,
                marksAwarded: userAnswer?.marksAwarded || 0
              };
            })
          };
        })
      };
      
      return NextResponse.json(detailedResults);
    } else {
      // Single-step quiz
      // Calculate correct and incorrect answers
      const correctAnswers = attemptData.answers.filter((answer: any) => answer.isCorrect).length;
      const incorrectAnswers = attemptData.answers.filter((answer: any) => !answer.isCorrect).length;
      
      const detailedResults = {
        ...attemptData,
        quizType: 'single_step',
        correctAnswers,
        incorrectAnswers,
        quiz: {
          title: quiz.title,
          category: quiz.category,
          description: quiz.description,
          quizType: quiz.quizType || 'single_step',
          timing: quiz.timing,
          passingMarks: quiz.passingMarks,
          maxMarks: quiz.maxMarks,
          eachQuestionMarks: quiz.eachQuestionMarks,
          negativeMarking: quiz.negativeMarking
        },
        questions: quiz.questions.map((question: any, index: number) => {
          const userAnswer = attemptData.answers[index];
          
          return {
            questionText: question.questionText,
            questionType: question.questionType,
            options: question.options,
            correctAnswer: question.correctAnswer,
            explanation: question.explanation,
            marks: question.marks,
            userAnswer: userAnswer?.selectedAnswer,
            isCorrect: userAnswer?.isCorrect || false,
            marksAwarded: userAnswer?.marksAwarded || 0
          };
        })
      };
      
      return NextResponse.json(detailedResults);
    }
  } catch (error) {
    console.error('Error fetching quiz attempt details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz attempt details' },
      { status: 500 }
    );
  }
}