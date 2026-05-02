import { NextResponse } from 'next/server';
import { connectMongo } from '@/utils/mongodb';
import Course from '@/models/course';

// Migration endpoint to set default priority for existing courses


export async function POST(req: Request) {
  try {
    await connectMongo();

    // Update all courses that don't have a priority field set
    const result = await Course.updateMany(
      { priority: { $exists: false } }, // Only update courses without priority field
      { $set: { priority: 0 } } // Set default priority to 0
    );

    return NextResponse.json({
      success: true,
      message: 'Course priority migration completed',
      modifiedCount: result.modifiedCount,
      matchedCount: result.matchedCount
    });

  } catch (error: any) {
    console.error('MIGRATION ERROR:', error);
    return NextResponse.json(
      { error: error.message || 'Migration failed' },
      { status: 500 }
    );
  }
}

// Get migration status


export async function GET() {
  try {
    await connectMongo();

    const totalCourses = await Course.countDocuments();
    const coursesWithPriority = await Course.countDocuments({ priority: { $exists: true } });
    const coursesWithoutPriority = totalCourses - coursesWithPriority;

    return NextResponse.json({
      totalCourses,
      coursesWithPriority,
      coursesWithoutPriority,
      migrationNeeded: coursesWithoutPriority > 0
    });

  } catch (error: any) {
    console.error('MIGRATION STATUS ERROR:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get migration status' },
      { status: 500 }
    );
  }
}