import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
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

interface CategoryPageProps {
  navbarData: any;
  posts: BlogPost[];
  categories: Category[];
  currentCategory: Category;
  totalPosts: number;
  currentPage: number;
  totalPages: number;
}

export default function CategoryPage({ 
  navbarData, 
  posts, 
  categories, 
  currentCategory,
  totalPosts, 
  currentPage, 
  totalPages 
}: CategoryPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPosts, setFilteredPosts] = useState(posts);

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
        <title>{currentCategory.name} - Blog | TechPratham</title>
        <meta name="description" content={currentCategory.description || `Explore ${currentCategory.name} articles and tutorials on TechPratham blog.`} />
        <meta name="keywords" content={`${currentCategory.name.toLowerCase()}, tech blog, programming tutorials, technology insights`} />
        <link rel="canonical" href={`https://www.techpratham.com/blog/${currentCategory.slug}`} />
        
        <meta property="og:title" content={`${currentCategory.name} - Blog | TechPratham`} />
        <meta property="og:description" content={currentCategory.description || `Explore ${currentCategory.name} articles and tutorials on TechPratham blog.`} />
        <meta property="og:url" content={`https://www.techpratham.com/blog/${currentCategory.slug}`} />
        <meta property="og:type" content="website" />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              "name": `${currentCategory.name} - TechPratham Blog`,
              "description": currentCategory.description || `${currentCategory.name} articles and tutorials`,
              "url": `https://www.techpratham.com/blog/${currentCategory.slug}`,
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
                {currentCategory.name}
              </h1>
              <p className="text-xl text-white mb-8">
                {currentCategory.description || `Explore ${currentCategory.name} articles and tutorials`}
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
          <div className="flex gap-8">
            {/* Featured & Latest Sidebar */}
            <div className="hidden lg:block w-80 flex-shrink-0">
              <div className="space-y-8">
                {/* Featured Section */}
                <div className="bg-white rounded-lg p-6 shadow-sm border">
                  <h2 className="text-xl font-bold mb-6 text-gray-900 border-b pb-2">Featured</h2>
                  <div className="space-y-4">
                    {posts.slice(0, 3).map((post) => (
                      <Link
                        key={post._id}
                        href={`/blog/${post.categorySlug}/${post.slug}`}
                        className="flex gap-3 group hover:bg-gray-50 p-2 rounded-lg transition-colors"
                      >
                        <div className="w-16 h-16 relative flex-shrink-0 rounded-lg overflow-hidden">
                          <Image
                            src={post.featuredImage.url}
                            alt={post.featuredImage.alt}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500 mb-1">
                            {formatDate(post.publishedAt)}
                          </p>
                          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                            {post.title}
                          </h3>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Latest Section */}
                
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
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

              {/* Blog Posts - Grid Cards with Overlay */}
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
                        <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow max-w-sm mx-auto">
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
                            {/* Title */}
                            <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
                              {post.title}
                            </h3>
                            
                            {/* Author and Date */}
                            <p className="text-gray-500 text-sm mb-4">
                              By {post.author} • {formatDate(post.publishedAt)}
                            </p>
                            
                            {/* Read More Button */}
                            <div className="flex justify-start">
                              <div className="bg-black text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
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
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                          
                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                          
                          {/* Content Overlay */}
                          <div className="absolute inset-0 flex flex-col justify-between p-6">
                            {/* Category Badge at Top */}
                            <div className="flex justify-start">
                              <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30">
                                {post.category}
                              </Badge>
                            </div>
                            
                            {/* Title and Description at Bottom */}
                            <div>
                              <h3 className="text-xl md:text-2xl font-bold text-white mb-3 leading-tight group-hover:text-blue-200 transition-colors">
                                {post.title}
                              </h3>
                              
                              <p className="text-gray-200 text-sm mb-3 line-clamp-2 leading-relaxed">
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
                  {searchQuery ? (
                    <Button
                      variant="outline"
                      onClick={() => handleSearch('')}
                      className="mt-4"
                    >
                      Clear Search
                    </Button>
                  ) : (
                    <Link href="/blog">
                      <Button variant="outline" className="mt-4">
                        Browse All Articles
                      </Button>
                    </Link>
                  )}
                </div>
              )}

              {/* Pagination */}
              {!searchQuery && totalPages > 1 && (
                <div className="flex justify-center mt-12">
                  <div className="flex gap-2">
                    {currentPage > 1 && (
                      <Link href={`/blog/${currentCategory.slug}?page=${currentPage - 1}`}>
                        <Button variant="outline">Previous</Button>
                      </Link>
                    )}
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <Link key={page} href={`/blog/${currentCategory.slug}?page=${page}`}>
                          <Button
                            variant={currentPage === page ? "default" : "outline"}
                          >
                            {page}
                          </Button>
                        </Link>
                      );
                    })}
                    
                    {currentPage < totalPages && (
                      <Link href={`/blog/${currentCategory.slug}?page=${currentPage + 1}`}>
                        <Button variant="outline">Next</Button>
                      </Link>
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

export const getServerSideProps: GetServerSideProps = async ({ params, query }) => {
  try {
    const { category } = params as { category: string };
    const page = parseInt(query.page as string) || 1;
    const limit = 12;
    
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    
    // Fetch posts for this category using unified API
    const postsResponse = await fetch(
      `${baseUrl}/api/blog/unified?category=${category}&status=published&page=${page}&limit=${limit}`
    );
    const postsData = await postsResponse.json();
    
    if (!postsData.posts || postsData.posts.length === 0) {
      // Check if category exists using unified categories
      const categoriesResponse = await fetch(`${baseUrl}/api/blog/categories/unified?includePostCount=true`);
      const categoriesData = await categoriesResponse.json();
      const categoryExists = categoriesData.categories?.find((cat: any) => cat.slug === category);
      
      if (!categoryExists) {
        return { notFound: true };
      }
    }
    
    // Fetch all categories with post counts using unified API
    const categoriesResponse = await fetch(`${baseUrl}/api/blog/categories/unified?includePostCount=true`);
    const categoriesData = await categoriesResponse.json();
    
    // Find current category
    const currentCategory = categoriesData.categories?.find((cat: any) => cat.slug === category);
    
    if (!currentCategory) {
      return { notFound: true };
    }
    
    // Get navbar data using the withNavbarSSR pattern
    const navbarSSRFunction = withNavbarSSR<{ navbarData: any }>();
    const navbarResult = await navbarSSRFunction({ 
      params: params || {}, 
      query, 
      req: {} as any, 
      res: {} as any, 
      resolvedUrl: '' 
    });
    
    let navbarData = {};
    if ('props' in navbarResult) {
      navbarData = (navbarResult as { props: { navbarData: any } }).props.navbarData;
    }

    return {
      props: {
        navbarData,
        posts: postsData.posts || [],
        categories: categoriesData.categories || [],
        currentCategory,
        totalPosts: postsData.pagination?.total || 0,
        currentPage: page,
        totalPages: postsData.pagination?.pages || 1
      }
    };
  } catch (error) {
    console.error('Error in category getServerSideProps:', error);
    return {
      notFound: true
    };
  }
};