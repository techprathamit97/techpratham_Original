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

    console.log('=== STUDENT COURSES API DEBUG ===');
    console.log('Fetching courses for student:', studentId);

    // Get all enrolled courses for this student
    const enrolledCourses = await Enrolled.find({ studentId }).lean();
    console.log('Enrolled courses found:', enrolledCourses.length);

    // Also find batches where this student is enrolled (even if no Enrolled record exists)
    const batchesWithStudent = await Batch.find({ 
      enrolled_students: { $in: [studentId] } 
    }).lean();
    console.log('Batches with student found:', batchesWithStudent.length);

    // Create enrolled course records from batches if they don't exist in Enrolled table
    const coursesFromBatches = [];
    for (const batch of batchesWithStudent) {
      // Check if this course already exists in enrolledCourses
      const existingCourse = enrolledCourses.find(course => 
        course.course_title === batch.course_title || course.batchId === batch.batchId
      );
      
      if (!existingCourse) {
        // Create a virtual enrolled course record from batch data
        coursesFromBatches.push({
          _id: batch._id,
          course_title: batch.course_title,
          course_link: batch.course_link,
          course_desc: batch.description || `${batch.course_title} course`,
          duration: 'N/A',
          level: 'N/A',
          category: 'N/A',
          email: 'N/A',
          name: 'N/A',
          phone: 'N/A',
          studentId: studentId,
          batchId: batch.batchId,
          trainerId: batch.trainerId,
          progressPercentage: 0,
          courseCompletion: false,
          totalAmount: 0,
          verifyPayment: false,
          createdAt: batch.createdAt,
          lastAccessedAt: null,
          quizScores: []
        });
        console.log(`Created virtual course record for batch: ${batch.batchId}`);
      }
    }

    // Combine enrolled courses with courses from batches
    const allCourses = [...enrolledCourses, ...coursesFromBatches];
    console.log('Total courses (enrolled + batch):', allCourses.length);

    // Process each course to get batch and trainer information
    const coursesWithDetails = await Promise.all(
      allCourses.map(async (course) => {
        try {
          console.log(`Processing course: ${course.course_title}`);
          
          // Find batch for this course
          let batchInfo = null;
          
          // First check if this course came from a batch (virtual course)
          const sourceBatch = batchesWithStudent.find(b => 
            b.batchId === course.batchId || b.course_title === course.course_title
          );
          
          if (sourceBatch) {
            batchInfo = sourceBatch;
          } else {
            // Method 1: Find by batchId if available
            if (course.batchId) {
              batchInfo = await Batch.findOne({ batchId: course.batchId }).lean();
            }
            
            // Method 2: Find by course title and check if student is enrolled
            if (!batchInfo) {
              const batches = await Batch.find({ 
                course_title: course.course_title,
                enrolled_students: { $in: [studentId] }
              }).lean();
              batchInfo = batches[0] || null;
            }
            
            // Method 3: Find by course title (any batch) and auto-assign
            if (!batchInfo) {
              const batches = await Batch.find({ 
                course_title: course.course_title 
              }).lean();
              
              if (batches.length > 0) {
                batchInfo = batches[0];
                // Auto-assign student to this batch
                if (!batchInfo.enrolled_students.includes(studentId)) {
                  await Batch.findByIdAndUpdate(
                    batchInfo._id,
                    { $addToSet: { enrolled_students: studentId } }
                  );
                  batchInfo.enrolled_students.push(studentId);
                  console.log(`Auto-assigned student ${studentId} to batch ${batchInfo.batchId}`);
                }
              }
            }
          }

          // Get trainer details if batch exists
          let trainerDetails = null;
          if (batchInfo && (batchInfo as any).trainerId) {
            trainerDetails = await Trainer.findOne({ trainerId: (batchInfo as any).trainerId }).lean();
            console.log(`Trainer found for course ${course.course_title}:`, trainerDetails ? (trainerDetails as any).name : 'Not found');
          }

          // Get invoice information
          const invoiceInfo = await ManualInvoice.findOne({
            'customerDetails.studentId': studentId,
            'courseDetails.title': course.course_title
          }).lean();

          return {
            ...course,
            // Override course details with batch info if available
            course_title: (batchInfo as any)?.course_title || course.course_title,
            course_link: (batchInfo as any)?.course_link || course.course_link,
            course_desc: course.course_desc || (batchInfo as any)?.description || `${course.course_title} course`,
            batchInfo: batchInfo ? {
              batchId: (batchInfo as any).batchId,
              course_title: (batchInfo as any).course_title,
              trainerId: (batchInfo as any).trainerId,
              schedule: (batchInfo as any).schedule,
              capacity: (batchInfo as any).capacity,
              enrolled_students: (batchInfo as any).enrolled_students,
              status: (batchInfo as any).status,
              meetingLink: (batchInfo as any).meetingLink,
              trainer: trainerDetails ? {
                trainerId: (trainerDetails as any).trainerId,
                name: (trainerDetails as any).name,
                email: (trainerDetails as any).email,
                phone: (trainerDetails as any).phone || '',
                profile: (trainerDetails as any).profile || '',
                experience: (trainerDetails as any).experience || '',
                rating: (trainerDetails as any).rating || 4.5,
                bio: (trainerDetails as any).bio || '',
                expertise: (trainerDetails as any).expertise || [],
                linkedIn: (trainerDetails as any).linkedIn || '',
                github: (trainerDetails as any).github || '',
                portfolio: (trainerDetails as any).portfolio || ''
              } : {
                trainerId: (batchInfo as any).trainerId,
                name: 'Unknown Trainer',
                email: '',
                phone: '',
                profile: '',
                experience: '',
                rating: 4.5,
                bio: '',
                expertise: [],
                linkedIn: '',
                github: '',
                portfolio: ''
              }
            } : null,
            invoiceInfo: invoiceInfo ? {
              invoiceNumber: (invoiceInfo as any).invoiceNumber,
              totalAmount: (invoiceInfo as any).totalAmount,
              paidAmount: (invoiceInfo as any).paidAmount,
              pendingAmount: (invoiceInfo as any).pendingAmount,
              status: (invoiceInfo as any).status,
              invoiceDate: (invoiceInfo as any).invoiceDate
            } : null
          };
        } catch (error) {
          console.error(`Error processing course ${course._id}:`, error);
          return {
            ...course,
            batchInfo: null,
            invoiceInfo: null
          };
        }
      })
    );

    // Calculate statistics
    const totalCourses = coursesWithDetails.length;
    const completedCourses = coursesWithDetails.filter(c => (c as any).courseCompletion).length;
    const inProgressCourses = totalCourses - completedCourses;
    const avgProgress = totalCourses > 0 
      ? Math.round(coursesWithDetails.reduce((sum, c) => sum + ((c as any).progressPercentage || 0), 0) / totalCourses)
      : 0;

    console.log('Returning courses with details:', coursesWithDetails.length);

    return NextResponse.json({
      success: true,
      data: {
        enrolledCourses: coursesWithDetails,
        stats: {
          totalCourses,
          completedCourses,
          inProgressCourses,
          avgProgress
        }
      }
    });
  } catch (error: any) {
    console.error('Student courses API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}