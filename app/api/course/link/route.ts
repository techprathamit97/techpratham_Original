import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/utils/mongodb';
import Course from '@/models/course';

export async function GET(request: NextRequest) {
    try {
        console.log('Course API: Starting request processing');
        
        await connectMongo();
        console.log('Course API: MongoDB connected successfully');

        const url = new URL(request.url);
        const link = url.searchParams.get('link');
        const bustCache = url.searchParams.get('bustCache'); // Add cache busting support
        
        console.log('Course API: Searching for course with link:', link);
        console.log('Course API: Cache busting requested:', !!bustCache);

        if (!link) {
            console.log('Course API: No link parameter provided');
            return NextResponse.json({ message: 'Link parameter is required' }, { status: 400 });
        }

        // Find the course by link (always fresh from DB, no caching here)
        const courseItem = await Course.findOne({ link });
        console.log('Course API: Course found:', !!courseItem);

        if (!courseItem) {
            console.log('Course API: Course not found for link:', link);
            return NextResponse.json({ message: 'Course not found' }, { status: 404 });
        }

        console.log('Course API: Returning course data');
        
        // Add cache control headers to prevent browser caching of course data
        const headers: Record<string, string> = bustCache ? {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        } : {};
        
        return NextResponse.json(courseItem, { 
            status: 200,
            headers 
        });
    } catch (error: any) {
        console.error('Course API Server Error:', error.message);
        console.error('Course API Stack trace:', error.stack);
        return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
    }
}