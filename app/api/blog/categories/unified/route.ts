import { NextResponse } from "next/server";
import { connectMongo } from "@/utils/mongodb";
import BlogCategory from "@/models/BlogCategory";
import BlogPost from "@/models/BlogPost";
import { cachedFetch } from "@/lib/sanity";
import { postsCountQuery } from "@/lib/queries";

/* ===================== GET - Fetch Unified Categories (Custom + Sanity) ===================== */
export async function GET(req: Request) {
  try {
    await connectMongo();
    const { searchParams } = new URL(req.url);
    const includePostCount = searchParams.get("includePostCount") === "true";
    const activeOnly = searchParams.get("activeOnly") !== "false"; // default true

    console.log('🔍 Unified Categories API called with:', { includePostCount, activeOnly });

    const query = activeOnly ? { isActive: true } : {};
    
    // Fetch custom categories
    const customCategories = await BlogCategory.find(query)
      .sort({ order: 1, name: 1 })
      .lean();

    console.log(`📂 Found ${customCategories.length} custom categories`);

    // Add post count for custom categories if requested
    if (includePostCount) {
      for (const category of customCategories) {
        const postCount = await BlogPost.countDocuments({ 
          categorySlug: category.slug,
          status: "published"
        });
        category.postCount = postCount;
      }
    }

    // Add Sanity blogs category
    let sanityPostCount = 0;
    if (includePostCount) {
      try {
        console.log('🔄 Fetching Sanity posts count...');
        // Use cached fetch with 10 minute cache for count
        sanityPostCount = await cachedFetch(postsCountQuery, 10);
        console.log(`📝 Found ${sanityPostCount} Sanity posts (cached)`);
      } catch (error) {
        console.error('❌ Failed to fetch Sanity posts count:', error);
      }
    }

    const sanityCategory = {
      _id: "general-blogs-category",
      name: "General Blogs",
      slug: "general-blogs",
      description: "General articles and tutorials",
      isActive: true,
      order: 999, // Put at the end
      postCount: includePostCount ? sanityPostCount : undefined,
      seo: {
        metaTitle: "General Blogs - TechPratham",
        metaDescription: "Explore our collection of general articles and tutorials"
      }
    };

    // Combine categories
    const allCategories = [...customCategories, sanityCategory];

    console.log(`📊 Returning ${allCategories.length} total categories (${customCategories.length} custom + 1 sanity)`);

    const response = NextResponse.json({ categories: allCategories });
    
    // Add cache headers for better performance
    response.headers.set('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=1200');
    
    return response;
  } catch (error: any) {
    console.error("❌ Unified Categories GET Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}