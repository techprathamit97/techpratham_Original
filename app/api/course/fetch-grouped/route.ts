

import { NextResponse } from "next/server";
import { connectMongo } from "@/utils/mongodb";
import Course from "@/models/course";
import { Category } from "@/models/category";
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
      "_id title image alt category link shortDesc level rating duration trending priority createdAt"
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

    // ✅ 4️⃣ Keep trending courses in their original categories AND include them in trending category
    const categoryMap: Record<string, any[]> = {};

    for (const course of sortedCourses) {
      if (!categoryMap[course.category]) {
        categoryMap[course.category] = [];
      }

      categoryMap[course.category].push(course);
    }

    // ✅ Fetch categories with position to sort them
    const categoriesData = await Category.find({}, 'name position').sort({ position: 1 }).lean();

    // Create a map of category name to position
    const categoryPositionMap: Record<string, number> = {};
    categoriesData.forEach(cat => {
      categoryPositionMap[cat.name] = cat.position || 999;
    });

    // ✅ 5️⃣ Convert category map → array (courses already sorted by priority from query)
    const normalCategories = Object.keys(categoryMap).map(category => ({
      name: category,
      position: categoryPositionMap[category] || 999, // Include position for sorting
      courses: categoryMap[category], // Already sorted by priority from the main query
    }));

    // ✅ Sort categories by position (lower position first)
    normalCategories.sort((a, b) => a.position - b.position);

    // ✅ 6️⃣ DON'T include "Trending Courses" as separate category - CoursesHome will create "Training Courses" 
    // from trending courses found in other categories
    const groupedData = normalCategories;

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
