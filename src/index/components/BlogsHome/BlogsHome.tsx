"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const BlogsHome = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (date: string | Date) => {
    if (!date) return 'Recently published';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/blog/home-posts?t=${Date.now()}`, {
          cache: 'no-store'
        });

        if (!response.ok) throw new Error(`API failed with status ${response.status}`);

        const data = await response.json();
        console.log("📝 Blog API Response:", data);

        if (data.posts && Array.isArray(data.posts) && data.posts.length > 0) {
          console.log("✅ Setting posts:", data.posts.length);
          setPosts(data.posts);
        } else {
          console.warn("⚠️ No posts received from API", data);
          setPosts([]);
        }
      } catch (error) {
        console.error("❌ Error fetching posts:", error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const LoadingSkeleton = () => (
    <div className="w-full h-96 rounded-2xl border-2 border-gray-700 flex flex-col items-start justify-end p-4 bg-gray-900/50">
      <Skeleton className='w-3/4 h-6 mb-2 bg-gray-700' />
      <Skeleton className='w-full h-4 bg-gray-700' />
    </div>
  );

  return (
    <div className='w-full h-auto flex flex-col items-center justify-center py-3 gap-10 bg-black text-white'>

      {/* Heading */}
      <div className='md:w-10/12 w-11/12 h-auto flex flex-col items-center text-center'>
        <div className="md:text-3xl text-2xl md:font-semibold font-medium capitalize">
          Read Our{' '}
          <span className='bg-gradient-to-tr from-[#FC7A35] to-[#f8da52] text-transparent bg-clip-text'>
            Latest Blogs
          </span>
        </div>
      </div>

      {/* Swiper Section — shared for both mobile and desktop */}
      <div className="w-full px-10 relative">

        {/* Custom Nav Arrows */}
        <style>{`
          .blogs-swiper .swiper-button-prev,
          .blogs-swiper .swiper-button-next {
            width: 38px;
            height: 38px;
            border-radius: 50%;
            background: rgba(255,255,255,0.15);
            backdrop-filter: blur(6px);
            color: white;
            transition: background 0.2s;
            top: 50%;
            transform: translateY(-50%);
          }
          .blogs-swiper .swiper-button-prev:hover,
          .blogs-swiper .swiper-button-next:hover {
            background: rgba(255,255,255,0.35);
          }
          .blogs-swiper .swiper-button-prev::after,
          .blogs-swiper .swiper-button-next::after {
            font-size: 14px;
            font-weight: bold;
          }
          .blogs-swiper .swiper-pagination-bullet {
            background: rgba(255,255,255,0.5);
          }
          .blogs-swiper .swiper-pagination-bullet-active {
            background: #FC7A35;
          }
        `}</style>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <LoadingSkeleton />
            <LoadingSkeleton />
            <LoadingSkeleton />
            <LoadingSkeleton />
          </div>
        ) : posts?.length > 0 ? (
          <Swiper
            className="blogs-swiper"
            modules={[Pagination, Navigation, Autoplay]}
            navigation={true}
            pagination={{ clickable: true }}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            spaceBetween={20}
            loop={true}
            breakpoints={{
              0: {
                slidesPerView: 1,
              },
              640: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 4,
              },
            }}
            style={{ paddingBottom: '40px' }}
          >
            {posts.map((post) => (
              <SwiperSlide key={post._id}>
                <Link href={`/blog/general-blogs/${post.slug}`} className="w-full group block">
                  <div className="relative h-96 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group">
                    {post.coverImage ? (
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover "
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-800" />
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                    {/* Content Overlay */}
                    <div className="absolute inset-0 flex flex-col p-3">

                      {/* Category Badge */}
                      <div className="flex justify-end">
                        <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30">
                          {post.category || 'Blog'}
                        </Badge>
                      </div>

                      {/* Bottom Content */}
                      <div className="mt-auto">
                        <h3 className="text-xl font-bold text-white mb-1 leading-tight group-hover:text-blue-200 transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-gray-200 text-xs mb-1 line-clamp-2 leading-relaxed">
                          {post.excerpt}
                        </p>
                        <p className="text-yellow-400 text-xs">
                          {formatDate(post.publishedAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="text-center text-gray-400 py-8">
            No blogs available at the moment
          </div>
        )}
      </div>

      {/* View All Button */}
      <div>
        <Link href="/blog">
          <Button variant='manual' className='rounded-full text-lg font-light px-6'>
            View All Blogs
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default BlogsHome;