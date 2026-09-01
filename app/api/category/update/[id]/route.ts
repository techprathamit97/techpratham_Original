import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/utils/mongodb';
import { Category } from '@/models/category';
import { clearNavbarCache } from '@/utils/navbarData';
import { requireRole, LEAD_ACCESS_ROLES } from '@/lib/apiAuth';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
    const denied = await requireRole(LEAD_ACCESS_ROLES);
    if (denied) return denied;

        await connectMongo();

        const { id } = await params;
        const { name, position, slug, displayInNavbar, subcategories } = await request.json();

        // Get current category to validate changes
        const currentCategory = await Category.findById(id);
        if (!currentCategory) {
            return NextResponse.json({ message: 'Category not found' }, { status: 404 });
        }

        const updateData: any = {};

        if (name !== undefined) updateData.name = name;
        if (position !== undefined) updateData.position = position;
        if (displayInNavbar !== undefined) updateData.displayInNavbar = displayInNavbar;
        if (subcategories !== undefined) updateData.subcategories = subcategories;

        // Handle slug updates
        if (slug !== undefined) {
            // Validate slug format
            const slugRegex = /^[a-z0-9-]+$/;
            if (!slugRegex.test(slug)) {
                return NextResponse.json(
                    { message: "Slug can only contain lowercase letters, numbers, and hyphens" },
                    { status: 400 }
                );
            }

            // Check if slug exists (excluding current category)
            const existingSlug = await Category.findOne({ slug: slug, _id: { $ne: id } });
            if (existingSlug) {
                return NextResponse.json(
                    { message: "Slug already exists. Please choose a different slug." },
                    { status: 400 }
                );
            }

            updateData.slug = slug;
        }

        // Update the category
        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        // Clear navbar cache since category has been updated
        clearNavbarCache();

        return NextResponse.json(updatedCategory, { status: 200 });

    } catch (error: any) {
        console.error('Error updating category:', error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
