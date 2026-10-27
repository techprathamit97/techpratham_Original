'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, X } from 'lucide-react';



interface ReviewImage {
    _id: string;
    imageUrl: string;
    altText: string;
    displayOrder: number;
    fileKey: string;
    createdAt?: string;
}

const ReadMoreText = ({ text }: { text: string }) => {
    const [expanded, setExpanded] = useState(false);

    const wordLimit = 25;
    const words = (text || '').split(' ');
    const isLong = words.length > wordLimit;
    const shortText = isLong ? words.slice(0, wordLimit).join(' ') + '...' : text;

    return (
        <div className="text-gray-700 leading-relaxed text-sm text-left relative z-10 font-medium">
            <div className="mb-1">
                "{expanded ? text : shortText}"
            </div>
            {isLong && (
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="text-red-700 cursor-pointer font-semibold hover:underline focus:outline-none"
                >
                    {expanded ? 'Show less' : 'Show more'}
                </button>
            )}
        </div>
    );
};

const ReviewsSection = () => {
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [chatImages, setChatImages] = useState<ReviewImage[]>([]);
    const [imagesLoading, setImagesLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<ReviewImage | null>(null);
    const [showAllImages, setShowAllImages] = useState(false);
    const [showAllReviews, setShowAllReviews] = useState(false);

    const INITIAL_IMAGES = 18;
    const INITIAL_REVIEWS = 18;

    useEffect(() => {
        fetchReviews();
        fetchChatImages();
    }, []);

    // Lock body scroll while the image modal is open
    useEffect(() => {
        document.body.style.overflow = selectedImage ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [selectedImage]);

    const fetchChatImages = async () => {
        try {
            const response = await fetch('/api/review-images');
            const data = await response.json();

            if (response.ok && Array.isArray(data) && data.length > 0) {
                setChatImages(getLatestImages(data));
            } else {
                setChatImages([]);
            }
        } catch (error) {
            console.error('Error fetching review chat images:', error);
            setChatImages([]);
        } finally {
            setImagesLoading(false);
        }
    };

    // Newest added first (ObjectId / createdAt are time-ordered)
    const getLatestImages = (list: ReviewImage[]) => {
        const key = (img: ReviewImage) => img.createdAt || img._id || '';
        return [...list]
            .sort((a, b) => (key(b) > key(a) ? 1 : key(b) < key(a) ? -1 : 0));
    };

    const fetchReviews = async () => {
        try {
            const response = await fetch('/api/review?published=true&limit=100');
            const data = await response.json();

            if (response.ok && data.reviews && data.reviews.length > 0) {
                setReviews(getLatestReviews(data.reviews));
            } else {
                setReviews(getLatestReviews(staticTestimonialsData));
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
            setReviews(getLatestReviews(staticTestimonialsData));
        } finally {
            setLoading(false);
        }
    };

    // Sort by newest posted date
    const getLatestReviews = (list: any[]) => {
        const getTime = (r: any) => {
            const value = r.publishDate || r.createdAt;
            const time = value ? new Date(value).getTime() : NaN;
            return Number.isNaN(time) ? 0 : time;
        };

        return [...list]
            .sort((a, b) => getTime(b) - getTime(a));
    };

    const visibleImages = showAllImages ? chatImages : chatImages.slice(0, INITIAL_IMAGES);
    const visibleReviews = showAllReviews ? reviews : reviews.slice(0, INITIAL_REVIEWS);

    const renderStars = (rating: any) => {
        return '★ '.repeat(rating);
    };

    const getInitials = (name: string) => {
        return (name || '?').charAt(0).toUpperCase();
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Recently';

        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return '1 day ago';
        if (diffDays < 30) return `${diffDays} days ago`;
        if (diffDays < 60) return '1 month ago';
        return `${Math.floor(diffDays / 30)} months ago`;
    };

    return (
        <div className='w-full h-auto flex flex-col items-center justify-center overflow-hidden'>

            {/* 1. Review chat images (AI chat screenshots) grid — 3 per row, newest 12 */}
            <div className='w-full h-auto flex flex-col items-center justify-center py-16 gap-10 bg-white text-black'>
                <div className='md:w-10/12 w-11/12 flex flex-col gap-2 items-center text-center'>
                    <div className="md:text-3xl text-2xl md:font-semibold font-medium capitalize">
                        Real <span className='bg-gradient-to-tr from-[#FC7A35] to-[#f8da52] text-transparent bg-clip-text font-bold'>conversations</span> from our learners
                    </div>
                    <div className='md:w-1/2 text-sm w-full text-gray-600'>
                        Genuine chat messages shared by our students about their learning and placement journey.
                    </div>
                </div>

                {imagesLoading ? (
                    <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-red-600"></div>
                    </div>
                ) : chatImages.length > 0 ? (
                    <>
                        <div className='md:w-10/12 w-11/12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                            {visibleImages.map((img) => (
                                <button
                                    key={img._id}
                                    type="button"
                                    onClick={() => setSelectedImage(img)}
                                    className='group w-full max-w-[220px] mx-auto overflow-hidden rounded-xl bg-white shadow-md border border-gray-200 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300'
                                >
                                    <img
                                        src={img.imageUrl}
                                        alt={img.altText || 'Student review chat'}
                                        loading="lazy"
                                        className='w-full h-auto object-contain'
                                    />
                                </button>
                            ))}
                        </div>

                        {chatImages.length > INITIAL_IMAGES && (
                            <button
                                type="button"
                                onClick={() => setShowAllImages((prev) => !prev)}
                                className='px-6 py-2.5 rounded-full bg-gradient-to-tl from-[#C6151D] to-[#600A0E] text-white text-sm font-semibold hover:scale-105 transition-transform duration-300'
                            >
                                {showAllImages ? 'Show less' : 'Show more'}
                            </button>
                        )}
                    </>
                ) : (
                    <p className='text-gray-500 text-sm'>No review chats available yet.</p>
                )}
            </div>

            {/* 2. Latest posted Google reviews (newest 10) */}
            <div className='w-full h-auto flex flex-col items-center justify-center py-16 gap-10 bg-[#f7f7f7] text-black'>
                <div className='md:w-10/12 w-11/12 flex flex-col gap-2 items-center text-center'>
                    <div className="md:text-3xl text-2xl md:font-semibold font-medium capitalize">
                        Our learners' <span className='bg-gradient-to-tr from-[#FC7A35] to-[#f8da52] text-transparent bg-clip-text font-bold'>latest reviews</span>
                    </div>
                    <div className='md:w-1/2 text-sm w-full'>
                        The most recent reviews posted by our students about their experience at TechPratham.
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-red-600"></div>
                    </div>
                ) : (
                    <div className='md:w-10/12 w-11/12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {visibleReviews.map((testimonial, index) => (
                            <div
                                key={testimonial._id || testimonial.id || index}
                                className="group w-auto h-auto flex flex-col gap-4 bg-white rounded-2xl p-6 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-2 border border-gray-100 relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                {/* Header */}
                                <div className="w-full flex flex-row items-center justify-start gap-3 relative z-10">
                                    <div className="w-12 h-12 bg-gradient-to-tl from-[#C6151D] to-[#600A0E] rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-all duration-300 overflow-hidden">
                                        {testimonial.profileImage ? (
                                            <img
                                                src={testimonial.profileImage}
                                                alt={testimonial.name}
                                                className="w-full h-full rounded-full object-cover"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.style.display = 'none';
                                                    const fallback = target.nextElementSibling as HTMLElement | null;
                                                    if (fallback) fallback.style.display = 'flex';
                                                }}
                                            />
                                        ) : null}
                                        <div
                                            className="w-full h-full flex items-center justify-center"
                                            style={{ display: testimonial.profileImage ? 'none' : 'flex' }}
                                        >
                                            {testimonial.avatar || getInitials(testimonial.name)}
                                        </div>
                                    </div>
                                    <div className="flex flex-col text-left flex-1">
                                        <div className="font-bold text-[#600A0E] text-lg">{testimonial.name}</div>
                                        <div className="text-green-500 text-sm flex items-center justify-start gap-1">
                                            <Clock className='w-4 h-4' />
                                            {testimonial.publishDate
                                                ? formatDate(testimonial.publishDate)
                                                : testimonial.createdAt
                                                    ? formatDate(testimonial.createdAt)
                                                    : testimonial.date}
                                        </div>
                                    </div>
                                </div>

                                {/* Rating */}
                                <div className="w-full flex items-center justify-between relative z-10">
                                    <div className="flex items-center gap-1">
                                        <span className='text-yellow-400 text-xl'>{renderStars(testimonial.rating)}</span>
                                        <span className="text-gray-600 text-sm ml-1">({testimonial.rating}/5)</span>
                                    </div>
                                    <div className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
                                        Google Review
                                    </div>
                                </div>

                                {/* Quote icon */}
                                <div className="absolute top-4 right-4 text-red-700/20 group-hover:text-gray-300 transition-colors duration-300 z-0">
                                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M6.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35l.539-.222.474-.197-.485-1.938-.597.144c-.191.048-.424.104-.689.171-.271.05-.56.187-.882.312-.318.142-.686.238-1.028.466-.344.218-.741.4-1.091.692-.339.301-.748.562-1.05.945-.33.358-.656.734-.909 1.162-.293.408-.492.856-.702 1.299-.19.443-.343.896-.468 1.336-.237.882-.343 1.72-.384 2.437-.034.718-.014 1.315.028 1.747.015.204.043.402.063.539l.025.168.026-.006A4.5 4.5 0 1 0 6.5 10zm11 0c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35l.539-.222.474-.197-.485-1.938-.597.144c-.191.048-.424.104-.689.171-.271.05-.56.187-.882.312-.318.142-.686.238-1.028.466-.344.218-.741.4-1.091.692-.339.301-.748.562-1.05.945-.33.358-.656.734-.909 1.162-.293.408-.492.856-.702 1.299-.19.443-.343.896-.468 1.336-.237.882-.343 1.72-.384 2.437-.034.718-.014 1.315.028 1.747.015.204.043.402.063.539l.025.168.026-.006A4.5 4.5 0 1 0 17.5 10z" />
                                    </svg>
                                </div>

                                {/* Review text */}
                                <ReadMoreText text={testimonial.review || testimonial.testimonial} />

                                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-tl from-[#C6151D] to-[#600A0E] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && reviews.length > INITIAL_REVIEWS && (
                    <button
                        type="button"
                        onClick={() => setShowAllReviews((prev) => !prev)}
                        className='px-6 py-2.5 rounded-full bg-gradient-to-tl from-[#C6151D] to-[#600A0E] text-white text-sm font-semibold hover:scale-105 transition-transform duration-300'
                    >
                        {showAllReviews ? 'Show less' : 'Show more'}
                    </button>
                )}
            </div>

           

            {/* Fullscreen image preview modal */}
            {selectedImage && (
                <div
                    className='fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4'
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        type="button"
                        onClick={() => setSelectedImage(null)}
                        className='absolute top-5 right-5 text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors'
                        aria-label="Close"
                    >
                        <X className='w-6 h-6' />
                    </button>
                    <div
                        className='relative max-h-[90vh] max-w-[90vw] w-auto'
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={selectedImage.imageUrl}
                            alt={selectedImage.altText || 'Student review chat'}
                            className='max-h-[90vh] max-w-[90vw] w-auto h-auto object-contain rounded-xl shadow-2xl'
                        />
                    </div>
                </div>
            )}

        </div>
    );
};

export default ReviewsSection;

const staticTestimonialsData = [
    {
        id: 1,
        name: 'Khyati Sharma',
        date: '2 months ago',
        rating: 5,
        verified: true,
        testimonial: 'I had a great experience learning at Tech Pratham. The courses were well-structured, up-to-date with the latest industry standards, and the instructors were extremely knowledgeable and supportive throughout my journey. Thanks to Tech Pratham, I was able to build a strong foundation in my technical skills!',
        avatar: 'K',
        avatarColor: 'bg-blue-500'
    },
    {
        id: 2,
        name: 'Ritika',
        date: '2 months ago',
        rating: 5,
        verified: true,
        testimonial: 'My experience with Tech Pratham Institute has been excellent. The course content is well-updated according to industry standards, with a strong focus on practical learning. The faculty members are knowledgeable and very supportive, always clearing doubts with patience.',
        avatar: 'R',
        avatarColor: 'bg-green-500'
    },
    {
        id: 3,
        name: 'Ivan Silvester',
        date: '2 months ago',
        rating: 5,
        verified: true,
        testimonial: 'As a student diving into the world of technology, discovering Tech Pratham has been a total game-changer for me. The way they break down complex topics into simple, easy-to-understand lessons is incredibly helpful, especially for someone who\'s just starting out.',
        avatar: 'I',
        avatarColor: 'bg-purple-500'
    },
    {
        id: 4,
        name: 'Shubham Sinha',
        date: '2 months ago',
        rating: 5,
        verified: true,
        testimonial: 'I enrolled in the AWS Certification Program at Tech Pratham, and it was one of the best decisions for my career. The training was completely hands-on with real-time projects, and the instructors explained even complex cloud concepts in a very simple and practical way.',
        avatar: 'S',
        avatarColor: 'bg-red-500'
    },
    {
        id: 5,
        name: 'Neha Singh',
        date: '2 months ago',
        rating: 5,
        verified: true,
        testimonial: 'I joined Tech Pratham for the Workday Consultant Program 5 months ago. From day one till the completion of the course, I received full support from all the faculty members. Thanks to Tech Pratham, I have now successfully got placed and started my professional journey.',
        avatar: 'N',
        avatarColor: 'bg-indigo-500'
    },
    {
        id: 6,
        name: 'Chauhan Deco',
        date: '3 weeks ago',
        rating: 5,
        verified: true,
        testimonial: 'I had an excellent experience with Tech Pratham\'s data analytics training program. The course content was well-structured, up-to-date, and highly practical, covering tools like Excel, SQL, Python, and Power BI. Thanks to Tech Pratham, I now feel confident in my data analytics skills and have even landed my first job in the field.',
        avatar: 'C',
        avatarColor: 'bg-orange-500'
    },
    {
        id: 7,
        name: 'Dimpy',
        date: '2 months ago',
        rating: 5,
        verified: true,
        testimonial: 'Joining Tech Pratham Institute has been a life-changing decision for me. The support and encouragement I received from the faculty gave me the confidence to believe in myself. The environment here feels more like a family than just a classroom.',
        avatar: 'D',
        avatarColor: 'bg-pink-500'
    },
    {
        id: 8,
        name: 'Amarjeet Kumar',
        date: '2 months ago',
        rating: 5,
        verified: true,
        testimonial: 'I joined Tech Pratham\'s SAP HCM course and it was a fantastic experience! The trainers explained complex HR modules in a very simple way, and the hands-on sessions helped me build real skills. Highly recommended for anyone looking to build a career in SAP HCM!',
        avatar: 'A',
        avatarColor: 'bg-teal-500'
    },
    {
        id: 9,
        name: 'Shashi Ranjan',
        date: '2 months ago',
        rating: 5,
        verified: true,
        testimonial: 'I had a wonderful learning experience with the Workday HCM course at Tech Pratham under Roy Sir\'s guidance. His teaching style is very clear, practical, and easy to understand even for beginners. The real-time examples and assignments made concepts crystal clear.',
        avatar: 'S',
        avatarColor: 'bg-cyan-500'
    },
    {
        id: 10,
        name: 'Akash Solanki',
        date: '2 months ago',
        rating: 5,
        verified: true,
        testimonial: 'My experience with the Ethical Hacking training session from Tech Pratham located in Noida was excellent. The trainers ensured we understood every concept thoroughly. The placement support was remarkable, leading to my successful employment. Choosing Tech Pratham was a life-changing decision for me.',
        avatar: 'A',
        avatarColor: 'bg-yellow-500'
    },
    {
        id: 11,
        name: 'Ajay Kumar Verma',
        date: '2 months ago',
        rating: 5,
        verified: true,
        testimonial: 'I enrolled in the Data Analytics & Generative AI course at Tech Pratham and had a great learning experience. The curriculum is industry-relevant, and the trainers explain concepts clearly. The practical projects and tools like Python, SQL, Power BI, and AI models were especially helpful.',
        avatar: 'A',
        avatarColor: 'bg-emerald-500'
    }
];
