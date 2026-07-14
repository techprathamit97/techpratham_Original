import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/utils/mongodb';
import Review from '@/models/Review';

// GET - Fetch reviews
export async function GET(request: NextRequest) {
  try {
    await connectMongo();

    const { searchParams } = new URL(request.url);
    const published = searchParams.get('published');
    const approved = searchParams.get('approved');
    const featured = searchParams.get('featured');
    const limit = parseInt(searchParams.get('limit') || '0');
    const page = parseInt(searchParams.get('page') || '1');

    let query: any = {};

    // For public display, only show approved and published reviews
    if (published === 'true') {
      query.isPublished = true;
      query.isApproved = true;
    }

    if (approved !== null && approved !== undefined) {
      query.isApproved = approved === 'true';
    }

    if (featured === 'true') {
      query.isFeatured = true;
    }

    const skip = (page - 1) * limit;

    let reviewsQuery = Review.find(query)
      .sort({ isFeatured: -1, rating: -1, publishDate: -1 });

    if (limit > 0) {
      reviewsQuery = reviewsQuery.limit(limit);
    }

    if (skip > 0) {
      reviewsQuery = reviewsQuery.skip(skip);
    }

    const reviews = await reviewsQuery.lean();
    const total = await Review.countDocuments(query);

    return NextResponse.json({
      reviews,
      total,
      page,
      hasMore: limit > 0 && (skip + reviews.length) < total
    }, { status: 200 });

  } catch (error: any) {
    console.error('Reviews fetch error:', error.message);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// POST - Create new review (admin only)
export async function POST(request: NextRequest) {
  try {
    await connectMongo();

    const body = await request.json();

    // Admin creates reviews that are pre-approved and published by default
    const reviewData = {
      ...body,
      isApproved: true,
      isPublished: true
    };

    const newReview = await Review.create(reviewData);

    return NextResponse.json(newReview, { status: 201 });
  } catch (error: any) {
    console.error('Review creation error:', error.message);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// PUT - Update review
export async function PUT(request: NextRequest) {
  try {
    await connectMongo();

    const body = await request.json();
    const { _id, ...updateData } = body;

    if (!_id) {
      return NextResponse.json({ message: 'Review ID is required' }, { status: 400 });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      _id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedReview) {
      return NextResponse.json({ message: 'Review not found' }, { status: 404 });
    }

    return NextResponse.json(updatedReview, { status: 200 });
  } catch (error: any) {
    console.error('Review update error:', error.message);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// DELETE - Delete review
export async function DELETE(request: NextRequest) {
  try {
    await connectMongo();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'Review ID is required' }, { status: 400 });
    }

    const deletedReview = await Review.findByIdAndDelete(id);

    if (!deletedReview) {
      return NextResponse.json({ message: 'Review not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Review deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Review deletion error:', error.message);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}