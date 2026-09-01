import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/utils/mongodb";
import Course from "@/models/course";
import { categoryPrice } from "@/components/assets/categoryPrice";


const MAX_LIMIT = 1000;

export async function GET(request: NextRequest) {
  try {
    await connectMongo();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const bustCache = searchParams.get("bustCache");
    const timestamp = searchParams.get("t");

    // Optional ?limit=N, clamped to MAX_LIMIT. Invalid or absent means the cap.
    const requestedLimit = parseInt(searchParams.get("limit") || "", 10);
    const limit =
      Number.isFinite(requestedLimit) && requestedLimit > 0
        ? Math.min(requestedLimit, MAX_LIMIT)
        : MAX_LIMIT;
    
  

    const projection = {
      _id: 1,
      title: 1,
      category: 1,
      link: 1,
      shortDesc: 1,
      image: 1,
      alt: 1,
      level: 1,
      rating: 1,
      duration: 1,
      priority: 1, // Include priority field
    };

    let query: any = {};

    if (category) {
      query.category = {
        $regex: `^${category}`,
        $options: "i",
      };
    }

    const courseItem = await Course.find(query, projection).lean();
    


    // Sort courses by priority (handle null/undefined priority values)
    // LOWER priority numbers appear FIRST (1, 2, 3, 4, 5, etc.)
    const sortedCourses = courseItem.sort((a, b) => {
      const priorityA = a.priority || 999; // Default high number for courses without priority
      const priorityB = b.priority || 999;
      
      // Sort by priority ASCENDING (lower numbers first: 1, 2, 3, 4, 5...)
      if (priorityA !== priorityB) {
        return priorityA - priorityB; // Lower priority number appears first
      }
      
      // If priorities are equal, sort by creation date (newer first)
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });

    // Apply the cap after sorting so the highest-priority courses are the ones
    // kept, and the ordering callers rely on is unchanged.
    const limitedCourses = sortedCourses.slice(0, limit);

    // Add price to each course based on category
    const coursesWithPrice = limitedCourses.map(courseItem => {
      const priceData = categoryPrice.find(p => 
        p.Category.toLowerCase() === courseItem.category.toLowerCase()
      );
      
      return {
        ...courseItem,
        price: priceData?.price || 40000 // Default price if category not found
      };
    });

    return NextResponse.json(coursesWithPrice, { 
      status: 200,
      headers: bustCache || timestamp ? {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      } : {}
    });
  } catch (error: any) {
    console.error("Server Error:", error.message);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}