import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/utils/mongodb';
import ReviewImage from '@/models/ReviewImage';

// GET - Fetch all review images
export async function GET() {
  try {
    console.log('📡 Review-images API: GET request received');
    await connectMongo();
    console.log('📡 Review-images API: Database connected');

    const reviewImages = await ReviewImage.find({})
      .sort({ displayOrder: 1, createdAt: -1 })
      .lean();

    console.log('📡 Review-images API: Found', reviewImages.length, 'review images');
    console.log('📡 Review-images API: Sample data:', reviewImages[0] || 'No data');

    return NextResponse.json(reviewImages, { status: 200 });
  } catch (error: any) {
    console.error('❌ Review Images fetch error:', error.message);
    return NextResponse.json({ 
      error: 'Failed to fetch review images',
      message: error.message 
    }, { status: 500 });
  }
}

// POST - Create new review image
export async function POST(request: NextRequest) {
  try {
    await connectMongo();

    const body = await request.json();

    // Validate required fields
    if (!body.imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }

    if (!body.altText) {
      return NextResponse.json({ error: 'Alt text is required' }, { status: 400 });
    }

    const newReviewImage = await ReviewImage.create(body);

    return NextResponse.json(newReviewImage, { status: 201 });
  } catch (error: any) {
    console.error('Review Image creation error:', error.message);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: validationErrors 
      }, { status: 400 });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      return NextResponse.json({ 
        error: 'Duplicate entry found' 
      }, { status: 409 });
    }

    return NextResponse.json({ 
      error: 'Failed to create review image',
      message: error.message 
    }, { status: 500 });
  }
}

// PUT - Update review image
export async function PUT(request: NextRequest) {
  try {
    await connectMongo();

    const body = await request.json();
    const { _id, ...updateData } = body;

    if (!_id) {
      return NextResponse.json({ error: 'Review Image ID is required' }, { status: 400 });
    }

    // Validate required fields
    if (updateData.imageUrl !== undefined && !updateData.imageUrl) {
      return NextResponse.json({ error: 'Image URL cannot be empty' }, { status: 400 });
    }

    if (updateData.altText !== undefined && !updateData.altText) {
      return NextResponse.json({ error: 'Alt text cannot be empty' }, { status: 400 });
    }

    const updatedReviewImage = await ReviewImage.findByIdAndUpdate(
      _id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedReviewImage) {
      return NextResponse.json({ error: 'Review Image not found' }, { status: 404 });
    }

    return NextResponse.json(updatedReviewImage, { status: 200 });
  } catch (error: any) {
    console.error('Review Image update error:', error.message);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: validationErrors 
      }, { status: 400 });
    }

    return NextResponse.json({ 
      error: 'Failed to update review image',
      message: error.message 
    }, { status: 500 });
  }
}

// DELETE - Delete review image and S3 file
export async function DELETE(request: NextRequest) {
  try {
    await connectMongo();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Review Image ID is required' }, { status: 400 });
    }

    const reviewImage = await ReviewImage.findById(id);

    if (!reviewImage) {
      return NextResponse.json({ error: 'Review Image not found' }, { status: 404 });
    }

    // Delete from filesystem if fileKey exists
    if (reviewImage.fileKey) {
      try {
        await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/review-images/upload`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileKey: reviewImage.fileKey })
        });
      } catch (fileError) {
        console.warn('Failed to delete file:', fileError);
        // Continue with database deletion even if file deletion fails
      }
    }

    // Delete from database
    await ReviewImage.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Review Image deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Review Image deletion error:', error.message);
    return NextResponse.json({ 
      error: 'Failed to delete review image',
      message: error.message 
    }, { status: 500 });
  }
}