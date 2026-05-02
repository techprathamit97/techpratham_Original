import { NextResponse } from "next/server";
import { connectMongo } from "@/utils/mongodb";
import BlogPost from "@/models/BlogPost";
import BlogCategory from "@/models/BlogCategory";

/* ===================== GET - Fetch Blog Posts ===================== */
export async function GET(req: Request) {
  try {
    await connectMongo();
    const { searchParams } = new URL(req.url);
    
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status") || "published";
    const category = searchParams.get("category");
    const tag = searchParams.get("tag");
    const author = searchParams.get("author");
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy") || "publishedAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Build query
    const query: any = {};
    
    if (status !== "all") {
      query.status = status;
    }
    
    if (category) {
      query.categorySlug = category;
    }
    
    if (tag) {
      query.tags = { $in: [tag] };
    }
    
    if (author) {
      query.author = author;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
        { "seo.metaDescription": { $regex: search, $options: "i" } }
      ];
    }

    // Calculate skip
    const skip = (page - 1) * limit;

    // Build sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Fetch posts
    const posts = await BlogPost.find(query)
      .select("slug title excerpt author category categorySlug tags featuredImage publishedAt status viewCount readingTime seo.metaTitle seo.metaDescription")
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const total = await BlogPost.countDocuments(query);

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error: any) {
    console.error("Blog GET Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/* ===================== POST - Create Blog Post ===================== */
export async function POST(req: Request) {
  try {
    await connectMongo();
    const body = await req.json();

    const {
      title,
      slug,
      excerpt,
      author,
      category,
      categorySlug,
      tags,
      featuredImage,
      status,
      scheduledAt,
      puckData,
      seo,
      tableOfContents,
      faqSection,
      wordCount
    } = body;

    // Validate required fields
    if (!title || !slug || !excerpt || !category || !featuredImage?.url || !featuredImage?.alt) {
      return NextResponse.json(
        { error: "Missing required fields: title, slug, excerpt, category, featuredImage with url and alt" },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingPost = await BlogPost.findOne({ slug });
    if (existingPost) {
      return NextResponse.json(
        { error: "Slug already exists. Please choose a different slug." },
        { status: 400 }
      );
    }

    // Create new blog post
    const blogPost = new BlogPost({
      title,
      slug,
      excerpt,
      author: author || "TechPratham Team",
      category,
      categorySlug: categorySlug || category.toLowerCase().replace(/\s+/g, '-'),
      tags: tags || [],
      featuredImage,
      status: status || "draft",
      scheduledAt,
      puckData: puckData || { root: {}, content: [] },
      seo: seo || {},
      tableOfContents,
      faqSection: faqSection || [],
      wordCount: wordCount || 0
    });

    await blogPost.save();

    return NextResponse.json({ 
      success: true, 
      post: blogPost,
      message: "Blog post created successfully" 
    });
  } catch (error: any) {
    console.error("Blog POST Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/* ===================== PUT - Bulk Operations ===================== */
export async function PUT(req: Request) {
  try {
    await connectMongo();
    const body = await req.json();
    const { action, postIds, data } = body;

    if (!action || !postIds || !Array.isArray(postIds)) {
      return NextResponse.json(
        { error: "Missing required fields: action, postIds" },
        { status: 400 }
      );
    }

    let result;

    switch (action) {
      case "publish":
        result = await BlogPost.updateMany(
          { _id: { $in: postIds } },
          { status: "published", publishedAt: new Date() }
        );
        break;
      
      case "unpublish":
        result = await BlogPost.updateMany(
          { _id: { $in: postIds } },
          { status: "draft" }
        );
        break;
      
      case "archive":
        result = await BlogPost.updateMany(
          { _id: { $in: postIds } },
          { status: "archived" }
        );
        break;
      
      case "delete":
        result = await BlogPost.deleteMany({ _id: { $in: postIds } });
        break;
      
      case "changeCategory":
        if (!data?.category || !data?.categorySlug) {
          return NextResponse.json(
            { error: "Category and categorySlug required for changeCategory action" },
            { status: 400 }
          );
        }
        result = await BlogPost.updateMany(
          { _id: { $in: postIds } },
          { category: data.category, categorySlug: data.categorySlug }
        );
        break;
      
      default:
        return NextResponse.json(
          { error: "Invalid action. Supported: publish, unpublish, archive, delete, changeCategory" },
          { status: 400 }
        );
    }

    return NextResponse.json({ 
      success: true, 
      result,
      message: `Bulk ${action} completed successfully` 
    });
  } catch (error: any) {
    console.error("Blog PUT Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}