import { NextResponse } from 'next/server';
import { connectMongo } from '@/utils/mongodb';
import Review from '@/models/Review';

export async function GET() {
  try {
    await connectMongo();

    const stats = await Review.aggregate([
      {
        $match: {
          isApproved: true,
          isPublished: true
        }
      },
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          averageRating: { $avg: '$rating' },
          fiveStarCount: {
            $sum: { $cond: [{ $eq: ['$rating', 5] }, 1, 0] }
          },
          fourStarCount: {
            $sum: { $cond: [{ $eq: ['$rating', 4] }, 1, 0] }
          },
          threeStarCount: {
            $sum: { $cond: [{ $eq: ['$rating', 3] }, 1, 0] }
          },
          twoStarCount: {
            $sum: { $cond: [{ $eq: ['$rating', 2] }, 1, 0] }
          },
          oneStarCount: {
            $sum: { $cond: [{ $eq: ['$rating', 1] }, 1, 0] }
          }
        }
      }
    ]);

    const result = stats[0] || {
      totalReviews: 0,
      averageRating: 0,
      fiveStarCount: 0,
      fourStarCount: 0,
      threeStarCount: 0,
      twoStarCount: 0,
      oneStarCount: 0
    };

    return NextResponse.json({
      success: true,
      stats: {
        ...result,
        averageRating: result.averageRating ? parseFloat(result.averageRating.toFixed(1)) : 0
      }
    });
  } catch (error: any) {
    console.error('FETCH REVIEW STATS ERROR:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch review stats' },
      { status: 500 }
    );
  }
}
