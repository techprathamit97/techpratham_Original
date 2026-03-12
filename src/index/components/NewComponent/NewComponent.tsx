
"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";

/* ================= TYPES ================= */
interface SectionProps {
  id?: string;
}
interface EventItem {
  _id: string;
  type: "video" | "placement" | "hiring";
  videoUrl?: string;
  image?: string;
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

/* ================= COMPONENT ================= */

export default function PromoSection({ id }: SectionProps) {
  const iframeRefs = useRef<HTMLIFrameElement[]>([]);

  const [videos, setVideos] = useState<string[]>([]);
  const [placements, setPlacements] = useState<string[]>([]);
  const [hirings, setHirings] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH DATA ================= */

 useEffect(() => {
  const load = async () => {
    const res = await fetch("/api/event", {
      cache: "force-cache",
    });

    const data: EventItem[] = await res.json();

    setVideos(
      data
        .filter((i) => i.type === "video" && i.videoUrl)
        .map((i) => `${toYoutubeEmbed(i.videoUrl!)}?enablejsapi=1`)
    );

    setPlacements(
      data
        .filter((i) => i.type === "placement" && i.image)
        .map((i) => i.image!)
    );

    setHirings(
      data
        .filter((i) => i.type === "hiring" && i.image)
        .map((i) => i.image!)
    );

    setLoading(false);
  };

  load();
}, []);


  /* ================= PAUSE YT ================= */


  const pauseAllVideos = () => {
    iframeRefs.current.forEach((iframe) => {
      iframe?.contentWindow?.postMessage(
        JSON.stringify({
          event: "command",
          func: "pauseVideo",
          args: [],
        }),
        "*"
      );
    });
  };

  /* ================= UI ================= */

  return (
    <section id={id} className="w-full bg-[#b30000] py-14 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-start">

          {/* ================= LEFT – VIDEO ================= */}
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

              {!loading && videos.length > 0 && (

                <Swiper
                  modules={[Autoplay, Navigation]}
                  loop
                  speed={800}
                  autoplay={false}
                  navigation={{
                    prevEl: ".video-prev",
                    nextEl: ".video-next",
                  }}
                  onSlideChange={pauseAllVideos}   // 🔥 MAIN FIX
                  className="h-full w-full"
                >
                  {videos.map((url, index) => (
                    <SwiperSlide key={index}>
                      <iframe
                        ref={(el) => {
                          if (el) iframeRefs.current[index] = el;
                        }}
                        src={url}
                        title={`Knowledge Center video ${index + 1}`}
                        className="w-full h-full"
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                      />

                    </SwiperSlide>
                  ))}
                </Swiper>
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
              {!loading && placements.length > 0 && (
                <Swiper
                  direction="vertical"
                  loop
                  autoplay={{ delay: 1500 }}
                  speed={900}
                  modules={[Autoplay]}
                  className="h-full"
                >
                  {placements.map((img, index) => (
                    <SwiperSlide key={index}>
                      <Image
                        src={img}
                        alt="Placement"
                        fill
                        className="object-contain md:object-cover"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}

              <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-[#b30000] to-transparent z-20 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-[#b30000] to-transparent z-20 pointer-events-none" />
            </div>
          </div>

          {/* ================= RIGHT – HIRING ================= */}
          <div className="md:col-span-1">
            <h2 className="text-red-900 bg-white rounded-xl border px-4 py-2 mb-4 font-semibold text-center">
              We’re Hiring
            </h2>

            <div className="h-[220px] md:h-[260px] bg-[#b30000] rounded-xl overflow-hidden">
              {!loading && hirings.length > 0 && (
                <Swiper autoplay={{ delay: 2500 }} loop modules={[Autoplay]} className="h-full">
                  {hirings.map((img, index) => (
                    <SwiperSlide key={index}>
                      <Image
                        src={img}
                        alt="Hiring"
                        width={300}
                        height={260}
                        className="w-full h-full object-contain"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
