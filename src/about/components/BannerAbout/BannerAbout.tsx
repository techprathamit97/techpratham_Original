

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

import { Play, Loader2 } from "lucide-react";
import { useState } from "react";

interface VideoCard {
  id: number;
  name: string;
  videoUrl: string;
  description: string;
  thumbnail?: string; // Optional thumbnail
}

export default function ReviewCards() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [loadingVideo, setLoadingVideo] = useState<boolean>(false);

  // AWS S3 Videos - All hosted on your S3 bucket
  const cards: VideoCard[] = [
    {
      id: 1,
      name: "Learning Materials",
      videoUrl: "https://content.techpratham.com/study_metrial.mp4",
      description: "Comprehensive study materials and resources",
      thumbnail: "/home/banner/learning.webp"
    },
    {
      id: 2,
      name: "Resume Writing",
      videoUrl: "https://content.techpratham.com/resume-buidling-session.mp4",
      description: "Professional resume building session",
      thumbnail: "/home/banner/resume.webp"
    },
    {
      id: 3,
      name: "Interview Preparation",
      videoUrl: "https://content.techpratham.com/interview_preparation.mp4",
      description: "Master your interview skills",
      thumbnail: "/home/banner/interview.webp"
    },
    {
      id: 4,
      name: "Live Project Demo",
      videoUrl: "https://content.techpratham.com/live_project_demonstration.mp4",
      description: "Real-world project demonstrations",
      thumbnail: "/home/banner/videLiveProject.webp"
      // No thumbnail for 4th video
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
          >
            <path
              d="M0 3 Q170 0 340 3 Q170 6 0 3 Z"
              fill="#7f1d1d"
            />
          </svg>
        </div>

        {/* Video Cards */}
        <div className="flex flex-wrap gap-6 justify-center px-4">
          {cards.map((card) => (
            <div
              key={card.id}
              className="relative w-[290px] h-[170px] rounded-xl overflow-hidden shadow-lg cursor-pointer group transform transition-all duration-300 hover:scale-105"
              onClick={() => handleVideoClick(card.videoUrl)}
            >
              {/* Thumbnail Image or Video Preview */}
              {card.thumbnail ? (
                // Use thumbnail image for first 3 videos
                <img
                  src={card.thumbnail}
                  alt={card.name}
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                />
              ) : (
                // Use video frame for 4th video (no thumbnail)
                <video
                  src={card.videoUrl}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  muted
                  preload="metadata"
                />
              )}

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-all duration-300" />

              {/* Play Button - Moved down */}
              <div className="absolute inset-0 flex items-center justify-center mt-15">
                <div className="bg-white/20 backdrop-blur-md p-4 rounded-full border border-white/40 group-hover:scale-110 group-hover:bg-white/30 transition-all duration-300 shadow-2xl">
                  <Play className="text-white w-8 h-8 fill-white" />
                </div>
              </div>

              {/* Video Info - Removed name, kept only description */}
              <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                <p className="text-xs text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {card.description}
                </p>
              </div>

              {/* Duration Badge (Optional) */}
              <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                HD
              </div>
            </div>
          ))}
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