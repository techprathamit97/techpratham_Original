import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Target, Layers, MessageSquare } from 'lucide-react';

const highlights = [
  {
    icon: Target,
    title: 'Aligned to business goals',
    desc: "Understand what your employees need to learn and how those skills support your organization's objectives.",
  },
  {
    icon: Layers,
    title: 'Enterprise & emerging tech',
    desc: 'From established enterprise platforms to emerging AI technologies, choose the right approach for your team.',
  },
  {
    icon: MessageSquare,
    title: 'A single point of contact',
    desc: "Share your team's focus, existing skill levels and learning objectives to discuss suitable options.",
  },
];

const TrainingIntro = () => {
  return (
    <section className="w-full flex justify-center py-14 md:py-20">
      <div className="w-11/12 md:w-10/12 max-w-6xl grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* Text */}
        <div className="flex flex-col gap-5">
          <span className="px-4 py-1 rounded-full border border-[#FF2E41]/40 bg-[#FF2E41]/5 text-[#FF2E41] uppercase tracking-widest text-xs font-semibold w-fit">
            Plan Your Team&apos;s Upskilling
          </span>
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 leading-snug">
            Build technology skills that match how your team works
          </h2>
          <p className="text-gray-600 text-base md:text-lg leading-relaxed">
            Developing technology skills starts with understanding what your
            employees need to learn and how those skills support your business
            goals. Whether your organization uses enterprise platforms or is
            exploring emerging AI technologies, the right training approach can
            help employees build relevant knowledge and become more confident
            with workplace tools.
          </p>
          <p className="text-gray-600 text-base md:text-lg leading-relaxed">
            TechPratham provides a point of contact for organizations exploring
            corporate training for Workday, SAP, ServiceNow and Agentic AI.
          </p>
          <div className="pt-2">
            <Link href="#enquiry">
              <Button
                variant="default"
                className="h-11 px-7 text-base bg-gradient-to-r from-[#FF2E41] to-[#FF2E41] hover:from-[#E0202F] hover:to-[#E0202F] transition-all duration-200"
              >
                Contact TechPratham
              </Button>
            </Link>
          </div>
        </div>

        {/* Highlight cards */}
        <div className="flex flex-col gap-4">
          {highlights.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="flex gap-4 p-5 md:p-6 bg-white border border-border rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-[#FF2E41] to-[#FF2E41] flex items-center justify-center text-white">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900">{title}</h3>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed mt-1">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrainingIntro;
