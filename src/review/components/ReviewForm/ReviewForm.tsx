'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { StarIcon, StarFilledIcon, UploadIcon, CheckCircledIcon } from '@radix-ui/react-icons';

interface ReviewFormData {
  name: string;
  email: string;
  rating: number;
  review: string;
  course?: string;
  designation?: string;
  company?: string;
}

const ReviewForm = () => {
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<ReviewFormData>({
    defaultValues: {
      rating: 5
    }
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileImageKey, setProfileImageKey] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const rating = watch('rating');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload a valid image file (JPEG, PNG, or WebP)');
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('File size must be less than 5MB');
        return;
      }

      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (): Promise<{ url: string; fileKey: string } | null> => {
    if (!imageFile) return null;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', imageFile);

      const response = await fetch('/api/review/upload-image', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Image upload failed');
      }

      const data = await response.json();
      return { url: data.url, fileKey: data.fileKey };
    } catch (error) {
      console.error('Image upload error:', error);
      alert('Failed to upload image. Please try again.');
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const onSubmit = async (data: ReviewFormData) => {
    try {
      setSubmitting(true);

      // Upload image if selected
      let imageData = null;
      if (imageFile) {
        imageData = await uploadImage();
        if (!imageData) {
          setSubmitting(false);
          return;
        }
      }

      // Submit review
      const response = await fetch('/api/review/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...data,
          profileImage: imageData?.url || null,
          profileImageKey: imageData?.fileKey || null
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit review');
      }

      setSubmitSuccess(true);
      reset();
      setImageFile(null);
      setImagePreview(null);
      setProfileImage(null);
      setProfileImageKey(null);

      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error: any) {
      console.error('Review submission error:', error);
      alert(error.message || 'Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = () => {
    return (
      <div className='flex gap-2'>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type='button'
            onClick={() => setValue('rating', star)}
            className='transition-transform hover:scale-110'
          >
            {star <= rating ? (
              <StarFilledIcon className='w-8 h-8 text-yellow-500' />
            ) : (
              <StarIcon className='w-8 h-8 text-gray-300' />
            )}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className='w-full max-w-2xl mx-auto'>
      <div className='bg-white rounded-2xl shadow-xl p-8 border border-gray-200'>
        <div className='mb-8 text-center'>
          <h2 className='text-3xl font-bold text-gray-900 mb-2'>Share Your Experience</h2>
          <p className='text-gray-600'>Your feedback helps us improve and helps others make informed decisions</p>
        </div>

        {submitSuccess && (
          <div className='mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3'>
            <CheckCircledIcon className='w-6 h-6 text-green-600' />
            <div>
              <p className='font-semibold text-green-900'>Review Submitted Successfully!</p>
              <p className='text-sm text-green-700'>Your review will be published after approval.</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          {/* Profile Image Upload */}
          <div>
            <Label className='text-base font-semibold text-gray-900 mb-3 block'>
              Profile Picture (Optional)
            </Label>
            <div className='flex items-center gap-6'>
              <div className='relative w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200'>
                {imagePreview ? (
                  <Image src={imagePreview} alt='Profile Preview' fill className='object-cover' />
                ) : (
                  <div className='w-full h-full flex items-center justify-center text-gray-400'>
                    <UploadIcon className='w-8 h-8' />
                  </div>
                )}
              </div>
              <div className='flex-1'>
                <input
                  type='file'
                  id='profileImage'
                  accept='image/jpeg,image/jpg,image/png,image/webp'
                  onChange={handleImageChange}
                  className='hidden'
                />
                <label
                  htmlFor='profileImage'
                  className='inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg cursor-pointer transition-colors'
                >
                  <UploadIcon className='w-4 h-4' />
                  Choose Image
                </label>
                <p className='text-sm text-gray-500 mt-2'>Max 5MB • JPEG, PNG, WebP</p>
              </div>
            </div>
          </div>

          {/* Name */}
          <div>
            <Label htmlFor='name' className='text-base font-semibold text-gray-900 mb-2 block'>
              Full Name <span className='text-red-500'>*</span>
            </Label>
            <Input
              id='name'
              {...register('name', { required: 'Name is required' })}
              placeholder='John Doe'
              className='h-12'
            />
            {errors.name && <p className='text-sm text-red-500 mt-1'>{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div>
            <Label htmlFor='email' className='text-base font-semibold text-gray-900 mb-2 block'>
              Email Address <span className='text-red-500'>*</span>
            </Label>
            <Input
              id='email'
              type='email'
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: 'Please enter a valid email'
                }
              })}
              placeholder='john@example.com'
              className='h-12'
            />
            {errors.email && <p className='text-sm text-red-500 mt-1'>{errors.email.message}</p>}
          </div>

          {/* Rating */}
          <div>
            <Label className='text-base font-semibold text-gray-900 mb-3 block'>
              Rating <span className='text-red-500'>*</span>
            </Label>
            {renderStars()}
            <input type='hidden' {...register('rating', { required: true })} />
          </div>

          {/* Course (Optional) */}
          <div>
            <Label htmlFor='course' className='text-base font-semibold text-gray-900 mb-2 block'>
              Course Name (Optional)
            </Label>
            <Input
              id='course'
              {...register('course')}
              placeholder='e.g., Workday HCM Training'
              className='h-12'
            />
          </div>

          {/* Designation & Company */}
          <div className='grid md:grid-cols-2 gap-4'>
            <div>
              <Label htmlFor='designation' className='text-base font-semibold text-gray-900 mb-2 block'>
                Designation (Optional)
              </Label>
              <Input
                id='designation'
                {...register('designation')}
                placeholder='e.g., HR Manager'
                className='h-12'
              />
            </div>
            <div>
              <Label htmlFor='company' className='text-base font-semibold text-gray-900 mb-2 block'>
                Company (Optional)
              </Label>
              <Input
                id='company'
                {...register('company')}
                placeholder='e.g., Tech Corp'
                className='h-12'
              />
            </div>
          </div>

          {/* Review Text */}
          <div>
            <Label htmlFor='review' className='text-base font-semibold text-gray-900 mb-2 block'>
              Your Review <span className='text-red-500'>*</span>
            </Label>
            <Textarea
              id='review'
              {...register('review', {
                required: 'Review is required',
                minLength: {
                  value: 10,
                  message: 'Review must be at least 10 characters'
                },
                maxLength: {
                  value: 1000,
                  message: 'Review cannot exceed 1000 characters'
                }
              })}
              placeholder='Share your experience with us...'
              className='h-32 resize-none'
            />
            {errors.review && <p className='text-sm text-red-500 mt-1'>{errors.review.message}</p>}
          </div>

          {/* Submit Button */}
          <Button
            type='submit'
            disabled={submitting || uploadingImage}
            className='w-full h-12 text-base font-semibold bg-gradient-to-r from-[#600A0E] to-[#C6151D] hover:from-[#700A0E] hover:to-[#D6151D]'
          >
            {submitting ? 'Submitting...' : uploadingImage ? 'Uploading Image...' : 'Submit Review'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;
