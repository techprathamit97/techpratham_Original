import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/utils/mongodb';
import Batch from '@/models/Batch';
import Enrolled from '@/models/enrolled';
import TrainerAuth from '@/models/TrainerAuth';
import Trainer from '@/models/Trainer';

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

    console.log('=== TRAINER DASHBOARD DEBUG ===');
    console.log('Looking for trainer with ID:', trainerId);

    // Find the trainer in TrainerAuth table
    const trainerAuth = await TrainerAuth.findOne({ trainerId }).lean();

    if (!trainerAuth) {
      return NextResponse.json(
        { error: `Trainer with ID ${trainerId} not found` },
        { status: 404 }
      );
    }

    console.log('TrainerAuth found:', (trainerAuth as any).name);

    // Try to find additional trainer details in Trainer table (optional)
    const trainerProfile = await Trainer.findOne({ 
      $or: [
        { trainerId: trainerId },
        { email: (trainerAuth as any).email }
      ]
    }).lean();

    // Combine trainer data
    const trainer = {
      trainerId: (trainerAuth as any).trainerId,
      name: (trainerAuth as any).name,
      email: (trainerAuth as any).email,
      phone: (trainerAuth as any).phone,
      isActive: (trainerAuth as any).isActive,
      lastLogin: (trainerAuth as any).lastLogin,
      // Add profile data if available
      ...(trainerProfile && {
        experience: (trainerProfile as any).experience,
        expertise: (trainerProfile as any).expertise,
        rating: (trainerProfile as any).rating,
        bio: (trainerProfile as any).bio,
        linkedIn: (trainerProfile as any).linkedIn,
        github: (trainerProfile as any).github,
        portfolio: (trainerProfile as any).portfolio
      })
    };

    // Fetch assigned batches using trainerId
    const batches = await Batch.find({ trainerId }).lean();
    console.log('Batches found for trainer:', batches.length);

    // Get all student IDs from batches
    const allStudentIds = batches.flatMap(batch => (batch as any).enrolled_students || []);
    console.log('Total student IDs from batches:', allStudentIds.length);
    
    // Fetch student details from Enrolled table
    const students = await Enrolled.find({ 
      studentId: { $in: allStudentIds } 
    }).lean();
    console.log('Students found in Enrolled table:', students.length);

    // Calculate statistics
    const totalBatches = batches.length;
    const activeBatches = batches.filter(b => (b as any).status === 'ongoing').length;
    const totalStudents = allStudentIds.length; // Use actual enrolled count from batches
    const completedStudents = students.filter(s => (s as any).courseCompletion).length;

    console.log('Stats calculated:', { totalBatches, activeBatches, totalStudents, completedStudents });

    return NextResponse.json({
      success: true,
      data: {
        trainer,
        batches,
        students,
        stats: {
          totalBatches,
          activeBatches,
          totalStudents,
          completedStudents
        }
      }
    });
  } catch (error: any) {
    console.error('Trainer dashboard error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
