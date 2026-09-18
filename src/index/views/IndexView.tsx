'use client';

import React, { useContext, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { UserContext } from '@/context/userContext';
import { toast } from 'sonner';

// ---------------------------------------------------------------------------
// Above-the-fold / lightweight: imported statically so they are part of the
// initial render and hydrate immediately.
// ---------------------------------------------------------------------------
import ClientHome from '../components/ClientHome/ClientHome';
import CoursesHome from '../components/CoursesHome/CoursesHome';
import HeroHome from '../components/HeroHome/HeroHome';
import ReachForm from '@/components/common/ReachForm/ReachForm';
import ToolTip from '@/components/common/ToolTip/ToolTip';

// ---------------------------------------------------------------------------
// Below-the-fold sections: code-split with next/dynamic so their (heavy)
// carousel / animation JavaScript ships in separate chunks and does NOT run
// during the initial hydration pass. This is the main lever for cutting Total
// Blocking Time. SSR is kept on (ssr: true, the default) so the markup is
// still present in the server HTML for SEO — only the client JS is deferred.
// Each placeholder reserves vertical space to avoid layout shift (CLS).
// ---------------------------------------------------------------------------
const sectionFallback = (minHeight: number) => () => (
  <div style={{ minHeight }} aria-hidden="true" />
);

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