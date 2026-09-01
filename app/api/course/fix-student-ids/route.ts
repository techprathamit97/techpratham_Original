import { NextResponse } from 'next/server';
import { connectMongo } from '@/utils/mongodb';
import Enrolled from '@/models/enrolled';
import { requireRole, LEAD_ACCESS_ROLES } from '@/lib/apiAuth';

export async function POST() {
  try {
    const denied = await requireRole(LEAD_ACCESS_ROLES);
    if (denied) return denied;

    await connectMongo();

    // Find all enrollments without student IDs
    const enrollmentsWithoutIds = await Enrolled.find({
      $or: [
        { studentId: { $exists: false } },
        { studentId: '' },
        { studentId: 'N/A' },
        { studentId: null }
      ]
    });

    let updatedCount = 0;
    
    for (const enrollment of enrollmentsWithoutIds) {
      // Generate student ID
      const count = await Enrolled.countDocuments();
      const studentId = `TP${String(count + updatedCount + 1).padStart(6, '0')}`;
      
      // Update the enrollment
      await Enrolled.findByIdAndUpdate(enrollment._id, { studentId });
      updatedCount++;
    }

    return NextResponse.json({
      success: true,
      message: `Updated ${updatedCount} enrollments with student IDs`,
      updatedCount
    });

  } catch (error: any) {
    console.error('FIX STUDENT IDS ERROR:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fix student IDs' },
      { status: 500 }
    );
  }
}