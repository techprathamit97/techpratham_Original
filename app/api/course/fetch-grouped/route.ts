

import { NextResponse } from "next/server";
import { connectMongo } from "@/utils/mongodb";
import Course from "@/models/course";
import { getCachedData, setCachedData, CACHE_TTL } from "@/lib/courseCache";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const bustCache = searchParams.get('bustCache');
    const now = Date.now();

    // ✅ 1️⃣ Serve from cache if valid (unless cache busting is requested)
    if (!bustCache) {
      const cached = getCachedData();
      if (cached) {
        return NextResponse.json(cached, {
          headers: {
            "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
          },
        });
      }
    }

    await connectMongo();

    // ✅ 3️⃣ Fetch only required fields including priority
    const courses = await Course.find(
      {},
      "_id title image alt category link trending priority"
    ).lean();

    // ✅ Sort courses by priority (handle null/undefined priority values)
    // LOWER priority numbers appear FIRST (1, 2, 3, 4, 5, etc.)
    const sortedCourses = courses.sort((a, b) => {
      const priorityA = a.priority || 999; // Default high number for courses without priority
      const priorityB = b.priority || 999;
      
      // Sort by priority ASCENDING (lower numbers first: 1, 2, 3, 4, 5...)
      if (priorityA !== priorityB) {
        return priorityA - priorityB; // Lower priority number appears first
      }
      
      // If priorities are equal, sort by creation date (newer first)
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });

    // ✅ 4️⃣ Separate trending & normal courses (both sorted by priority)
    const trendingCourses = sortedCourses.filter(course => course.trending === true);

    const categoryMap: Record<string, any[]> = {};

    for (const course of sortedCourses) {
      if (course.trending) continue;

      if (!categoryMap[course.category]) {
        categoryMap[course.category] = [];
      }

      categoryMap[course.category].push(course);
    }

    // ✅ 5️⃣ Convert category map → array (courses already sorted by priority from query)
    const normalCategories = Object.keys(categoryMap).map(category => ({
      name: category,
      courses: categoryMap[category], // Already sorted by priority from the main query
    }));

    // ✅ 6️⃣ Trending ALWAYS first
    const groupedData = trendingCourses.length
      ? [
          { name: "Trending Courses", courses: trendingCourses },
          ...normalCategories,
        ]
      : normalCategories;

    // ✅ 7️⃣ Update cache
    setCachedData(groupedData);

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
