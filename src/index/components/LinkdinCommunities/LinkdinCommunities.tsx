'use client';

import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { FaLinkedin } from 'react-icons/fa';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import PhoneInput from '@/components/common/PhoneInput/PhoneInput';
import { getLeadSource, isGoogleAdsVisitor } from '@/lib/leadSourceDetection';
import { redirectToThankYou, FORM_TYPES } from '@/lib/thankYouRedirect';

/* ─── TypeScript Interfaces ─── */
interface CommunityData {
  name: string;
  tagline: string;
  description: string;
  logo: string;
  bgImage: string;
  url: string;
}

interface ImageAssets {
  logo: string;
  bgImage: string;
}

/* ─── Main TechPratham LinkedIn profile ─── */

/* ─── Default banner for fallback ─── */
const DEFAULT_BANNER = '/comunity_icon/test.jpg';

/* ─── Image Asset Utilities ─── */
const getImageAssets = (community: CommunityData): ImageAssets => {
  return {
    logo: community.logo || '/comunity_icon/default-logo.png',
    bgImage: community.bgImage || DEFAULT_BANNER
  };
};

const validateImagePath = (path: string): boolean => {
  return path.includes('/comunity_icon/') && (
    path.endsWith('.jpg') || 
    path.endsWith('.jpeg') || 
    path.endsWith('.png') || 
    path.endsWith('.webp')
  );
};

/* ─── Communities with individual background images ─── */
const COMMUNITIES: CommunityData[] = [
  {
    name: 'Workday Learning Community',
    tagline: 'Workday HCM & Finance learners',
    description: 'A professional community for Workday HCM, Finance & Payroll learners offering live instructor-led training, real-project exposure, certification guidance, resume building, mock interviews and placement support to build enterprise-ready Workday skills.',
    logo: '/comunity_icon/workday.png',
    bgImage: '/comunity_icon/bgimage.jpg',
    url: 'https://www.linkedin.com/showcase/109985952/',
  },
  {
    name: 'ServiceNow Learner Community',
    tagline: 'CSA, CAD, ITSM & ITOM professionals',
    description: 'A professional community for aspiring & experienced ServiceNow professionals covering CSA, CAD, ITSM, ITOM, ITAM, HRSD, SecOps, CSM and more — with live training, real project exposure, certification guidance, mock interviews and career mentorship.',
    logo: '/comunity_icon/workday.png',
    bgImage: '/comunity_icon/bgimage.jpg',
    url: 'https://www.linkedin.com/showcase/servicenow-learner-community/',
  },
  {
    name: 'SAP Learning Community',
    tagline: 'SAP S/4HANA, FICO, MM & SD careers',
    description: 'A dedicated community for SAP learners covering SAP FICO, MM, SD, BASIS, ABAP, S/4HANA, BRIM and more — with live instructor-led sessions, hands-on project practice, certification support and global placement guidance.',
    logo: '/comunity_icon/workday.png',
    bgImage: '/comunity_icon/bgimage.jpg',
    url: 'https://www.linkedin.com/showcase/sap-learning-community/',
  },
  {
    name: 'MS Dynamics Community',
    tagline: 'PolicyCenter, ClaimCenter & InsuranceSuite',
    description: 'A professional community for Guidewire & Duck Creek learners covering PolicyCenter, ClaimCenter, BillingCenter, Gosu, configurations, integrations and the insurance domain — with live training, project exposure, certification guidance and placement support.',
    logo: '/comunity_icon/workday.png',
    bgImage: '/comunity_icon/bgimage.jpg',
    url: 'https://www.linkedin.com/showcase/109981635/',
  },
  {
    name: 'Agentic AI Community',
    tagline: 'LLMs & Agentic AI',
    description: 'Welcome to the TechPratham AI & Generative AI Learning Community a professional platform for aspiring and experienced technology professionals looking to build real-world skills in Artificial Intelligence, Data Science, Machine Learning, and enterprise AI solutions.',
    logo: '/comunity_icon/workday.png',
    bgImage: '/comunity_icon/bgimage.jpg',
    url: 'https://www.linkedin.com/showcase/109985635/',
  },
  {
    name: 'Software Testing & Automation',
    tagline: 'QA, Tosca, Selenium & ISTQB professionals',
    description: 'A QA-focused learning community for aspiring and experienced testers covering Tosca, Selenium, API testing, ISTQB, automation frameworks and enterprise testing practices — with live training, mock interviews, resume building and placement support.',
    logo: '/comunity_icon/workday.png',
    bgImage: '/comunity_icon/bgimage.jpg',
    url: 'https://www.linkedin.com/showcase/software-testing-automation-community/',
  },
  {
    name: 'Data Analytics Community',
    tagline: 'Power BI, Python, SQL & data careers',
    description: 'A learning community for data professionals covering Power BI, Python, SQL, Excel analytics and business intelligence — with live instructor-led sessions, real-world projects, certification preparation and career development support.',
    logo: '/comunity_icon/workday.png',
    bgImage: '/comunity_icon/bgimage.jpg',
    url: 'https://www.linkedin.com/showcase/110000586/',
  },
  {
    name: 'Salesforce Learners Community',
    tagline: 'Admin, Developer, CPQ & Consultant careers',
    description: 'A Salesforce-focused community covering Admin, Developer, CPQ, Marketing Cloud, Integration and Consultant roles — with live training, Trailhead guidance, certification preparation and professional placement mentorship.',
    logo: '/comunity_icon/workday.png',
    bgImage: '/comunity_icon/bgimage.jpg',
    url: 'https://www.linkedin.com/showcase/salesforce-learners-community/',
  },
];

const CARD_GAP = 24; // px between cards

/* ─── Community gated lead form modal ─── */
interface ModalProps {
  communityName: string;
  linkedinUrl: string;
  onClose: () => void;
}

interface FormData {
  phoneNumber: string;
  isPhoneValid: boolean;
  fullName: string;
  email: string;
  consent: boolean;
}

interface FormState {
  submitting: boolean;
  submitSuccess: boolean;
  error: string;
}

function CommunityLeadModal({ communityName, linkedinUrl, onClose }: ModalProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPhoneValid) { setError('Please enter a valid phone number.'); return; }
    if (!consent) { setError('Please accept the Terms & Conditions.'); return; }
    setError('');
    setSubmitting(true);

    try {
      const source = getLeadSource();
      const resp = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          phone: phoneNumber,
          email,
          course: communityName,
          formType: 'community-join',
          source,
          consent,
        }),
      });

      if (resp.ok) {
        setSubmitSuccess(true);
        
        // Redirect to Thank You page and then LinkedIn
        setTimeout(() => {
          redirectToThankYou({
            formType: FORM_TYPES.COMMUNITY_JOIN,
            course: communityName,
            source: source,
            additionalData: {
              lead_value: 1,
              form_location: 'community_modal',
              linkedin_redirect: linkedinUrl
            }
          });
        }, 1500);
        
      } else {
        setError('Submission failed. Please try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md relative">
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Join Community</h2>
            <p className="text-sm text-gray-500 mt-0.5">Enter your details to access <strong>{communityName}</strong></p>
          </div>
          <button onClick={onClose} aria-label="Close"
                  className="p-1 rounded-full hover:bg-gray-100 transition flex-shrink-0 ml-4">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <Input
            type="text"
            placeholder="Full Name*"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full"
          />

          <PhoneInput
            value={phoneNumber}
            onChange={(phone) => setPhoneNumber(phone)}
            onValidationChange={setIsPhoneValid}
            placeholder="Phone Number*"
            required
            size="md"
          />

          <Input
            type="email"
            placeholder="Email Address*"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full"
          />

          <div className="flex items-start gap-2">
            <Checkbox
              id="community-consent"
              checked={consent}
              onCheckedChange={(v) => setConsent(!!v)}
              required
              className="mt-0.5"
            />
            <label htmlFor="community-consent" className="text-xs text-gray-600 leading-snug">
              By registering, I agree to TechPratham{' '}
              <a href="/terms-and-conditions" target="_blank" rel="noopener noreferrer"
                 className="text-blue-600 underline">Terms & Conditions</a>.
            </label>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          {submitSuccess ? (
            <p className="text-green-600 text-sm text-center font-medium">
              ✅ Submitted! Redirecting to LinkedIn…
            </p>
          ) : (
            <Button
              type="submit"
              disabled={submitting || !isPhoneValid}
              className="w-full bg-[#0077b5] hover:bg-[#005f91] text-white font-semibold h-10"
            >
              <FaLinkedin className="w-4 h-4 mr-2" />
              {submitting ? 'Submitting…' : 'Join on LinkedIn'}
            </Button>
          )}
        </form>
      </div>
    </div>
  );
}

export default function LinkdinCommunities() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(0);
  const [startIdx, setStartIdx] = useState(0);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Gated navigation state — set when a card is clicked.
  const [pendingCommunity, setPendingCommunity] = useState<{ name: string; url: string } | null>(null);

  const total = COMMUNITIES.length;
  const visibleCount = cardWidth > 0 ? (cardWidth > 800 ? 4 : cardWidth > 600 ? 3 : cardWidth > 400 ? 2 : 1) : 4;
  const MAX_START = Math.max(0, total - visibleCount);

  // Measure viewport and pick visible count.
  useEffect(() => {
    const calc = () => {
      if (!viewportRef.current) return;
      setCardWidth(viewportRef.current.offsetWidth);
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);

  // Auto-scroll: advance 1 every 3s, loop back to 0.
  useEffect(() => {
    autoRef.current = setInterval(() => {
      setStartIdx((i) => (i >= MAX_START ? 0 : i + 1));
    }, 3000);
    return () => { if (autoRef.current) clearInterval(autoRef.current); };
  }, [MAX_START]);

  const resetTimer = () => {
    if (autoRef.current) clearInterval(autoRef.current);
    autoRef.current = setInterval(() => {
      setStartIdx((i) => (i >= MAX_START ? 0 : i + 1));
    }, 3000);
  };

  const goBack = () => {
    setStartIdx((i) => Math.max(0, i - 1));
    resetTimer();
  };
  const goForward = () => {
    setStartIdx((i) => Math.min(MAX_START, i + 1));
    resetTimer();
  };

  // Per-card pixel width.
  const perCard = cardWidth > 0
    ? (cardWidth - CARD_GAP * (visibleCount - 1)) / visibleCount
    : 300;
  const translateX = startIdx * (perCard + CARD_GAP);

  return (
    <section className="w-full bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 py-12 px-4 md:px-12">
      {/* ── Single rounded container wrapping everything ── */}
      <div className="max-w-7xl mx-auto border border-gray-200/50 rounded-3xl bg-white/80 backdrop-blur-sm shadow-xl overflow-hidden">


        {/* ── Communities section ── */}
        <div className="p-6 md:p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Our LinkedIn learning hub</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join our professional communities and connect with like-minded learners in your field
            </p>
          </div>

          {/* ── Auto-scroll carousel ── */}
          <div className="relative">
            {startIdx > 0 && (
              <button onClick={goBack} aria-label="Previous"
                      className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center
                                 justify-center rounded-full bg-white border border-gray-200 shadow hover:bg-gray-50">
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>
            )}

            <div ref={viewportRef} className="overflow-hidden w-full">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ gap: `${CARD_GAP}px`, transform: `translateX(-${translateX}px)` }}
              >
                {COMMUNITIES.map((c: CommunityData, i: number) => {
                  const imageAssets = getImageAssets(c);
                  
                  return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setPendingCommunity({ name: c.name, url: c.url })}
                    className="flex-shrink-0 relative overflow-hidden rounded-2xl border border-gray-200
                               cursor-pointer group focus:outline-none bg-white shadow-md hover:shadow-xl
                               transition-all duration-300"
                    style={{ width: perCard > 0 ? `${perCard}px` : `calc((100% - ${CARD_GAP * (visibleCount - 1)}px) / ${visibleCount})`, height: '300px' }}
                  >
                    {/* Close Button - Top Right */}
                    <div className="absolute top-3 right-3 w-7 h-7 bg-black/70 rounded-full flex items-center justify-center
                                    opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                      <X className="w-3.5 h-3.5 text-white" />
                    </div>

                    {/* Top Section - Cover Image Banner (40%) */}
                    <div className="relative h-[40%] overflow-hidden">
                      <Image
                        src={imageAssets.bgImage}
                        alt={`${c.name} cover`}
                        fill
                        sizes="400px"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = DEFAULT_BANNER;
                        }}
                      />
                      
                      {/* Subtle dark overlay */}
                      <div className="absolute inset-0 bg-black/10" />
                    </div>

                    {/* Logo Overlap Section - Positioned over banner edge */}
                    <div className="absolute top-[28%] left-1/2 transform -translate-x-1/2 z-10">
                      <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center 
                                      shadow-2xl border-2 border-white group-hover:scale-105 transition-transform duration-300
                                      ring-2 ring-gray-100">
                        <Image 
                          src={imageAssets.logo} 
                          alt={`${c.name} logo`} 
                          width={64} 
                          height={64} 
                          className="object-contain rounded-full" 
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/comunity_icon/default-logo.png';
                          }}
                        />
                      </div>
                    </div>

                    {/* Content Section (60%) */}
                    <div className="h-[60%] pt-10 px-6 pb-6 flex flex-col items-center text-center bg-white">
                      {/* Community Name */}
                      <h3 className="font-bold text-gray-900 text-xl mb-2 line-clamp-2 leading-tight">
                        {c.name}
                      </h3>
                   

                      {/* Spacer to push button to bottom */}
                      <div className="flex-1" />

                      {/* Connect Button */}
                      <div className="w-full max-w-[240px]">
                        <div className="flex items-center justify-center gap-3 bg-[#0A66C2] hover:bg-[#084d8a] 
                                        text-white font-semibold text-base px-6 py-2 rounded-full
                                        transition-all duration-300 shadow-lg hover:shadow-xl
                                        group-hover:bg-[#084d8a] transform hover:scale-105">
                          <FaLinkedin className="w-5 h-5" />
                          + Connect
                        </div>
                      </div>
                    </div>

                    {/* Subtle hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-50/30 to-transparent 
                                    opacity-0 group-hover:opacity-100 transition-opacity duration-300 
                                    pointer-events-none rounded-2xl" />
                  </button>
                  );
                })}
              </div>
            </div>

            {startIdx < MAX_START && (
              <button onClick={goForward} aria-label="Next"
                      className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center
                                 justify-center rounded-full bg-white border border-gray-200 shadow hover:bg-gray-50">
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            )}
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-1.5 mt-4">
            {Array.from({ length: MAX_START + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => { setStartIdx(i); resetTimer(); }}
                aria-label={`Go to ${i + 1}`}
                className={`w-2 h-2 rounded-full transition-colors ${
                  startIdx === i ? 'bg-[#0077b5]' : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Gated lead modal — opens when a community card is clicked ── */}
      {pendingCommunity && (
        <CommunityLeadModal
          communityName={pendingCommunity.name}
          linkedinUrl={pendingCommunity.url}
          onClose={() => setPendingCommunity(null)}
        />
      )}
    </section>
  );
}
