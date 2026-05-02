import { NextResponse } from "next/server";
import { connectMongo } from "@/utils/mongodb";
import Quiz from "@/models/Quiz";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(req: Request) {
  try {
    await connectMongo();
    
    const { searchParams } = new URL(req.url);
    const courseLink = searchParams.get("courseLink");
    
    const filter = courseLink ? { course_link: courseLink } : {};
    
    const quizzes = await Quiz.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(quizzes);
  } catch (error: any) {
    console.error("Quizzes fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch quizzes" },
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
    
    const quiz = new Quiz(data);
    await quiz.save();

    return NextResponse.json(quiz, { status: 201 });
  } catch (error: any) {
    console.error("Quiz creation error:", error);
    return NextResponse.json(
      { error: "Failed to create quiz" },
      { status: 500 }
    );
  }
}