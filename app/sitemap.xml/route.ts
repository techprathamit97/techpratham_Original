import { NextResponse } from "next/server";
import { connectMongo } from "@/utils/mongodb";
import course from "@/models/course";

const siteUrl = "https://www.techpratham.com";

/** 🧩 Helper: Escape XML special characters (&, <, >, ", ') */
function escapeXml(unsafe: any) {
  if (!unsafe) return "";
  return unsafe
    .toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** 🟢 1. Fetch all course URLs directly from MongoDB */
async function getCourseUrls() {
  try {
    await connectMongo();
    const courses = await course.find({}, { _id: 0, link: 1 }).lean();

    return courses.map((c) => ({
      loc: `${siteUrl}/courses/${c.link}`,
      lastmod: new Date().toISOString(),
      priority: "0.70",
    }));
  } catch (error) {
    console.error("❌ Course fetch error:", error);
    return [];
  }
}

/** 🟢 2. Fetch blog URLs from Sanity CMS */
async function getBlogUrls() {
  try {
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
    const query = encodeURIComponent(`*[_type == "post"]{slug, _updatedAt}`);
    const url = `https://${projectId}.api.sanity.io/v2021-10-21/data/query/${dataset}?query=${query}`;

    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error("Failed to fetch blogs from Sanity");

    const { result } = await res.json();
    if (!Array.isArray(result)) return [];

    return result
      .filter((post) => post?.slug?.current)
      .map((post) => ({
        loc: `${siteUrl}/blog/${post.slug.current}`,
        lastmod: post._updatedAt || new Date().toISOString(),
        priority: "0.75",
      }));
  } catch (error) {
    console.error("❌ Sanity fetch error:", error);
    return [];
  }
}

/** 🟢 3. Static Pages */
const staticPages = [
  { loc: `${siteUrl}/`, priority: "1.00" },
  { loc: `${siteUrl}/corporate-training`, priority: "0.80" },
  { loc: `${siteUrl}/about-us`, priority: "0.80" },
  { loc: `${siteUrl}/job-openings`, priority: "0.80" },
  { loc: `${siteUrl}/reviews`, priority: "0.80" },
  { loc: `${siteUrl}/blog`, priority: "0.80" },
  { loc: `${siteUrl}/payment`, priority: "0.80" },
  { loc: `${siteUrl}/contact-us`, priority: "0.80" },
  { loc: `${siteUrl}/auth/login`, priority: "0.80" },
  { loc: `${siteUrl}/training-certificate`, priority: "0.80" },
  { loc: `${siteUrl}/courses`, priority: "0.80" },
  { loc: `${siteUrl}/privacy-policy`, priority: "0.80" },
  { loc: `${siteUrl}/terms-and-conditions`, priority: "0.80" },
  { loc: `${siteUrl}/refund-cancellation-policy`, priority: "0.80" },
  { loc: `${siteUrl}/admission`, priority: "0.80" },
  { loc: `${siteUrl}/faqs`, priority: "0.80" },
  { loc: `${siteUrl}/auth/register`, priority: "0.80" },
].map((page) => ({
  ...page,
  lastmod: new Date().toISOString(),
}));

/** 🟢 4. Generate and return the sitemap XML */
export async function GET() {
  const [courses, blogs] = await Promise.all([getCourseUrls(), getBlogUrls()]);
  const allUrls = [...staticPages, ...courses, ...blogs];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset 
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
  xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 
                      http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  ${allUrls
    .map(
      (url) => `
  <url>
    <loc>${escapeXml(url.loc)}</loc>
    <lastmod>${escapeXml(url.lastmod)}</lastmod>
    <priority>${escapeXml(url.priority)}</priority>
  </url>`
    )
    .join("")}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate",
    },
  });
}
