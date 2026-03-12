'use client';

import React, { useEffect, useState } from 'react';
import TestimonialCard from '../TestimonialCard/TestimonialCard';
import { Button } from '@/components/ui/button';
import { StarFilledIcon } from '@radix-ui/react-icons';

interface Review {
  _id: string;
  name: string;
  rating: number;
  review: string;
  profileImage?: string | null;
  course?: string | null;
  designation?: string | null;
  company?: string | null;
  createdAt: string;
  isFeatured?: boolean;
}

interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  fiveStarCount: number;
  fourStarCount: number;
  threeStarCount: number;
  twoStarCount: number;
  oneStarCount: number;
}

interface TestimonialSectionProps {
  limit?: number;
  showStats?: boolean;
  showLoadMore?: boolean;
  featuredOnly?: boolean;
  minRating?: number;
}

const TestimonialSection: React.FC<TestimonialSectionProps> = ({
  limit = 6,
  showStats = true,
  showLoadMore = true,
  featuredOnly = false,
  minRating = 0
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchReviews = async (pageNum: number) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        limit: limit.toString(),
        page: pageNum.toString(),
        ...(featuredOnly && { featured: 'true' }),
        ...(minRating > 0 && { minRating: minRating.toString() })
      });

      const response = await fetch(`/api/review/fetch?${params}`);
      const data = await response.json();

      if (data.success) {
        if (pageNum === 1) {
          setReviews(data.reviews);
        } else {
          setReviews(prev => [...prev, ...data.reviews]);
        }
        setHasMore(data.pagination.page < data.pagination.pages);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/review/stats');
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchReviews(1);
    if (showStats) {
      fetchStats();
    }
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchReviews(nextPage);
  };

  const renderStarDistribution = () => {
    if (!stats) return null;

    const starData = [
      { stars: 5, count: stats.fiveStarCount },
      { stars: 4, count: stats.fourStarCount },
      { stars: 3, count: stats.threeStarCount },
      { stars: 2, count: stats.twoStarCount },
      { stars: 1, count: stats.oneStarCount }
    ];

    return (
      <div className='space-y-2'>
        {starData.map(({ stars, count }) => {
          const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
          return (
            <div key={stars} className='flex items-center gap-3'>
              <span className='text-sm font-medium text-gray-700 w-12'>{stars} star</span>
              <div className='flex-1 h-2 bg-gray-200 rounded-full overflow-hidden'>
                <div
                  className='h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-500'
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <span className='text-sm text-gray-600 w-12 text-right'>{count}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className='w-full h-auto flex flex-col items-center justify-center py-16 bg-gradient-to-b from-gray-50 to-white'>
      <div className='md:w-10/12 w-11/12 h-auto flex flex-col gap-12'>
        {/* Header */}
        <div className='text-center'>
          <h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
            What Our Students Say
          </h2>
          <p className='text-gray-600 text-lg max-w-2xl mx-auto'>
            Real experiences from real people who have transformed their careers with us
          </p>
        </div>

        {/* Stats Section */}
        {showStats && stats && (
          <div className='bg-white rounded-2xl shadow-xl p-8 border border-gray-200'>
            <div className='grid md:grid-cols-2 gap-8'>
              {/* Average Rating */}
              <div className='flex flex-col items-center justify-center text-center'>
                <div className='text-6xl font-bold text-gray-900 mb-2'>
                  {stats.averageRating.toFixed(1)}
                </div>
                <div className='flex gap-1 mb-2'>
                  {[...Array(5)].map((_, index) => (
                    <StarFilledIcon
                      key={index}
                      className={`w-6 h-6 ${
                        index < Math.round(stats.averageRating)
                          ? 'text-yellow-500'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className='text-gray-600'>
                  Based on {stats.totalReviews} review{stats.totalReviews !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Star Distribution */}
              <div>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>Rating Distribution</h3>
                {renderStarDistribution()}
              </div>
            </div>
          </div>
        )}

        {/* Reviews Grid */}
        {loading && page === 1 ? (
          <div className='flex items-center justify-center py-20'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-[#C6151D]'></div>
          </div>
        ) : reviews.length === 0 ? (
          <div className='text-center py-20'>
            <p className='text-gray-600 text-lg'>No reviews yet. Be the first to share your experience!</p>
          </div>
        ) : (
          <>
            <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {reviews.map((review) => (
                <TestimonialCard key={review._id} {...review} />
              ))}
            </div>

            {/* Load More Button */}
            {showLoadMore && hasMore && (
              <div className='text-center'>
                <Button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className='px-8 py-6 text-base font-semibold bg-gradient-to-r from-[#600A0E] to-[#C6151D] hover:from-[#700A0E] hover:to-[#D6151D]'
                >
                  {loading ? 'Loading...' : 'Load More Reviews'}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TestimonialSection;
