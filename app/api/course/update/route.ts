import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/utils/mongodb';
import course from '@/models/course';

export async function PUT(request: NextRequest) {
    try {
        await connectMongo();

        const url = new URL(request.url);
        const link = url.searchParams.get('link');

     if (!link) {
            return NextResponse.json({ message: 'Link parameter is required' }, { status: 400 });
        }
        

        const body = await request.json();

        const updatedUser = await course.findOneAndUpdate(
            { link },
            { $set: body },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(updatedUser, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
