import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/utils/mongodb';
import course from '@/models/course';

export async function GET(request: NextRequest) {
    try {
        await connectMongo();

        const url = new URL(request.url);
        const link = url.searchParams.get('link');

        if (!link) {
            return NextResponse.json({ message: 'Link parameter is required' }, { status: 400 });
        }

        // Find the course by link
        const courseItem = await course.findOne({ link });

        if (!courseItem) {
            return NextResponse.json({ message: 'Course not found' }, { status: 404 });
        }

        return NextResponse.json(courseItem, { status: 200 });
    } catch (error: any) {
        console.error('Server Error:', error.message);
        return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
    }
}