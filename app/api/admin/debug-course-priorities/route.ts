import { NextResponse } from 'next/server';
import { connectMongo } from '@/utils/mongodb';
import Course from '@/models/course';

// Debug endpoint to check course priorities and sorting
export async function GET() {
  try {
    await connectMongo();

    // Get all courses with their priorities
    const courses = await Course.find(
      {},
      'title category priority trending createdAt'
    ).lean();

    // Sort courses the same way as the API (lower priority numbers first)
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

    // Separate trending and normal courses
    const trendingCourses = sortedCourses.filter(course => course.trending === true);
    const normalCourses = sortedCourses.filter(course => !course.trending);

    // Group by category
    const categoryGroups: Record<string, any[]> = {};
    normalCourses.forEach(course => {
      if (!categoryGroups[course.category]) {
        categoryGroups[course.category] = [];
      }
      categoryGroups[course.category].push({
        title: course.title,
        priority: course.priority || 0,
        createdAt: course.createdAt
      });
    });

    return NextResponse.json({
      success: true,
      totalCourses: courses.length,
      trendingCount: trendingCourses.length,
      normalCount: normalCourses.length,
      coursesWithoutPriority: courses.filter(c => !c.priority || c.priority === 0).length,
      trendingCourses: trendingCourses.map(c => ({
        title: c.title,
        priority: c.priority || 0,
        createdAt: c.createdAt
      })),
      categoryGroups,
      sortingOrder: sortedCourses.slice(0, 10).map(c => ({
        title: c.title,
        category: c.category,
        priority: c.priority || 0,
        trending: c.trending,
        createdAt: c.createdAt
      }))
    });

  } catch (error: any) {
    console.error('DEBUG ERROR:', error);
    return NextResponse.json(
      { error: error.message || 'Debug failed' },
      { status: 500 }
    );
  }
}

// Fix courses without priority values
export async function POST() {
  try {
    await connectMongo();

    // Update all courses that don't have a priority field or have priority 0
    const result = await Course.updateMany(
      { $or: [{ priority: { $exists: false } }, { priority: 0 }] },
      { $set: { priority: 0 } }
    );

    // Get updated course count by priority
    const priorityStats = await Course.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: -1 }
      }
    ]);

    return NextResponse.json({
      success: true,
      message: 'Course priorities normalized',
      modifiedCount: result.modifiedCount,
      matchedCount: result.matchedCount,
      priorityDistribution: priorityStats
    });

  } catch (error: any) {
    console.error('FIX PRIORITIES ERROR:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fix priorities' },
      { status: 500 }
    );
  }
}