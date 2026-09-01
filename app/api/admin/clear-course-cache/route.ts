import { NextResponse } from "next/server";
import { clearFetchGroupedCache } from "@/lib/courseCache";
import { requireRole, LEAD_ACCESS_ROLES } from '@/lib/apiAuth';

export async function GET() {
  try {
    const denied = await requireRole(LEAD_ACCESS_ROLES);
    if (denied) return denied;

    clearFetchGroupedCache();
    
    return NextResponse.json(
      { 
        message: "Course cache cleared successfully",
        cleared: true,
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to clear course cache:", error);
    return NextResponse.json(
      { message: "Failed to clear cache" },
      { status: 500 }
    );
  }
}

// Allow both GET and POST for convenience. Delegating to GET means the role
// guard above applies to POST as well.
export async function POST() {
  return GET();
}