import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/utils/mongodb';
import Enrolled from '@/models/enrolled';
import { requireRole, LEAD_ACCESS_ROLES } from '@/lib/apiAuth';

export async function GET(request: NextRequest) {
    try {
    const denied = await requireRole(LEAD_ACCESS_ROLES);
    if (denied) return denied;

        await connectMongo();

        // Get all course requests
        const courseRequests = await Enrolled.find({});

        return NextResponse.json(courseRequests, { status: 200 });
    } catch (error: any) {
        console.error('Database error:', error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}