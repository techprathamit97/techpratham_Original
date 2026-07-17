'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Autoplay } from 'swiper/modules';
import Image from 'next/image';
import { useRef, useEffect, useState } from 'react';

import 'swiper/css';
import 'swiper/css/effect-coverflow';

// Fallback images if backend is unavailable
const fallbackImages = [
  "/achiv/1.webp",
  "/achiv/2.webp",
  "/achiv/3.webp",
  "/achiv/4.webp",
  "/achiv/5.webp",
  "/achiv/6.webp",
  "/achiv/7.webp",
  "/achiv/8.webp",
  "/achiv/9.webp",
  "/achiv/10.webp",
];

interface ReviewImage {
  _id: string;
  imageUrl: string;
  altText: string;
  displayOrder: number;
  fileKey: string;
}

export default function ThreeDCarousel() {
  const swiperRef = useRef<any>(null);
  const [reviewImages, setReviewImages] = useState<ReviewImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Start autoplay immediately when swiper is ready
  useEffect(() => {
    if (swiperRef.current?.autoplay) {
      swiperRef.current.autoplay.start();
    }
  }, []);

  // Fetch review images from backend
  useEffect(() => {
    const fetchReviewImages = async () => {
      try {
        setLoading(true);
        console.log('Fetching review images from /api/review-images...');
        const response = await fetch('/api/review-images');
        
        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('API error response:', errorText);
          throw new Error(`Failed to fetch review images: ${response.status}`);
        }

        const data = await response.json();
        console.log('API response data:', data);
        console.log('Data type:', typeof data);
        console.log('Is array:', Array.isArray(data));
        console.log('Data length:', data?.length);
        
        if (data && Array.isArray(data) && data.length > 0) {
          console.log('Using backend review images:', data.length, 'images');
          setReviewImages(data);
          setError(false);
        } else {
          // No images in backend, use fallback
          console.log('No review images found, using fallback images');
          setError(true);
        }
      } catch (err) {
        console.error('Error fetching review images:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchReviewImages();
  }, []);

  // Determine which images to display
  const imagesToDisplay = !error && reviewImages.length > 0 
    ? reviewImages.map(img => ({
        src: img.imageUrl,
        alt: img.altText
      }))
    : fallbackImages.map((img) => ({
        src: img,
        alt: "Student review testimonial"
      }));

  // Handle image click to open in full screen
 
const middleIndex = Math.floor(imagesToDisplay.length / 2);
  // Handle modal close
  

  // Lock body scroll when modal is open
 

  return (
    <div
      className="w-full flex flex-col items-center py-2"
      onMouseEnter={() => swiperRef.current?.autoplay?.stop()}
      onMouseLeave={() => swiperRef.current?.autoplay?.start()}
    >
      <div className="text-center flex flex-col items-center w-full">
        <h2 className="text-xl md:text-[25px] my-2 text-white font-semibold">
          Our Learner Voice
        </h2>
        {loading && (
          <p className="text-gray-400 text-sm">Loading reviews...</p>
        )}
        
      </div>
        
     <Swiper
  onSwiper={(swiper) => {
    swiperRef.current = swiper;
    // Start autoplay immediately on load
    swiper.autoplay.start();
  }}
  effect="coverflow"
  grabCursor={true}
  centeredSlides={true}
  slidesPerView="auto"
  initialSlide={middleIndex}
  loop={true}
  autoplay={{
    delay: 1500,
    disableOnInteraction: false,
    stopOnLastSlide: false,
    waitForTransition: false,
    reverseDirection: true,
  }}
  coverflowEffect={{
    rotate: 0,
    stretch: 0,
    depth: 200,
    modifier: 3,
    slideShadows: false,
  }}
  modules={[EffectCoverflow, Autoplay]}
  className="w-full max-w-2xl"
>
        {imagesToDisplay.map((img, idx) => (
          <SwiperSlide
            key={`${img.src}-${idx}`}
            style={{ width: '190px', height: '400px' }}
          >
            <div 
              className="w-full h-full rounded-xl overflow-hidden shadow-xl cursor-pointer hover:scale-105 transition-transform duration-200"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                loading="lazy"
                className="object-cover"
                onError={(e) => {
                  // Fallback to first fallback image if backend image fails
                  e.currentTarget.src = fallbackImages[0];
                }}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

    </div>
  );
}
