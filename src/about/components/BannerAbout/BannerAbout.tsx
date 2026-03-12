

// import React from 'react';
// import Image from 'next/image';
// import { useState } from "react";
// import  SpinningLogos from "./Spiner";
// const BannerAbout = () => {
//     const [isPlaying, setIsPlaying] = useState(false);
//     return (
//         // OUTER CONTAINER: Parallax Background
//         <div
//             className="w-full h-auto bg-fixed  bg-cover bg-center z-20"
//             style={{ backgroundImage: "url('/about/whybg.webp')" }} // <-- your parallax image
//         >
//             {/* INNER CONTAINER: Dark Overlay and Content Centering */}
//             <div className="w-full h-full bg-black/30 py-5">
//                 <div className='w-11/12 md:w-10/12 mx-auto flex flex-col items-center justify-center'>

//                     {/* SECTION 1: TOP HEADING AND DESCRIPTION (Full Width) */}
//                     <div className='w-full mb-5 text-center'>
//                         <h2 className='text-white text-xl sm:text-4xl md:text-4xl leading-snug'>
//                             Why Students Choose Us to Groom their Career
//                         </h2>

//                     </div>

//                     {/* --- --- --- --- --- */}

//                     {/* SECTION 2: TWO-COLUMN GRID (Left: Image | Right: Video) */}
//                     <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-6 items-center'>

//                         {/* LEFT: Infographic Image */}
//                         <div className='col-span-1 flex items-center justify-center'>
//                             {/* <div className="rotate-wrapper md:h-[360px]">
//                                 <Image
//                                     src="/about/CirleHome.webp"
//                                     alt="Infographic: Why Students Choose Us"
//                                     width={500}
//                                     height={700}
//                                     className="rotate-animation object-contain"
//                                 />
//                             </div> */}
//                             <SpinningLogos/>
//                             {/* <div className="relative w-full h-[190px] sm:h-[190px] md:h-[320px] lg:h-[350px]">
//                                 <Image
//                                     src="/about/whychoose.svg"
//                                     alt="Infographic: Why Students Choose Us"
//                                     fill
//                                     className="rotate-animation object-contain "
//                                     priority
//                                 />
//                             </div> */}
//                         </div>


//                         {/* RIGHT: YouTube Video Box (Matching the style of the original image's video placeholder) */}
//                         <div className='col-span-1 w-full h-auto flex flex-col gap-6 items-start justify-start'>



//                             {/* Description */}
//                             <p className='text-white text-base md:text-sm leading-relaxed'>
//                                 Build a successful IT career with India’s trusted institute offering industry-aligned training, certifications, hands-on projects, expert mentoring, and 24/7 support.
//                             </p>

//                             {/* Video */}
//                             <div className='w-full max-w-lg '>
//                                 <div className="md:w-[400px] rounded-3xl border-4 border-red-600 shadow-xl overflow-hidden">
//                                     <iframe
//                                         width="70%"
//                                         height="220"
//                                         src="https://www.youtube.com/embed/4_qbhsjIB10"
//                                         title="YouTube video player"
//                                         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
//                                         allowFullScreen
//                                         className="w-full h-full min-h-[250px]"
//                                     ></iframe>
//                                 </div>
//                             </div>

//                         </div>


//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default BannerAbout;


// "use client";
// import Image from "next/image";
// import { Play } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { Description } from "@radix-ui/react-dialog";

// export default function ReviewCards() {
//     const router = useRouter();

//     const cards = [
//         {
//             id: 1,
//             thumbnail: "/course/LEARNING.webp",
//             name: "Learning Metarials",
//             Description: "Access comprehensive learning materials...",
//             type: "youtube",
//             youtubeUrl: "https://youtu.be/4_qbhsjIB10?si=MdHzEmTdG280XwKm",
//         },
//         {
//             id: 2,
//             thumbnail: "/course/RESUME.webp",
//             name: "Resume Writing",
//             Description: "Get expert guidance...",
//             type: "youtube",
//             youtubeUrl: "https://www.youtube.com/watch?v=DdT4zvcSVGg",
//         },
//         {
//             id: 3,
//             thumbnail: "/course/INTERVIEW.webp",
//             name: "Interview Preparation",
//             Description: "Prepare for interviews...",
//             type: "youtube",
//             youtubeUrl: "https://www.youtube.com/embed/UqK02jVAWCc?si=rGA-rItxZVR2IewR",
//         },
//         {
//             id: 4,
//             thumbnail: "/course/QUIZ.webp",
//             name: "Evaluate Your self",
//             Description: "Test your knowledge...",
//             type: "page",
//             youtubeUrl: "https://www.youtube.com/embed/bh5Xvp5TAso?si=RhUAc-f1zyxpPOsH",
//         }
//     ];


//     return (
//         <section className="w-full bg-[#f7f7f7] py-5">

            // <div className="text-center mb-12">
            //     <h2 className="text-[#7f1d1d] md:text-3xl text-2xl font-bold">
            //         Exclusive Program Benefits
            //     </h2>

            //     <svg
            //         className="mx-auto"
            //         width="340"
            //         height="6"
            //         viewBox="0 0 340 6"
            //         preserveAspectRatio="none"
            //     >
            //         <path
            //             d="M0 3 Q170 0 340 3 Q170 6 0 3 Z"
            //             fill="#7f1d1d"
            //         />
            //     </svg>
            // </div>
//             <div className="flex md:flex-wrap gap-6 md:justify-center overflow-x-auto md:overflow-visible px-4 md:px-0 scrollbar-hide">

//                 {cards.map((card) => (
//                     <div
//                         key={card.id}
//                         className="relative min-w-[290px] md:w-[290px] h-[160px] rounded-xl overflow-hidden shadow-lg"

//                     >
//                         <div className="relative w-full h-full">


//                             <iframe
//                                 className="absolute inset-0 w-full h-full"
//                                 src={`https://www.youtube.com/embed/${card.youtubeUrl?.includes("watch?v=")
//                                         ? card.youtubeUrl.split("v=")[1]?.split("&")[0]
//                                         : card.youtubeUrl?.split("/").pop()
//                                     }`}
//                                 title={card.name}
//                                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                                 allowFullScreen
//                             ></iframe>

//                         </div>
//                     </div>
//                 ))}

//             </div>
//         </section>
//     );
// }

"use client";

import Image from "next/image";
import { Play, X } from "lucide-react";
import { useState } from "react";

export default function ReviewCards() {
    const [activeVideo, setActiveVideo] = useState<string | null>(null);

    const cards = [
        {
            id: 1,
            name: "Learning Materials",
            youtubeId: "gqwNpfC7s1A",
        },
        {
            id: 2,
            name: "Resume Writing",
            youtubeId: "IHGhEOcBX-M",
        },
        {
            id: 3,
            name: "Interview Preparation",
            youtubeId: "8Aces_0hqQE",
        },
        {
            id: 4,
            name: "Interview Preparation",
            youtubeId: "AFpi6YMA2HM",
        }
    ];

    return (
        <>
            <section className="w-full bg-[#f7f7f7] py-10">

                {/* Heading */}
               
                                <div className="text-center mb-12">
                <h2 className="text-[#7f1d1d] md:text-3xl text-2xl font-bold">
                    Exclusive Program Benefits
                </h2>

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
                

                {/* Cards */}
                <div className="flex flex-wrap gap-6 justify-center px-4">

                    {cards.map((card) => (
                        <div
                            key={card.id}
                            className="relative w-[290px] h-[170px] rounded-xl overflow-hidden shadow-lg group cursor-pointer"
                            onClick={() => setActiveVideo(card.youtubeId)}
                        >
                            {/* Thumbnail */}
                            <Image
                                src={`https://img.youtube.com/vi/${card.youtubeId}/hqdefault.jpg`}
                                alt={card.name}
                                fill
                                className="object-cover"
                            />

                            {/* Dark overlay */}
                            {/* <div className="absolute inset-0  bg-black/40 group-hover:bg-black/60 transition duration-300" /> */}

                            {/* Play Button */}
                            <div className="absolute mt-20 inset-0 flex items-center justify-center">
                                <div className="bg-white/20 backdrop-blur-md p-4 rounded-full border border-white/40 
                                                hover:scale-110 transition duration-300">
                                    <Play className="text-white w-8 h-8 fill-white" />
                                </div>
                            </div>
                        </div>
                    ))}

                </div>
            </section>

            {/* 🎬 VIDEO POPUP MODAL */}
            {activeVideo && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div className="relative w-[90%] md:w-[700px] bg-white rounded-xl p-4">

                        <button
                            onClick={() => setActiveVideo(null)}
                            className="absolute top-0 right-2 text-red-600 text-3xl md:text-4xl"
                        >
                            ✕
                        </button>

                        <iframe
                            src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1&modestbranding=1&rel=0`}
                            title="YouTube video"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-[220px] md:h-[400px] rounded-lg"
                        />

                    </div>
                </div>
            )}
        </>
    );
}