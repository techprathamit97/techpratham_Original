import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/utils/mongodb";
import Course from "@/models/course";
import { categoryPrice } from "@/components/assets/categoryPrice";

export async function GET(request: NextRequest) {
  try {
    await connectMongo();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const bustCache = searchParams.get("bustCache");
    const timestamp = searchParams.get("t");
    
    console.log('Course Fetch API: Cache busting requested:', !!bustCache || !!timestamp);

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
    
    console.log('Course Fetch API: Found', courseItem.length, 'courses');

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

    // Add price to each course based on category
    const coursesWithPrice = sortedCourses.map(courseItem => {
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