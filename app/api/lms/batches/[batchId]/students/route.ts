import { NextResponse } from "next/server";
import { connectMongo } from "@/utils/mongodb";
import Batch from "@/models/Batch.js";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(req: Request, { params }: { params: Promise<{ batchId: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();
    
    const { batchId } = await params;
    const { studentIds } = await req.json();
    
    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      return NextResponse.json({ error: "Invalid student IDs" }, { status: 400 });
    }

    const batch = await Batch.findById(batchId);
    if (!batch) {
      return NextResponse.json({ error: "Batch not found" }, { status: 404 });
    }

    // Add new student IDs to the batch, avoiding duplicates
    const existingStudents = batch.enrolled_students || [];
    const newStudents = studentIds.filter((id: string) => !existingStudents.includes(id));
    
    // Check capacity
    if (existingStudents.length + newStudents.length > batch.capacity) {
      return NextResponse.json({ 
        error: `Cannot assign ${newStudents.length} students. Batch capacity exceeded.` 
      }, { status: 400 });
    }

    batch.enrolled_students = [...existingStudents, ...newStudents];
    await batch.save();

    return NextResponse.json({ 
      message: `${newStudents.length} students assigned successfully`,
      batch 
    });
  } catch (error: any) {
    console.error("Student assignment error:", error);
    return NextResponse.json(
      { error: "Failed to assign students" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ batchId: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();
    
    const { batchId } = await params;
    const { studentIds } = await req.json();
    
    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      return NextResponse.json({ error: "Invalid student IDs" }, { status: 400 });
    }

    const batch = await Batch.findById(batchId);
    if (!batch) {
      return NextResponse.json({ error: "Batch not found" }, { status: 404 });
    }

    // Remove student IDs from the batch
    batch.enrolled_students = batch.enrolled_students.filter((id: string) => !studentIds.includes(id));
    await batch.save();

    return NextResponse.json({ 
      message: `${studentIds.length} students removed successfully`,
      batch 
    });
  } catch (error: any) {
    console.error("Student removal error:", error);
    return NextResponse.json(
      { error: "Failed to remove students" },
      { status: 500 }
    );
  }
}