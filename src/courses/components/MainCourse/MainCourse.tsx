import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

const MainCourse = ({ course, isLoading }: any) => {
  const courseData = course || [];

  const getLevelColor = (level: any) => {
    switch (level) {
      case 'Beginner': return 'text-green-600 bg-green-50'
      case 'Intermediate': return 'text-blue-600 bg-blue-50'
      case 'Advanced': return 'text-purple-600 bg-purple-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  if (isLoading) {
    return (
      <div className='w-full h-auto flex flex-col gap-10 items-center justify-center py-12 text-black'>
        <div className='md:w-10/12 w-11/12 flex flex-col items-center justify-center h-auto'>
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 w-full justify-items-center">
            {Array(6).fill(0).map((_, index) => (
              <div key={index} className="w-full max-w-sm h-auto flex flex-col p-6 border rounded-xl shadow-md bg-white">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 pr-2">
                    <Skeleton className="h-6 w-3/4" />
                  </div>
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
                <div className="mb-3">
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
                <div className="mb-4 flex-grow">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-4/5 mb-2" />
                  <Skeleton className="h-4 w-3/5" />
                </div>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-1">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-8" />
                  </div>
                  <Skeleton className="h-6 w-16 rounded" />
                </div>
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state - when course data is not an array
  if (!courseData || !Array.isArray(courseData)) {
    return (
      <div className='w-full h-auto flex flex-col gap-10 items-center justify-center py-12 text-black'>
        <div className='md:w-10/12 w-11/12 flex flex-col items-center justify-center h-auto'>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4">
              <svg
                className="w-16 h-16 text-gray-400 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Something went wrong
            </h3>
            <p className="text-gray-600 mb-6">
              Unable to load courses. Please try refreshing the page.
            </p>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Refresh Page
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Empty state - when course data array is empty
  if (courseData.length === 0) {
    return (
      <div className='w-full h-auto flex flex-col gap-10 items-center justify-center py-12 text-black'>
        <div className='md:w-10/12 w-11/12 flex flex-col items-center justify-center h-auto'>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4">
              <svg
                className="w-16 h-16 text-gray-400 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No courses available
            </h3>
            <p className="text-gray-600 mb-6">
              We couldn't find any courses at the moment. Check back later for new courses.
            </p>
            <Link href="/contact">
              <Button
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full h-auto flex flex-col gap-10 items-center justify-center py-12 text-black'>

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

              <div className="text-sm text-gray-600 mb-4 flex-grow leading-relaxed"><span dangerouslySetInnerHTML={{ __html: course.shortDesc }} /></div>

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
                  Enroll Now
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MainCourse