import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/utils/mongodb';
import Course from '@/models/course';

export async function GET(request: NextRequest) {
    try {
      
        
        await connectMongo();
   

        const url = new URL(request.url);
        const link = url.searchParams.get('link');
        const bustCache = url.searchParams.get('bustCache'); // Add cache busting support
        
     

        if (!link) {
           
            return NextResponse.json({ message: 'Link parameter is required' }, { status: 400 });
        }

        // Find the course by link (always fresh from DB, no caching here)
        const courseItem = await Course.findOne({ link });
     

        if (!courseItem) {
          
            return NextResponse.json({ message: 'Course not found' }, { status: 404 });
        }

      
        
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