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

import { Play, Loader2 } from "lucide-react";
import { useState } from "react";

interface VideoCard {
  id: number;
  number: string;
  heading: string; // Big white heading on the thumbnail (supports \n for 2 lines)
  label: string; // Red highlighted label on the thumbnail
  title: string; // Caption title below the card
  videoUrl: string;
}

export default function ReviewCards() {
    const [activeVideo, setActiveVideo] = useState<string | null>(null);
    const [loadingVideo, setLoadingVideo] = useState<boolean>(false);

    // AWS S3 Videos - Same as BannerAbout component
    const cards: VideoCard[] = [
        {
            id: 1,
            number: "01",
            heading: "LEARNING",
            label: "MATERIAL GUIDE",
            title: "Learning Material Guide",
            videoUrl: "https://content.techpratham.com/study_metrial.mp4",
        },
        {
            id: 2,
            number: "02",
            heading: "HOW TO\nMAKE",
            label: "RESUME",
            title: "How to Make Resume",
            videoUrl: "https://content.techpratham.com/resume-buidling-session.mp4",
        },
        {
            id: 3,
            number: "03",
            heading: "INTERVIEW",
            label: "PREPARATIONS",
            title: "Interview Preparations",
            videoUrl: "https://content.techpratham.com/interview_preparation.mp4",
        },
        {
            id: 4,
            number: "04",
            heading: "REAL\nWORLD",
            label: "PROJECT GUIDE",
            title: "Real World Project Guide",
            videoUrl: "https://content.techpratham.com/live_project_demonstration.mp4",
        },
    ];

    const handleVideoClick = (videoUrl: string): void => {
        setLoadingVideo(true);
        setActiveVideo(videoUrl);
    };

    const handleVideoLoad = (): void => {
        setLoadingVideo(false);
    };

    const closeVideo = (): void => {
        setActiveVideo(null);
        setLoadingVideo(false);
    };

    return (
        <>
            <section className="w-full bg-white">
                <div className="mx-auto w-11/12 max-w-7xl p-2 py-8">
                    {/* Heading */}
                    <div className="text-center mb-8 flex flex-col items-center">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-[#ff2a3b]">
                            Additional Program Highlights
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
                                fill="#ff2a3b"
                            />
                        </svg>
                    </div>

                    {/* Video Cards - horizontal scroll on mobile, 4-up grid on desktop */}
                    <div className="flex md:grid md:grid-cols-4 gap-5 md:gap-6 overflow-x-auto md:overflow-visible px-4 pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden">
                        {cards.map((card) => (
                            <div
                                key={card.id}
                                className="flex-shrink-0 w-[260px] md:w-auto snap-start flex flex-col"
                            >
                                {/* Designed thumbnail (no image files) */}
                                <div
                                    onClick={() => handleVideoClick(card.videoUrl)}
                                    className="group relative w-full aspect-[16/9] rounded-xl overflow-hidden border-2 border-[#ff2a3b] bg-[#1b1340] cursor-pointer shadow-md transition-transform duration-300 hover:scale-[1.03] hover:shadow-xl"
                                >
                                    {/* Red diagonal stripe */}
                                    <div className="absolute top-0 right-[-30px] h-full w-[55%] bg-[#ff2a3b] -skew-x-12" />

                                    {/* Navy arch sitting on the red */}
                                    <div className="absolute bottom-0 right-6 w-[70px] h-[82px] bg-[#1b1340] rounded-t-full" />

                                    {/* Logo */}
                                    <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
                                        <span className="bg-white text-[#1b1340] text-[9px] font-extrabold rounded px-1 py-0.5 leading-none">
                                            tp
                                        </span>
                                        <span className="text-white text-[11px] font-medium tracking-wide">
                                            tech pratham
                                        </span>
                                    </div>

                                    {/* Title + red label */}
                                    <div className="absolute top-11 left-3 right-[38%] z-10">
                                        <h3 className="text-white font-extrabold text-lg leading-[1.1] uppercase whitespace-pre-line">
                                            {card.heading}
                                        </h3>
                                        <span className="inline-block bg-[#ff2a3b] text-white text-[11px] font-bold px-2 py-1 mt-2 uppercase tracking-wide">
                                            {card.label}
                                        </span>
                                    </div>

                                    {/* Dots */}
                                    <div className="absolute bottom-3 left-3 flex gap-1.5 z-10">
                                        {[0, 1, 2, 3].map((d) => (
                                            <span key={d} className="w-1.5 h-1.5 rounded-full bg-white/50" />
                                        ))}
                                    </div>

                                    {/* Play button */}
                                    <div className="absolute inset-0 flex items-center justify-center z-20">
                                        <div className="relative">
                                            <div className="absolute inset-0 rounded-full bg-[#1b1340]/40 blur-md scale-150" />
                                            <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-white to-gray-300 flex items-center justify-center shadow-xl transition-transform duration-300 group-hover:scale-110">
                                                <Play className="w-6 h-6 text-[#ff2a3b] fill-[#ff2a3b] ml-0.5" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Caption */}
                                <div className="text-center mt-3">
                                    <p className="text-[#ff2a3b] font-bold italic text-lg">{card.number}</p>
                                    <h4 className="text-[#1b1340] font-bold text-base mt-0.5">{card.title}</h4>
                                    <button
                                        type="button"
                                        onClick={() => handleVideoClick(card.videoUrl)}
                                        className="text-[#ff2a3b] italic text-sm font-medium mt-1 hover:underline cursor-pointer"
                                    >
                                        Watch Now →
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 🎬 VIDEO MODAL - Enhanced for AWS S3 */}
            {activeVideo && (
                <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="relative w-[95%] md:w-[900px] max-w-6xl bg-black rounded-xl overflow-hidden shadow-2xl">

                        {/* Loading Spinner */}
                        {loadingVideo && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20">
                                <div className="flex flex-col items-center gap-3">
                                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                                    <p className="text-white text-sm">Loading video...</p>
                                </div>
                            </div>
                        )}

                        {/* Close Button */}
                        <button
                            onClick={closeVideo}
                            className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-all duration-200 z-30"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* AWS S3 VIDEO PLAYER */}
                        <video
                            src={activeVideo}
                            controls
                            autoPlay
                            className="w-full h-[300px] md:h-[500px] bg-black"
                            onLoadStart={() => setLoadingVideo(true)}
                            onCanPlay={handleVideoLoad}
                            onError={() => {
                                setLoadingVideo(false);
                                alert('Error loading video. Please try again.');
                            }}
                            preload="metadata"
                            controlsList="nodownload"
                            playsInline
                        >
                            <source src={activeVideo} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>

                        {/* Video Info Bar */}
                        
                    </div>
                </div>
            )}
        </>
    );
}