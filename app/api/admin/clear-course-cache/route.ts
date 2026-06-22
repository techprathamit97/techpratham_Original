import { NextResponse } from "next/server";
import { clearFetchGroupedCache } from "@/lib/courseCache";

export async function GET() {
  try {
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

export async function POST() {
  return GET(); // Allow both GET and POST for convenience
}