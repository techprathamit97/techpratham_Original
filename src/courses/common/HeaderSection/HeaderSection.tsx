import React, { useState, useEffect } from 'react';
import { ArrowTopRightIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import { CircleCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import Link from 'next/link';
import { categoryPrice } from "@/components/assets/categoryPrice";
import { useForm } from 'react-hook-form';
import { getLeadSource, isGoogleAdsVisitor } from '@/lib/leadSourceDetection';
import PhoneInput from '@/components/common/PhoneInput/PhoneInput';
import { redirectToThankYou, FORM_TYPES } from '@/lib/thankYouRedirect';

import './header.css';

// Custom styles for PhoneInput on the light (white) form card.
const phoneInputStyles = `
  .phone-input-header .country-select button {
    background: rgba(255, 255, 255, 0.7) !important;
    border: 1px solid rgb(209, 213, 219) !important;
    color: rgb(17, 24, 39) !important;
  }

  .phone-input-header .country-select button:hover {
    background: rgb(249, 250, 251) !important;
  }

  .phone-input-header input {
    background: rgba(255, 255, 255, 0.7) !important;
    border: 1px solid rgb(209, 213, 219) !important;
    color: rgb(17, 24, 39) !important;
  }

  .phone-input-header input::placeholder {
    color: rgb(156, 163, 175) !important;
  }

  .phone-input-header input:focus {
    outline: none !important;
    border-color: rgb(198, 21, 29) !important;
  }
`;

const getPriceByCategory = (category?: string) => {
    if (!category) return null;

    const match = categoryPrice.find(
        (item) =>
            item.Category.toLowerCase() === category.toLowerCase()
    );

    return match?.price ?? null;
};

const formatINR = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(amount);

const HeaderSection = ({ course }: any) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isPhoneValid, setIsPhoneValid] = useState(false);
    const [categorySlug, setCategorySlug] = useState<string>('');
    
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
        defaultValues: {
            fullName: '',
            phone: '',
            email: '',
            course: course?.title ? course.title.replace(/<[^>]*>/g, '') : '',
            formType: 'course-header-enquiry',
            consent: true
        }
    });

    const [submitting, setSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState('');

    // Fetch category slug when component mounts or course changes
    useEffect(() => {
        const fetchCategorySlug = async () => {
            if (!course?.category) return;
            
            try {
                const response = await fetch('/api/category/fetch');
                if (response.ok) {
                    const categories = await response.json();
                    const foundCategory = categories.find((cat: any) => cat.name === course.category);
                    if (foundCategory) {
                        setCategorySlug(foundCategory.slug);
                    } else {
                        // Fallback to converting category name to slug
                        setCategorySlug(course.category.toLowerCase().replace(/\s+/g, '-'));
                    }
                }
            } catch (error) {
                console.error('Error fetching category slug:', error);
                // Fallback to converting category name to slug
                setCategorySlug(course.category.toLowerCase().replace(/\s+/g, '-'));
            }
        };

        fetchCategorySlug();
    }, [course?.category]);

    // Update course field when course prop changes
    useEffect(() => {
        if (course?.title) {
            setValue('course', course.title.replace(/<[^>]*>/g, ''));
        }
    }, [course?.title, setValue]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setValue(name as any, value);
    };

    const onSubmit = async (data: any) => {
        // Prevent submission if phone is invalid
        if (!isPhoneValid) {
            setSubmitError('Please enter a valid phone number');
            return;
        }

        try {
            setSubmitting(true);
            setSubmitError('');

            // Determine source based on URL parameters
            const source = getLeadSource();

            const response = await fetch('/api/leads', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...data,
                    phone: phoneNumber, // Use the formatted phone number from PhoneInput
                    source: source,
                }),
            });

            if (response.ok) {
                setSubmitSuccess(true);
                
                // Reset form
                reset();
                setPhoneNumber('');
                setIsPhoneValid(false);
                
                // Redirect to Thank You page with conversion tracking
                setTimeout(() => {
                    redirectToThankYou({
                        formType: FORM_TYPES.COURSE_HEADER_ENQUIRY,
                        course: course?.title?.replace(/<[^>]*>/g, '') || '',
                        source: source,
                        additionalData: {
                            lead_value: 1,
                            form_location: 'course_header',
                            course_category: course?.category || ''
                        }
                    });
                }, 1000);
                
            } else {
                const errorData = await response.json();
                setSubmitError(errorData.message || 'Failed to submit form. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setSubmitError('Network error. Please check your connection and try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const makeSlug = (text: string) => {
        return text.toLowerCase().replace(/\s+/g, "-");
    }

    return (
        <div className='flex flex-col items-center justify-center w-full h-auto text-gray-900 relative min-h-[385px] py-2 md:py-5 overflow-hidden'>

            {/* Add custom styles for PhoneInput */}
            <style dangerouslySetInnerHTML={{ __html: phoneInputStyles }} />

            {/* Career graphic — a CONTAINED illustration on the right (not a full
                background). It carries the "Learn → Grow → Get Placed" artwork and
                fades into white on its left/bottom so it reads as a corner image. */}
            <div className="pointer-events-none absolute inset-0 h-full w-full z-0" aria-hidden="true">
                <Image
                    src="/course/test2.png"
                    alt=""
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 56vw"
                    className="object-cover object-center  "
                />
            </div>

            {/* Overlay to improve content readability over the image */}
            {/* <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-white/90 via-white/70 to-white/40" aria-hidden="true" /> */}

            {/* Main Content Wrapper - Shifted to grid-cols-2 on desktop */}
            <div className="relative md:w-10/12 w-11/12 h-auto grid md:grid-cols-[1.7fr_1fr] grid-cols-1 gap-4 items-center z-20">
                
                {/* Left Side: Course Details */}
                <div className=' h-auto'>
                    <div className='flex flex-row gap-2 items-center justify-start mb-6 md:text-sm text-xs text-gray-600'>
                        <span>Courses</span>
                        <ChevronRightIcon />
                        <Link href={`/courses/domain/${categorySlug}`} className='transition-all duration-300 hover:underline hover:text-[#C6151D]'>{course.category}</Link>
                        <ChevronRightIcon />
                        <div className='text-gray-800 font-medium' dangerouslySetInnerHTML={{ __html: course.title }} />
                    </div>

                    <span className={`inline-block px-4 py-1 rounded-full md:text-base text-sm font-medium bg-[#FF2E41] text-white`}>
                        {course.category}
                    </span>

                    <div className="md:text-3xl text-2xl font-bold leading-tight flex-1 pr-2 mt-3 mb-1 text-gray-900">
                        <h1 dangerouslySetInnerHTML={{ __html: course.title }} />
                    </div>
                    <div className="md:text-sm text-sm text-justify mb-4 flex-grow flex flex-row gap-2 max-w-[700px] text-gray-700">
                        <CircleCheck className='w-6 h-6 mt-[2px] md:flex hidden flex-shrink-0 text-[#FF2E41]' />
                        <div dangerouslySetInnerHTML={{ __html: course.shortDesc }} />
                    </div>

                    <div className='w-full h-auto flex md:flex-row flex-col gap-2 md:items-center items-start justify-between mb-4'>
                        <div className="flex items-center gap-1">
                            <span className="flex flex-row items-center justify-start">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} width="20" height="20" viewBox="0 0 24 24" fill="#fcbc05" className="w-6 h-6">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                    </svg>
                                ))}
                            </span>
                            <span className="text-gray-800 font-semibold">5/5</span>
                            <span className="text-gray-600 font-normal">(4,890 Reviews)</span>
                        </div>
                    </div>

                    <div className="flex px-3 py-2 gap-4 rounded-xl border border-gray-200 bg-white/70 max-w-fit mb-4">
                        <div className="flex flex-col gap-1">
                            <p className="md:text-sm xs:text-xs text-gray-500">Level</p>
                            <p className="md:text-sm xs:text-base font-semibold text-gray-900">{course.level}</p>
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="md:text-sm xs:text-xs text-gray-500">Duration</p>
                            <p className="md:text-sm xs:text-base font-semibold text-gray-900">{course.duration}</p>
                        </div>
                    </div>

                    <div className='w-full h-auto flex flex-row flex-wrap gap-3'>
                        <Link href={`/courses/enrollment/${course.link}`} className='w-auto'>
                            <Button variant='manual' className='w-full '>Enroll Now</Button>
                        </Link>
                    </div>
                </div>

                {/* Right Side: Transparent Form */}
                <div className="w-full max-w-[300px] justify-self-center md:justify-self-end">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="bg-white/25 backdrop-blur-md border border-white/50 rounded-2xl p-4 shadow-lg w-full flex flex-col gap-4 text-gray-900"
                    >
                        <div className="text-center mb-2">
                            <h3 className="text-xl font-bold tracking-wide text-gray-900">Enquire This Course</h3>
                        </div>

                        {/* Success/Error Messages */}
                        {submitSuccess && (
                            <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-green-700 text-sm text-center">
                                ✅ Form submitted successfully! We'll reach you soon!
                            </div>
                        )}
                        
                        {submitError && (
                            <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-red-700 text-sm text-center">
                                ❌ {submitError}
                            </div>
                        )}

                        {/* Name Field */}
                        <div className="flex flex-col gap-1">
                            <Input 
                                {...register('fullName', { required: 'Full name is required' })}
                                type="text" 
                                placeholder="Full Name*" 
                                disabled={submitting}
                                className="w-full bg-white/70 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#C6151D] transition-all disabled:opacity-50"
                            />
                            {errors.fullName && (
                                <span className="text-red-200 text-xs">{errors.fullName.message}</span>
                            )}
                        </div>

                        {/* Phone Number Field with Country Code */}
                        <div className="flex flex-col gap-1">
                            <PhoneInput
                                value={phoneNumber}
                                onChange={(phone) => {
                                    setPhoneNumber(phone);
                                    setValue('phone', phone);
                                }}
                                onValidationChange={setIsPhoneValid}
                                placeholder="Contact Number*"
                                required
                                size="md"
                                className="phone-input-header"
                            />
                        </div>

                        {/* Email ID Field */}
                        <div className="flex flex-col gap-1">
                            <Input 
                                {...register('email', { 
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Invalid email address'
                                    }
                                })}
                                type="email" 
                                placeholder="Email ID*" 
                                disabled={submitting}
                                className="w-full bg-white/70 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#C6151D] transition-all disabled:opacity-50"
                            />
                            {errors.email && (
                                <span className="text-red-200 text-xs">{errors.email.message}</span>
                            )}
                        </div>

                        {/* Course Autofill Field */}
                        <div className="flex flex-col gap-1">
                            <Input 
                                {...register('course')}
                                type="text" 
                                disabled
                                className="w-full bg-white/50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 cursor-not-allowed font-medium"
                            />
                        </div>

                        {/* Submit Button */}
                        <Button 
                            type="submit" 
                            variant="manual" 
                            disabled={submitting || !isPhoneValid}
                            className="w-full mt-2 font-semibold shadow-md transform active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? 'Submitting...' : 'Submit Request'}
                        </Button>
                        
                       
                    </form>
                </div>

            </div>
        </div>
    );
};

export default HeaderSection;