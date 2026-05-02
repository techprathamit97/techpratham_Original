import { NextResponse } from "next/server";
import { connectMongo } from "@/utils/mongodb";
import Batch from "@/models/Batch.js";
import Trainer from "@/models/Trainer.js";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
  try {
    await connectMongo();
    
    const batches = await Batch.find({})
      .sort({ createdAt: -1 })
      .lean();

    // Populate trainer details for each batch using trainerId
    const batchesWithTrainers = await Promise.all(
      batches.map(async (batch) => {
        try {
          const trainer = await Trainer.findOne({ trainerId: batch.trainerId }).lean();
          return {
            ...batch,
            trainer: trainer ? {
              name: (trainer as any).name,
              email: (trainer as any).email,
              profile: (trainer as any).profile || "",
              experience: (trainer as any).experience || "",
              rating: (trainer as any).rating || 4.5
            } : {
              name: "Unknown Trainer",
              email: "",
              profile: "",
              experience: "",
              rating: 4.5
            }
          };
        } catch (error) {
          console.error(`Error fetching trainer for batch ${batch._id}:`, error);
          return {
            ...batch,
            trainer: {
              name: "Unknown Trainer",
              email: "",
              profile: "",
              experience: "",
              rating: 4.5
            }
          };
        }
      })
    );

    return NextResponse.json(batchesWithTrainers);
  } catch (error: any) {
    console.error("Batches fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch batches" },
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
    if (!data.course_link || !data.trainerId || !data.schedule?.startDate || !data.schedule?.endDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify trainer exists using trainerId (Login ID)
    const trainer = await Trainer.findOne({ trainerId: data.trainerId });
    if (!trainer) {
      return NextResponse.json(
        { error: "Trainer not found with the provided Login ID" },
        { status: 400 }
      );
    }
    
    const batch = new Batch(data);
    await batch.save();

    return NextResponse.json(batch, { status: 201 });
  } catch (error: any) {
    console.error("Batch creation error:", error);
    
    // Return more specific error messages
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Batch ID already exists" },
        { status: 400 }
      );
    }
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: `Validation error: ${validationErrors.join(', ')}` },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || "Failed to create batch" },
      { status: 500 }
    );
  }
}