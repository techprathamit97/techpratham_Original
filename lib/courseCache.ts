/* ===============================
   COURSE FETCH-GROUPED CACHE UTILITY
================================ */

let cachedData: any[] | null = null;
let lastFetchTime = 0;

// Cache TTL → 30 seconds (reduced for admin updates)
export const CACHE_TTL = 30 * 1000;

// Function to clear the fetch-grouped cache
export function clearFetchGroupedCache(): void {
  cachedData = null;
  lastFetchTime = 0;
  console.log('🗑️ Fetch-grouped cache cleared');
}

// Get cached data if valid
export function getCachedData(): any[] | null {
  const now = Date.now();
  if (cachedData && now - lastFetchTime < CACHE_TTL) {
    return cachedData;
  }
  return null;
}

// Set cached data
export function setCachedData(data: any[]): void {
  cachedData = data;
  lastFetchTime = Date.now();
}

// Get cache status
export function getCacheStatus() {
  return { cachedData, lastFetchTime, CACHE_TTL };
}
