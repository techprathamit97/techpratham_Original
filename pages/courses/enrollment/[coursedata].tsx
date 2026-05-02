// import React, { useContext, useEffect, useState } from 'react';
// import Head from 'next/head';
// import { useRouter } from 'next/router';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import * as z from 'zod';
// import { signIn } from 'next-auth/react';
// import Navbar from '@/src/common/Navbar/Navbar';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import { Checkbox } from '@/components/ui/checkbox';
// import { Loader2, CheckCircle, User, Mail, Phone, BookOpen, Clock, BarChart3, Tag, UserPlus, LogIn, AlertCircle } from 'lucide-react';
// import { UserContext } from '@/context/userContext';
// import FooterSm from '@/src/common/FooterSm/FooterSm';
// import Link from 'next/link';

// const RenderHTML: React.FC<{ html?: string }> = ({ html = '' }) => (
//   <span dangerouslySetInnerHTML={{ __html: html }} />
// );


// const stripHtml = (html: string = ''): string => {
//   if (typeof window === 'undefined') {
//     return html.replace(/<[^>]*>/g, '');
//   }
//   const div = document.createElement('div');
//   div.innerHTML = html;
//   return div.textContent || div.innerText || '';
// };
// // Zod schema for user registration
// const registrationSchema = z.object({
//   email: z.string().email('Please enter a valid email address'),
//   name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
//   phone: z.string().min(10, 'Phone number must be at least 10 digits').regex(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
//   password: z.string()
//     .min(8, 'Password must be at least 8 characters')
//     .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
// });

// // Zod schema for enrollment (existing users)
// const enrollmentSchema = z.object({
//   email: z.string().email('Please enter a valid email address'),
//   name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
//   phone: z.string().min(10, 'Phone number must be at least 10 digits').regex(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
// });

// type RegistrationFormData = z.infer<typeof registrationSchema>;
// type EnrollmentFormData = z.infer<typeof enrollmentSchema>;

// interface Curriculum {
//   que: string;
//   ans: string;
//   topics: string[];
// }

// interface FAQ {
//   que: string;
//   ans: string;
// }

// interface Course {
//   id: string;
//   link: string;
//   title: string;
//   shortDesc: string;
//   description: string;
//   rating: string;
//   duration: string;
//   level: string;
//   category: string;
//   placement_report: string;
//   curriculum: string;
//   interview: string;
//   videoLink: string;
//   curriculum_data: Curriculum[];
//   skills_data: string[];
//   assesment_link: string;
//   faqs_data: FAQ[];
// }

// type FormStep = 'registration' | 'enrollment' | 'userExists';

// const CourseEnrollPage: React.FC = () => {
//   const router = useRouter();
//   const { userData } = useContext(UserContext);
//   const { coursedata } = router.query;

//   const [course, setCourse] = useState<Course | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error' | 'userExists' | 'alreadyEnrolled'>('idle');
//   const [errorMessage, setErrorMessage] = useState('');
//   const [currentStep, setCurrentStep] = useState<FormStep>('registration');
//   const [showPassword, setShowPassword] = useState(false);
//   const [isChecked, setIsChecked] = useState(false);
//   const [existingUserEmail, setExistingUserEmail] = useState('');

//   // Registration form
//   const registrationForm = useForm<RegistrationFormData>({
//     resolver: zodResolver(registrationSchema),
//     defaultValues: {
//       email: '',
//       name: '',
//       phone: '',
//       password: '',
//     }
//   });

//   // Enrollment form
//   const enrollmentForm = useForm<EnrollmentFormData>({
//     resolver: zodResolver(enrollmentSchema),
//     defaultValues: {
//       email: userData?.email || '',
//       name: userData?.name || '',
//       phone: userData?.phone || '',
//     }
//   });

//   useEffect(() => {
//     const fetchCourseData = async () => {
//       if (!coursedata || typeof coursedata !== 'string') {
//         return;
//       }

//       setLoading(true);
//       setError(null);

//       try {
//         const response = await fetch(`/api/course/link?link=${encodeURIComponent(coursedata)}`);

//         if (!response.ok) {
//           if (response.status === 404) {
//             setError('Course not found');
//           } else {
//             setError('Failed to fetch course data');
//           }
//           return;
//         }

//         const courseData: Course = await response.json();
//         setCourse(courseData);
//       } catch (err) {
//         console.error('Error fetching course data:', err);
//         setError('Failed to fetch course data');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCourseData();
//   }, [coursedata]);

//   useEffect(() => {
//     if (userData?.email) {
//       setCurrentStep('enrollment');
//       enrollmentForm.reset({
//         email: userData.email,
//         name: userData.name || '',
//         phone: userData.phone || '',
//       });
//     } else {
//       setCurrentStep('registration');
//     }
//   }, [userData, enrollmentForm]);

//   const handleRegistration = async (data: RegistrationFormData) => {
//     if (!isChecked) {
//       setErrorMessage('Please accept the terms and conditions');
//       setSubmitStatus('error');
//       return;
//     }

//     try {
//       setIsSubmitting(true);
//       setSubmitStatus('idle');
//       setErrorMessage('');

//       const userData = {
//         name: data.name,
//         email: data.email,
//         phone: data.phone,
//         password: data.password,
//         role: {
//           type: 'user',
//           position: '',
//         },
//         profile: "",
//         courses: {
//           enrolled: [],
//           completed: []
//         }
//       };

//       const userResponse = await fetch('/api/register', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(userData),
//       });

//       if (userResponse.ok) {
//         const loginRes = await signIn("credentials", {
//           redirect: false,
//           email: data.email,
//           password: data.password,
//         });

//         if (loginRes?.error) {
//           setErrorMessage('Registration successful, but login failed. Please try logging in manually.');
//           setSubmitStatus('error');
//         } else {
//           setCurrentStep('enrollment');
//           enrollmentForm.reset({
//             email: data.email,
//             name: data.name,
//             phone: data.phone,
//           });
//           setSubmitStatus('success');
//         }
//       } else {
//         const errorData = await userResponse.json();

//         if (errorData.message && errorData.message.includes('already exists') || errorData.message.includes('already registered')) {
//           setExistingUserEmail(data.email);
//           setSubmitStatus('userExists');
//           setCurrentStep('userExists');
//         } else {
//           setErrorMessage(errorData.message || 'Registration failed');
//           setSubmitStatus('error');
//         }
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       setErrorMessage('An unexpected error occurred');
//       setSubmitStatus('error');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleEnrollment = async (data: EnrollmentFormData) => {
//     if (!course) return;

//     setIsSubmitting(true);
//     setSubmitStatus('idle');
//     setErrorMessage('');

//     try {
//       const enrollmentData = {
//         course_link: course.link,
//         course_title: course.title,
//         course_desc: course.shortDesc,
//         duration: course.duration,
//         level: course.level,
//         category: course.category,
//         email: data.email,
//         name: data.name,
//         phone: data.phone,
//         advance: false,
//         advanceAmount: 0,
//         finalPayment: 0,
//         totalAmount: 0,
//         verifyPayment: false,
//         courseCompletion: false,
//         certificate: null
//       };

//       const response = await fetch('/api/course/enrollment', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(enrollmentData),
//       });

//       const responseData = await response.json();

//       if (!response.ok) {
//         // Handle duplicate enrollment (409 Conflict)
//         if (response.status === 409) {
//           setSubmitStatus('alreadyEnrolled');
//           setErrorMessage('You are already enrolled in this course.');
//           return;
//         }

//         // Handle other errors
//         throw new Error(responseData.message || 'Failed to submit enrollment');
//       }

//       setSubmitStatus('success');
//       router.push('/');
//       enrollmentForm.reset();
//     } catch (error) {
//       setSubmitStatus('error');
//       setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleLogin = async () => {
//     router.push(`/login?returnUrl=${encodeURIComponent(router.asPath)}`);
//   };

//   const handleBackToRegistration = () => {
//     setCurrentStep('registration');
//     setSubmitStatus('idle');
//     setErrorMessage('');
//     setExistingUserEmail('');
//   };

//   if (loading) {
//     return (
//       <React.Fragment>
//         <Head>
//           <title>Loading... | TechPratham</title>
//         </Head>
//         <Navbar />
//         <div className="w-full h-screen flex items-center justify-center">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700 mx-auto mb-4"></div>
//             <p className="text-gray-600">Loading course data...</p>
//           </div>
//         </div>
//         <FooterSm />
//       </React.Fragment>
//     );
//   }

//   if (error || !course) {
//     return (
//       <React.Fragment>
//         <Head>
//           <title>Course Not Found | TechPratham</title>
//         </Head>
//         <Navbar />
//         <div className="w-full h-screen flex items-center justify-center">
//           <div className="text-center">
//             <h1 className="text-2xl font-bold text-red-600 mb-4">
//               {error || 'Course not found'}
//             </h1>
//             <p className="text-gray-600 mb-6">
//               The course you're looking for doesn't exist or has been removed.
//             </p>
//             <button
//               onClick={() => router.push('/courses')}
//               className="bg-red-700 text-white px-6 py-3 rounded-lg hover:bg-red-800 transition-colors"
//             >
//               Browse All Courses
//             </button>
//           </div>
//         </div>
//         <FooterSm />
//       </React.Fragment>
//     );
//   }

//   const title = `${stripHtml(course.title)} | TechPratham`;
//   const description = stripHtml(course.description || course.shortDesc) || "Explore a wide range of IT courses at TechPratham. Advance your career with industry-relevant training and expert-led classes.";
//   const keywords = `${stripHtml(course.title)}, TechPratham Courses, IT Training, Programming Courses, Data Science, Cloud Computing, Best IT Institute India, Online IT Courses`;
//   const url = `https://www.techpratham.com/courses/${course.link}`;
//   const image = "/navbar/techpratham.svg";

//   return (
//     <React.Fragment>
//       <Head>
//         <link rel="icon" href="/favicon.ico" type="image/ico" sizes="70x70" />
//         <title>Enroll | {title}</title>
//         <meta name="description" content={description} />
//         <meta name="keywords" content={keywords} />
//         <meta name="author" content="the-bipu" />

//         <meta property="og:type" content="website" />
//         <meta property="og:title" content={title} />
//         <meta property="og:description" content={description} />
//         <meta property="og:image" content={image} />
//         <meta property="og:url" content={url} />

//         <meta name="twitter:card" content="summary_large_image" />
//         <meta name="twitter:title" content={title} />
//         <meta name="twitter:description" content={description} />
//         <meta name="twitter:image" content={image} />
//       </Head>

//       <Navbar />

//       <div className='w-full h-auto flex flex-col items-center justify-center  pt-10 bg-red-700'>
//         <div className='md:w-10/12 w-11/12 h-auto flex flex-row items-end justify-between py-20'>
//           {/* Course Title */}
//           <div className="text-left mb-8 backdrop-blur-sm p-2">
//             <h1 className="text-2xl md:text-3xl font-normal text-white mb-4">
//               <RenderHTML html={course.title} />
//             </h1>
//             <p className="text-base text-black max-w-3xl mx-auto">

//               <RenderHTML html={course.shortDesc} />
//             </p>
//           </div>

//           {/* Dynamic Form Container */}
//           <div className="w-full max-w-2xl">
//             <Card className="shadow-lg">
//               <CardHeader className="space-y-4">
//                 <div className="flex items-center space-x-2">
//                   {currentStep === 'registration' ? (
//                     <>
//                       <UserPlus className="h-6 w-6 text-red-700" />
//                       <CardTitle className="text-2xl font-bold text-gray-900">
//                         Create Account
//                       </CardTitle>
//                     </>
//                   ) : currentStep === 'enrollment' ? (
//                     <>
//                       <BookOpen className="h-6 w-6 text-red-700" />
//                       <CardTitle className="text-2xl font-bold text-gray-900">
//                         Enroll in Course
//                       </CardTitle>
//                     </>
//                   ) : (
//                     <>
//                       <AlertCircle className="h-6 w-6 text-yellow-600" />
//                       <CardTitle className="text-2xl font-bold text-gray-900">
//                         Account Already Exists
//                       </CardTitle>
//                     </>
//                   )}
//                 </div>
//                 <CardDescription className="text-gray-600">
//                   {currentStep === 'registration'
//                     ? 'Create your account to enroll in this course.'
//                     : currentStep === 'enrollment'
//                       ? 'Complete your enrollment for this course.'
//                       : 'An account with this email already exists. Please log in to continue.'
//                   }
//                 </CardDescription>
//               </CardHeader>

//               <CardContent className="space-y-6">
//                 {/* Course Information Display */}
//                 <div className="bg-gray-50 p-4 rounded-lg space-y-3">
//                   <h3 className="font-semibold text-gray-900 mb-3">Course Details</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="flex flex-col items-start">
//                       <div className='flex space-x-2'>
//                         <BookOpen className="h-4 w-4 text-gray-500" />
//                         <span className="text-sm text-gray-600">Title:</span>
//                       </div>
//                       <span className="text-sm font-medium"><RenderHTML html={course.title} /></span>
//                     </div>
//                     <div className="flex flex-col items-start">
//                       <div className='flex space-x-2'>
//                         <Clock className="h-4 w-4 text-gray-500" />
//                         <span className="text-sm text-gray-600">Duration:</span>
//                       </div>
//                       <span className="text-sm font-medium">{course.duration}</span>
//                     </div>
//                     <div className="flex flex-col items-start">
//                       <div className='flex space-x-2'>
//                         <BarChart3 className="h-4 w-4 text-gray-500" />
//                         <span className="text-sm text-gray-600">Level:</span>
//                       </div>
//                       <span className="text-sm font-medium">{course.level}</span>
//                     </div>
//                     <div className="flex flex-col items-start">
//                       <div className='flex space-x-2'>
//                         <Tag className="h-4 w-4 text-gray-500" />
//                         <span className="text-sm text-gray-600">Category:</span>
//                       </div>
//                       <span className="text-sm font-medium">{course.category}</span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Status Messages */}
//                 {submitStatus === 'success' && (
//                   <Alert className="border-green-200 bg-green-50">
//                     <CheckCircle className="h-4 w-4 text-green-600" />
//                     <AlertDescription className="text-green-800">
//                       {currentStep === 'registration'
//                         ? 'Account created successfully! Now you can enroll in the course.'
//                         : 'Enrollment submitted successfully! You will receive a confirmation email shortly.'
//                       }
//                     </AlertDescription>
//                   </Alert>
//                 )}

//                 {submitStatus === 'error' && (
//                   <Alert className="border-red-200 bg-red-50">
//                     <AlertDescription className="text-red-800">
//                       {errorMessage}
//                     </AlertDescription>
//                   </Alert>
//                 )}

//                 {submitStatus === 'userExists' && (
//                   <Alert className="border-yellow-200 bg-yellow-50">
//                     <AlertCircle className="h-4 w-4 text-yellow-600" />
//                     <AlertDescription className="text-yellow-800">
//                       An account with the email <strong>{existingUserEmail}</strong> already exists. Please log in to continue with your enrollment.
//                     </AlertDescription>
//                   </Alert>
//                 )}

//                 {submitStatus === 'alreadyEnrolled' && (
//                   <Alert className="border-yellow-200 bg-yellow-50">
//                     <AlertCircle className="h-4 w-4 text-yellow-600" />
//                     <AlertDescription className="text-yellow-800">
//                       You are already enrolled in this course. Please check your dashboard or contact support if you need assistance.
//                     </AlertDescription>
//                   </Alert>
//                 )}

//                 {/* User Exists - Login Prompt */}
//                 {currentStep === 'userExists' && (
//                   <div className="space-y-4">
//                     <div className="text-center">
//                       <p className="text-gray-600 mb-4">
//                         You already have an account with us. Please log in to enroll in this course.
//                       </p>
//                       <div className="space-y-3">
//                         <Button
//                           onClick={handleLogin}
//                           className="w-full bg-red-700 hover:bg-red-800 text-white"
//                         >
//                           <LogIn className="mr-2 h-4 w-4" />
//                           Login to Continue
//                         </Button>
//                         <Button
//                           variant="outline"
//                           onClick={handleBackToRegistration}
//                           className="w-full text-gray-600 hover:text-gray-800"
//                         >
//                           Try Different Email
//                         </Button>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* Registration Form */}
//                 {currentStep === 'registration' && (
//                   <form onSubmit={registrationForm.handleSubmit(handleRegistration)} className="space-y-4">
//                     <div className="space-y-4">
//                       <div className="space-y-2">
//                         <Label htmlFor="reg-name" className="flex items-center space-x-2">
//                           <User className="h-4 w-4" />
//                           <span>Full Name</span>
//                         </Label>
//                         <Input
//                           id="reg-name"
//                           type="text"
//                           placeholder="Enter your full name"
//                           {...registrationForm.register('name')}
//                           className={registrationForm.formState.errors.name ? 'border-red-500' : ''}
//                         />
//                         {registrationForm.formState.errors.name && (
//                           <p className="text-sm text-red-600">{registrationForm.formState.errors.name.message}</p>
//                         )}
//                       </div>

//                       <div className="space-y-2">
//                         <Label htmlFor="reg-email" className="flex items-center space-x-2">
//                           <Mail className="h-4 w-4" />
//                           <span>Email Address</span>
//                         </Label>
//                         <Input
//                           id="reg-email"
//                           type="email"
//                           placeholder="Enter your email address"
//                           {...registrationForm.register('email')}
//                           className={registrationForm.formState.errors.email ? 'border-red-500' : ''}
//                         />
//                         {registrationForm.formState.errors.email && (
//                           <p className="text-sm text-red-600">{registrationForm.formState.errors.email.message}</p>
//                         )}
//                       </div>

//                       <div className="space-y-2">
//                         <Label htmlFor="reg-phone" className="flex items-center space-x-2">
//                           <Phone className="h-4 w-4" />
//                           <span>Phone Number</span>
//                         </Label>
//                         <Input
//                           id="reg-phone"
//                           type="tel"
//                           placeholder="Enter your phone number"
//                           {...registrationForm.register('phone')}
//                           className={registrationForm.formState.errors.phone ? 'border-red-500' : ''}
//                         />
//                         {registrationForm.formState.errors.phone && (
//                           <p className="text-sm text-red-600">{registrationForm.formState.errors.phone.message}</p>
//                         )}
//                       </div>

//                       <div className="space-y-2">
//                         <Label htmlFor="reg-password" className="flex items-center space-x-2">
//                           <span>Password</span>
//                         </Label>
//                         <div className="relative">
//                           <Input
//                             id="reg-password"
//                             type={showPassword ? 'text' : 'password'}
//                             placeholder="Enter your password"
//                             {...registrationForm.register('password')}
//                             className={registrationForm.formState.errors.password ? 'border-red-500' : ''}
//                           />
//                           <div
//                             onClick={() => setShowPassword(!showPassword)}
//                             className="absolute inset-y-0 right-0 w-14 bg-gray-100 text-sm text-gray-700 font-medium flex items-center justify-center cursor-pointer m-1 rounded-r"
//                           >
//                             {showPassword ? 'Hide' : 'Show'}
//                           </div>
//                         </div>
//                         {registrationForm.formState.errors.password && (
//                           <p className="text-sm text-red-600">{registrationForm.formState.errors.password.message}</p>
//                         )}
//                       </div>

//                       <div className="flex items-start space-x-2">
//                         <Checkbox
//                           id="terms"
//                           checked={isChecked}
//                           onCheckedChange={(checked) => setIsChecked(checked === true)}
//                         />
//                         <div className="flex flex-col">
//                           <Label htmlFor="terms" className="text-sm font-normal cursor-pointer">
//                             I have read and agree to the{' '}
//                             <Link href="/privacy-policy" className="text-blue-600 hover:underline">
//                               Privacy Policy
//                             </Link>
//                             {' '}and{' '}
//                             <Link href="/terms-of-service" className="text-blue-600 hover:underline">
//                               Terms of Service
//                             </Link>
//                             {' '}of the TechPratham website.
//                             <span className='text-red-500'> *</span>
//                           </Label>
//                         </div>
//                       </div>
//                     </div>

//                     <Button
//                       type="submit"
//                       className="w-full bg-red-700 hover:bg-red-800 text-white"
//                       disabled={!isChecked || isSubmitting}
//                     >
//                       {isSubmitting ? (
//                         <>
//                           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                           Creating Account...
//                         </>
//                       ) : (
//                         'Create Account'
//                       )}
//                     </Button>
//                   </form>
//                 )}

//                 {/* Enrollment Form */}
//                 {currentStep === 'enrollment' && (
//                   <form onSubmit={enrollmentForm.handleSubmit(handleEnrollment)} className="space-y-4">
//                     <div className="space-y-4">
//                       <div className="space-y-2">
//                         <Label htmlFor="enroll-name" className="flex items-center space-x-2">
//                           <User className="h-4 w-4" />
//                           <span>Full Name</span>
//                         </Label>
//                         <Input
//                           id="enroll-name"
//                           type="text"
//                           placeholder="Enter your full name"
//                           {...enrollmentForm.register('name')}
//                           className={enrollmentForm.formState.errors.name ? 'border-red-500' : ''}
//                         />
//                         {enrollmentForm.formState.errors.name && (
//                           <p className="text-sm text-red-600">{enrollmentForm.formState.errors.name.message}</p>
//                         )}
//                       </div>

//                       <div className="space-y-2">
//                         <Label htmlFor="enroll-email" className="flex items-center space-x-2">
//                           <Mail className="h-4 w-4" />
//                           <span>Email Address</span>
//                         </Label>
//                         <Input
//                           id="enroll-email"
//                           type="email"
//                           placeholder="Enter your email address"
//                           {...enrollmentForm.register('email')}
//                           className={enrollmentForm.formState.errors.email ? 'border-red-500' : ''}
//                         />
//                         {enrollmentForm.formState.errors.email && (
//                           <p className="text-sm text-red-600">{enrollmentForm.formState.errors.email.message}</p>
//                         )}
//                       </div>

//                       <div className="space-y-2">
//                         <Label htmlFor="enroll-phone" className="flex items-center space-x-2">
//                           <Phone className="h-4 w-4" />
//                           <span>Phone Number</span>
//                         </Label>
//                         <Input
//                           id="enroll-phone"
//                           type="tel"
//                           placeholder="Enter your phone number"
//                           {...enrollmentForm.register('phone')}
//                           className={enrollmentForm.formState.errors.phone ? 'border-red-500' : ''}
//                         />
//                         {enrollmentForm.formState.errors.phone && (
//                           <p className="text-sm text-red-600">{enrollmentForm.formState.errors.phone.message}</p>
//                         )}
//                       </div>

//                     </div>

//                     <Button
//                       type="submit"
//                       className="w-full bg-red-700 hover:bg-red-800 text-white"
//                       disabled={isSubmitting}
//                     >
//                       {isSubmitting ? (
//                         <>
//                           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                           Enrolling...
//                         </>
//                       ) : (
//                         'Enroll Now'
//                       )}
//                     </Button>
//                   </form>
//                 )}
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>

//       <FooterSm />
//     </React.Fragment>
//   );
// };

// export default CourseEnrollPage;


"use client";

import React, { useEffect, useState, useContext } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import Navbar from "@/src/common/Navbar/Navbar";
import FooterSm from "@/src/common/Footer/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2 } from "lucide-react";
import { UserContext } from "@/context/userContext";
import type { NextPage, GetServerSideProps } from 'next';
import { NavbarData } from '@/utils/navbarData';
import { withNavbarSSR } from '@/utils/withNavbarSSR';
import PhoneInput from "@/components/common/PhoneInput/PhoneInput";

interface Course {
  title: string;
  shortDesc: string;
  duration: string;
  level: string;
  category: string;
  link: string;
}

interface EnrollForm {
  name: string;
  email: string;
  phone: string;
}

interface CourseEnrollPageProps {
  navbarData: NavbarData;
}

const CourseEnrollPage: NextPage<CourseEnrollPageProps> = ({ navbarData }) => {
  const router = useRouter();
  const { coursedata } = router.query;
  const { userData } = useContext(UserContext);

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(userData?.phone || "");
  const [isPhoneValid, setIsPhoneValid] = useState(false);

  const { register, handleSubmit, reset, setValue } = useForm<EnrollForm>({
    defaultValues: {
      name: userData?.name || "",
      email: userData?.email || "",
      phone: userData?.phone || "",
    },
  });

  /* ---------------- FETCH COURSE ---------------- */
  useEffect(() => {
    if (!coursedata || typeof coursedata !== "string") return;

    const fetchCourse = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/course/link?link=${encodeURIComponent(coursedata)}`
        );
        if (!res.ok) throw new Error("Failed to load course");
        const data = await res.json();
        setCourse(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [coursedata]);

  /* ---------------- SUBMIT LEAD ---------------- */
  const onSubmit = async (data: EnrollForm) => {
    // Prevent submission if phone is invalid
    if (!isPhoneValid) {
      return;
    }

    if (!course) return;

    setSubmitting(true);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formType: "course_enrollment",
          fullName: data.name,
          email: data.email,
          phone: phoneNumber,
          course: course.title,
          // message: course.shortDesc,
          courseLink: course.link,
          duration: course.duration,
          level: course.level,
          category: course.category,
        }),
      });

      if (!response.ok) {
        throw new Error("Lead submission failed");
      }

      reset();
      setPhoneNumber("");
      setIsPhoneValid(false);
      setShowSuccess(true);
      if (typeof window !== "undefined") {
        (window as any).dataLayer = (window as any).dataLayer || [];
        (window as any).dataLayer.push({
          event: "google_ads_conversion",
          
          conversion_id: "17462500412",
          conversion_label: "K_E4CNSPy-0bELy44oZB",
        });
      }
    } catch (error) {
      console.error("Enrollment failed:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar navbarData={navbarData} />
        <div className="h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-red-700" />
        </div>
        <FooterSm />
      </>
    );
  }

  if (!course) return null;

  return (
    <>
      <Head>
        <title>Enroll | {course.title}</title>
      </Head>

      <Navbar navbarData={navbarData} />

      <div className="bg-gradient-to-tl from-[#C6151D] to-[#600A0E] py-16">
        <div className="w-11/12 md:w-10/12 mx-auto grid md:grid-cols-2 gap-10">

          {/* COURSE INFO */}
          <div className="text-yellow-500">
            <h1
              className="text-3xl mb-4"
              dangerouslySetInnerHTML={{ __html: course.title }}
            />
            <div
              className="text-gray-200"
              dangerouslySetInnerHTML={{ __html: course.shortDesc }}
            />
          </div>

          {/* FORM */}
          <Card>
            <CardHeader>
              <CardTitle>Enroll Now</CardTitle>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label>Full Name</Label>
                  <Input {...register("name")} required />
                </div>

                <div>
                  <Label>Email</Label>
                  <Input type="email" {...register("email")} required />
                </div>

                <div>
                  <Label>Phone</Label>
                  <PhoneInput
                    value={phoneNumber}
                    onChange={(phone) => {
                      setPhoneNumber(phone);
                      setValue('phone', phone);
                    }}
                    onValidationChange={setIsPhoneValid}
                    placeholder="Enter phone number"
                    required
                    size="md"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-red-700"
                  disabled={submitting || !isPhoneValid}
                >
                  {submitting ? "Submitting..." : "Enroll Now"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ✅ SUCCESS POPUP */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-11/12 p-8 text-center animate-in fade-in zoom-in">
            <CheckCircle2 className="mx-auto text-green-600 w-14 h-14 mb-4" />

            <h2 className="text-2xl font-bold mb-2">
              🎉 Enrollment Successful!
            </h2>

            <p className="text-gray-600 mb-6">
              Congratulations! You are successfully enrolled.
              <br />
              One of our trainers will call you shortly.
            </p>

            <Button
              className="bg-red-700 w-full"
              onClick={() => setShowSuccess(false)}
            >
              Close
            </Button>
          </div>
        </div>
      )}

      <FooterSm />
    </>
  );
};

export default CourseEnrollPage;

// Add navbar SSR
export const getServerSideProps = withNavbarSSR();
