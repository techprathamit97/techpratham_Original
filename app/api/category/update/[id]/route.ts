import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/utils/mongodb';
import { Category } from '@/models/category';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectMongo();

        const { id } = await params;
        const { name, description, position } = await request.json();

        const updateData: any = {};

        if (name !== undefined) updateData.name = name;
        if (description !== undefined) updateData.description = description;
        if (position !== undefined) updateData.position = position;

        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedCategory) {
            return NextResponse.json({ message: 'Category not found' }, { status: 404 });
        }

        return NextResponse.json(updatedCategory, { status: 200 });

    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
