import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '@/context/userContext';
import LMSLayout from '@/src/lms/common/LMSLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { ArrowLeft, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useRouter } from 'next/router';

const AddStudent = () => {
  const { authenticated, loading, isAdmin } = useContext(UserContext);
  const [courses, setCourses] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const [studentData, setStudentData] = useState({
    name: '',
    email: '',
    phone: '',
    course_link: '',
    course_title: '',
    course_desc: '',
    duration: '',
    level: '',
    category: '',
    batchId: '',
    totalAmount: 0,
    advanceAmount: 0,
    finalPayment: 0,
    feeType: 'Full Payment'
  });

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/course/fetch');
      const data = await res.json();
      if (res.ok) {
        setCourses(data);
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    }
  };

  const fetchBatches = async () => {
    try {
      const res = await fetch('/api/lms/batches');
      const data = await res.json();
      if (res.ok) {
        setBatches(data);
      }
    } catch (error) {
      console.error('Failed to fetch batches:', error);
    }
  };

  const handleCourseChange = (courseLink: string) => {
    const course = courses.find(c => c.link === courseLink);
    if (course) {
      setStudentData(prev => ({
        ...prev,
        course_link: courseLink,
        course_title: course.title,
        course_desc: course.shortDesc,
        duration: course.duration,
        level: course.level,
        category: course.category
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!studentData.name || !studentData.email || !studentData.phone || !studentData.course_link) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/course/enrollment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData)
      });

      const responseData = await res.json();

      if (res.ok) {
        toast.success('Student enrolled successfully');
        router.push('/lms/students');
      } else {
        throw new Error(responseData.error || 'Failed to enroll student');
      }
    } catch (error: any) {
      console.error('Failed to enroll student:', error);
      toast.error(error.message || 'Failed to enroll student');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (authenticated && isAdmin) {
      fetchCourses();
      fetchBatches();
    }
  }, [authenticated, isAdmin]);

  if (loading || !authenticated || !isAdmin) {
    return <div>Loading...</div>;
  }

  return (
    <LMSLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/lms/students">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Add New Student</h1>
            <p className="text-gray-400 mt-2">Enroll a new student in a course</p>
          </div>
        </div>

        {/* Form */}
        <Card className="bg-gray-800 border-gray-700 max-w-2xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Student Enrollment Form
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Full Name *</Label>
                  <Input
                    value={studentData.name}
                    onChange={(e) => setStudentData(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Enter student name"
                    required
                  />
                </div>
                
                <div>
                  <Label className="text-white">Email *</Label>
                  <Input
                    type="email"
                    value={studentData.email}
                    onChange={(e) => setStudentData(prev => ({ ...prev, email: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="student@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <Label className="text-white">Phone Number *</Label>
                <Input
                  value={studentData.phone}
                  onChange={(e) => setStudentData(prev => ({ ...prev, phone: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="+91 9876543210"
                  required
                />
              </div>

              {/* Course Selection */}
              <div>
                <Label className="text-white">Select Course *</Label>
                <Select 
                  value={studentData.course_link} 
                  onValueChange={handleCourseChange}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Choose a course" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    {courses.map((course: any) => (
                      <SelectItem key={course.link} value={course.link}>
                        {course.title} - {course.category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Batch Selection */}
              {batches.length > 0 && (
                <div>
                  <Label className="text-white">Assign to Batch (Optional)</Label>
                  <Select 
                    value={studentData.batchId} 
                    onValueChange={(value) => setStudentData(prev => ({ ...prev, batchId: value }))}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Select batch" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      {batches
                        .filter(batch => batch.course_link === studentData.course_link)
                        .map((batch: any) => (
                          <SelectItem key={batch._id} value={batch.batchId}>
                            {batch.batchId} - {batch.trainer.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Fee Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-white">Total Amount</Label>
                  <Input
                    type="number"
                    value={studentData.totalAmount}
                    onChange={(e) => setStudentData(prev => ({ ...prev, totalAmount: parseInt(e.target.value) || 0 }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Total course fee"
                  />
                </div>
                
                <div>
                  <Label className="text-white">Advance Amount</Label>
                  <Input
                    type="number"
                    value={studentData.advanceAmount}
                    onChange={(e) => {
                      const advance = parseInt(e.target.value) || 0;
                      setStudentData(prev => ({ 
                        ...prev, 
                        advanceAmount: advance,
                        finalPayment: prev.totalAmount - advance
                      }));
                    }}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Amount paid"
                  />
                </div>
                
                <div>
                  <Label className="text-white">Remaining Amount</Label>
                  <Input
                    type="number"
                    value={studentData.finalPayment}
                    readOnly
                    className="bg-gray-600 border-gray-500 text-gray-300"
                    placeholder="Auto calculated"
                  />
                </div>
              </div>

              <div>
                <Label className="text-white">Fee Type</Label>
                <Select 
                  value={studentData.feeType} 
                  onValueChange={(value) => setStudentData(prev => ({ ...prev, feeType: value }))}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="Full Payment">Full Payment</SelectItem>
                    <SelectItem value="2 Installments">2 Installments</SelectItem>
                    <SelectItem value="3 Installments">3 Installments</SelectItem>
                    <SelectItem value="4 Installments">4 Installments</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <Link href="/lms/students" className="flex-1">
                  <Button type="button" variant="outline" className="w-full">
                    Cancel
                  </Button>
                </Link>
                <Button 
                  type="submit" 
                  variant="manual" 
                  className="flex-1"
                  disabled={isLoading}
                >
                  {isLoading ? 'Enrolling...' : 'Enroll Student'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </LMSLayout>
  );
};

export default AddStudent;