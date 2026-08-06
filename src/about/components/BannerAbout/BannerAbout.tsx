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
      <section className="w-full bg-[#fdfbfb] py-10">
        
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