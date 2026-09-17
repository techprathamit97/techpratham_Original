import { NextResponse } from "next/server";
import { getGroupedCourses } from "@/lib/homeData";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const bustCache = searchParams.get('bustCache');

    const groupedData = await getGroupedCourses(Boolean(bustCache));

    return NextResponse.json(groupedData, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("Course fetch error:", error);

    return NextResponse.json(
      { message: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}
