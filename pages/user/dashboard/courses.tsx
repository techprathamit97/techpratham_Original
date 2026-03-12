import React, { useContext, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { UserContext } from '@/context/userContext';
import SignOut from '@/src/account/common/SignOut';
import UserLoader from '@/src/account/common/UserLoader';
import UserSidebar from '@/src/account/common/UserSidebar';
import UserTopBar from '@/src/account/common/UserTopBar';

import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Head from 'next/head';

interface Certificate {
  certificateId: string;
  enrolledDate: string;
  completionDate: string;
}

interface Course {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  course_title: string;
  course_desc: string;
  course_link: string;
  category: string;
  level: string;
  duration: string;
  totalAmount: number;
  advanceAmount?: number;
  finalPayment?: number;
  advance?: boolean;
  verifyPayment: boolean;
  courseCompletion: boolean;
  certificate?: Certificate | null;
  createdAt?: string;
  updatedAt?: string;
  receiptNo?: string;
  studentId?: string;
  feeType?: string;
  dueDate?: string;
}

const UserCourses = () => {
  const { authenticated, loading, userData, setActiveUserTab } = useContext(UserContext);

  const [appliedCourses, setAppliedCourses] = useState<Course[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setActiveUserTab("course");
  }, [setActiveUserTab]);

  useEffect(() => {
    if (authenticated && userData?.email) {
      fetchEnrolledCourses();
    }
  }, [authenticated, userData]);

  const fetchEnrolledCourses = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/course/enrolled?email=${userData.email}`);
      if (response.ok) {
        const data: Course[] = await response.json();

        const applied = data.filter((course) => !course.verifyPayment);
        const enrolled = data.filter((course) => course.verifyPayment && !course.courseCompletion);

        setAppliedCourses(applied);
        setEnrolledCourses(enrolled);
      } else {
        console.error('Failed to fetch enrolled courses');
      }
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const [selectedInvoiceEnrollment, setSelectedInvoiceEnrollment] = useState<Course | null>(null);
  const invoiceCanvasRef = useRef<HTMLCanvasElement>(null);

  const drawInvoice = async (course: Course) => {
    const canvas = invoiceCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    await document.fonts.ready;

    const image = new Image();
    image.crossOrigin = "anonymous";

    return new Promise<void>((resolve, reject) => {
      image.onload = () => {
        try {
          // Set canvas dimensions
          canvas.width = image.width;
          canvas.height = image.height;

          // Clear canvas and draw background image
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(image, 0, 0);

          // Set font for name and course title
          ctx.font = '12px "Poppins", sans-serif';
          ctx.fillStyle = '#000';

          // Student name (centered, red color)
          const studentName = course.name || 'N/A';
          ctx.fillText(studentName, 190, 288);
          const email = course.email || 'N/A';
          ctx.fillText(email, 198, 328);
          const phoneNo = course.phone || 'N/A';
          ctx.fillText(phoneNo, 250, 366);

          ctx.font = '12px "Poppins", sans-serif';
          ctx.fillStyle = '#000';

          // Course title
          const receiptIdNo = course?.receiptNo || 'N/A';
          ctx.fillText(receiptIdNo, 480, 288);
          const courseTitle = course.course_title || 'N/A';
          ctx.fillText(courseTitle, 456, 328);
          const studentIdNo = course?.studentId || 'N/A';
          ctx.fillText(studentIdNo, 470, 366);

          // Date range
          ctx.font = '12px "Poppins", sans-serif';
          ctx.fillStyle = '#000';

          // Current date
          const currentDate = new Date().toLocaleDateString('en-GB');
          ctx.fillText(currentDate, 735, 288);
          const feeType = course?.feeType || 'N/A';
          ctx.fillText(feeType, 773, 328);
          const nextDueDate = course?.dueDate || 'N/A';
          ctx.fillText(nextDueDate, 805, 366);

          // Add payment information
          ctx.font = '16px "Poppins", sans-serif';
          ctx.fillStyle = '#000';
          ctx.textAlign = 'left';

          // Total amount
          const totalAmount = `${course.totalAmount || 0}`;
          ctx.fillText(totalAmount, 805, 455);

          // Advance amount if applicable
          if (course.advance && (course.advanceAmount || 0) > 0) {
            const advanceAmount = `${course.advanceAmount || 0}`;
            ctx.fillText(advanceAmount, 805, 495);

            const balanceAmount = `${(course.totalAmount || 0) - (course.advanceAmount || 0)}`;
            ctx.fillText(balanceAmount, 805, 535);
          }

          resolve();
        } catch (error) {
          reject(error);
        }
      };

      image.onerror = () => {
        console.error("Failed to load invoice template image");
        // Fallback: create a simple invoice without background image
        try {
          canvas.width = 800;
          canvas.height = 600;
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Add border
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 2;
          ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

          // Add title
          ctx.font = 'bold 24px "Poppins", sans-serif';
          ctx.fillStyle = '#000000';
          ctx.textAlign = 'center';
          ctx.fillText('COURSE INVOICE', canvas.width / 2, 50);

          // Add content
          ctx.font = '18px "Poppins", sans-serif';
          ctx.textAlign = 'left';
          ctx.fillText(`Student: ${course.name}`, 50, 120);
          ctx.fillText(`Course: ${course.course_title}`, 50, 150);
          ctx.fillText(`Email: ${course.email}`, 50, 180);
          ctx.fillText(`Phone: ${course.phone}`, 50, 210);
          ctx.fillText(`Total Amount: ₹${course.totalAmount || 0}`, 50, 270);

          if (course.advance && (course.advanceAmount || 0) > 0) {
            ctx.fillText(`Advance Paid: ₹${course.advanceAmount}`, 50, 300);
            ctx.fillText(`Balance: ₹${(course.totalAmount || 0) - (course.advanceAmount || 0)}`, 50, 330);
          }

          ctx.fillText(`Date: ${new Date().toLocaleDateString('en-GB')}`, 50, 400);

          resolve();
        } catch (error) {
          reject(error);
        }
      };

      image.src = '/course/certificate/invoice.png';
    });
  };

  const generateInvoice = async (enrollment: Course) => {
    setSelectedInvoiceEnrollment(enrollment);

    setTimeout(async () => {
      try {
        await drawInvoice(enrollment);
        await handleInvoiceDownload();
      } catch (error) {
        console.error('Failed to generate invoice:', error);
        alert('Failed to generate invoice. Please try again.');
      }
    }, 100);
  };

  const handleInvoiceDownload = async () => {
    if (!selectedInvoiceEnrollment) return;

    const canvas = invoiceCanvasRef.current;
    if (!canvas) {
      console.error('Canvas not found');
      return;
    }

    try {
      const link = document.createElement('a');
      const fileName = `invoice_${selectedInvoiceEnrollment?.name?.replace(/\s+/g, '_') || 'student'}_${Date.now()}.png`;
      link.download = fileName;
      link.href = canvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to download invoice:', error);
      alert('Failed to download invoice. Please try again.');
    }
  };

  return (
    <React.Fragment>
      <Head>
        <link rel="icon" href="/favicon.ico" type="image/ico" sizes="70x70" />
        <title>Your Courses | User Dashboard</title>
        <meta name="description" content="Explore the Courses section in User Dashboard of TechPratham." />
      </Head>
      
      <div className='w-full h-full md:h-screen min-h-screen flex flex-row items-start justify-start fixed'>

        <UserSidebar />

        <div className='bg-black flex flex-col w-full h-full md:relative fixed'>

          <UserTopBar />

          {isLoading ? (
            <div className="min-h-screen flex items-center justify-center bg-black">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading course data...</p>
              </div>
            </div>
          ) : (
            <div className="bg-black p-6 flex flex-col overflow-y-auto">
              <div className="bg-[#1a1a1a] shadow-sm p-6 mb-6">
                <div className='w-full h-auto flex flex-row items-center justify-between'>
                  <h2 className="text-xl font-semibold text-white mb-4">Applied Courses</h2>
                  <span className="text-orange-400 text-sm">Payment Pending</span>
                </div>

                {appliedCourses.length > 0 ? (
                  <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 w-full justify-items-center">
                    {appliedCourses.map((course, index) => (
                      <div
                        key={index}
                        className="w-full max-w-sm h-auto flex flex-col p-6 border rounded-xl shadow-md transition-all duration-300 bg-white hover:transform"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="text-xl font-semibold text-gray-800 leading-tight flex-1 pr-2">{course.course_title}</div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap bg-blue-100 text-blue-800`}>
                            {course.level}
                          </span>
                        </div>

                        <div className="mb-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800`}>
                            {course.category}
                          </span>
                        </div>

                        <div className="text-sm text-gray-600 mb-4 flex-grow leading-relaxed">{course.course_desc}</div>

                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center gap-1">
                            <span className="text-orange-500">⏳</span>
                            <span className="text-orange-600 font-medium text-sm">Payment Pending</span>
                          </div>
                          <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {course.duration}
                          </div>
                        </div>

                        <div className="text-sm text-gray-600 mb-4">
                          <span className="font-medium">Total: ₹{course.totalAmount}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="text-center">
                      <div className="mb-4">
                        <svg className="w-16 h-16 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-300 mb-2">No applications found</h3>
                      <p className="text-gray-400">You don't have any pending course applications.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Enrolled Courses Section */}
              <div className="bg-[#1a1a1a] shadow-sm p-6">
                <div className='w-full h-auto flex flex-row items-center justify-between'>
                  <h2 className="text-xl font-semibold text-white mb-4">Enrolled Courses</h2>
                  <span className="text-green-400 text-sm">Payment Verified</span>
                </div>

                {enrolledCourses.length > 0 ? (
                  <div className="grid md:grid-cols-2 grid-cols-1 gap-6 w-full justify-items-start">
                    {enrolledCourses.map((course: any, index: any) => (
                      <div
                        key={index}
                        className="w-full max-w-sm h-auto flex flex-col p-6 border rounded-xl shadow-md transition-all duration-300 bg-white hover:transform"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="text-xl font-semibold text-gray-800 leading-tight flex-1 pr-2">{course.course_title}</div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap bg-blue-100 text-blue-800`}>
                            {course.level}
                          </span>
                        </div>

                        <div className="mb-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800`}>
                            {course.category}
                          </span>
                        </div>

                        <div className="text-sm text-gray-600 mb-4 flex-grow leading-relaxed">{course.course_desc}</div>

                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center gap-1">
                            <span className="text-green-500">✓</span>
                            <span className="text-green-600 font-medium text-sm">
                              {course.courseCompletion ? 'Completed' : 'In Progress'}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {course.duration}
                          </div>
                        </div>

                        <div className="text-sm text-gray-600 mb-4">
                          <span className="font-medium">Course Price: ₹{course.totalAmount}</span>
                        </div>

                        <div className='w-full h-auto flex flex-row gap-2'>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                onClick={() => setSelectedInvoiceEnrollment(course)}
                              >
                                Generate Invoice
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
                              <DialogHeader>
                                <DialogTitle>Generate Invoice - {selectedInvoiceEnrollment?.course_title}</DialogTitle>
                              </DialogHeader>

                              {selectedInvoiceEnrollment && (
                                <>
                                  {/* Course & Student Info Summary */}
                                  <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                      <h4 className="font-semibold text-gray-800 mb-2">Student Info</h4>
                                      <div className="space-y-1 text-sm">
                                        <div><span className="font-medium">Name:</span> {selectedInvoiceEnrollment.name}</div>
                                        <div><span className="font-medium">Email:</span> {selectedInvoiceEnrollment.email}</div>
                                        <div><span className="font-medium">Phone:</span> {selectedInvoiceEnrollment.phone}</div>
                                      </div>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                      <h4 className="font-semibold text-gray-800 mb-2">Course Info</h4>
                                      <div className="space-y-1 text-sm">
                                        <div><span className="font-medium">Course:</span> {selectedInvoiceEnrollment.course_title}</div>
                                        <div><span className="font-medium">Duration:</span> {selectedInvoiceEnrollment.duration}</div>
                                        <div><span className="font-medium">Level:</span> {selectedInvoiceEnrollment.level}</div>
                                      </div>
                                    </div>
                                  </div>

                                  <canvas
                                    ref={invoiceCanvasRef}
                                    className='w-full hidden h-auto object-cover border-2 border-gray-200 rounded-lg shadow-lg'
                                  />

                                  <div className="flex gap-2 pt-4">
                                    <Button
                                      type="button"
                                      onClick={() => generateInvoice(selectedInvoiceEnrollment)}
                                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-200 cursor-pointer"
                                    >
                                      Download Invoice
                                    </Button>
                                  </div>
                                </>
                              )}
                            </DialogContent>
                          </Dialog>
                          <Link href={`/courses/${course.course_link}`} className="w-full">
                            <Button
                              variant="default"
                              className="w-full bg-gradient-to-r from-[#CD4647] to-[#7F3B40] hover:from-[#B73E3F] hover:to-[#6F3336] transition-all duration-200"
                            >
                              {course.courseCompletion ? 'View Certificate' : 'Continue Learning'}
                            </Button>
                          </Link>
                        </div>

                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="text-center">
                      <div className="mb-4">
                        <svg className="w-16 h-16 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-300 mb-2">No enrolled courses</h3>
                      <p className="text-gray-400 mb-6">You haven't enrolled in any courses yet. Start learning by enrolling in a course!</p>
                      <Link href='/courses' className=''>
                        <Button variant='default' className="bg-gradient-to-r from-[#CD4647] to-[#7F3B40] hover:from-[#B73E3F] hover:to-[#6F3336]">
                          Browse Courses
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </React.Fragment>
  )
};

export default UserCourses;