import Loader from '@/components/common/Loader/Loader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

const FormContact = () => {
    const { register, handleSubmit, reset } = useForm();
    const [submitting, setSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const onSubmit = async (data: any) => {
        try {
            setSubmitting(true);
            const response = await fetch('/email/payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                setSubmitSuccess(true);
                window.location.href = 'https://payu.in/pay/E5AEF5CAEF5E85E7E367B9673CE3C477';
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
        <div
            className='p-[3px] shadow-lg flex items-center justify-center md:w-full w-11/12 max-w-3xl h-auto rounded-xl my-10'
            style={{
                backgroundImage: 'linear-gradient(to top left, #ff0000, #ff9900, #33cc33, #3399ff, #9900cc, #ff3399)'
            }}
        >
            <form className='w-full flex flex-col gap-4 p-6 rounded-lg bg-white h-full' onSubmit={handleSubmit(onSubmit)}>

                <div className='mb-3'>
                    <div>Fee Payment</div>
                    <div className='font-bold md:text-2xl text-lg'>Please Enter Your Details Here</div>
                </div>

                <div className='w-full'>
                    <label htmlFor='fullName' className='block mb-1 text-sm font-medium text-gray-700'>Full Name</label>
                    <Input {...register('fullName')} type='text' id='fullName' name='fullName' className='w-full p-2 indent-2 outline-none' placeholder='Enter your full name' required />
                </div>

                <div className='w-full'>
                    <label htmlFor='email' className='block mb-1 text-sm font-medium text-gray-700'>Email Address</label>
                    <Input {...register('email')} type='email' id='email' name='email' className='w-full p-2 indent-2 outline-none' placeholder='Enter your email' required />
                </div>

                <div className='w-full'>
                    <label htmlFor='phone' className='block mb-1 text-sm font-medium text-gray-700'>Phone Number</label>
                    <Input {...register('phone')} type='text' id='phone' name='phone' className='w-full p-2 indent-2 outline-none' placeholder='Enter your phone number' required />
                </div>

                <div className='w-full'>
                    <label htmlFor='amount' className='block mb-1 text-sm font-medium text-gray-700'>Amount</label>
                    <Input {...register('amount')} type='text' id='amount' name='amount' className='w-full p-2 indent-2 outline-none' placeholder='Enter course fee' required />
                </div>

                <div className='w-full'>
                    <label htmlFor='course' className='block mb-1 text-sm font-medium text-gray-700'>Course</label>
                    <Input {...register('course')} type='text' id='course' name='course' className='w-full p-2 indent-2 outline-none' placeholder='Enter your course' required />
                </div>

                <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='w-full'>
                        <label htmlFor='country' className='block mb-1 text-sm font-medium text-gray-700'>Country</label>
                        <Input {...register('country')} type='text' id='country' name='country' className='w-full p-2 indent-2 outline-none' placeholder='Enter your country' required />
                    </div>

                    <div className='w-full'>
                        <label htmlFor='state' className='block mb-1 text-sm font-medium text-gray-700'>State</label>
                        <Input {...register('state')} type='text' id='state' name='state' className='w-full p-2 indent-2 outline-none' placeholder='Enter your state' required />
                    </div>
                </div>
                
                <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='w-full'>
                        <label htmlFor='city' className='block mb-1 text-sm font-medium text-gray-700'>City</label>
                        <Input {...register('city')} type='text' id='city' name='city' className='w-full p-2 indent-2 outline-none' placeholder='Enter your city' required />
                    </div>

                    <div className='w-full'>
                        <label htmlFor='pinCode' className='block mb-1 text-sm font-medium text-gray-700'>Pin Code</label>
                        <Input {...register('pinCode')} type='text' id='pinCode' name='pinCode' className='w-full p-2 indent-2 outline-none' placeholder='Enter your pin code' required />
                    </div>
                </div>

                <Button type='submit' variant={'manual'} className='h-10 mt-4 text-base flex items-center justify-center' disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Send'}
                </Button>
                {submitSuccess && <p className="text-green-600">Form submitted successfully! We'll reach you soon!</p>}
            </form>
        </div>

    )
}

export default FormContact