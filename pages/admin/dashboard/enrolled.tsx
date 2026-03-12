// "use client";

// import React, { useContext, useEffect, useRef, useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { UserContext } from '@/context/userContext';
// import SignOut from '@/src/account/common/SignOut';
// import AdminLoader from '@/src/account/common/AdminLoader';
// import AdminSidebar from '@/src/account/common/AdminSidebar';
// import AdminTopBar from '@/src/account/common/AdminTopBar';

// import { z } from "zod";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";

// import { Input } from "@/components/ui/input";
// import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Label } from '@/components/ui/label';
// import { Badge } from '@/components/ui/badge';
// import Head from 'next/head';

// const verifyPaymentSchema = z.object({
//     advance: z.boolean(),
//     advanceAmount: z.number().min(0),
//     finalPayment: z.number().min(0),
//     totalAmount: z.number().min(0),
//     verifyPayment: z.boolean(),
//     courseCompletion: z.boolean(),
//     enrolledDate: z.string().optional(),
//     completionDate: z.string().optional(),
//     certificateId: z.string().optional(),
// });

// const invoiceSchema = z.object({
//     advanceAmount: z.number().min(0),
//     totalAmount: z.number().min(0),
//     enrolledDate: z.string().optional(),
//     feeType: z.string().optional(),
//     dueDate: z.string().optional(),
//     studentId: z.string().optional(),
//     receiptNo: z.string().optional(),
// });

// const Enrolled = () => {
//     const { authenticated, loading, isAdmin, currentTab, setCurrentTab } = useContext(UserContext);

//     const [enrolledData, setEnrolledData] = useState([]);
//     const [isLoading, setIsLoading] = useState(false);
//     const [selectedEnrollment, setSelectedEnrollment] = useState<any>(null);
//     const [selectedInvoiceEnrollment, setSelectedInvoiceEnrollment] = useState<any>(null);
//     const canvasRef = useRef<HTMLCanvasElement>(null);
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     const fetchEnrolledData = async () => {
//         setIsLoading(true);
//         try {
//             if (!authenticated) {
//                 return;
//             }

//             const res = await fetch(`/api/course/requests`);
//             if (!res.ok) throw new Error(`API request failed with status ${res.status}`);

//             const data = await res.json();
//             const verifiedEnrollments = data.filter((enrollment: { verifyPayment: boolean, courseCompletion: boolean }) =>
//                 enrollment.verifyPayment && !enrollment.courseCompletion
//             );
//             setEnrolledData(verifiedEnrollments);
//         } catch (error) {
//             console.error("Failed to fetch enrolled data:", error);
//             if (authenticated) {
//                 setEnrolledData([]);
//             }
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const form = useForm<z.infer<typeof verifyPaymentSchema>>({
//         resolver: zodResolver(verifyPaymentSchema),
//         defaultValues: {
//             advance: false,
//             advanceAmount: 0,
//             finalPayment: 0,
//             totalAmount: 0,
//             verifyPayment: false,
//             courseCompletion: false,
//             enrolledDate: "",
//             completionDate: "",
//             certificateId: "",
//         },
//     });

//     const invoiceForm = useForm<z.infer<typeof invoiceSchema>>({
//         resolver: zodResolver(invoiceSchema),
//         defaultValues: {
//             advanceAmount: 0,
//             totalAmount: 0,
//             enrolledDate: "",
//             feeType: "",
//             dueDate: "",
//             studentId: "",
//             receiptNo: "",
//         },
//     });

//     const watchAdvance = form.watch("advance");

//     const handleGenerateInvoice = (enrollment: any) => {
//         setSelectedInvoiceEnrollment(enrollment);
//         invoiceForm.reset({
//             advanceAmount: enrollment.advanceAmount || 0,
//             totalAmount: enrollment.totalAmount || 0,
//             enrolledDate: enrollment.certificate?.enrolledDate ? new Date(enrollment.certificate.enrolledDate).toISOString().split('T')[0] : "",
//             feeType: enrollment.feeType || (enrollment.advance ? "advance" : "full"),
//             dueDate: enrollment.dueDate || "",
//             studentId: enrollment.studentId || "",
//             receiptNo: enrollment.receiptNo || "",
//         });
//     };

//     const onInvoiceSubmit = async (values: z.infer<typeof invoiceSchema>) => {
//         if (!selectedInvoiceEnrollment) return;

//         setIsSubmitting(true);
//         try {
//             const invoiceData = {
//                 email: selectedInvoiceEnrollment.email,
//                 course_link: selectedInvoiceEnrollment.course_link,
//                 advanceAmount: values.advanceAmount,
//                 totalAmount: values.totalAmount,
//                 feeType: values.feeType,
//                 dueDate: values.dueDate,
//                 studentId: values.studentId,
//                 receiptNo: values.receiptNo,
//             };

//             const res = await fetch('/api/course/verify', {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(invoiceData),
//             });

//             if (!res.ok) throw new Error(`Invoice generation failed with status ${res.status}`);

//             const result = await res.json();
//             console.log('Invoice generated successfully:', result);

//             await fetchEnrolledData();

//             setSelectedInvoiceEnrollment(null);
//             invoiceForm.reset();

//         } catch (error) {
//             console.error('Failed to generate invoice:', error);
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     const handleFinalizeCourse = (enrollment: any) => {
//         setSelectedEnrollment(enrollment);
//         form.reset({
//             advance: enrollment.advance || false,
//             advanceAmount: enrollment.advanceAmount || 0,
//             finalPayment: enrollment.finalPayment || 0,
//             totalAmount: enrollment.totalAmount || 0,
//             verifyPayment: enrollment.verifyPayment || false,
//             courseCompletion: enrollment.courseCompletion || false,
//             enrolledDate: enrollment.certificate?.enrolledDate ? new Date(enrollment.certificate.enrolledDate).toISOString().split('T')[0] : "",
//             completionDate: enrollment.certificate?.completionDate ? new Date(enrollment.certificate.completionDate).toISOString().split('T')[0] : "",
//             certificateId: enrollment.certificate?.certificateId || "",
//         });
//     };

//     const onSubmit = async (values: z.infer<typeof verifyPaymentSchema>) => {
//         if (!selectedEnrollment) return;

//         setIsSubmitting(true);
//         try {
//             const updateData = {
//                 email: selectedEnrollment.email,
//                 course_link: selectedEnrollment.course_link,
//                 advance: values.advance,
//                 advanceAmount: values.advanceAmount,
//                 finalPayment: values.finalPayment,
//                 totalAmount: values.totalAmount,
//                 verifyPayment: values.verifyPayment,
//                 courseCompletion: values.courseCompletion,
//                 certificate: {
//                     enrolledDate: values.enrolledDate ? new Date(values.enrolledDate) : null,
//                     completionDate: values.completionDate ? new Date(values.completionDate) : null,
//                     certificateId: values.certificateId || null,
//                 },
//             };

//             const res = await fetch('/api/course/verify', {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(updateData),
//             });

//             if (!res.ok) throw new Error(`Update failed with status ${res.status}`);

//             const updatedEnrollment = await res.json();
//             console.log('Course finalization updated:', updatedEnrollment);

//             await fetchEnrolledData();
//             setSelectedEnrollment(null);
//             form.reset();

//         } catch (error) {
//             console.error('Failed to update course finalization:', error);
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     useEffect(() => {
//         if (authenticated) {
//             fetchEnrolledData();
//         }
//     }, [authenticated]);

//     useEffect(() => {
//         if (!watchAdvance) {
//             form.setValue("advanceAmount", 0);
//         }
//     }, [watchAdvance, form]);

//     const drawInvoice = async (course: any) => {
//         const canvas = canvasRef.current;
//         if (!canvas) return;

//         const ctx = canvas.getContext('2d');
//         if (!ctx) return;

//         await document.fonts.ready;

//         const image = new Image();
//         image.crossOrigin = "anonymous";

//         image.onload = () => {
//             const formatDate = (dateString: string | undefined) => {
//                 if (!dateString) return 'N/A';
//                 try {
//                     return new Date(dateString).toLocaleDateString('en-GB');
//                 } catch (e) {
//                     console.error("Could not parse date:", dateString);
//                     return 'Invalid Date';
//                 }
//             };

//             // Set canvas dimensions
//             canvas.width = image.width;
//             canvas.height = image.height;

//             // Clear canvas and draw background image
//             ctx.clearRect(0, 0, canvas.width, canvas.height);
//             ctx.drawImage(image, 0, 0);

//             // Set font for name and course title
//             ctx.font = '12px "Poppins", sans-serif';
//             ctx.fillStyle = '#000';

//             // Student name (centered, red color)
//             const studentName = course.name || 'N/A';
//             ctx.fillText(studentName, 190, 288);
//             const email = course.email || 'N/A';
//             ctx.fillText(email, 198, 328);
//             const phoneNo = course.phone || 'N/A';
//             ctx.fillText(phoneNo, 250, 366);

//             ctx.font = '12px "Poppins", sans-serif';
//             ctx.fillStyle = '#000';

//             // Course title
//             const receiptIdNo = course?.receiptNo || 'N/A';
//             ctx.fillText(receiptIdNo, 480, 288);
//             const courseTitle = course.course_title || 'N/A';
//             ctx.fillText(courseTitle, 456, 328);
//             const studentIdNo = course?.studentId || 'N/A';
//             ctx.fillText(studentIdNo, 470, 366);

//             // Date range
//             ctx.font = '12px "Poppins", sans-serif';
//             ctx.fillStyle = '#000';

//             // Current date
//             const currentDate = new Date().toLocaleDateString('en-GB');
//             ctx.fillText(currentDate, 735, 288);
//             const feeType = course?.feeType || 'N/A';
//             ctx.fillText(feeType, 773, 328);
//             const nextDueDate = course?.dueDate || 'N/A';
//             ctx.fillText(nextDueDate, 805, 366);

//             // Add payment information
//             ctx.font = '16px "Poppins", sans-serif';
//             ctx.fillStyle = '#000';
//             ctx.textAlign = 'left';

//             // Total amount
//             const totalAmount = `${course.totalAmount || 0}`;
//             ctx.fillText(totalAmount, 805, 455);

//             // Advance amount if applicable
//             if (course.advance && course.advanceAmount > 0) {
//                 const advanceAmount = `${course.advanceAmount}`;
//                 ctx.fillText(advanceAmount, 805, 495);

//                 const balanceAmount = `${(course.totalAmount || 0) - (course.advanceAmount || 0)}`;
//                 ctx.fillText(balanceAmount, 805, 535);
//             }
//         };

//         image.onerror = () => {
//             console.error("Failed to load invoice template image");
//             // Fallback: create a simple invoice without background image
//             canvas.width = 800;
//             canvas.height = 600;
//             ctx.fillStyle = '#ffffff';
//             ctx.fillRect(0, 0, canvas.width, canvas.height);

//             // Add border
//             ctx.strokeStyle = '#000000';
//             ctx.lineWidth = 2;
//             ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

//             // Add title
//             ctx.font = 'bold 24px "Poppins", sans-serif';
//             ctx.fillStyle = '#000000';
//             ctx.textAlign = 'center';
//             ctx.fillText('COURSE INVOICE', canvas.width / 2, 50);

//             // Add content
//             ctx.font = '18px "Poppins", sans-serif';
//             ctx.textAlign = 'left';
//             ctx.fillText(`Student: ${course.name}`, 50, 120);
//             ctx.fillText(`Course: ${course.course_title}`, 50, 150);
//             ctx.fillText(`Email: ${course.email}`, 50, 180);
//             ctx.fillText(`Phone: ${course.phone}`, 50, 210);
//             ctx.fillText(`Total Amount: ₹${course.totalAmount || 0}`, 50, 270);

//             if (course.advance && course.advanceAmount > 0) {
//                 ctx.fillText(`Advance Paid: ₹${course.advanceAmount}`, 50, 300);
//                 ctx.fillText(`Balance: ₹${(course.totalAmount || 0) - (course.advanceAmount || 0)}`, 50, 330);
//             }

//             ctx.fillText(`Date: ${new Date().toLocaleDateString('en-GB')}`, 50, 400);
//         };

//         // Use the certificate template image
//         image.src = '/course/certificate/invoice.png';
//     };

//     // Update the handleDownload function:
//     const handleDownload = () => {
//         const canvas = canvasRef.current;
//         if (!canvas || !selectedInvoiceEnrollment) return;

//         try {
//             const link = document.createElement('a');
//             const fileName = `invoice_${selectedInvoiceEnrollment?.name?.replace(/\s+/g, '_') || 'student'}_${Date.now()}.png`;
//             link.download = fileName;
//             link.href = canvas.toDataURL('image/png');
//             link.click();
//         } catch (error) {
//             console.error('Failed to download invoice:', error);
//             alert('Failed to download invoice. Please try again.');
//         }
//     };

//     const getPaymentBadge = (advance: boolean, advanceAmount: number, totalAmount: number) => {
//         if (advance && advanceAmount > 0 && advanceAmount < totalAmount) {
//             return (
//                 <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
//                     Partial Payment
//                 </span>
//             );
//         }
//         return (
//             <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                 Paid
//             </span>
//         );
//     };

//     useEffect(() => {
//         setCurrentTab("enrolled");
//     }, [currentTab]);

//     return (
//         <React.Fragment>
//             <Head>
//                 <link rel="icon" href="/favicon.ico" type="image/ico" sizes="70x70" />
//                 <title>Enrolled Courses | Admin Dashboard</title>
//                 <meta name="description" content="Enrolled Course Section in Admin Dashboard of TechPratham." />
//             </Head>

//             {loading ? (
//                 <AdminLoader />
//             ) : (!authenticated || !isAdmin) ? (
//                 <SignOut />
//             ) : (
//                 <div className='w-full h-full md:h-screen min-h-screen flex flex-row items-start justify-start fixed'>

//                     <AdminSidebar />

//                     <div className='bg-black flex flex-col w-full h-full md:relative fixed'>

//                         <AdminTopBar />

//                         {isLoading ? (
//                             <div className="min-h-screen flex items-center justify-center bg-black">
//                                 <div className="text-center">
//                                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//                                     <p className="text-gray-600">Loading enrolled courses...</p>
//                                 </div>
//                             </div>
//                         ) : (
//                             <div className="bg-black p-6 overflow-y-auto">
//                                 <div className='w-full h-auto flex flex-row items-center justify-between'>
//                                     <h2 className="text-xl font-semibold text-white mb-4">Enrolled Courses</h2>
//                                     <div className="flex items-center gap-2">
//                                         <span className="text-blue-400 text-sm">In Progress Courses</span>
//                                         <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
//                                             {enrolledData.length}
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {enrolledData.length > 0 ? (
//                                     <div className="grid lg:grid-cols-2 md:grid-cols-1 grid-cols-1 gap-6 w-full">
//                                         {enrolledData.map((enrollment: any, index: any) => (
//                                             <div key={index} className="w-full max-w-lg h-auto flex flex-col p-6 transition-all duration-300 bg-[#1a1a1a]">

//                                                 <div className="text-xl font-semibold text-white leading-tight flex-1 pr-2">
//                                                     {enrollment.course_title}
//                                                 </div>

//                                                 <div className="my-3 flex flex-row gap-2">
//                                                     <Badge variant={'secondary'}>
//                                                         {enrollment.category}
//                                                     </Badge>
//                                                     <Badge variant={'secondary'}>
//                                                         {enrollment.level}
//                                                     </Badge>
//                                                     <Badge variant={'secondary'}>
//                                                         In Progress
//                                                     </Badge>
//                                                 </div>

//                                                 <div className="text-sm text-gray-600 mb-4 flex-grow leading-relaxed line-clamp-3">
//                                                     {enrollment.course_desc}
//                                                 </div>

//                                                 {/* Student Information */}
//                                                 <div className="bg-gray-50 p-4 rounded-lg mb-4">
//                                                     <h4 className="font-semibold text-gray-800 mb-2">Student Details</h4>
//                                                     <div className="space-y-1 text-sm">
//                                                         <div><span className="font-medium">Name:</span> {enrollment.name}</div>
//                                                         <div><span className="font-medium">Email:</span> {enrollment.email}</div>
//                                                         <div><span className="font-medium">Phone:</span> {enrollment.phone}</div>
//                                                     </div>
//                                                 </div>

//                                                 {/* Payment Information */}
//                                                 <div className="bg-green-50 p-4 rounded-lg mb-4">
//                                                     <div className="flex justify-between items-center mb-2">
//                                                         <h4 className="font-semibold text-gray-800">Payment Status</h4>
//                                                         {getPaymentBadge(enrollment.advance, enrollment.advanceAmount, enrollment.totalAmount)}
//                                                     </div>
//                                                     <div className="space-y-1 text-sm">
//                                                         <div className="flex justify-between">
//                                                             <span className="font-medium">Total Amount:</span>
//                                                             <span className="text-green-600 font-bold">₹{enrollment.totalAmount}</span>
//                                                         </div>
//                                                         {enrollment.advance && enrollment.advanceAmount > 0 && (
//                                                             <>
//                                                                 <div className="flex justify-between">
//                                                                     <span className="font-medium">Advance Paid:</span>
//                                                                     <span className="text-orange-600 font-bold">₹{enrollment.advanceAmount}</span>
//                                                                 </div>
//                                                                 <div className="flex justify-between">
//                                                                     <span className="font-medium">Final Payment:</span>
//                                                                     <span className="text-blue-600 font-bold">₹{enrollment.finalPayment || 0}</span>
//                                                                 </div>
//                                                                 <div className="flex justify-between">
//                                                                     <span className="font-medium">Remaining:</span>
//                                                                     <span className="text-red-600 font-bold">₹{enrollment.totalAmount - (enrollment.advanceAmount + (enrollment.finalPayment || 0))}</span>
//                                                                 </div>
//                                                             </>
//                                                         )}
//                                                     </div>
//                                                 </div>

//                                                 {/* Certificate Information */}
//                                                 {enrollment.certificate && (
//                                                     <div className="bg-yellow-50 p-4 rounded-lg mb-4">
//                                                         <h4 className="font-semibold text-gray-800 mb-2">Certificate Details</h4>
//                                                         <div className="space-y-1 text-sm">
//                                                             <div><span className="font-medium">Enrolled Date:</span> {new Date(enrollment.certificate.enrolledDate).toLocaleDateString('en-IN')}</div>
//                                                             {enrollment.certificate.completionDate && (
//                                                                 <div><span className="font-medium">Completion Date:</span> {new Date(enrollment.certificate.completionDate).toLocaleDateString('en-IN')}</div>
//                                                             )}
//                                                             {enrollment.certificate.certificateId && (
//                                                                 <div><span className="font-medium">Certificate ID:</span> {enrollment.certificate.certificateId}</div>
//                                                             )}
//                                                         </div>
//                                                     </div>
//                                                 )}

//                                                 {/* Course Duration */}
//                                                 <div className="flex justify-between items-center mb-4">
//                                                     <div className="flex items-center gap-2">
//                                                         <span className="text-green-500">✓</span>
//                                                         <span className="text-green-600 font-medium text-sm">Payment Verified</span>
//                                                     </div>
//                                                     <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
//                                                         Duration: {enrollment.duration}
//                                                     </div>
//                                                 </div>

//                                                 {/* Action Button */}
//                                                 <div className="flex gap-2">
//                                                     <Dialog>
//                                                         <DialogTrigger asChild>
//                                                             <Button
//                                                                 variant='manual'
//                                                                 onClick={() => handleGenerateInvoice(enrollment)}
//                                                                 className="w-full border-gray-300 hover:bg-gray-50 transition-all duration-200"
//                                                             >
//                                                                 Generate Invoice
//                                                             </Button>
//                                                         </DialogTrigger>
//                                                         <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white hide-scrollbar">
//                                                             <DialogHeader>
//                                                                 <DialogTitle>Generate Invoice - {selectedInvoiceEnrollment?.course_title}</DialogTitle>
//                                                             </DialogHeader>

//                                                             {selectedInvoiceEnrollment && (
//                                                                 <>
//                                                                     {/* Course & Student Info Summary */}
//                                                                     <div className="grid grid-cols-2 gap-4 mb-4">
//                                                                         <div className="bg-gray-50 p-3 rounded-lg">
//                                                                             <h4 className="font-semibold text-gray-800 mb-2">Student Info</h4>
//                                                                             <div className="space-y-1 text-sm">
//                                                                                 <div><span className="font-medium">Name:</span> {selectedInvoiceEnrollment.name}</div>
//                                                                                 <div><span className="font-medium">Email:</span> {selectedInvoiceEnrollment.email}</div>
//                                                                                 <div><span className="font-medium">Phone:</span> {selectedInvoiceEnrollment.phone}</div>
//                                                                             </div>
//                                                                         </div>
//                                                                         <div className="bg-gray-50 p-3 rounded-lg">
//                                                                             <h4 className="font-semibold text-gray-800 mb-2">Course Info</h4>
//                                                                             <div className="space-y-1 text-sm">
//                                                                                 <div><span className="font-medium">Course:</span> {selectedInvoiceEnrollment.course_title}</div>
//                                                                                 <div><span className="font-medium">Duration:</span> {selectedInvoiceEnrollment.duration}</div>
//                                                                                 <div><span className="font-medium">Level:</span> {selectedInvoiceEnrollment.level}</div>
//                                                                             </div>
//                                                                         </div>
//                                                                     </div>

//                                                                     <Form {...invoiceForm}>
//                                                                         <form onSubmit={invoiceForm.handleSubmit(onInvoiceSubmit)} className="space-y-4">

//                                                                             {/* Payment Details */}
//                                                                             <div className="bg-blue-50 p-4 rounded-lg">
//                                                                                 <h4 className="font-semibold text-gray-800 mb-3">Payment Details</h4>
//                                                                                 <div className="grid grid-cols-2 gap-4">
//                                                                                     <FormField
//                                                                                         control={invoiceForm.control}
//                                                                                         name="totalAmount"
//                                                                                         render={({ field }) => (
//                                                                                             <FormItem>
//                                                                                                 <FormLabel>Total Course Fee</FormLabel>
//                                                                                                 <FormControl>
//                                                                                                     <Input
//                                                                                                         type="number"
//                                                                                                         placeholder="0"
//                                                                                                         {...field}
//                                                                                                         onChange={(e) => field.onChange(Number(e.target.value))}
//                                                                                                     />
//                                                                                                 </FormControl>
//                                                                                                 <FormMessage />
//                                                                                             </FormItem>
//                                                                                         )}
//                                                                                     />

//                                                                                     <FormField
//                                                                                         control={invoiceForm.control}
//                                                                                         name="feeType"
//                                                                                         render={({ field }) => (
//                                                                                             <FormItem>
//                                                                                                 <FormLabel>Fee Type</FormLabel>
//                                                                                                 <Select onValueChange={field.onChange} value={field.value}>
//                                                                                                     <FormControl>
//                                                                                                         <SelectTrigger>
//                                                                                                             <SelectValue placeholder="Select fee type" />
//                                                                                                         </SelectTrigger>
//                                                                                                     </FormControl>
//                                                                                                     <SelectContent>
//                                                                                                         <SelectItem value="full">Full Payment</SelectItem>
//                                                                                                         <SelectItem value="advance">Advance Payment</SelectItem>
//                                                                                                         <SelectItem value="installment">Installment</SelectItem>
//                                                                                                     </SelectContent>
//                                                                                                 </Select>
//                                                                                                 <FormMessage />
//                                                                                             </FormItem>
//                                                                                         )}
//                                                                                     />
//                                                                                 </div>

//                                                                                 <div className="grid grid-cols-2 gap-4 mt-4">
//                                                                                     <FormField
//                                                                                         control={invoiceForm.control}
//                                                                                         name="advanceAmount"
//                                                                                         render={({ field }) => (
//                                                                                             <FormItem>
//                                                                                                 <FormLabel>Advance Amount</FormLabel>
//                                                                                                 <FormControl>
//                                                                                                     <Input
//                                                                                                         type="number"
//                                                                                                         placeholder="0"
//                                                                                                         {...field}
//                                                                                                         onChange={(e) => field.onChange(Number(e.target.value))}
//                                                                                                     />
//                                                                                                 </FormControl>
//                                                                                                 <FormMessage />
//                                                                                             </FormItem>
//                                                                                         )}
//                                                                                     />

//                                                                                     <div className="space-y-2">
//                                                                                         <Label className="block text-sm font-medium text-gray-700">
//                                                                                             Balance Due
//                                                                                         </Label>
//                                                                                         <div className="mt-1 relative rounded-md shadow-sm">
//                                                                                             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                                                                                 <span className="text-gray-500 sm:text-sm">₹</span>
//                                                                                             </div>
//                                                                                             <Input
//                                                                                                 type="number"
//                                                                                                 value={(invoiceForm.watch("totalAmount") || 0) - (invoiceForm.watch("advanceAmount") || 0)}
//                                                                                                 readOnly
//                                                                                                 className="block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 cursor-not-allowed focus:outline-none"
//                                                                                                 placeholder="0.00"
//                                                                                             />
//                                                                                         </div>
//                                                                                     </div>
//                                                                                 </div>
//                                                                             </div>

//                                                                             {/* Invoice Details */}
//                                                                             <div className="bg-green-50 p-4 rounded-lg">
//                                                                                 <h4 className="font-semibold text-gray-800 mb-3">Invoice Details</h4>
//                                                                                 <div className="grid grid-cols-2 gap-4">
//                                                                                     <FormField
//                                                                                         control={invoiceForm.control}
//                                                                                         name="enrolledDate"
//                                                                                         render={({ field }) => (
//                                                                                             <FormItem>
//                                                                                                 <FormLabel>Enrolled Date</FormLabel>
//                                                                                                 <FormControl>
//                                                                                                     <Input
//                                                                                                         type="date"
//                                                                                                         {...field}
//                                                                                                     />
//                                                                                                 </FormControl>
//                                                                                                 <FormMessage />
//                                                                                             </FormItem>
//                                                                                         )}
//                                                                                     />

//                                                                                     <FormField
//                                                                                         control={invoiceForm.control}
//                                                                                         name="dueDate"
//                                                                                         render={({ field }) => (
//                                                                                             <FormItem>
//                                                                                                 <FormLabel>Next Due Date</FormLabel>
//                                                                                                 <FormControl>
//                                                                                                     <Input
//                                                                                                         type="text"
//                                                                                                         {...field}
//                                                                                                         placeholder='Due Date'
//                                                                                                     />
//                                                                                                 </FormControl>
//                                                                                                 <FormMessage />
//                                                                                             </FormItem>
//                                                                                         )}
//                                                                                     />
//                                                                                 </div>

//                                                                                 <div className="grid grid-cols-2 gap-4 mt-4">
//                                                                                     <FormField
//                                                                                         control={invoiceForm.control}
//                                                                                         name="studentId"
//                                                                                         render={({ field }) => (
//                                                                                             <FormItem>
//                                                                                                 <FormLabel>Student ID</FormLabel>
//                                                                                                 <FormControl>
//                                                                                                     <Input
//                                                                                                         type="text"
//                                                                                                         placeholder="Student Id"
//                                                                                                         {...field}
//                                                                                                     />
//                                                                                                 </FormControl>
//                                                                                                 <FormMessage />
//                                                                                             </FormItem>
//                                                                                         )}
//                                                                                     />

//                                                                                     <FormField
//                                                                                         control={invoiceForm.control}
//                                                                                         name="receiptNo"
//                                                                                         render={({ field }) => (
//                                                                                             <FormItem>
//                                                                                                 <FormLabel>Receipt Number</FormLabel>
//                                                                                                 <FormControl>
//                                                                                                     <Input
//                                                                                                         type="text"
//                                                                                                         placeholder="Enter receipt number"
//                                                                                                         {...field}
//                                                                                                     />
//                                                                                                 </FormControl>
//                                                                                                 <FormMessage />
//                                                                                             </FormItem>
//                                                                                         )}
//                                                                                     />
//                                                                                 </div>
//                                                                             </div>

//                                                                             {/* Summary Section */}
//                                                                             <div className="bg-yellow-50 p-4 rounded-lg">
//                                                                                 <h4 className="font-semibold text-gray-800 mb-3">Invoice Summary</h4>
//                                                                                 <div className="space-y-2 text-sm">
//                                                                                     <div className="flex justify-between">
//                                                                                         <span>Course Fee:</span>
//                                                                                         <span className="font-medium">₹{invoiceForm.watch("totalAmount") || 0}</span>
//                                                                                     </div>
//                                                                                     <div className="flex justify-between">
//                                                                                         <span>Advance Paid:</span>
//                                                                                         <span className="font-medium text-green-600">₹{invoiceForm.watch("advanceAmount") || 0}</span>
//                                                                                     </div>
//                                                                                     <div className="flex justify-between">
//                                                                                         <span>Balance Due:</span>
//                                                                                         <span className="font-medium text-red-600">₹{(invoiceForm.watch("totalAmount") || 0) - (invoiceForm.watch("advanceAmount") || 0)}</span>
//                                                                                     </div>
//                                                                                     <hr className="my-2" />
//                                                                                     <div className="flex justify-between font-semibold">
//                                                                                         <span>Total Amount:</span>
//                                                                                         <span>₹{invoiceForm.watch("totalAmount") || 0}</span>
//                                                                                     </div>
//                                                                                 </div>
//                                                                             </div>

//                                                                             <canvas
//                                                                                 ref={canvasRef}
//                                                                                 className='w-full hidden h-auto object-cover border-2 border-gray-200 rounded-lg shadow-lg'
//                                                                             />

//                                                                             <div className="flex gap-2 pt-4">
//                                                                                 <Button
//                                                                                     type="button"
//                                                                                     onClick={() => {
//                                                                                         const updatedEnrollment = {
//                                                                                             ...selectedInvoiceEnrollment,
//                                                                                             totalAmount: invoiceForm.watch("totalAmount"),
//                                                                                             advanceAmount: invoiceForm.watch("advanceAmount"),
//                                                                                             feeType: invoiceForm.watch("feeType"),
//                                                                                             dueDate: invoiceForm.watch("dueDate"),
//                                                                                             studentId: invoiceForm.watch("studentId"),
//                                                                                             receiptNo: invoiceForm.watch("receiptNo"),
//                                                                                         };

//                                                                                         setTimeout(() => {
//                                                                                             drawInvoice(updatedEnrollment);
//                                                                                             setTimeout(() => {
//                                                                                                 handleDownload();
//                                                                                             }, 500);
//                                                                                         }, 100);
//                                                                                     }}
//                                                                                     className="bg-blue-600 hover:bg-blue-700"
//                                                                                 >
//                                                                                     Download Invoice
//                                                                                 </Button>
//                                                                             </div>
//                                                                             <div>Note: if you're getting empty invoice, try to update the data first.</div>

//                                                                             <Button type="submit" disabled={isSubmitting} className="flex-1">
//                                                                                 {isSubmitting ? 'Updating...' : 'Update Data'}
//                                                                             </Button>
//                                                                         </form>
//                                                                     </Form>
//                                                                 </>
//                                                             )}
//                                                         </DialogContent>
//                                                     </Dialog>
//                                                     <Dialog>
//                                                         <DialogTrigger asChild>
//                                                             <Button
//                                                                 onClick={() => handleFinalizeCourse(enrollment)}
//                                                                 className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
//                                                             >
//                                                                 Finalize Course
//                                                             </Button>
//                                                         </DialogTrigger>
//                                                         <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white hide-scrollbar">
//                                                             <DialogHeader>
//                                                                 <DialogTitle>Finalize Course - {selectedEnrollment?.course_title}</DialogTitle>
//                                                             </DialogHeader>

//                                                             {selectedEnrollment && (
//                                                                 <>
//                                                                     {/* Course Details */}
//                                                                     <div className="bg-gray-50 p-4 rounded-lg mb-4">
//                                                                         <h4 className="font-semibold text-gray-800 mb-2">Course Details</h4>
//                                                                         <div className="space-y-2 text-sm">
//                                                                             <div><span className="font-medium">Title:</span> {selectedEnrollment.course_title}</div>
//                                                                             <div><span className="font-medium">Description:</span> {selectedEnrollment.course_desc}</div>
//                                                                             <div><span className="font-medium">Duration:</span> {selectedEnrollment.duration}</div>
//                                                                             <div><span className="font-medium">Level:</span> {selectedEnrollment.level}</div>
//                                                                             <div><span className="font-medium">Category:</span> {selectedEnrollment.category}</div>
//                                                                             <div><span className="font-medium">Course Link:</span> {selectedEnrollment.course_link}</div>
//                                                                         </div>
//                                                                     </div>

//                                                                     {/* Student Details */}
//                                                                     <div className="bg-gray-50 p-4 rounded-lg mb-4">
//                                                                         <h4 className="font-semibold text-gray-800 mb-2">Student Details</h4>
//                                                                         <div className="space-y-2 text-sm">
//                                                                             <div><span className="font-medium">Name:</span> {selectedEnrollment.name}</div>
//                                                                             <div><span className="font-medium">Email:</span> {selectedEnrollment.email}</div>
//                                                                             <div><span className="font-medium">Phone:</span> {selectedEnrollment.phone}</div>
//                                                                         </div>
//                                                                     </div>

//                                                                     {/* Course Finalization Form */}
//                                                                     <Form {...form}>
//                                                                         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//                                                                             <div className="grid grid-cols-2 gap-4">
//                                                                                 <FormField
//                                                                                     control={form.control}
//                                                                                     name="advance"
//                                                                                     render={({ field }) => (
//                                                                                         <FormItem>
//                                                                                             <FormLabel>Advance Payment</FormLabel>
//                                                                                             <Select onValueChange={(value) => field.onChange(value === "true")} value={field.value.toString()}>
//                                                                                                 <FormControl>
//                                                                                                     <SelectTrigger>
//                                                                                                         <SelectValue placeholder="Select advance payment" />
//                                                                                                     </SelectTrigger>
//                                                                                                 </FormControl>
//                                                                                                 <SelectContent>
//                                                                                                     <SelectItem value="true">Yes</SelectItem>
//                                                                                                     <SelectItem value="false">No</SelectItem>
//                                                                                                 </SelectContent>
//                                                                                             </Select>
//                                                                                             <FormMessage />
//                                                                                         </FormItem>
//                                                                                     )}
//                                                                                 />

//                                                                                 <FormField
//                                                                                     control={form.control}
//                                                                                     name="advanceAmount"
//                                                                                     render={({ field }) => (
//                                                                                         <FormItem>
//                                                                                             <FormLabel>Advance Amount</FormLabel>
//                                                                                             <FormControl>
//                                                                                                 <Input
//                                                                                                     type="number"
//                                                                                                     placeholder="0"
//                                                                                                     disabled={!watchAdvance}
//                                                                                                     {...field}
//                                                                                                     onChange={(e) => field.onChange(Number(e.target.value))}
//                                                                                                 />
//                                                                                             </FormControl>
//                                                                                             <FormMessage />
//                                                                                         </FormItem>
//                                                                                     )}
//                                                                                 />
//                                                                             </div>

//                                                                             <div className="grid grid-cols-2 gap-4">
//                                                                                 <FormField
//                                                                                     control={form.control}
//                                                                                     name="finalPayment"
//                                                                                     render={({ field }) => (
//                                                                                         <FormItem>
//                                                                                             <FormLabel>Final Payment</FormLabel>
//                                                                                             <FormControl>
//                                                                                                 <Input
//                                                                                                     type="number"
//                                                                                                     placeholder="0"
//                                                                                                     {...field}
//                                                                                                     onChange={(e) => field.onChange(Number(e.target.value))}
//                                                                                                 />
//                                                                                             </FormControl>
//                                                                                             <FormDescription>
//                                                                                                 Remaining payment amount after advance
//                                                                                             </FormDescription>
//                                                                                             <FormMessage />
//                                                                                         </FormItem>
//                                                                                     )}
//                                                                                 />

//                                                                                 <FormField
//                                                                                     control={form.control}
//                                                                                     name="totalAmount"
//                                                                                     render={({ field }) => (
//                                                                                         <FormItem>
//                                                                                             <FormLabel>Total Amount</FormLabel>
//                                                                                             <FormControl>
//                                                                                                 <Input
//                                                                                                     type="number"
//                                                                                                     placeholder="0"
//                                                                                                     {...field}
//                                                                                                     onChange={(e) => field.onChange(Number(e.target.value))}
//                                                                                                 />
//                                                                                             </FormControl>
//                                                                                             <FormDescription>
//                                                                                                 Total course fee amount
//                                                                                             </FormDescription>
//                                                                                             <FormMessage />
//                                                                                         </FormItem>
//                                                                                     )}
//                                                                                 />
//                                                                             </div>

//                                                                             <div className="grid grid-cols-2 gap-4">
//                                                                                 <FormField
//                                                                                     control={form.control}
//                                                                                     name="verifyPayment"
//                                                                                     render={({ field }) => (
//                                                                                         <FormItem>
//                                                                                             <FormLabel>Verify Payment</FormLabel>
//                                                                                             <Select onValueChange={(value) => field.onChange(value === "true")} value={field.value.toString()}>
//                                                                                                 <FormControl>
//                                                                                                     <SelectTrigger>
//                                                                                                         <SelectValue placeholder="Select verification status" />
//                                                                                                     </SelectTrigger>
//                                                                                                 </FormControl>
//                                                                                                 <SelectContent>
//                                                                                                     <SelectItem value="true">Verified</SelectItem>
//                                                                                                     <SelectItem value="false">Not Verified</SelectItem>
//                                                                                                 </SelectContent>
//                                                                                             </Select>
//                                                                                             <FormMessage />
//                                                                                         </FormItem>
//                                                                                     )}
//                                                                                 />

//                                                                                 <FormField
//                                                                                     control={form.control}
//                                                                                     name="courseCompletion"
//                                                                                     render={({ field }) => (
//                                                                                         <FormItem>
//                                                                                             <FormLabel>Course Completion</FormLabel>
//                                                                                             <Select onValueChange={(value) => field.onChange(value === "true")} value={field.value.toString()}>
//                                                                                                 <FormControl>
//                                                                                                     <SelectTrigger>
//                                                                                                         <SelectValue placeholder="Select completion status" />
//                                                                                                     </SelectTrigger>
//                                                                                                 </FormControl>
//                                                                                                 <SelectContent>
//                                                                                                     <SelectItem value="true">Completed</SelectItem>
//                                                                                                     <SelectItem value="false">Not Completed</SelectItem>
//                                                                                                 </SelectContent>
//                                                                                             </Select>
//                                                                                             <FormMessage />
//                                                                                         </FormItem>
//                                                                                     )}
//                                                                                 />
//                                                                             </div>

//                                                                             {/* Certificate Information Fields */}
//                                                                             <div className="bg-yellow-50 p-4 rounded-lg">
//                                                                                 <h4 className="font-semibold text-gray-800 mb-3">Certificate Information</h4>
//                                                                                 <div className="grid grid-cols-1 gap-4">
//                                                                                     <FormField
//                                                                                         control={form.control}
//                                                                                         name="enrolledDate"
//                                                                                         render={({ field }) => (
//                                                                                             <FormItem>
//                                                                                                 <FormLabel>Enrolled Date</FormLabel>
//                                                                                                 <FormControl>
//                                                                                                     <Input
//                                                                                                         type="date"
//                                                                                                         {...field}
//                                                                                                     />
//                                                                                                 </FormControl>
//                                                                                                 <FormDescription>
//                                                                                                     Date when the student enrolled in the course
//                                                                                                 </FormDescription>
//                                                                                                 <FormMessage />
//                                                                                             </FormItem>
//                                                                                         )}
//                                                                                     />

//                                                                                     <FormField
//                                                                                         control={form.control}
//                                                                                         name="completionDate"
//                                                                                         render={({ field }) => (
//                                                                                             <FormItem>
//                                                                                                 <FormLabel>Completion Date</FormLabel>
//                                                                                                 <FormControl>
//                                                                                                     <Input
//                                                                                                         type="date"
//                                                                                                         {...field}
//                                                                                                     />
//                                                                                                 </FormControl>
//                                                                                                 <FormDescription>
//                                                                                                     Date when the student completed the course
//                                                                                                 </FormDescription>
//                                                                                                 <FormMessage />
//                                                                                             </FormItem>
//                                                                                         )}
//                                                                                     />

//                                                                                     <FormField
//                                                                                         control={form.control}
//                                                                                         name="certificateId"
//                                                                                         render={({ field }) => (
//                                                                                             <FormItem>
//                                                                                                 <FormLabel>Certificate ID</FormLabel>
//                                                                                                 <FormControl>
//                                                                                                     <Input
//                                                                                                         type="text"
//                                                                                                         placeholder="Enter certificate ID"
//                                                                                                         {...field}
//                                                                                                     />
//                                                                                                 </FormControl>
//                                                                                                 <FormDescription>
//                                                                                                     Unique identifier for the certificate
//                                                                                                 </FormDescription>
//                                                                                                 <FormMessage />
//                                                                                             </FormItem>
//                                                                                         )}
//                                                                                     />
//                                                                                 </div>
//                                                                             </div>

//                                                                             <div className="flex gap-2 pt-4">
//                                                                                 <Button type="submit" disabled={isSubmitting} className="flex-1">
//                                                                                     {isSubmitting ? 'Finalizing...' : 'Finalize Course'}
//                                                                                 </Button>
//                                                                             </div>
//                                                                         </form>
//                                                                     </Form>
//                                                                 </>
//                                                             )}
//                                                         </DialogContent>
//                                                     </Dialog>
//                                                 </div>

//                                                 {/* Timestamp */}
//                                                 < div className="text-xs text-gray-400 mt-3 text-center" >
//                                                     Enrolled on: {new Date(enrollment.createdAt).toLocaleDateString('en-IN', {
//                                                         day: 'numeric',
//                                                         month: 'short',
//                                                         year: 'numeric',
//                                                         hour: '2-digit',
//                                                         minute: '2-digit'
//                                                     })}
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 ) : (
//                                     <div className="flex flex-col items-center justify-center py-16">
//                                         <div className="text-center">
//                                             <div className="mb-4">
//                                                 <svg className="w-20 h-20 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
//                                                 </svg>
//                                             </div>
//                                             <h3 className="text-lg font-medium text-gray-300 mb-2">No enrolled courses</h3>
//                                             <p className="text-gray-400 mb-6">No students have enrolled in courses that are currently in progress.</p>
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             )}
//         </React.Fragment >
//     )
// }

// export default Enrolled

"use client";

import React, { useContext, useEffect, useState } from "react";
import Head from "next/head";
import { UserContext } from "@/context/userContext";
import AdminSidebar from "@/src/account/common/AdminSidebar";
import AdminTopBar from "@/src/account/common/AdminTopBar";
import AdminLoader from "@/src/account/common/AdminLoader";
import SignOut from "@/src/account/common/SignOut";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Button } from "@/components/ui/button";

interface Enrollment {
  _id: string;
  name: string;
  email: string;
  phone: string;
  course_title: string;
  createdAt: string;
}

export default function EnrollmentsAdmin() {
  const { authenticated, loading, isAdmin, setCurrentTab } =
    useContext(UserContext);

  const [data, setData] = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setCurrentTab("enrollments");
  }, []);

  useEffect(() => {
    if (authenticated) fetchEnrollments();
  }, [authenticated]);

  const fetchEnrollments = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/course/enrollment");
      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error("Failed to fetch enrollments", err);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Enrolled Students", 14, 15);

    autoTable(doc, {
      startY: 25,
      head: [["Name", "Email", "Phone", "Course", "Date"]],
      body: data.map(item => [
        item.name,
        item.email,
        item.phone,
        item.course_title.replace(/<[^>]*>/g, ""),
        new Date(item.createdAt).toLocaleDateString(),
      ]),
      styles: { fontSize: 9 },
    });

    doc.save("enrollments.pdf");
  };

  return (
    <>
      <Head>
        <title>Enrollments | Admin Dashboard</title>
      </Head>

      {loading ? (
        <AdminLoader />
      ) : !authenticated || !isAdmin ? (
        <SignOut />
      ) : (
        <div className="w-full min-h-screen flex">
  <AdminSidebar />

  <div className="flex flex-col w-full bg-black h-screen overflow-hidden">
    <AdminTopBar />

    <div className="p-6 flex-1 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">
          Enrolled Students
        </h2>

        <Button
          onClick={downloadPDF}
          className="bg-green-600 hover:bg-green-700"
        >
          Download PDF
        </Button>
      </div>

      <div className="bg-[#1a1a1a] rounded-lg max-h-[70vh] overflow-y-auto overflow-x-auto">
        <table className="w-full text-sm text-white">
          <thead className="bg-gray-800 sticky top-0 z-10">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Course</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>

          <tbody>
            {data.map(item => (
              <tr key={item._id} className="border-t border-gray-700">
                <td className="p-3">{item.name}</td>
                <td className="p-3">{item.email}</td>
                <td className="p-3">{item.phone}</td>
                <td className="p-3">
                  {item.course_title.replace(/<[^>]*>/g, "")}
                </td>
                <td className="p-3">
                  {new Date(item.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>

      )}
    </>
  );
}
