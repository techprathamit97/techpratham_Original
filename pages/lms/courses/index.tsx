import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '@/context/userContext';
import LMSLayout from '@/src/lms/common/LMSLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  BookOpen, 
  Search, 
  Plus, 
  Users, 
  Clock, 
  Star,
  Eye,
  Edit,
  Trash2,
  TrendingUp,
  Award,
  DollarSign
} from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

interface Course {
  _id: string;
  title: string;
  link: string;
  shortDesc: string;
  image: string;
  category: string;
  level: string;
  duration: string;
  rating: string;
  trending: boolean;
  priority: number;
  createdAt: string;
}

const CoursesManagement = () => {
  const { authenticated, loading, isAdmin } = useContext(UserContext);
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledData, setEnrolledData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterLevel, setFilterLevel] = useState('all');

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const [coursesRes, enrolledRes] = await Promise.all([
        fetch('/api/course/fetch'),
        fetch('/api/course/enrolled')
      ]);
      
      const coursesData = await coursesRes.json();
      const enrolledData = await enrolledRes.json();
      
      if (coursesRes.ok) {
        setCourses(Array.isArray(coursesData) ? coursesData : []);
      }
      if (enrolledRes.ok) {
        setEnrolledData(Array.isArray(enrolledData) ? enrolledData : []);
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      toast.error('Failed to fetch courses');
    } finally {
      setIsLoading(false);
    }
  };

  const getEnrollmentStats = (courseLink: string) => {
    const enrollments = enrolledData.filter(e => e.course_link === courseLink);
    return {
      total: enrollments.length,
      active: enrollments.filter(e => e.verifyPayment && !e.courseCompletion).length,
      completed: enrollments.filter(e => e.courseCompletion).length,
      revenue: enrollments.reduce((sum, e) => sum + (e.advanceAmount || 0), 0)
    };
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.shortDesc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = 
      filterCategory === 'all' || course.category === filterCategory;

    const matchesLevel = 
      filterLevel === 'all' || course.level === filterLevel;

    return matchesSearch && matchesCategory && matchesLevel;
  });

  const uniqueCategories = [...new Set(courses.map(c => c.category))];
  const uniqueLevels = [...new Set(courses.map(c => c.level))];

  const totalStats = {
    totalCourses: courses.length,
    totalEnrollments: enrolledData.length,
    totalRevenue: enrolledData.reduce((sum, e) => sum + (e.advanceAmount || 0), 0),
    avgRating: courses.length > 0 ? 
      (courses.reduce((sum, c) => sum + parseFloat(c.rating || '0'), 0) / courses.length).toFixed(1) : '0'
  };

  useEffect(() => {
    if (authenticated && isAdmin) {
      fetchCourses();
    }
  }, [authenticated, isAdmin]);

  if (loading || !authenticated || !isAdmin) {
    return <div>Loading...</div>;
  }

  return (
    <LMSLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Courses Management</h1>
            <p className="text-gray-400 mt-2">Manage course catalog and track performance</p>
          </div>
          <Button variant="manual" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New Course
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Courses</p>
                  <p className="text-2xl font-bold text-white">{totalStats.totalCourses}</p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Enrollments</p>
                  <p className="text-2xl font-bold text-white">{totalStats.totalEnrollments}</p>
                </div>
                <Users className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Revenue</p>
                  <p className="text-2xl font-bold text-white">₹{totalStats.totalRevenue.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Average Rating</p>
                  <p className="text-2xl font-bold text-white">{totalStats.avgRating}</p>
                </div>
                <Star className="h-8 w-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search courses by title, description, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white"
                />
              </div>
              
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-48 bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="all">All Categories</SelectItem>
                  {uniqueCategories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterLevel} onValueChange={setFilterLevel}>
                <SelectTrigger className="w-48 bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Filter by level" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="all">All Levels</SelectItem>
                  {uniqueLevels.map(level => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Courses Grid */}
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-400">Loading courses...</p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">No courses found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => {
              const stats = getEnrollmentStats(course.link);
              
              return (
                <Card key={course._id} className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
                  <div className="relative">
                    <Image
                      src={course.image}
                      alt={course.title}
                      width={400}
                      height={200}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    {course.trending && (
                      <Badge className="absolute top-2 right-2 bg-orange-600">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Trending
                      </Badge>
                    )}
                  </div>
                  
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-white text-lg line-clamp-2">
                        {course.title}
                      </CardTitle>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-white text-sm">{course.rating}</span>
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm line-clamp-2">{course.shortDesc}</p>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Course Info */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Category</p>
                        <p className="text-white font-medium">{course.category}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Level</p>
                        <p className="text-white font-medium">{course.level}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Duration</p>
                        <p className="text-white font-medium">{course.duration}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Priority</p>
                        <p className="text-white font-medium">{course.priority}</p>
                      </div>
                    </div>

                    {/* Enrollment Stats */}
                    <div className="bg-gray-700 rounded-lg p-3">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="text-gray-400">Enrollments</p>
                          <p className="text-white font-semibold">{stats.total}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Active</p>
                          <p className="text-blue-400 font-semibold">{stats.active}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Completed</p>
                          <p className="text-green-400 font-semibold">{stats.completed}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Revenue</p>
                          <p className="text-yellow-400 font-semibold">₹{stats.revenue.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="manual" className="flex-1">
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" className="px-2">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </LMSLayout>
  );
};

export default CoursesManagement;