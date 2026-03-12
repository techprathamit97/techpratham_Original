"use client";

import React, { useContext, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { UserContext } from '@/context/userContext';
import SignOut from '@/src/account/common/SignOut';
import AdminLoader from '@/src/account/common/AdminLoader';
import AdminSidebar from '@/src/account/common/AdminSidebar';
import AdminTopBar from '@/src/account/common/AdminTopBar';

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';

interface Certificate {
    certificateId: string;
    enrolledDate: string;
    completionDate: string;
}

interface Course {
    _id: string;
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
    advanceAmount: number;
    finalPayment: number;
    advance: boolean;
    verifyPayment: boolean;
    courseCompletion: boolean;
    certificate: Certificate | null;
    createdAt: string;
    updatedAt: string;
}

const Completed = () => {
    const { authenticated, loading, isAdmin, currentTab, setCurrentTab } = useContext(UserContext);

    const [completedData, setCompletedData] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const fetchCompletedData = async () => {
        setIsLoading(true);
        try {
            if (!authenticated) {
                return;
            }

            const res = await fetch(`/api/course/requests`);
            if (!res.ok) throw new Error(`API request failed with status ${res.status}`);

            const data = await res.json();
            const completedCourses = data.filter((course: Course) => {
                const isPaymentComplete = course.verifyPayment &&
                    (course.advance ?
                        (course.advanceAmount + course.finalPayment >= course.totalAmount) :
                        course.finalPayment >= course.totalAmount || course.advanceAmount >= course.totalAmount
                    );
                return isPaymentComplete && course.courseCompletion;
            });
            setCompletedData(completedCourses);
        } catch (error) {
            console.error("Failed to fetch completed data:", error);
            if (authenticated) {
                setCompletedData([]);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (authenticated) {
            fetchCompletedData();
        }
    }, [authenticated]);

    // Generate certificate for selected course
    const generateCertificate = (course: Course) => {
        setSelectedCourse(course);
        // Small delay to ensure the canvas is ready
        setTimeout(() => {
            drawCertificate(course);
        }, 100);
    };

    const drawCertificate = async (course: Course) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        await document.fonts.ready;

        const image = new Image();
        image.onload = () => {
            const formatDate = (dateString: string | undefined) => {
                if (!dateString) return 'N/A';
                try {
                    return new Date(dateString).toLocaleDateString('en-GB');
                } catch (e) {
                    console.error("Could not parse date:", dateString);
                    return 'Invalid Date';
                }
            };

            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0);

            // Set font for name and course title
            ctx.font = '120px "Caramel", sans-serif';
            ctx.fillStyle = '#AD0200';
            ctx.textAlign = 'center';

            // Student name (centered, red color)
            const studentName = course.name;
            ctx.fillText(studentName, canvas.width / 2, 1283);

            // Course title (centered, below name)
            ctx.font = '120px "Caramel", sans-serif';
            ctx.fillStyle = '#E2C77B';
            const courseTitle = course.course_title;
            ctx.fillText(courseTitle, canvas.width / 2, 1529);

            // Date range
            ctx.font = 'bold 35px Arial, sans-serif';
            ctx.fillStyle = '#333333';
            const enrolledDate = formatDate(course.certificate?.enrolledDate);
            const completionDate = formatDate(course.certificate?.completionDate);
            ctx.fillText(enrolledDate, 500, 1680);
            ctx.fillText(completionDate, 770, 1680);

            // Certificate ID (top right)
            ctx.font = 'bold 35px Arial, sans-serif';
            ctx.fillStyle = '#333333';
            ctx.textAlign = 'right';
            const certificateIdNo = course?.certificate?.certificateId || 'N/A';
            ctx.fillText(certificateIdNo, canvas.width - 110, 134);

            // Date (top right, below certificate ID)
            const currentDate = new Date().toLocaleDateString('en-GB');
            ctx.fillText(currentDate, canvas.width - 110, 185);
        };

        // Use the certificate template image
        image.src = '/course/certificate/certify.png';
    };

    const handleDownload = () => {
        const canvas = canvasRef.current;
        if (!canvas || !selectedCourse) return;

        const link = document.createElement('a');
        link.download = `${selectedCourse.certificate?.certificateId || 'certificate'}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    const getPaymentBadge = (course: Course) => {
        const { advance, advanceAmount, finalPayment, totalAmount } = course;
        const totalPaid = advanceAmount + finalPayment;

        if (totalPaid >= totalAmount) {
            return (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Fully Paid
                </span>
            );
        }

        return (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                Partial Payment
            </span>
        );
    };

    useEffect(() => {
        setCurrentTab("completed");
    }, [currentTab]);

    return (
        <React.Fragment>
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
                                    <p className="text-gray-600">Loading completed courses...</p>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-black p-6 overflow-y-auto">
                                <div className='w-full h-auto flex flex-row items-center justify-between'>
                                    <h2 className="text-xl font-semibold text-white mb-4">Completed Courses</h2>
                                    <div className="flex items-center gap-2">
                                        <span className="text-green-400 text-sm">Completed Courses</span>
                                        <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                            {completedData.length}
                                        </div>
                                    </div>
                                </div>

                                {completedData.length > 0 ? (
                                    <div className="grid lg:grid-cols-2 md:grid-cols-1 grid-cols-1 gap-6 w-full">
                                        {completedData.map((course: Course, index: number) => (
                                            <div key={index} className="w-full max-w-lg h-auto flex flex-col p-6 transition-all duration-300 bg-[#1a1a1a]">

                                                <div className="text-xl font-semibold text-white leading-tight flex-1 pr-2">
                                                    {course.course_title}
                                                </div>

                                                <div className="my-3 flex flex-row gap-2">
                                                    <Badge variant={'secondary'}>
                                                        {course.category}
                                                    </Badge>
                                                    <Badge variant={'secondary'}>
                                                        {course.level}
                                                    </Badge>
                                                    <Badge variant={'secondary'}>
                                                        Completed
                                                    </Badge>
                                                </div>

                                                <div className="text-sm text-gray-600 mb-4 flex-grow leading-relaxed line-clamp-3">
                                                    {course.course_desc}
                                                </div>

                                                {/* Student Information */}
                                                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                                    <h4 className="font-semibold text-gray-800 mb-2">Student Details</h4>
                                                    <div className="space-y-1 text-sm">
                                                        <div><span className="font-medium">Name:</span> {course.name}</div>
                                                        <div><span className="font-medium">Email:</span> {course.email}</div>
                                                        <div><span className="font-medium">Phone:</span> {course.phone}</div>
                                                    </div>
                                                </div>

                                                {/* Payment Information */}
                                                <div className="bg-green-50 p-4 rounded-lg mb-4">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <h4 className="font-semibold text-gray-800">Payment Status</h4>
                                                        {getPaymentBadge(course)}
                                                    </div>
                                                    <div className="space-y-1 text-sm">
                                                        <div className="flex justify-between">
                                                            <span className="font-medium">Total Amount:</span>
                                                            <span className="text-green-600 font-bold">₹{course.totalAmount}</span>
                                                        </div>
                                                        {course.advance && course.advanceAmount > 0 && (
                                                            <div className="flex justify-between">
                                                                <span className="font-medium">Advance Payment:</span>
                                                                <span className="text-blue-600 font-bold">₹{course.advanceAmount}</span>
                                                            </div>
                                                        )}
                                                        {course.finalPayment > 0 && (
                                                            <div className="flex justify-between">
                                                                <span className="font-medium">Final Payment:</span>
                                                                <span className="text-green-600 font-bold">₹{course.finalPayment}</span>
                                                            </div>
                                                        )}
                                                        <div className="flex justify-between border-t pt-1">
                                                            <span className="font-medium">Total Paid:</span>
                                                            <span className="text-green-700 font-bold">₹{course.advanceAmount + course.finalPayment}</span>
                                                        </div>
                                                        {(course.advanceAmount + course.finalPayment) < course.totalAmount && (
                                                            <div className="flex justify-between">
                                                                <span className="font-medium">Remaining:</span>
                                                                <span className="text-red-600 font-bold">₹{course.totalAmount - (course.advanceAmount + course.finalPayment)}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Course Completion Info */}
                                                <div className="flex justify-between items-center mb-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-green-500">🎓</span>
                                                        <span className="text-green-600 font-medium text-sm">Course Completed</span>
                                                    </div>
                                                    <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                        Duration: {course.duration}
                                                    </div>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex gap-2">
                                                    <Link href={`/courses/${course.course_link}`} className="flex-1">
                                                        <Button
                                                            variant="manual"
                                                            className="w-full border-gray-300 hover:bg-gray-50 transition-all duration-200"
                                                        >
                                                            View Course
                                                        </Button>
                                                    </Link>
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button
                                                                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all duration-200"
                                                                onClick={() => generateCertificate(course)}
                                                            >
                                                                Generate Certificate
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className='bg-white h-auto overflow-auto hide-scrollbar'>
                                                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Certificate of Achievement</h3>
                                                            <div className='w-full flex flex-col gap-4'>
                                                                <div className='w-full h-auto flex items-center justify-center flex-col gap-4'>
                                                                    <canvas
                                                                        ref={canvasRef}
                                                                        className='w-full hidden max-w-3xl h-full border-2 border-gray-200 rounded-lg shadow-lg'
                                                                    />

                                                                    {selectedCourse && (
                                                                        <div className="text-center space-y-2">
                                                                            <p className="text-sm text-gray-600">
                                                                                <strong>Student:</strong> {selectedCourse.name}
                                                                            </p>
                                                                            <p className="text-sm text-gray-600">
                                                                                <strong>Course:</strong> {selectedCourse.course_title}
                                                                            </p>
                                                                            <p className="text-sm text-gray-600">
                                                                                <strong>Certificate ID:</strong> {selectedCourse?.certificate?.certificateId}
                                                                            </p>
                                                                            <p className="text-sm text-gray-600">
                                                                                <strong>Completion Date:</strong> {selectedCourse?.certificate?.completionDate}
                                                                            </p>
                                                                        </div>
                                                                    )}

                                                                    <Button
                                                                        variant='default'
                                                                        className='mt-4 bg-green-600 hover:bg-green-700'
                                                                        onClick={handleDownload}
                                                                    >
                                                                        Download Certificate
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </DialogContent>
                                                    </Dialog>
                                                </div>

                                                {/* Timestamp */}
                                                <div className="text-xs text-gray-400 mt-3 text-center">
                                                    Completed on: {new Date(course.updatedAt || course.createdAt).toLocaleDateString('en-IN', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-16">
                                        <div className="text-center">
                                            <div className="mb-4">
                                                <svg className="w-20 h-20 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-lg font-medium text-gray-300 mb-2">No completed courses</h3>
                                            <p className="text-gray-400 mb-6">No courses have been completed yet with full payment.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </React.Fragment >
    )
}

export default Completed