import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/utils/mongodb';
import Enrolled from '@/models/enrolled';

export async function GET(request: NextRequest) {
    try {
        await connectMongo();

        // Get all course requests
        const courseRequests = await Enrolled.find({});

        return NextResponse.json(courseRequests, { status: 200 });
    } catch (error: any) {
        console.error('Database error:', error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}