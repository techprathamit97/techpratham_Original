/**
 * Test Sanity connection and data
 * Run with: node scripts/test-sanity-connection.js
 */

const { createClient } = require('next-sanity');

// Create Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "blogs",
  apiVersion: "2025-09-12",
  useCdn: true,
});

const allPostsQuery = `
  *[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    "authorName": author->name,
    publishedAt,
    "coverImage": mainImage.asset->url,
    "categories": categories[]->title,
    body
  }
`;

async function testSanityConnection() {
  console.log('🧪 Testing Sanity Connection...\n');
  
  console.log('Environment Variables:');
  console.log('- NEXT_PUBLIC_SANITY_PROJECT_ID:', process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);
  console.log('- NEXT_PUBLIC_SANITY_DATASET:', process.env.NEXT_PUBLIC_SANITY_DATASET || "blogs");
  console.log('');

  try {
    console.log('📡 Fetching posts from Sanity...');
    const posts = await client.fetch(allPostsQuery);
    
    console.log(`✅ Successfully fetched ${posts.length} posts from Sanity`);
    
    if (posts.length > 0) {
      console.log('\n📝 Sample post:');
      const samplePost = posts[0];
      console.log('- Title:', samplePost.title);
      console.log('- Slug:', samplePost.slug);
      console.log('- Author:', samplePost.authorName);
      console.log('- Published:', samplePost.publishedAt);
      console.log('- Categories:', samplePost.categories);
      console.log('- Has Cover Image:', !!samplePost.coverImage);
      console.log('- Body Length:', samplePost.body ? samplePost.body.length : 0);
    } else {
      console.log('⚠️  No posts found in Sanity. Please check:');
      console.log('1. Posts exist in your Sanity studio');
      console.log('2. Posts have _type == "post"');
      console.log('3. Posts are published');
    }

  } catch (error) {
    console.error('❌ Sanity connection failed:', error.message);
    console.log('\n💡 Troubleshooting steps:');
    console.log('1. Check your .env.local file has correct Sanity credentials');
    console.log('2. Verify your Sanity project is accessible');
    console.log('3. Ensure your dataset name is correct');
  }
}

testSanityConnection();