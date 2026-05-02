import React, { useState } from "react";
import { Play, Loader2 } from "lucide-react";
import SeoFaqPopup from "../SeoFaqPopup/SeoFaqPopup";

interface SectionProps {
  id?: string;
}

const IntroSection = ({ id, course }: any) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const videoUrl = "https://content.techpratham.com/study_tips.mp4";

  const handlePlayClick = () => {
    setIsLoading(true);
    setIsPlaying(true);
  };

  const handleVideoLoad = () => {
    setIsLoading(false);
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
  };

  return (
    <section id={id} className="w-full py-6">
      <div className=" m-2 border-2 border-gray-200 p-4 md:p-6">

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 w-full">

          {/* Left Content */}
          <div className="md:col-span-3 flex flex-col gap-4 w-full">

            <div className="flex items-center gap-3 bg-white md:px-6 px-3 py-2 rounded-md shadow-sm border border-gray-200">
              <h2 className="text-base md:text-lg font-bold text-gray-800 uppercase">
                About&nbsp;
                <span
                  dangerouslySetInnerHTML={{ __html: course.title }}
                />
              </h2>
            </div>

            <div className="w-full text-base text-justify font-normal text-gray-600">
              <div
                dangerouslySetInnerHTML={{ __html: course.description }}
              />
            </div>

            {/* SEO FAQ Button */}
            <div className="flex justify-start">
              <SeoFaqPopup course={course} />
            </div>
          </div>

          {/* Right Video */}
          <div className="md:col-span-2 w-full flex items-center justify-center">
            <div className="w-full aspect-video relative rounded-lg overflow-hidden shadow-lg">

              {!isPlaying ? (
                // Video Thumbnail with Play Button
                <div
                  className="relative w-full h-full cursor-pointer group"
                  onClick={handlePlayClick}
                >
                  {/* Thumbnail Image */}
                  <img
                    src="/home/banner/videothumb.webp"
                    alt="Video Thumbnail"
                    className="w-full h-full object-cover"
                  />

                  {/* Dark Overlay */}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-all duration-300" />

                  {/* Loading Spinner */}
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                      <Loader2 className="w-8 h-8 text-white animate-spin" />
                    </div>
                  )}

                  {/* Play Button */}
                  {!isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white/20 backdrop-blur-md p-4 rounded-full border border-white/40 group-hover:scale-110 transition-all duration-300 shadow-2xl">
                        <Play className="text-white w-8 h-8 fill-white" />
                      </div>
                    </div>
                  )}

                  {/* Video Title */}

                </div>
              ) : (
                // Actual Video Player
                <div className="relative w-full h-full">
                  <video
                    src={videoUrl}
                    controls
                    autoPlay
                    className="w-full h-full object-cover"
                    onLoadStart={() => setIsLoading(true)}
                    onCanPlay={handleVideoLoad}
                    onEnded={handleVideoEnd}
                    onError={() => {
                      setIsLoading(false);
                      setIsPlaying(false);
                      alert('Error loading video. Please try again.');
                    }}
                    preload="metadata"
                    playsInline
                  >
                    <source src={videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>

                  {/* Close Button */}
                  <button
                    onClick={() => setIsPlaying(false)}
                    className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-all duration-200 z-10"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default IntroSection;