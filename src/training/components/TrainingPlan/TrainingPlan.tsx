import React from 'react';
import SectionHeading from '../shared/SectionHeading';

const factors = [
  {
    no: '01',
    title: 'Technology requirements',
    desc: 'Identify whether the focus is Workday, SAP, ServiceNow, Agentic AI or multiple technologies.',
  },
  {
    no: '02',
    title: 'Employee skill levels',
    desc: 'Understand whether participants are beginners, existing platform users, functional professionals or technical teams.',
  },
  {
    no: '03',
    title: 'Business objectives',
    desc: 'Define the workflows, concepts or capabilities employees need to understand.',
  },
  {
    no: '04',
    title: 'Practical learning',
    desc: 'Decide whether exercises, demonstrations or role-based scenarios are important to your team.',
  },
  {
    no: '05',
    title: 'Training schedule',
    desc: 'Consider employee availability, preferred delivery format and the number of participants.',
  },
  {
    no: '06',
    title: 'Expected outcomes',
    desc: 'Establish what learners should be able to understand or perform after training.',
  },
];

const TrainingPlan = () => {
  return (
    <section className="w-full flex justify-center py-14 md:py-20">
      <div className="w-11/12 md:w-10/12 max-w-6xl flex flex-col items-center gap-12">
        <SectionHeading
          eyebrow="Planning"
          title="How to Plan Corporate Training"
          description="A useful plan begins with the needs of your employees and the outcomes your organization wants to achieve. Consider these factors before discussing a program."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {factors.map(({ no, title, desc }) => (
            <div
              key={no}
              className="relative p-6 pt-8 bg-white border border-border rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              <span className="absolute top-3 right-4 text-5xl font-bold text-[#FF2E41]/10 select-none leading-none">
                {no}
              </span>
              <div className="w-10 h-1.5 rounded-full bg-gradient-to-r from-[#FF2E41] to-[#FF2E41] mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <p className="text-gray-500 text-sm md:text-base text-center max-w-3xl leading-relaxed">
          Sharing these details helps make the discussion more focused and
          clarifies the scope of a potential training program.
        </p>
      </div>
    </section>
  );
};

export default TrainingPlan;
