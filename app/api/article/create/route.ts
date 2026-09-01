import { NextRequest, NextResponse } from 'next/server';
import { Article } from '@/models/article.js';
import { connectMongo } from '@/utils/mongodb';
import { requireRole, LEAD_ACCESS_ROLES } from '@/lib/apiAuth';

export async function POST(request: NextRequest) {
    try {
    const denied = await requireRole(LEAD_ACCESS_ROLES);
    if (denied) return denied;

        await connectMongo();

        const body = await request.json();
        const response = await Article.create(body);

        return NextResponse.json(response, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}