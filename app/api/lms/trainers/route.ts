import { NextResponse } from "next/server";
import { connectMongo } from "@/utils/mongodb";
import Trainer from "@/models/Trainer.js";
import TrainerAuth from "@/models/TrainerAuth";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    await connectMongo();
    
    const trainers = await Trainer.find({})
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(trainers);
  } catch (error: any) {
    console.error("Trainers fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch trainers" },
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
    
    // Validate required fields
    if (!data.name || !data.email || !data.phone) {
      return NextResponse.json(
        { error: "Missing required fields: name, email, and phone are required" },
        { status: 400 }
      );
    }

    // Validate login credentials if provided
    if (data.loginId || data.loginPassword) {
      if (!data.loginId || !data.loginPassword) {
        return NextResponse.json(
          { error: "Both Login ID and Password are required for authentication" },
          { status: 400 }
        );
      }

      if (data.loginId.length < 3) {
        return NextResponse.json(
          { error: "Login ID must be at least 3 characters" },
          { status: 400 }
        );
      }

      if (data.loginPassword.length < 6) {
        return NextResponse.json(
          { error: "Password must be at least 6 characters" },
          { status: 400 }
        );
      }

      // Check if login ID already exists
      const existingAuth = await TrainerAuth.findOne({ trainerId: data.loginId });
      if (existingAuth) {
        return NextResponse.json(
          { error: "Login ID already exists" },
          { status: 400 }
        );
      }
    }
    
    // Normalize email to lowercase
    data.email = data.email.toLowerCase();
    
    const trainer = new Trainer(data);
    await trainer.save();

    // Create authentication account if login credentials provided
    if (data.loginId && data.loginPassword) {
      try {
        const hashedPassword = await bcrypt.hash(data.loginPassword, 10);
        
        const trainerAuth = new TrainerAuth({
          trainerId: data.loginId,
          email: data.email,
          password: hashedPassword,
          name: data.name,
          phone: data.phone,
          isActive: true
        });

        await trainerAuth.save();
      } catch (authError: any) {
        // If auth creation fails, delete the trainer to maintain consistency
        await Trainer.findByIdAndDelete(trainer._id);
        
        if (authError.code === 11000) {
          return NextResponse.json(
            { error: "Login ID or email already exists in authentication system" },
            { status: 400 }
          );
        }
        
        throw authError;
      }
    }

    return NextResponse.json({
      trainer,
      message: data.loginId ? 'Trainer created with login credentials' : 'Trainer created successfully'
    }, { status: 201 });
  } catch (error: any) {
    console.error("Trainer creation error:", error);
    
    // Return more specific error messages
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      if (field === 'email') {
        return NextResponse.json(
          { error: "email already exists" },
          { status: 400 }
        );
      } else if (field === 'trainerId') {
        return NextResponse.json(
          { error: "trainerId already exists" },
          { status: 400 }
        );
      } else {
        return NextResponse.json(
          { error: `${field} already exists` },
          { status: 400 }
        );
      }
    }
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: `Validation error: ${validationErrors.join(', ')}` },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || "Failed to create trainer" },
      { status: 500 }
    );
  }
}