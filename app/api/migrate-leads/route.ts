import { NextResponse } from "next/server";
import { connectMongo } from "@/utils/mongodb";
import { Lead } from "@/models/Lead";
import { LeadManagement } from "@/models/LeadManagement";

export async function POST() {
  try {
    await connectMongo();
    
    // Get all form leads
    const formLeads = await Lead.find().lean();
    
    if (formLeads.length === 0) {
      return NextResponse.json({ 
        status: "ok", 
        message: "No form leads to migrate",
        migrated: 0 
      });
    }

    // Convert form leads to lead management format
    const leadManagementData = formLeads.map(lead => ({
      name: lead.fullName || 'Unknown',
      email: lead.email || '',
      phone: lead.phone || '',
      source: 'website', // Default source for migrated leads
      course: lead.course || '',
      status: 'new',
      notes: lead.message || '',
      assignedTo: '',
      convertedToInvoice: false,
      invoiceId: '',
      createdAt: lead.createdAt,
      updatedAt: lead.updatedAt
    }));

    // Insert into LeadManagement collection
    const result = await LeadManagement.insertMany(leadManagementData);

    return NextResponse.json({ 
      status: "ok", 
      message: `Successfully migrated ${result.length} leads`,
      migrated: result.length 
    });
  } catch (error) {
    console.error("Lead migration error:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to migrate leads" },
      { status: 500 }
    );
  }
}

// Also add a test lead for immediate testing
export async function GET() {
  try {
    await connectMongo();
    
    // Add a test lead
    const testLead = await LeadManagement.create({
      name: "Test Lead",
      email: "test@example.com",
      phone: "+91 9876543210",
      source: "instagram",
      course: "Workday HCM",
      status: "new",
      notes: "Test lead for verification",
      assignedTo: "",
      convertedToInvoice: false,
      invoiceId: ""
    });

    return NextResponse.json({ 
      status: "ok", 
      message: "Test lead created",
      lead: testLead 
    });
  } catch (error) {
    console.error("Test lead creation error:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to create test lead" },
      { status: 500 }
    );
  }
}