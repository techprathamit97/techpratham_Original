import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/utils/mongodb';
import Course from '@/models/course';

export async function GET(request: NextRequest) {
  try {
    await connectMongo();

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.trim().length < 2) {
      return NextResponse.json([]);
    }

    const searchTerm = query.trim();
    const escapedQuery = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Search courses by title with relevance scoring
    const courses = await Course.find(
      {
        title: { $regex: escapedQuery, $options: 'i' }
      },
      {
        title: 1,
        link: 1,
        _id: 0
      }
    )
      .lean()
      .maxTimeMS(2000);

    // Sort by relevance: exact match > starts with > contains
    const sortedCourses = courses.sort((a, b) => {
      const aTitle = a.title.toLowerCase();
      const bTitle = b.title.toLowerCase();
      const searchLower = searchTerm.toLowerCase();

      // Exact match gets highest priority
      if (aTitle === searchLower) return -1;
      if (bTitle === searchLower) return 1;

      // Starts with search term gets second priority
      const aStartsWith = aTitle.startsWith(searchLower);
      const bStartsWith = bTitle.startsWith(searchLower);
      if (aStartsWith && !bStartsWith) return -1;
      if (!aStartsWith && bStartsWith) return 1;

      // Word boundary match (search term at start of a word)
      const aWordStart = new RegExp(`\\b${escapedQuery}`, 'i').test(aTitle);
      const bWordStart = new RegExp(`\\b${escapedQuery}`, 'i').test(bTitle);
      if (aWordStart && !bWordStart) return -1;
      if (!aWordStart && bWordStart) return 1;

      // Position of match (earlier is better)
      const aIndex = aTitle.indexOf(searchLower);
      const bIndex = bTitle.indexOf(searchLower);
      if (aIndex !== bIndex) return aIndex - bIndex;

      // Shorter titles are more relevant
      return aTitle.length - bTitle.length;
    });

    // Return top 5 results
    return NextResponse.json(sortedCourses.slice(0, 5));
  } catch (error) {
    console.error('Course search error:', error);
    return NextResponse.json(
      { error: 'Failed to search courses' },
      { status: 500 }
    );
  }
}

// Add runtime config for faster response
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
