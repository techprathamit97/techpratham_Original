import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/utils/mongodb';
import Batch from '@/models/Batch';
import Trainer from '@/models/Trainer';
import ManualInvoice from '@/models/ManualInvoice';
import Enrolled from '@/models/enrolled';

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

    console.log('=== BATCHES WITH TRAINERS API DEBUG ===');
    console.log('Fetching batches for student:', studentId);

    // Find all batches where this student is enrolled
    const batches = await Batch.find({ 
      enrolled_students: { $in: [studentId] } 
    }).lean();

    console.log('Batches found:', batches.length);

    // Get student info from enrolled table
    const studentInfo = await Enrolled.findOne({ studentId }).lean();
    console.log('Student info found:', studentInfo ? (studentInfo as any).name : 'Not found');

    // Process each batch to get trainer and course details
    const batchesWithDetails = await Promise.all(
      batches.map(async (batch) => {
        try {
          console.log(`Processing batch ${batch.batchId} with trainer ${batch.trainerId}`);
          
          // Get trainer details
          const trainer = await Trainer.findOne({ trainerId: batch.trainerId }).lean();
          console.log(`Trainer found:`, trainer ? (trainer as any).name : 'Not found');
          
          // Get course details from ManualInvoice for this student
          const courseInvoice = await ManualInvoice.findOne({ 
            'customerDetails.studentId': studentId,
            'courseDetails.title': batch.course_title
          }).lean();
          
          console.log(`Course invoice found:`, courseInvoice ? 'Yes' : 'No');

          // Get student progress from enrolled table
          const studentProgress = await Enrolled.findOne({
            studentId: studentId,
            course_title: batch.course_title
          }).lean();

          return {
            batchId: batch.batchId,
            courseTitle: batch.course_title,
            courseLink: batch.course_link,
            status: batch.status,
            capacity: batch.capacity,
            enrolledStudentsCount: batch.enrolled_students.length,
            meetingLink: batch.meetingLink,
            description: batch.description,
            schedule: {
              startDate: batch.schedule.startDate,
              endDate: batch.schedule.endDate,
              timing: batch.schedule.timing,
              days: batch.schedule.days,
              duration: batch.schedule.duration || 'N/A'
            },
            trainer: trainer ? {
              name: (trainer as any).name,
              email: (trainer as any).email,
              phone: (trainer as any).phone || '',
              profile: (trainer as any).profile || '',
              experience: (trainer as any).experience || '',
              rating: (trainer as any).rating || 4.5,
              courseExpertise: (trainer as any).expertise ? (trainer as any).expertise.join(', ') : '',
              batchesHandled: (trainer as any).assignedBatches ? (trainer as any).assignedBatches.length : 0,
              totalStudentsHandled: (trainer as any).totalStudents || 0,
              coursesHandled: (trainer as any).expertise || []
            } : {
              name: 'Unknown Trainer',
              email: '',
              phone: '',
              profile: '',
              experience: '',
              rating: 4.5,
              courseExpertise: '',
              batchesHandled: 0,
              totalStudentsHandled: 0,
              coursesHandled: []
            },
            courseDetails: {
              category: (courseInvoice as any)?.courseDetails?.category || (studentProgress as any)?.category || 'N/A',
              level: (courseInvoice as any)?.courseDetails?.level || (studentProgress as any)?.level || 'N/A',
              duration: (courseInvoice as any)?.courseDetails?.duration || (studentProgress as any)?.duration || 'N/A',
              link: batch.course_link
            },
            studentProgress: {
              progressPercentage: (studentProgress as any)?.progressPercentage || 0,
              courseCompletion: (studentProgress as any)?.courseCompletion || false,
              lastAccessedAt: (studentProgress as any)?.lastAccessedAt || null,
              quizScores: (studentProgress as any)?.quizScores || []
            },
            paymentInfo: courseInvoice ? {
              invoiceNumber: (courseInvoice as any).invoiceNumber,
              totalAmount: (courseInvoice as any).totalAmount,
              paidAmount: (courseInvoice as any).paidAmount,
              pendingAmount: (courseInvoice as any).pendingAmount,
              paymentStatus: (courseInvoice as any).status,
              invoiceDate: (courseInvoice as any).invoiceDate
            } : null,
            enrollmentStatus: {
              isDirectlyEnrolled: batch.enrolled_students.includes(studentId),
              hasInvoice: !!courseInvoice,
              hasEnrolledRecord: !!studentProgress,
              enrollmentMethod: courseInvoice ? 'Invoice' : studentProgress ? 'Direct' : 'Auto-assigned'
            }
          };
        } catch (error) {
          console.error(`Error processing batch ${batch._id}:`, error);
          return {
            batchId: batch.batchId,
            courseTitle: batch.course_title,
            courseLink: batch.course_link,
            status: batch.status,
            capacity: batch.capacity,
            enrolledStudentsCount: batch.enrolled_students.length,
            meetingLink: batch.meetingLink,
            description: batch.description,
            schedule: {
              startDate: batch.schedule.startDate,
              endDate: batch.schedule.endDate,
              timing: batch.schedule.timing,
              days: batch.schedule.days,
              duration: 'N/A'
            },
            trainer: {
              name: 'Error Loading Trainer',
              email: '',
              phone: '',
              profile: '',
              experience: '',
              rating: 4.5,
              courseExpertise: '',
              batchesHandled: 0,
              totalStudentsHandled: 0,
              coursesHandled: []
            },
            courseDetails: {
              category: 'N/A',
              level: 'N/A',
              duration: 'N/A',
              link: batch.course_link
            },
            studentProgress: {
              progressPercentage: 0,
              courseCompletion: false,
              lastAccessedAt: null,
              quizScores: []
            },
            paymentInfo: null,
            enrollmentStatus: {
              isDirectlyEnrolled: batch.enrolled_students.includes(studentId),
              hasInvoice: false,
              hasEnrolledRecord: false,
              enrollmentMethod: 'Error'
            }
          };
        }
      })
    );

    // Get unique trainers for the trainers tab
    const uniqueTrainers = new Map();
    const courseNames = new Set();

    batchesWithDetails.forEach(batch => {
      courseNames.add(batch.courseTitle);
      
      if (batch.trainer.name !== 'Unknown Trainer' && batch.trainer.name !== 'Error Loading Trainer') {
        const trainerKey = batch.trainer.email;
        if (!uniqueTrainers.has(trainerKey)) {
          uniqueTrainers.set(trainerKey, {
            name: batch.trainer.name,
            email: batch.trainer.email,
            phone: batch.trainer.phone,
            totalBatches: 1,
            totalStudents: batch.trainer.totalStudentsHandled,
            courses: [batch.courseTitle],
            avgRating: batch.trainer.rating
          });
        } else {
          const existing = uniqueTrainers.get(trainerKey);
          existing.totalBatches += 1;
          if (!existing.courses.includes(batch.courseTitle)) {
            existing.courses.push(batch.courseTitle);
          }
        }
      }
    });

    const trainersArray = Array.from(uniqueTrainers.values());

    console.log('Returning batches with details:', batchesWithDetails.length);

    return NextResponse.json({
      success: true,
      data: {
        studentInfo: {
          studentId: studentId,
          name: (studentInfo as any)?.name || 'Unknown Student',
          email: (studentInfo as any)?.email || '',
          phone: (studentInfo as any)?.phone || ''
        },
        summary: {
          totalBatches: batchesWithDetails.length,
          totalTrainers: trainersArray.length,
          totalCourses: courseNames.size
        },
        batches: batchesWithDetails,
        trainers: trainersArray,
        courseNames: Array.from(courseNames)
      }
    });
  } catch (error: any) {
    console.error('Batches with trainers API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}