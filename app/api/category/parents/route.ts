import { NextResponse } from 'next/server';
import { connectMongo } from '@/utils/mongodb';
import { Category } from '@/models/category';

export async function GET() {
    try {
        await connectMongo();

        // Get categories that can be parents (level 0 and 1 only)
        const parentCategories = await Category.find({
            $and: [
                {
                    $or: [
                        { isActive: true },
                        { isActive: { $exists: false } }
                    ]
                },
                {
                    $or: [
                        { level: { $in: [0, 1] } },
                        { level: { $exists: false } }
                    ]
                }
            ]
        })
        .sort({ level: 1, position: 1 })
        .select('_id title name level parentId')
        .lean();

        // Ensure all categories have default level if missing
        const processedCategories = parentCategories.map(cat => ({
            ...cat,
            level: cat.level !== undefined ? cat.level : 0
        }));

        return NextResponse.json(processedCategories, { status: 200 });

    } catch (error: any) {
        console.error('Server Error:', error.message);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}