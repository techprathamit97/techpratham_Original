import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/utils/mongodb';
import { Category } from '@/models/category';
import { clearNavbarCache } from '@/utils/navbarData';

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
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