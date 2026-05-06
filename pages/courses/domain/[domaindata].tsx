import ReachForm from '@/components/common/ReachForm/ReachForm';
import ToolTip from '@/components/common/ToolTip/ToolTip';
import { Button } from '@/components/ui/button';
import Footer from '@/src/common/Footer/Footer';
import Navbar from '@/src/common/Navbar/Navbar';
import { getNavbarData, NavbarData } from '@/utils/navbarData';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { GetServerSideProps } from 'next';

interface Curriculum {
    que: string;
    ans: string;
    topics: string[];
}

interface FAQ {
    que: string;
    ans: string;
}

interface Metadata {
    title?: string;
    description?: string;
    keywords?: string[];
}

interface Course {
    _id: string;
    id: string;
    link: string;
    title: string;
    shortDesc: string;
    description: string;
    rating: string;
    duration: string;
    level: string;
    category: string;
    placement_report: string;
    curriculum: string;
    interview: string;
    videoLink: string;
    curriculum_data: Curriculum[];
    skills_data: string[];
    assesment_link: string;
    faqs_data: FAQ[];
    metadata?: Metadata;
}

interface DomainDataPageProps {
    initialCourses: Course[];
    domainSlug: string;
    navbarData: NavbarData;
}

const DomainDataPage: React.FC<DomainDataPageProps> = ({ initialCourses, domainSlug, navbarData }) => {
    const router = useRouter();
    const { domaindata } = router.query;

    const [courseData, setCourseData] = useState<Course[]>(initialCourses);
    const [isLoading, setIsLoading] = useState(false);
    // convert DB text → slug
    const makeSlug = (text: string) => {
        return text.toLowerCase().replace(/\s+/g, "-");
    };

    // convert slug → DB format
    const slugToCategory = (slug: string) => {
        return slug.replace(/-/g, " ");
    };

    useEffect(() => {
        // Only fetch if no initial data (fallback for client-side navigation)
        if (initialCourses.length > 0) {
            return;
        }

        const fetchCourseData = async () => {
            if (domaindata === undefined || typeof domaindata !== 'string') {
                return;
            }

            setIsLoading(true);
            try {
                const originalCategory = slugToCategory(domaindata);

                const response = await fetch(
                    `/api/course/filtered/get-all?category=${encodeURIComponent(originalCategory)}`
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                setCourseData(data.courses || []);
            } catch (error: any) {
                toast.error("Failed to load related courses");
                setCourseData([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourseData();
    }, [domaindata, initialCourses]);

    // Helper function to format domain name for display
   const formatDomainName = (slug: string): string => {
  return slug
    .replace(/-/g, " ")
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};


    const getLevelColor = (level: any) => {
        switch (level) {
            case 'Beginner': return 'text-green-600 bg-green-50'
            case 'Intermediate': return 'text-blue-600 bg-blue-50'
            case 'Advanced': return 'text-purple-600 bg-purple-50'
            default: return 'text-gray-600 bg-gray-50'
        }
    }

    if (!domaindata) {
        return null;
    }

    if (isLoading) {
        return (
            <React.Fragment>
                <Head>
                    <title>Loading... | TechPratham</title>
                </Head>

                <Navbar navbarData={navbarData} />

                <div className="w-full h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading course data...</p>
                    </div>
                </div>

                <Footer />
            </React.Fragment>
        );
    }

    // SEO and meta data for domain/category page
    const domainName = typeof domaindata === 'string' ? formatDomainName(domaindata) : 'Courses';
    const courseCount = courseData.length;

    const title = `${domainName} Courses | TechPratham - India's Leading IT Training Institute`;
    const description = courseCount > 0
        ? `Explore ${courseCount} ${domainName} courses at TechPratham. Master ${domainName} with expert-led training, hands-on projects, and industry-recognized certifications. Enroll now!`
        : `Discover ${domainName} courses at TechPratham. Advance your career with comprehensive IT training and expert instruction.`;

    const keywords = `${domainName} courses, ${domainName} training, Learn ${domainName}, ${domainName} certification, TechPratham, IT Training India, Best ${domainName} institute, Online ${domainName} courses, ${domainName} for beginners`;
    const url = `https://www.techpratham.com/domain/${domaindata}`;
    const image = "/navbar/techpratham.svg";

    return (
        <React.Fragment>
            <Head>
                <link rel="icon" href="/favicon.ico" type="image/ico" sizes="70x70" />
                <title>{title}</title>
                <meta name="description" content={description} />
                <meta name="keywords" content={keywords} />
                <meta name="author" content="TechPratham" />

                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta property="og:image" content={image} />
                <meta property="og:url" content={url} />
                <meta property="og:site_name" content="TechPratham" />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={title} />
                <meta name="twitter:description" content={description} />
                <meta name="twitter:image" content={image} />
                <meta name="twitter:site" content="@TechPratham" />

                {/* Additional SEO tags */}
                <meta name="robots" content="index, follow" />
                <meta name="language" content="English" />
                <meta name="revisit-after" content="7 days" />
                <meta name="distribution" content="global" />
                <meta name="rating" content="general" />

                {/* Canonical URL */}
                <link rel="canonical" href={url} />

                {/* Structured Data for Course Category */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "CollectionPage",
                            "name": `${domainName} Courses`,
                            "description": description,
                            "url": url,
                            "provider": {
                                "@type": "EducationalOrganization",
                                "name": "TechPratham",
                                "url": "https://www.techpratham.com"
                            },
                            "numberOfItems": courseCount,
                            "about": {
                                "@type": "Thing",
                                "name": domainName
                            }
                        })
                    }}
                />
            </Head>

            <Navbar navbarData={navbarData} />

            <div className='w-full h-auto flex flex-col items-center justify-center'>
                <ReachForm />
                <ToolTip />

                <div className='w-full h-auto flex items-center justify-center relative'>
                    {/* Background Image */}
                    <Image 
                        src='/training/categoryhero.webp' 
                        alt='Course Category Hero' 
                        width={1920} 
                        height={1080} 
                        className='w-full md:h-[400px] sm:h-[250px] h-[200px] object-cover' 
                    />
                    
                    {/* Text Overlay - Left Side */}
                    <div className='absolute top-0 left-0 w-full h-full flex items-center md:px-16 px-3'>
                        <div className='max-w-2xl'>
                            <h1 className='md:text-5xl sm:text-4xl text-[18px] font-bold text-white leading-tight'>
                                <span className='text-[#f5deb3]'>BUILD SKILLS</span> WITH OUR <br/> PROFESSIONAL COURSES
                            </h1>
                        </div>
                    </div>
                </div>

                {courseData.length > 0 ? (
                    <div className='w-full h-auto flex flex-col gap-10 items-center justify-center py-8 text-black'>
<div className="text-center mb-5">

          <div className="text-center mb-12">
            <h2 className="text-[#7f1d1d] md:text-3xl text-2xl font-bold">
               Explore {domainName} Courses
            </h2>

            <svg
              className="mx-auto"
              width="340"
              height="6"
              viewBox="0 0 340 6"
              preserveAspectRatio="none"
            >
              <path
                d="M0 3 Q170 0 340 3 Q170 6 0 3 Z"
                fill="#7f1d1d"
              />
            </svg>
          </div>
          {/* <div className="w-[280px] h-[6px] bg-gradient-to-tl from-[#C6151D] to-[#600A0E] rounded-full mx-auto" /> */}
        </div>
                        <div className='md:w-10/12 w-11/12 flex flex-col items-center justify-center h-auto'>
                            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 w-full justify-items-center">
                                {courseData.map((course: any, index: any) => (
                                    <div
                                        key={index}
                                        className="w-full max-w-sm h-auto flex flex-col p-6 border rounded-xl shadow-md hover:shadow-lg transition-all duration-300 bg-white"
                                    >
                                        <Image src={course?.image} alt={course.alt} width={400} height={200} className="w-full h-48 object-cover rounded-md border border-[#dddedd] mb-4" />
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="text-xl font-semibold text-gray-800 leading-tight"><span dangerouslySetInnerHTML={{ __html: course.title }} /></div>
                                        </div>

                                        <div className="mb-3 flex flex-row gap-2">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium text-green-600 bg-green-50`}>
                                                {course.category}
                                            </span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getLevelColor(course.level)}`}>
                                                {course.level}
                                            </span>
                                        </div>

                                        <div className="text-sm text-gray-600 mb-4 flex-grow leading-relaxed"><div dangerouslySetInnerHTML={{ __html: course.shortDesc }} /></div>


                                        <div className="flex justify-between items-center mb-4">
                                            <div className="flex items-center gap-1">
                                                <span className="text-yellow-500">★</span>
                                                <span className="text-yellow-600 font-medium">{course.rating}</span>
                                            </div>
                                            <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                {course.duration}
                                            </div>
                                        </div>

                                        <Link href={`/courses/${course.link}`} className="w-full">
                                            <Button
                                                variant="default"
                                                className="w-full bg-gradient-to-r from-[#CD4647] to-[#7F3B40] hover:from-[#B73E3F] hover:to-[#6F3336] transition-all duration-200"
                                            >
                                                Explore Now
                                            </Button>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-600 text-lg mb-4">No courses found in {domainName}</p>
                        <button
                            onClick={() => router.push('/courses')}
                            className="bg-red-700 text-white px-6 py-3 rounded-lg hover:bg-red-800 transition-colors"
                        >
                            Browse All Courses
                        </button>
                    </div>
                )}

            </div>

            <Footer />
        </React.Fragment>
    )
}

export default DomainDataPage


// Server-side data fetching
export const getServerSideProps: GetServerSideProps<DomainDataPageProps> = async (context) => {
    const { domaindata } = context.query;

    if (!domaindata || typeof domaindata !== 'string') {
        const navbarData = await getNavbarData();
        return {
            props: {
                initialCourses: [],
                domainSlug: '',
                navbarData,
            },
        };
    }

    try {
        // Use dynamic URL
        const protocol = context.req.headers.host?.includes('localhost') ? 'http' : 'https';
        const baseUrl = `${protocol}://${context.req.headers.host}`;
        
        // Convert slug to category
        const originalCategory = domaindata.replace(/-/g, " ");
        
        // Fetch courses and navbar data in parallel
        const [response, navbarData] = await Promise.all([
            fetch(`${baseUrl}/api/course/filtered/get-all?category=${encodeURIComponent(originalCategory)}`),
            getNavbarData()
        ]);

        if (!response.ok) {
            return {
                props: {
                    initialCourses: [],
                    domainSlug: domaindata,
                    navbarData,
                },
            };
        }

        const data = await response.json();

        return {
            props: {
                initialCourses: data.courses || [],
                domainSlug: domaindata,
                navbarData,
            },
        };
    } catch (error) {
        console.error('Error fetching domain courses:', error);
        const navbarData = await getNavbarData();
        return {
            props: {
                initialCourses: [],
                domainSlug: domaindata,
                navbarData,
            },
        };
    }
};
