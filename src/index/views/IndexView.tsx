'use client';

import React, { useContext, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { UserContext } from '@/context/userContext';
import { toast } from 'sonner';

// ---------------------------------------------------------------------------
// Above-the-fold / lightweight: imported statically so they are part of the
// initial render and hydrate immediately.
// ---------------------------------------------------------------------------
import CoursesHome from '../components/CoursesHome/CoursesHome';
import HeroHome from '../components/HeroHome/HeroHome';
import ReachForm from '@/components/common/ReachForm/ReachForm';
import ToolTip from '@/components/common/ToolTip/ToolTip';


const sectionFallback = (minHeight: number) => () => (
  <div style={{ minHeight }} aria-hidden="true" />
);

// ClientHome pulls in framer-motion (the animated logo cloud). It sits just
// below the hero but is not the LCP element, so we defer its JS chunk to keep
// framer-motion out of the initial bundle. SSR stays on so the markup is in the
// HTML (no CLS / SEO-safe); a reserved height prevents any shift.
const ClientHome = dynamic(() => import('../components/ClientHome/ClientHome'), {
  loading: sectionFallback(200),
});
const NewComponent = dynamic(() => import('../components/NewComponent/NewComponent'), {
  loading: sectionFallback(400),
});
const CareerHome = dynamic(() => import('../components/CareerHome/CareerHome'), {
  loading: sectionFallback(400),
});
const RecognitionHome = dynamic(() => import('../components/RecognitionHome/RecognitionHome'), {
  loading: sectionFallback(400),
});
const PlacementHome = dynamic(() => import('../components/PlacementHome/PlacementHome'), {
  loading: sectionFallback(400),
});
const SpecialityHome = dynamic(() => import('../components/SpecialityHome/SpecialityHome'), {
  loading: sectionFallback(400),
});
const Youtub = dynamic(() => import('../../about/components/BannerAbout/BannerAbout'), {
  loading: sectionFallback(300),
});
const AlumniHome = dynamic(() => import('../components/AlumniHome/AlumniHome'), {
  loading: sectionFallback(300),
});
const EducatorHome = dynamic(() => import('../components/EducatorHome/EducatorHome'), {
  loading: sectionFallback(400),
});
const TestmonialHome = dynamic(() => import('../components/TestmonialHome/TestmonialHome'), {
  loading: sectionFallback(400),
});
const BlogsHome = dynamic(() => import('../components/BlogsHome/BlogsHome'), {
  loading: sectionFallback(400),
});
const NewsHighlights = dynamic(() => import('../components/News/News'), {
  loading: sectionFallback(300),
});


interface Course {
  _id?: string;
  id?: string;
  title: string;
  image: string;
  alt?: string;
  category: string;
  link: string;
  shortDesc?: string;
  level?: string;
  rating?: number;
  duration?: string;
  description?: string;
  trending?: boolean;
}

interface CourseCategory {
  name: string;
  courses: Course[];
}

interface EventItem {
  _id: string;
  type: "video" | "placement" | "hiring";
  videoUrl?: string;
  image?: string;
}

interface IndexViewProps {
  initialTrendingCourses?: Course[];
  initialGroupedCourses?: CourseCategory[];
  initialEvents?: EventItem[];
}

const IndexView: React.FC<IndexViewProps> = ({ 
  initialTrendingCourses = [],
  initialGroupedCourses = [],
  initialEvents = []
}) => {
  const { setActiveTab } = useContext(UserContext);

  useEffect(() => {
    setActiveTab('home');
  }, [setActiveTab]);

  const [course, setCourse] = useState<Course[]>(initialTrendingCourses);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Only fetch if no initial data provided (fallback for client-side navigation)
  useEffect(() => {
    if (initialTrendingCourses.length > 0) {
      // Already have server-side data, no need to fetch
      return;
    }

    const fetchCourseData = async (): Promise<void> => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/get-course/trending`);
        if (!res.ok) throw new Error(`API request failed with status ${res.status}`);

        const data: Course[] = await res.json();
        setCourse(data);
      } catch (error: any) {
        console.error("Failed to fetch course data:", error);
        toast.error("Failed to fetch course data. Please try again.");
        setCourse([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseData();
  }, [initialTrendingCourses]);

  return (
    <div className='w-full h-auto flex flex-col items-center justify-center relative'>

      <ReachForm />

      <ToolTip />

      <HeroHome />

      <ClientHome />

      {/* <section id="courses"> */}
  <CoursesHome initialGroupedCourses={initialGroupedCourses} />
{/* </section> */}
      <NewComponent initialEvents={initialEvents} />

      <CareerHome />

      {/* <CertificationHome /> */}

      <RecognitionHome />

      <PlacementHome />

      <SpecialityHome />

      

      <Youtub />

      <AlumniHome />
<EducatorHome />
      <TestmonialHome />

      <BlogsHome />
<NewsHighlights/>
      <section id="contact">
  {/* <ContactHome /> */}
</section>

    </div>
  )
}

export default IndexView;