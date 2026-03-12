import { NextResponse } from 'next/server';
import { connectMongo } from '@/utils/mongodb';
import course from '@/models/course';

export async function GET(request: Request) {
    try {
        await connectMongo();

        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');

        if (!category) {
            return NextResponse.json(
                { message: 'Category parameter is required' },
                { status: 400 }
            );
        }

        const courseItems = await course
            .find({ category: category })
            .limit(3)
            .sort({ createdAt: -1 });

        if (courseItems.length === 0) {
            return NextResponse.json(
                { message: 'No courses found for this category' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            category: category,
            count: courseItems.length,
            courses: courseItems
        }, { status: 200 });

    } catch (error: any) {
        console.error('Server Error:', error.message);
        return NextResponse.json(
            { message: error.message },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        await connectMongo();

        const { category, excludeId } = await request.json();

        if (!category) {
            return NextResponse.json(
                { message: 'Category is required' },
                { status: 400 }
            );
        }

        const query: any = { category: category };
        if (excludeId) {
            query._id = { $ne: excludeId };
        }

        const courseItems = await course
            .find(query)
            .limit(3)
            .sort({ createdAt: -1 });

        return NextResponse.json({
            category: category,
            count: courseItems.length,
            courses: courseItems
        }, { status: 200 });

    } catch (error: any) {
        console.error('Server Error:', error.message);
        return NextResponse.json(
            { message: error.message },
            { status: 500 }
        );
    }
}