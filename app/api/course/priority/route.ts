import { NextResponse } from 'next/server';
import { connectMongo } from '@/utils/mongodb';
import Course from '@/models/course';
import { clearNavbarCache } from '@/utils/navbarData';
import { clearFetchGroupedCache } from '@/app/api/course/fetch-grouped/route';

// Update course priority
export async function PUT(req: Request) {
  try {
    await connectMongo();

    const { courseId, priority } = await req.json();

    if (!courseId || priority === undefined) {
      return NextResponse.json(
        { error: 'Course ID and priority are required' },
        { status: 400 }
      );
    }

    // Validate priority is a number
    if (typeof priority !== 'number') {
      return NextResponse.json(
        { error: 'Priority must be a number' },
        { status: 400 }
      );
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      { priority },
      { new: true, runValidators: true }
    );

    if (!updatedCourse) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    // Clear navbar cache since course priority affects ordering
    clearNavbarCache();
    
    // Clear fetch-grouped cache since course priority affects ordering
    clearFetchGroupedCache();

    return NextResponse.json({
      success: true,
      message: 'Course priority updated successfully',
      course: {
        _id: updatedCourse._id,
        title: updatedCourse.title,
        priority: updatedCourse.priority
      }
    });

  } catch (error: any) {
    console.error('UPDATE PRIORITY ERROR:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update course priority' },
      { status: 500 }
    );
  }
}

// Batch update multiple course priorities
export async function PATCH(req: Request) {
  try {
    await connectMongo();

    const { updates } = await req.json();

    if (!Array.isArray(updates)) {
      return NextResponse.json(
        { error: 'Updates must be an array of {courseId, priority} objects' },
        { status: 400 }
      );
    }

    const bulkOps = updates.map(({ courseId, priority }) => ({
      updateOne: {
        filter: { _id: courseId },
        update: { priority: priority || 0 }
      }
    }));

    const result = await Course.bulkWrite(bulkOps);

    // Clear navbar cache since course priorities affect ordering
    clearNavbarCache();
    
    // Clear fetch-grouped cache since course priorities affect ordering
    clearFetchGroupedCache();

    return NextResponse.json({
      success: true,
      message: 'Course priorities updated successfully',
      modifiedCount: result.modifiedCount
    });

  } catch (error: any) {
    console.error('BATCH UPDATE PRIORITY ERROR:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update course priorities' },
      { status: 500 }
    );
  }
}