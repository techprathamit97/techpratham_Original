import { NextResponse } from 'next/server';
// Simple cache clearing endpoint
export async function POST() {
  try {
    // This will force the fetch-grouped API to refresh its cache
    // by making a request to it, which will update the cache with fresh data
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/course/fetch-grouped`, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
      },
    });

    if (response.ok) {
      return NextResponse.json({
        success: true,
        message: 'Course cache cleared and refreshed successfully'
      });
    } else {
      throw new Error('Failed to refresh cache');
    }
  } catch (error: any) {
    console.error('CACHE CLEAR ERROR:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to clear cache' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST method to clear course cache'
  });
}