"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { client } from "@/lib/sanity";
import { allPostsQuery } from "@/lib/queries";
import { Button } from '@/components/ui/button';

const BlogSection: React.FC = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);

        const fetchPosts = async () => {
            const data = await client.fetch(allPostsQuery);
            setPosts(data);
            setLoading(false);
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
                        <article
                            key={post._id}
                            className="w-full max-w-3xl mb-12 border-b pb-8"
                        >
                            {post.coverImage && (
                                <img
                                    src={post.coverImage}
                                    alt={post.title}
                                    className="w-full h-auto object-cover rounded-lg mb-4"
                                />
                            )}
                            <h2 className="md:text-xl text-base font-bold mb-2">{post.title}</h2>
                            <p className="text-gray-600 md:text-sm text-xs mb-4">
                                By {post.authorName} •{" "}
                                {new Date(post.publishedAt).toDateString()}
                            </p>



                            {/* Categories */}
                            {post.categories?.length > 0 && (
                                <div className="mb-4">
                                    {post.categories.map((cat: string, i: number) => (
                                        <span
                                            key={i}
                                            className="inline-block bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full mr-2"
                                        >
                                            {cat}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <Link href={`/blog/${post.slug}`}>
                                <Button variant={'default'}>
                                    Read More
                                </Button>
                            </Link>
                        </article>
                    ))
                ) : (
                    <EmptyState />
                )}
            </div>
        </div>
    );
};

export default BlogSection;