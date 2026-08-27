import { NextResponse } from 'next/server';
import { connectMongo } from '@/utils/mongodb';
import { Category } from '@/models/category';

export async function GET() {
    try {
        await connectMongo();

        // Fetch all main categories with their nested subcategories
        const categories = await Category.find({ 
            $or: [
                { isActive: true },
                { isActive: { $exists: false } } // Include old categories without isActive field
            ]
        })
        .sort({ position: 1 })
        .lean();



        // Ensure all categories have required fields with defaults
        const processedCategories = categories.map(cat => ({
            ...cat,
            name: cat.name || 'Unnamed Category',
            slug: cat.slug || (cat.name || 'unnamed').toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-'),
            displayInNavbar: cat.displayInNavbar !== undefined ? cat.displayInNavbar : true,
            isActive: cat.isActive !== undefined ? cat.isActive : true,
            subcategories: cat.subcategories || [] // Ensure subcategories array exists
        }));

        return NextResponse.json(processedCategories, { status: 200 });

    } catch (error: any) {
        console.error('Server Error:', error.message);
        return NextResponse.json({ 
            message: error.message,
            error: 'Failed to fetch categories' 
        }, { status: 500 });
    }
}