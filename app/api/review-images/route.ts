import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/utils/mongodb';
import ReviewImage from '@/models/ReviewImage';

// GET - Fetch all review images
export async function GET() {
  try {
    await connectMongo();

    const reviewImages = await ReviewImage.find({})
      .sort({ displayOrder: 1, createdAt: -1 })
      .lean();

    return NextResponse.json(reviewImages, { status: 200 });
  } catch (error: any) {
    console.error('Review Images fetch error:', error.message);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// POST - Create new review image
export async function POST(request: NextRequest) {
  try {
    await connectMongo();

    const body = await request.json();

    const newReviewImage = await ReviewImage.create(body);

    return NextResponse.json(newReviewImage, { status: 201 });
  } catch (error: any) {
    console.error('Review Image creation error:', error.message);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// PUT - Update review image
export async function PUT(request: NextRequest) {
  try {
    await connectMongo();

    const body = await request.json();
    const { _id, ...updateData } = body;

    if (!_id) {
      return NextResponse.json({ message: 'Review Image ID is required' }, { status: 400 });
    }

    const updatedReviewImage = await ReviewImage.findByIdAndUpdate(
      _id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedReviewImage) {
      return NextResponse.json({ message: 'Review Image not found' }, { status: 404 });
    }

    return NextResponse.json(updatedReviewImage, { status: 200 });
  } catch (error: any) {
    console.error('Review Image update error:', error.message);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// DELETE - Delete review image and S3 file
export async function DELETE(request: NextRequest) {
  try {
    await connectMongo();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'Review Image ID is required' }, { status: 400 });
    }

    const reviewImage = await ReviewImage.findById(id);

    if (!reviewImage) {
      return NextResponse.json({ message: 'Review Image not found' }, { status: 404 });
    }

    // Delete from S3 if fileKey exists
    if (reviewImage.fileKey) {
      try {
        await fetch('/api/review-images/upload', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileKey: reviewImage.fileKey })
        });
      } catch (s3Error) {
        console.warn('Failed to delete S3 file:', s3Error);
        // Continue with database deletion even if S3 deletion fails
      }
    }

    // Delete from database
    await ReviewImage.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Review Image deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Review Image deletion error:', error.message);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}