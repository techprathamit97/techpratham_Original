// Script to seed some test review data
// Run with: node scripts/seed-reviews.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const ReviewSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5']
    },
    review: {
      type: String,
      required: [true, 'Review text is required'],
      trim: true,
      minlength: [10, 'Review must be at least 10 characters'],
      maxlength: [1000, 'Review cannot exceed 1000 characters']
    },
    profileImage: {
      type: String,
      default: null
    },
    profileImageKey: {
      type: String,
      default: null
    },
    course: {
      type: String,
      trim: true,
      default: null
    },
    designation: {
      type: String,
      trim: true,
      maxlength: [100, 'Designation cannot exceed 100 characters'],
      default: null
    },
    company: {
      type: String,
      trim: true,
      maxlength: [100, 'Company cannot exceed 100 characters'],
      default: null
    },
    isApproved: {
      type: Boolean,
      default: false
    },
    isPublished: {
      type: Boolean,
      default: false
    },
    isFeatured: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const Review = mongoose.models.Review || mongoose.model('Review', ReviewSchema);

const testReviews = [
  {
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@example.com',
    rating: 5,
    review: 'Excellent training program! The instructors were very knowledgeable and the course content was up-to-date. I was able to land a job immediately after completing the course.',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format',
    publishDate: new Date('2024-05-15'),
    isApproved: true,
    isPublished: true,
    isFeatured: true
  },
  {
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    rating: 5,
    review: 'Amazing experience with Tech Pratham. The trainers are industry experts and provide real-world examples. Highly recommended for anyone looking to build a career in data analytics.',
    profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face&auto=format',
    publishDate: new Date('2024-06-20'),
    isApproved: true,
    isPublished: true,
    isFeatured: false
  },
  {
    name: 'Amit Singh',
    email: 'amit.singh@example.com',
    rating: 4,
    review: 'Good training institute with comprehensive curriculum. The placement support is excellent and they really care about student success.',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format',
    publishDate: new Date('2024-07-10'),
    isApproved: true,
    isPublished: true,
    isFeatured: false
  },
  {
    name: 'Sneha Patel',
    email: 'sneha.patel@example.com',
    rating: 5,
    review: 'Outstanding learning experience! The hands-on approach and practical projects helped me understand the concepts thoroughly. Thank you Tech Pratham team!',
    profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face&auto=format',
    publishDate: new Date('2024-08-05'),
    isApproved: true,
    isPublished: true,
    isFeatured: true
  },
  {
    name: 'Vikram Gupta',
    email: 'vikram.gupta@example.com',
    rating: 5,
    review: 'Tech Pratham provided me with the skills and confidence I needed to excel in my career. The training methodology is excellent and the faculty is very supportive.',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face&auto=format',
    publishDate: new Date('2024-09-12'),
    isApproved: true,
    isPublished: true,
    isFeatured: false
  }
];

async function seedReviews() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    
    if (!process.env.MONGODB_URL) {
      throw new Error('MONGODB_URL is not defined in environment variables');
    }

    await mongoose.connect(process.env.MONGODB_URL, {
      dbName: 'database'
    });

    console.log('✅ Connected to MongoDB');

    // Clear existing reviews (optional)
    const existingCount = await Review.countDocuments();
    console.log(`📊 Found ${existingCount} existing reviews`);

    // Insert test reviews
    console.log('🌱 Seeding test reviews...');
    const createdReviews = await Review.insertMany(testReviews);
    
    console.log(`✅ Successfully created ${createdReviews.length} test reviews:`);
    createdReviews.forEach((review, index) => {
      console.log(`   ${index + 1}. ${review.name} - ${review.rating}⭐ - ${review.course}`);
    });

    console.log('\n📋 Summary:');
    console.log(`   - Total reviews in database: ${await Review.countDocuments()}`);
    console.log(`   - Published reviews: ${await Review.countDocuments({ isPublished: true })}`);
    console.log(`   - Featured reviews: ${await Review.countDocuments({ isFeatured: true })}`);

  } catch (error) {
    console.error('❌ Error seeding reviews:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the seeding
seedReviews();