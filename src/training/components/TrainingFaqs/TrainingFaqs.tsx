'use client';

import React, { useState } from 'react';
import { CaretUpIcon } from '@radix-ui/react-icons';
import SectionHeading from '../shared/SectionHeading';

const faqs = [
  {
    que: 'What is corporate training?',
    ans: 'Corporate training is a structured learning process that helps employees develop knowledge and skills relevant to their job responsibilities, workplace systems and organizational objectives.',
  },
  {
    que: 'What does corporate training for Workday cover?',
    ans: "Corporate training for Workday may focus on relevant modules, HCM concepts, finance processes, system functionality and role-specific business scenarios, depending on the organization's requirements.",
  },
  {
    que: 'What is included in corporate training for SAP?',
    ans: 'Corporate training for SAP can focus on relevant SAP applications, functional concepts and business processes. SAP FICO may be considered when finance-related learning is a priority.',
  },
  {
    que: 'What can corporate training for ServiceNow cover?',
    ans: 'Corporate training for ServiceNow may cover ITSM, platform administration, ITOM, ITAM, HRSD or other relevant workflows, depending on employee responsibilities and business needs.',
  },
  {
    que: 'What is corporate training for Agentic AI?',
    ans: 'Corporate training for Agentic AI introduces learners to AI agents, workflow orchestration, potential business applications, human oversight and responsible use.',
  },
  {
    que: 'Can corporate training be planned for different employee skill levels?',
    ans: 'Training requirements can be discussed according to participants’ experience, job responsibilities and learning objectives. The available delivery format and program scope should be confirmed with the provider.',
  },
  {
    que: 'How can an organization enquire about corporate training with TechPratham?',
    ans: 'An organization can share its preferred technology, team size, employee skill levels and learning objectives through the corporate training enquiry form to begin a discussion about suitable options.',
  },
];

const TrainingFaqs = () => {
  const [selected, setSelected] = useState<number | null>(0);

  const toggle = (i: number) => setSelected(selected === i ? null : i);

  return (
    <section className="w-full flex justify-center py-14 md:py-20">
      <div className="w-11/12 md:w-10/12 max-w-4xl flex flex-col items-center gap-10">
        <SectionHeading
          eyebrow="FAQ"
          title="Frequently Asked Questions"
        />

        <div className="w-full flex flex-col gap-3">
          {faqs.map((item, index) => {
            const isOpen = selected === index;
            return (
              <div
                key={index}
                className={`w-full rounded-xl border cursor-pointer transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'border-[#FF2E41]/40 bg-white shadow-md'
                    : 'border-border bg-white hover:border-[#FF2E41]/30'
                }`}
                onClick={() => toggle(index)}
              >
                <div className="flex items-center justify-between gap-4 p-4 md:p-5">
                  <p className="text-gray-900 text-base md:text-lg font-medium">
                    {item.que}
                  </p>
                  <span
                    className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isOpen ? 'bg-gradient-to-br from-[#FF2E41] to-[#FF2E41] text-white' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    <CaretUpIcon
                      className={`w-5 h-5 transition-transform duration-300 ${
                        isOpen ? 'rotate-0' : 'rotate-180'
                      }`}
                    />
                  </span>
                </div>
                <div
                  className={
                    isOpen
                      ? 'overflow-hidden transition-all max-h-96 ease-out duration-500 px-4 md:px-5 pb-5'
                      : 'overflow-hidden transition-all max-h-0 duration-300 px-4 md:px-5'
                  }
                >
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                    {item.ans}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrainingFaqs;
