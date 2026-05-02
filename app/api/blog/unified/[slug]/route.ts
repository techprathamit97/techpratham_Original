import { NextResponse } from "next/server";
import { connectMongo } from "@/utils/mongodb";
import BlogPost from "@/models/BlogPost";
import { client } from "@/lib/sanity";
import { singlePostQuery } from "@/lib/queries";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

/* ===================== GET - Fetch Single Blog Post (Custom or Sanity) ===================== */
export async function GET(req: Request, context: RouteParams) {
  try {
    const { slug } = await context.params;
    console.log(`🔍 Looking for blog post with slug: ${slug}`);
    console.log(`🔍 Sanity config:`, {
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
      hasProjectId: !!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      hasDataset: !!process.env.NEXT_PUBLIC_SANITY_DATASET
    });

    // First, try to find in custom blogs
    await connectMongo();
    const customPost = await BlogPost.findOne({ slug }).lean();
    console.log(`📝 Custom post found:`, !!customPost);

    if (customPost) {
      // Increment view count
      await BlogPost.findByIdAndUpdate((customPost as any)._id, { $inc: { viewCount: 1 } });
      
      const response = NextResponse.json({
        post: {
          ...customPost,
          _id: (customPost as any)._id.toString(),
          source: "custom"
        }
      });
      
      // Add cache headers for better performance
      response.headers.set('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=1200');
      
      return response;
    }

    // If not found in custom blogs, try Sanity
    try {
      console.log(`🔍 Searching for Sanity post with slug: ${slug}`);
      console.log(`🔍 Using query: ${singlePostQuery(slug)}`);
      
      const sanityPost = await client.fetch(singlePostQuery(slug));
      console.log(`📝 Sanity post result:`, sanityPost ? 'Found' : 'Not found');
      
      if (sanityPost) {
        console.log(`📝 Sanity post details:`, {
          id: sanityPost._id,
          title: sanityPost.title,
          slug: sanityPost.slug
        });
        // Handle body content for individual post
        let bodyContent = "";
        let excerpt = "No excerpt available";
        
        if (sanityPost.body) {
          if (typeof sanityPost.body === 'string') {
            bodyContent = sanityPost.body;
            excerpt = sanityPost.body.substring(0, 200) + "...";
          } else if (Array.isArray(sanityPost.body)) {
            // Handle portable text blocks
            const textBlocks = sanityPost.body
              .filter((block: any) => block._type === 'block' && block.children)
              .map((block: any) => 
                block.children
                  .filter((child: any) => child._type === 'span')
                  .map((child: any) => child.text)
                  .join('')
              )
              .join('\n\n');
            bodyContent = textBlocks;
            excerpt = textBlocks.substring(0, 200) + "...";
          }
        }

        // Transform Sanity post to match our interface
        const transformedPost = {
          _id: sanityPost._id,
          slug: sanityPost.slug,
          title: sanityPost.title,
          excerpt,
          author: sanityPost.authorName || "TechPratham Team",
          category: "General Blogs",
          categorySlug: "general-blogs",
          tags: sanityPost.categories || [],
          featuredImage: {
            url: sanityPost.coverImage || "/default-blog-image.jpg",
            alt: sanityPost.title,
            caption: ""
          },
          publishedAt: sanityPost.publishedAt,
          lastModified: sanityPost.publishedAt,
          status: "published",
          viewCount: 0,
          readingTime: Math.max(1, Math.ceil(bodyContent.length / 200)), // Rough reading time
          source: "sanity",
          // For Sanity posts, preserve the original PortableText structure
          sanityBody: sanityPost.body, // Keep original PortableText structure
          seo: {
            metaTitle: sanityPost.title,
            metaDescription: excerpt,
            focusKeyword: "",
            canonicalUrl: "",
            ogTitle: sanityPost.title,
            ogDescription: excerpt,
            ogImage: sanityPost.coverImage,
            robotsDirective: "index,follow",
            schemaType: "Article"
          }
        };

        const response = NextResponse.json({ post: transformedPost });
        
        // Add cache headers for better performance
        response.headers.set('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=1200');
        
        return response;
      } else {
        // If exact match not found, try to find similar slugs for debugging
        console.log(`🔍 Exact match not found, searching for similar slugs...`);
        const similarSlugs = await client.fetch(`*[_type == "post" && slug.current match "${slug}*"] {
          "slug": slug.current,
          title
        }`);
        console.log(`📝 Similar slugs found:`, similarSlugs);
        
        // Also try without the exact match to see all posts
        const allSlugs = await client.fetch(`*[_type == "post"][0...10] {
          "slug": slug.current,
          title
        }`);
        console.log(`📝 First 10 post slugs:`, allSlugs);
      }
    } catch (sanityError) {
      console.error("❌ Failed to fetch from Sanity:", sanityError);
    }

    // Post not found in either system
    return NextResponse.json({ error: "Blog post not found" }, { status: 404 });

  } catch (error: any) {
    console.error("Unified Blog Detail GET Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}