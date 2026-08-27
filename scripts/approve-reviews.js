// Script to approve and publish reviews
// Run this in browser console or use Node.js

const reviewIds = [
  '69aa99e2eef315b21c55597c', // First review
  '69aa9e2ceef315b21c5562c8'  // Second review
];

async function approveAndPublishReview(reviewId) {
  try {
    // Step 1: Approve
  
    const approveResponse = await fetch('http://localhost:3000/api/review/manage', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reviewId: reviewId,
        action: 'approve'
      })
    });
    const approveData = await approveResponse.json();
  

    const publishResponse = await fetch('http://localhost:3000/api/review/manage', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reviewId: reviewId,
        action: 'publish'
      })
    });
    const publishData = await publishResponse.json();
  

    return { success: true, reviewId };
  } catch (error) {
    console.error(`Error processing review ${reviewId}:`, error);
    return { success: false, reviewId, error };
  }
}

async function processAllReviews() {

  
  for (const reviewId of reviewIds) {
    await approveAndPublishReview(reviewId);
  
  }
  

}

// Run the script
processAllReviews();
