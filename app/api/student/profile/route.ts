import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/utils/mongodb';
import Enrolled from '@/models/enrolled';
import Batch from '@/models/Batch';
import Trainer from '@/models/Trainer';
import ManualInvoice from '@/models/ManualInvoice';

export async function GET(req: NextRequest) {
  try {
    await connectMongo();
    
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get('studentId');

    if (!studentId) {
      return NextResponse.json(
        { error: 'Student ID is required' },
        { status: 400 }
      );
    }

    console.log('=== STUDENT PROFILE API DEBUG ===');
    console.log('Fetching profile for student:', studentId);

    // Get student basic info from enrolled table
    const studentRecord = await Enrolled.findOne({ studentId }).lean();
    console.log('Student record found:', studentRecord ? (studentRecord as any).name : 'Not found');

    // Get all enrolled courses for this student
    const enrolledCourses = await Enrolled.find({ studentId }).lean();
    console.log('Enrolled courses found:', enrolledCourses.length);

    // Get all batches where this student is enrolled
    const batchesWithStudent = await Batch.find({ 
      enrolled_students: { $in: [studentId] } 
    }).lean();
    console.log('Batches with student found:', batchesWithStudent.length);

    // Get all invoices for this student
    const invoices = await ManualInvoice.find({
      'customerDetails.studentId': studentId
    }).lean();
    console.log('Invoices found:', invoices.length);

    // Process courses with trainer and batch information
    const coursesWithDetails = [];
    const trainersMap = new Map();
    const batchesMap = new Map();

    // Process enrolled courses
    for (const course of enrolledCourses) {
      try {
        // Find batch for this course
        let batchInfo = batchesWithStudent.find(b => 
          (b as any).batchId === (course as any).batchId || (b as any).course_title === (course as any).course_title
        );

        // Get trainer details if batch exists
        let trainerDetails = null;
        if (batchInfo && (batchInfo as any).trainerId) {
          trainerDetails = await Trainer.findOne({ trainerId: (batchInfo as any).trainerId }).lean();
        }

        // Get invoice for this course
        const courseInvoice = invoices.find(inv => 
          (inv as any).courseDetails.title === (course as any).course_title
        );

        const courseData = {
          title: (course as any).course_title,
          category: (course as any).category || 'N/A',
          level: (course as any).level || 'N/A',
          duration: (course as any).duration || 'N/A',
          progress: (course as any).progressPercentage || 0,
          completed: (course as any).courseCompletion || false,
          batchId: (batchInfo as any)?.batchId || (course as any).batchId || 'N/A',
          trainer: (trainerDetails as any)?.name || 'Not Assigned',
          trainerEmail: (trainerDetails as any)?.email || '',
          trainerPhone: (trainerDetails as any)?.phone || '',
          trainerExperience: (trainerDetails as any)?.experience || '',
          trainerRating: (trainerDetails as any)?.rating || 0,
          enrolledDate: (course as any).createdAt,
          hasTrainer: !!trainerDetails,
          schedule: batchInfo ? {
            timing: (batchInfo as any).schedule.timing,
            days: (batchInfo as any).schedule.days,
            startDate: (batchInfo as any).schedule.startDate,
            endDate: (batchInfo as any).schedule.endDate
          } : null,
          meetingLink: (batchInfo as any)?.meetingLink || null,
          invoiceNumber: (courseInvoice as any)?.invoiceNumber || 'N/A',
          totalAmount: (courseInvoice as any)?.totalAmount || (course as any).totalAmount || 0,
          paidAmount: (courseInvoice as any)?.paidAmount || 0,
          pendingAmount: (courseInvoice as any)?.pendingAmount || 0,
          paymentStatus: (courseInvoice as any)?.status || 'unknown'
        };

        coursesWithDetails.push(courseData);

        // Add trainer to trainers map
        if (trainerDetails) {
          trainersMap.set((trainerDetails as any).trainerId, {
            name: (trainerDetails as any).name,
            email: (trainerDetails as any).email,
            phone: (trainerDetails as any).phone || '',
            profile: (trainerDetails as any).profile || '',
            experience: (trainerDetails as any).experience || '',
            rating: (trainerDetails as any).rating || 0,
            course: (course as any).course_title,
            batchId: (batchInfo as any)?.batchId || 'N/A',
            courseCategory: (course as any).category || 'N/A',
            courseLevel: (course as any).level || 'N/A',
            courseDuration: (course as any).duration || 'N/A'
          });
        }

        // Add batch to batches map
        if (batchInfo) {
          batchesMap.set((batchInfo as any).batchId, {
            batchId: (batchInfo as any).batchId,
            courseTitle: (batchInfo as any).course_title,
            status: (batchInfo as any).status,
            schedule: (batchInfo as any).schedule,
            capacity: (batchInfo as any).capacity,
            enrolledStudents: (batchInfo as any).enrolled_students.length,
            meetingLink: (batchInfo as any).meetingLink
          });
        }
      } catch (error) {
        console.error(`Error processing course ${(course as any)._id}:`, error);
      }
    }

    // Process batches that don't have enrolled course records
    for (const batch of batchesWithStudent) {
      try {
        // Check if this batch is already processed
        if (!batchesMap.has((batch as any).batchId)) {
          // Get trainer details
          let trainerDetails = null;
          if ((batch as any).trainerId) {
            trainerDetails = await Trainer.findOne({ trainerId: (batch as any).trainerId }).lean();
          }

          // Get invoice for this course
          const courseInvoice = invoices.find(inv => 
            (inv as any).courseDetails.title === (batch as any).course_title
          );

          // Create virtual course record
          const courseData = {
            title: (batch as any).course_title,
            category: (courseInvoice as any)?.courseDetails?.category || 'N/A',
            level: (courseInvoice as any)?.courseDetails?.level || 'N/A',
            duration: (courseInvoice as any)?.courseDetails?.duration || 'N/A',
            progress: 0,
            completed: false,
            batchId: (batch as any).batchId,
            trainer: (trainerDetails as any)?.name || 'Not Assigned',
            trainerEmail: (trainerDetails as any)?.email || '',
            trainerPhone: (trainerDetails as any)?.phone || '',
            trainerExperience: (trainerDetails as any)?.experience || '',
            trainerRating: (trainerDetails as any)?.rating || 0,
            enrolledDate: (batch as any).createdAt,
            hasTrainer: !!trainerDetails,
            schedule: {
              timing: (batch as any).schedule.timing,
              days: (batch as any).schedule.days,
              startDate: (batch as any).schedule.startDate,
              endDate: (batch as any).schedule.endDate
            },
            meetingLink: (batch as any).meetingLink || null,
            invoiceNumber: (courseInvoice as any)?.invoiceNumber || 'N/A',
            totalAmount: (courseInvoice as any)?.totalAmount || 0,
            paidAmount: (courseInvoice as any)?.paidAmount || 0,
            pendingAmount: (courseInvoice as any)?.pendingAmount || 0,
            paymentStatus: (courseInvoice as any)?.status || 'unknown'
          };

          coursesWithDetails.push(courseData);

          // Add trainer to trainers map
          if (trainerDetails) {
            trainersMap.set((trainerDetails as any).trainerId, {
              name: (trainerDetails as any).name,
              email: (trainerDetails as any).email,
              phone: (trainerDetails as any).phone || '',
              profile: (trainerDetails as any).profile || '',
              experience: (trainerDetails as any).experience || '',
              rating: (trainerDetails as any).rating || 0,
              course: (batch as any).course_title,
              batchId: (batch as any).batchId,
              courseCategory: (courseInvoice as any)?.courseDetails?.category || 'N/A',
              courseLevel: (courseInvoice as any)?.courseDetails?.level || 'N/A',
              courseDuration: (courseInvoice as any)?.courseDetails?.duration || 'N/A'
            });
          }

          // Add batch to batches map
          batchesMap.set((batch as any).batchId, {
            batchId: (batch as any).batchId,
            courseTitle: (batch as any).course_title,
            status: (batch as any).status,
            schedule: (batch as any).schedule,
            capacity: (batch as any).capacity,
            enrolledStudents: (batch as any).enrolled_students.length,
            meetingLink: (batch as any).meetingLink
          });
        }
      } catch (error) {
        console.error(`Error processing batch ${(batch as any)._id}:`, error);
      }
    }

    // Calculate statistics
    const totalCourses = coursesWithDetails.length;
    const completedCourses = coursesWithDetails.filter(c => c.completed).length;
    const inProgressCourses = totalCourses - completedCourses;
    const avgProgress = totalCourses > 0 
      ? Math.round(coursesWithDetails.reduce((sum, c) => sum + c.progress, 0) / totalCourses)
      : 0;

    // Payment statistics
    const totalPaid = coursesWithDetails.reduce((sum, c) => sum + c.paidAmount, 0);
    const totalAmount = coursesWithDetails.reduce((sum, c) => sum + c.totalAmount, 0);
    const pendingAmount = coursesWithDetails.reduce((sum, c) => sum + c.pendingAmount, 0);

    // Prepare response data
    const profileData = {
      studentInfo: {
        studentId: studentId,
        name: (studentRecord as any)?.name || 'Unknown Student',
        email: (studentRecord as any)?.email || '',
        phone: (studentRecord as any)?.phone || '',
        joinedDate: (studentRecord as any)?.createdAt || new Date().toISOString()
      },
      stats: {
        totalCourses,
        completedCourses,
        inProgressCourses,
        avgProgress,
        totalPaid,
        totalAmount,
        pendingAmount
      },
      courses: coursesWithDetails,
      trainers: Array.from(trainersMap.values()),
      batches: Array.from(batchesMap.values()),
      debug: {
        enrolledCoursesCount: enrolledCourses.length,
        batchesCount: batchesWithStudent.length,
        invoicesCount: invoices.length,
        trainersCount: trainersMap.size,
        batchesMapCount: batchesMap.size
      }
    };

    console.log('Returning profile data with:', {
      courses: profileData.courses.length,
      trainers: profileData.trainers.length,
      batches: profileData.batches.length
    });

    return NextResponse.json({
      success: true,
      data: profileData
    });
  } catch (error: any) {
    console.error('Student profile API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}