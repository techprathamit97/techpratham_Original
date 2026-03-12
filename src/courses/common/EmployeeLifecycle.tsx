

import React from "react";

const EmployeeLifecycle: React.FC = () => {
  // section labels mapped to page section IDs
  const sections = [
    { label: "About", id: "about" },
    { label: "Training Plan", id: "training-plan" },
    { label: "Course Curriculum", id: "course-curriculum" },
    { label: "New Batch", id: "new-batch" },
    { label: "Projects", id: "projects" },
    { label: "Certificate", id: "certificate" },
    { label: "Testimonials", id: "testimonials" },
    { label: "FAQ", id: "faq" },
    { label: "Interview FAQ", id: "faq" },
  ];

  // smooth scroll handler
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <section className="relative z-10 w-full  mx-auto">
      {/* Lifecycle */}
      <div className="relative z-10 w-full">
        <div className="overflow-x-auto no-scrollbar">
          <div className="w-full  relative">
            <div className="flex w-full min-w-[1000px] md:h-16 h-8 drop-shadow-2xl">
              {sections.map((step, index) => (
                <div
                  key={step.id}
                  onClick={() => scrollToSection(step.id)}
                  className={`flex-1 relative group cursor-pointer transition-all duration-500 ease-out ${
                    index !== 0 ? "-ml-[14px]" : ""
                  } hover:flex-[1.2]`}
                >
                  <div
                    className={`absolute inset-0 ${
                      index === 0
                        ? "bg-gradient-to-tl from-[#C6151D] to-[#600A0E] clip-chevron-start"
                        : index === sections.length - 1
                        ? "bg-gradient-to-tl from-[#C6151D] to-[#600A0E] clip-chevron-end"
                        : "bg-gradient-to-tl from-[#C6151D] to-[#600A0E] clip-chevron"
                    } border-l border-black/20 group-hover:opacity-90`}
                  />
                  <div className="relative z-10 h-full flex items-center justify-center text-center px-2">
                    <span className="text-[8px] md:text-xs font-bold text-white uppercase tracking-tight">
                      {step.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Shimmer */}
          
          </div>
        </div>
      </div>

      {/* Styles */}
      <style jsx>{`
        .clip-chevron {
          clip-path: polygon(
            0% 0%,
            calc(100% - 15px) 0%,
            100% 50%,
            calc(100% - 15px) 100%,
            0% 100%,
            15px 50%
          );
        }

        .clip-chevron-start {
          clip-path: polygon(
            0% 0%,
            calc(100% - 15px) 0%,
            100% 50%,
            calc(100% - 15px) 100%,
            0% 100%
          );
        }

        .clip-chevron-end {
          clip-path: polygon(
            0% 0%,
            100% 0%,
            100% 100%,
            0% 100%,
            15px 50%
          );
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(500%);
          }
        }

        .animate-shimmer {
          animation: shimmer 3s infinite linear;
        }
      `}</style>
    </section>
  );
};

export default EmployeeLifecycle;
