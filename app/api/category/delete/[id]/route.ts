import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/utils/mongodb';
import { Category } from '@/models/category';
import { clearNavbarCache } from '@/utils/navbarData';
import { requireRole, LEAD_ACCESS_ROLES } from '@/lib/apiAuth';

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
    const denied = await requireRole(LEAD_ACCESS_ROLES);
    if (denied) return denied;

        await connectMongo();

        const { id } = await params;

        const deletedCategory = await Category.findByIdAndDelete(id);

        if (!deletedCategory) {
            return NextResponse.json({ message: 'Category not found' }, { status: 404 });
        }

        // Clear navbar cache since category has been deleted
        clearNavbarCache();

        return NextResponse.json({ message: 'Category deleted successfully' }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}