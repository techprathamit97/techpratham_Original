import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Head from 'next/head';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PhoneInput from '@/components/common/PhoneInput/PhoneInput';
import { getLeadSource, isGoogleAdsVisitor } from '@/lib/leadSourceDetection';
import { Download } from 'lucide-react';
import Link from "next/link";
/** Brand reds, matching the gradient already used across the site. */
const RED = '#C6151D';
const RED_DARK = '#600A0E';

export default function Connect() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const { register, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      fullName: '',
      phone: '',
      email: '',
      course: '',
    },
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const onSubmit = async (data: any) => {
    // Prevent submission if phone is invalid
    if (!isPhoneValid) {
      return;
    }

    try {
      setSubmitting(true);

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
          formType: 'linkedin lead',
          source: source, // Set source based on visitor origin
        }),
      });

      if (response.ok) {
        setSubmitSuccess(true);
        reset();
        setPhoneNumber('');
        setIsPhoneValid(false);

        // ✅ Only send Google Ads conversion if visitor came from Google Ads
        if (isGoogleAdsVisitor() && typeof window !== 'undefined') {
          if ((window as any).gtag) {
            (window as any).gtag('event', 'conversion', {
              send_to: 'AW-17462500412/K_E4CNSPy-0bELy44oZB',
            });
          } else {
            (window as any).dataLayer = (window as any).dataLayer || [];
            (window as any).dataLayer.push({
              event: 'google_ads_conversion',
              conversion_id: '17462500412',
              conversion_label: 'K_E4CNSPy-0bELy44oZB',
            });
          }
        }

        setTimeout(() => {
          setSubmitSuccess(false);
        }, 5000);
      } else {
        console.error('Failed to submit form');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Connect | TechPratham Training &amp; Development (P) Ltd.</title>
        <meta
          name="description"
          content="Share your details and our team will get in touch with course information."
        />
      </Head>

      <div className="relative min-h-screen overflow-hidden bg-[#FDF5F5]">
        {/* ---------- Top brand bar ---------- */}
        <header
          className="relative z-20 flex items-center px-4 md:py-2.5 py-5 sm:px-6"
          style={{
            backgroundImage: `linear-gradient(to right, ${RED_DARK}, ${RED} 45%, ${RED} 55%, ${RED_DARK})`,
          }}
        >
        <Link href="/">
  <div className="relative hidden h-9 w-24 shrink-0 sm:block sm:h-10 sm:w-28">
    <Image
      src="/navbar/logotechnolyfirst2.svg"
      alt="TechPratham"
      fill
      className="object-contain object-left"
      priority
    />
  </div>
</Link>

          <h1 className="pointer-events-none absolute  inset-x-0 text-center text-sm font-bold tracking-tight text-white sm:text-lg md:text-xl">
            TechPratham Training &amp; Development (P) Ltd.
          </h1>
        </header>

        {/*
          Decorative background: flowing rays plus halftone dots, drawn with SVG
          and CSS gradients so no extra image assets are needed.
        */}
        <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
          {/* Halftone dots, top left */}
          <div
            className="absolute -left-10 top-4 h-72 w-72 opacity-[0.5]"
            style={{
              backgroundImage: `radial-gradient(${RED} 1.5px, transparent 1.6px)`,
              backgroundSize: '14px 14px',
              maskImage:
                'radial-gradient(circle at 25% 25%, rgba(0,0,0,0.9), transparent 70%)',
              WebkitMaskImage:
                'radial-gradient(circle at 25% 25%, rgba(0,0,0,0.9), transparent 70%)',
            }}
          />

          {/* Halftone dots, bottom left */}
          <div
            className="absolute -left-16 bottom-0 h-96 w-[26rem] opacity-[0.45]"
            style={{
              backgroundImage: `radial-gradient(${RED} 1.6px, transparent 1.7px)`,
              backgroundSize: '15px 15px',
              maskImage:
                'radial-gradient(circle at 20% 80%, rgba(0,0,0,0.9), transparent 72%)',
              WebkitMaskImage:
                'radial-gradient(circle at 20% 80%, rgba(0,0,0,0.9), transparent 72%)',
            }}
          />

          {/* Halftone dots, bottom right */}
          <div
            className="absolute -right-10 bottom-0 h-72 w-80 opacity-[0.35]"
            style={{
              backgroundImage: `radial-gradient(${RED} 1.5px, transparent 1.6px)`,
              backgroundSize: '15px 15px',
              maskImage:
                'radial-gradient(circle at 80% 85%, rgba(0,0,0,0.85), transparent 70%)',
              WebkitMaskImage:
                'radial-gradient(circle at 80% 85%, rgba(0,0,0,0.85), transparent 70%)',
            }}
          />

          {/* Flowing ray lines */}
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 1440 900"
            preserveAspectRatio="none"
            fill="none"
          >
            <g stroke={RED} strokeWidth="1.1" opacity="0.22" fill="none">
              <path d="M-40 210 C 210 120, 430 320, 700 250 S 1180 60, 1500 170" />
              <path d="M-40 250 C 200 160, 440 360, 700 290 S 1190 100, 1500 205" />
              <path d="M-40 292 C 195 200, 450 400, 700 330 S 1200 140, 1500 242" />
              <path d="M-40 336 C 190 240, 460 440, 700 372 S 1210 180, 1500 280" />
            </g>

            <g stroke={RED} strokeWidth="1.1" opacity="0.18" fill="none">
              <path d="M-40 760 C 260 690, 470 860, 760 790 S 1200 620, 1500 700" />
              <path d="M-40 800 C 255 730, 480 900, 760 830 S 1205 660, 1500 742" />
              <path d="M-40 842 C 250 770, 490 940, 760 872 S 1215 700, 1500 786" />
            </g>

            {/* Soft wide sweep, echoing the broad band in the reference */}
            <g stroke={RED} strokeWidth="26" opacity="0.05" fill="none">
              <path d="M-60 300 C 240 180, 470 420, 760 330 S 1210 120, 1520 250" />
              <path d="M-60 820 C 280 730, 500 920, 780 840 S 1220 660, 1520 760" />
            </g>
          </svg>
        </div>

        {/* ---------- Content ---------- */}
        <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center gap-10 px-5 py-10 lg:flex-row lg:justify-between lg:gap-16 lg:py-20">
          {/* Logo */}
          <div className="flex w-full justify-center lg:w-1/2">
            <Image
              src="/navbar/lmslogo.png"
              alt="TechPratham - Technology First"
              width={1125}
              height={563}
              priority
              className="h-auto w-full max-w-[280px] sm:max-w-[360px] lg:max-w-[440px]"
            />
          </div>

          {/* Form card */}
          <div className="w-full max-w-sm lg:w-1/2">
            <div className="rounded-xl bg-white p-5 shadow-[0_10px_40px_rgba(0,0,0,0.08)] sm:p-6">
              {submitSuccess ? (
                <div className="py-8 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <svg
                      className="h-8 w-8 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h2 className="mb-2 text-xl font-semibold text-gray-900">
                    Thank you!
                  </h2>
                  <p className="text-sm text-gray-600">
                    Your details have been submitted. Our team will reach out to
                    you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                  {/* Full Name */}
                  <div>
                    <label
                      htmlFor="fullName"
                      className="mb-1.5 block text-sm font-medium text-gray-800"
                    >
                      Full Name <span className="text-red-600">*</span>
                    </label>
                    <Input
                      {...register('fullName')}
                      type="text"
                      id="fullName"
                      placeholder="Enter your full name"
                      className="w-full"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-1.5 block text-sm font-medium text-gray-800"
                    >
                      Email Address <span className="text-red-600">*</span>
                    </label>
                    <Input
                      {...register('email')}
                      type="email"
                      id="email"
                      placeholder="your.email@example.com"
                      className="w-full"
                      required
                    />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-1.5 block text-sm font-medium text-gray-800"
                    >
                      Phone Number <span className="text-red-600">*</span>
                    </label>
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
                  </div>

                  {/* Course */}
                  <div>
                    <label
                      htmlFor="course"
                      className="mb-1.5 block text-sm font-medium text-gray-800"
                    >
                      Course Interest <span className="text-red-600">*</span>
                    </label>
                    <Input
                      {...register('course')}
                      type="text"
                      id="course"
                      placeholder="Which course are you interested in?"
                      className="w-full"
                      required
                    />
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    disabled={submitting || !isPhoneValid}
                    className="mt-1 flex w-full items-center justify-center rounded-md py-3 font-semibold text-white transition-opacity hover:opacity-95 disabled:opacity-60"
                    style={{
                      backgroundImage: `linear-gradient(to top left, ${RED}, ${RED_DARK})`,
                    }}
                  >
                    {submitting ? (
                      <>
                        <svg
                          className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                      
                        Submit Now
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
