import { NextResponse } from "next/server";
import { client } from "@/lib/sanity";

export async function GET() {
  try {
    // Get all posts with their slugs
    const allPosts = await client.fetch(`*[_type == "post"] | order(publishedAt desc) {
      _id,
      title,
      "slug": slug.current,
      publishedAt
    }`);
    
    // Search for the specific slug
    const targetSlug = "upgrade-legacy-erp-to-dynamics-365-business-central";
    const specificPost = allPosts.find((post: any) => post.slug === targetSlug);
    
    // Search for similar slugs
    const similarPosts = allPosts.filter((post: any) => 
      post.slug.includes("upgrade") || 
      post.slug.includes("dynamics") || 
      post.slug.includes("business-central")
    );
    
    return NextResponse.json({
      totalPosts: allPosts.length,
      targetSlug,
      specificPostFound: !!specificPost,
      specificPost,
      similarPosts,
      allSlugs: allPosts.map((p: any) => p.slug).slice(0, 20) // First 20 slugs
    });
  } catch (error: any) {
    console.error("Debug Sanity Error:", error);
    return NextResponse.json({ 
      error: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
}