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
  name: string;
  videoUrl: string;
  description: string;
  thumbnail?: string; // Optional thumbnail
}

export default function ReviewCards() {
    const [activeVideo, setActiveVideo] = useState<string | null>(null);
    const [loadingVideo, setLoadingVideo] = useState<boolean>(false);

    // AWS S3 Videos - Same as BannerAbout component
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
            <section className="w-full bg-[#f7f7f7]">
                <div className="m-2 p-2 py-5 border-2">
                    {/* Heading */}
                    <div className="text-center mb-5 flex flex-col items-center">
                        <h2 className="text-3xl md:text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#CD4647] to-[#7F3B40]">
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
                                fill="#CD4647"
                            />
                        </svg>
                    </div>

                    {/* Video Cards */}
                    <div className="flex flex-wrap gap-6 justify-center px-4">
                        {cards.map((card) => (
                            <div
                                key={card.id}
                                className="relative w-[270px] h-[170px] rounded-xl overflow-hidden shadow-lg cursor-pointer group transform transition-all duration-300 hover:scale-105"
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
                                <div className="absolute inset-0 flex items-center justify-center mt-8">
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