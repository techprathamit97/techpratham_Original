import { NextResponse } from "next/server";
import { connectMongo } from "@/utils/mongodb";
import Trainer from "@/models/Trainer.js";

export async function GET(req: Request) {
  try {
    await connectMongo();
    
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const existingTrainer = await Trainer.findOne({ email: email.toLowerCase() });
    
    return NextResponse.json({
      available: !existingTrainer,
      email: email
    });
  } catch (error: any) {
    console.error("Email check error:", error);
    return NextResponse.json(
      { error: "Failed to check email availability" },
      { status: 500 }
    );
  }
}