import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/utils/mongodb';
import Batch from '@/models/Batch';
import Enrolled from '@/models/enrolled';
import TrainerAuth from '@/models/TrainerAuth';
import Trainer from '@/models/Trainer';
import ManualInvoice from '@/models/ManualInvoice';

export async function GET(req: NextRequest) {
  try {
    await connectMongo();
    
    const { searchParams } = new URL(req.url);
    const trainerId = searchParams.get('trainerId');
    const batchId = searchParams.get('batchId'); // Optional filter by specific batch

    if (!trainerId) {
      return NextResponse.json(
        { error: 'Trainer ID is required' },
        { status: 400 }
      );
    }



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
    let batchQuery: any = { trainerId };
    if (batchId) {
      batchQuery.batchId = batchId;
    }
    
    const batches = await Batch.find(batchQuery).lean();


    // Get all student IDs from all batches
    const allStudentIds = batches.flatMap(batch => (batch as any).enrolled_students || []);
 
    
    // Remove duplicates
    const uniqueStudentIds = [...new Set(allStudentIds)];


    // Fetch student details from Enrolled table
    const enrolledStudents = await Enrolled.find({ 
      studentId: { $in: uniqueStudentIds } 
    }).lean();
  

    // Get student details from ManualInvoice table
    const invoiceStudents = await ManualInvoice.find({
      'customerDetails.studentId': { $in: uniqueStudentIds }
    }).lean();
  

    // Process students with detailed information
    const studentsWithDetails: any[] = [];
    const processedStudentIds = new Set<string>();


    for (const student of enrolledStudents) {
      if (!processedStudentIds.has((student as any).studentId)) {
        // Find which batches this student belongs to
        const studentBatches = batches.filter(batch => 
          (batch as any).enrolled_students.includes((student as any).studentId)
        );

        // Find invoice information
        const studentInvoices = invoiceStudents.filter(inv => 
          (inv as any).customerDetails.studentId === (student as any).studentId
        );

        // Get the primary invoice (matching course title)
        const primaryInvoice = studentInvoices.find(inv => 
          (inv as any).courseDetails.title === (student as any).course_title
        ) || studentInvoices[0];

        studentsWithDetails.push({
          studentId: (student as any).studentId,
          name: (student as any).name,
          email: (student as any).email,
          phone: (student as any).phone,
          course_title: (student as any).course_title,
          course_desc: (student as any).course_desc || '',
          category: (student as any).category || 'N/A',
          level: (student as any).level || 'N/A',
          duration: (student as any).duration || 'N/A',
          progressPercentage: (student as any).progressPercentage || 0,
          courseCompletion: (student as any).courseCompletion || false,
          enrolledDate: (student as any).createdAt,
          lastAccessedAt: (student as any).lastAccessedAt,
          batches: studentBatches.map(batch => ({
            batchId: (batch as any).batchId,
            course_title: (batch as any).course_title,
            status: (batch as any).status,
            schedule: (batch as any).schedule,
            meetingLink: (batch as any).meetingLink
          })),
          invoices: studentInvoices.map(inv => ({
            invoiceNumber: (inv as any).invoiceNumber,
            totalAmount: (inv as any).totalAmount,
            paidAmount: (inv as any).paidAmount,
            pendingAmount: (inv as any).pendingAmount,
            status: (inv as any).status,
            invoiceDate: (inv as any).invoiceDate,
            courseTitle: (inv as any).courseDetails.title
          })),
          totalAmount: (primaryInvoice as any)?.totalAmount || (student as any).totalAmount || 0,
          paidAmount: (primaryInvoice as any)?.paidAmount || 0,
          pendingAmount: (primaryInvoice as any)?.pendingAmount || 0,
          paymentStatus: (primaryInvoice as any)?.status || 'unknown',
          quizScores: (student as any).quizScores || [],
          verifyPayment: (student as any).verifyPayment || false,
          feeType: (student as any).feeType || 'N/A'
        });

        processedStudentIds.add((student as any).studentId);

      }
    }


    // Process students who are in batches but not in Enrolled table
    for (const batch of batches) {
   
      
      for (const studentId of (batch as any).enrolled_students) {
        if (!processedStudentIds.has(studentId)) {

          
          // Find invoice information for this student
          const studentInvoices = invoiceStudents.filter(inv => 
            (inv as any).customerDetails.studentId === studentId
          );



          const primaryInvoice = studentInvoices.find(inv => 
            (inv as any).courseDetails.title === (batch as any).course_title
          ) || studentInvoices[0];

          if (primaryInvoice) {

            
            studentsWithDetails.push({
              studentId: studentId,
              name: (primaryInvoice as any).customerDetails.name || 'Unknown Student',
              email: (primaryInvoice as any).customerDetails.email || 'N/A',
              phone: (primaryInvoice as any).customerDetails.phone || 'N/A',
              course_title: (batch as any).course_title,
              course_desc: (batch as any).description || '',
              category: (primaryInvoice as any).courseDetails.category || 'N/A',
              level: (primaryInvoice as any).courseDetails.level || 'N/A',
              duration: (primaryInvoice as any).courseDetails.duration || 'N/A',
              progressPercentage: 0, // Default since not in Enrolled table
              courseCompletion: false, // Default since not in Enrolled table
              enrolledDate: (batch as any).createdAt,
              lastAccessedAt: null,
              batches: [{
                batchId: (batch as any).batchId,
                course_title: (batch as any).course_title,
                status: (batch as any).status,
                schedule: (batch as any).schedule,
                meetingLink: (batch as any).meetingLink
              }],
              invoices: studentInvoices.map(inv => ({
                invoiceNumber: (inv as any).invoiceNumber,
                totalAmount: (inv as any).totalAmount,
                paidAmount: (inv as any).paidAmount,
                pendingAmount: (inv as any).pendingAmount,
                status: (inv as any).status,
                invoiceDate: (inv as any).invoiceDate,
                courseTitle: (inv as any).courseDetails.title
              })),
              totalAmount: (primaryInvoice as any).totalAmount || 0,
              paidAmount: (primaryInvoice as any).paidAmount || 0,
              pendingAmount: (primaryInvoice as any).pendingAmount || 0,
              paymentStatus: (primaryInvoice as any).status || 'unknown',
              quizScores: [],
              verifyPayment: true, // Has invoice so payment is verified
              feeType: 'N/A'
            });

            processedStudentIds.add(studentId);
          } else {

            
            // Create minimal student record even without invoice
            studentsWithDetails.push({
              studentId: studentId,
              name: `Student ${studentId}`,
              email: 'N/A',
              phone: 'N/A',
              course_title: (batch as any).course_title,
              course_desc: (batch as any).description || '',
              category: 'N/A',
              level: 'N/A',
              duration: 'N/A',
              progressPercentage: 0,
              courseCompletion: false,
              enrolledDate: (batch as any).createdAt,
              lastAccessedAt: null,
              batches: [{
                batchId: (batch as any).batchId,
                course_title: (batch as any).course_title,
                status: (batch as any).status,
                schedule: (batch as any).schedule,
                meetingLink: (batch as any).meetingLink
              }],
              invoices: [],
              totalAmount: 0,
              paidAmount: 0,
              pendingAmount: 0,
              paymentStatus: 'unknown',
              quizScores: [],
              verifyPayment: false,
              feeType: 'N/A'
            });

            processedStudentIds.add(studentId);
          }
        }
      }
    }

    // Calculate statistics
    const totalStudents = studentsWithDetails.length;
    const completedStudents = studentsWithDetails.filter(s => s.courseCompletion).length;
    const inProgressStudents = totalStudents - completedStudents;
    const totalRevenue = studentsWithDetails.reduce((sum, s) => sum + s.totalAmount, 0);
    const collectedRevenue = studentsWithDetails.reduce((sum, s) => sum + s.paidAmount, 0);
    const pendingRevenue = studentsWithDetails.reduce((sum, s) => sum + s.pendingAmount, 0);

    // Group students by batch for better organization
    const studentsByBatch = batches.map(batch => ({
      batchId: (batch as any).batchId,
      course_title: (batch as any).course_title,
      status: (batch as any).status,
      schedule: (batch as any).schedule,
      capacity: (batch as any).capacity,
      students: studentsWithDetails.filter(student => 
        student.batches.some((sb: any) => sb.batchId === (batch as any).batchId)
      )
    }));

  

    return NextResponse.json({
      success: true,
      data: {
        trainer: {
          trainerId: (trainerAuth as any).trainerId,
          name: (trainerAuth as any).name,
          email: (trainerAuth as any).email,
          phone: (trainerAuth as any).phone,
          experience: (trainerProfile as any)?.experience || 'N/A',
          rating: (trainerProfile as any)?.rating || 4.5
        },
        students: studentsWithDetails,
        batches: batches,
        studentsByBatch: studentsByBatch,
        stats: {
          totalStudents,
          completedStudents,
          inProgressStudents,
          totalRevenue,
          collectedRevenue,
          pendingRevenue,
          totalBatches: batches.length
        }
      }
    });
  } catch (error: any) {
    console.error('Trainer students API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}