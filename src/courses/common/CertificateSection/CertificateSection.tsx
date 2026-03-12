// import Image from 'next/image'
// import React from 'react'

// const CertificateSection = ({ course }: any) => {
//     return (
//         <div className='w-full h-auto flex flex-col items-center justify-center gap-6 pt-16 bg-[#f7f7f7] text-black'>
//             <div className='md:w-10/12 w-11/12 h-auto flex md:flex-row flex-col md:p-8 p-4 gap-6 border-4 border-blue-500 rounded-xl bg-white shadow'>
//                 <div className='w-auto h-auto'>
//                     <Image src='/course/certificate/certify.png' alt='' width={400} height={300} className='md:w-96 w-full h-auto border border-gray-200' />
//                 </div>
//                 <div className="w-full flex flex-col items-start md:p-6 p-0 bg-white">
//                     <h1 className="text-xl font-semibold text-gray-800 mb-4">
//                         <span className='border-b-4 border-orange-500'><span dangerouslySetInnerHTML={{ __html: course.title }} /></span> – Associate Training Program
//                     </h1>

//                     <div className="border border-gray-300 rounded-sm overflow-hidden">
//                         <div className="grid grid-cols-2 bg-blue-500">
//                             <div className="px-4 py-3 text-white font-medium border-r border-blue-400">
//                                 Category
//                             </div>
//                             <div className="px-4 py-3 text-white font-medium">
//                                 Associate
//                             </div>
//                         </div>

//                         <div className="grid grid-cols-2 border-b border-gray-300">
//                             <div className="px-4 py-3 bg-gray-50 font-medium text-gray-700 border-r border-gray-300">
//                                 Exam Name:
//                             </div>
//                             <div className="px-4 py-3 text-gray-700">
//                                 <span dangerouslySetInnerHTML={{ __html: course.title }} /> – Associate
//                             </div>
//                         </div>

//                         <div className="grid grid-cols-2 border-b border-gray-300">
//                             <div className="px-4 py-3 bg-gray-50 font-medium text-gray-700 border-r border-gray-300">
//                                 Exam Code:
//                             </div>
//                             <div className="px-4 py-3 text-gray-700">
//                                 N.A.
//                             </div>
//                         </div>

//                         <div className="grid grid-cols-2 border-b border-gray-300">
//                             <div className="px-4 py-3 bg-gray-50 font-medium text-gray-700 border-r border-gray-300">
//                                 Exam Duration:
//                             </div>
//                             <div className="px-4 py-3 text-gray-700">
//                                 N.A.
//                             </div>
//                         </div>

//                         <div className="grid grid-cols-2 border-b border-gray-300">
//                             <div className="px-4 py-3 bg-gray-50 font-medium text-gray-700 border-r border-gray-300">
//                                 Exam Format:
//                             </div>
//                             <div className="px-4 py-3 text-gray-700">
//                                 N.A.
//                             </div>
//                         </div>

//                         <div className="grid grid-cols-2">
//                             <div className="px-4 py-3 bg-gray-50 font-medium text-gray-700 border-r border-gray-300">
//                                 Passing Score:
//                             </div>
//                             <div className="px-4 py-3 text-gray-700">
//                                 N.A.
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default CertificateSection


import Image from "next/image";
import React, { useState } from "react";
import { CheckCircle } from "lucide-react";
import LeadForm from "@/components/common/LeadForm/LeadForm";
interface SectionProps {
  id?: string;
}

const CertificateSection = ({ id, course }: any) => {
    const [showLeadForm, setShowLeadForm] = useState(false);
  
  return (
    <section id={id} className="w-full bg-white py-14">
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col lg:flex-row items-center gap-5">

        {/* LEFT CONTENT */}
        <div className="w-full lg:w-1/2 space-y-3">

          <h2 className="text-2xl md:text-3xl font-bold text-[#002060] leading-snug">
            Highlight Your Skills with an  <br />
            Industry-Ready Certificate
          </h2>

          {/* POINTS */}
          <div className="space-y-3">
            {[
              "Training Certificate is Govern By 12 Global Associations.",
              'Training Certificate is Powered by "Wipro DICE ID"',
              'Training Certificate is Powered by "Verifiable Skill Credentials"',
            ].map((text, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle className="text-green-500 mt-1" size={20} />
                <p className="text-gray-800">{text}</p>
              </div>
            ))}
          </div>

          {/* COLLAB */}
          <div>
            <p className="font-semibold text-gray-900 mb-4">
              in Collaboration with
            </p>

           
          </div>

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button onClick={() => setShowLeadForm(true)} className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-md font-semibold transition">
              Get In Touch
            </button>

            <button onClick={() => setShowLeadForm(true)} className="border-2 border-blue-700 text-blue-700 px-8 py-3 rounded-md font-semibold hover:bg-blue-50 transition">
              Get a Sample Certificate
            </button>
          </div>
        </div>

        {/* RIGHT CERTIFICATE */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <div className="relative   rounded-lg shadow-xl">

            <div className="bg-white  rounded ">
              <Image
                src="/course/certificate/Course_Certificate.webp"
                alt="Certificate"
                width={420}
                height={380}
                className="rounded h-full w-full"
              />
            </div>

          </div>
        </div>

      </div>
      {showLeadForm && (
        <LeadForm
          course={{ title: course?.title }}
          onClose={() => setShowLeadForm(false)}
          onSuccess={() => setShowLeadForm(false)}
        />
      )}
    </section>
  );
};

export default CertificateSection;
