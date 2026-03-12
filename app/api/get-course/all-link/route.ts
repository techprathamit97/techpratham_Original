import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/utils/mongodb';
import course from '@/models/course';

export async function GET() {
    try {
        // Connect to MongoDB
        await connectMongo();

        // Fetch all courses
        // You can add .select('link') if you only need the 'link' field
        const courses = await course.find({}, { _id: 0, link: 1 }).lean();

        // Return the list of courses
        return NextResponse.json(courses, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
