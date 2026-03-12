// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { ChevronDownIcon } from '@radix-ui/react-icons';
// import { Phone } from 'lucide-react';
// import React, { useState } from 'react';
// import { useForm } from 'react-hook-form';

// const ReachForm = () => {
//     const [isOpen, setIsOpen] = useState(true);
//     const { register, handleSubmit, reset } = useForm();
//     const [submitting, setSubmitting] = useState(false);
//     const [submitSuccess, setSubmitSuccess] = useState(false);

//     const onSubmit = async (data: any) => {
//         try {
//             setSubmitting(true);
//             const response = await fetch('/api/leads', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     ...data,
//                     formType: "Reach out to us",
//                 }),
//             });
//             if (response.ok) {
//                 setSubmitSuccess(true);
//                 console.log(data);
//                 reset();
//                 if (typeof window !== "undefined" && typeof (window as any).gtag !== "undefined") {
//                     (window as any).gtag("event", "conversion", {
//                         send_to: "AW-17462500412/K_E4CNSPy-0bELy44oZB",
//                     });
//                 }
//             } else {
//                 console.error('Failed to submit form');
//             }
//         } catch (error) {
//             console.error('Error submitting form:', error);
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     return (
//         <div className="md:w-64 w-72 fixed right-0 bottom-0 z-[100] md:flex hidden flex-col">
//             <div className='bg-yellow-600 text-white w-full p-2 rounded-t-md flex flex-row items-center justify-between cursor-pointer' onClick={() => setIsOpen(!isOpen)}>
//                 <div>Reach Out to Us</div>
//                 <ChevronDownIcon className={`w-6 h-6 transition-transform duration-500 ease-in-out ${isOpen ? '' : 'rotate-180'}`} />
//             </div>
//             <div className={`bg-white text-black flex flex-col items-center justify-center gap-2 capitalize transition-all duration-500 ease-in-out overflow-hidden shadow ${isOpen ? 'max-h-[600px] opacity-100 py-2 px-4 translate-y-0' : 'max-h-0 opacity-0 py-0 px-4 -translate-y-4'
//                 }`}>

//                 <form className='w-full flex flex-col gap-2 rounded-lg mb-2 bg-white h-full' onSubmit={handleSubmit(onSubmit)}>
//                     <Input {...register('fullName')} type='text' id='fullName' name='fullName' className='w-full p-2 indent-2 outline-none' placeholder='Enter your full name' required />
//                     <Input {...register('phone')} type='text' id='phone' name='phone' className='w-full p-2 indent-2 outline-none' placeholder='Enter your phone number' required />
//                     <Input {...register('course')} type='text' id='course' name='course' className='w-full p-2 indent-2 outline-none' placeholder='Enter your course' required />
//                     <Button type='submit' variant={'manual'} className='h-10 text-base flex items-center justify-center' disabled={submitting}>
//                         {submitting ? 'Submitting...' : 'Send'}
//                     </Button>
//                     {submitSuccess && <p className="text-green-600 text-sm">Form submitted successfully! We'll reach you soon!</p>}
//                 </form>
//             </div>
//         </div>
//     )
// }

// export default ReachForm

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { Phone } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

const ReachForm = () => {
    const [isOpen, setIsOpen] = useState(true);
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
                    formType: "Reach out to us",
                }),
            });

            if (response.ok) {
                setSubmitSuccess(true);
                reset();

                // ✅ GOOGLE ADS FORM SUBMISSION CONVERSION
               if (typeof window !== "undefined") {
                    (window as any).dataLayer = (window as any).dataLayer || [];
                    (window as any).dataLayer.push({
                        event: "google_ads_conversion",
                        conversion_id: "17462500412",
                        conversion_label: "K_E4CNSPy-0bELy44oZB",
                    });
                }

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
        <div className="md:w-64 w-72 fixed right-0 bottom-0 z-[100] md:flex hidden flex-col">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-controls="reach-form"
                aria-label="Toggle reach out form"
                className="bg-yellow-600 text-white w-full p-2 rounded-t-md flex flex-row items-center justify-between cursor-pointer"
            >
                <span>Reach Out to Us</span>
                <ChevronDownIcon
                    className={`w-6 h-6 transition-transform duration-500 ease-in-out ${isOpen ? '' : 'rotate-180'
                        }`}
                />
            </button>


            <div
                className={`bg-white text-black flex flex-col items-center justify-center gap-2 capitalize transition-all duration-500 ease-in-out overflow-hidden shadow ${isOpen
                    ? 'max-h-[600px] opacity-100 py-2 px-4 translate-y-0'
                    : 'max-h-0 opacity-0 py-0 px-4 -translate-y-4'
                    }`}
            >
                <form
                    className='w-full flex flex-col gap-1 rounded-lg mb-2 bg-white h-full'
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <Input
                        {...register('fullName')}
                        type='text'
                        id='fullName'
                        name='fullName'
                        className='w-full p-1 indent-2 outline-none'
                        placeholder='Enter your full name'
                        required
                    />

                    <Input
                        {...register('phone')}
                        type='text'
                        id='phone'
                        name='phone'
                        className='w-full p-1 indent-2 outline-none'
                        placeholder='Enter your phone number'
                        required
                    />

                    <Input
                        {...register('course')}
                        type='text'
                        id='course'
                        name='course'
                        className='w-full p-1 indent-2 outline-none'
                        placeholder='Enter your course'
                        required
                    />

                    <Button
                        type='submit'
                        variant={'manual'}
                        className='h-8 text-base flex items-center justify-center'
                        disabled={submitting}
                    >
                        {submitting ? 'Submitting...' : 'Submit'}
                    </Button>

                    {submitSuccess && (
                        <p className="text-green-600 text-sm">
                            Form submitted successfully! We'll reach you soon!
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
};

export default ReachForm;
