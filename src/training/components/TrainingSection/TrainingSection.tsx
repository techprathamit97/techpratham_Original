// import Loader from '@/components/common/Loader/Loader';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import Image from 'next/image';
// import React, { useState } from 'react';
// import { useForm } from 'react-hook-form';

// const TrainingSection = () => {
//     const { register, handleSubmit, reset } = useForm();
//     const [submitting, setSubmitting] = useState(false);
//     const [submitSuccess, setSubmitSuccess] = useState(false);

//     const onSubmit = async (data: any) => {
//         try {
//             setSubmitting(true);
//             const response = await fetch('/email/certificate', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(data),
//             });
//             if (response.ok) {
//                 setSubmitSuccess(true);
//                 reset();
//             } else {
//                 console.error('Failed to submit form');
//             }
//         } catch (error) {
//             console.error('Error submitting form:', error);
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     { submitting && <Loader /> }

//     return (
//         <div className='md:w-10/12 w-11/12 h-auto grid grid-cols-1 md:grid-cols-2 gap-8 py-16'>
//             <div>
//                 <div className='font-bold text-2xl'>Corporate Training Approach</div>
//                 <div className='text-base mt-2'>By utilizing our high-impact training approach, we always deliver the world-class Corporate Training solutions to industries that assure maximum returns on your investments. We follow easy methodology to help companies undergo transformation and enjoy maximum ROI with skilled workforce:</div>
//                 <div
//                     className='p-[3px] shadow-lg flex items-center justify-center w-full max-w-3xl mt-4 h-auto rounded-xl'
//                     style={{
//                         backgroundImage: 'linear-gradient(to top left, #ff0000, #ff9900, #33cc33, #3399ff, #9900cc, #ff3399)'
//                     }}
//                 >
//                     <Image src='/training/training.jpg' alt='Corporate Training Approach' width={500} height={300} className='w-full h-80 object-cover rounded-lg' />
//                 </div>
//             </div>
//             <div
//                 className='p-[3px] shadow-lg flex items-center justify-center w-full max-w-3xl h-auto rounded-xl'
//                 style={{
//                     backgroundImage: 'linear-gradient(to top left, #ff0000, #ff9900, #33cc33, #3399ff, #9900cc, #ff3399)'
//                 }}
//             >
//                 <form className='w-full flex flex-col gap-4 p-6 rounded-lg bg-white h-full' onSubmit={handleSubmit(onSubmit)}>

//                     <div className='mb-3'>
//                         <div>Training Certificate</div>
//                         <div className='font-bold text-2xl'>Please Enter Your Details Here</div>
//                     </div>

//                     <div className='w-full'>
//                         <label htmlFor='fullName' className='block mb-1 text-sm font-medium text-gray-700'>Full Name</label>
//                         <Input {...register('fullName')} type='text' id='fullName' name='fullName' className='w-full p-2 indent-2 outline-none' placeholder='Enter your full name' required />
//                     </div>

//                     <div className='w-full'>
//                         <label htmlFor='email' className='block mb-1 text-sm font-medium text-gray-700'>Email Address</label>
//                         <Input {...register('email')} type='email' id='email' name='email' className='w-full p-2 indent-2 outline-none' placeholder='Enter your email' required />
//                     </div>

//                     <div className='w-full'>
//                         <label htmlFor='phone' className='block mb-1 text-sm font-medium text-gray-700'>Phone Number</label>
//                         <Input {...register('phone')} type='text' id='phone' name='phone' className='w-full p-2 indent-2 outline-none' placeholder='Enter your phone number' required />
//                     </div>

//                     <div className='w-full'>
//                         <label htmlFor='course' className='block mb-1 text-sm font-medium text-gray-700'>Course</label>
//                         <Input {...register('course')} type='text' id='course' name='course' className='w-full p-2 indent-2 outline-none' placeholder='Enter your course' required />
//                     </div>

//                     <Button type='submit' variant={'manual'} className='h-10 mt-4 text-base flex items-center justify-center' disabled={submitting}>
//                         {submitting ? 'Submitting...' : 'Send'}
//                     </Button>
//                     {submitSuccess && <p className="text-green-600">Form submitted successfully! We'll reach you soon!</p>}
//                 </form>
//             </div>
//         </div>
//     )
// }

// export default TrainingSection

import Loader from '@/components/common/Loader/Loader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

const TrainingSection = () => {
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
          formType: 'training-certificate',
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

  {submitting && <Loader />}

  return (
    <div className='md:w-10/12 w-11/12 h-auto grid grid-cols-1 md:grid-cols-2 gap-8 py-16'>
      <div>
        <div className='font-bold text-2xl'>Corporate Training Approach</div>
        <div className='text-base mt-2'>
          By utilizing our high-impact training approach, we always deliver the
          world-class Corporate Training solutions to industries that assure
          maximum returns on your investments. We follow easy methodology to help
          companies undergo transformation and enjoy maximum ROI with skilled
          workforce:
        </div>
        <div
          className='p-[3px] shadow-lg flex items-center justify-center w-full max-w-3xl mt-4 h-auto rounded-xl'
          style={{
            backgroundImage:
              'linear-gradient(to top left, #ff0000, #ff9900, #33cc33, #3399ff, #9900cc, #ff3399)',
          }}
        >
          <Image
            src='/training/training.jpg'
            alt='Corporate Training Approach'
            width={500}
            height={300}
            className='w-full h-80 object-cover rounded-lg'
          />
        </div>
      </div>

      <div
        className='p-[3px] shadow-lg flex items-center justify-center w-full max-w-3xl h-auto rounded-xl'
        style={{
          backgroundImage:
            'linear-gradient(to top left, #ff0000, #ff9900, #33cc33, #3399ff, #9900cc, #ff3399)',
        }}
      >
        <form
          className='w-full flex flex-col gap-4 p-6 rounded-lg bg-white h-full'
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className='mb-3'>
            <div>Training Certificate</div>
            <div className='font-bold text-2xl'>
              Please Enter Your Details Here
            </div>
          </div>

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
              Phone Number
            </label>
            <Input {...register('phone')} required />
          </div>

          <div className='w-full'>
            <label className='block mb-1 text-sm font-medium text-gray-700'>
              Course
            </label>
            <Input {...register('course')} required />
          </div>

          <Button
            type='submit'
            variant='manual'
            className='h-10 mt-4 text-base flex items-center justify-center'
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

export default TrainingSection;
