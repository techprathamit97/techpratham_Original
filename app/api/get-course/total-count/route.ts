import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/utils/mongodb';
import course from '@/models/course';

export async function GET() {
    try {
        await connectMongo();

        const totalCourses = await course.countDocuments();

        return NextResponse.json({ count: totalCourses }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}