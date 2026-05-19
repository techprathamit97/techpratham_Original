import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { X } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import PhoneInput from '../PhoneInput/PhoneInput';

interface LeadFormProps {
    course: {
        title: string;
        [key: string]: any;
    };
    onClose: () => void;
    onSuccess: () => void;
}
function stripHtml(html: string = "") {
    return html.replace(/<[^>]*>?/gm, "");
}
const LeadForm: React.FC<LeadFormProps> = ({ course, onClose, onSuccess }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isPhoneValid, setIsPhoneValid] = useState(false);
    const { register, handleSubmit, reset, setValue } = useForm({
        defaultValues: {
            fullName: '',
            phone: '',
            email: '',
            course: course?.title || '',
            whatsapp: false,
            consent: false,
        }
    });
    const [submitting, setSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    // Check if visitor came from Google Ads
    const isGoogleAdsVisitor = () => {
        if (typeof window === 'undefined') return false;
        const searchParams = new URLSearchParams(window.location.search);
        // Check for GCLID (Google Click ID) or utm_source=google
        return searchParams.has('gclid') || searchParams.get('utm_source') === 'google';
    };

    const onSubmit = async (data: any) => {
        // Prevent submission if phone is invalid
        if (!isPhoneValid) {
            return;
        }

        try {
            setSubmitting(true);

            // Determine source based on GCLID/UTM parameters
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
                    formType: "course-callback",
                    source: source, // Set source based on visitor origin
                }),
            });
            if (response.ok) {
                setSubmitSuccess(true);
                console.log(data);
                reset();
                setPhoneNumber('');
                setIsPhoneValid(false);
                
                // ✅ Only send Google Ads conversion if visitor came from Google Ads
                if (googleAdsVisitor && typeof window !== "undefined") {
                    // Use gtag if available (recommended)
                    if ((window as any).gtag) {
                        (window as any).gtag("event", "conversion", {
                            send_to: "AW-17462500412/K_E4CNSPy-0bELy44oZB",
                        });
                    } else {
                        // Fallback to dataLayer
                        (window as any).dataLayer = (window as any).dataLayer || [];
                        (window as any).dataLayer.push({
                            event: "google_ads_conversion",
                            conversion_id: "17462500412",
                            conversion_label: "K_E4CNSPy-0bELy44oZB",
                        });
                    }
                }

                setTimeout(() => {
                    onSuccess();
                }, 2000);
            } else {
                console.error('Failed to submit form');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleClose = () => {
        onClose();
    };

    return (
        <div className='w-full h-screen bg-[#00000084] fixed flex items-center justify-center top-0 left-0 z-[100]'>
            <div className="md:w-[500px] w-11/12 flex flex-col">
                <div className={`bg-white text-black flex flex-col items-center justify-center gap-4 capitalize transition-all duration-500 ease-in-out overflow-hidden shadow rounded-lg max-h-[600px] opacity-100 p-8 translate-y-0 relative`}>
                    <div className='w-full flex flex-row items-start justify-start gap-2'>
                        <div className='w-full flex flex-col gap-0 items-start justify-start'>
                            <span className='text-xl font-semibold'>Request A Callback</span>
                            <span className='text-sm'>Talk To Our Expert</span>
                        </div>
                        <button
                            onClick={handleClose}
                            className='absolute top-4 right-4 cursor-pointer hover:bg-gray-100 rounded-full p-1 transition-colors'
                            type='button'
                            aria-label='Close form'
                        >
                            <X className='w-6 h-6' />
                        </button>
                    </div>
                    <form className='w-full flex flex-col gap-4 rounded-lg mb-3 bg-white h-full lead-form' onSubmit={handleSubmit(onSubmit)}>
                        <Input
                            {...register('fullName')}
                            type='text'
                            id='fullName'
                            name='fullName'
                            className='w-full p-2 indent-2 outline-none'
                            placeholder='Full Name*'
                            required
                        />

                        {/* Phone Number with custom PhoneInput */}
                        <PhoneInput
                            value={phoneNumber}
                            onChange={(phone) => {
                                setPhoneNumber(phone);
                                setValue('phone', phone);
                            }}
                            onValidationChange={setIsPhoneValid}
                            placeholder="Phone Number*"
                            required
                            size="md"
                        />
                        <Input
                            {...register('email')}
                            type='email'
                            id='email'
                            name='email'
                            className='w-full p-2 indent-2 outline-none'
                            placeholder='Email Address*'
                            required
                        />
                        <Input
                            {...register('course')}
                            type='text'
                            id='course'
                            name='course'
                            className='w-full p-2 indent-2 outline-none'
                            placeholder='Course You Are Looking For*'
                            defaultValue={stripHtml(course?.title || "")}
                            required
                        />
                       
                        <div>
                            <Checkbox
                                {...register('consent')}
                                id='consent'
                                name='consent'
                                className='mr-2'
                                required
                            />
                            <label htmlFor='consent' className='text-sm'>
                                By registering here, I agree to TechPratham{' '}
                                <a
                                    href="/privacy-policy"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className='text-blue-600 underline'
                                >
                                    Terms & Conditions
                                </a>.
                            </label>
                        </div>
                        <Button
                            type='submit'
                            variant={'manual'}
                            className='h-10 text-base flex items-center justify-center'
                            disabled={submitting || !isPhoneValid}
                        >
                            {submitting ? 'Submitting...' : 'Continue'}
                        </Button>
                        {submitSuccess && (
                            <p className="text-green-600 text-sm">
                                Form submitted successfully! We'll reach you soon!
                            </p>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LeadForm;
