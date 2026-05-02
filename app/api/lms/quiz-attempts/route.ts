import { NextResponse } from "next/server";
import { connectMongo } from "@/utils/mongodb";
import QuizAttempt from "@/models/QuizAttempt";
import Quiz from "@/models/Quiz";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(req: Request) {
  try {
    await connectMongo();
    
    const { searchParams } = new URL(req.url);
    const studentEmail = searchParams.get("studentEmail");
    const quizId = searchParams.get("quizId");
    
    let filter: any = {};
    if (studentEmail) filter.studentEmail = studentEmail;
    if (quizId) filter.quizId = quizId;
    
    const attempts = await QuizAttempt.find(filter)
      .populate('quizId', 'title')
      .sort({ createdAt: -1 })
      .lean();

    // Transform data to include quiz title
    const transformedAttempts = attempts.map(attempt => ({
      ...attempt,
      quizTitle: attempt.quizId?.title || 'Unknown Quiz'
    }));

    return NextResponse.json(transformedAttempts);
  } catch (error: any) {
    console.error("Quiz attempts fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch quiz attempts" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();
    
    const data = await req.json();
    
    // Calculate score
    const quiz = await Quiz.findById(data.quizId);
    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    let correctAnswers = 0;
    const answers = data.answers.map((answer: any, index: number) => {
      const isCorrect = quiz.questions[index].correctAnswer === answer.selectedAnswer;
      if (isCorrect) correctAnswers++;
      
      return {
        questionId: quiz.questions[index]._id,
        selectedAnswer: answer.selectedAnswer,
        isCorrect
      };
    });

    const score = Math.round((correctAnswers / quiz.questions.length) * 100);
    const passed = score >= quiz.passingScore;

    // Get attempt number
    const previousAttempts = await QuizAttempt.countDocuments({
      studentEmail: data.studentEmail,
      quizId: data.quizId
    });

    const attempt = new QuizAttempt({
      ...data,
      answers,
      score,
      passed,
      attemptNumber: previousAttempts + 1
    });

    await attempt.save();

    return NextResponse.json(attempt, { status: 201 });
  } catch (error: any) {
    console.error("Quiz attempt creation error:", error);
    return NextResponse.json(
      { error: "Failed to create quiz attempt" },
      { status: 500 }
    );
  }
}