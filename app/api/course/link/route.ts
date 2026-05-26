import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/utils/mongodb';
import course from '@/models/course';

export async function GET(request: NextRequest) {
    try {
        console.log('Course API: Starting request processing');
        
        await connectMongo();
        console.log('Course API: MongoDB connected successfully');

        const url = new URL(request.url);
        const link = url.searchParams.get('link');
        
        console.log('Course API: Searching for course with link:', link);

        if (!link) {
            console.log('Course API: No link parameter provided');
            return NextResponse.json({ message: 'Link parameter is required' }, { status: 400 });
        }

        // Find the course by link
        const courseItem = await course.findOne({ link });
        console.log('Course API: Course found:', !!courseItem);

        if (!courseItem) {
            console.log('Course API: Course not found for link:', link);
            return NextResponse.json({ message: 'Course not found' }, { status: 404 });
        }

        console.log('Course API: Returning course data');
        return NextResponse.json(courseItem, { status: 200 });
    } catch (error: any) {
        console.error('Course API Server Error:', error.message);
        console.error('Course API Stack trace:', error.stack);
        return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
    }
}