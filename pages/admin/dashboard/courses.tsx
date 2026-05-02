import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { UserContext } from '@/context/userContext';
import SignOut from '@/src/account/common/SignOut';
import AdminLoader from '@/src/account/common/AdminLoader';
import AdminSidebar from '@/src/account/common/AdminSidebar';
import AdminTopBar from '@/src/account/common/AdminTopBar';
import { Badge } from '@/components/ui/badge';
import { Pencil2Icon, PlusIcon, TrashIcon } from '@radix-ui/react-icons';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from 'sonner';
import Head from 'next/head';

interface Category {
  _id: string;
  name: string;
  description: string;
  priority?: number;
  position: number;
}

const courses = () => {
  const { authenticated, loading, isAdmin, currentTab, setCurrentTab } = useContext(UserContext);

  const [courseData, setCourseData] = useState([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingCourseId, setDeletingCourseId] = useState(null);

  const fetchCategories = async () => {
    setIsLoadingCategories(true);
    try {
      const res = await fetch('/api/category/fetch');
      if (!res.ok) throw new Error(`Failed to fetch categories: ${res.status}`);
      
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      toast.error('Failed to fetch categories. Please try again.');
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const fetchCourseData = async (category = 'all') => {
    setIsLoading(true);
    try {
      if (!authenticated) {
        return;
      }

      // Build API URL based on selected category
      const apiUrl = category === 'all' 
        ? '/api/course/fetch'
        : `/api/course/fetch?category=${encodeURIComponent(category)}`;

      const res = await fetch(apiUrl);
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

      // Remove the deleted course from the current view
      setCourseData(prevData => prevData.filter((course: any) => course._id !== courseId));

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

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    fetchCourseData(category);
  };

  useEffect(() => {
    if (authenticated) {
      fetchCategories();
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
        <title>Courses | Admin Dashboard</title>
        <meta name="description" content="Course Section in Admin Dashboard of TechPratham." />
      </Head>

      {loading ? (
        <AdminLoader />
      ) : (!authenticated || !isAdmin) ? (
        <SignOut />
      ) : (
        <div className='w-full h-full md:h-screen min-h-screen flex flex-row items-start justify-start fixed'>

          <AdminSidebar />

          <div className='bg-[#000] flex flex-col w-full h-full md:relative fixed'>

            <AdminTopBar />

            {isLoading ? (
              <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading course data...</p>
                </div>
              </div>
            ) : (
              <div className="bg-black p-6 overflow-y-auto">
                <div className='w-full h-auto flex flex-col gap-4'>
                  <div className='w-full flex flex-row items-center justify-between'>
                    <h2 className="text-xl font-semibold text-white">All Courses</h2>
                    <Link href='/admin/dashboard/courses/create' className='flex flex-row items-center justify-center text-white'>
                      <PlusIcon className='w-5 h-5' />
                      <span className='ml-2'>Create Course</span>
                    </Link>
                  </div>

                  {/* Category Filter Dropdown */}
                  <div className='w-full flex flex-row items-center gap-4'>
                    <span className='text-white text-sm font-medium'>Filter by Category:</span>
                    <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                      <SelectTrigger className="w-64 bg-[#1a1a1a] border-gray-600 text-white">
                        <SelectValue placeholder={isLoadingCategories ? "Loading categories..." : "Select category"} />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1a1a] border-gray-600">
                        <SelectItem value="all" className="text-white hover:bg-gray-700">
                          All Categories
                        </SelectItem>
                        {categories.map((category: any) => (
                          <SelectItem 
                            key={category._id} 
                            value={category.name}
                            className="text-white hover:bg-gray-700"
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedCategory !== 'all' && (
                      <Badge variant="outline" className="text-white border-gray-600">
                        {courseData.length} course{courseData.length !== 1 ? 's' : ''} in {selectedCategory}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 w-full justify-items-center mt-6">
                  {courseData.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                      <div className="text-gray-400 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-white mb-2">
                        {selectedCategory === 'all' ? 'No courses found' : `No courses found in "${selectedCategory}"`}
                      </h3>
                      <p className="text-gray-400 mb-4">
                        {selectedCategory === 'all' 
                          ? 'Get started by creating your first course.' 
                          : 'Try selecting a different category or create a new course in this category.'
                        }
                      </p>
                      {selectedCategory !== 'all' && (
                        <Button 
                          variant="outline" 
                          onClick={() => handleCategoryChange('all')}
                          className="text-white border-gray-600 hover:bg-gray-700"
                        >
                          View All Courses
                        </Button>
                      )}
                    </div>
                  ) : (
                    courseData.map((course: any, index: any) => (
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
                        <Link href={`/admin/dashboard/courses/update/${encodeURIComponent(course.link)}`} className="w-auto">
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
                  ))
                  )}
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