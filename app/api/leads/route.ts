


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

    return NextResponse.json({
      status: "ok",
      data: leads,
    });
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}
