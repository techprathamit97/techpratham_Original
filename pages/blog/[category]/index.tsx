import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { IndexController } from '@/src/index/controller/IndexController';
import { withNavbarSSR } from '@/utils/withNavbarSSR';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import ReachForm from '@/components/common/ReachForm/ReachForm';
import ToolTip from '@/components/common/ToolTip/ToolTip';
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

  // Derived from the `posts` prop on every render. Previously this was copied into
  // useState(posts), which only reads the initial value: when the user clicked a
  // pagination link Next.js reused the same component instance, so the list kept
  // showing the first page's posts until a full refresh.
  const filteredPosts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return posts;
    return posts.filter(post =>
      post.title.toLowerCase().includes(query) ||
      post.excerpt.toLowerCase().includes(query) ||
      post.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }, [posts, searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Sliding window of page numbers around the current page (max 5 buttons)
  const pageNumbers = useMemo(() => {
    const windowSize = Math.min(5, totalPages);
    let start = Math.max(1, currentPage - Math.floor(windowSize / 2));
    const end = Math.min(totalPages, start + windowSize - 1);
    start = Math.max(1, end - windowSize + 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [currentPage, totalPages]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <IndexController navbarData={navbarData}>
        <ReachForm />

        <ToolTip />
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
          <div
            className="relative border-b bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/training/blog.jpeg')",
            }}
          >
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/20"></div>

            <div className="relative container mx-auto px-4 py-16">
              <div className="text-center max-w-3xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  {currentCategory.name}
                </h1>

                <p className="text-xl text-gray-200 mb-8">
                  {currentCategory.description ||
                    `Explore ${currentCategory.name} articles and tutorials`}
                </p>

                {/* Search Bar */}
                <div className="relative max-w-md mx-auto">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />

                  <Input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10 pr-4 py-3 w-full bg-white/90 backdrop-blur-sm border-white text-black placeholder:text-gray-500"
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
                              <h3 className="text-sm font-bold text-gray-900 mb-3 leading-tight">
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
                            <div className="absolute inset-0 flex flex-col justify-between p-3">
                              {/* Category Badge at Top */}
                              <div className="flex justify-start">
                                
                              </div>

                              {/* Title and Description at Bottom */}
                              <div>
                                <h3 className="text-lg md:text-[18px] font-bold text-white mb-3 leading-tight group-hover:text-blue-200 transition-colors">
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

                      {pageNumbers.map((page) => {
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
     

      <ToolTip />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params, query }) => {
  try {
    const { category } = params as { category: string };
    const page = Math.max(1, parseInt(query.page as string) || 1);
    const limit = 12;

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

    // Posts, categories and navbar are independent, so fetch them in parallel
    // (previously: posts, then categories up to twice, then navbar, one after another).
    const navbarSSRFunction = withNavbarSSR<{ navbarData: any }>();
    const [postsResponse, categoriesResponse, navbarResult] = await Promise.all([
      fetch(`${baseUrl}/api/blog/unified?category=${category}&status=published&page=${page}&limit=${limit}`),
      fetch(`${baseUrl}/api/blog/categories/unified?includePostCount=true`),
      navbarSSRFunction({
        params: params || {},
        query,
        req: {} as any,
        res: {} as any,
        resolvedUrl: ''
      })
    ]);

    const [postsData, categoriesData] = await Promise.all([
      postsResponse.json(),
      categoriesResponse.json()
    ]);

    // Find current category (also covers the "category does not exist" check)
    const currentCategory = categoriesData.categories?.find((cat: any) => cat.slug === category);

    if (!currentCategory) {
      return { notFound: true };
    }

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