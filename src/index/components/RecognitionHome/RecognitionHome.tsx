// 'use client';
// import React, { useState } from 'react';
// import Image from 'next/image';
// import { Separator } from '@/components/ui/separator';

// type Certificate = {
//   title: string;
//   img: string;
//   desc: string;
// };

// const certificatesData: Certificate[] = [
//   {
//     title: 'DPIIT Recognition',
//     img: '/home/recognition/startup.webp',
//     desc: 'Officially recognized as a startup by the Department for Promotion of Industry and Internal Trade (DPIIT), Government of India.',
//   },
//   {
//     title: 'ISO 9001:2015',
//     img: '/home/recognition/iso.webp',
//     desc: 'Certified in Quality Management System, ensuring consistent service and performance.',
//   },
//   {
//     title: 'MCA Certification',
//     img: '/home/recognition/IncomeTax.webp',
//     desc: 'MCA Certified Institute, promoting innovation and digital transformation in India.',
//   },
//   {
//     title: 'MSME India',
//     img: '/home/recognition/MEME.webp',
//     desc: 'Officially registered under the Ministry of MSME for small-scale industry benefits.',
//   },
// ];

// const RecognitionHome = () => {
//   const [selectedCert, setSelectedCert] = useState<Certificate>(certificatesData[0]);
//   const [expandedMobile, setExpandedMobile] = useState<number | null>(null);

//   const handleSelect = (cert: Certificate, index: number) => {
//     setSelectedCert(cert);
//     setExpandedMobile(expandedMobile === index ? null : index);
//   };

//   return (
//     <div className="w-full h-auto flex flex-col items-center justify-center py-5 md:py-10 gap-3 bg-[#f7f7f7] text-black">


//       <div className="w-full px-20 h-auto flex flex-col md:flex-row md:gap-10">

//         <div className="w-full md:w-1/2 flex flex-col gap-2  ">

//           <h3 className="text-2xl font-bold">Government Recognition</h3>
//           <Separator className="h-[1px] bg-gray-300" />

//           {certificatesData.map((cert: Certificate, i: number) => (
//             <div key={i} className="w-full">

//               <div
//                 className={`flex items-center gap-4 p-2 rounded-lg border cursor-pointer transition-all duration-300 ${selectedCert.title === cert.title
//                   ? 'bg-yellow-600 shadow-xl border-[#a3262c]'
//                   : 'bg-[#a3262c] border-gray-200'
//                   }`}
//                 onClick={() => handleSelect(cert, i)}
//               >
//                 <div className="w-10 h-10 relative overflow-hidden rounded">
//                   <Image
//                     src={cert.img}
//                     alt={cert.title}
//                     fill
//                     className="object-contain p-1"
//                   />
//                 </div>

//                 <div className="flex flex-col">
//                   <div className="font-semibold text-sm text-black">{cert.title}</div>
//                   <p className="text-xs text-black truncate max-w-[200px]">{cert.desc}</p>
//                 </div>
//               </div>

//               {/* MOBILE EXPANDED VIEW */}
//               {expandedMobile === i && (
//                 <div className="md:hidden w-full mt-3 bg-white border shadow-xl rounded-lg p-4">
//                   <h2 className="text-lg font-bold mb-2 text-center">{cert.title}</h2>

//                   <div className="w-full bg-gray-100 rounded-md overflow-hidden p-4">
//                     <Image
//                       src={cert.img}
//                       alt={cert.title}
//                       width={1200}
//                       height={800}
//                       className="w-full h-auto object-contain"
//                     />
//                   </div>

//                   <div className=" p-2 bg-gray-50 rounded-md">
//                     <p className="text-sm text-gray-700">
//                       <strong>Description:</strong> {cert.desc}
//                     </p>
//                   </div>
//                 </div>
//               )}

//             </div>
//           ))}
//         </div>

//         {/* DESKTOP RIGHT SIDE VIEW */}
//         <div className="w-full hidden md:flex h-[70vh] pb-4  flex-col justify-between rounded-md overflow-hidden">

//           {/* TITLE (TOP CENTER) */}
//           <h2 className="text-sm md:text-3xl text-yellow-600 font-bold text-center">
//             {selectedCert.title}
//           </h2>

//           {/* IMAGE (CENTERED MID SECTION) */}
//           <div className="flex-1 flex items-center justify-center">
//             <Image
//               src={selectedCert.img}
//               alt={selectedCert.title}
//               width={1200}
//               height={800}
//               className="md:max-w-[400px] max-h-[300px] object-fill pb-1"
//             />
//           </div>

//           {/* DESCRIPTION (BOTTOM LEFT) */}
//           <div className="bg-gray-50 rounded-md max-w-2xl p-3">
//             <p className="text-sm text-gray-700 text-left">
//               <strong>Description:</strong> {selectedCert.desc}
//             </p>
//           </div>

//         </div>



//       </div>
//     </div>
//   );
// };

// export default RecognitionHome;


'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';

type Certificate = {
  title: string;
  img: string;
  desc: string;
};

const certificatesData: Certificate[] = [
  {
    title: 'DPIIT Recognition',
    img: '/home/recognition/startup.webp',
    desc: 'Officially recognized as a startup by the Department for Promotion of Industry and Internal Trade (DPIIT), Government of India.',
  },
  {
    title: 'ISO 9001:2015',
    img: '/home/recognition/iso.webp',
    desc: 'Certified in Quality Management System, ensuring consistent service and performance.',
  },
  {
    title: 'MCA Certification',
    img: '/home/recognition/IncomeTax.webp',
    desc: 'MCA Certified Institute, promoting innovation and digital transformation in India.',
  },
  {
    title: 'MSME India',
    img: '/home/recognition/MEME.webp',
    desc: 'Officially registered under the Ministry of MSME for small-scale industry benefits.',
  },
];

const RecognitionHome = () => {
  const [selectedCert, setSelectedCert] = useState<Certificate>(certificatesData[0]);
  const [expandedMobile, setExpandedMobile] = useState<number | null>(null);

  const handleSelect = (cert: Certificate, index: number) => {
    setSelectedCert(cert);
    setExpandedMobile(expandedMobile === index ? null : index);
  };

  /* AUTO ROTATE FOR DESKTOP */
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setSelectedCert((prev) => {
  //       const currentIndex = certificatesData.findIndex(
  //         (c) => c.title === prev.title
  //       );
  //       const nextIndex = (currentIndex + 1) % certificatesData.length;
  //       return certificatesData[nextIndex];
  //     });
  //   }, 2000);

  //   return () => clearInterval(interval);
  // }, []);

  return (
    <div className="max-w-7xl h-auto flex flex-col items-center justify-center  gap-3 bg-[#f7f7f7] text-black">

      <div className="w-full m-2 border-2 px-1 md:px-20 py-7  h-auto flex flex-col md:flex-row md:gap-10">

        <div className="w-full md:w-1/2 flex flex-col gap-2">
<div className='pb-2'>
          <h3 className="text-[26px] text-yellow-600 font-bold">Government Recognition</h3>
          <svg
          className="mx-auto"
          width="340"
          height="6"
          viewBox="0 0 340 6"
          preserveAspectRatio="none"
        >
          <path
            d="M0 3 Q170 0 340 3 Q170 6 0 3 Z"
            fill="#7f1d1d"
          />
        </svg>
        </div>

          {certificatesData.map((cert: Certificate, i: number) => (
            <div key={i} className="w-full">

              <div
                className={`flex items-center gap-4 p-2 rounded-lg border cursor-pointer transition-all duration-300 ${
                  selectedCert.title === cert.title
                    ? 'bg-yellow-600 shadow-xl border-[#a3262c]'
                    : 'bg-[#a3262c] border-gray-200'
                }`}
                onClick={() => handleSelect(cert, i)}
              >
                <div className="w-10 h-10 relative overflow-hidden rounded">
                  <Image
                    src={cert.img}
                    alt={cert.title}
                    fill
                    className="object-contain p-1"
                  />
                </div>

                <div className="flex flex-col">
                  <div className="font-semibold text-sm text-black">{cert.title}</div>
                  <p className="text-xs text-black truncate max-w-[200px]">{cert.desc}</p>
                </div>
              </div>

              {/* MOBILE EXPANDED VIEW */}
              {expandedMobile === i && (
                <div className="md:hidden w-full mt-3 bg-white border shadow-xl rounded-lg p-4">
                  <h2 className="text-lg font-bold mb-2 text-center">{cert.title}</h2>

                  <div className="w-full bg-gray-100 rounded-md overflow-hidden p-4">
                    <Image
                      src={cert.img}
                      alt={cert.title}
                      width={1200}
                      height={800}
                      className="w-full h-auto object-contain"
                    />
                  </div>

                  <div className="p-2 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-700">
                      <strong>Description:</strong> {cert.desc}
                    </p>
                  </div>
                </div>
              )}

            </div>
          ))}
        </div>

        {/* DESKTOP RIGHT SIDE VIEW */}
        <div className="w-full hidden md:flex h-[70vh] pb-4 flex-col justify-between rounded-md overflow-hidden">

          {/* TITLE */}
          <h2 className="text-sm md:text-3xl text-yellow-600 font-bold text-center">
            {selectedCert.title}
          </h2>

          {/* IMAGE */}
          <div className="flex-1 flex items-center justify-center">
            <Image
              src={selectedCert.img}
              alt={selectedCert.title}
              width={1200}
              height={800}
              className="md:max-w-[400px] max-h-[300px] object-fill pb-1"
            />
          </div>

          {/* DESCRIPTION */}
         <div className="bg-gray-50 rounded-md max-w-2xl p-3 mx-auto">
  <p className="text-sm text-gray-700 text-center">
    <strong>Description:</strong> {selectedCert.desc}
  </p>
</div>

        </div>

      </div>
    </div>
  );
};

export default RecognitionHome;