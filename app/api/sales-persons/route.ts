import { NextResponse } from 'next/server';
import { connectMongo } from '@/utils/mongodb';
import SalesPerson from '@/models/SalesPerson';

// GET - Fetch all active sales persons
export async function GET() {
  try {
    await connectMongo();
    const salesPersons = await SalesPerson.find({ isActive: true })
      .select('name')
      .sort({ name: 1 })
      .lean();
    return NextResponse.json(salesPersons);
  } catch (error: any) {
    console.error("Sales persons fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch sales persons" },
      { status: 500 }
    );
  }
}

// POST - Create new sales person
export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    if (!data.name || data.name.trim() === '') {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    await connectMongo();

    const trimmedName = data.name.trim();
    
    // Check for duplicates (case-insensitive)
    const existing = await SalesPerson.findOne({ 
      name: { $regex: new RegExp(`^${trimmedName}$`, 'i') },
      isActive: true 
    });

    if (existing) {
      return NextResponse.json(
        { error: "Sales person with this name already exists" },
        { status: 409 }
      );
    }

    // Create new sales person
    const salesPerson = new SalesPerson({
      name: trimmedName,
      isActive: true
    });

    const saved = await salesPerson.save();

    return NextResponse.json({
      success: true,
      message: "Sales person created successfully",
      salesPerson: saved
    });

  } catch (error: any) {
    console.error("Create sales person error:", error);
    
    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Sales person with this name already exists" },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to create sales person" },
      { status: 500 }
    );
  }
}

// DELETE - Remove sales person
export async function DELETE(req: Request) {
  try {
    await connectMongo();
    
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: "Sales person ID is required" },
        { status: 400 }
      );
    }

    const deletedSalesPerson = await SalesPerson.findByIdAndDelete(id);
    
    if (!deletedSalesPerson) {
      return NextResponse.json(
        { error: "Sales person not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Sales person deleted successfully"
    });

  } catch (error: any) {
    console.error("Delete sales person error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete sales person" },
      { status: 500 }
    );
  }
}