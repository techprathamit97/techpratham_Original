import { NextResponse } from "next/server";
import { connectMongo } from "@/utils/mongodb";
import ManualInvoice from "@/models/ManualInvoice.js";
import Batch from "@/models/Batch.js";
import Trainer from "@/models/Trainer.js";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();
    
    console.log('Analytics API: Starting data fetch...');
    
    // Get basic counts from ManualInvoice (enrolled students)
    const totalStudents = await ManualInvoice.countDocuments({ isManual: true });
    console.log('Total students:', totalStudents);
    
    const activeStudents = await ManualInvoice.countDocuments({ 
      isManual: true, 
      isApproved: true, 
      certificateApproved: false 
    });
    console.log('Active students:', activeStudents);
    
    const completedStudents = await ManualInvoice.countDocuments({ 
      isManual: true, 
      certificateApproved: true 
    });
    console.log('Completed students:', completedStudents);
    
    const activeBatches = await Batch.countDocuments({ status: { $in: ['upcoming', 'ongoing'] } });
    const totalTrainers = await Trainer.countDocuments();
    
    // Get revenue data from ManualInvoice
    const revenueData = await ManualInvoice.aggregate([
      { $match: { isManual: true } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$paidAmount" },
          pendingRevenue: { $sum: "$pendingAmount" }
        }
      }
    ]);
    
    const revenue = revenueData[0] || { totalRevenue: 0, pendingRevenue: 0 };
    console.log('Revenue data:', revenue);
    
    // Get course stats from ManualInvoice
    const courseStats = await ManualInvoice.aggregate([
      { $match: { isManual: true } },
      {
        $group: {
          _id: "$courseDetails.title",
          students: { $sum: 1 }
        }
      },
      {
        $project: {
          course: "$_id",
          students: 1,
          _id: 0
        }
      },
      { $sort: { students: -1 } },
      { $limit: 5 }
    ]);
    
    console.log('Course stats:', courseStats);
    
    // Get recent enrollments from ManualInvoice
    const recentEnrollments = await ManualInvoice.find({ isManual: true })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('customerDetails.name courseDetails.title status createdAt isApproved certificateApproved')
      .lean();
    
    console.log('Recent enrollments count:', recentEnrollments.length);
    
    // Mock trend data (you can implement real trend calculation)
    const enrollmentTrend = [
      { month: 'Jan', students: 45 },
      { month: 'Feb', students: 52 },
      { month: 'Mar', students: 48 },
      { month: 'Apr', students: 61 },
      { month: 'May', students: 55 },
      { month: 'Jun', students: 67 }
    ];
    
    const revenueTrend = [
      { month: 'Jan', revenue: 125000 },
      { month: 'Feb', revenue: 142000 },
      { month: 'Mar', revenue: 138000 },
      { month: 'Apr', revenue: 165000 },
      { month: 'May', revenue: 158000 },
      { month: 'Jun', revenue: 182000 }
    ];

    const analytics = {
      overview: {
        totalStudents,
        activeStudents,
        completedStudents,
        totalRevenue: revenue.totalRevenue || 0,
        pendingRevenue: revenue.pendingRevenue || 0,
        totalCourses: courseStats.length,
        activeBatches,
        totalTrainers
      },
      trends: {
        enrollmentTrend,
        revenueTrend
      },
      courseStats: courseStats.map(stat => ({
        course: stat.course || 'Unknown Course',
        students: stat.students
      })),
      recentEnrollments: recentEnrollments.map(enrollment => {
        let status = 'Enrolled';
        if (enrollment.certificateApproved) {
          status = 'Completed';
        } else if (enrollment.isApproved) {
          status = 'In Progress';
        }
        
        return {
          name: enrollment.customerDetails?.name || 'Unknown Student',
          course: enrollment.courseDetails?.title || 'Unknown Course',
          status: status
        };
      })
    };

    console.log('Final analytics:', analytics.overview);
    return NextResponse.json(analytics);
  } catch (error: any) {
    console.error("Analytics fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}