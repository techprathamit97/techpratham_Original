import React, { useState, useEffect } from 'react';
import { ArrowTopRightIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import { CircleCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import Link from 'next/link';
import { categoryPrice } from "@/components/assets/categoryPrice";
import { useForm } from 'react-hook-form';
import PhoneInput from '@/components/common/PhoneInput/PhoneInput';

import './header.css';

// Custom styles for PhoneInput in transparent form
const phoneInputStyles = `
  .phone-input-header .country-select button {
    background: rgba(255, 255, 255, 0.1) !important;
    border: 1px solid rgba(255, 255, 255, 0.2) !important;
    color: white !important;
  }
  
  .phone-input-header .country-select button:hover {
    background: rgba(255, 255, 255, 0.15) !important;
  }
  
  .phone-input-header input {
    background: rgba(255, 255, 255, 0.1) !important;
    border: 1px solid rgba(255, 255, 255, 0.2) !important;
    color: white !important;
  }
  
  .phone-input-header input::placeholder {
    color: rgb(209, 213, 219) !important;
  }
  
  .phone-input-header input:focus {
    outline: none !important;
    ring: 2px !important;
    ring-color: rgba(255, 255, 255, 0.4) !important;
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

    // Check if visitor came from Google Ads (same logic as LeadForm)
    const isGoogleAdsVisitor = () => {
        if (typeof window === 'undefined') return false;
        const searchParams = new URLSearchParams(window.location.search);
        return searchParams.has('gclid') || searchParams.get('utm_source') === 'google';
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

            // Determine source based on GCLID/UTM parameters (same as LeadForm)
            const googleAdsVisitor = isGoogleAdsVisitor();
            const source = googleAdsVisitor ? 'google_ads' : 'website_form';

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
                console.log('Header form submitted successfully:', data);
                
                // Reset form
                reset();
                setPhoneNumber('');
                setIsPhoneValid(false);
                
                // ✅ Google Ads conversion tracking (same as LeadForm)
                if (googleAdsVisitor && typeof window !== "undefined") {
                    if ((window as any).gtag) {
                        (window as any).gtag("event", "conversion", {
                            send_to: "AW-17462500412/K_E4CNSPy-0bELy44oZB",
                        });
                    } else {
                        (window as any).dataLayer = (window as any).dataLayer || [];
                        (window as any).dataLayer.push({
                            event: "google_ads_conversion",
                            conversion_id: "17462500412",
                            conversion_label: "K_E4CNSPy-0bELy44oZB",
                        });
                    }
                }

                // Hide success message after 3 seconds
                setTimeout(() => {
                    setSubmitSuccess(false);
                }, 3000);
                
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
        <div className='flex flex-col bg-gradient-to-tl from-[#C6151D] to-[#600A0E] items-center justify-center w-full h-auto headerImage text-white relative min-h-[385px]'>
            
            {/* Add custom styles for PhoneInput */}
            <style dangerouslySetInnerHTML={{ __html: phoneInputStyles }} />
            
            {/* Main Content Wrapper - Shifted to grid-cols-2 on desktop */}
            <div className="md:w-10/12 w-11/12 h-auto grid md:grid-cols-[1.7fr_1fr] grid-cols-1 gap-4 items-center z-20">
                
                {/* Left Side: Course Details */}
                <div className=' h-auto'>
                    <div className='flex flex-row gap-2 items-center justify-start mb-6 md:text-sm text-xs'>
                        <span>Courses</span>
                        <ChevronRightIcon />
                        <Link href={`/courses/domain/${categorySlug}`} className='transition-all duration-300 hover:underline'>{course.category}</Link>
                        <ChevronRightIcon />
                        <div dangerouslySetInnerHTML={{ __html: course.title }} />
                    </div>

                    <span className={`px-4 py-1 rounded-full md:text-base text-sm font-normal bg-gradient-to-tl from-[#C6151D] to-[#600A0E] text-gray-200`}>
                        {course.category}
                    </span>

                    <div className="md:text-2xl text-2xl font-semibold leading-tight flex-1 pr-2 mt-3 mb-1">
                        <h1 dangerouslySetInnerHTML={{ __html: course.title }} />
                    </div>
                    <div className="md:text-sm text-sm text-justify mb-4 flex-grow flex flex-row gap-2 max-w-[700px]">
                        <CircleCheck className='w-6 h-6 mt-[2px] md:flex hidden flex-shrink-0' />
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
                            <span>5/5</span>
                            <span className="text-white font-normal">(4,890 Reviews)</span>
                        </div>
                    </div>

                    <div className="flex px-3 py-2 gap-4 rounded-xl border border-gray-200 max-w-fit mb-4">
                        <div className="flex flex-col gap-1">
                            <p className="md:text-sm xs:text-xs text-gray-300">Level</p>
                            <p className="md:text-sm xs:text-base font-semibold text-gray-200">{course.level}</p>
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="md:text-sm xs:text-xs text-gray-300">Duration</p>
                            <p className="md:text-sm xs:text-base font-semibold text-gray-200">{course.duration}</p>
                        </div>
                    </div>

                    <div className='w-full h-auto flex flex-row flex-wrap gap-3'>
                        <Link href={`/courses/enrollment/${course.link}`} className='w-auto'>
                            <Button variant='manual' className='w-full'>Enroll Now</Button>
                        </Link>
                    </div>
                </div>

                {/* Right Side: Transparent Form */}
                <div className="w-full max-w-[300px] justify-self-center md:justify-self-end">
                    <form 
                        onSubmit={handleSubmit(onSubmit)} 
                        className="bg-white/5 border border-white/20 rounded-2xl p-2 shadow-xl w-full flex flex-col gap-4 text-white"
                    >
                        <div className="text-center mb-2">
                            <h3 className="text-xl font-bold tracking-wide">Enquire This Course</h3>
                        </div>

                        {/* Success/Error Messages */}
                        {submitSuccess && (
                            <div className="bg-green-500/20 border border-green-400/40 rounded-lg px-3 py-2 text-green-200 text-sm text-center">
                                ✅ Form submitted successfully! We'll reach you soon!
                            </div>
                        )}
                        
                        {submitError && (
                            <div className="bg-red-500/20 border border-red-400/40 rounded-lg px-3 py-2 text-red-200 text-sm text-center">
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
                                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all disabled:opacity-50"
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
                                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all disabled:opacity-50"
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
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 cursor-not-allowed font-medium"
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