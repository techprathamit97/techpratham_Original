import { NextResponse } from 'next/server';
import { connectMongo } from '@/utils/mongodb';
import Review from '@/models/Review';

// GET all reviews (including unapproved) - Admin only
export async function GET(req: Request) {
  try {
    await connectMongo();

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');
    const status = searchParams.get('status'); // 'pending', 'approved', 'published'

    const skip = (page - 1) * limit;

    // Build query based on status
    let query: any = {};
    if (status === 'pending') {
      query.isApproved = false;
    } else if (status === 'approved') {
      query.isApproved = true;
      query.isPublished = false;
    } else if (status === 'published') {
      query.isPublished = true;
    }

    const reviews = await Review.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

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
    console.error('FETCH ALL REVIEWS ERROR:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// PATCH - Update review status (approve, publish, feature)
export async function PATCH(req: Request) {
  try {
    await connectMongo();

    const body = await req.json();
    const { reviewId, action } = body;

    if (!reviewId || !action) {
      return NextResponse.json(
        { error: 'Review ID and action are required' },
        { status: 400 }
      );
    }

    let updateData: any = {};

    switch (action) {
      case 'approve':
        updateData = { isApproved: true };
        break;
      case 'unapprove':
        updateData = { isApproved: false, isPublished: false };
        break;
      case 'publish':
        updateData = { isApproved: true, isPublished: true };
        break;
      case 'unpublish':
        updateData = { isPublished: false };
        break;
      case 'feature':
        updateData = { isFeatured: true };
        break;
      case 'unfeature':
        updateData = { isFeatured: false };
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      updateData,
      { new: true }
    );

    if (!updatedReview) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Review ${action}d successfully`,
      review: updatedReview
    });
  } catch (error: any) {
    console.error('UPDATE REVIEW ERROR:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update review' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a review
export async function DELETE(req: Request) {
  try {
    await connectMongo();

    const { searchParams } = new URL(req.url);
    const reviewId = searchParams.get('id');

    if (!reviewId) {
      return NextResponse.json(
        { error: 'Review ID is required' },
        { status: 400 }
      );
    }

    const deletedReview = await Review.findByIdAndDelete(reviewId);

    if (!deletedReview) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error: any) {
    console.error('DELETE REVIEW ERROR:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete review' },
      { status: 500 }
    );
  }
}
