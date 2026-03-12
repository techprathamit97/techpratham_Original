import { NextRequest, NextResponse } from 'next/server';
import course from '@/models/course';
import { connectMongo } from '@/utils/mongodb';

export async function DELETE(request: NextRequest) {
    try {
        await connectMongo();

        const url = new URL(request.url);
        const link = url.searchParams.get('link');

        if (!link) {
            return NextResponse.json({ message: 'Link parameter is required' }, { status: 400 });
        }

        // Find and delete the course by link
        const deletedCourse = await course.findOneAndDelete({ link });

        if (!deletedCourse) {
            return NextResponse.json({ message: 'Course not found' }, { status: 404 });
        }

        return NextResponse.json({
            message: 'Course deleted successfully',
            deletedCourse
        }, { status: 200 });
    } catch (error: any) {
        console.error('Server Error:', error.message);
        return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
    }
}