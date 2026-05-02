import { NextResponse } from 'next/server';
import { connectMongo } from '@/utils/mongodb';
import Course from '@/models/course';

// Test endpoint to demonstrate priority ordering
export async function GET() {
  try {
    await connectMongo();

    // Get all courses sorted by priority
    const courses = await Course.find(
      {},
      'title category priority trending createdAt'
    ).sort({ priority: -1, createdAt: -1 }).limit(20);

    return NextResponse.json({
      success: true,
      message: 'Courses ordered by priority (highest first)',
      courses: courses.map(course => ({
        title: course.title,
        category: course.category,
        priority: course.priority || 0,
        trending: course.trending,
        createdAt: course.createdAt
      }))
    });

  } catch (error: any) {
    console.error('TEST ERROR:', error);
    return NextResponse.json(
      { error: error.message || 'Test failed' },
      { status: 500 }
    );
  }
}

// Set sample priorities for testing
export async function POST() {
  try {
    await connectMongo();

    // Get first few courses to set sample priorities
    const courses = await Course.find({}).limit(5);

    if (courses.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No courses found to set priorities'
      });
    }

    // Set different priorities for testing
    const updates = courses.map((course, index) => ({
      updateOne: {
        filter: { _id: course._id },
        update: { priority: (5 - index) * 10 } // 50, 40, 30, 20, 10
      }
    }));

    const result = await Course.bulkWrite(updates);

    return NextResponse.json({
      success: true,
      message: 'Sample priorities set for testing',
      modifiedCount: result.modifiedCount,
      samplePriorities: courses.map((course, index) => ({
        title: course.title,
        newPriority: (5 - index) * 10
      }))
    });

  } catch (error: any) {
    console.error('TEST SETUP ERROR:', error);
    return NextResponse.json(
      { error: error.message || 'Test setup failed' },
      { status: 500 }
    );
  }
}