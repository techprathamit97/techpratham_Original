/* ============================================================================
   HOMEPAGE DATA LAYER
   ----------------------------------------------------------------------------
   Shared data-fetching functions used by BOTH the App-Router API routes
   (app/api/...) and the homepage (pages/index.tsx via getStaticProps).

   Why this exists:
     Previously pages/index.tsx fetched its own API over HTTP
     (http://127.0.0.1:3000/api/...), adding three self-network round-trips +
     middleware overhead to every render. These functions let the page call the
     database directly, and let the API routes stay thin wrappers so their
     public JSON response is byte-for-byte identical to before.

   Serialization:
     Each function returns plain JSON-serializable data (ObjectIds/Dates
     stringified) so the exact same shape flows through both the HTTP responses
     and Next.js getStaticProps props (which require serializable values).
============================================================================ */

import { connectMongo } from "@/utils/mongodb";
import course from "@/models/course";
import { Category } from "@/models/category";
import Event from "@/models/event";
import { getCachedData, setCachedData } from "@/lib/courseCache";

/** Deep-serialize a Mongo/lean result to plain JSON (drops ObjectId/Date types). */
function serialize<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

/**
 * Trending courses.
 * Mirrors GET /api/get-course/trending exactly: course.find({ trending: true }).
 */
export async function getTrendingCourses(): Promise<any[]> {
  await connectMongo();
  const courseItem = await course.find({ trending: true });
  return serialize(courseItem);
}

/**
 * Grouped courses by category.
 * Mirrors GET /api/course/fetch-grouped exactly, including the in-memory cache.
 *
 * @param bustCache  when true, skips the shared cache (same as ?bustCache=1).
 */
export async function getGroupedCourses(bustCache = false): Promise<any[]> {
  // 1) Serve from cache if valid (unless busting).
  if (!bustCache) {
    const cached = getCachedData();
    if (cached) {
      return cached;
    }
  }

  await connectMongo();
  const courses = await course
    .find(
      {},
      "_id title image alt category link shortDesc level rating duration trending priority createdAt"
    )
    .lean();

  // Sort courses by priority (lower number first), then newest first.
  const sortedCourses = courses.sort((a: any, b: any) => {
    const priorityA = a.priority || 999;
    const priorityB = b.priority || 999;

    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }

    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
  });

  // Group courses into their categories.
  const categoryMap: Record<string, any[]> = {};
  for (const c of sortedCourses) {
    if (!categoryMap[c.category]) {
      categoryMap[c.category] = [];
    }
    categoryMap[c.category].push(c);
  }

  // Fetch categories to sort groups by position.
  const categoriesData = await Category.find({}, "name position")
    .sort({ position: 1 })
    .lean();

  const categoryPositionMap: Record<string, number> = {};
  categoriesData.forEach((cat: any) => {
    categoryPositionMap[cat.name] = cat.position || 999;
  });

  const normalCategories = Object.keys(categoryMap).map((category) => ({
    name: category,
    position: categoryPositionMap[category] || 999,
    courses: categoryMap[category],
  }));

  normalCategories.sort((a, b) => a.position - b.position);

  const groupedData = serialize(normalCategories);

  // Update shared cache with the serialized data.
  setCachedData(groupedData);

  return groupedData;
}

/**
 * Events.
 * Mirrors GET /api/event exactly: sorted by order asc, then createdAt desc.
 */
export async function getEvents(): Promise<any[]> {
  await connectMongo();
  const events = await Event.find()
    .select("type videoUrl image order createdAt updatedAt")
    .sort({ order: 1, createdAt: -1 })
    .lean();

  return serialize(events);
}
