import { NextResponse } from 'next/server';

// Force refresh navbar cache by calling the fetch-grouped API with cache busting
export async function POST() {
  try {
    // Get the base URL
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    
    // Call the fetch-grouped API with cache busting parameter
    const response = await fetch(`${baseUrl}/api/course/fetch-grouped?bustCache=true`, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
      },
    });

    if (response.ok) {
      const data = await response.json();
      
      return NextResponse.json({
        success: true,
        message: 'Navbar cache refreshed successfully',
        courseCount: data.reduce((total: number, category: any) => total + category.courses.length, 0),
        categories: data.map((cat: any) => ({
          name: cat.name,
          courseCount: cat.courses.length,
          firstThreeCourses: cat.courses.slice(0, 3).map((course: any) => ({
            title: course.title,
            priority: course.priority || 999
          }))
        }))
      });
    } else {
      throw new Error('Failed to refresh cache');
    }
  } catch (error: any) {
    console.error('REFRESH CACHE ERROR:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to refresh cache' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST method to refresh navbar cache',
    instructions: 'This endpoint forces a refresh of the course cache used in the navbar dropdown'
  });
}