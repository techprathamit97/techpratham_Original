/**
 * Test script for unified blog system
 * Run with: node scripts/test-unified-blogs.js
 */

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

async function testUnifiedBlogs() {
  console.log('🧪 Testing Unified Blog System...\n');

  try {
    // Test 1: Unified Posts API
    console.log('1️⃣ Testing unified posts API...');
    const postsResponse = await fetch(`${baseUrl}/api/blog/unified?limit=5`);
    const postsData = await postsResponse.json();
    
    if (postsData.posts) {
      console.log(`✅ Found ${postsData.posts.length} posts`);
      const customPosts = postsData.posts.filter(p => p.source === 'custom').length;
      const sanityPosts = postsData.posts.filter(p => p.source === 'sanity').length;
      console.log(`   - Custom posts: ${customPosts}`);
      console.log(`   - Sanity posts: ${sanityPosts}`);
    } else {
      console.log('❌ No posts found');
    }

    // Test 2: Unified Categories API
    console.log('\n2️⃣ Testing unified categories API...');
    const categoriesResponse = await fetch(`${baseUrl}/api/blog/categories/unified?includePostCount=true`);
    const categoriesData = await categoriesResponse.json();
    
    if (categoriesData.categories) {
      console.log(`✅ Found ${categoriesData.categories.length} categories`);
      const sanityCategory = categoriesData.categories.find(c => c.slug === 'sanity-blogs');
      if (sanityCategory) {
        console.log(`   - Sanity Blogs category: ${sanityCategory.postCount} posts`);
      }
    } else {
      console.log('❌ No categories found');
    }

    // Test 3: Sanity-specific filtering
    console.log('\n3️⃣ Testing Sanity category filtering...');
    const sanityResponse = await fetch(`${baseUrl}/api/blog/unified?category=sanity-blogs`);
    const sanityData = await sanityResponse.json();
    
    if (sanityData.posts) {
      console.log(`✅ Found ${sanityData.posts.length} Sanity posts`);
      const allSanity = sanityData.posts.every(p => p.source === 'sanity');
      console.log(`   - All posts are from Sanity: ${allSanity ? '✅' : '❌'}`);
    } else {
      console.log('❌ No Sanity posts found');
    }

    // Test 4: Individual post fetching
    if (postsData.posts && postsData.posts.length > 0) {
      console.log('\n4️⃣ Testing individual post fetching...');
      const testPost = postsData.posts[0];
      const postResponse = await fetch(`${baseUrl}/api/blog/unified/${testPost.slug}`);
      const postData = await postResponse.json();
      
      if (postData.post) {
        console.log(`✅ Successfully fetched post: "${postData.post.title}"`);
        console.log(`   - Source: ${postData.post.source}`);
        console.log(`   - Category: ${postData.post.category}`);
      } else {
        console.log('❌ Failed to fetch individual post');
      }
    }

    console.log('\n🎉 Unified blog system test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n💡 Make sure your development server is running on', baseUrl);
  }
}

// Run the test
testUnifiedBlogs();