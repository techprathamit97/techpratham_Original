


import { NextResponse } from "next/server";
import { saveLead, getAllLeads } from "@/lib/saveLead";
import { sendLeadEmail } from "@/lib/sendLeadEmail";

/* -------------------- HELPERS -------------------- */

// Check if IP is private or local
function isPrivateIP(ip: string) {
  return (
    ip === "::1" ||
    ip === "127.0.0.1" ||
    ip.startsWith("192.168.") ||
    ip.startsWith("10.") ||
    ip.startsWith("172.")
  );
}

// Resolve country from IP (SERVER-SIDE)
async function getCountryFromIP(ip: string): Promise<string> {
  if (!ip || ip === "Unknown IP" || isPrivateIP(ip)) {
    return "Unknown";
  }

  try {
    const res = await fetch(`https://ipwho.is/${ip}`, {
      cache: "no-store",
    });

    const data = await res.json();

    if (data?.success && data?.country) {
      return data.country;
    }

    return "Unknown";
  } catch (error) {
    console.error("IP Geo lookup failed:", error);
    return "Unknown";
  }
}

/* -------------------- POST: CREATE LEAD -------------------- */

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Get real client IP
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ipAddress =
      forwardedFor?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "Unknown IP";

    // Get country on server
    const country = await getCountryFromIP(ipAddress);

    const leadData = {
      ...body,
      ipAddress,
      country,
      createdAt: new Date(),
    };

    // Save lead
    await saveLead(leadData);

    // Send email
    await sendLeadEmail(leadData);

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Lead API Error:", error);
    return NextResponse.json(
      { status: "error", message: "Lead submission failed" },
      { status: 500 }
    );
  }
}

/* -------------------- GET: FETCH LEADS -------------------- */

export async function GET() {
  try {
    const leads = await getAllLeads();

    // Return leads directly as array for frontend compatibility
    return NextResponse.json(leads);
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}

/* -------------------- PUT: UPDATE LEAD -------------------- */

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get('id');

    if (!leadId) {
      return NextResponse.json(
        { status: "error", message: "Lead ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Import Lead model and update
    const { Lead } = await import("@/models/Lead");
    const { connectMongo } = await import("@/utils/mongodb");
    await connectMongo();
    
    // Build update object with only provided fields
    const updateData: any = {};
    if (body.fullName !== undefined) updateData.fullName = body.fullName;
    if (body.email !== undefined) updateData.email = body.email;
    if (body.phone !== undefined) updateData.phone = body.phone;
    if (body.course !== undefined) updateData.course = body.course;
    if (body.message !== undefined) updateData.message = body.message;
    if (body.formType !== undefined) updateData.formType = body.formType;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.ipAddress !== undefined) updateData.ipAddress = body.ipAddress;
    if (body.metadata !== undefined) updateData.metadata = body.metadata;

    console.log('Updating lead:', leadId, 'with data:', updateData);
    
    const updatedLead = await Lead.findByIdAndUpdate(
      leadId,
      updateData,
      { new: true }
    );

    if (!updatedLead) {
      return NextResponse.json(
        { status: "error", message: "Lead not found" },
        { status: 404 }
      );
    }

    console.log('Lead updated successfully:', updatedLead);

    return NextResponse.json({ 
      status: "ok", 
      data: updatedLead 
    });
  } catch (error) {
    console.error("Lead update error:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to update lead" },
      { status: 500 }
    );
  }
}

/* -------------------- DELETE: DELETE LEAD -------------------- */

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get('id');

    if (!leadId) {
      return NextResponse.json(
        { status: "error", message: "Lead ID is required" },
        { status: 400 }
      );
    }

    // Import Lead model and delete
    const { Lead } = await import("@/models/Lead");
    const { connectMongo } = await import("@/utils/mongodb");
    await connectMongo();
    
    const deletedLead = await Lead.findByIdAndDelete(leadId);

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
    console.error("Lead deletion error:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to delete lead" },
      { status: 500 }
    );
  }
}
