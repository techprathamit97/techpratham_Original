import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/utils/mongodb';
import course from '@/models/course';

export async function GET(request: NextRequest) {
    try {
        console.log('Test Course API: Starting...');
        
        await connectMongo();
        console.log('Test Course API: MongoDB connected');

        const url = new URL(request.url);
        const testLink = url.searchParams.get('link');
        
        if (testLink) {
            // Test specific course
            console.log('Testing specific course link:', testLink);
            const courseItem = await course.findOne({ link: testLink });
            
            return NextResponse.json({
                success: true,
                testLink,
                found: !!courseItem,
                course: courseItem ? {
                    _id: courseItem._id,
                    title: courseItem.title,
                    link: courseItem.link,
                    category: courseItem.category
                } : null
            });
        } else {
            // List all courses for testing
            console.log('Listing all courses...');
            const courses = await course.find({}, { title: 1, link: 1, category: 1 }).limit(10);
            
            return NextResponse.json({
                success: true,
                totalCourses: courses.length,
                sampleCourses: courses,
                testInstructions: 'Add ?link=COURSE_LINK to test a specific course'
            });
        }
        
    } catch (error: any) {
        console.error('Test Course API Error:', error);
        return NextResponse.json({
            success: false,
            error: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}