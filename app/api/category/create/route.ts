import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/utils/mongodb';
import { Category } from '@/models/category';

export async function POST(request: NextRequest) {
    try {
        await connectMongo();

        const { name, description, position } = await request.json();

        console.log("CREATE BODY:", { name, description, position });

        if (!name || !description || position === undefined) {
            return NextResponse.json(
                { message: "name, description and position required" },
                { status: 400 }
            );
        }

        const response = await Category.create({
            name,
            description,
            position
        });

        return NextResponse.json(response, { status: 201 });

    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
