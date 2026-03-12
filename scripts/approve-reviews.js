// Script to approve and publish reviews
// Run this in browser console or use Node.js

const reviewIds = [
  '69aa99e2eef315b21c55597c', // First review
  '69aa9e2ceef315b21c5562c8'  // Second review
];

async function approveAndPublishReview(reviewId) {
  try {
    // Step 1: Approve
    console.log(`Approving review: ${reviewId}`);
    const approveResponse = await fetch('http://localhost:3000/api/review/manage', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reviewId: reviewId,
        action: 'approve'
      })
    });
    const approveData = await approveResponse.json();
    console.log('Approve result:', approveData);

    // Step 2: Publish
    console.log(`Publishing review: ${reviewId}`);
    const publishResponse = await fetch('http://localhost:3000/api/review/manage', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reviewId: reviewId,
        action: 'publish'
      })
    });
    const publishData = await publishResponse.json();
    console.log('Publish result:', publishData);

    return { success: true, reviewId };
  } catch (error) {
    console.error(`Error processing review ${reviewId}:`, error);
    return { success: false, reviewId, error };
  }
}

async function processAllReviews() {
  console.log('Starting to approve and publish all reviews...');
  
  for (const reviewId of reviewIds) {
    await approveAndPublishReview(reviewId);
    console.log('---');
  }
  
  console.log('All reviews processed!');
  console.log('Refresh the homepage to see the reviews.');
}

// Run the script
processAllReviews();
