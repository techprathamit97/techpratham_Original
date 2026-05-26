import { NextResponse } from 'next/server';
import { clearNavbarCache } from '@/utils/navbarData';
import { clearFetchGroupedCache } from '@/app/api/course/fetch-grouped/route';

// Simple cache clearing endpoint
export async function POST() {
  try {
    // Clear both navbar and fetch-grouped caches directly
    clearNavbarCache();
    clearFetchGroupedCache();
    
    console.log('✅ All course caches cleared successfully');
    
    return NextResponse.json({
      success: true,
      message: 'All course caches cleared and refreshed successfully'
    });
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