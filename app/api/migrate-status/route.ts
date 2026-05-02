import { NextResponse } from "next/server";
import { connectMongo } from "@/utils/mongodb";
import { Lead } from "@/models/Lead";

export async function POST() {
  try {
    await connectMongo();
    
    // Update all leads that don't have a status field
    const result = await Lead.updateMany(
      { status: { $exists: false } }, // Find leads without status field
      { $set: { status: 'unreached' } } // Set default status
    );

    console.log('Migration result:', result);

    return NextResponse.json({ 
      status: "ok", 
      message: `Updated ${result.modifiedCount} leads with default status`,
      modifiedCount: result.modifiedCount,
      matchedCount: result.matchedCount
    });
  } catch (error) {
    console.error("Migration error:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to migrate status field" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectMongo();
    
    // Check how many leads have/don't have status
    const totalLeads = await Lead.countDocuments();
    const leadsWithStatus = await Lead.countDocuments({ status: { $exists: true } });
    const leadsWithoutStatus = totalLeads - leadsWithStatus;
    
    // Get sample leads to check status field
    const sampleLeads = await Lead.find().limit(3).lean();
    
    return NextResponse.json({
      status: "ok",
      totalLeads,
      leadsWithStatus,
      leadsWithoutStatus,
      sampleLeads: sampleLeads.map(lead => ({
        _id: lead._id,
        fullName: lead.fullName,
        status: lead.status,
        hasStatusField: 'status' in lead
      }))
    });
  } catch (error) {
    console.error("Status check error:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to check status field" },
      { status: 500 }
    );
  }
}