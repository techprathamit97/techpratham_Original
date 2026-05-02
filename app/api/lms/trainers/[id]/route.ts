import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/utils/mongodb";
import Trainer from "@/models/Trainer.js";
import TrainerAuth from "@/models/TrainerAuth";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import bcrypt from 'bcryptjs';

// Update trainer
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();
    
    const data = await req.json();
    const resolvedParams = await params;
    const trainerId = resolvedParams.id;

    // Find the trainer
    const trainer = await Trainer.findById(trainerId);
    if (!trainer) {
      return NextResponse.json(
        { error: "Trainer not found" },
        { status: 404 }
      );
    }

    // Update trainer fields
    if (data.name) trainer.name = data.name;
    if (data.email) trainer.email = data.email.toLowerCase();
    if (data.phone) trainer.phone = data.phone;
    if (data.experience) trainer.experience = data.experience;
    if (data.expertise) trainer.expertise = data.expertise;
    if (data.bio !== undefined) trainer.bio = data.bio;
    if (data.linkedIn !== undefined) trainer.linkedIn = data.linkedIn;
    if (data.github !== undefined) trainer.github = data.github;
    if (data.portfolio !== undefined) trainer.portfolio = data.portfolio;
    if (data.salary !== undefined) trainer.salary = data.salary;
    if (data.paymentMode) trainer.paymentMode = data.paymentMode;

    await trainer.save();

    // Update TrainerAuth if password is provided
    if (data.loginPassword && data.loginPassword.length >= 6) {
      const trainerAuth = await TrainerAuth.findOne({ email: trainer.email });
      if (trainerAuth) {
        const hashedPassword = await bcrypt.hash(data.loginPassword, 10);
        trainerAuth.password = hashedPassword;
        trainerAuth.name = trainer.name;
        trainerAuth.phone = trainer.phone;
        await trainerAuth.save();
      }
    }

    return NextResponse.json({
      trainer,
      message: 'Trainer updated successfully'
    });
  } catch (error: any) {
    console.error("Trainer update error:", error);
    
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json(
        { error: `${field} already exists` },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || "Failed to update trainer" },
      { status: 500 }
    );
  }
}

// Delete trainer
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();
    
    const resolvedParams = await params;
    const trainerId = resolvedParams.id;

    // Find the trainer
    const trainer = await Trainer.findById(trainerId);
    if (!trainer) {
      return NextResponse.json(
        { error: "Trainer not found" },
        { status: 404 }
      );
    }

    // Delete associated TrainerAuth account
    await TrainerAuth.deleteOne({ email: trainer.email });

    // Delete the trainer
    await Trainer.findByIdAndDelete(trainerId);

    return NextResponse.json({
      message: 'Trainer and associated login credentials deleted successfully'
    });
  } catch (error: any) {
    console.error("Trainer deletion error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete trainer" },
      { status: 500 }
    );
  }
}
