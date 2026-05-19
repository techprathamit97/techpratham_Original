import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Render } from "@measured/puck";
import "@measured/puck/puck.css";
import { puckConfig } from "@/src/lms/puckConfig";
import { IndexController } from '@/src/index/controller/IndexController';
import { withNavbarSSR } from '@/utils/withNavbarSSR';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import SanityContentRenderer from '@/components/blog/SanityContentRenderer';
import { Calendar, User, ArrowLeft, List } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { client } from "@/lib/sanity";
import { urlFor } from "@/lib/sanity";
import { PortableText } from "@portabletext/react";

interface BlogPostWithStatus {
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
  sanityBody?: any; // PortableText content or string
  featuredImage: {
    url: string;
    alt: string;
    caption?: string;
  };
  publishedAt: string;
  lastModified: string;
  readingTime: number;
  viewCount: number;
  puckData?: any;
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    focusKeyword?: string;
    canonicalUrl?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    robotsDirective?: string;
    schemaType?: string;
  };
  faqSection?: Array<{
    question: string;
    answer: string;
  }>;
  tableOfContents?: {
    enabled: boolean;
    items: Array<{
      level: number;
      title: string;
      anchor: string;
    }>;
  };
}

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface BlogPostPageProps {
  navbarData: any;
  post: BlogPostWithStatus;
  relatedPosts: BlogPostWithStatus[];
  isPreview?: boolean;
}

export default function BlogPostPage({ navbarData, post, relatedPosts, isPreview = false }: BlogPostPageProps) {
  const router = useRouter();
  const [tocItems, setTocItems] = useState<Array<{id: string, text: string, level: number}>>([]);
  const [activeHeading, setActiveHeading] = useState<string>('');
  const [activeSection, setActiveSection] = useState<string>("");
  const [showToc, setShowToc] = useState(false);

  // Sanity-specific functions
  const generateSlug = (text: string): string => {
    return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').trim();
  };

  const extractTocItems = (body: any[]): TocItem[] => {
    const items: TocItem[] = [];
    body?.forEach((block) => {
      if (block._type === 'block' && (block.style === 'h1' || block.style === 'h2' || block.style === 'h3')) {
        const text = block.children?.map((child: any) => child.text).join('') || '';
        if (text.trim()) {
          items.push({
            id: generateSlug(text),
            text: text.trim(),
            level: parseInt(block.style.replace('h', ''))
          });
        }
      }
    });
    return items;
  };

  const components: any = {
    types: {
      image: ({ value }: any) => {
        // Check if value has asset reference
        if (!value?.asset?._ref && !value?.asset?._id) {
          console.warn('Image missing asset reference:', value);
          return null;
        }
        
        try {
          const imageUrl = urlFor(value).width(800).url();
          return (
            <img
              src={imageUrl}
              alt={value.alt || "Blog image"}
              className="my-6 rounded-lg shadow-sm w-full"
              loading="lazy"
            />
          );
        } catch (error) {
          console.error('Error building image URL:', error, value);
          // Return placeholder or nothing
          return (
            <div className="my-6 p-4 bg-gray-100 rounded-lg text-center text-gray-500">
              Image unavailable
            </div>
          );
        }
      },
    },
    block: {
      h1: ({ children }: any) => {
        const extractText = (children: any): string => {
          if (typeof children === 'string') return children;
          if (Array.isArray(children)) {
            return children.map(child => typeof child === 'string' ? child : child?.props?.children || '').join('');
          }
          return children?.props?.children || '';
        };
        const text = extractText(children);
        const id = generateSlug(text);
        return (
          <h1 id={id} className="text-3xl font-bold my-6 scroll-mt-24">
            {children}
          </h1>
        );
      },
      h2: ({ children }: any) => {
        const extractText = (children: any): string => {
          if (typeof children === 'string') return children;
          if (Array.isArray(children)) {
            return children.map(child => typeof child === 'string' ? child : child?.props?.children || '').join('');
          }
          return children?.props?.children || '';
        };
        const text = extractText(children);
        const id = generateSlug(text);
        return (
          <h2 id={id} className="text-2xl font-semibold my-5 scroll-mt-24">
            {children}
          </h2>
        );
      },
      h3: ({ children }: any) => {
        const extractText = (children: any): string => {
          if (typeof children === 'string') return children;
          if (Array.isArray(children)) {
            return children.map(child => typeof child === 'string' ? child : child?.props?.children || '').join('');
          }
          return children?.props?.children || '';
        };
        const text = extractText(children);
        const id = generateSlug(text);
        return (
          <h3 id={id} className="text-xl font-medium my-4 scroll-mt-24">
            {children}
          </h3>
        );
      },
      normal: ({ children }: any) => <p className="leading-relaxed my-4 text-gray-700">{children}</p>,
    },
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
    setShowToc(false);
  };

  // Generate table of contents from rendered content
  useEffect(() => {
    const generateTOC = () => {
      const headings = document.querySelectorAll('h1, h2, h3');
      const items: Array<{id: string, text: string, level: number}> = [];
      
      // Items to exclude from TOC
      const excludeItems = [
        'Course Categories',
        'Workday Courses', 
        'Start typing to search courses...'
      ];
      
      headings.forEach((heading, index) => {
        const level = parseInt(heading.tagName.charAt(1));
        const text = heading.textContent || '';
        
        // Skip excluded items
        if (excludeItems.includes(text.trim())) {
          return;
        }
        
        let id = heading.id;
        
        if (!id) {
          id = `heading-${index}-${text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`;
          heading.id = id;
        }
        
        items.push({ id, text, level });
      });
      
      setTocItems(items);
    };

    // For Sanity blogs, extract TOC from body content
    if (post?.source === 'sanity' && post?.sanityBody) {
      try {
        // Handle both PortableText array and string content
        if (Array.isArray(post.sanityBody)) {
          const sanityTocItems = extractTocItems(post.sanityBody);
          setTocItems(sanityTocItems.map(item => ({ id: item.id, text: item.text, level: item.level })));
        } else {
          // Fallback to DOM-based TOC generation for string content
          setTimeout(generateTOC, 500);
        }
      } catch (error) {
        console.error('Error extracting TOC from Sanity body:', error);
        // Fallback to DOM-based TOC generation after content renders
        setTimeout(generateTOC, 500);
      }
    }
    // For custom blogs, generate TOC from rendered content
    else if (post?.puckData) {
      // Try immediately first
      generateTOC();
      
      // Then try again after a short delay to catch any dynamically rendered content
      const timeoutId = setTimeout(generateTOC, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [post]);

  // Handle scroll spy for active heading
  useEffect(() => {
    if (post?.source === 'sanity') {
      // Sanity blog scroll spy
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(entry.target.id);
              setActiveHeading(entry.target.id);
            }
          });
        },
        {
          rootMargin: "-80px 0px -80% 0px",
        }
      );

      tocItems.forEach(({ id }) => {
        const element = document.getElementById(id);
        if (element) {
          observer.observe(element);
        }
      });

      return () => {
        observer.disconnect();
      };
    } else {
      // Custom blog scroll spy
      const handleScroll = () => {
        const headings = document.querySelectorAll('h1, h2, h3');
        let currentActiveHeading = '';
        
        headings.forEach((heading) => {
          const rect = heading.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 0) {
            currentActiveHeading = heading.id;
          }
        });
        
        setActiveHeading(currentActiveHeading);
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [tocItems, post?.source]);

  // Smooth scroll to heading
  const scrollToHeading = (headingId: string) => {
    const element = document.getElementById(headingId);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Increment view count on page load
  useEffect(() => {
    if (post?.slug) {
      fetch(`/api/blog/${post.slug}?incrementView=true`)
        .catch(error => console.error('Error incrementing view count:', error));
    }
  }, [post?.slug]);

  if (router.isFallback) {
    return (
      <IndexController navbarData={navbarData}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">Loading...</h2>
            <p className="text-gray-600">Please wait while we load the article.</p>
          </div>
        </div>
      </IndexController>
    );
  }

  if (!post) {
    return (
      <IndexController navbarData={navbarData}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">Article Not Found</h2>
            <p className="text-gray-600 mb-4">The article you're looking for doesn't exist.</p>
            <Link href="/blog">
              <Button>Back to Blog</Button>
            </Link>
          </div>
        </div>
      </IndexController>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const canonicalUrl = post.seo?.canonicalUrl || `https://www.techpratham.com/blog/${post.categorySlug}/${post.slug}`;
  const ogImage = post.seo?.ogImage || post.featuredImage.url;

  // Build schema markup based on post type
  const buildSchema = () => {
    const baseSchema = {
      "@context": "https://schema.org",
      "@type": post.seo?.schemaType || "Article",
      "@id": `${canonicalUrl}#article`,
      "url": canonicalUrl,
      "headline": post.title,
      "description": post.excerpt,
      "image": {
        "@type": "ImageObject",
        "url": ogImage,
        "alt": post.featuredImage.alt
      },
      "author": {
        "@type": "Person",
        "name": post.author
      },
      "publisher": {
        "@type": "Organization",
        "name": "TechPratham",
        "url": "https://www.techpratham.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.techpratham.com/navbar/logotechnolyfirst2.svg"
        }
      },
      "datePublished": post.publishedAt,
      "dateModified": post.lastModified,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": canonicalUrl
      },
      "wordCount": post.puckData ? JSON.stringify(post.puckData).length : 0,
      "timeRequired": `PT${post.readingTime}M`,
      "articleSection": post.category,
      "keywords": [post.seo?.focusKeyword, ...post.tags].filter(Boolean).join(', ')
    };

    if (post.faqSection && post.faqSection.length > 0) {
      return [
        baseSchema,
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": post.faqSection.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.answer
            }
          }))
        }
      ];
    }

    return [baseSchema];
  };

  const schemas = buildSchema();

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.techpratham.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://www.techpratham.com/blog"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.category,
        "item": `https://www.techpratham.com/blog/${post.categorySlug}`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": post.title,
        "item": canonicalUrl
      }
    ]
  };

  return (
    <IndexController navbarData={navbarData}>
      <Head>
        <title>{post.seo?.metaTitle || post.title}</title>
        <meta name="description" content={post.seo?.metaDescription || post.excerpt} />
        <meta name="keywords" content={[post.seo?.focusKeyword, ...post.tags].filter(Boolean).join(', ')} />
        <link rel="canonical" href={canonicalUrl} />
        <meta name="robots" content={post.seo?.robotsDirective || 'index,follow'} />
        
        <meta property="og:title" content={post.seo?.ogTitle || post.title} />
        <meta property="og:description" content={post.seo?.ogDescription || post.excerpt} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={ogImage} />
        <meta property="article:author" content={post.author} />
        <meta property="article:published_time" content={post.publishedAt} />
        <meta property="article:modified_time" content={post.lastModified} />
        <meta property="article:section" content={post.category} />
        {post.tags.map((tag, index) => (
          <meta key={index} property="article:tag" content={tag} />
        ))}
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.seo?.ogTitle || post.title} />
        <meta name="twitter:description" content={post.seo?.ogDescription || post.excerpt} />
        <meta name="twitter:image" content={ogImage} />

        {schemas.map((schema, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      </Head>

      <article className="min-h-screen bg-white">
        {isPreview && post.status && post.status !== 'published' && (
          <div className="bg-yellow-100 border-b border-yellow-200">
            <div className="container mx-auto px-4 py-3">
              <div className="flex items-center justify-center">
                <div className="flex items-center gap-2 text-yellow-800">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Preview Mode</span>
                  <span>This is a {post.status} post and is not visible to the public.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gray-50 border-b">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex items-center space-x-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-blue-600">Home</Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-blue-600">Blogs</Link>
              <span>/</span>
              <Link href={`/blog/${post.categorySlug}`} className="hover:text-blue-600">{post.category}</Link>
              <span>/</span>
              <span className="text-gray-900">{post.title}</span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-2">
          <div className="max-w-7xl mx-auto flex gap-8 relative">
            {/* TOC - Always show container to prevent layout shift */}
            <div className="hidden lg:block w-64 flex-shrink-0">
              <div 
                className="sticky top-0"
                style={{ minHeight: '200px' }} // Reserve space to prevent layout shift
              >
                {tocItems.length > 0 && (
                  <div className="bg-gradient-to-tl from-[#C6151D] to-[#600A0E] rounded-lg overflow-hidden border-2 border-[#8B4513]">
                    {/* Header */}
                    <div className="bg-gradient-to-tl from-[#C6151D] to-[#600A0E] px-6 py-4">
                      <h3 className="text-lg font-semibold text-white">Table of Contents</h3>
                    </div>
                    
                    {/* Gold/Brown background section */}
                    <div className="bg-gradient-to-b from-[#B8860B] to-[#8B6914] px-4 py-4 space-y-2 max-h-screen overflow-y-auto">
                      {tocItems.map((item, index) => (
                        <button
                          key={index}
                          onClick={() => post?.source === 'sanity' ? scrollToSection(item.id) : scrollToHeading(item.id)}
                          className="flex items-center gap-2 w-full text-left py-2 px-3 rounded-full transition-all bg-gradient-to-tl from-[#C6151D] to-[#600A0E] hover:from-[#9B5523] hover:to-[#B0623D] text-white text-sm"
                        >
                          {/* White circular bullet */}
                          <div className="w-4 h-4 rounded-full border-2 border-white flex-shrink-0 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                          </div>
                          <span className="flex-1 truncate">{item.text}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 max-w-4xl">
              <header className="">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">{post.category}</Badge>
                  <span className="text-sm text-gray-500">{post.readingTime} min read</span>
                  <span className="text-sm text-gray-500">{post.viewCount} views</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 leading-tight">
                  {post.title}
                </h1>
                
              
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-8">
                  <div className="flex items-center gap-4">
                    <span>By <strong className="text-gray-900">{post.author}</strong></span>
                    <span>Published {formatDate(post.publishedAt)}</span>
                    {post.lastModified !== post.publishedAt && (
                      <span>Updated {formatDate(post.lastModified)}</span>
                    )}
                  </div>
                </div>

                {/* Featured Image - Only show for Sanity blogs */}
                {post.source === 'sanity' && post.featuredImage?.url && (
                  <div className="relative w-full aspect-video mb-8 rounded-xl overflow-hidden">
                    <Image
                      src={post.featuredImage.url}
                      alt={post.featuredImage.alt || post.title}
                      fill
                      className="object-contain"
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                    />
                    {post.featuredImage.caption && (
                      <p className="text-sm text-gray-600 text-center mt-2 italic">
                        {post.featuredImage.caption}
                      </p>
                    )}
                  </div>
                )}
               
              </header>

              <div className="pb-12">

                <div className="prose prose-lg max-w-none">
                  {post.source === 'sanity' && post.sanityBody ? (
                    // Render Sanity content with PortableText
                    <div className="prose max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600">
                      {Array.isArray(post.sanityBody) ? (
                        <PortableText value={post.sanityBody} components={components} />
                      ) : (
                        <div dangerouslySetInnerHTML={{ __html: post.sanityBody }} />
                      )}
                    </div>
                  ) : post.puckData ? (
                    // Render Puck content for custom blogs
                    <Render config={puckConfig} data={post.puckData} />
                  ) : (
                    <p>No content available.</p>
                  )}
                </div>

                {post.faqSection && post.faqSection.length > 0 && (
                  <div className="mt-2">
                    <Separator className="mb-8" />
                    <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
                    <div className="space-y-6">
                      {post.faqSection.map((faq, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-6">
                          <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                          <div 
                            className="prose prose-gray"
                            dangerouslySetInnerHTML={{ __html: faq.answer }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-2 pt-1 border-t social-share-section">
                  <h3 className="text-lg font-semibold mb-4">Share this article</h3>
                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(canonicalUrl)}`;
                        window.open(url, '_blank');
                      }}
                    >
                      Share on Twitter
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(canonicalUrl)}`;
                        window.open(url, '_blank');
                      }}
                    >
                      Share on LinkedIn
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(canonicalUrl);
                        alert('Link copied to clipboard!');
                      }}
                    >
                      Copy Link
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {relatedPosts.length > 0 && (
          <div className="bg-gray-50 py-12 related-posts-section">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold mb-8">Related Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedPosts.map((relatedPost) => (
                    <Link 
                      key={relatedPost._id} 
                      href={`/blog/${relatedPost.categorySlug}/${relatedPost.slug}`}
                      className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="aspect-video relative">
                        <Image
                          src={relatedPost.featuredImage.url}
                          alt={relatedPost.featuredImage.alt}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                      <div className="p-4">
                        <Badge variant="secondary" className="mb-2">
                          {relatedPost.category}
                        </Badge>
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                          {relatedPost.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {relatedPost.excerpt}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </article>
    </IndexController>
  );
} 

export const getServerSideProps: GetServerSideProps = async ({ params, query }) => {
  try {
    const { category, slug } = params as { category: string; slug: string };
    const isPreview = query.preview === 'true';

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    
    // Use unified API to fetch blog post (handles both custom and Sanity)
    const response = await fetch(`${baseUrl}/api/blog/unified/${slug}`);
    
    if (!response.ok) {
      return { notFound: true };
    }

    const data = await response.json();

    if (!data.post) {
      return { notFound: true };
    }

    // For Sanity blogs, the category is always "sanity-blogs"
    // For custom blogs, check if the category matches
    if (data.post.source === 'custom' && data.post.categorySlug !== category) {
      return {
        redirect: {
          destination: `/blog/${data.post.categorySlug}/${slug}${isPreview ? '?preview=true' : ''}`,
          permanent: false
        }
      };
    }

    // For Sanity blogs, ensure we're in the right category
    if (data.post.source === 'sanity' && category !== 'general-blogs') {
      return {
        redirect: {
          destination: `/blog/general-blogs/${slug}${isPreview ? '?preview=true' : ''}`,
          permanent: false
        }
      };
    }

    // Fetch related posts using unified API
    const relatedResponse = await fetch(
      `${baseUrl}/api/blog/unified?category=${data.post.categorySlug}&limit=3&status=published`
    );
    const relatedData = await relatedResponse.json();
    const relatedPosts = relatedData.posts?.filter((p: any) => p.slug !== slug).slice(0, 3) || [];

    // Get navbar data using the withNavbarSSR pattern
    const navbarSSRFunction = withNavbarSSR<{ navbarData: any }>();
    const navbarResult = await navbarSSRFunction({ params, query, req: {} as any, res: {} as any, resolvedUrl: '' });
    
    let navbarData = {};
    if ('props' in navbarResult) {
      navbarData = (navbarResult as { props: { navbarData: any } }).props.navbarData;
    }

    return {
      props: {
        navbarData,
        post: data.post,
        relatedPosts,
        isPreview
      }
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return {
      notFound: true
    };
  }
};
