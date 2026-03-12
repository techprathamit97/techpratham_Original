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
//             youtubeUrl: "https://youtu.be/gqwNpfC7s1A?si=rCHDVSwdRV8aRtWJ",
//         },
//         {
//             id: 2,
//             thumbnail: "/course/RESUME.webp",
//             name: "Resume Writing",
//             Description: "Get expert guidance...",
//             type: "youtube",
//             youtubeUrl: "https://www.youtube.com/embed/UqK02jVAWCc?si=rGA-rItxZVR2IewR",
//         },
//         {
//             id: 3,
//             thumbnail: "/course/INTERVIEW.webp",
//             name: "Interview Preparation",
//             Description: "Prepare for interviews...",
//             type: "youtube",
//             youtubeUrl: "https://www.youtube.com/embed/bh5Xvp5TAso?si=RhUAc-f1zyxpPOsH",
//         },
//         {
//             id: 4,
//             thumbnail: "/course/QUIZ.webp",
//             name: "Evaluate Your self",
//             Description: "Test your knowledge...",
//             type: "page",
//             quizLink: "#",
//             materialLink: "#",
//         }
//     ];


//     return (
//         <section className="w-full bg-[#f7f7f7] py-5">

//             <div className="text-center mb-12">
//                 <h2 className="text-[#7f1d1d] md:text-3xl text-2xl font-bold">
//                     Additional Program Highlights
//                 </h2>

//                 <svg
//                     className="mx-auto"
//                     width="340"
//                     height="6"
//                     viewBox="0 0 340 6"
//                     preserveAspectRatio="none"
//                 >
//                     <path
//                         d="M0 3 Q170 0 340 3 Q170 6 0 3 Z"
//                         fill="#7f1d1d"
//                     />
//                 </svg>
//             </div>
//             <div className="flex flex-wrap gap-6 justify-center">

//                 {cards.map((card) => (
//                     <div
//                         key={card.id}
//                         className="relative w-[290px] h-[160px] rounded-xl overflow-hidden shadow-lg"
//                     >
//                         <Image
//                             src={card.thumbnail}
//                             alt={card.name}
//                             fill
//                             className="object-fill"
//                         />

//                         <div className="absolute inset-0 bg-black/50 flex flex-col justify-between">
//                             {card.type === "page" && (
//                                 <div className="flex flex-col items-center justify-center h-full gap-4">

//                                     {/* IMAGE */}
//                                     {/* <img
//                                     src={card.thumbnail}
//                                     alt=""
//                                     className="w-[180px] object-contain mx-auto"
//                                 /> */}

//                                     {/* BUTTON */}
//                                     <button
//                                         onClick={() => router.push(card.materialLink!)}
//                                         className="w-[220px] py-2 bg-yellow-400
//       hover:bg-orange-500/20 border border-orange-300/30 
//       hover:border-orange-300/50 text-black rounded-full 
//       font-semibold text-lg transition-all duration-300 
//       hover:scale-105 backdrop-blur-sm"
//                                     >
//                                         Quiz
//                                     </button>
//                                     <div className="absolute bottom-1 left-0 right-0 text-center px-1">
//                                         <h3 className="text-gray-100 font-bold text-lg leading-tight">
//                                             {card.name}
//                                         </h3>

//                                         <p className="text-gray-200  text-xs mt-1">
//                                             {card.Description}
//                                         </p>
//                                     </div>

//                                 </div>
//                             )}


//                             {card.type === "youtube" && (
//                                 <div className="relative w-full h-full">

//                                     {/* YOUTUBE EMBED */}
//                                     <iframe
//                                         className="absolute inset-0 w-full h-full"
//                                         src={`https://www.youtube.com/embed/${card.youtubeUrl?.split("v=")[1]?.split("&")[0] ||
//                                             card.youtubeUrl?.split("/").pop()
//                                             }`}
//                                         title="YouTube video"
//                                         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                                         allowFullScreen
//                                     ></iframe>

//                                     {/* TEXT AREA */}


//                                 </div>
//                             )}


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
                <div className="text-center mb-10">
                    <h2 className="text-[#7f1d1d] md:text-3xl text-2xl font-bold">
                        Additional Program Highlights
                    </h2>
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