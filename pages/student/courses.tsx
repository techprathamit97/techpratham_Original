import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import StudentLayout from '@/src/student/common/StudentLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  CheckCircle,
  PlayCircle,
  TrendingUp,
  Calendar,
  Clock,
  Award,
  User,
  ExternalLink,
  Star,
  Mail,
  Phone,
  DollarSign,
  FileText
} from 'lucide-react';
import { toast } from 'sonner';

interface EnrolledCourse {
  _id: string;
  course_title: string;
  course_link: string;
  course_desc: string;
  duration: string;
  level: string;
  category: string;
  email: string;
  name: string;
  phone: string;
  studentId: string;
  batchId: string;
  trainerId: string;
  progressPercentage: number;
  courseCompletion: boolean;
  totalAmount: number;
  verifyPayment: boolean;
  createdAt: string;
  lastAccessedAt?: string;
  quizScores?: any[];
  batchInfo?: {
    batchId: string;
    course_title: string;
    trainerId: string;
    schedule: {
      startDate: string;
      endDate: string;
      timing: string;
      days: string[];
    };
    capacity: number;
    enrolled_students: string[];
    status: string;
    meetingLink: string;
    trainer: {
      trainerId: string;
      name: string;
      email: string;
      phone: string;
      profile: string;
      experience: string;
      rating: number;
      bio: string;
      expertise: string[];
      linkedIn: string;
      github: string;
      portfolio: string;
    };
  };
  invoiceInfo?: {
    invoiceNumber: string;
    totalAmount: number;
    paidAmount: number;
    pendingAmount: number;
    status: string;
    invoiceDate: string;
  };
}

interface CoursesData {
  enrolledCourses: EnrolledCourse[];
  stats: {
    totalCourses: number;
    completedCourses: number;
    inProgressCourses: number;
    avgProgress: number;
  };
}

const StudentCourses = () => {
  const router = useRouter();
  const [coursesData, setCoursesData] = useState<CoursesData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'in-progress'>('all');
  const [studentInfo, setStudentInfo] = useState<any>(null);

  useEffect(() => {
    const storedData = sessionStorage.getItem('studentAuth');
    if (!storedData) {
      router.push('/student/login');
      return;
    }

    const student = JSON.parse(storedData);
    setStudentInfo(student);
    console.log('Logged in student:', student);
    fetchCoursesData(student.studentId);
  }, []);

  const fetchCoursesData = async (studentId: string) => {
    setIsLoading(true);
    try {
      console.log('Fetching courses for student ID:', studentId);
      
      const res = await fetch(`/api/student/courses?studentId=${studentId}`);
      const data = await res.json();

      console.log('API Response:', data);

      if (res.ok) {
        console.log('Courses data received:', data.data);
        setCoursesData(data.data);
      } else {
        console.error('API Error:', data);
        toast.error(data.error || 'Failed to fetch courses data');
      }
    } catch (error) {
      console.error('Courses fetch error:', error);
      toast.error('Failed to load courses data');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCourses = coursesData?.enrolledCourses.filter(course => {
    if (filterStatus === 'completed') return course.courseCompletion;
    if (filterStatus === 'in-progress') return !course.courseCompletion;
    return true;
  }) || [];

  if (isLoading || !coursesData) {
    return (
      <StudentLayout>
        <div className="p-6 flex items-center justify-center">
          <p className="text-gray-600">Loading courses...</p>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
          <h1 className="text-3xl font-bold">My Enrolled Courses</h1>
          <p className="text-blue-100 mt-2">Track your learning progress and access course materials</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Courses</p>
                  <p className="text-3xl font-bold text-gray-900">{coursesData.stats.totalCourses}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Completed</p>
                  <p className="text-3xl font-bold text-gray-900">{coursesData.stats.completedCourses}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">In Progress</p>
                  <p className="text-3xl font-bold text-gray-900">{coursesData.stats.inProgressCourses}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <PlayCircle className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Avg Progress</p>
                  <p className="text-3xl font-bold text-gray-900">{coursesData.stats.avgProgress}%</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Buttons */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setFilterStatus('all')}
            className={`py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              filterStatus === 'all'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All Courses ({coursesData.enrolledCourses.length})
          </button>
          <button
            onClick={() => setFilterStatus('in-progress')}
            className={`py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              filterStatus === 'in-progress'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            In Progress ({coursesData.stats.inProgressCourses})
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              filterStatus === 'completed'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Completed ({coursesData.stats.completedCourses})
          </button>
        </div>

        {/* Courses List */}
        <div className="space-y-6">
          {filteredCourses.length === 0 ? (
            <Card className="border-gray-200 shadow-sm">
              <CardContent className="p-6 text-center">
                <p className="text-gray-500">No courses found for the selected filter</p>
              </CardContent>
            </Card>
          ) : (
            filteredCourses.map((course) => (
              <Card key={course._id} className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="border-b border-gray-200">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-gray-900 flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-blue-600" />
                        {course.course_title}
                      </CardTitle>
                      <p className="text-gray-600 text-sm mt-1">{course.course_desc}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={course.courseCompletion ? 'bg-green-100 text-green-700 border-green-200' : 'bg-orange-100 text-orange-700 border-orange-200'}>
                        {course.courseCompletion ? 'Completed' : 'In Progress'}
                      </Badge>
                      {course.verifyPayment && (
                        <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                          Paid
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Course Information */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-blue-600" />
                        Course Details
                      </h3>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Category:</span> {course.category}</p>
                        <p><span className="font-medium">Level:</span> {course.level}</p>
                        <p><span className="font-medium">Duration:</span> {course.duration}</p>
                        <p><span className="font-medium">Student ID:</span> {course.studentId}</p>
                        <p><span className="font-medium">Enrolled:</span> {new Date(course.createdAt).toLocaleDateString()}</p>
                        {course.lastAccessedAt && (
                          <p><span className="font-medium">Last Accessed:</span> {new Date(course.lastAccessedAt).toLocaleDateString()}</p>
                        )}
                      </div>

                      {/* Progress Bar */}
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Progress</span>
                          <span className="text-gray-900 font-medium">{course.progressPercentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-blue-600 h-3 rounded-full transition-all"
                            style={{ width: `${course.progressPercentage}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Batch & Trainer Information */}
                    {course.batchInfo && (
                      <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                          <User className="h-4 w-4 text-green-600" />
                          Batch & Trainer
                        </h3>
                        <div className="space-y-3">
                          {/* Batch Info */}
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="font-medium text-gray-800 mb-2">Batch Information</p>
                            <div className="space-y-1 text-sm">
                              <p><span className="font-medium">Batch ID:</span> {course.batchInfo.batchId}</p>
                              <p><span className="font-medium">Status:</span> 
                                <Badge className={
                                  course.batchInfo.status === 'ongoing' ? 'bg-green-100 text-green-700 border-green-200 ml-2' :
                                  course.batchInfo.status === 'upcoming' ? 'bg-blue-100 text-blue-700 border-blue-200 ml-2' :
                                  'bg-gray-100 text-gray-700 border-gray-200 ml-2'
                                }>
                                  {course.batchInfo.status.toUpperCase()}
                                </Badge>
                              </p>
                              <p><span className="font-medium">Schedule:</span> {course.batchInfo.schedule.timing}</p>
                              <p><span className="font-medium">Days:</span> {course.batchInfo.schedule.days.join(', ')}</p>
                              <p><span className="font-medium">Students:</span> {course.batchInfo.enrolled_students.length}/{course.batchInfo.capacity}</p>
                            </div>
                          </div>

                          {/* Trainer Info */}
                          <div className="bg-blue-50 rounded-lg p-3">
                            <p className="font-medium text-gray-800 mb-2">Trainer Details</p>
                            <div className="space-y-1 text-sm">
                              <p><span className="font-medium">Name:</span> {course.batchInfo.trainer.name}</p>
                              <p className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {course.batchInfo.trainer.email}
                              </p>
                              {course.batchInfo.trainer.phone && (
                                <p className="flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  {course.batchInfo.trainer.phone}
                                </p>
                              )}
                              <p><span className="font-medium">Experience:</span> {course.batchInfo.trainer.experience}</p>
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                <span className="font-medium">{course.batchInfo.trainer.rating}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Payment & Quiz Information */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-purple-600" />
                        Payment & Performance
                      </h3>
                      
                      {/* Payment Info */}
                      {course.invoiceInfo ? (
                        <div className="bg-green-50 rounded-lg p-3">
                          <p className="font-medium text-gray-800 mb-2">Payment Details</p>
                          <div className="space-y-1 text-sm">
                            <p><span className="font-medium">Invoice:</span> {course.invoiceInfo.invoiceNumber}</p>
                            <p><span className="font-medium">Total:</span> ₹{course.invoiceInfo.totalAmount.toLocaleString()}</p>
                            <p><span className="font-medium">Paid:</span> ₹{course.invoiceInfo.paidAmount.toLocaleString()}</p>
                            {course.invoiceInfo.pendingAmount > 0 && (
                              <p><span className="font-medium">Pending:</span> ₹{course.invoiceInfo.pendingAmount.toLocaleString()}</p>
                            )}
                            <p><span className="font-medium">Status:</span> 
                              <Badge className={
                                course.invoiceInfo.status === 'paid' ? 'bg-green-100 text-green-700 border-green-200 ml-2' :
                                course.invoiceInfo.status === 'partial' ? 'bg-yellow-100 text-yellow-700 border-yellow-200 ml-2' :
                                'bg-red-100 text-red-700 border-red-200 ml-2'
                              }>
                                {course.invoiceInfo.status.toUpperCase()}
                              </Badge>
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="font-medium text-gray-800 mb-2">Payment Details</p>
                          <p className="text-sm text-gray-600">No invoice information available</p>
                          <p className="text-sm"><span className="font-medium">Amount:</span> ₹{course.totalAmount.toLocaleString()}</p>
                        </div>
                      )}

                      {/* Quiz Scores */}
                      {course.quizScores && course.quizScores.length > 0 && (
                        <div className="bg-indigo-50 rounded-lg p-3">
                          <p className="font-medium text-gray-800 mb-2">Quiz Performance</p>
                          <div className="space-y-1">
                            {course.quizScores.map((quiz, index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span>Quiz {index + 1}</span>
                                <span className={quiz.passed ? 'text-green-600' : 'text-red-600'}>
                                  {quiz.score}% {quiz.passed ? '✓' : '✗'}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex gap-3">
                    <Button
                      onClick={() => window.open(course.course_link, '_blank')}
                      className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Access Course
                    </Button>
                    
                    {course.batchInfo?.meetingLink && course.batchInfo.status === 'ongoing' && (
                      <Button
                        onClick={() => window.open(course.batchInfo?.meetingLink, '_blank')}
                        className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                      >
                        <PlayCircle className="h-4 w-4" />
                        Join Live Class
                      </Button>
                    )}

                    {course.invoiceInfo && (
                      <Button
                        variant="outline"
                        onClick={() => window.open(`/invoice/${course.invoiceInfo?.invoiceNumber}`, '_blank')}
                        className="flex items-center gap-2"
                      >
                        <FileText className="h-4 w-4" />
                        View Invoice
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentCourses;
