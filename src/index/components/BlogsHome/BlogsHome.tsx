"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
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

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        
        // 12 second timeout - give Sanity more time
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('API timeout')), 12000)
        );

        const fetchPromise = fetch('/api/blog/home-posts', {
          cache: 'force-cache',
          next: { revalidate: 600 }
        });
        
        const response = await Promise.race([fetchPromise, timeoutPromise]) as Response;
        
        if (!response.ok) {
          throw new Error(`API failed with status ${response.status}`);
        }
        
        const data = await response.json();
        console.log("📝 Blog API Response:", data); // Debug log
        
        // Set posts if we got valid data (check for posts array)
        if (data.posts && Array.isArray(data.posts) && data.posts.length > 0) {
          console.log("✅ Setting posts:", data.posts.length);
          setPosts(data.posts);
        } else {
          console.warn("⚠️ No posts received from API", data);
          setPosts([]);
        }
      } catch (error) {
        console.error("❌ Error fetching posts:", error);
        // Set empty array on error - component will show fallback message
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const LoadingSkeleton = () => (
    <div className="w-full h-64 rounded-xl border-2 border-gray-700 flex flex-col items-start justify-end p-4 bg-gray-900/50">
      <Skeleton className='w-3/4 h-6 mb-2 bg-gray-700' />
      <Skeleton className='w-full h-4 bg-gray-700' />
    </div>
  );

  return (
    <div className='w-full h-auto flex flex-col items-center justify-center py-3 gap-10 bg-black text-white'>
      
      <div className='md:w-10/12 w-11/12 h-auto flex flex-col items-center text-center'>
        <div className="md:text-3xl text-2xl md:font-semibold font-medium capitalize">
          Read Our <span className='bg-gradient-to-tr from-[#FC7A35] to-[#f8da52] text-transparent bg-clip-text'>Latest Blogs</span>
        </div>
      </div>

      {/* ---------------- MOBILE SWIPER (with arrows) ---------------- */}
      <div className="w-full md:hidden px-4 relative">
        {!loading && posts?.length > 0 && (
          <>
            {/* LEFT ARROW */}
            <div className="swiper-button-prev-mobile absolute left-1 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full">
              ❮
            </div>

            {/* RIGHT ARROW */}
            <div className="swiper-button-next-mobile absolute right-1 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full">
              ❯
            </div>
          </>
        )}

        {loading ? (
          <LoadingSkeleton />
        ) : posts?.length > 0 ? (
          <Swiper
            modules={[Pagination, Navigation, Autoplay]}
            pagination={{ clickable: true }}
            navigation={{
              nextEl: ".swiper-button-next-mobile",
              prevEl: ".swiper-button-prev-mobile",
            }}
             autoplay={{
    delay: 1500,
    disableOnInteraction: false,
  }}
            spaceBetween={20}
            slidesPerView={1}
          >
            {posts.map((post) => (
              <SwiperSlide key={post._id}>
                <Link href={`/blog/general-blogs/${post.slug}`}>
                  <div
                    className="w-full h-[220px] rounded-xl flex flex-col items-start justify-end boxShadow p-4 cursor-pointer hover:opacity-20 transition"
                    style={post.coverImage ? {
                      backgroundImage: `url(${post.coverImage})`,
                      backgroundSize: 'contain',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat'
                    } : {}}
                  ></div>
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

      {/* ---------------- DESKTOP GRID (unchanged) ---------------- */}
      <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-8 gap-4 md:w-10/12 w-11/12 justify-items-center text-white">
        {loading ? (
          <>
            <LoadingSkeleton />
            <LoadingSkeleton />
            <LoadingSkeleton />
          </>
        ) : posts?.length > 0 ? (
          posts.map((post) => (
            <Link key={post._id} href={`/blog/general-blogs/${post.slug}`} className="w-[300px] h-[140px]">
              <div
                className="w-full h-full rounded-xl border-2 border-red-600 flex flex-col items-start justify-end boxShadow p-4 cursor-pointer hover:opacity-90 transition"
                style={post.coverImage ? {
                  backgroundImage: `url(${post.coverImage})`,
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                } : {}}
              ></div>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-400 py-8">
            No blogs available at the moment
          </div>
        )}
      </div>

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