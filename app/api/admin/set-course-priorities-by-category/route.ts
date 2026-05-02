import { NextResponse } from 'next/server';
import { connectMongo } from '@/utils/mongodb';
import Course from '@/models/course';
import { Category } from '@/models/category';

// Set course priorities based on their category priority
export async function POST() {
  try {
    await connectMongo();

    // Get all categories with their priorities
    const categories = await Category.find({}, 'name priority position').sort({ priority: -1, position: 1 });

    if (categories.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No categories found'
      });
    }

    const updates = [];

    // Process each category
    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];
      
      // Calculate base priority for this category
      // Higher category priority = higher course priority
      const basePriority = category.priority || (categories.length - i) * 10;

      // Get courses in this category
      const courses = await Course.find({ category: category.name }, '_id title');

      // Set priority for each course in this category
      for (const course of courses) {
        updates.push({
          updateOne: {
            filter: { _id: course._id },
            update: { priority: basePriority }
          }
        });
      }
    }

    if (updates.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No courses found to update'
      });
    }

    // Execute bulk update
    const result = await Course.bulkWrite(updates);

    return NextResponse.json({
      success: true,
      message: 'Course priorities updated based on category priorities',
      categoriesProcessed: categories.length,
      coursesUpdated: result.modifiedCount,
      categoryPriorities: categories.map(cat => ({
        name: cat.name,
        priority: cat.priority || 0,
        position: cat.position
      }))
    });

  } catch (error: any) {
    console.error('SET PRIORITIES ERROR:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to set course priorities' },
      { status: 500 }
    );
  }
}

// Get current priority distribution
export async function GET() {
  try {
    await connectMongo();

    // Get categories with their priorities
    const categories = await Category.find({}, 'name priority position').sort({ priority: -1, position: 1 });

    const priorityDistribution = [];

    for (const category of categories) {
      const courses = await Course.find(
        { category: category.name },
        'title priority'
      ).sort({ priority: -1 });

      priorityDistribution.push({
        categoryName: category.name,
        categoryPriority: category.priority || 0,
        categoryPosition: category.position,
        courseCount: courses.length,
        courses: courses.map(course => ({
          title: course.title,
          priority: course.priority || 0
        }))
      });
    }

    return NextResponse.json({
      success: true,
      priorityDistribution
    });

  } catch (error: any) {
    console.error('GET PRIORITIES ERROR:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get priority distribution' },
      { status: 500 }
    );
  }
}