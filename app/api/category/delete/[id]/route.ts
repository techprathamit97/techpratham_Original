import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/utils/mongodb';
import { Category } from '@/models/category';

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

        return NextResponse.json({ message: 'Category deleted successfully' }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}