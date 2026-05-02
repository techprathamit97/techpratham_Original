import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/models/user';
import { connectMongo } from '@/utils/mongodb';

export async function GET(request: NextRequest) {
    try {
        await connectMongo();

        // Get all users (limit to 10 for safety)
        const users = await User.find({}).limit(10).select('email name role createdAt');
        
        const userCount = await User.countDocuments();

        return NextResponse.json({
            success: true,
            totalUsers: userCount,
            users: users,
            message: `Found ${userCount} users in database`
        }, { status: 200 });
    } catch (error: any) {
        console.error('Debug users error:', error);
        return NextResponse.json({ 
            success: false,
            message: error.message 
        }, { status: 500 });
    }
}