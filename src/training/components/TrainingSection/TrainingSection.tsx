'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CheckCircle2, Building2 } from 'lucide-react';
import PhoneInput from '@/components/common/PhoneInput/PhoneInput';
import { redirectToThankYou, FORM_TYPES } from '@/lib/thankYouRedirect';
import { getLeadSource } from '@/lib/leadSourceDetection';

const TrainingSection = () => {
  const { register, handleSubmit, reset, setValue } = useForm();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const onSubmit = async (data: any) => {
    // Prevent submission if phone is invalid
    if (!isPhoneValid) {
      return;
    }

    try {
      setSubmitting(true);
      const source = getLeadSource();

      // Map corporate-specific fields onto the fields the lead API / email
      // template understand (course + message), and keep the structured data
      // in metadata so nothing is lost.
      const course = data.technology
        ? `Corporate Training - ${data.technology}`
        : 'Corporate Training';

      const message = [
        data.company ? `Company: ${data.company}` : '',
        data.technology ? `Technology Focus: ${data.technology}` : '',
        data.teamSize ? `Team Size: ${data.teamSize}` : '',
        data.objectives ? `Objectives: ${data.objectives}` : '',
      ]
        .filter(Boolean)
        .join('\n');

      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: data.fullName,
          email: data.email,
          phone: phoneNumber,
          course,
          message,
          formType: 'corporate-training',
          source: source,
          metadata: {
            company: data.company,
            technology: data.technology,
            teamSize: data.teamSize,
          },
        }),
      });

      if (response.ok) {
        setSubmitSuccess(true);
        reset();
        setPhoneNumber('');
        setIsPhoneValid(false);

        setTimeout(() => {
          redirectToThankYou({
            formType: FORM_TYPES.TRAINING_CERTIFICATE,
            course: course,
            source: source,
            additionalData: {
              lead_value: 1,
              form_location: 'corporate_training_page',
            },
          });
        }, 1000);
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
    <section
      id="enquiry"
      className="w-full flex justify-center bg-[#FF2E41] py-14 md:py-20 scroll-mt-20"
    >
      <div className="w-11/12 md:w-10/12 max-w-6xl grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* CTA text */}
        <div className="text-white">
          <span className="px-4 py-1 rounded-full bg-white/10 border border-white/25 uppercase tracking-widest text-xs font-semibold">
            Get In Touch
          </span>
          <h2 className="text-2xl md:text-4xl font-bold mt-5 leading-snug">
            Discuss Corporate Training for Your Team
          </h2>
          <p className="text-white/85 text-base md:text-lg leading-relaxed mt-4">
            Every organization has different learning priorities. Whether your
            team wants to develop Workday, SAP or ServiceNow capabilities or
            explore Agentic AI, start by sharing the skills and business outcomes
            that matter to your organization.
          </p>
          <ul className="mt-6 flex flex-col gap-3">
            {[
              'Role-based, practical learning options',
              'Flexible delivery to suit your schedule',
              'A single point of contact to plan the scope',
            ].map((point) => (
              <li key={point} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-white" />
                <span className="text-white/90 text-sm md:text-base">
                  {point}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Enquiry form */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-[#FF2E41] to-[#FF2E41] flex items-center justify-center text-white">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Corporate Training Enquiry
              </p>
              <h3 className="font-bold text-lg text-gray-900 leading-tight">
                Tell us about your team
              </h3>
            </div>
          </div>

          <form
            className="flex flex-col gap-4 lead-form"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <Input
                  {...register('fullName')}
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Company
                </label>
                <Input
                  {...register('company')}
                  placeholder="Organization name"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Work Email
                </label>
                <Input
                  {...register('email')}
                  type="email"
                  placeholder="you@company.com"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <PhoneInput
                  value={phoneNumber}
                  onChange={(phone: string) => {
                    setPhoneNumber(phone);
                    setValue('phone', phone);
                  }}
                  onValidationChange={setIsPhoneValid}
                  placeholder="Phone Number*"
                  required
                  size="md"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Technology Focus
                </label>
                <Input
                  {...register('technology')}
                  placeholder="e.g. Workday, SAP, ServiceNow"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Team Size
                </label>
                <Input
                  {...register('teamSize')}
                  placeholder="e.g. 10-20"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Learning Objectives
              </label>
              <textarea
                {...register('objectives')}
                rows={3}
                placeholder="Share your team's skill levels and the outcomes you want to support"
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
              />
            </div>

            <Button
              type="submit"
              variant="default"
              className="h-11 mt-1 text-base bg-gradient-to-r from-[#FF2E41] to-[#FF2E41] hover:from-[#E0202F] hover:to-[#E0202F] transition-all duration-200"
              disabled={submitting || !isPhoneValid}
            >
              {submitting ? 'Submitting...' : 'Submit Enquiry'}
            </Button>

            {submitSuccess && (
              <p className="text-green-600 text-sm text-center">
                Thank you! We&apos;ll reach out to discuss your requirements.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default TrainingSection;
