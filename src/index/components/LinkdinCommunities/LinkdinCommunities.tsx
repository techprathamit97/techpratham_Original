'use client';

import React, { useState } from 'react';
import { FaLinkedin } from 'react-icons/fa';
import { ExternalLink, X } from 'lucide-react';
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
  abbr: string;      // short badge code e.g. "SAP"
  category: string;  // e.g. "Enterprise software" / "Technology"
}

/* ─── Communities with individual LinkedIn page screenshots ─── */
const COMMUNITIES: CommunityData[] = [
  {
    name: 'Workday Learning Community',
    tagline: 'Workday HCM & Finance learners',
    description: 'A professional community for Workday HCM, Finance & Payroll learners offering live instructor-led training, real-project exposure, certification guidance, resume building, mock interviews and placement support to build enterprise-ready Workday skills.',
    logo: '/comunity_icon/workday.png',
    bgImage: '/comunity_icon/workday.png',
    url: 'https://www.linkedin.com/showcase/109985952/',
    abbr: 'WD',
    category: 'Enterprise software',
  },
  {
    name: 'ServiceNow Learner Community',
    tagline: 'CSA, CAD, ITSM & ITOM professionals',
    description: 'A professional community for aspiring & experienced ServiceNow professionals covering CSA, CAD, ITSM, ITOM, ITAM, HRSD, SecOps, CSM and more — with live training, real project exposure, certification guidance, mock interviews and career mentorship.',
    logo: '/comunity_icon/workday.png',
    bgImage: '/comunity_icon/servicenow.png',
    url: 'https://www.linkedin.com/showcase/servicenow-learner-community/',
    abbr: 'SN',
    category: 'Technology',
  },
  {
    name: 'SAP Learning Community',
    tagline: 'SAP S/4HANA, FICO, MM & SD careers',
    description: 'A dedicated community for SAP learners covering SAP FICO, MM, SD, BASIS, ABAP, S/4HANA, BRIM and more — with live instructor-led sessions, hands-on project practice, certification support and global placement guidance.',
    logo: '/comunity_icon/workday.png',
    bgImage: '/comunity_icon/sap.png',
    url: 'https://www.linkedin.com/showcase/sap-learning-community/',
    abbr: 'SAP',
    category: 'Enterprise software',
  },
  {
    name: 'MS Dynamics Community',
    tagline: 'PolicyCenter, ClaimCenter & InsuranceSuite',
    description: 'A professional community for Guidewire & Duck Creek learners covering PolicyCenter, ClaimCenter, BillingCenter, Gosu, configurations, integrations and the insurance domain — with live training, project exposure, certification guidance and placement support.',
    logo: '/comunity_icon/workday.png',
    bgImage: '/comunity_icon/guidewire.png',
    url: 'https://www.linkedin.com/showcase/109981635/',
    abbr: 'GW',
    category: 'Enterprise software',
  },
  {
    name: 'Agentic AI Community',
    tagline: 'LLMs & Agentic AI',
    description: 'Welcome to the TechPratham AI & Generative AI Learning Community a professional platform for aspiring and experienced technology professionals looking to build real-world skills in Artificial Intelligence, Data Science, Machine Learning, and enterprise AI solutions.',
    logo: '/comunity_icon/workday.png',
    bgImage: '/comunity_icon/ai.png',
    url: 'https://www.linkedin.com/showcase/109985635/',
    abbr: 'AI',
    category: 'Technology',
  },
  {
    name: 'Software Testing & Automation',
    tagline: 'QA, Tosca, Selenium & ISTQB professionals',
    description: 'A QA-focused learning community for aspiring and experienced testers covering Tosca, Selenium, API testing, ISTQB, automation frameworks and enterprise testing practices — with live training, mock interviews, resume building and placement support.',
    logo: '/comunity_icon/workday.png',
    bgImage: '/comunity_icon/softwaretesting.png',
    url: 'https://www.linkedin.com/showcase/software-testing-automation-community/',
    abbr: 'QA',
    category: 'Technology',
  },
  {
    name: 'Data Analytics Community',
    tagline: 'Power BI, Python, SQL & data careers',
    description: 'A learning community for data professionals covering Power BI, Python, SQL, Excel analytics and business intelligence — with live instructor-led sessions, real-world projects, certification preparation and career development support.',
    logo: '/comunity_icon/workday.png',
    bgImage: '',
    url: 'https://www.linkedin.com/showcase/110000586/',
    abbr: 'DA',
    category: 'Technology',
  },
  {
    name: 'Salesforce Learners Community',
    tagline: 'Admin, Developer, CPQ & Consultant careers',
    description: 'A Salesforce-focused community covering Admin, Developer, CPQ, Marketing Cloud, Integration and Consultant roles — with live training, Trailhead guidance, certification preparation and professional placement mentorship.',
    logo: '/comunity_icon/workday.png',
    bgImage: '/comunity_icon/salesforce.png',
    url: 'https://www.linkedin.com/showcase/salesforce-learners-community/',
    abbr: 'SF',
    category: 'Technology',
  },
  {
  name: 'Microsoft 365 Learner Community',
  tagline: 'Learn Microsoft 365 | Build Practical Skills | Advance Your IT Career',
  description: 'A Microsoft 365-focused community helping learners and professionals develop practical skills in Microsoft 365 applications, administration, collaboration tools, and cloud productivity — with live training, career guidance, certification preparation, job assistance, and professional mentorship.',
  logo: '/comunity_icon/workday.png',
  bgImage: '/comunity_icon/microsoft365.png',
  url: 'https://www.linkedin.com/showcase/144058968/',
  abbr: 'M365',
  category: 'Technology',
},
];

/* ─── Downward shield badge (matches reference mock) ─── */
function ShieldBadge({ abbr, large = false }: { abbr: string; large?: boolean }) {
  return (
    <div
      className={`flex items-start justify-center bg-[#FF2E41] text-white font-bold leading-none ${
        large ? 'w-12 h-[52px] text-sm' : 'w-9 h-10 text-[11px]'
      }`}
      style={{ clipPath: 'polygon(0 0, 100% 0, 100% 68%, 50% 100%, 0 68%)' }}
    >
      <span className={large ? 'pt-3' : 'pt-2'}>{abbr}</span>
    </div>
  );
}

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
  // When set, the gated lead form modal is open for this community.
  const [pendingCommunity, setPendingCommunity] = useState<{ name: string; url: string } | null>(null);

  return (
    <section className="w-full bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 py-3 md:py-5 px-4 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* ── Heading ── */}
        <div className="text-center mb-5">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1.5">Our LinkedIn learning hub</h2>
          <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            Explore our professional communities — tap any card to join and connect with us on LinkedIn.
          </p>
        </div>

        {/* ── Bento grid ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 auto-rows-[140px] md:auto-rows-[150px] grid-flow-row-dense">

          {/* ── Featured big box: Workday community ── */}
          <button
            type="button"
            onClick={() => setPendingCommunity({ name: COMMUNITIES[0].name, url: COMMUNITIES[0].url })}
            aria-label={`Join ${COMMUNITIES[0].name}`}
            className="group col-span-2 lg:col-span-2 row-span-2 relative overflow-hidden rounded-2xl border border-gray-200
                       bg-white shadow-md text-left cursor-pointer transition-all duration-300
                       hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#FF2E41]"
          >
            {/* background image */}
            <div
              className="pointer-events-none absolute inset-0 bg-contain bg-center transition-transform duration-500 group-hover:scale-[1.04]"
              style={{ backgroundImage: "url('/comunity_icon/linkdingbg2.jpeg')" }}
            />
            {/* readability overlay */}
            <div className="pointer-events-none absolute inset-0 bg-black/30" />

            {/* LinkedIn icon top-right */}
            <FaLinkedin className="absolute top-5 right-5 w-7 h-7 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]" />

            {/* content: logo badge + title (left, vertically centered) */}
            <div className="relative h-full flex flex-col items-start justify-center text-left p-5 md:p-7">
              <ShieldBadge abbr={COMMUNITIES[0].abbr} large />
              <h3 className="mt-3 text-xl md:text-2xl font-bold text-white leading-snug drop-shadow-[0_2px_4px_rgba(0,0,0,0.75)]">
                {COMMUNITIES[0].name}
              </h3>
              <p className="mt-1 text-sm text-gray-200 drop-shadow-[0_1px_3px_rgba(0,0,0,0.75)]">
                {COMMUNITIES[0].category}
              </p>

              {/* Hover: "Join community" button */}
              <div className="mt-4 max-h-0 overflow-hidden opacity-0 transition-all duration-300
                              group-hover:max-h-20 group-hover:opacity-100">
                <span className="inline-flex items-center gap-2 rounded-full bg-[#0A66C2]
                                 px-5 py-2.5 text-sm font-semibold text-white shadow-lg">
                  <FaLinkedin className="w-4 h-4" />
                  Join community
                  <ExternalLink className="w-4 h-4" />
                </span>
              </div>
            </div>
          </button>

          {/* ── Community cards — whole card opens the join form ── */}
          {COMMUNITIES.slice(1).map((c, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setPendingCommunity({ name: c.name, url: c.url })}
              aria-label={`Join ${c.name}`}
              className="group relative flex flex-col justify-start text-left overflow-hidden rounded-2xl border border-gray-200
                         bg-white shadow-sm p-4 cursor-pointer transition-all duration-300
                         hover:shadow-xl hover:-translate-y-0.5 hover:border-[#FF2E41] focus:outline-none
                         focus:ring-2 focus:ring-[#FF2E41]"
            >
              {/* Hover background image */}
              <div
                className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-0
                           group-hover:opacity-100 transition-opacity duration-300"
                style={{ backgroundImage: "url('/comunity_icon/linkdingbg2.jpeg')" }}
              />
              {/* Hover dark overlay for readability */}
              <div className="pointer-events-none absolute inset-0 bg-black/55 opacity-0
                              group-hover:opacity-100 transition-opacity duration-300" />

              {/* Content */}
              <div className="relative z-10">
                <ShieldBadge abbr={c.abbr} />
                <h4 className="mt-2 text-sm md:text-[15px] font-bold text-gray-900 leading-tight line-clamp-2
                               group-hover:text-white transition-colors drop-shadow-none group-hover:drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]">
                  {c.name}
                </h4>
                <p className="mt-1 text-xs md:text-sm text-gray-500 group-hover:text-gray-200 transition-colors">
                  {c.category}
                </p>
              </div>

              {/* LinkedIn icon top-right */}
              <FaLinkedin className="absolute top-4 right-4 z-10 w-5 h-5 text-[#0A66C2]
                                     group-hover:text-white transition-colors" />

              {/* Hover: "Join community" button */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-end justify-center
                              opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0A66C2]
                                 px-3.5 py-2 text-[11px] md:text-xs font-semibold text-white shadow-lg whitespace-nowrap">
                  <FaLinkedin className="w-3.5 h-3.5" />
                  Join community
                  <ExternalLink className="w-3.5 h-3.5" />
                </span>
              </div>
            </button>
          ))}
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
