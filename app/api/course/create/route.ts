import { NextRequest, NextResponse } from 'next/server';
import Course from '@/models/course';
import { connectMongo } from '@/utils/mongodb';
import { clearNavbarCache } from '@/utils/navbarData';
import { clearFetchGroupedCache } from '@/lib/courseCache';

export async function POST(request: NextRequest) {
    try {
        await connectMongo();

        const body = await request.json();
        
        const courseItems = Array.isArray(body) 
            ? await Course.insertMany(body)
            : await Course.create(body);

        // Clear navbar cache since courses have been modified
        clearNavbarCache();
        
        // Clear fetch-grouped cache since courses have been modified
        clearFetchGroupedCache();
            
        return NextResponse.json(courseItems, { status: 201 });
    } catch (error: any) {
        console.error('Database error:', error);
        if (error.errors) {
            const fieldErrors = Object.entries(error.errors).map(([field, err]: any) => ({
                field,
                message: err.message || err.toString()
            }));
            console.error('Field validation errors:', fieldErrors);
            return NextResponse.json({ 
                message: error.message,
                fieldErrors: fieldErrors 
            }, { status: 500 });
        }
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

