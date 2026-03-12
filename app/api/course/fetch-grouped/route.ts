

import { NextResponse } from "next/server";
import { connectMongo } from "@/utils/mongodb";
import Course from "@/models/course";

/* ===============================
   SIMPLE IN-MEMORY CACHE
================================ */
let cachedData: any[] | null = null;
let lastFetchTime = 0;

// Cache TTL → 60 seconds (adjustable)
const CACHE_TTL = 60 * 1000;

export async function GET() {
  try {
    const now = Date.now();

    // ✅ 1️⃣ Serve from cache if valid
    if (cachedData && now - lastFetchTime < CACHE_TTL) {
      return NextResponse.json(cachedData, {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      });
    }


    await connectMongo();

    // ✅ 3️⃣ Fetch only required fields
    const courses = await Course.find(
      {},
      "_id title image alt category link trending"
    ).lean();

    // ✅ 4️⃣ Separate trending & normal courses
    const trendingCourses = courses.filter(course => course.trending === true);

    const categoryMap: Record<string, any[]> = {};

    for (const course of courses) {
      if (course.trending) continue;

      if (!categoryMap[course.category]) {
        categoryMap[course.category] = [];
      }

      categoryMap[course.category].push(course);
    }

    // ✅ 5️⃣ Convert category map → array
    const normalCategories = Object.keys(categoryMap).map(category => ({
      name: category,
      courses: categoryMap[category],
    }));

    // ✅ 6️⃣ Trending ALWAYS first
    const groupedData = trendingCourses.length
      ? [
          { name: "Trending Courses", courses: trendingCourses },
          ...normalCategories,
        ]
      : normalCategories;

    // ✅ 7️⃣ Update cache
    cachedData = groupedData;
    lastFetchTime = now;

    // ✅ 8️⃣ Return response with CDN headers
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
