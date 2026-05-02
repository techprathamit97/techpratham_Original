import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/utils/mongodb';
import Batch from '@/models/Batch';
import StudentAuth from '@/models/StudentAuth';

export async function GET(req: NextRequest) {
  try {
    await connectMongo();
    
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');
    const studentId = searchParams.get('studentId');
    const trainerName = searchParams.get('trainer');
    const courseTitle = searchParams.get('course');
    const status = searchParams.get('status');

    let searchCriteria: any = {};
    let studentAuth: any = null;

    // Build search criteria
    if (query) {
      searchCriteria.$or = [
        { course_title: { $regex: query, $options: 'i' } },
        { batchId: { $regex: query, $options: 'i' } },
        { 'trainer.name': { $regex: query, $options: 'i' } },
        { 'trainer.email': { $regex: query, $options: 'i' } }
      ];
    }

    if (studentId) {
      // Get student auth info for multiple ID formats
      studentAuth = await StudentAuth.findOne({ studentId });
      const studentIds = [studentId];
      if (studentAuth) {
        studentIds.push(studentAuth.studentId, studentAuth.email);
      }
      
      searchCriteria.enrolled_students = { $in: studentIds };
    }

    if (trainerName) {
      searchCriteria['trainer.name'] = { $regex: trainerName, $options: 'i' };
    }

    if (courseTitle) {
      searchCriteria.course_title = { $regex: courseTitle, $options: 'i' };
    }

    if (status) {
      searchCriteria.status = status;
    }

    console.log('Search criteria:', searchCriteria);

    // Execute search
    const batches = await Batch.find(searchCriteria)
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    // Format results with complete information
    const formattedBatches = batches.map(batch => ({
      batchId: batch.batchId,
      courseTitle: batch.course_title,
      courseLink: batch.course_link,
      status: batch.status,
      capacity: batch.capacity,
      enrolledStudentsCount: batch.enrolled_students.length,
      enrolledStudents: batch.enrolled_students,
      meetingLink: batch.meetingLink,
      description: batch.description,
      
      // Schedule information
      schedule: {
        startDate: batch.schedule.startDate,
        endDate: batch.schedule.endDate,
        timing: batch.schedule.timing,
        days: batch.schedule.days
      },
      
      // Complete trainer information
      trainer: {
        name: batch.trainer.name,
        email: batch.trainer.email,
        phone: batch.trainer.phone || 'N/A',
        profile: batch.trainer.profile || '',
        experience: batch.trainer.experience || 'N/A',
        rating: batch.trainer.rating || 4.5
      },
      
      // Metadata
      createdAt: batch.createdAt,
      updatedAt: batch.updatedAt,
      
      // Check if specific student is enrolled (if studentId provided)
      isStudentEnrolled: studentId ? batch.enrolled_students.some((id: string) => 
        [studentId, studentAuth?.studentId, studentAuth?.email].includes(id)
      ) : false
    }));

    // Get summary statistics
    const totalBatches = await Batch.countDocuments(searchCriteria);
    const statusCounts = await Batch.aggregate([
      { $match: searchCriteria },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const trainerCounts = await Batch.aggregate([
      { $match: searchCriteria },
      { $group: { _id: '$trainer.name', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    return NextResponse.json({
      success: true,
      data: {
        batches: formattedBatches,
        summary: {
          totalFound: formattedBatches.length,
          totalBatches,
          searchQuery: query,
          filters: {
            studentId,
            trainerName,
            courseTitle,
            status
          }
        },
        statistics: {
          byStatus: statusCounts,
          byTrainer: trainerCounts
        }
      }
    });
  } catch (error: any) {
    console.error('Search batches error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}