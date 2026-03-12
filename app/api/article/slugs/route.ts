import { NextResponse, NextRequest } from 'next/server';
import { Article } from '@/models/article.js';
import { connectMongo } from '@/utils/mongodb';

export async function GET(request: NextRequest) {
    try {
        await connectMongo();

        const url = new URL(request.url);
        const slug = url.searchParams.get('slug');

        if (!slug) {
            return NextResponse.json({ message: 'url parameter is required' }, { status: 400 });
        }

        // Find the user by email
        const update = await Article.findOne({ slug });

        if (!update) {
            return NextResponse.json({ message: 'Internship not found' }, { status: 404 });
        }

        return NextResponse.json(update, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}


export const dynamic = "force-dynamic";