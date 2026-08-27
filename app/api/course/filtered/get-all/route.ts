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

        

        // Try exact match first
        let courseItems = await course
            .find({ category: category })
            .sort({ createdAt: -1 });

        // If no exact match, try case-insensitive match
        if (courseItems.length === 0) {
            
            courseItems = await course
                .find({ category: { $regex: new RegExp(`^${category}$`, 'i') } })
                .sort({ createdAt: -1 });
        }

        // If still no match, try partial match
        if (courseItems.length === 0) {
           
            courseItems = await course
                .find({ category: { $regex: new RegExp(category, 'i') } })
                .sort({ createdAt: -1 });
        }

      

        if (courseItems.length === 0) {
            // Get all unique categories for debugging
            const allCategories = await course.distinct('category');
          
            
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