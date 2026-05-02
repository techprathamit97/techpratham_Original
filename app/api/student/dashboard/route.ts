import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/utils/mongodb';
import Enrolled from '@/models/enrolled';
import Batch from '@/models/Batch';
import TrainerAuth from '@/models/TrainerAuth';
import Trainer from '@/models/Trainer';
import ManualInvoice from '@/models/ManualInvoice';
import Certificate from '@/models/Certificate';
import QuizAttempt from '@/models/QuizAttempt';
import QuizModule from '@/models/QuizModule';

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

    console.log('=== STUDENT DASHBOARD DEBUG ===');
    console.log('Fetching dashboard data for student:', studentId);

    // Fetch enrolled courses
    const enrolledCourses = await Enrolled.find({ studentId }).lean();
    console.log('Enrolled courses found:', enrolledCourses.length);
    console.log('Enrolled courses data:', JSON.stringify(enrolledCourses, null, 2));
    
    // Get student email from first enrolled course
    const studentEmail = (enrolledCourses[0] as any)?.email || '';
    console.log('Student email:', studentEmail);

    // Method 1: Find batches where this student is directly enrolled
    let batchesWithStudent = await Batch.find({ 
      enrolled_students: { $in: [studentId] } 
    }).lean();

    console.log('Batches found by direct enrollment:', batchesWithStudent.length);

    // Method 2: If no batches found, try to find batches by course title and assign student
    if (batchesWithStudent.length === 0 && enrolledCourses.length > 0) {
      console.log('No direct batch enrollment found, looking for batches by course title...');
      
      // Get unique course titles from enrolled courses
      const courseTitles = [...new Set(enrolledCourses.map(course => (course as any).course_title))];
      console.log('Looking for batches with course titles:', courseTitles);
      
      // Find batches that match the course titles
      const matchingBatches = await Batch.find({
        course_title: { $in: courseTitles }
      }).lean();

      console.log('Matching batches found:', matchingBatches.length);

      // Auto-assign student to matching batches if not already assigned
      for (const batch of matchingBatches) {
        if (!(batch as any).enrolled_students.includes(studentId)) {
          console.log(`Auto-assigning student ${studentId} to batch ${(batch as any).batchId}`);
          
          // Update the batch to include this student
          await Batch.findByIdAndUpdate(
            (batch as any)._id,
            { $addToSet: { enrolled_students: studentId } }
          );
          
          // Add to our local array for processing
          (batch as any).enrolled_students.push(studentId);
        }
      }

      batchesWithStudent = matchingBatches;
    }

    // Method 3: Also try to find by student email if still no batches
    if (batchesWithStudent.length === 0 && studentEmail) {
      console.log('Trying to find batches by student email:', studentEmail);
      const batchesByEmail = await Batch.find({ 
        enrolled_students: { $in: [studentEmail] } 
      }).lean();
      batchesWithStudent = [...batchesWithStudent, ...batchesByEmail];
    }

    console.log('Final batches with student:', batchesWithStudent.length);

    // Get all trainers for debugging
    const allTrainers = await TrainerAuth.find({}).lean();
    console.log('All trainers in TrainerAuth database:', allTrainers.length);
    console.log('TrainerAuth data:', JSON.stringify(allTrainers, null, 2));

    // Fetch trainer details for each batch
    const batchesWithTrainers = await Promise.all(
      batchesWithStudent.map(async (batch) => {
        try {
          console.log(`Looking for trainer with trainerId: ${(batch as any).trainerId}`);
          
          // First try TrainerAuth table
          const trainerAuth = await TrainerAuth.findOne({ trainerId: (batch as any).trainerId }).lean();
          console.log(`TrainerAuth found for batch ${(batch as any).batchId}:`, trainerAuth ? (trainerAuth as any).name : 'Not found');
          
          // Try to get additional profile info from Trainer table
          let trainerProfile = null;
          if (trainerAuth) {
            trainerProfile = await Trainer.findOne({ 
              $or: [
                { trainerId: (batch as any).trainerId },
                { email: (trainerAuth as any).email }
              ]
            }).lean();
          }
          
          const trainer = trainerAuth ? {
            trainerId: (trainerAuth as any).trainerId,
            name: (trainerAuth as any).name,
            email: (trainerAuth as any).email,
            phone: (trainerAuth as any).phone || '',
            profile: (trainerProfile as any)?.profile || '',
            experience: (trainerProfile as any)?.experience || 'N/A',
            rating: (trainerProfile as any)?.rating || 4.5,
            bio: (trainerProfile as any)?.bio || '',
            expertise: (trainerProfile as any)?.expertise || [],
            linkedIn: (trainerProfile as any)?.linkedIn || '',
            github: (trainerProfile as any)?.github || '',
            portfolio: (trainerProfile as any)?.portfolio || '',
            isActive: (trainerAuth as any).isActive,
            lastLogin: (trainerAuth as any).lastLogin
          } : {
            trainerId: (batch as any).trainerId,
            name: 'Unknown Trainer',
            email: '',
            phone: '',
            profile: '',
            experience: 'N/A',
            rating: 4.5,
            bio: '',
            expertise: [],
            linkedIn: '',
            github: '',
            portfolio: '',
            isActive: false,
            lastLogin: null
          };
          
          return {
            ...batch,
            trainer
          };
        } catch (error) {
          console.error(`Error fetching trainer for batch ${(batch as any)._id}:`, error);
          return {
            ...batch,
            trainer: {
              trainerId: (batch as any).trainerId,
              name: 'Unknown Trainer',
              email: '',
              phone: '',
              profile: '',
              experience: 'N/A',
              rating: 4.5,
              bio: '',
              expertise: [],
              linkedIn: '',
              github: '',
              portfolio: '',
              isActive: false,
              lastLogin: null
            }
          };
        }
      })
    );

    // Fetch invoices
    const invoices = await ManualInvoice.find({ 
      'customerDetails.studentId': studentId 
    }).sort({ invoiceDate: -1 }).lean();

    // Fetch certificates
    const certificates = await Certificate.find({ 
      studentEmail: studentEmail 
    }).sort({ issueDate: -1 }).lean();

    // Fetch quiz attempts
    const quizAttempts = await QuizAttempt.find({ 
      userId: studentId 
    }).sort({ completedAt: -1 }).lean();

    // Get unique quiz IDs and fetch quiz details
    const quizIds = [...new Set(quizAttempts.map(attempt => (attempt as any).quizId))];
    const quizzes = await QuizModule.find({ 
      _id: { $in: quizIds } 
    }).lean();

    // Create quiz map for easy lookup
    const quizMap = new Map(quizzes.map(q => [String((q as any)._id), q]));

    // Enhance quiz attempts with quiz details
    const enhancedQuizAttempts = quizAttempts.map(attempt => ({
      ...attempt,
      quizTitle: quizMap.get((attempt as any).quizId.toString())?.title || 'Unknown Quiz',
      quizCategory: quizMap.get((attempt as any).quizId.toString())?.category || 'N/A',
      passed: (attempt as any).passed || false,
      percentage: (attempt as any).percentage || 0
    }));

    // Merge enrolled courses with batch information
    const coursesWithBatchInfo = enrolledCourses.map(course => {
      const batch = batchesWithTrainers.find(b => 
        (b as any).course_title === (course as any).course_title || (b as any).batchId === (course as any).batchId
      );
      return {
        ...course,
        batchInfo: batch || null
      };
    });

    // Calculate statistics
    const totalCourses = enrolledCourses.length;
    const completedCourses = enrolledCourses.filter(c => (c as any).courseCompletion).length;
    const inProgressCourses = totalCourses - completedCourses;
    const avgProgress = totalCourses > 0 
      ? Math.round(enrolledCourses.reduce((sum, c) => sum + ((c as any).progressPercentage || 0), 0) / totalCourses)
      : 0;

    // Invoice statistics
    const totalInvoices = invoices.length;
    const paidInvoices = invoices.filter(inv => (inv as any).status === 'paid').length;
    const pendingInvoices = invoices.filter(inv => (inv as any).status === 'due' || (inv as any).status === 'partial').length;
    const totalPaid = invoices.reduce((sum, inv) => sum + ((inv as any).paidAmount || 0), 0);
    const totalPending = invoices.reduce((sum, inv) => sum + ((inv as any).pendingAmount || 0), 0);

    // Certificate statistics
    const totalCertificates = certificates.length;
    const issuedCertificates = certificates.filter(cert => (cert as any).status === 'issued').length;
    const pendingCertificates = certificates.filter(cert => (cert as any).status === 'pending').length;

    // Quiz statistics
    const totalQuizzes = enhancedQuizAttempts.length;
    const passedQuizzes = enhancedQuizAttempts.filter(attempt => (attempt as any).passed).length;
    const avgQuizScore = totalQuizzes > 0
      ? Math.round(enhancedQuizAttempts.reduce((sum, attempt) => sum + ((attempt as any).percentage || 0), 0) / totalQuizzes)
      : 0;

    // Get upcoming classes (ongoing batches)
    const upcomingClasses = batchesWithTrainers
      .filter(batch => (batch as any).status === 'ongoing')
      .map(batch => ({
        batchId: (batch as any).batchId,
        courseTitle: (batch as any).course_title,
        timing: (batch as any).schedule.timing,
        days: (batch as any).schedule.days,
        meetingLink: (batch as any).meetingLink,
        trainerName: batch.trainer.name,
        trainerEmail: batch.trainer.email,
        startDate: (batch as any).schedule.startDate,
        endDate: (batch as any).schedule.endDate
      }));

    console.log('Returning dashboard data with', coursesWithBatchInfo.length, 'courses and', batchesWithTrainers.length, 'batches');

    return NextResponse.json({
      success: true,
      data: {
        enrolledCourses: coursesWithBatchInfo,
        batches: batchesWithTrainers,
        invoices,
        certificates,
        quizAttempts: enhancedQuizAttempts,
        upcomingClasses,
        stats: {
          totalCourses,
          completedCourses,
          inProgressCourses,
          avgProgress,
          totalInvoices,
          paidInvoices,
          pendingInvoices,
          totalPaid,
          totalPending,
          totalCertificates,
          issuedCertificates,
          pendingCertificates,
          totalQuizzes,
          passedQuizzes,
          avgQuizScore
        }
      }
    });
  } catch (error: any) {
    console.error('Student dashboard error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
