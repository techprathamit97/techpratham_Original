
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

const FormContact = () => {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      course: '',
      message: '',
    }
  });

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
          formType: 'contact-form',
        }),
      });

      if (response.ok) {
        setSubmitSuccess(true);
        reset();

        setTimeout(() => {
          setSubmitSuccess(false);
        }, 3000);
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
    <div
      className='p-[3px] shadow-lg flex items-center justify-center md:w-96 z-10 w-full rounded-xl'
      style={{
        backgroundImage:
          'linear-gradient(to top left, #ff0000, #ff9900, #33cc33, #3399ff, #9900cc, #ff3399)',
      }}
    >
      <form
        className='w-full flex flex-col gap-4 p-6 rounded-lg bg-white'
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className='mb-3'>
          <div>Have Questions?</div>
          <div className='font-bold text-xl'>
            Request a call from our executive
          </div>
        </div>

        <Input
          {...register('fullName')}
          placeholder='Full Name'
          required
        />

        <Input
          {...register('email')}
          type='email'
          placeholder='Email Address'
          required
        />

        <Input
          {...register('phone')}
          placeholder='Phone Number'
          required
        />

        <Input
          {...register('course')}
          placeholder='Course'
          required
        />

        <Textarea
          {...register('message')}
          placeholder='Your Query / Message'
          className='h-32'
        />

        <Button
          type='submit'
          variant='manual'
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Send'}
        </Button>

        {submitSuccess && (
          <p className='text-green-600 text-sm'>
            Form submitted successfully! We’ll contact you soon.
          </p>
        )}
      </form>
    </div>
  );
};

export default FormContact;
