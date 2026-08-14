import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import PhoneInput from '@/components/common/PhoneInput/PhoneInput';
import { getLeadSource, isGoogleAdsVisitor } from '@/lib/leadSourceDetection';
import { Download, User } from 'lucide-react';
import Head from 'next/head';

export default function Connect() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const { register, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      fullName: '',
      phone: '',
      email: '',
      course: '',
      consent: false,
    }
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
          formType: "linkedin lead",
          source: source, // Set source based on visitor origin
        }),
      });

      if (response.ok) {
        setSubmitSuccess(true);
        reset();
        setPhoneNumber('');
        setIsPhoneValid(false);
        
        // ✅ Only send Google Ads conversion if visitor came from Google Ads
        if (isGoogleAdsVisitor() && typeof window !== "undefined") {
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
        <title>Download PDF | TechPratham</title>
        <meta name="description" content="Download our course PDF by providing your details." />
      </Head>

      <div className=" py-3 px-4 sm:px-2 lg:px-3">
        <div className="max-w-xs mx-auto">
         

          <Card className="shadow-xl border-0">
            <CardHeader className="bg-gradient-to-tl from-[#C6151D] to-[#600A0E] text-white rounded-t-lg">
              
            </CardHeader>

            <CardContent className="p-4">
              {submitSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">Success!</h3>
                  <p className="text-gray-600">
                    Your details have been submitted successfully. The PDF download will begin shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                  {/* Full Name */}
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
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
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
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
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
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
                    <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-2">
                      Course Interest *
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
                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-tl from-[#C6151D] to-[#600A0E] text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
                    disabled={submitting || !isPhoneValid}
                  >
                    {submitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Download className="h-5 w-5 mr-2" />
                        Download PDF
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Footer Info */}
          
        </div>
      </div>
    </>
  );
}
