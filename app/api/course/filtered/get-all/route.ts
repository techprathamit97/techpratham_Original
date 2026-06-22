import { NextResponse } from 'next/server';
import { connectMongo } from '@/utils/mongodb';
import course from '@/models/course';

export async function GET(request: Request) {
    try {
        await connectMongo();

        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');

        if (!category) {
            return NextResponse.json(
                { message: 'Category parameter is required' },
                { status: 400 }
            );
        }

        console.log('🔍 Searching for courses with category:', category);

        // Try exact match first
        let courseItems = await course
            .find({ category: category })
            .sort({ createdAt: -1 });

        // If no exact match, try case-insensitive match
        if (courseItems.length === 0) {
            console.log('❌ No exact match found, trying case-insensitive search...');
            courseItems = await course
                .find({ category: { $regex: new RegExp(`^${category}$`, 'i') } })
                .sort({ createdAt: -1 });
        }

        // If still no match, try partial match
        if (courseItems.length === 0) {
            console.log('❌ No case-insensitive match found, trying partial match...');
            courseItems = await course
                .find({ category: { $regex: new RegExp(category, 'i') } })
                .sort({ createdAt: -1 });
        }

        console.log('📊 Found courses:', courseItems.length);

        if (courseItems.length === 0) {
            // Get all unique categories for debugging
            const allCategories = await course.distinct('category');
            console.log('📝 All available categories:', allCategories);
            
            return NextResponse.json(
                { 
                    message: 'No courses found for this category',
                    searchedCategory: category,
                    availableCategories: allCategories
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            category: category,
            count: courseItems.length,
            courses: courseItems
        }, { status: 200 });

    } catch (error: any) {
        console.error('Server Error:', error.message);
        return NextResponse.json(
            { message: error.message },
            { status: 500 }
        );
    }
}