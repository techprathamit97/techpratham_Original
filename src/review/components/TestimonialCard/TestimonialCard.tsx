'use client';

import React from 'react';
import Image from 'next/image';
import { StarFilledIcon, PersonIcon } from '@radix-ui/react-icons';

interface TestimonialCardProps {
  name: string;
  rating: number;
  review: string;
  profileImage?: string | null;
  course?: string | null;
  designation?: string | null;
  company?: string | null;
  createdAt: string;
  isFeatured?: boolean;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  name,
  rating,
  review,
  profileImage,
  course,
  designation,
  company,
  createdAt,
  isFeatured = false
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  return (
    <div className={`group relative bg-white rounded-2xl p-6 border transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 ${
      isFeatured ? 'border-[#C6151D] shadow-lg' : 'border-gray-200 shadow-md'
    }`}>
      {isFeatured && (
        <div className='absolute -top-3 -right-3 bg-gradient-to-r from-[#600A0E] to-[#C6151D] text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg'>
          ⭐ Featured
        </div>
      )}

      <div className='flex items-start gap-4 mb-4'>
        {/* Profile Image */}
        <div className='relative w-16 h-16 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200 flex-shrink-0 group-hover:border-[#C6151D] transition-colors'>
          {profileImage ? (
            <Image src={profileImage} alt={name} fill className='object-cover' />
          ) : (
            <div className='w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300'>
              <PersonIcon className='w-8 h-8 text-gray-500' />
            </div>
          )}
        </div>

        {/* User Info */}
        <div className='flex-1'>
          <h3 className='text-lg font-bold text-gray-900'>{name}</h3>
          {(designation || company) && (
            <p className='text-sm text-gray-600'>
              {designation}{designation && company && ' at '}{company}
            </p>
          )}
          {course && (
            <p className='text-sm text-[#C6151D] font-medium mt-1'>📚 {course}</p>
          )}
        </div>
      </div>

      {/* Rating */}
      <div className='flex items-center gap-2 mb-4'>
        <div className='flex gap-1'>
          {[...Array(5)].map((_, index) => (
            <StarFilledIcon
              key={index}
              className={`w-5 h-5 ${
                index < rating ? 'text-yellow-500' : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <span className='text-sm font-semibold text-gray-700'>
          {rating}.0
        </span>
      </div>

      {/* Review Text */}
      <p className='text-gray-700 leading-relaxed mb-4 line-clamp-4'>
        "{review}"
      </p>

      {/* Date */}
      <p className='text-sm text-gray-500'>{formatDate(createdAt)}</p>

      {/* Hover Effect Border */}
      <div className='absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#600A0E] to-[#C6151D] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-b-2xl'></div>
    </div>
  );
};

export default TestimonialCard;
