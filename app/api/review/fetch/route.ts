import { NextResponse } from 'next/server';
import { connectMongo } from '@/utils/mongodb';
import Review from '@/models/Review';

export async function GET(req: Request) {
  try {
    await connectMongo();

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const featured = searchParams.get('featured') === 'true';
    const minRating = parseInt(searchParams.get('minRating') || '0');

    const skip = (page - 1) * limit;

    // Build query
    const query: any = {
      isApproved: true,
      isPublished: true
    };

    if (featured) {
      query.isFeatured = true;
    }

    if (minRating > 0) {
      query.rating = { $gte: minRating };
    }

    // Fetch reviews
    const reviews = await Review.find(query)
      .sort({ isFeatured: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-email -profileImageKey -__v')
      .lean();

    // Get total count
    const total = await Review.countDocuments(query);

    return NextResponse.json({
      success: true,
      reviews,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    console.error('FETCH REVIEWS ERROR:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}
