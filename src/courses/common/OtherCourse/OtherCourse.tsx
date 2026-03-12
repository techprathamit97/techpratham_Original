import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { toast } from 'sonner';

const OtherCourse = ({ course }: any) => {
    const [courseData, setCourseData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchCourseData = async () => {
            if (!course || !course.category) {
                return;
            }

            setIsLoading(true);
            try {
                const response = await fetch(`/api/course/filtered?category=${encodeURIComponent(course.category)}`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                const filteredCourses = data.courses ?
                    data.courses.filter((c: any) => c._id !== course._id || c.title !== course.title) :
                    [];

                setCourseData(filteredCourses);
            } catch (error: any) {
                console.error("Failed to fetch course data:", error);
                toast.error("Failed to load related courses");
                setCourseData([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourseData();
    }, [course]);

    if (!course || !course.category) {
        return null;
    }

    return (
        <div className='w-full h-auto flex flex-col gap-10 items-center justify-center text-black'>
            <div className='md:w-10/12 w-11/12 flex flex-col items-center justify-center py-16 h-auto'>
                <h2 className="md:text-3xl text-2xl md:font-semibold font-medium text-transparent bg-clip-text bg-gradient-to-r from-[#CD4647] to-[#7F3B40] capitalize mb-10">
                    Other {course.category} Courses
                </h2>

                {isLoading ? (
                    <div className="grid xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-6 w-full justify-items-center">
                        {[1, 2, 3].map((index) => (
                            <div
                                key={index}
                                className="w-full max-w-sm h-auto flex flex-col p-6 border rounded-xl shadow-md bg-white animate-pulse"
                            >
                                <div className="w-full h-48 bg-gray-300 rounded-md mb-4"></div>
                                <div className="h-6 bg-gray-300 rounded mb-3"></div>
                                <div className="h-4 bg-gray-200 rounded mb-3 w-20"></div>
                                <div className="h-16 bg-gray-200 rounded mb-4"></div>
                                <div className="flex justify-between items-center mb-4">
                                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                                    <div className="h-4 bg-gray-200 rounded w-12"></div>
                                </div>
                                <div className="h-10 bg-gray-300 rounded"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        {courseData.length > 0 ? (
                            <div className="grid xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-6 w-full justify-items-center">
                                {courseData.slice(0, 3).map((courseItem: any, index) => (
                                    <div
                                        key={courseItem._id || index}
                                        className="w-full max-w-sm h-auto flex flex-col p-6 border rounded-xl shadow-md hover:shadow-lg transition-all duration-300 bg-white"
                                    >
                                        <Image
                                            src={courseItem?.image || '/placeholder-course.jpg'}
                                            alt={courseItem?.title || 'Course image'}
                                            width={400}
                                            height={200}
                                            className="w-full h-48 object-cover rounded-md border border-[#dddedd] mb-4"
                                            onError={(e) => {
                                                e.currentTarget.src = '/placeholder-course.jpg';
                                            }}
                                        />
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="text-xl font-semibold text-gray-800 leading-tight flex-1 pr-2">
                                               
                                                 <span
                                                    dangerouslySetInnerHTML={{ __html: courseItem?.title }}
                                                />
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                {courseItem?.category}
                                            </span>
                                        </div>

                                        <div
                                            className="text-sm text-gray-600 mb-4 flex-grow leading-relaxed"
                                            dangerouslySetInnerHTML={{ __html: courseItem?.shortDesc }}
                                        />

                                        <div className="flex justify-between items-center mb-4">
                                            <div className="flex items-center gap-1">
                                                <span className="text-yellow-500">★</span>
                                                <span className="text-yellow-600 font-medium">
                                                    {courseItem?.rating || '4.5'}
                                                </span>
                                            </div>
                                            <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                {courseItem?.duration}
                                            </div>
                                        </div>

                                        <Link href={`/courses/${courseItem?.link}`} className="w-full">
                                            <Button
                                                variant="default"
                                                className="w-full bg-gradient-to-r from-[#CD4647] to-[#7F3B40] hover:from-[#B73E3F] hover:to-[#6F3336] transition-all duration-200"
                                            >
                                                View Details
                                            </Button>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 py-8">
                                <div className="mb-4">
                                    <div className="text-6xl mb-4">📚</div>
                                    <h3 className="text-xl font-medium mb-2">No Related Courses Found</h3>
                                    <p>We couldn't find any other courses in the "{course.category}" category at the moment.</p>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default OtherCourse;