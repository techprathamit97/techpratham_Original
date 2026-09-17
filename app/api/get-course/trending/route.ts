import { NextRequest, NextResponse } from 'next/server';
import { getTrendingCourses } from '@/lib/homeData';

export async function GET(request: NextRequest) {
    try {
        const courseItem = await getTrendingCourses();

        return NextResponse.json(courseItem, { status: 200 });
    } catch (error: any) {
        console.error('Server Error:', error.message);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
