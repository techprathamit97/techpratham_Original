import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2, Phone, Mail, Globe, ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { NextPage, GetServerSideProps } from 'next';
import { IndexController } from '@/src/index/controller/IndexController';
import { NavbarData } from '@/utils/navbarData';
import { withNavbarSSR } from '@/utils/withNavbarSSR';

interface ThankYouPageProps {
  navbarData: NavbarData;
}

const ThankYouPage: NextPage<ThankYouPageProps> = ({ navbarData }) => {
  const [mounted, setMounted] = useState(false);
  const [formType, setFormType] = useState<string>('');
  const [course, setCourse] = useState<string>('');
  
  useEffect(() => {
    setMounted(true);
    
    // Get query parameters from URL
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type') || 'enquiry';
    const courseName = urlParams.get('course') || '';
    
    setFormType(type);
    setCourse(courseName);

    // Fire Google Ads conversion tracking for successful form submission
    if (typeof window !== 'undefined') {
      // Google Tag Manager event
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'course_enquiry_success',
        form_type: type,
        course_name: courseName,
        page_title: document.title,
        page_location: window.location.href
      });

      // Google Ads gtag conversion (backup method)
      if ((window as any).gtag) {
        (window as any).gtag('event', 'conversion', {
          send_to: 'AW-17462500412/K_E4CNSPy-0bELy44oZB',
          value: 1.0,
          currency: 'INR'
        });
      }

      // Facebook Pixel event (if applicable)
      if ((window as any).fbq) {
        (window as any).fbq('track', 'Lead', {
          content_name: courseName || 'Course Enquiry',
          content_category: 'Education',
          value: 1,
          currency: 'INR'
        });
      }
    }
  }, []);

  const getMessageByFormType = () => {
    switch (formType) {
      case 'course-callback':
        return {
          title: 'Thank You for Your Course Enquiry!',
          subtitle: 'Your callback request has been submitted successfully.',
          description: 'Our training experts will contact you within 2 hours to help you choose the right course and answer all your questions.'
        };
      case 'course-header-enquiry':
        return {
          title: 'Thank You for Your Interest!',
          subtitle: 'Your course enquiry has been received.',
          description: 'Our course counselor will reach out to you shortly with detailed information about the training program.'
        };
      case 'contact-form':
        return {
          title: 'Thank You for Contacting Us!',
          subtitle: 'Your message has been sent successfully.',
          description: 'Our team will review your message and respond to you within 24 hours.'
        };
      case 'training-certificate':
        return {
          title: 'Thank You for Your Certificate Request!',
          subtitle: 'Your certificate details have been submitted.',
          description: 'We will process your request and send your training certificate to your registered email address.'
        };
      case 'reach-out-form':
        return {
          title: 'Thank You for Reaching Out!',
          subtitle: 'We have received your enquiry.',
          description: 'Our team will get back to you soon with the information you requested.'
        };
      case 'community-join':
        return {
          title: 'Welcome to Our Community!',
          subtitle: 'Thank you for joining our LinkedIn community.',
          description: 'You will be redirected to our LinkedIn page shortly. Stay connected for industry insights and learning opportunities.'
        };
      default:
        return {
          title: 'Thank You!',
          subtitle: 'Your enquiry has been submitted successfully.',
          description: 'Our team will contact you soon to assist you further.'
        };
    }
  };

  const message = getMessageByFormType();

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <div>
      <IndexController navbarData={navbarData}>
        <Head>
          <title>Thank You - TechPratham</title>
          <meta name="description" content="Thank you for your enquiry. Our team will contact you soon." />
          <meta name="robots" content="noindex, nofollow" />
        </Head>

        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4 pt-2">
          <div className="max-w-2xl w-full">
            
            {/* Main Thank You Card */}
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
              
              {/* Header with Animation */}
              <div className="bg-[#EE2C3C] px-8 py-12 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-bounce">
                    <CheckCircle2 className="w-12 h-12 text-green-500" />
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {message.title}
                  </h1>
                  <p className="text-green-100 text-lg">
                    {message.subtitle}
                  </p>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute top-4 left-4 w-8 h-8 bg-white/20 rounded-full animate-pulse"></div>
                <div className="absolute top-8 right-8 w-6 h-6 bg-white/20 rounded-full animate-pulse delay-75"></div>
                <div className="absolute bottom-6 left-8 w-4 h-4 bg-white/20 rounded-full animate-pulse delay-150"></div>
              </div>

              {/* Content */}
              <div className="px-8 py-10">
                
                {/* Course Information */}
                {course && (
                  <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-blue-600 font-medium">Course Enquiry For:</p>
                        <p className="text-blue-800 font-semibold">{course}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Description */}
                <div className="text-center mb-8">
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {message.description}
                  </p>
                </div>

                {/* Contact Information */}
                <div className="grid md:grid-cols-3 grid-cols-1 gap-6 mb-8 text-center">
                  <div className="flex flex-col items-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <Phone className="w-8 h-8 text-blue-600 mb-2" />
                    <p className="text-sm text-gray-600">Call Us</p>
                    <p className="font-semibold text-gray-900">+91-8882178896</p>
                  </div>
                  <div className="flex flex-col items-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <Mail className="w-8 h-8 text-green-600 mb-2" />
                    <p className="text-sm text-gray-600">Email Us</p>
                    <p className="font-semibold text-gray-900">info@techpratham.com</p>
                  </div>
                  <div className="flex flex-col items-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <Globe className="w-8 h-8 text-purple-600 mb-2" />
                    <p className="text-sm text-gray-600">Visit Our Website</p>
                    <p className="font-semibold text-gray-900">techpratham.com</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link href="/" passHref>
                    <Button variant="outline" className="flex items-center gap-2 px-6 py-3">
                      <ArrowLeft className="w-4 h-4" />
                      Back to Home
                    </Button>
                  </Link>
                  <Link href="/courses" passHref>
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3">
                      Explore All Courses
                    </Button>
                  </Link>
                </div>

                {/* TechPratham Branding */}
                <div className="text-center mt-8 pt-8 border-t border-gray-200">
                  <Image
                    src="/navbar/lmslogo.png"
                    alt="TechPratham"
                    width={120}
                    height={40}
                    className="mx-auto mb-4"
                    priority
                  />
                  <p className="text-gray-600 text-sm">
                    Thank you for choosing TechPratham for your IT training needs.
                  </p>
                  <p className="text-gray-500 text-xs mt-2">
                    Join thousands of professionals who have advanced their careers with us.
                  </p>
                </div>

              </div>
            </div>

            {/* Additional Information Card */}
            <div className="mt-6 bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="font-semibold text-gray-900 mb-3">What happens next?</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-sm font-bold">1</span>
                  </div>
                  <p className="text-gray-700 text-sm">Our course advisor will call you within 2 hours</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-sm font-bold">2</span>
                  </div>
                  <p className="text-gray-700 text-sm">We'll help you choose the perfect course for your career goals</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-sm font-bold">3</span>
                  </div>
                  <p className="text-gray-700 text-sm">Get started with your IT training journey</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </IndexController>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<ThankYouPageProps> = withNavbarSSR();

export default ThankYouPage;