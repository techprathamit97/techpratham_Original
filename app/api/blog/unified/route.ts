import { NextResponse } from "next/server";
import { connectMongo } from "@/utils/mongodb";
import BlogPost from "@/models/BlogPost";
import { cachedFetch } from "@/lib/sanity";
import { postsListQuery } from "@/lib/queries";

/* ===================== GET - Fetch Unified Blog Posts (Custom + Sanity) ===================== */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status") || "published";
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy") || "publishedAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    console.log('🔍 Unified API called with params:', { page, limit, status, category, search });

    // Fetch custom blogs from MongoDB
    await connectMongo();
    const customQuery: any = {};
    
    if (status !== "all") {
      customQuery.status = status;
    }
    
    if (category && category !== "general-blogs") {
      customQuery.categorySlug = category;
    }
    
    if (search) {
      customQuery.$or = [
        { title: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } }
      ];
    }

    let customPosts: any[] = [];
    if (!category || category !== "general-blogs") {
      customPosts = await BlogPost.find(customQuery)
        .select("slug title excerpt author category categorySlug tags featuredImage publishedAt status viewCount readingTime")
        .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
        .lean();
      
      // Add source identifier
      customPosts = customPosts.map(post => ({
        ...post,
        source: "custom",
        _id: (post as any)._id.toString()
      }));
    }

    console.log(`📝 Found ${customPosts.length} custom posts`);

    // Fetch Sanity blogs with optimized query
    let sanityPosts = [];
    if (!category || category === "general-blogs") {
      try {
        console.log('🔄 Fetching from Sanity...');
        
        // Use cached fetch with 5 minute cache for listing
        const sanityData = await cachedFetch(postsListQuery, 5);
        console.log(`📝 Fetched ${sanityData.length} Sanity posts (cached)`);
        
        sanityPosts = sanityData.map((post: any) => ({
          _id: post._id,
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt || "No excerpt available",
          author: post.authorName || "TechPratham Team",
          category: "General Blogs",
          categorySlug: "general-blogs",
          tags: post.categories || [],
          featuredImage: {
            url: post.coverImage || "/default-blog-image.jpg",
            alt: post.title
          },
          publishedAt: post.publishedAt,
          status: "published",
          viewCount: 0,
          readingTime: 5,
          source: "sanity"
        }));

        // Apply search filter to Sanity posts
        if (search) {
          sanityPosts = sanityPosts.filter((post: any) => 
            post.title.toLowerCase().includes(search.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(search.toLowerCase())
          );
        }
      } catch (error) {
        console.error('❌ Failed to fetch Sanity blogs:', error);
      }
    }

    // Combine and sort all posts
    let allPosts = [...customPosts, ...sanityPosts];
    
    console.log(`📊 Total posts before sorting: ${allPosts.length} (${customPosts.length} custom + ${sanityPosts.length} sanity)`);
    
    // Sort combined posts
    allPosts.sort((a, b) => {
      const aDate = new Date(a.publishedAt).getTime();
      const bDate = new Date(b.publishedAt).getTime();
      return sortOrder === "desc" ? bDate - aDate : aDate - bDate;
    });

    // Apply pagination
    const total = allPosts.length;
    const skip = (page - 1) * limit;
    const paginatedPosts = allPosts.slice(skip, skip + limit);

    console.log(`📄 Returning ${paginatedPosts.length} posts (page ${page} of ${Math.ceil(total / limit)})`);

    const response = NextResponse.json({
      posts: paginatedPosts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });

    // Add cache headers for better performance
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    
    return response;
  } catch (error: any) {
    console.error("❌ Unified Blog GET Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}