import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/utils/mongodb';
import Enrolled from '@/models/enrolled';

export async function GET(request: NextRequest) {
    try {
        await connectMongo();

        // Get email from query parameters
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');

        if (!email) {
            return NextResponse.json({ message: 'Email parameter is required' }, { status: 400 });
        }

        // Find all enrollments for the user
        const userEnrollments = await Enrolled.find({ email: email });

        return NextResponse.json(userEnrollments, { status: 200 });
    } catch (error: any) {
        console.error('Database error:', error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}