"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

const BlogSection: React.FC = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);

        const fetchPosts = async () => {
            try {
                // Use API route with cache-busting
                const timeoutPromise = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('API timeout')), 5000)
                );

                const fetchPromise = fetch(`/api/blog/home-posts?t=${Date.now()}`, {
                    cache: 'no-store'
                });
                
                const response = await Promise.race([fetchPromise, timeoutPromise]) as Response;
                
                if (!response.ok) {
                    throw new Error(`API failed with status ${response.status}`);
                }
                
                const data = await response.json();
                setPosts(data.posts || []);
            } catch (error) {
                console.error("Error fetching posts:", error);
                setPosts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    const LoadingSkeleton = () => (
        <div className="w-full min-h-44 bg-white p-4 rounded cardShadow">
            <Skeleton className='w-40 h-6 rounded shadow-none px-4 mb-4' />
            <Skeleton className='w-64 h-7 rounded shadow-none px-4 mb-2' />
            <Skeleton className='w-28 h-5 rounded shadow-none px-4 mb-4' />
            <Separator className='h-[0.5px] w-full' />
            <Skeleton className='w-full h-44 rounded shadow-none px-4 my-4' />
            <Skeleton className='w-48 h-7 rounded shadow-none px-4 mt-10 mb-2' />
            <div className='w-full h-auto flex flex-row justify-between'>
                <div className='flex flex-row gap-3'>
                    <Skeleton className='w-9 h-9 rounded-full' />
                    <Skeleton className='w-9 h-9 rounded-full' />
                    <Skeleton className='w-9 h-9 rounded-full' />
                </div>
                <Skeleton className='w-28 h-8' />
            </div>
        </div>
    );

    const EmptyState = () => (
        <div className="w-full min-h-32 bg-white p-6 rounded cardShadow flex flex-col items-center justify-center">
            <p className="text-gray-500 text-lg mb-2">No articles available</p>
            <p className="text-gray-400 text-sm">Check back later for new content</p>
        </div>
    );

    return (
        <div className='md:w-10/12 w-11/12 flex flex-col items-start justify-start gap-1 py-10'>
            <div className='w-full grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-6'>
                {loading ? (
                    <>
                        <LoadingSkeleton />
                        <LoadingSkeleton />
                        <LoadingSkeleton />
                    </>
                ) : posts?.length > 0 ? (
                    posts.map((post) => (
                        <Link
                            key={post._id}
                            href={`/blog/general-blogs/${post.slug}`}
                            className="block group"
                        >
                            {/* Special design for Sanity blogs (like screenshot) */}
                            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                                {/* Featured Image */}
                                <div className="relative overflow-hidden rounded-t-2xl">
                                    {post.coverImage && (
                                        <img
                                            src={post.coverImage}
                                            alt={post.title}
                                            className="w-full h-auto object-contain"
                                        />
                                    )}
                                </div>
                                
                                {/* Content Below Image */}
                                <div className="p-6 bg-white">
                                    {/* Title (repeated for better readability) */}
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
                                        {post.title}
                                    </h3>
                                    
                                    {/* Author and Date */}
                                    <p className="text-gray-600 text-sm mb-4">
                                        By {post.authorName} • {new Date(post.publishedAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                    
                                    {/* Read More Button */}
                                    <div className="flex justify-start">
                                        <div className="bg-black text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                                            Read More
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <EmptyState />
                )}
            </div>
        </div>
    );
};

export default BlogSection;