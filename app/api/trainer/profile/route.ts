import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/utils/mongodb';
import Batch from '@/models/Batch';
import TrainerAuth from '@/models/TrainerAuth';
import Trainer from '@/models/Trainer';
import ManualInvoice from '@/models/ManualInvoice';
import Enrolled from '@/models/enrolled';

export async function GET(req: NextRequest) {
  try {
    await connectMongo();
    
    const { searchParams } = new URL(req.url);
    const trainerId = searchParams.get('trainerId');

    if (!trainerId) {
      return NextResponse.json(
        { error: 'Trainer ID is required' },
        { status: 400 }
      );
    }

    console.log('=== TRAINER PROFILE API DEBUG ===');
    console.log('Fetching profile for trainer ID:', trainerId);

    // Find the trainer in TrainerAuth table
    const trainerAuth = await TrainerAuth.findOne({ trainerId }).lean();
    if (!trainerAuth) {
      return NextResponse.json(
        { error: 'Trainer not found' },
        { status: 404 }
      );
    }

    // Try to find additional trainer details
    const trainerProfile = await Trainer.findOne({ 
      $or: [
        { trainerId: trainerId },
        { email: (trainerAuth as any).email }
      ]
    }).lean();

    // Find batches assigned to this trainer
    const batches = await Batch.find({ trainerId }).lean();
    console.log('Batches found:', batches.length);

    // Get all student IDs from batches
    const allStudentIds = batches.flatMap(batch => (batch as any).enrolled_students || []);
    const uniqueStudentIds = [...new Set(allStudentIds)];
    
    // Get student details
    const enrolledStudents = await Enrolled.find({ 
      studentId: { $in: uniqueStudentIds } 
    }).lean();

    // Get invoice data for revenue calculation
    const invoices = await ManualInvoice.find({
      'customerDetails.studentId': { $in: uniqueStudentIds }
    }).lean();

    // Calculate comprehensive statistics
    const totalBatches = batches.length;
    const activeBatches = batches.filter(b => (b as any).status === 'ongoing').length;
    const upcomingBatches = batches.filter(b => (b as any).status === 'upcoming').length;
    const completedBatches = batches.filter(b => (b as any).status === 'completed').length;
    
    const totalStudents = uniqueStudentIds.length;
    const completedStudents = enrolledStudents.filter(s => (s as any).courseCompletion).length;
    const inProgressStudents = totalStudents - completedStudents;
    
    const totalRevenue = invoices.reduce((sum, inv) => sum + (inv as any).totalAmount, 0);
    const collectedRevenue = invoices.reduce((sum, inv) => sum + (inv as any).paidAmount, 0);
    const pendingRevenue = invoices.reduce((sum, inv) => sum + (inv as any).pendingAmount, 0);
    
    const avgProgress = enrolledStudents.length > 0 
      ? Math.round(enrolledStudents.reduce((sum, s) => sum + ((s as any).progressPercentage || 0), 0) / enrolledStudents.length)
      : 0;

    // Get course categories taught
    const courseCategories = [...new Set(enrolledStudents.map(s => (s as any).category).filter(Boolean))];
    const courseTitles = [...new Set(batches.map(b => (b as any).course_title))];

    // Calculate performance metrics
    const completionRate = totalStudents > 0 ? Math.round((completedStudents / totalStudents) * 100) : 0;
    const collectionRate = totalRevenue > 0 ? Math.round((collectedRevenue / totalRevenue) * 100) : 0;

    // Recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentEnrollments = enrolledStudents.filter(s => 
      new Date((s as any).createdAt) >= thirtyDaysAgo
    ).length;

    const recentCompletions = enrolledStudents.filter(s => 
      (s as any).courseCompletion && (s as any).lastAccessedAt && new Date((s as any).lastAccessedAt) >= thirtyDaysAgo
    ).length;

    // Batch performance
    const batchPerformance = batches.map(batch => {
      const batchStudents = enrolledStudents.filter(s => 
        (batch as any).enrolled_students.includes((s as any).studentId)
      );
      const batchCompleted = batchStudents.filter(s => (s as any).courseCompletion).length;
      const batchAvgProgress = batchStudents.length > 0 
        ? Math.round(batchStudents.reduce((sum, s) => sum + ((s as any).progressPercentage || 0), 0) / batchStudents.length)
        : 0;

      return {
        batchId: (batch as any).batchId,
        course_title: (batch as any).course_title,
        status: (batch as any).status,
        totalStudents: (batch as any).enrolled_students.length,
        enrolledStudents: batchStudents.length,
        completedStudents: batchCompleted,
        avgProgress: batchAvgProgress,
        schedule: (batch as any).schedule,
        meetingLink: (batch as any).meetingLink
      };
    });

    console.log('Returning trainer profile data');

    return NextResponse.json({
      success: true,
      data: {
        trainer: {
          trainerId: (trainerAuth as any).trainerId,
          name: (trainerAuth as any).name,
          email: (trainerAuth as any).email,
          phone: (trainerAuth as any).phone,
          isActive: (trainerAuth as any).isActive,
          lastLogin: (trainerAuth as any).lastLogin,
          // Add profile data if available
          ...(trainerProfile && {
            profile: (trainerProfile as any).profile,
            experience: (trainerProfile as any).experience,
            expertise: (trainerProfile as any).expertise || [],
            rating: (trainerProfile as any).rating,
            bio: (trainerProfile as any).bio,
            linkedIn: (trainerProfile as any).linkedIn,
            github: (trainerProfile as any).github,
            portfolio: (trainerProfile as any).portfolio,
            salary: (trainerProfile as any).salary,
            paymentMode: (trainerProfile as any).paymentMode,
            joinedAt: (trainerProfile as any).joinedAt,
            totalStudents: (trainerProfile as any).totalStudents
          })
        },
        stats: {
          totalBatches,
          activeBatches,
          upcomingBatches,
          completedBatches,
          totalStudents,
          completedStudents,
          inProgressStudents,
          totalRevenue,
          collectedRevenue,
          pendingRevenue,
          avgProgress,
          completionRate,
          collectionRate,
          recentEnrollments,
          recentCompletions
        },
        performance: {
          courseCategories,
          courseTitles,
          batchPerformance
        },
        batches: batches.map(batch => ({
          ...batch,
          enrolledStudentsCount: (batch as any).enrolled_students.length
        }))
      }
    });
  } catch (error: any) {
    console.error('Trainer profile API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}