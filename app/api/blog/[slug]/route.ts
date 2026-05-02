import { NextResponse } from "next/server";
import { connectMongo } from "@/utils/mongodb";
import BlogPost from "@/models/BlogPost";

/* ===================== GET - Fetch Single Blog Post ===================== */
export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await connectMongo();
    const { slug } = await params;
    const { searchParams } = new URL(req.url);
    const incrementView = searchParams.get("incrementView") === "true";
    const includeUnpublished = searchParams.get("includeUnpublished") === "true";

    // Build query - only show published posts for public viewing unless specifically requested
    const query: any = {
      $or: [
        { slug },
        { oldSlugs: slug }
      ]
    };

    if (!includeUnpublished) {
      query.status = "published";
    }

    // Find post by slug or old slugs
    const post = await BlogPost.findOne(query).lean() as any;

    if (!post) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    // If found by old slug, return redirect info
    if (post.slug !== slug) {
      return NextResponse.json({
        redirect: true,
        newSlug: post.slug,
        status: 301
      });
    }

    // Increment view count if requested
    if (incrementView) {
      await BlogPost.findByIdAndUpdate(post._id, { $inc: { viewCount: 1 } });
      post.viewCount = (post.viewCount || 0) + 1;
    }

    return NextResponse.json({ post });
  } catch (error: any) {
    console.error("Blog GET Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/* ===================== PUT - Update Blog Post ===================== */
export async function PUT(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await connectMongo();
    const { slug } = await params;
    const body = await req.json();

    const existingPost = await BlogPost.findOne({ slug });
    if (!existingPost) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    // Handle slug change
    if (body.slug && body.slug !== slug) {
      // Check if new slug already exists
      const slugExists = await BlogPost.findOne({ slug: body.slug });
      if (slugExists) {
        return NextResponse.json(
          { error: "New slug already exists. Please choose a different slug." },
          { status: 400 }
        );
      }

      // Add old slug to oldSlugs array
      if (!existingPost.oldSlugs.includes(slug)) {
        existingPost.oldSlugs.push(slug);
      }
    }

    // Update fields
    Object.keys(body).forEach(key => {
      if (key !== '_id' && key !== 'createdAt' && key !== 'updatedAt') {
        existingPost[key] = body[key];
      }
    });

    // Update lastModified
    existingPost.lastModified = new Date();

    await existingPost.save();

    return NextResponse.json({ 
      success: true, 
      post: existingPost,
      message: "Blog post updated successfully",
      slugChanged: body.slug && body.slug !== slug
    });
  } catch (error: any) {
    console.error("Blog PUT Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/* ===================== DELETE - Delete Blog Post ===================== */
export async function DELETE(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await connectMongo();
    const { slug } = await params;

    const deletedPost = await BlogPost.findOneAndDelete({ slug });
    if (!deletedPost) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Blog post deleted successfully" 
    });
  } catch (error: any) {
    console.error("Blog DELETE Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}