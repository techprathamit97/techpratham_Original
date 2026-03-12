"use client";

import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { UserContext } from '@/context/userContext';
import SignOut from '@/src/account/common/SignOut';
import AdminLoader from '@/src/account/common/AdminLoader';
import AdminSidebar from '@/src/account/common/AdminSidebar';
import AdminTopBar from '@/src/account/common/AdminTopBar';

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const verifyPaymentSchema = z.object({
  advance: z.boolean(),
  advanceAmount: z.number().min(0),
  finalPayment: z.number().min(0),
  totalAmount: z.number().min(0),
  verifyPayment: z.boolean(),
  courseCompletion: z.boolean(),
  enrolledDate: z.string().optional(),
});

const Requests = () => {
  const { authenticated, loading, isAdmin, currentTab, setCurrentTab } = useContext(UserContext);

  const [requestData, setRequestData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchRequestData = async () => {
    setIsLoading(true);
    try {
      if (!authenticated) {
        return;
      }

      const res = await fetch(`/api/course/requests`);
      if (!res.ok) throw new Error(`API request failed with status ${res.status}`);

      const data = await res.json();
      // Filter only non-verified requests
      const nonVerifiedRequests = data.filter((request: { verifyPayment: any; }) => !request.verifyPayment);
      setRequestData(nonVerifiedRequests);
    } catch (error) {
      console.error("Failed to fetch request data:", error);
      if (authenticated) {
        setRequestData([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const form = useForm<z.infer<typeof verifyPaymentSchema>>({
    resolver: zodResolver(verifyPaymentSchema),
    defaultValues: {
      advance: false,
      advanceAmount: 0,
      finalPayment: 0,
      totalAmount: 0,
      verifyPayment: false,
      courseCompletion: false,
      enrolledDate: "",
    },
  });

  const watchAdvance = form.watch("advance");

  const handleVerifyPayment = (request: any) => {
    setSelectedRequest(request);
    // Pre-populate form with existing data
    form.reset({
      advance: request.advance || false,
      advanceAmount: request.advanceAmount || 0,
      finalPayment: request.finalPayment || 0,
      totalAmount: request.totalAmount || 0,
      verifyPayment: request.verifyPayment || false,
      courseCompletion: request.courseCompletion || false,
      enrolledDate: request.certificate?.enrolledDate ? new Date(request.certificate.enrolledDate).toISOString().split('T')[0] : "",
    });
  };

  const onSubmit = async (values: z.infer<typeof verifyPaymentSchema>) => {
    if (!selectedRequest) return;

    setIsSubmitting(true);
    try {
      const updateData = {
        email: selectedRequest.email,
        course_link: selectedRequest.course_link,
        advance: values.advance,
        advanceAmount: values.advanceAmount,
        finalPayment: values.finalPayment,
        totalAmount: values.totalAmount,
        verifyPayment: values.verifyPayment,
        courseCompletion: values.courseCompletion,
        // Structure the certificate object properly
        certificate: values.enrolledDate ? {
          enrolledDate: new Date(values.enrolledDate),
          // You might want to add completionDate and certificateId here as well
          // completionDate: values.courseCompletion ? new Date() : null,
          // certificateId: values.courseCompletion ? `CERT-${Date.now()}` : null,
        } : null,
      };

      const res = await fetch('/api/course/verify', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!res.ok) throw new Error(`Update failed with status ${res.status}`);

      const updatedRequest = await res.json();
      console.log('Payment verification updated:', updatedRequest);

      // Refresh the request data
      await fetchRequestData();

      // Close dialog and reset form
      setSelectedRequest(null);
      form.reset();

    } catch (error) {
      console.error('Failed to update payment verification:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (authenticated) {
      fetchRequestData();
    }
  }, [authenticated]);

  useEffect(() => {
    if (!watchAdvance) {
      form.setValue("advanceAmount", 0);
    }
  }, [watchAdvance, form]);

  useEffect(() => {
    setCurrentTab("requests");
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

          <div className='bg-black flex flex-col w-full h-full md:relative fixed'>

            <AdminTopBar />

            {isLoading ? (
              <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading request data...</p>
                </div>
              </div>
            ) : (
              <div className="bg-black p-6">
                <div className='w-full h-auto flex flex-row items-center justify-between'>
                  <h2 className="text-xl font-semibold text-white mb-4">Course Enrollment Requests</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-orange-400 text-sm">Pending Verification</span>
                    <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {requestData.length}
                    </div>
                  </div>
                </div>

                {requestData.length > 0 ? (
                  <div className="grid lg:grid-cols-2 md:grid-cols-1 grid-cols-1 gap-6 w-full justify-items-center">
                    {requestData.map((request: any, index: any) => (
                      <div
                        key={index}
                        className="w-full max-w-lg h-auto flex flex-col p-6 border rounded-xl shadow-md transition-all duration-300 bg-white hover:transform"
                      >
                        {/* Course Information */}
                        <div className="flex justify-between items-start mb-3">
                          <div className="text-xl font-semibold text-gray-800 leading-tight flex-1 pr-2">{request.course_title}</div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap bg-blue-100 text-blue-800`}>
                            {request.level}
                          </span>
                        </div>

                        <div className="mb-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800`}>
                            {request.category}
                          </span>
                        </div>

                        <div className="text-sm text-gray-600 mb-4 flex-grow leading-relaxed line-clamp-3">{request.course_desc}</div>

                        {/* User Information */}
                        <div className="bg-gray-50 p-4 rounded-lg mb-4">
                          <h4 className="font-semibold text-gray-800 mb-2">Student Details</h4>
                          <div className="space-y-1 text-sm">
                            <div><span className="font-medium">Name:</span> {request.name}</div>
                            <div><span className="font-medium">Email:</span> {request.email}</div>
                            <div><span className="font-medium">Phone:</span> {request.phone}</div>
                          </div>
                        </div>

                        {/* Payment Information */}
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center gap-2">
                            <span className="text-orange-500">⏳</span>
                            <span className="text-orange-600 font-medium text-sm">Payment Pending</span>
                          </div>
                          <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {request.duration}
                          </div>
                        </div>

                        <div className="flex justify-between items-center mb-4">
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Total Amount: ₹{request.totalAmount}</span>
                          </div>
                          {request.advance && (
                            <div className="text-sm text-green-600">
                              <span className="font-medium">Advance: ₹{request.advanceAmount}</span>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <Link href={`/courses/${request.course_link}`} className="flex-1">
                            <Button
                              variant="outline"
                              className="w-full border-gray-300 hover:bg-gray-50 transition-all duration-200"
                            >
                              View Course
                            </Button>
                          </Link>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                onClick={() => handleVerifyPayment(request)}
                                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all duration-200"
                              >
                                Verify Payment
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white hide-scrollbar">
                              <DialogHeader>
                                <DialogTitle>Verify Payment - {selectedRequest?.course_title}</DialogTitle>
                              </DialogHeader>

                              {selectedRequest && (
                                <>
                                  {/* Course Details */}
                                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                    <h4 className="font-semibold text-gray-800 mb-2">Course Details</h4>
                                    <div className="space-y-2 text-sm">
                                      <div><span className="font-medium">Title:</span> {selectedRequest.course_title}</div>
                                      <div><span className="font-medium">Description:</span> {selectedRequest.course_desc}</div>
                                      <div><span className="font-medium">Duration:</span> {selectedRequest.duration}</div>
                                      <div><span className="font-medium">Level:</span> {selectedRequest.level}</div>
                                      <div><span className="font-medium">Category:</span> {selectedRequest.category}</div>
                                      <div><span className="font-medium">Course Link:</span> {selectedRequest.course_link}</div>
                                    </div>
                                  </div>

                                  {/* Student Details */}
                                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                    <h4 className="font-semibold text-gray-800 mb-2">Student Details</h4>
                                    <div className="space-y-2 text-sm">
                                      <div><span className="font-medium">Name:</span> {selectedRequest.name}</div>
                                      <div><span className="font-medium">Email:</span> {selectedRequest.email}</div>
                                      <div><span className="font-medium">Phone:</span> {selectedRequest.phone}</div>
                                    </div>
                                  </div>

                                  {/* Payment Verification Form */}
                                  <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                          control={form.control}
                                          name="advance"
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel>Advance Payment</FormLabel>
                                              <Select onValueChange={(value) => field.onChange(value === "true")} value={field.value.toString()}>
                                                <FormControl>
                                                  <SelectTrigger>
                                                    <SelectValue placeholder="Select advance payment" />
                                                  </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                  <SelectItem value="true">Yes</SelectItem>
                                                  <SelectItem value="false">No</SelectItem>
                                                </SelectContent>
                                              </Select>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />

                                        <FormField
                                          control={form.control}
                                          name="advanceAmount"
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel>Advance Amount</FormLabel>
                                              <FormControl>
                                                <Input
                                                  type="number"
                                                  placeholder="0"
                                                  disabled={!watchAdvance}
                                                  {...field}
                                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                                />
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                      </div>

                                      <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                          control={form.control}
                                          name="finalPayment"
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel>Final Payment</FormLabel>
                                              <FormControl>
                                                <Input
                                                  type="number"
                                                  placeholder="0"
                                                  {...field}
                                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                                />
                                              </FormControl>
                                              <FormDescription>
                                                Remaining payment amount after advance
                                              </FormDescription>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />

                                        <FormField
                                          control={form.control}
                                          name="totalAmount"
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel>Total Amount</FormLabel>
                                              <FormControl>
                                                <Input
                                                  type="number"
                                                  placeholder="0"
                                                  {...field}
                                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                                />
                                              </FormControl>
                                              <FormDescription>
                                                Total course fee amount
                                              </FormDescription>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                      </div>

                                      <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                          control={form.control}
                                          name="verifyPayment"
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel>Verify Payment</FormLabel>
                                              <Select onValueChange={(value) => field.onChange(value === "true")} value={field.value.toString()}>
                                                <FormControl>
                                                  <SelectTrigger>
                                                    <SelectValue placeholder="Select verification status" />
                                                  </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                  <SelectItem value="true">Verified</SelectItem>
                                                  <SelectItem value="false">Not Verified</SelectItem>
                                                </SelectContent>
                                              </Select>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />

                                        <FormField
                                          control={form.control}
                                          name="courseCompletion"
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel>Course Completion</FormLabel>
                                              <Select onValueChange={(value) => field.onChange(value === "true")} value={field.value.toString()}>
                                                <FormControl>
                                                  <SelectTrigger>
                                                    <SelectValue placeholder="Select completion status" />
                                                  </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                  <SelectItem value="true">Completed</SelectItem>
                                                  <SelectItem value="false">Not Completed</SelectItem>
                                                </SelectContent>
                                              </Select>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                      </div>

                                      <FormField
                                        control={form.control}
                                        name="enrolledDate"
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>Enrolled Date</FormLabel>
                                            <FormControl>
                                              <Input
                                                type="date"
                                                {...field}
                                              />
                                            </FormControl>
                                            <FormDescription>
                                              Date when the student enrolled in the course
                                            </FormDescription>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />

                                      <div className="flex gap-2 pt-4">
                                        <Button type="submit" disabled={isSubmitting} className="flex-1">
                                          {isSubmitting ? 'Updating...' : 'Update Payment Status'}
                                        </Button>
                                      </div>
                                    </form>
                                  </Form>
                                </>
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>

                        {/* Timestamp */}
                        <div className="text-xs text-gray-400 mt-3 text-center">
                          Applied on: {new Date(request.createdAt).toLocaleDateString('en-IN', {
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
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-300 mb-2">No pending requests</h3>
                      <p className="text-gray-400 mb-6">All course enrollment requests have been processed.</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </React.Fragment>
  )
}

export default Requests