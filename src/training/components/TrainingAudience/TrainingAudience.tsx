import React from 'react';
import { UserCheck, ClipboardCheck } from 'lucide-react';
import SectionHeading from '../shared/SectionHeading';

const participants = [
  'HR and finance teams working with enterprise platforms',
  'IT support, operations and platform administration teams',
  'SAP functional professionals and business process teams',
  'Technical employees exploring AI-enabled workflows',
  'Managers evaluating enterprise technology adoption',
  'Employees transitioning into new technology responsibilities',
];

const evaluationPoints = [
  'Review the curriculum and trainer experience',
  'Check the relevance of practical exercises',
  'Confirm the expected learning outcomes',
  'Ask how different experience levels are addressed',
  'Clarify program scope and learning materials',
  'Understand the assessment approach, fees and post-training support',
];

const TrainingAudience = () => {
  return (
    <section className="w-full flex justify-center bg-[#faf6f6] py-14 md:py-20">
      <div className="w-11/12 md:w-10/12 max-w-6xl grid lg:grid-cols-2 gap-6">
        {/* Who can benefit */}
        <div className="bg-white border border-border rounded-2xl shadow-md p-7 md:p-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF2E41] to-[#FF2E41] flex items-center justify-center text-white">
              <UserCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900">
              Who Can Benefit?
            </h3>
          </div>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-5">
            Corporate technology training may be relevant for organizations that
            want employees to develop skills connected to enterprise
            applications or emerging technologies.
          </p>
          <ul className="flex flex-col gap-3">
            {participants.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-[#FF2E41] shrink-0" />
                <span className="text-gray-700 text-sm md:text-base leading-relaxed">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* How to evaluate */}
        <div className="bg-white border border-border rounded-2xl shadow-md p-7 md:p-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF2E41] to-[#FF2E41] flex items-center justify-center text-white">
              <ClipboardCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900">
              How to Evaluate Options
            </h3>
          </div>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-5">
            Before choosing a corporate training provider, consider whether the
            proposed program aligns with your team&apos;s needs.
          </p>
          <ul className="flex flex-col gap-3">
            {evaluationPoints.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-[#FF2E41] shrink-0" />
                <span className="text-gray-700 text-sm md:text-base leading-relaxed">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default TrainingAudience;
