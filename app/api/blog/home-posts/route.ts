import { NextResponse } from "next/server";
import { client } from "@/lib/sanity";

// Enable ISR with revalidation
export const revalidate = 600; // Revalidate every 10 minutes
export const dynamic = 'force-static';

/* ===================== GET - Fetch Home Page Blog Posts ===================== */
export async function GET() {
  try {
    // Fetch only 3 posts for homepage - faster loading
    // Simplified query for better performance
    const query = `*[_type == "post"] | order(publishedAt desc)[0...3] {
      _id,
      title,
      "slug": slug.current,
      "coverImage": mainImage.asset->url
    }`;

    // Fetch with 10 second timeout (increased from 5)
    const posts = await Promise.race([
      client.fetch(query, {}, { 
        cache: 'force-cache',
        next: { revalidate: 600 }
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Sanity timeout')), 10000)
      )
    ]);

    const response = NextResponse.json({ 
      posts: posts || [],
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
      success: false,
      error: error.message 
    });
    
    // Cache errors for 1 minute only
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');
    
    return response;
  }
}