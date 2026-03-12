import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const AdmissionForm = () => {
  const { register, handleSubmit, reset } = useForm();
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const onSubmit = async (data: any) => {
    try {
      setSubmitting(true);

      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          formType: 'admission-form',
        }),
      });

      if (response.ok) {
        setSubmitSuccess(true);
        reset();
      } else {
        console.error('Failed to submit form');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='w-full h-auto flex flex-col items-center justify-center py-12'>
      <div
        className='p-[3px] shadow flex items-center justify-center md:w-1/2 w-11/12 h-auto rounded-xl bg-gradient-to-tl'
        style={{
          backgroundImage:
            'linear-gradient(to top left, #ff0000, #ff9900, #33cc33, #3399ff, #9900cc, #ff3399)',
        }}
      >
        <form
          className='w-full flex flex-col gap-4 p-6 rounded-lg bg-white h-full'
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className='w-full'>
            <label className='block mb-1 text-sm font-medium text-gray-700'>
              Full Name
            </label>
            <Input {...register('fullName')} required />
          </div>

          <div className='w-full'>
            <label className='block mb-1 text-sm font-medium text-gray-700'>
              Email Address
            </label>
            <Input {...register('email')} type='email' required />
          </div>

          <div className='w-full'>
            <label className='block mb-1 text-sm font-medium text-gray-700'>
              Course
            </label>
            <Input {...register('course')} required />
          </div>

          <div className='w-full'>
            <label className='block mb-1 text-sm font-medium text-gray-700'>
              Phone Number
            </label>
            <Input {...register('phone')} required />
          </div>

          <div className='w-full'>
            <label className='block mb-1 text-sm font-medium text-gray-700'>
              Your Query / Message
            </label>
            <Textarea {...register('message')} className='h-40' required />
          </div>

          <Button
            type='submit'
            variant='manual'
            className='h-10 text-base flex items-center justify-center'
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Send'}
          </Button>

          {submitSuccess && (
            <p className='text-green-600'>
              Form submitted successfully! We'll reach you soon!
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default AdmissionForm;
