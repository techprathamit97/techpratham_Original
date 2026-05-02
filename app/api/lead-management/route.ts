import { NextResponse } from "next/server";
import { connectMongo } from "@/utils/mongodb";
import { LeadManagement } from "@/models/LeadManagement";

/* -------------------- GET: FETCH LEAD MANAGEMENT DATA -------------------- */

export async function GET() {
  try {
    await connectMongo();
    
    const leads = await LeadManagement.find()
      .sort({ createdAt: -1 })
      .lean();

    // Return direct array format expected by frontend
    return NextResponse.json(leads);
  } catch (error) {
    console.error("Error fetching lead management data:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}

/* -------------------- POST: CREATE LEAD MANAGEMENT ENTRY -------------------- */

export async function POST(request: Request) {
  try {
    await connectMongo();
    
    const body = await request.json();

    const leadData = {
      name: body.name,
      email: body.email,
      phone: body.phone,
      source: body.source || 'other',
      course: body.course || '',
      status: body.status || 'new',
      notes: body.notes || '',
      assignedTo: body.assignedTo || '',
      convertedToInvoice: false,
      invoiceId: ''
    };

    const newLead = await LeadManagement.create(leadData);

    return NextResponse.json({ 
      status: "ok", 
      data: newLead 
    });
  } catch (error) {
    console.error("Lead Management API Error:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to create lead" },
      { status: 500 }
    );
  }
}

/* -------------------- PUT: UPDATE LEAD MANAGEMENT ENTRY -------------------- */

export async function PUT(request: Request) {
  try {
    await connectMongo();
    
    const body = await request.json();
    const { _id, ...updateData } = body;

    if (!_id) {
      return NextResponse.json(
        { status: "error", message: "Lead ID is required" },
        { status: 400 }
      );
    }

    const updatedLead = await LeadManagement.findByIdAndUpdate(
      _id,
      updateData,
      { new: true }
    );

    if (!updatedLead) {
      return NextResponse.json(
        { status: "error", message: "Lead not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      status: "ok", 
      data: updatedLead 
    });
  } catch (error) {
    console.error("Lead Management Update Error:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to update lead" },
      { status: 500 }
    );
  }
}

/* -------------------- DELETE: DELETE LEAD MANAGEMENT ENTRY -------------------- */

export async function DELETE(request: Request) {
  try {
    await connectMongo();
    
    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get('id');

    if (!leadId) {
      return NextResponse.json(
        { status: "error", message: "Lead ID is required" },
        { status: 400 }
      );
    }

    const deletedLead = await LeadManagement.findByIdAndDelete(leadId);

    if (!deletedLead) {
      return NextResponse.json(
        { status: "error", message: "Lead not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      status: "ok", 
      message: "Lead deleted successfully" 
    });
  } catch (error) {
    console.error("Lead Management Delete Error:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to delete lead" },
      { status: 500 }
    );
  }
}