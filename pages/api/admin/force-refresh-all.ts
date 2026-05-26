import { NextRequest, NextResponse } from 'next/server';
import { clearNavbarCache } from '@/utils/navbarData';
import { clearFetchGroupedCache } from '@/app/api/course/fetch-grouped/route';

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Force refreshing all course caches...');
    
    // Clear all caches
    clearNavbarCache();
    clearFetchGroupedCache();
    
    // Force refresh by making requests with cache busting
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';
    
    // Force refresh fetch-grouped with cache busting
    const fetchGroupedResponse = await fetch(`${baseUrl}/api/course/fetch-grouped?bustCache=true`, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    });
    
    // Force refresh regular course fetch
    const fetchResponse = await fetch(`${baseUrl}/api/course/fetch?bustCache=true`, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    });
    
    console.log('✅ All caches cleared and refreshed');
    console.log('Fetch-grouped status:', fetchGroupedResponse.status);
    console.log('Fetch status:', fetchResponse.status);
    
    return NextResponse.json({
      success: true,
      message: 'All course caches force refreshed successfully',
      details: {
        fetchGroupedStatus: fetchGroupedResponse.status,
        fetchStatus: fetchResponse.status,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error: any) {
    console.error('❌ Error force refreshing caches:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST method to force refresh all caches',
    instructions: 'This endpoint clears all course-related caches and forces fresh data from database'
  });
}