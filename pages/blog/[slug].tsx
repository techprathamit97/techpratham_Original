"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { Calendar, User, ArrowLeft, List } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/src/common/Navbar/Navbar";
import Footer from "@/src/common/Footer/Footer";
import { client } from "@/lib/sanity";
import { urlFor } from "@/lib/sanity";
import { PortableText } from "@portabletext/react";

const postQuery = `
  *[_type == "post" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    "authorName": author->name,
    mainImage{
      asset->{
        url
      }
    },
    body
  }
`;

interface TocItem {
  id: string;
  text: string;
  level: number;
}

const ArticlePage: React.FC = () => {
    const router = useRouter();
    const { slug } = router.query;

    const [post, setPost] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [tocItems, setTocItems] = useState<TocItem[]>([]);
    const [activeSection, setActiveSection] = useState<string>("");
    const [showToc, setShowToc] = useState(false);

    const generateSlug = (text: string): string => {
        return text
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .trim();
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
            image: ({ value }: any) => (
                <img
                    src={urlFor(value).width(800).url()}
                    alt={value.alt || "Blog image"}
                    className="my-6 rounded-lg shadow-sm w-full"
                />
            ),
        },
        block: {
            h1: ({ children }: any) => {
                const extractText = (children: any): string => {
                    if (typeof children === 'string') return children;
                    if (Array.isArray(children)) {
                        return children.map(child => 
                            typeof child === 'string' ? child : child?.props?.children || ''
                        ).join('');
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
                        return children.map(child => 
                            typeof child === 'string' ? child : child?.props?.children || ''
                        ).join('');
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
                        return children.map(child => 
                            typeof child === 'string' ? child : child?.props?.children || ''
                        ).join('');
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

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
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
    }, [tocItems]);

    useEffect(() => {
        if (!slug) return;

        const fetchPost = async () => {
            setLoading(true);
            try {
                const data = await client.fetch(postQuery, { slug });
                if (!data) {
                    setError("Article not found");
                } else {
                    setPost(data);
                    const toc = extractTocItems(data.body);
                    setTocItems(toc);
                }
            } catch (err: any) {
                console.error(err);
                setError("Failed to fetch article");
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [slug]);

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

    const LoadingSkeleton = () => (
        <div className="flex flex-col w-full gap-4 pt-10">
            <Skeleton className="w-3/4 h-8" />
            <Skeleton className="w-full h-6" />
            <Skeleton className="w-full h-64" />
        </div>
    );

    const ErrorState = () => (
        <div className="flex flex-col items-center justify-center min-h-96 w-full">
            <div className="text-center p-8 bg-white rounded-lg shadow-sm border">
                <div className="text-red-500 text-lg font-semibold mb-2">
                    {error === "Article not found" ? "Article Not Found" : "Error Loading Article"}
                </div>
                <p className="text-gray-600 mb-6">
                    {error === "Article not found"
                        ? "The article you are looking for does not exist or may have been removed."
                        : "We encountered an error while loading this article. Please try again."}
                </p>
                <Link
                    href="/blogs"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors flex items-center gap-2"
                >
                    <ArrowLeft size={16} />
                    Back to Blogs
                </Link>
            </div>
        </div>
    );

    const TableOfContents = () => {
        if (tocItems.length === 0) return null;

        return (
            <div className="bg-gray-50 rounded-lg p-6 border">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Table of Contents</h3>
                    <button
                        onClick={() => setShowToc(!showToc)}
                        className="md:hidden p-1 text-gray-600 hover:text-gray-900"
                    >
                        <List size={20} />
                    </button>
                </div>
                
                <nav className={`${showToc ? 'block' : 'hidden'} md:block`}>
                    <ul className="space-y-2">
                        {tocItems.map(({ id, text, level }) => (
                            <li key={id}>
                                <button
                                    onClick={() => scrollToSection(id)}
                                    className={`
                                        text-left w-full px-2 py-1 rounded text-sm transition-colors
                                        ${level === 1 ? 'font-medium' : ''}
                                        ${level === 2 ? 'ml-4 text-gray-700' : ''}
                                        ${level === 3 ? 'ml-8 text-gray-600' : ''}
                                        ${activeSection === id 
                                            ? 'bg-blue-100 text-blue-700 font-medium' 
                                            : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                                        }
                                    `}
                                >
                                    {text}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        );
    };

    return (
        <React.Fragment>
            <Head>
                <title>{post ? `${post.title} | TechPratham` : "Blog | TechPratham"}</title>
                <meta
                    name="description"
                    content={post?.excerpt || "Read the latest tech articles and insights on TechPratham."}
                />
            </Head>

            <Navbar />

            <div className="flex flex-col w-full min-h-screen items-center justify-center bg-gray-50">
                <main className="flex flex-col w-11/12 max-w-7xl min-h-screen items-start gap-10 my-10 ">
                    {loading ? (
                        <LoadingSkeleton />
                    ) : error ? (
                        <ErrorState />
                    ) : post ? (
                        <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-8">
                            <article className="lg:col-span-3 w-full flex flex-col">
                                <div className="mb-4">
                                    <Link
                                        href="/blog"
                                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                                    >
                                        <ArrowLeft size={16} />
                                        Back to Blogs
                                    </Link>
                                </div>

                                {post.mainImage?.asset?.url && (
                                    <img
                                        src={post.mainImage.asset.url}
                                        alt={post.title}
                                        className="w-full h-auto object-cover rounded-lg md:mb-6 mb-4 shadow-sm"
                                    />
                                )}

                                <h1 className="text-lg md:text-2xl md:font-bold font-medium mb-4 text-gray-900">{post.title}</h1>

                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 md:mb-6 mb-0">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={16} />
                                        <span>{new Date(post.publishedAt).toDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <User size={16} />
                                        <span>By {post.authorName}</span>
                                    </div>
                                </div>

                                <Separator className="my-6" />

                                <div className="lg:hidden mb-6">
                                    <TableOfContents />
                                </div>

                                <div className="prose max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600">
                                    <PortableText value={post.body} components={components} />
                                </div>
                            </article>

                            <aside className="hidden lg:block lg:col-span-1">
                                <div className="sticky top-24">
                                    <TableOfContents />
                                </div>
                            </aside>
                        </div>
                    ) : null}
                </main>
            </div>

            <Footer />
        </React.Fragment>
    );
};

export default ArticlePage;