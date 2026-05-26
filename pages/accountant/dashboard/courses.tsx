import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { UserContext } from '@/context/userContext';
import SignOut from '@/src/account/common/SignOut';
import AdminLoader from '@/src/account/common/AdminLoader';
import AccountantSidebar from '@/src/account/common/AccountantSidebar';
import AccountantTopBar from '@/src/account/common/AccountantTopBar';
import { Badge } from '@/components/ui/badge';
import { Pencil2Icon, PlusIcon, TrashIcon } from '@radix-ui/react-icons';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from 'sonner';
import Head from 'next/head';

const courses = () => {
  const { authenticated, loading, isAccountant, currentTab, setCurrentTab } = useContext(UserContext);

  const [courseData, setCourseData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingCourseId, setDeletingCourseId] = useState(null);

  const fetchCourseData = async () => {
    setIsLoading(true);
    try {
      if (!authenticated) {
        return;
      }

      // Add cache busting parameter to force fresh data
      const res = await fetch(`/api/course/fetch?t=${Date.now()}`, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      if (!res.ok) throw new Error(`API request failed with status ${res.status}`);

      const data = await res.json();
      setCourseData(data);
    } catch (error) {
      console.error("Failed to fetch course data:", error);
      if (authenticated) {
        setCourseData([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCourse = async (courseLink: string, courseId: any) => {
    setIsDeleting(true);
    setDeletingCourseId(courseId);

    try {
      const res = await fetch(`/api/course/delete?link=${encodeURIComponent(courseLink)}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error(`Failed to delete course: ${res.status}`);
      }

      const result = await res.json();

      setCourseData(prevData => prevData.filter((course: any) => course._id !== courseId));

      // Clear all caches after successful deletion
      await fetch('/api/admin/clear-course-cache', { method: 'POST' });
      await fetch('/api/admin/refresh-navbar-cache', { method: 'POST' });

      console.log('Course deleted successfully:', result);
      toast.success('Course deleted successfully.')
    } catch (error) {
      console.error("Failed to delete course:", error);
      toast.error('Failed to delete course. Please try again.');
    } finally {
      setIsDeleting(false);
      setDeletingCourseId(null);
    }
  };

  useEffect(() => {
    if (authenticated) {
      fetchCourseData();
    }
  }, [authenticated])

  useEffect(() => {
    setCurrentTab("courses");
  }, [currentTab]);

  return (
    <React.Fragment>
      <Head>
        <link rel="icon" href="/favicon.ico" type="image/ico" sizes="70x70" />
        <title>Courses | Accountant Dashboard</title>
        <meta name="description" content="Course Section in Accountant Dashboard of TechPratham." />
      </Head>

      {loading ? (
        <AdminLoader />
      ) : (!authenticated || !isAccountant) ? (
        <SignOut />
      ) : (
        <div className='w-full h-full md:h-screen min-h-screen flex flex-row items-start justify-start fixed'>

          <AccountantSidebar />

          <div className='bg-[#000] flex flex-col w-full h-full md:relative fixed'>

            <AccountantTopBar />

            {isLoading ? (
              <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading course data...</p>
                </div>
              </div>
            ) : (
              <div className="bg-black p-6 overflow-y-auto">
                <div className='w-full h-auto flex flex-row items-start justify-between'>
                  <h2 className="text-xl font-semibold text-white mb-4">All Courses</h2>
                  <Link href='/accountant/dashboard/courses/create' className='flex flex-row items-center justify-center text-white'>
                    <PlusIcon className='w-5 h-5' />
                    <span className='ml-2'>Create Course</span>
                  </Link>
                </div>
                <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 w-full justify-items-center">
                  {courseData.map((course: any, index: any) => (
                    <div
                      key={index}
                      className="w-full max-w-sm h-auto flex flex-col p-6 shadow-md transition-all duration-300 bg-[#1a1a1a] text-white"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="text-xl font-semibold text-white leading-tight flex-1 pr-2"><span dangerouslySetInnerHTML={{ __html: course.title }} /></div>
                      </div>

                      <div className="mb-3 w-full flex flex-row justify-between items-center">
                        <Badge variant='secondary'>
                          {course.category}
                        </Badge>
                        <Badge variant='secondary'>
                          {course.level}
                        </Badge>
                      </div>

                      <div className="text-sm text-gray-600 mb-4 flex-grow leading-relaxed"><div dangerouslySetInnerHTML={{ __html: course.shortDesc }} /></div>

                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500">★</span>
                          <span className="text-yellow-600 font-medium">{course.rating}</span>
                        </div>
                        <Badge variant='secondary'>
                          {course.duration}
                        </Badge>
                      </div>

                      <div className='w-full flex flex-row gap-2'>
                        <Link href={`/courses/${encodeURIComponent(course.link)}`} className="w-full">
                          <Button variant="manual" className="w-full">Explore Course</Button>
                        </Link>
                        <Link href={`/accountant/dashboard/courses/update/${encodeURIComponent(course.link)}`} className="w-auto">
                          <Button variant="manual" className="w-auto">
                            <Pencil2Icon className='w-5 h-5' />
                          </Button>
                        </Link>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant='manual'
                              disabled={isDeleting && deletingCourseId === course._id}
                            >
                              {isDeleting && deletingCourseId === course._id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              ) : (
                                <TrashIcon className='w-5 h-5' />
                              )}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className='bg-white'>
                            <DialogHeader>
                              <DialogTitle>Are you absolutely sure?</DialogTitle>
                            </DialogHeader>
                            <DialogDescription>
                              This action cannot be undone. This will permanently delete the course "{<span dangerouslySetInnerHTML={{ __html: course.title }} />}"
                              and remove all its data from the servers.
                            </DialogDescription>
                            <DialogFooter>
                              <Button
                                variant='destructive'
                                onClick={() => deleteCourse(course.link, course._id)}
                                disabled={isDeleting}
                              >
                                {isDeleting && deletingCourseId === course._id ? 'Deleting...' : 'Delete'}
                              </Button>
                              {/* <Button variant='outline'>Cancel</Button> */}
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </React.Fragment>
  )
}

export default courses