import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/utils/mongodb';
import course from '@/models/course';

export async function GET(request: NextRequest) {
    try {
        await connectMongo();

        const url = new URL(request.url);
        const pageParam = url.searchParams.get('page');
        const page = pageParam ? parseInt(pageParam) || 1 : 1;

        if (!page || page <= 0) {
            return NextResponse.json({ message: 'Valid page parameter is required' }, { status: 400 });
        }

        const limit = 20;
        const skip = (page - 1) * limit;

        const courses = await course.find().skip(skip).limit(limit);

        return NextResponse.json(courses, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}