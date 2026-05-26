import { NextResponse } from 'next/server';
import { connectMongo } from '@/utils/mongodb';
import Course from '@/models/course';
import Enrolled from '@/models/enrolled';
import { clearNavbarCache } from '@/utils/navbarData';
import { clearFetchGroupedCache } from '@/app/api/course/fetch-grouped/route';

// Handle course updates by link
export async function PUT(req: Request) {
  try {
    await connectMongo();

    const { searchParams } = new URL(req.url);
    const courseLink = searchParams.get('link');

    if (!courseLink) {
      return NextResponse.json(
        { error: 'Course link is required' },
        { status: 400 }
      );
    }

    const updateData = await req.json();

    // Find and update the course by link
    const updatedCourse = await Course.findOneAndUpdate(
      { link: courseLink },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedCourse) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    // Clear navbar cache since course has been modified
    clearNavbarCache();
    
    // Clear fetch-grouped cache since course has been modified
    clearFetchGroupedCache();

    return NextResponse.json({
      success: true,
      message: 'Course updated successfully',
      course: updatedCourse
    });

  } catch (error: any) {
    console.error('UPDATE COURSE ERROR:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update course' },
      { status: 500 }
    );
  }
}

// Handle enrollment updates (keep existing functionality)
export async function PATCH(req: Request) {
  try {
    await connectMongo();

    const body = await req.json();
    const { enrollmentId, ...updateData } = body;

    if (!enrollmentId) {
      return NextResponse.json(
        { error: 'Enrollment ID is required' },
        { status: 400 }
      );
    }

    // Find and update the enrollment
    const updatedEnrollment = await Enrolled.findByIdAndUpdate(
      enrollmentId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedEnrollment) {
      return NextResponse.json(
        { error: 'Enrollment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Enrollment updated successfully',
      enrollment: updatedEnrollment
    });

  } catch (error: any) {
    console.error('UPDATE ENROLLMENT ERROR:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update enrollment' },
      { status: 500 }
    );
  }
}