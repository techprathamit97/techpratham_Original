// import { CheckCircle, XCircle } from "lucide-react";

// const rows = [
//   {
//     feature: "Affordable Fees",
//     Techpratham: "Competitive Pricing With Flexible Payment Options.",
//     other: "Higher Fees With Limited Payment Options.",
//   },
//   {
//     feature: "Industry Experts",
//     Techpratham: "Well Experienced Trainer From a Relevant Field With Practical Training",
//     other: "Theoretical Class With Limited Practical",
//   },
//   {
//     feature: "Updated Syllabus",
//     Techpratham: "Updated and Industry-relevant Course Curriculum With Hands-on Learning.",
//     other: "Outdated Curriculum With Limited Practical Training.",
//   },
//   {
//     feature: "Hands-on projects",
//     Techpratham: "Real-world Projects With Live Case Studies and Collaboration With Companies.",
//     other: "Basic Projects With Limited Real-world Application.",
//   },
//   {
//     feature: "Certification",
//     Techpratham: "Industry-recognized Certifications With Global Validity.",
//     other: "Basic Certifications With Limited Recognition.",
//   },
//   {
//     feature: "Placement Support",
//     Techpratham: "Strong Placement Support With Tie-ups With Top Companies and Mock Interviews.",
//     other: "Basic Placement Support",
//   },
// ];


// export default function TrainingComparison() {
//   return (
//     <section className="py-5 bg-white">
//       <div className="max-w-6xl mx-auto px-4">
//         {/* Heading */}
//         <div className="text-center mb-5">
//           <h2 className="text-3xl md:text-4xl font-semibold text-gray-800">
//             What Makes Techpratham Training Different?
//           </h2>
//           <div className="w-56 h-1.5 bg-red-800 rounded-full mx-auto mt-4" />
//         </div>

//         {/* Desktop Table */}
//         <div className="hidden md:block">
//           <div className="grid grid-cols-3 rounded-xl overflow-hidden border border-gray-200">
//             {/* Header */}
//             <div className="bg-gray-200 p-2 font-medium text-gray-700">
//               Feature
//             </div>

//             <div className="bg-gray-200 p-2 font-semibold text-red-700 border-t-2 border-l-2 border-r-2 border-red-700">
//               Techpratham Technologies
//             </div>

//             <div className="bg-gray-200 p-2 font-medium text-gray-700">
//               Other Institutes
//             </div>

//             {rows.map((row, i) => {
//               const rowBg = i % 2 === 0 ? "bg-gray-50" : "bg-white";

//               return (
//                 <>
//                   {/* Feature */}
//                   <div className={`${rowBg} p-1 border-t text-gray-700`}>
//                     {row.feature}
//                   </div>

//                   {/* Techpratham */}
//                   <div
//                     className={`${rowBg} p-1 border-l-2 border-r-2 border-red-700 flex gap-2 text-sm`}
//                   >
//                     <CheckCircle className="text-green-600 w-5 h-5 mt-0.5" />
//                     <span>{row.Techpratham}</span>
//                   </div>

//                   {/* Other */}
//                   <div className={`${rowBg} p-1 border-t flex gap-2 text-sm`}>
//                     <XCircle className="text-red-600 w-5 h-5 mt-0.5" />
//                     <span>{row.other}</span>
//                   </div>
//                 </>
//               );
//             })}
//           </div>
//         </div>

//         {/* Mobile View */}
//         <div className="md:hidden space-y-6">
//           {rows.map((row, i) => (
//             <div
//               key={i}
//               className={`rounded-xl border overflow-hidden ${
//                 i % 2 === 0 ? "bg-gray-50" : "bg-white"
//               }`}
//             >
//               <div className="px-4 py-3 font-medium text-gray-800 bg-gray-100">
//                 {row.feature}
//               </div>

//               <div className="px-4 py-3 gap-2 text-sm">
//                 <CheckCircle className="text-green-600 w-5 h-5 mt-0.5" />
//                 <span>{row.Techpratham}</span>
//               </div>

//               <div className="px-4 py-3 border-t flex gap-2 text-sm">
//                 <XCircle className="text-red-600 w-5 h-5 mt-0.5" />
//                 <span>{row.other}</span>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }



import { CheckCircle, XCircle } from "lucide-react";

export default function TrainingComparison() {
  const rows = [
    {
      feature: "Real-World Implementation",
      Techpratham:
        "Live enterprise tenant access for 24/7 practice on real-world, enterprise-grade scenarios.",
      other:
        "Restricted or simulation-based access that lacks real-world complexity.",
    },
    {
      feature: "Subject Matter Experts",
      Techpratham:
        "Mentorship from certified professionals with 15+ years of global industry experience.",
      other:
        "Generic instructors with no hands-on implementation background.",
    },
    {
      feature: "2026 Ready Curriculum",
      Techpratham:
        "AI-driven curriculum with advanced platform integrations and real-world configurations.",
      other:
        "Basic, outdated syllabus that misses key technical integrations.",
    },
    {
      feature: "Daily & Weekly assignments",
      Techpratham:
        "Daily assignments and weekly assessments focused on concept reinforcement and continuous feedback.",
      other:
        "Self-paced learning with no accountability or progress tracking.",
    },
    {
      feature: "End-to-End Lifecycle",
      Techpratham:
        "Hands-on project testing and deployment with portfolio-ready real-world exposure.",
      other:
        "Basic lab exercises without any deployment or testing practice.",
    },
    {
      feature: "Interview Readiness",
      Techpratham:
        "Structured interview preparation including mock interviews, PD sessions, and alumni guidance.",
      other:
        "Minimal support limited to a generic certificate of completion.",
    },
    {
      feature: "Placement Support",
      Techpratham:
        "Guaranteed interview support through tie-ups with top MNCs and 1-on-1 mock interview sessions.",
      other:
        "Basic career tips with no direct industry connections.",
    },
    {
      feature: "Training Support",
      Techpratham:
        "24/7 technical doubt resolution and personalized mentoring support.",
      other:
        "Limited mentor availability and no support after class hours.",
    },
    {
      feature: "Affordable Fees",
      Techpratham:
        "Competitive fixed pricing with flexible payment options and transparent fee structure.",
      other:
        "Inflated fees with hidden costs and low return on investment.",
    },
  ];

  return (
    <section className="py-3 bg-white">
      <div className="max-w-6xl mx-auto px-2">
        {/* Heading */}
        <div className="text-center mb-5 flex flex-col items-center">
  <h2 className="text-3xl md:text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#CD4647] to-[#7F3B40]">
    What Makes TechPratham Training Different?
  </h2>

  <svg
    className="mt-2"
    width="300"
    height="6"
    viewBox="0 0 340 6"
    preserveAspectRatio="none"
  >
    <path
      d="M0 3 Q170 0 340 3 Q170 6 0 3 Z"
      fill="#CD4647"
    />
  </svg>
</div>


        {/* Desktop Table */}
        <div className="hidden md:block">
          <div className="grid grid-cols-3 rounded-xl overflow-hidden border border-gray-200">
            {/* Header */}
            <div className="bg-gray-200 p-1 font-medium text-gray-700">
              Feature
            </div>

            <div className="bg-gray-200 p-1  font-semibold text-red-700 border-t-2 border-l-2 border-r-2 border-red-700">
              TechPratham Advantage
            </div>

            <div className="bg-gray-200 p-1 font-medium text-gray-700">
              Industry Standard Institutes
            </div>

            {rows.map((row, i) => {
              const rowBg = i % 2 === 0 ? "bg-gray-50" : "bg-white";

              return (
                <div key={i} className="contents">
                  <div className={`${rowBg} p-1 border-t text-gray-700`}>
                    {row.feature}
                  </div>

                  <div
                    className={`${rowBg} p-1 border-l-2 border-r-2 border-red-700 flex gap-2 text-sm`}
                  >
                    <CheckCircle className="text-green-600 w-5 h-5 mt-0.5 shrink-0" />
                    <span>{row.Techpratham}</span>
                  </div>

                  <div className={`${rowBg} p-1 border-t flex gap-2 text-sm`}>
                    <XCircle className="text-red-600 w-5 h-5 mt-0.5 shrink-0" />
                    <span>{row.other}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-6">
          {rows.map((row, i) => (
            <div
              key={i}
              className={`rounded-xl border overflow-hidden ${
                i % 2 === 0 ? "bg-gray-50" : "bg-white"
              }`}
            >
              <div className="px-4 py-3 font-medium text-gray-800 bg-gray-100">
                {row.feature}
              </div>

              <div className="px-4 py-3 flex gap-2 text-sm">
                <CheckCircle className="text-green-600 w-5 h-5 mt-0.5 shrink-0" />
                <span>{row.Techpratham}</span>
              </div>

              <div className="px-4 py-3 border-t flex gap-2 text-sm">
                <XCircle className="text-red-600 w-5 h-5 mt-0.5 shrink-0" />
                <span>{row.other}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
