import React from 'react';
import { Users, Boxes, Workflow, Bot, Check } from 'lucide-react';
import SectionHeading from '../shared/SectionHeading';

interface Program {
  icon: React.ElementType;
  title: string;
  intro: string;
  focus: string;
  points: string[];
  related: string[];
}

const programs: Program[] = [
  {
    icon: Users,
    title: 'Corporate Training for Workday',
    intro:
      'Workday supports business functions such as human capital management, finance and enterprise planning. Employees working with these systems may need to understand specific modules, business processes, reporting concepts and role-based workflows.',
    focus:
      "Training can focus on the areas most relevant to your organization's requirements. Before selecting a program, consider which Workday modules your employees use, their current experience and the skills they need to develop.",
    points: [
      'Workday HCM concepts',
      'Finance processes',
      'System functionality',
      'Practical business scenarios',
    ],
    related: ['Workday HCM training', 'Workday Finance training'],
  },
  {
    icon: Boxes,
    title: 'Corporate Training for SAP',
    intro:
      'SAP applications support business processes across finance, procurement, supply chain, operations and reporting. Employees may need role-specific knowledge to understand how these processes work within their SAP environment.',
    focus:
      'A suitable learning plan should reflect the SAP solutions used, the responsibilities of participating employees and the outcomes the business wants to support. Clarify the required topics, level of practical learning and delivery schedule before finalizing a program.',
    points: [
      'Relevant business functions',
      'Application concepts',
      'Practical process scenarios',
      'SAP FICO for finance teams',
    ],
    related: ['SAP FICO'],
  },
  {
    icon: Workflow,
    title: 'Corporate Training for ServiceNow',
    intro:
      'ServiceNow helps organizations manage IT services and automate workflows across business functions. Depending on their roles, employees may need knowledge of IT service management, platform administration, IT operations, asset management or HR service delivery.',
    focus:
      'Teams should identify whether their priorities relate to ServiceNow administration, ITSM, ITOM, ITAM, HRSD or another platform area before deciding on a learning plan. Practical scenarios help employees understand incident management, service requests and operational processes.',
    points: [
      'IT service management (ITSM)',
      'Platform administration',
      'IT operations & asset management',
      'HR service delivery (HRSD)',
    ],
    related: ['ServiceNow training in India', 'ServiceNow ITOM training'],
  },
  {
    icon: Bot,
    title: 'Corporate Training for Agentic AI',
    intro:
      'Agentic AI is an emerging area involving AI systems that work toward defined goals and carry out sequences of tasks with varying autonomy. Organizations exploring these systems need to understand both their business applications and the risks involved.',
    focus:
      'The learning focus may vary depending on whether the audience includes technical professionals, business users, managers or decision-makers. Define clear objectives and consider data security, privacy, reliability and governance when exploring adoption.',
    points: [
      'AI agents vs. generative AI assistants',
      'Workflow orchestration & use cases',
      'Human oversight and approval',
      'Responsible implementation',
    ],
    related: [],
  },
];

const TrainingPrograms = () => {
  return (
    <section id="programs" className="w-full flex justify-center bg-[#faf6f6] py-14 md:py-20 scroll-mt-20">
      <div className="w-11/12 md:w-10/12 max-w-6xl flex flex-col items-center gap-12">
        <SectionHeading
          eyebrow="Enterprise Technologies"
          title="Corporate Training Programs"
          description="Every organization has different technology requirements. Explore the following training areas to identify which one best aligns with your team's learning objectives."
        />

        <div className="grid md:grid-cols-2 gap-6 w-full">
          {programs.map(({ icon: Icon, title, intro, focus, points, related }) => (
            <div
              key={title}
              className="group flex flex-col h-full bg-white border border-border rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              {/* Card header strip */}
              <div className="flex items-center gap-4 p-6 border-b border-border bg-gradient-to-r from-[#FF2E41]/5 to-transparent">
                <div className="shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-[#FF2E41] to-[#FF2E41] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-300">
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 leading-tight">
                  {title}
                </h3>
              </div>

              {/* Body */}
              <div className="flex flex-col gap-4 p-6 flex-grow">
                <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                  {intro}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5">
                  {points.map((point) => (
                    <div key={point} className="flex items-start gap-2">
                      <Check className="w-4 h-4 mt-1 shrink-0 text-[#FF2E41]" />
                      <span className="text-sm text-gray-700">{point}</span>
                    </div>
                  ))}
                </div>

                <p className="text-gray-500 text-sm leading-relaxed">{focus}</p>

                {related.length > 0 && (
                  <div className="mt-auto pt-2 flex flex-wrap gap-2">
                    {related.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full bg-[#FF2E41]/8 border border-[#FF2E41]/20 text-[#FF2E41] text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrainingPrograms;
