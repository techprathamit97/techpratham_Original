import { NextResponse } from "next/server";
import { connectMongo } from "@/utils/mongodb";
import BlogCategory from "@/models/BlogCategory";
import BlogPost from "@/models/BlogPost";

/* ===================== GET - Fetch Categories ===================== */
export async function GET(req: Request) {
  try {
    await connectMongo();
    const { searchParams } = new URL(req.url);
    const includePostCount = searchParams.get("includePostCount") === "true";
    const activeOnly = searchParams.get("activeOnly") !== "false"; // default true

    const query = activeOnly ? { isActive: true } : {};
    
    const categories = await BlogCategory.find(query)
      .sort({ order: 1, name: 1 })
      .lean();

    // Add post count if requested
    if (includePostCount) {
      for (const category of categories) {
        const postCount = await BlogPost.countDocuments({ 
          categorySlug: category.slug,
          status: "published"
        });
        category.postCount = postCount;
      }
    }

    return NextResponse.json({ categories });
  } catch (error: any) {
    console.error("Categories GET Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/* ===================== POST - Create Category ===================== */
export async function POST(req: Request) {
  try {
    await connectMongo();
    const body = await req.json();

    const { name, slug, description, seo, parentCategory, order } = body;

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json(
        { error: "Missing required fields: name, slug" },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingCategory = await BlogCategory.findOne({ slug });
    if (existingCategory) {
      return NextResponse.json(
        { error: "Slug already exists. Please choose a different slug." },
        { status: 400 }
      );
    }

    // Create new category
    const category = new BlogCategory({
      name,
      slug,
      description,
      seo: seo || {},
      parentCategory,
      order: order || 0
    });

    await category.save();

    return NextResponse.json({ 
      success: true, 
      category,
      message: "Category created successfully" 
    });
  } catch (error: any) {
    console.error("Categories POST Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/* ===================== PUT - Update Category ===================== */
export async function PUT(req: Request) {
  try {
    await connectMongo();
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Category ID is required" },
        { status: 400 }
      );
    }

    const category = await BlogCategory.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      category,
      message: "Category updated successfully" 
    });
  } catch (error: any) {
    console.error("Categories PUT Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/* ===================== DELETE - Delete Category ===================== */
export async function DELETE(req: Request) {
  try {
    await connectMongo();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Category ID is required" },
        { status: 400 }
      );
    }

    // Check if category has posts
    const category = await BlogCategory.findById(id);
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    const postCount = await BlogPost.countDocuments({ categorySlug: category.slug });
    if (postCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete category. It has ${postCount} blog posts. Please move or delete the posts first.` },
        { status: 400 }
      );
    }

    await BlogCategory.findByIdAndDelete(id);

    return NextResponse.json({ 
      success: true, 
      message: "Category deleted successfully" 
    });
  } catch (error: any) {
    console.error("Categories DELETE Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}