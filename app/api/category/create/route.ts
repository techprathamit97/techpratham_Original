import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/utils/mongodb';
import { Category } from '@/models/category';

export async function POST(request: NextRequest) {
    try {
        await connectMongo();

        const { name, position, slug, displayInNavbar, subcategories } = await request.json();

        

        if (!name || !slug) {
            return NextResponse.json(
                { message: "Category name and slug are both required" },
                { status: 400 }
            );
        }

        // Validate slug format
        const slugRegex = /^[a-z0-9-]+$/;
        if (!slugRegex.test(slug)) {
            return NextResponse.json(
                { message: "Slug can only contain lowercase letters, numbers, and hyphens" },
                { status: 400 }
            );
        }

        // Check if slug exists
        const existingSlug = await Category.findOne({ slug: slug });
        if (existingSlug) {
            return NextResponse.json(
                { message: "Slug already exists. Please choose a different slug." },
                { status: 400 }
            );
        }

        // Find max position if not provided
        let categoryPosition = position || 1;
        if (!position) {
            const maxPosCategory = await Category.findOne().sort({ position: -1 });
            categoryPosition = maxPosCategory ? maxPosCategory.position + 1 : 1;
        }

        // Create the category
        const category = await Category.create({
            name,
            position: categoryPosition,
            slug: slug, // Use provided slug directly
            displayInNavbar: displayInNavbar !== undefined ? displayInNavbar : true,
            subcategories: subcategories || [],
            isActive: true
        });

        return NextResponse.json(category, { status: 201 });

    } catch (error: any) {
        console.error('Error creating category:', error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}