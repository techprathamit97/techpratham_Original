// 'use client';

// import React, { useContext, useEffect, useState } from 'react';
// import { UserContext } from '@/context/userContext';
// import { toast } from 'sonner';

// import ClientHome from '../components/ClientHome/ClientHome';
// import CoursesHome from '../components/CoursesHome/CoursesHome';
// import CareerHome from '../components/CareerHome/CareerHome';
// import CertificationHome from '../components/CertificationHome/CertificationHome';
// import EducatorHome from '../components/EducatorHome/EducatorHome';
// import RecognitionHome from '../components/RecognitionHome/RecognitionHome';
// import PlacementHome from '../components/PlacementHome/PlacementHome';
// import SpecialityHome from '../components/SpecialityHome/SpecialityHome';
// import BannerHome from '../components/BannerHome/BannerHome';
// import AlumniHome from '../components/AlumniHome/AlumniHome';
// import TestmonialHome from '../components/TestmonialHome/TestmonialHome';
// import BlogsHome from '../components/BlogsHome/BlogsHome';
// import ContactHome from '../components/ContactHome/ContactHome';
// import HeroHome from '../components/HeroHome/HeroHome';
// import ReachForm from '@/components/common/ReachForm/ReachForm';
// import ToolTip from '@/components/common/ToolTip/ToolTip';

// interface Course {
//   id: string;
//   title: string;
//   image: string;
//   category: string;
//   link: string;
//   shortDesc: string;
//   level: string;
//   rating: number;
//   duration: string;
//   description: string;
// }

// const IndexView: React.FC = () => {
//   const { setActiveTab } = useContext(UserContext);

//   useEffect(() => {
//     setActiveTab('home');
//   }, [setActiveTab]);

//   const [course, setCourse] = useState<Course[]>([]);
//   const [isLoading, setIsLoading] = useState<boolean>(false);

//   useEffect(() => {
//     const fetchCourseData = async (): Promise<void> => {
//       setIsLoading(true);
//       try {
//         const res = await fetch(`/api/get-course/trending`);
//         if (!res.ok) throw new Error(`API request failed with status ${res.status}`);

//         const data: Course[] = await res.json();
//         setCourse(data);
//       } catch (error: any) {
//         console.error("Failed to fetch course data:", error);
//         toast.error("Failed to fetch course data. Please try again.");
//         setCourse([]);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchCourseData();
//   }, []);

  
//   return (
//     <div className='w-full h-auto flex flex-col items-center justify-center relative'>

//       <ReachForm />

//       <ToolTip />

//       <HeroHome />

//       <ClientHome />

//       <CoursesHome courses={course} />

//       <CareerHome />

//       <CertificationHome />

//       <RecognitionHome />

//       <PlacementHome />

//       <SpecialityHome />

//       <EducatorHome />

//       <BannerHome />

//       <AlumniHome />

//       <TestmonialHome />

//       <BlogsHome />

//       <ContactHome />

//     </div>
//   )
// }

// export default IndexView;


'use client';

import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '@/context/userContext';
import { toast } from 'sonner';

import ClientHome from '../components/ClientHome/ClientHome';
import CoursesHome from '../components/CoursesHome/CoursesHome';
import CareerHome from '../components/CareerHome/CareerHome';
import CertificationHome from '../components/CertificationHome/event';
import EducatorHome from '../components/EducatorHome/EducatorHome';
import RecognitionHome from '../components/RecognitionHome/RecognitionHome';
import PlacementHome from '../components/PlacementHome/PlacementHome';
import SpecialityHome from '../components/SpecialityHome/SpecialityHome';
import BannerHome from '../components/BannerHome/BannerHome';
import AlumniHome from '../components/AlumniHome/AlumniHome';
import TestmonialHome from '../components/TestmonialHome/TestmonialHome';
import BlogsHome from '../components/BlogsHome/BlogsHome';
import ContactHome from '../components/ContactHome/ContactHome';
import HeroHome from '../components/HeroHome/HeroHome';
import ReachForm from '@/components/common/ReachForm/ReachForm';
import ToolTip from '@/components/common/ToolTip/ToolTip';
import Youtub from '../../about/components/BannerAbout/BannerAbout'
import NewComponent from '../components/NewComponent/NewComponent';
import NewsHighlights from '../components/News/News';


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
  <ContactHome />
</section>

    </div>
  )
}

export default IndexView;