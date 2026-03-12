import { NextResponse } from 'next/server';
import { connectMongo } from '@/utils/mongodb';
import Review from '@/models/Review';

export async function POST(req: Request) {
  try {
    await connectMongo();

    const body = await req.json();
    const { name, email, rating, review, profileImage, profileImageKey, course, designation, company } = body;

    // Validation
    if (!name || !email || !rating || !review) {
      return NextResponse.json(
        { error: 'Name, email, rating, and review are required' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Create review
    const newReview = await Review.create({
      name,
      email,
      rating,
      review,
      profileImage: profileImage || null,
      profileImageKey: profileImageKey || null,
      course: course || null,
      designation: designation || null,
      company: company || null,
      isApproved: false,
      isPublished: false,
      isFeatured: false
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Review submitted successfully! It will be published after approval.',
        review: newReview
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('CREATE REVIEW ERROR:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create review' },
      { status: 500 }
    );
  }
}
