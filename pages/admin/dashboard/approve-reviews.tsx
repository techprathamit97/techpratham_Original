import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface Review {
  _id: string;
  name: string;
  email: string;
  rating: number;
  review: string;
  profileImage?: string;
  course?: string;
  designation?: string;
  company?: string;
  isApproved: boolean;
  isPublished: boolean;
  isFeatured: boolean;
  createdAt: string;
}

const ApproveReviewsPage = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/review/manage?status=pending&limit=100');
      const data = await response.json();
      if (data.success) {
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (reviewId: string, action: string) => {
    setProcessing(reviewId);
    try {
      const response = await fetch('/api/review/manage', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId, action })
      });
      const data = await response.json();
      
      if (data.success) {
        alert(`Review ${action}d successfully!`);
        fetchReviews(); // Refresh list
      } else {
        alert(`Failed to ${action} review: ${data.error}`);
      }
    } catch (error) {
      console.error(`Error ${action}ing review:`, error);
      alert(`Error ${action}ing review`);
    } finally {
      setProcessing(null);
    }
  };

  const handleApproveAndPublish = async (reviewId: string) => {
    setProcessing(reviewId);
    try {
      // First approve
      await fetch('/api/review/manage', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId, action: 'approve' })
      });

      // Then publish
      const response = await fetch('/api/review/manage', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId, action: 'publish' })
      });
      
      const data = await response.json();
      if (data.success) {
        alert('Review approved and published successfully!');
        fetchReviews();
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error processing review');
    } finally {
      setProcessing(null);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    
    setProcessing(reviewId);
    try {
      const response = await fetch(`/api/review/manage?id=${reviewId}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      
      if (data.success) {
        alert('Review deleted successfully!');
        fetchReviews();
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Error deleting review');
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-[#C6151D]'></div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>Approve Reviews</h1>
          <p className='text-gray-600'>Pending reviews waiting for approval</p>
        </div>

        {reviews.length === 0 ? (
          <div className='bg-white rounded-lg shadow p-8 text-center'>
            <p className='text-gray-600'>No pending reviews</p>
          </div>
        ) : (
          <div className='space-y-4'>
            {reviews.map((review) => (
              <div key={review._id} className='bg-white rounded-lg shadow p-6'>
                <div className='flex items-start gap-4'>
                  {review.profileImage ? (
                    <Image 
                      src={review.profileImage} 
                      alt={review.name}
                      width={64}
                      height={64}
                      className='w-16 h-16 rounded-full object-cover'
                    />
                  ) : (
                    <div className='w-16 h-16 rounded-full bg-gradient-to-br from-[#600A0E] to-[#C6151D] flex items-center justify-center text-white text-2xl font-bold'>
                      {review.name.charAt(0)}
                    </div>
                  )}

                  <div className='flex-1'>
                    <div className='flex items-start justify-between mb-2'>
                      <div>
                        <h3 className='text-lg font-bold text-gray-900'>{review.name}</h3>
                        <p className='text-sm text-gray-600'>{review.email}</p>
                        {review.designation && review.company && (
                          <p className='text-sm text-gray-600'>
                            {review.designation} at {review.company}
                          </p>
                        )}
                      </div>
                      <div className='flex items-center gap-1'>
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < review.rating ? 'text-yellow-500' : 'text-gray-300'}>
                            ★
                          </span>
                        ))}
                        <span className='ml-2 text-sm text-gray-600'>({review.rating}/5)</span>
                      </div>
                    </div>

                    {review.course && (
                      <div className='mb-2'>
                        <span className='inline-block bg-red-50 text-[#C6151D] px-3 py-1 rounded-full text-sm font-medium'>
                          📚 {review.course}
                        </span>
                      </div>
                    )}

                    <p className='text-gray-700 mb-4'>"{review.review}"</p>

                    <div className='flex items-center gap-2 text-sm text-gray-500 mb-4'>
                      <span>Submitted: {new Date(review.createdAt).toLocaleString()}</span>
                    </div>

                    <div className='flex gap-2'>
                      <Button
                        onClick={() => handleApproveAndPublish(review._id)}
                        disabled={processing === review._id}
                        className='bg-green-600 hover:bg-green-700'
                      >
                        {processing === review._id ? 'Processing...' : 'Approve & Publish'}
                      </Button>
                      
                      <Button
                        onClick={() => handleAction(review._id, 'approve')}
                        disabled={processing === review._id}
                        variant='outline'
                      >
                        Approve Only
                      </Button>

                      <Button
                        onClick={() => handleDelete(review._id)}
                        disabled={processing === review._id}
                        variant='destructive'
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApproveReviewsPage;
