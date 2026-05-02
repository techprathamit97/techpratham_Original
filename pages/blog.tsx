import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { IndexController } from '@/src/index/controller/IndexController';
import { withNavbarSSR } from '@/utils/withNavbarSSR';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface BlogPost {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  category: string;
  categorySlug: string;
  tags: string[];
  status?: string;
  source?: 'custom' | 'sanity';
  featuredImage: {
    url: string;
    alt: string;
  };
  publishedAt: string;
  readingTime: number;
  viewCount: number;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  postCount: number;
}

interface BlogsPageProps {
  navbarData: any;
  posts: BlogPost[];
  categories: Category[];
  totalPosts: number;
  currentPage: number;
  totalPages: number;
}

export default function BlogsPage({ 
  navbarData, 
  posts, 
  categories, 
  totalPosts, 
  currentPage, 
  totalPages 
}: BlogsPageProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPosts, setFilteredPosts] = useState(posts);

  const handlePageChange = (page: number) => {
    router.push(`/blog?page=${page}`, undefined, { shallow: false });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredPosts(posts);
      return;
    }

    const filtered = posts.filter(post => 
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(query.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
    setFilteredPosts(filtered);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <IndexController navbarData={navbarData}>
      <Head>
        <title>Blog - TechPratham | Latest Tech Insights & Tutorials</title>
        <meta name="description" content="Explore our comprehensive blog covering the latest in technology, programming tutorials, industry insights, and professional development tips." />
        <meta name="keywords" content="tech blog, programming tutorials, technology insights, software development, IT training" />
        <link rel="canonical" href="https://www.techpratham.com/blog" />
        
        <meta property="og:title" content="Blog - TechPratham | Latest Tech Insights & Tutorials" />
        <meta property="og:description" content="Explore our comprehensive blog covering the latest in technology, programming tutorials, industry insights, and professional development tips." />
        <meta property="og:url" content="https://www.techpratham.com/blog" />
        <meta property="og:type" content="website" />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Blog",
              "name": "TechPratham Blog",
              "description": "Latest tech insights, tutorials, and industry news",
              "url": "https://www.techpratham.com/blog",
              "publisher": {
                "@type": "Organization",
                "name": "TechPratham",
                "url": "https://www.techpratham.com"
              }
            })
          }}
        />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <div className="bg-red-700 border-b">
          <div className="container mx-auto px-4 py-12">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                TechPratham Blog
              </h1>
              <p className="text-xl text-white mb-8">
                Stay updated with the latest technology trends, tutorials, and industry insights
              </p>
              
              {/* Search Bar */}
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 pr-4 py-3 w-full"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex gap-3">
            {/* Categories Sidebar */}
            <div className="hidden lg:block w-64 flex-shrink-0">
              <div className="bg-white rounded-lg p-3 shadow-sm border sticky top-24">
                <h2 className="text-lg font-semibold mb-4 text-gray-900">Categories</h2>
                <div className="space-y-1">
                  <Link
                    href="/blogs"
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors border-l-4 border-blue-500 bg-blue-50"
                  >
                    <span className="font-medium text-blue-700">All Posts</span>
                    <Badge variant="secondary">{totalPosts}</Badge>
                  </Link>
                  
                  {categories.map((category) => (
                    <Link
                      key={category._id}
                      href={`/blog/${category.slug}`}
                      className="flex items-center justify-between p-1 rounded-lg hover:bg-gray-50 transition-colors border-l-4 border-transparent hover:border-gray-300"
                    >
                      <span className="text-gray-700">{category.name}</span>
                      <Badge variant="outline">{category.postCount}</Badge>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Mobile Categories */}
              <div className="lg:hidden mb-6">
                <div className="bg-white rounded-lg p-4 shadow-sm border">
                  <h2 className="text-lg font-semibold mb-3">Categories</h2>
                  <div className="flex flex-wrap gap-2">
                    <Link href="/blog">
                      <Badge className="bg-blue-500 hover:bg-blue-600">
                        All Posts ({totalPosts})
                      </Badge>
                    </Link>
                    {categories.map((category) => (
                      <Link key={category._id} href={`/blog/${category.slug}`}>
                        <Badge variant="outline" className="hover:bg-gray-100">
                          {category.name} ({category.postCount})
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Results Info */}
              <div className="mb-6">
                <p className="text-gray-600">
                  {searchQuery ? (
                    <>Showing {filteredPosts.length} results for "{searchQuery}"</>
                  ) : (
                    <>Showing all {totalPosts} articles</>
                  )}
                </p>
              </div>

              {/* Blog Posts Grid */}
              {filteredPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredPosts.map((post) => (
                    <Link
                      key={post._id}
                      href={`/blog/${post.categorySlug}/${post.slug}`}
                      className="block group"
                    >
                      {post.source === 'sanity' ? (
                        // Special design for Sanity blogs (like screenshot)
                        <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                          {/* Featured Image */}
                          <div className="relative overflow-hidden rounded-t-2xl">
                            <Image
                              src={post.featuredImage.url}
                              alt={post.featuredImage.alt}
                              width={400}
                              height={240}
                              className="w-full h-auto object-contain"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                          </div>
                          
                          {/* Content Below Image */}
                          <div className="p-6 bg-white">
                            {/* Title (repeated for better readability) */}
                            <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
                              {post.title}
                            </h3>
                            
                            {/* Author and Date */}
                            <p className="text-gray-600 text-sm mb-4">
                              By {post.author} • {formatDate(post.publishedAt)}
                            </p>
                            
                            {/* Read More Button */}
                            <div className="flex justify-start">
                              <div className="bg-black text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                                Read More
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        // Original design for custom blogs
                        <div className="relative h-96 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                          <Image
                            src={post.featuredImage.url}
                            alt={post.featuredImage.alt}
                            fill
                            className="object-fill group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 73vw"
                          />
                          
                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                          
                          {/* Content Overlay */}
                          <div className="absolute inset-0 flex flex-col justify-between p-6">
                            {/* Category Badge at Top */}
                            <div className="flex justify-start">
                              {/* <Badge className="bg-white backdrop-blur-sm text-black border-white/30 hover:bg-white/30">
                                {post.category}
                              </Badge> */}
                            </div>
                            
                            {/* Title and Description at Bottom */}
                            <div>
                              <h3 className="text-xl md:text-2xl font-bold text-white mb-1 leading-tight group-hover:text-blue-200 transition-colors">
                                {post.title}
                              </h3>
                              
                              <p className="text-gray-200 text-sm mb-1 line-clamp-2 leading-relaxed">
                                {post.excerpt}
                              </p>
                              
                              <p className="text-gray-300 text-xs">
                                {formatDate(post.publishedAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-500 mb-4">
                    <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No articles found</h3>
                    <p>Try adjusting your search terms or browse all categories.</p>
                  </div>
                  {searchQuery && (
                    <Button
                      variant="outline"
                      onClick={() => handleSearch('')}
                      className="mt-4"
                    >
                      Clear Search
                    </Button>
                  )}
                </div>
              )}

              {/* Pagination */}
              {!searchQuery && totalPages > 1 && (
                <div className="flex justify-center mt-12">
                  <div className="flex gap-2">
                    {currentPage > 1 && (
                      <Button 
                        variant="outline" 
                        onClick={() => handlePageChange(currentPage - 1)}
                      >
                        Previous
                      </Button>
                    )}
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </Button>
                      );
                    })}
                    
                    {currentPage < totalPages && (
                      <Button 
                        variant="outline" 
                        onClick={() => handlePageChange(currentPage + 1)}
                      >
                        Next
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </IndexController>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  try {
    const page = parseInt(query.page as string) || 1;
    const limit = 12;
    
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    
    // Add cache headers and timeout to API requests
    const cacheHeaders = {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
    };
    
    const fetchOptions = {
      headers: cacheHeaders,
      timeout: 10000 // 10 second timeout
    };
    
    // Fetch all data in parallel for better performance
    const [postsResponse, categoriesResponse, navbarResult] = await Promise.all([
      Promise.race([
        fetch(`${baseUrl}/api/blog/unified?status=published&page=${page}&limit=${limit}`, fetchOptions),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Posts API timeout')), 10000))
      ]) as Promise<Response>,
      Promise.race([
        fetch(`${baseUrl}/api/blog/categories/unified?includePostCount=true`, fetchOptions),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Categories API timeout')), 10000))
      ]) as Promise<Response>,
      (async () => {
        const navbarSSRFunction = withNavbarSSR<{ navbarData: any }>();
        return await navbarSSRFunction({ 
          params: {}, 
          query, 
          req: {} as any, 
          res: {} as any, 
          resolvedUrl: '' 
        });
      })()
    ]);
    
    if (!postsResponse.ok) {
      throw new Error(`Posts API failed with status ${postsResponse.status}`);
    }
    
    if (!categoriesResponse.ok) {
      throw new Error(`Categories API failed with status ${categoriesResponse.status}`);
    }
    
    const [postsData, categoriesData] = await Promise.all([
      postsResponse.json(),
      categoriesResponse.json()
    ]);
    
    let navbarData: any = {};
    if ('props' in navbarResult) {
      navbarData = (navbarResult as { props: { navbarData: any } }).props.navbarData;
    }

    return {
      props: {
        navbarData: navbarData || {}, // Pass full navbar data without limiting
        posts: postsData.posts || [],
        categories: categoriesData.categories || [],
        totalPosts: postsData.pagination?.total || 0,
        currentPage: page,
        totalPages: postsData.pagination?.pages || 1
      }
    };
  } catch (error) {
    console.error('Error in blogs getServerSideProps:', error);
    return {
      props: {
        navbarData: {},
        posts: [],
        categories: [],
        totalPosts: 0,
        currentPage: 1,
        totalPages: 1
      }
    };
  }
};