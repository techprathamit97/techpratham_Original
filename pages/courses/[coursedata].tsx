
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';

import Navbar from '@/src/common/Navbar/Navbar';
import Footer from '@/src/common/Footer/Footer';
import { getNavbarData, NavbarData } from '@/utils/navbarData';
import EmployeeLifecycle from '@/src/courses/common/EmployeeLifecycle';
import ClientHome from '@/src/index/components/ClientHome/ClientHome';
import HeaderSection from '@/src/courses/common/HeaderSection/HeaderSection';
import IntroSection from '@/src/courses/common/IntroSection/IntroSection';
import PlanSection from '@/src/courses/common/PlanSection/PlanSection';
import CurriculumSection from '@/src/courses/common/CurriculumSection/CurriculumSection';
import TrainingBatches from '@/src/courses/common/TrainingBatches/TrainingBatches';
import FaqSection from '@/src/courses/common/FaqSection/FaqSection';
import TestimonialSection from '@/src/courses/common/TestimonialSection/TestimonialSection';
import CourseCertification from '@/src/courses/common/CourseCertification/CourseCertification';
import ProjectSection from '@/src/courses/common/ProjectSection/ProjectSection';
import CertificateSection from '@/src/courses/common/CertificateSection/CertificateSection';
import OtherCourse from '@/src/courses/common/OtherCourse/OtherCourse';
import ReachForm from '@/components/common/ReachForm/ReachForm';
import ToolTip from '@/components/common/ToolTip/ToolTip';
import LeadForm from '@/components/common/LeadForm/LeadForm';
import NewComponent from '@/src/index/components/NewComponent/NewComponent'
import WhoShouldTakeWorkday from '@/src/courses/common/WhoShouldTakeWorkday/WhoShouldTakeWorkday'
import TrainingComparison from '@/src/courses/common/TrainingComparison/TrainingComparison'
import JobRole from '@/src/courses/common/JobRole/JobRole'
import SpecialityHome from '@/src/index/components/SpecialityHome/SpecialityHome'
import ContactCourses from '@/src/courses/common/ContactCourses/ContactCourses'
import VideoSetion from '@/src/courses/common/VideoSetion/VideoSetion'
import PlacementHome from '@/src/index/components/PlacementHome/PlacementHome';
import NewsHighlights from '@/src/index/components/News/News';


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
  link: string;
  title: string;
  shortDesc: string;
  description: string;
  rating?: string;
  duration?: string;
  ratingCount?: number;
  level?: string;
  category?: string;
  placement_report?: string;
  curriculum?: string;
  interview?: string;
  videoLink?: string;
  curriculum_data?: Curriculum[];
  skills_data?: string[];
  assesment_link?: string;
  faqs_data?: FAQ[];
  metadata?: Metadata;
  image_url: string;
  price?: number | string;
  priceCurrency?: string;
}

interface CourseDataPageProps {
  course: Course | null;
  error: string | null;
  navbarData: NavbarData;
}


export const getServerSideProps: GetServerSideProps<CourseDataPageProps> = async (context: GetServerSidePropsContext) => {
  const { coursedata } = context.query;

  if (!coursedata || typeof coursedata !== 'string') {
    const navbarData = await getNavbarData();
    return { props: { course: null, error: 'Invalid course link', navbarData } };
  }

  // Declare apiUrl outside try block so it's accessible in catch
  let apiUrl = '';
  
  try {
    // Use environment variable like blog pages do
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_API_URL;
    apiUrl = `${baseUrl}/api/course/link?link=${encodeURIComponent(coursedata)}&bustCache=true`;
    

    
    // Fetch course data and navbar data in parallel
    const [response, navbarData] = await Promise.all([
      fetch(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
      }),
      getNavbarData()
    ]);

    if (!response.ok) {
      console.error('Course API response not OK:', response.status, response.statusText);
      const error = response.status === 404 ? 'Course not found' : 'Failed to fetch course data';
      return { props: { course: null, error, navbarData } };
    }

    const courseData: Course = await response.json();
    return { props: { course: courseData, error: null, navbarData } };

  } catch (err) {
    console.error('Error fetching course data in SSR:', err);
    console.error('API URL was:', apiUrl);
    console.error('Course link was:', coursedata);
    const navbarData = await getNavbarData();
    return { props: { course: null, error: 'Failed to fetch course data', navbarData } };
  }
};



// Basic HTML stripper (keeps simple & safe). Server-safe (no DOM).
function stripHtml(html?: string): string {
  if (!html) return '';
  // Remove script/style tags and content
  const withoutScripts = html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '');
  // Replace tags with spaces, collapse whitespace
  const text = withoutScripts.replace(/<\/?[^>]+(>|$)/g, ' ').replace(/\s+/g, ' ').trim();
  return text;
}

// Convert human duration to ISO 8601 (PT...H...M)
function parseDurationToISO(duration?: string): string | undefined {
  if (!duration) return undefined;
  const s = duration.toLowerCase().trim();

  const hoursMatch = s.match(/([\d,.]+)\s*(h|hr|hrs|hour|hours)\b/);
  if (hoursMatch) {
    const num = parseFloat(hoursMatch[1].replace(',', '.'));
    if (!isNaN(num)) {
      const whole = Math.floor(num);
      const fractional = num - whole;
      const minutes = Math.round(fractional * 60);
      return `PT${whole}H${minutes ? `${minutes}M` : ''}`;
    }
  }

  const minsMatch = s.match(/([\d,.]+)\s*(m|min|mins|minute|minutes)\b/);
  if (minsMatch) {
    const num = parseFloat(minsMatch[1].replace(',', '.'));
    if (!isNaN(num)) {
      return `PT${Math.round(num)}M`;
    }
  }

  // fallback: if it's numeric like "40" assume hours
  const numericOnly = s.match(/^(\d+(?:\.\d+)?)$/);
  if (numericOnly) {
    const num = parseFloat(numericOnly[1]);
    const whole = Math.floor(num);
    const minutes = Math.round((num - whole) * 60);
    return `PT${whole}H${minutes ? `${minutes}M` : ''}`;
  }

  return undefined;
}

// Remove undefined/null fields recursively
function compact(obj: any): any {
  if (Array.isArray(obj)) return obj.map(compact).filter(Boolean);
  if (obj && typeof obj === 'object') {
    const out: any = {};
    Object.entries(obj).forEach(([k, v]) => {
      const c = compact(v);
      if (c !== undefined) out[k] = c;
    });
    return Object.keys(out).length ? out : undefined;
  }
  return obj !== undefined ? obj : undefined;
}


// ----------------------------
// Dynamic schema generator
// ----------------------------
const getDynamicSchema = (course: Course) => {
  const titleLower = stripHtml(course.title || '').toLowerCase();
  const titleText = stripHtml(course.title || '');
  
  // const titleLower = (course.title || '');
  const cleanDescription = stripHtml(course.shortDesc || course.description);
  const workloadIso = parseDurationToISO(course.duration);

  const baseSchema: any = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: titleText,
    description: cleanDescription || undefined,
    url: `https://www.techpratham.com/courses/${course.link}`,
    provider: {
      "@type": "Organization",
      name: "TechPratham",
      sameAs: "https://www.techpratham.com"
    },
    image: course.image_url ? { "@type": "ImageObject", url: course.image_url } : undefined
  };

  // Optional aggregateRating (include only when rating exists)
  if (course.rating && !isNaN(Number(course.rating))) {
    baseSchema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: Number(course.rating),
      bestRating: 5,
      ratingCount: "4890",
    };
  }


  const instances: any[] = [];

  if (titleLower.includes('hyderabad') || (course.link && course.link.toLowerCase().includes('hyderabad'))) {
    instances.push({
      "@type": "CourseInstance",
      name: `${titleText} - Hyderabad`,
      courseMode: "OnSite",
      url: `https://www.techpratham.com/courses/${course.link}`,
      location: {
        "@type": "Place",
        name: "Tech Pratham Hyderabad",
        address: {
          "@type": "PostalAddress",
          streetAddress: "LVS Arcade, Madhapur",
          addressLocality: "Hyderabad",
          addressRegion: "Telangana",
          postalCode: "500081",
          addressCountry: "IN"
        }
      },
      courseWorkload: workloadIso
    });

    // Online instance as well
    instances.push({
      "@type": "CourseInstance",
      name: `${titleText} - Online`,
      courseMode: "Online",
      url: `https://www.techpratham.com/courses/${course.link}`,
      courseWorkload: workloadIso
    });
  } else if (titleLower.includes('noida') || (course.link && course.link.toLowerCase().includes('noida'))) {
    instances.push({
      "@type": "CourseInstance",
      name: `${titleText} - Noida`,
      courseMode: "OnSite",
      url: `https://www.techpratham.com/courses/${course.link}`,
      location: {
        "@type": "Place",
        name: "Tech Pratham Noida",
        address: {
          "@type": "PostalAddress",
          streetAddress: "C-2, Sector-1",
          addressLocality: "Noida",
          addressRegion: "Uttar Pradesh",
          postalCode: "201301",
          addressCountry: "IN"
        }
      },
      courseWorkload: workloadIso
    });

    // Online instance
    instances.push({
      "@type": "CourseInstance",
      name: `${titleText} - Online`,
      courseMode: "Online",
      url: `https://www.techpratham.com/courses/${course.link}`,
      courseWorkload: workloadIso
    });
  } else {
    // Default: only Online instance
    instances.push({
      "@type": "CourseInstance",
      name: `${titleText} - Online`,
      courseMode: "Online",
      url: `https://www.techpratham.com/courses/${course.link}`,
      courseWorkload: workloadIso
    });
  }

  baseSchema.hasCourseInstance = instances.length === 1 ? instances[0] : instances;

  // Optional offers if price exists
  if (course.price !== undefined && course.price !== null) {
    const priceVal = typeof course.price === 'string' ? course.price.replace(/[^\d.]/g, '') : course.price;
    baseSchema.hasCourseInstance = Array.isArray(baseSchema.hasCourseInstance)
      ? baseSchema.hasCourseInstance.map((inst: any) => ({
          ...inst,
          offers: {
            "@type": "Offer",
            url: `https://www.techpratham.com/courses/${course.link}`,
            price: priceVal,
            priceCurrency: course.priceCurrency || 'INR',
            availability: "https://schema.org/InStock"
          }
        }))
      : {
          ...baseSchema.hasCourseInstance,
          offers: {
            "@type": "Offer",
            url: `https://www.techpratham.com/courses/${course.link}`,
            price: priceVal,
            priceCurrency: course.priceCurrency || 'INR',
            availability: "https://schema.org/InStock"
          }
        };
  }

  return compact(baseSchema);
};

// ----------------------------
// Page component
// ----------------------------
const CourseDataPage: React.FC<CourseDataPageProps> = ({ course, error, navbarData }) => {
  const router = useRouter();
  const [showLeadForm, setShowLeadForm] = useState<boolean>(false);

  if (error || !course) {
    return (
      <React.Fragment>
        <Head>
          <title>Course Not Found | TechPratham</title>
        </Head>
        <Navbar navbarData={navbarData} />
        <div className="w-full h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              {error || 'Course not found'}
            </h1>
            <p className="text-gray-600 mb-6">
              The course you're looking for doesn't exist or has been removed.
            </p>
            <button
              onClick={() => router.push('/courses')}
              className="bg-red-700 text-white px-6 py-3 rounded-lg hover:bg-red-800 transition-colors"
            >
              Browse All Courses
            </button>
          </div>
        </div>
        <Footer />
      </React.Fragment>
    );
  }
  const leadFormKey = `leadFormInteracted_${course.link}`;
const leadFormSubmittedKey = `leadFormSubmitted_${course.link}`;
useEffect(() => {
  const hasInteracted = sessionStorage.getItem(leadFormKey);

  if (!hasInteracted) {
    const timer = setTimeout(() => {
      setShowLeadForm(true);
    }, 1000);

    return () => clearTimeout(timer);
  }
}, [leadFormKey]);

const handleCloseLeadForm = () => {
  setShowLeadForm(false);
  sessionStorage.setItem(leadFormKey, 'true');
};

const handleFormSuccess = () => {
  setShowLeadForm(false);
  sessionStorage.setItem(leadFormKey, 'true');
  sessionStorage.setItem(leadFormSubmittedKey, 'true');
};


const titleText = stripHtml(course.title || '');
const cleanDescription = stripHtml(course.shortDesc || course.description || '');
// const cleanDescription2 = stripHtml(course.shortDesc || course.description || '');
  const title = course.metadata?.title || `${titleText} | TechPratham - India's Leading IT Training Institute`;
  const description = course.metadata?.description || `${cleanDescription}`;
  const keywords = course.metadata?.keywords?.join(', ') || `${titleText}, TechPratham, IT Training`;
  const canonicalUrl = `https://www.techpratham.com/courses/${course.link}`;
  const ogImage = course.image_url;
  const ogTitle = titleText;
  const ogDescription = cleanDescription || course.description;

  // Build dynamic JSON-LD
  const dynamicSchema = getDynamicSchema(course);

  // Breadcrumb (kept separate)
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.techpratham.com"
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Courses",
        item: "https://www.techpratham.com/courses"
      },
      {
        "@type": "ListItem",
        position: 3,
        name: titleText,
        item: canonicalUrl
      }
    ]
  };

  // FAQ schema (if available)
  let faqSchema: any = undefined;
  if (Array.isArray(course.faqs_data) && course.faqs_data.length > 0) {
    faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: course.faqs_data.map((f) => ({
        "@type": "Question",
        name: stripHtml(f.que),
        acceptedAnswer: {
          "@type": "Answer",
          text: stripHtml(f.ans)
        }
      }))
    };
  }

  // Combine schemas into array to inject (remove undefined with compact)
const jsonLdArray = compact([dynamicSchema, breadcrumb, faqSchema]);
const safeCourse = {
  ...course,
  category: course.category || 'default-category',
}
  return (
    <React.Fragment>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:image" content={ogImage} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={ogTitle} />
        <meta name="twitter:description" content={ogDescription} />
        <meta name="twitter:image" content={ogImage} />
      </Head>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArray).replace(/</g, '\\u003c') }}
      />

      <Navbar navbarData={navbarData} />

      <div className="w-full h-auto flex flex-col items-center justify-center">
        <ReachForm />
        <ToolTip />
        {showLeadForm && (
          <LeadForm
            course={course}
            onClose={handleCloseLeadForm}
            onSuccess={handleFormSuccess}
          />
        )}
        <HeaderSection course={course} />
        <EmployeeLifecycle/>
        
        <ClientHome/>
        <IntroSection id="about" course={course} />
        
        <PlanSection id="training-plan" />
        <CurriculumSection id="course-curriculum" course={safeCourse} />
        <VideoSetion/>
        <TrainingBatches id="new-batch" course={course} />
        <WhoShouldTakeWorkday course={course} />
        <JobRole course={course} />
        <ProjectSection id="projects" course={course} />
        {/* <CertificateSection id="certificate" course={course} /> */}
        <SpecialityHome/>
        <NewComponent id="testimonials" />
       
        <PlacementHome id="placement"/>
        <TrainingComparison />
        <FaqSection id="faq" course={course} />
        {/* <OtherCourse course={course} /> */}
         <NewsHighlights/>
      </div>
{/* <ContactCourses/> */}
      <Footer />
    </React.Fragment>
  );
};

export default CourseDataPage;

