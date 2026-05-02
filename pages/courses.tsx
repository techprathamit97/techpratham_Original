// import React from 'react';
// import Head from 'next/head';

// import type { NextPage } from 'next';
// import CoursesView from '@/src/courses/views/CoursesView';
// import { CoursesController } from '@/src/courses/controller/CoursesController';



// const CoursesPage: NextPage = () => {
//     return (
//         <div>
//             <CoursesController>
//                 <Head>
//                     <link rel="icon" href="/favicon.ico" type="image/ico" sizes="70x70" />
//                     <title>Courses | TechPratham - India's Leading IT Training Institute</title>
//                     <meta name="description" content="Explore a wide range of IT courses at TechPratham. Advance your career with industry-relevant training and expert-led classes in programming, data science, cloud, and more." />
//                     <meta name="keywords" content="TechPratham Courses, IT Training, Programming Courses, Data Science, Cloud Computing, Best IT Institute India, Online IT Courses" />
//                     <meta name="author" content="the-bipu" />

//                     <meta property="og:title" content="Courses | TechPratham - India's Leading IT Training Institute" />
//                     <meta property="og:description" content="Browse our comprehensive IT courses and boost your skills with TechPratham's expert-led training programs." />
//                     <meta property="og:image" content="/navbar/techpratham.svg" />
//                     <meta property="og:url" content="https://www.techpratham.com/courses" />

//                     <meta name="twitter:card" content="summary_large_image" />
//                     <meta name="twitter:title" content="Courses | TechPratham - India's Leading IT Training Institute" />
//                     <meta name="twitter:description" content="Advance your IT career with TechPratham's industry-focused courses and hands-on learning." />
//                     <meta name="twitter:image" content="/navbar/techpratham.svg" />
//                 </Head>

//                 <CoursesView />
//             </CoursesController>
//         </div>
//     );
// };

// export default CoursesPage;



import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import type { NextPage, GetServerSideProps } from 'next';
import CoursesView from '@/src/courses/views/CoursesView';
import { IndexController } from '@/src/index/controller/IndexController';
import { getNavbarData, NavbarData } from '@/utils/navbarData';

/* -------------------- Types -------------------- */

interface Course {
  id: string;
  title: string;               
  shortDescription: string;    
  link: string;
  rating?: number;
  ratingCount?: number;
}

interface CoursesPageProps {
  initialCourses: Course[];
  navbarData: NavbarData;
}

/* -------------------- Helpers -------------------- */
/** Convert HTML (Quill) → plain text for JSON-LD */
const stripHtml = (html = ''): string =>
  html.replace(/<[^>]*>?/gm, '').trim();

const CoursesPage: NextPage<CoursesPageProps> = ({ initialCourses, navbarData }) => {
  const [courses, setCourses] = useState<Course[]>(initialCourses);

  /* -------------------- Fetch courses (fallback for client-side navigation) -------------------- */
  useEffect(() => {
    if (initialCourses.length > 0) {
      // Already have server-side data
      return;
    }

    const fetchCourses = async () => {
      try {
        const res = await fetch('/api/get-course/pages?page=1');
        const data = await res.json();
        setCourses(data);
      } catch (error) {
        console.error('Failed to fetch courses for JSON-LD', error);
      }
    };

    fetchCourses();
  }, [initialCourses]);

  return (
    <div>
      <IndexController navbarData={navbarData}>
        {/* -------------------- META TAGS -------------------- */}
        <Head>
          <link rel="icon" href="/favicon.ico" type="image/ico" sizes="70x70" />
          <title>Courses | TechPratham - India's Leading IT Training Institute</title>

          <meta
            name="description"
            content="Explore a wide range of IT courses at TechPratham. Advance your career with industry-relevant training and expert-led classes."
          />
          <meta
            name="keywords"
            content="TechPratham Courses, IT Training, Programming Courses, Data Science, Cloud Computing"
          />
          <meta name="author" content="TechPratham" />

          {/* Open Graph */}
          <meta property="og:title" content="Courses | TechPratham" />
          <meta
            property="og:description"
            content="Browse our comprehensive IT courses and boost your skills with TechPratham."
          />
          <meta property="og:image" content="/navbar/techpratham.svg" />
          <meta property="og:url" content="https://www.techpratham.com/courses" />

          {/* Twitter */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Courses | TechPratham" />
          <meta
            name="twitter:description"
            content="Advance your IT career with TechPratham's expert-led courses."
          />
          <meta name="twitter:image" content="/navbar/techpratham.svg" />
        </Head>

        {/* -------------------- JSON-LD (SEO) -------------------- */}
        {courses.map((course, index) => (
          <Script
            key={course.id || index}
            id={`course-schema-${index}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Course",

                name: stripHtml(course.title),
                description:
                  stripHtml(course.shortDescription) ||
                  "Learn more about this course at TechPratham",

                provider: {
                  "@type": "Organization",
                  name: "TechPratham",
                  sameAs: "https://www.techpratham.com/"
                },

                aggregateRating: {
                  "@type": "AggregateRating",
                  ratingValue: (course.rating ?? 4.9).toString(),
                  bestRating: "5",
                  ratingCount: (course.ratingCount ?? 100).toString()
                },

                hasCourseInstance: {
                  "@type": "CourseInstance",
                  courseMode: "Online",
                  courseWorkload: "PT40H"
                }
              })
            }}
          />
        ))}

        {/* -------------------- UI -------------------- */}
        <CoursesView />
        
      </IndexController>
    </div>
  );
};// Server-side data fetching - runs on every request
export const getServerSideProps: GetServerSideProps<CoursesPageProps> = async (context) => {
  try {
    // Fetch courses on the server
    // Use absolute URL for server-side fetch
    const protocol = context.req.headers.host?.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${context.req.headers.host}`;
    
    const res = await fetch(`${baseUrl}/api/get-course/pages?page=1`);
    
    if (!res.ok) {
      throw new Error('Failed to fetch courses');
    }
    
    const courses: Course[] = await res.json();
    
    // Fetch navbar data
    const navbarData = await getNavbarData();
    
    return {
      props: {
        initialCourses: courses || [],
        navbarData,
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    // Return empty data on error so page still renders
    const navbarData = await getNavbarData();
    return {
      props: {
        initialCourses: [],
        navbarData,
      },
    };
  }
};

export default CoursesPage;
