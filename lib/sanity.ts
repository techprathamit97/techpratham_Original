import { createClient } from 'next-sanity';
import imageUrlBuilder from "@sanity/image-url";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "blogs",
  apiVersion: "2025-09-12",
  useCdn: true,
  // Add request timeout and retry configuration
  timeout: 10000, // 10 second timeout
  maxRetries: 2,
  retryDelay: (attemptNumber) => attemptNumber * 1000, // Progressive delay: 1s, 2s, 3s...
});

// Simple in-memory cache for Sanity queries
const queryCache = new Map<string, { data: any; timestamp: number; ttl: number }>();

export async function cachedFetch(query: string, ttlMinutes: number = 5) {
  const cacheKey = query;
  const now = Date.now();
  
  // Check if we have cached data that's still valid
  const cached = queryCache.get(cacheKey);
  if (cached && (now - cached.timestamp) < (cached.ttl * 60 * 1000)) {
    console.log('🎯 Using cached Sanity data');
    return cached.data;
  }
  
  try {
    console.log('🔄 Fetching fresh Sanity data');
    const data = await client.fetch(query);
    
    // Cache the result
    queryCache.set(cacheKey, {
      data,
      timestamp: now,
      ttl: ttlMinutes
    });
    
    return data;
  } catch (error) {
    // If we have stale cached data, return it on error
    if (cached) {
      console.log('⚠️ Using stale cached data due to error');
      return cached.data;
    }
    throw error;
  }
}

const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}