
"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";

/* ================= CONSTANTS ================= */

// Video sources - Instagram Reels for inline playback
const VIDEO_SOURCES = [
  {
    type: 'instagram',
    url: "https://www.instagram.com/reel/DW8ONcLjBuG/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
    embedUrl: "https://www.instagram.com/p/DW8ONcLjBuG/embed/"
  },
  {
    type: 'instagram',
    url: "https://www.instagram.com/reel/DXDyJoBDGx2/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
    embedUrl: "https://www.instagram.com/p/DXDyJoBDGx2/embed/"
  },
  {
    type: 'instagram',
    url: "https://www.instagram.com/reel/DWgoZ9fDACa/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
    embedUrl: "https://www.instagram.com/p/DWgoZ9fDACa/embed/"
  },
  {
    type: 'instagram',
    url: "https://www.instagram.com/reel/DV3LObgDEGB/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
    embedUrl: "https://www.instagram.com/p/DV3LObgDEGB/embed/"
  },
  {
    type: 'instagram',
    url: "https://www.instagram.com/reel/DVvvZLzjCLL/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
    embedUrl: "https://www.instagram.com/p/DVvvZLzjCLL/embed/"
  },
  {
    type: 'instagram',
    url: "https://www.instagram.com/reel/DVqcYfMDFPt/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
    embedUrl: "https://www.instagram.com/p/DVqcYfMDFPt/embed/"
  }
];

/* ================= TYPES ================= */
interface SectionProps {
  id?: string;
  initialEvents?: EventItem[];
}
interface EventItem {
  _id: string;
  type: "video" | "placement" | "hiring";
  videoUrl?: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

/* ================= HELPERS ================= */

// 🔥 Converts ANY YouTube URL to EMBED URL
const toYoutubeEmbed = (url: string) => {
  if (url.includes("embed")) return url;

  if (url.includes("shorts/")) {
    const id = url.split("shorts/")[1].split("?")[0];
    return `https://www.youtube.com/embed/${id}`;
  }

  if (url.includes("watch?v=")) {
    const id = url.split("watch?v=")[1].split("&")[0];
    return `https://www.youtube.com/embed/${id}`;
  }

  if (url.includes("youtu.be/")) {
    const id = url.split("youtu.be/")[1].split("?")[0];
    return `https://www.youtube.com/embed/${id}`;
  }

  return url;
};

// Check if image was uploaded or updated within last 5 days
const isNewImage = (createdAt?: string, updatedAt?: string) => {
  if (!createdAt && !updatedAt) return false;

  const today = new Date();

  // Check createdAt
  if (createdAt) {
    const uploadDate = new Date(createdAt);
    const diffTime = Math.abs(today.getTime() - uploadDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays <= 5) return true;
  }

  // Check updatedAt
  if (updatedAt) {
    const updateDate = new Date(updatedAt);
    const diffTime = Math.abs(today.getTime() - updateDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays <= 5) return true;
  }

  return false;
};

/* ================= COMPONENT ================= */

export default function PromoSection({ id, initialEvents = [] }: SectionProps) {
  const iframeRefs = useRef<HTMLIFrameElement[]>([]);

  const [videos, setVideos] = useState<string[]>([]);
  const [placements, setPlacements] = useState<string[]>([]);
  const [hirings, setHirings] = useState<string[]>([]);
  const [hiringDates, setHiringDates] = useState<{ createdAt: string; updatedAt: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

  /* ================= MEMOIZED VALUES ================= */
  const hasPlacements = useMemo(() => placements.length > 0, [placements]);
  const hasHirings = useMemo(() => hirings.length > 0, [hirings]);

  /* ================= FETCH DATA ================= */

  useEffect(() => {
    // Process initial server-side data if available
    if (initialEvents.length > 0) {
      const videoItems: string[] = [];
      const placementItems: string[] = [];
      const hiringItems: string[] = [];
      const hiringDateItems: { createdAt: string; updatedAt: string }[] = [];

      initialEvents.forEach((item) => {
        if (item.type === "video" && item.videoUrl) {
          videoItems.push(`${toYoutubeEmbed(item.videoUrl)}?enablejsapi=1`);
        } else if (item.type === "placement" && item.image) {
          placementItems.push(item.image);
        } else if (item.type === "hiring" && item.image) {
          hiringItems.push(item.image);
          hiringDateItems.push({
            createdAt: item.createdAt || '',
            updatedAt: item.updatedAt || ''
          });
        }
      });

      setVideos(videoItems);
      setPlacements(placementItems);
      setHirings(hiringItems);
      setHiringDates(hiringDateItems);
      return;
    }

    // Fallback: fetch client-side if no initial data
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/event", {
          cache: "no-store",
          next: { revalidate: 0 }
        });

        if (!res.ok) {
          throw new Error('Failed to fetch events');
        }

        const data: EventItem[] = await res.json();

        const videoItems: string[] = [];
        const placementItems: string[] = [];
        const hiringItems: string[] = [];
        const hiringDateItems: { createdAt: string; updatedAt: string }[] = [];

        data.forEach((item) => {
          if (item.type === "video" && item.videoUrl) {
            videoItems.push(`${toYoutubeEmbed(item.videoUrl)}?enablejsapi=1`);
          } else if (item.type === "placement" && item.image) {
            placementItems.push(item.image);
          } else if (item.type === "hiring" && item.image) {
            hiringItems.push(item.image);
            hiringDateItems.push({
              createdAt: item.createdAt || '',
              updatedAt: item.updatedAt || ''
            });
          }
        });

        setVideos(videoItems);
        setPlacements(placementItems);
        setHirings(hiringItems);
        setHiringDates(hiringDateItems);
      } catch (error) {
        console.error('Error fetching events:', error);
        setVideos([]);
        setPlacements([]);
        setHirings([]);
        setHiringDates([]);
      } finally {
        setLoading(false);
      }
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  /* ================= UI ================= */

  return (
    <section id={id} className="w-full bg-[#b30000]  overflow-hidden">
      <div className="border  py-5 m-2 p-2">
        <div className="max-w-6xl  mx-auto  px-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-start">

            {/* ================= LEFT – VIDEO CONTENT ================= */}
            <div className="md:col-span-1">
              <h2 className="text-red-900 bg-white rounded-xl border px-4 py-2 mb-4 font-semibold text-center">
                Knowledge Center
              </h2>

              <div className="relative h-[220px] md:h-[280px] bg-black rounded-xl overflow-hidden">

                <button className="video-prev absolute left-1 top-1/2 -translate-y-1/2 z-20 bg-white/90 p-1 rounded-full" aria-label="Previous video">
                  <ChevronLeft size={18} />
                </button>

                <button className="video-next absolute right-1 top-1/2 -translate-y-1/2 z-20 bg-white/90 p-1 rounded-full" aria-label="Next video">
                  <ChevronRight size={18} />
                </button>

                {VIDEO_SOURCES.length > 0 && (
                  <Swiper
                    modules={[Autoplay, Navigation]}
                    loop
                    speed={800}
                    autoplay={{ delay: 4000 }}
                    navigation={{
                      prevEl: ".video-prev",
                      nextEl: ".video-next",
                    }}
                    className="h-full w-full"
                  >
                    {VIDEO_SOURCES.map((video, index) => (
                      <SwiperSlide key={`video-${index}`}>
                        {video.type === 'youtube' ? (
                          // YouTube Video Embed
                          <iframe
                            src={`${toYoutubeEmbed(video.url)}?enablejsapi=1`}
                            className="w-full h-full border-0"
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                            loading="lazy"
                          />
                        ) : video.type === 'video' ? (
                          // Local Video File
                          <video
                            className="w-full h-full object-cover"
                            controls
                            preload="metadata"
                          >
                            <source src={video.url} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        ) : (
                          // Instagram Reel Embed - Try to embed, fallback to click-to-open
                          <div className="w-full h-full relative">
                            <iframe
                              src={video.embedUrl}
                              className="w-full h-full border-0"
                              allow="autoplay; encrypted-media"
                              allowFullScreen
                              loading="lazy"
                              style={{
                                border: 'none',
                                background: 'transparent'
                              }}

                            />

                            {/* Invisible overlay for fallback click */}
                            <div
                              className="absolute inset-0 bg-transparent cursor-pointer opacity-0 hover:opacity-10 hover:bg-white transition-opacity"
                              onClick={() => window.open(video.url, '_blank')}
                              title=""
                            />
                          </div>
                        )}
                      </SwiperSlide>
                    ))}
                  </Swiper>
                )}

                {VIDEO_SOURCES.length === 0 && (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-white text-sm">No videos available</div>
                  </div>
                )}
              </div>
            </div>

            {/* ================= MIDDLE – PLACEMENTS ================= */}
            <div className="md:col-span-3">
              <div className="flex justify-center mb-4">
                <h2 className="inline-block text-red-900 bg-white rounded-xl border px-6 py-2 font-semibold">
                  Recently Placed Candidates
                </h2>
              </div>

              <div className="relative h-[180px] md:h-[300px] bg-red-600 rounded-2xl overflow-hidden">
                {!loading && hasPlacements && (
                  <Swiper
                    direction="vertical"
                    loop
                    autoplay={{ delay: 1500 }}
                    speed={900}
                    modules={[Autoplay]}
                    className="h-full"
                  >
                    {placements.map((img, index) => (
                      <SwiperSlide key={`placement-${index}`}>
                        <Image
                          src={img}
                          alt={`Placement ${index + 1}`}
                          fill
                          className="object-contain md:object-cover"
                          sizes="(max-width: 768px) 100vw, 60vw"
                          priority={index === 0}
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>

                )}

                {loading && (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-white text-sm">Loading placements...</div>
                  </div>
                )}

                {!loading && !hasPlacements && (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-white text-sm">No placements available</div>
                  </div>
                )}

                <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-[#b30000] to-transparent z-20 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-[#b30000] to-transparent z-20 pointer-events-none" />
              </div>
            </div>

            {/* ================= RIGHT – HIRING ================= */}
            <div className="md:col-span-1">
              <h2 className="text-red-900 bg-white rounded-xl border px-4 py-2 mb-4 font-semibold text-center flex items-center justify-center gap-2">
                Latest Hiring
                <img
                  src="/home/hero/logo/new_red.gif"
                  alt="NEW"
                  className="w-10 bg-white h-5 object-contain"
                />
              </h2>

              <div className="h-[220px] md:h-[290px] bg-[#b30000] rounded-xl ">
                {!loading && hasHirings && (
                  <Swiper autoplay={{ delay: 2500 }} loop modules={[Autoplay]} className="h-full">
                    {hirings.map((img, index) => (
                      <SwiperSlide key={`hiring-${index}`}>
                        <div
                          onClick={() => {
                            setSelectedImage(img);
                            setSelectedImageIndex(index);
                          }}
                          className="cursor-pointer w-full h-full relative"
                        >
                          {isNewImage(hiringDates[index]?.createdAt, hiringDates[index]?.updatedAt) && (
                            <div className="absolute top-1 right-2 z-10">
                              <img
                                src="/home/hero/logo/new_red.gif"
                                alt="NEW"
                                className="w-10 h-6 bg-white rounded-full object-contain"
                              />
                            </div>
                          )}
                          <div className="w-full h-full">
                            <Image
                              src={img}
                              alt={`Hiring ${index + 1}`}
                              width={300}
                              height={400}
                              className="w-full h-full md:object-fill object-contain"
                            />
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                )}

                {loading && (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-white text-sm">Loading...</div>
                  </div>
                )}

                {!loading && !hasHirings && (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-white text-sm">No hiring posts</div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ================= IMAGE POPUP MODAL ================= */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative bg-white rounded-2xl shadow-2xl max-w-[400px] w-full max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 z-10 text-gray-700 hover:text-gray-900 transition-colors bg-white rounded-full p-1 shadow-lg"
              onClick={() => setSelectedImage(null)}
              aria-label="Close popup"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Left Arrow */}
            {hirings.length > 1 && (
              <button
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-100 text-gray-700 rounded-full p-2 shadow-lg transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  const newIndex = selectedImageIndex === 0 ? hirings.length - 1 : selectedImageIndex - 1;
                  setSelectedImageIndex(newIndex);
                  setSelectedImage(hirings[newIndex]);
                }}
                aria-label="Previous image"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            {/* Right Arrow */}
            {hirings.length > 1 && (
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-100 text-gray-700 rounded-full p-2 shadow-lg transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  const newIndex = selectedImageIndex === hirings.length - 1 ? 0 : selectedImageIndex + 1;
                  setSelectedImageIndex(newIndex);
                  setSelectedImage(hirings[newIndex]);
                }}
                aria-label="Next image"
              >
                <ChevronRight size={24} />
              </button>
            )}

            <div className="p-6 relative">
              {isNewImage(hiringDates[selectedImageIndex]?.createdAt, hiringDates[selectedImageIndex]?.updatedAt) && (
                <div className="absolute top-0 left-0 z-10">
                  <img
                    src="/home/hero/logo/new_red.gif"
                    alt="NEW"
                    className="w-12 h-7  object-contain"
                  />
                </div>
              )}
              <Image
                src={selectedImage}
                alt="Hiring post"
                width={800}
                height={800}
                className="w-full h-full object-contain rounded-lg"
                sizes="(max-width: 768px) 100vw, 800px"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
