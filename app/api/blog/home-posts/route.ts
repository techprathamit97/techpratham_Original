import { NextResponse } from "next/server";
import { connectMongo } from "@/utils/mongodb";
import BlogPost from "@/models/BlogPost";

// Enable ISR with revalidation
export const revalidate = 600; // Revalidate every 10 minutes
export const dynamic = 'force-static';

/* ===================== GET - Fetch Home Page Blog Posts ===================== */
export async function GET(req: Request) {
  try {
    // Connect to MongoDB
    await connectMongo();

    // Get page from query params (default to 1)
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = 12; // 12 posts per page
    const skip = (page - 1) * limit;

    // Fetch published posts with pagination
    const posts = await BlogPost.find({ status: 'published' })
      .select('_id title slug excerpt category categorySlug featuredImage publishedAt')
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const total = await BlogPost.countDocuments({ status: 'published' });

    // Transform posts to match expected format
    const transformedPosts = posts.map((post: any) => ({
      _id: post._id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      category: post.category || 'Blog',
      categorySlug: post.categorySlug || 'general-blogs',
      coverImage: post.featuredImage?.url || null,
      publishedAt: post.publishedAt
    }));

    const response = NextResponse.json({ 
      posts: transformedPosts || [],
      total,
      page,
      hasMore: skip + limit < total,
      success: true 
    });
    
    // Aggressive caching - 10 minutes fresh, 1 hour stale
    response.headers.set('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=3600');
    
    return response;
  } catch (error: any) {
    console.error("❌ Home Posts API Error:", error);
    
    // Return empty array on error with success flag
    const response = NextResponse.json({ 
      posts: [], 
      total: 0,
      page: 1,
      hasMore: false,
      success: false,
      error: error.message 
    });
    
    // Cache errors for 1 minute only
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');
    
    return response;
  }
}