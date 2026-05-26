// Alternative implementation with direct database access
// Use this if the API approach still fails

import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';

// Import database utilities directly
import { connectMongo } from '@/utils/mongodb';
import course from '@/models/course';

import Navbar from '@/src/common/Navbar/Navbar';
import Footer from '@/src/common/Footer/Footer';
import { getNavbarData, NavbarData } from '@/utils/navbarData';
// ... other imports (same as original)

// ... interfaces (same as original)

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
  curriculum_data?: any[];
  skills_data?: string[];
  assesment_link?: string;
  faqs_data?: any[];
  metadata?: any;
  image_url: string;
  price?: number | string;
  priceCurrency?: string;
}

interface CourseDataPageProps {
  course: Course | null;
  error: string | null;
  navbarData: NavbarData;
}

// DIRECT DATABASE ACCESS - NO API CALLS
export const getServerSideProps: GetServerSideProps<CourseDataPageProps> = async (context: GetServerSidePropsContext) => {
  const { coursedata } = context.query;

  if (!coursedata || typeof coursedata !== 'string') {
    const navbarData = await getNavbarData();
    return { props: { course: null, error: 'Invalid course link', navbarData } };
  }

  try {
    console.log('Direct DB: Connecting to MongoDB...');
    
    // Connect to database directly
    await connectMongo();
    console.log('Direct DB: Connected successfully');
    
    // Query database directly
    console.log('Direct DB: Searching for course with link:', coursedata);
    const courseData = await course.findOne({ link: coursedata }).lean();
    
    if (!courseData) {
      console.log('Direct DB: Course not found');
      const navbarData = await getNavbarData();
      return { props: { course: null, error: 'Course not found', navbarData } };
    }

    console.log('Direct DB: Course found:', courseData.title);
    
    // Get navbar data
    const navbarData = await getNavbarData();
    
    // Convert MongoDB document to plain object
    const serializedCourse = JSON.parse(JSON.stringify(courseData));
    
    return { 
      props: { 
        course: serializedCourse, 
        error: null, 
        navbarData 
      } 
    };

  } catch (err) {
    console.error('Direct DB Error:', err);
    const navbarData = await getNavbarData();
    return { props: { course: null, error: 'Failed to fetch course data', navbarData } };
  }
};

// ... rest of component (same as original)
const CourseDataPage: React.FC<CourseDataPageProps> = ({ course, error, navbarData }) => {
  // ... same implementation as original
  return <div>Course page content...</div>;
};

export default CourseDataPage;