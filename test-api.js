// Simple test script to check fetch-grouped API
async function testAPI() {
  try {
    console.log('🧪 Testing fetch-grouped API...');
    
    // Clear cache first
    const clearRes = await fetch('http://localhost:3000/api/admin/clear-course-cache');
    console.log('Cache clear result:', await clearRes.json());
    
    // Fetch grouped courses
    const res = await fetch('http://localhost:3000/api/course/fetch-grouped');
    const data = await res.json();
    
    console.log('📊 API Response Summary:');
    console.log('   - Total categories:', data.length);
    
    data.forEach((category, index) => {
      console.log(`   ${index + 1}. ${category.name}: ${category.courses.length} courses`);
      
      if (category.name === 'Training Courses') {
        console.log('      🎯 Training Courses details:');
        category.courses.forEach((course, idx) => {
          console.log(`         ${idx + 1}. ${course.title?.substring(0, 40) || 'No title'}... (trending: ${course.trending})`);
        });
      }
    });
    
    // Count total trending courses across all categories
    let totalTrending = 0;
    data.forEach(category => {
      category.courses.forEach(course => {
        if (course.trending === true) {
          totalTrending++;
        }
      });
    });
    
    console.log(`📈 Total trending courses found across all categories: ${totalTrending}`);
    
  } catch (error) {
    console.error('❌ API Test Error:', error);
  }
}

testAPI();