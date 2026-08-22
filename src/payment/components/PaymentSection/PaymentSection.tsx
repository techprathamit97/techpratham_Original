// import Loader from '@/components/common/Loader/Loader';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import React, { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import Image from 'next/image';

// const FormContact = () => {
//     const { register: registerEasebuzz, handleSubmit: handleEasebuzzSubmit } = useForm();
//     const [easebuzzSubmitting, setEasebuzzSubmitting] = useState(false);

//     const onEasebuzzSubmit = async (data: any) => {
//         try {
//             setEasebuzzSubmitting(true);
            
//             // First save lead
//             await fetch('/api/leads', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     ...data,
//                     formType: "easebuzz-payment-form",
//                     course: `${data.productinfo} - Payment of Rs. ${data.amount}`,
//                     message: `Easebuzz Payment Initiated:\nAmount: Rs. ${data.amount}\nAddress: ${data.address1}, ${data.city}, ${data.state}, ${data.country} - ${data.zipcode}`,
//                 }),
//             });

//             // Create Easebuzz payment
//             const response = await fetch('/api/easebuzz/create-payment', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     amount: data.amount,
//                     firstname: data.firstname,
//                     email: data.email,
//                     phone: data.phone,
//                     productinfo: data.productinfo,
//                     address1: data.address1,
//                     city: data.city,
//                     state: data.state,
//                     country: data.country,
//                     zipcode: data.zipcode,
//                 }),
//             });

//             const result = await response.json();

//             if (result.success) {
//                 if (result.directRedirect && result.paymentUrl) {
//                     // Direct redirect to Easebuzz payment page
//                     window.location.href = result.paymentUrl;
//                 } else {
//                     // Fallback: Create form and submit to Easebuzz
//                     const form = document.createElement('form');
//                     form.method = 'POST';
//                     form.action = result.redirectUrl;
//                     form.target = '_self';
                    
//                     Object.keys(result.paymentData).forEach(key => {
//                         const input = document.createElement('input');
//                         input.type = 'hidden';
//                         input.name = key;
//                         input.value = result.paymentData[key];
//                         form.appendChild(input);
//                     });
                    
//                     document.body.appendChild(form);
//                     form.submit();
//                     document.body.removeChild(form);
//                 }
//             } else {
//                 console.error('Failed to create payment:', result.message);
//                 alert('Failed to initiate payment. Please try again.');
//             }
//         } catch (error) {
//             console.error('Error submitting Easebuzz form:', error);
//             alert('An error occurred. Please try again.');
//         } finally {
//             setEasebuzzSubmitting(false);
//         }
//     };

//     if (easebuzzSubmitting) {
//         return <Loader />;
//     }

//     return (
//         <div id="payment-section" className="w-full max-w-7xl mx-auto p-6 my-10">
//             {/* Two options remain: QR scan and the Easebuzz gateway. */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-auto">
                
//                 {/* Left Section - QR Code */}
//                 <div className="order-1 lg:order-1">
//                     <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 shadow-lg border border-blue-200 h-full">
//                         <div className="text-center">
//                             <div className="bg-gradient-to-tl from-[#C6151D] to-[#600A0E] text-white px-4 py-2 rounded-lg mb-3 font-bold text-sm inline-block">
//                                     OPTION - 1
//                                 </div>
//                             <h3 className="text-lg font-bold text-gray-800 mb-1">QR Scan & Pay</h3>
//                             <p className="text-sm text-gray-600 mb-2">Scan with any UPI app</p>
//                             <div className="flex justify-center space-x-2 mb-4">
//                                 <Image src="/header/upi.png" alt="UPI Payment" width={32} height={32} className="w-8 h-8" />
//                                 <Image src="/header/gpay.png" alt="Google Pay" width={40} height={32} className="w-10 h-8" />
//                                 <Image src="/header/paytem.png" alt="Paytm" width={40} height={32} className="w-10 h-8" />
//                                 <Image src="/header/phonepay.png" alt="PhonePe" width={40} height={32} className="w-10 h-8" />
//                                 <Image src="/header/amazonpay.png" alt="Amazon Pay" width={40} height={40} className="w-10 h-10" />
//                             </div>
//                             <div className="bg-white p-4 rounded-xl shadow-inner mb-4">
//                                 <Image 
//                                     src="/navbar/qr.jpeg" 
//                                     alt="QR Code for Payment" 
//                                     width={200}
//                                     height={200}
//                                     className="w-full max-w-[200px] mx-auto"
//                                 />
//                             </div>
                            
//                             <div className="bg-green-100 border border-green-300 rounded-lg p-3">
//                                 <p className="text-xs text-green-700 font-medium">✓ Instant Payment</p>
//                                 <p className="text-xs text-green-700">✓ 100% Secure</p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>


//                 {/* Second Section - Easebuzz Payment */}
//                 <div className="order-2 lg:order-2">
//                     <div className='p-[3px] shadow-xl flex items-center justify-center w-full border-2 border-green-600 h-full rounded-2xl'>
//                         <form className='w-full flex flex-col gap-4 p-5 rounded-2xl bg-white h-full' onSubmit={handleEasebuzzSubmit(onEasebuzzSubmit)}>
//                             <div className='mb-4 text-center'>
//                                 <div className="bg-gradient-to-tl from-[#C6151D] to-[#600A0E] text-white px-4 py-2 rounded-lg mb-3 font-bold text-sm inline-block">
//                                     OPTION - 2
//                                 </div>
                                
                                
//                                 {/* Payment Gateway Logos */}
//                                 <div className="flex justify-center items-center gap-3 mb-3">
//                                     <Image src="/header/visa.png" alt="Visa" width={48} height={32} className="w-12 h-8 object-contain" />
//                                     <Image src="/header/mastercard.png" alt="Mastercard" width={48} height={32} className="w-12 h-8 object-contain" />
//                                     <Image src="/header/upi.png" alt="UPI" width={32} height={32} className="w-8 h-8" />
//                                     <Image src="/header/gpay.png" alt="Google Pay" width={40} height={32} className="w-10 h-8" />
//                                 </div>

//                                 <div className="text-sm text-gray-600 mb-1">Secure Payment Gateway</div>
//                                 <div className="w-20 h-1 bg-gradient-to-r from-green-500 to-blue-600 mx-auto rounded-full"></div>
//                             </div>

//                             <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
//                                 <div className='w-full'>
//                                     <label htmlFor='easebuzz-firstname' className='block mb-2 text-sm font-semibold text-gray-700'>Full Name *</label>
//                                     <Input {...registerEasebuzz('firstname')} type='text' id='easebuzz-firstname' name='firstname' className='w-full p-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200' placeholder='Enter your full name' required />
//                                 </div>

//                                 <div className='w-full'>
//                                     <label htmlFor='easebuzz-email' className='block mb-2 text-sm font-semibold text-gray-700'>Email Address *</label>
//                                     <Input {...registerEasebuzz('email')} type='email' id='easebuzz-email' name='email' className='w-full p-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200' placeholder='Enter your email' required />
//                                 </div>
//                             </div>

//                             <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
//                                 <div className='w-full'>
//                                     <label htmlFor='easebuzz-phone' className='block mb-2 text-sm font-semibold text-gray-700'>Phone Number *</label>
//                                     <Input {...registerEasebuzz('phone')} type='text' id='easebuzz-phone' name='phone' className='w-full p-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200' placeholder='Enter your phone number' required />
//                                 </div>

//                                 <div className='w-full'>
//                                     <label htmlFor='easebuzz-amount' className='block mb-2 text-sm font-semibold text-gray-700'>Amount *</label>
//                                     <Input {...registerEasebuzz('amount')} type='number' id='easebuzz-amount' name='amount' className='w-full p-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200' placeholder='Enter amount' required />
//                                 </div>
//                             </div>

//                             <div className='w-full'>
//                                 <label htmlFor='easebuzz-productinfo' className='block mb-2 text-sm font-semibold text-gray-700'>Course *</label>
//                                 <Input {...registerEasebuzz('productinfo')} type='text' id='easebuzz-productinfo' name='productinfo' className='w-full p-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200' placeholder='Enter your course' required />
//                             </div>

//                             <div className='w-full'>
//                                 <label htmlFor='easebuzz-address1' className='block mb-2 text-sm font-semibold text-gray-700'>Address *</label>
//                                 <Input {...registerEasebuzz('address1')} type='text' id='easebuzz-address1' name='address1' className='w-full p-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200' placeholder='Enter your address' required />
//                             </div>

//                             <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
//                                 <div className='w-full'>
//                                     <label htmlFor='easebuzz-country' className='block mb-2 text-sm font-semibold text-gray-700'>Country *</label>
//                                     <Input {...registerEasebuzz('country')} type='text' id='easebuzz-country' name='country' className='w-full p-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200' placeholder='Enter your country' defaultValue="India" required />
//                                 </div>

//                                 <div className='w-full'>
//                                     <label htmlFor='easebuzz-state' className='block mb-2 text-sm font-semibold text-gray-700'>State *</label>
//                                     <Input {...registerEasebuzz('state')} type='text' id='easebuzz-state' name='state' className='w-full p-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200' placeholder='Enter your state' required />
//                                 </div>
//                             </div>
                            
//                             <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
//                                 <div className='w-full'>
//                                     <label htmlFor='easebuzz-city' className='block mb-2 text-sm font-semibold text-gray-700'>City *</label>
//                                     <Input {...registerEasebuzz('city')} type='text' id='easebuzz-city' name='city' className='w-full p-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200' placeholder='Enter your city' required />
//                                 </div>

//                                 <div className='w-full'>
//                                     <label htmlFor='easebuzz-zipcode' className='block mb-2 text-sm font-semibold text-gray-700'>Pin Code *</label>
//                                     <Input {...registerEasebuzz('zipcode')} type='text' id='easebuzz-zipcode' name='zipcode' className='w-full p-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200' placeholder='Enter your pin code' required />
//                                 </div>
//                             </div>

//                             <Button 
//                                 type='submit' 
//                                 className='w-full h-12 mt-6 text-lg font-semibol bg-gradient-to-tl from-[#C6151D] to-[#600A0E] hover:from-green-700 hover:to-green-900 text-white rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200' 
//                                 disabled={easebuzzSubmitting}
//                             >
//                                 {easebuzzSubmitting ? (
//                                     <div className="flex items-center justify-center">
//                                         <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
//                                         Processing...
//                                     </div>
//                                 ) : (
//                                     'Pay'
//                                 )}
//                             </Button>

//                             <div className="bg-green-100 border border-green-300 rounded-lg p-3">
//                                 <p className="text-xs text-green-700 font-medium">✓ 256-bit SSL Encrypted</p>
//                                 <p className="text-xs text-green-700">✓ PCI DSS Compliant</p>
//                                 <p className="text-xs text-green-700">✓ Instant Payment Confirmation</p>
//                             </div>
//                         </form>
//                     </div>
//                 </div>

//             </div>
//         </div>
//     )
// }

// export default FormContact
import Loader from '@/components/common/Loader/Loader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Image from 'next/image';

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
        <div id="payment-section" className="w-full max-w-7xl mx-auto p-6 my-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto">
                
                {/* Left Section - QR Code */}
                <div className="lg:col-span-6 order-1 lg:order-1">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 shadow-lg border border-blue-200 h-full">
                        <div className="text-center">
                            <div className="bg-gradient-to-tl from-[#C6151D] to-[#600A0E] text-white px-4 py-2 rounded-lg mb-3 font-bold text-sm inline-block">
                                    OPTION - 1
                                </div>
                            <h3 className="text-lg font-bold text-gray-800 mb-1">QR Scan & Pay</h3>
                            <p className="text-sm text-gray-600 mb-2">Scan with any UPI app</p>
                            <div className="flex justify-center space-x-2 mb-4">
                                <Image src="/header/upi.png" alt="UPI Payment" width={32} height={32} className="w-8 h-8" />
                                <Image src="/header/gpay.png" alt="Google Pay" width={40} height={32} className="w-10 h-8" />
                                <Image src="/header/paytem.png" alt="Paytm" width={40} height={32} className="w-10 h-8" />
                                <Image src="/header/phonepay.png" alt="PhonePe" width={40} height={32} className="w-10 h-8" />
                                <Image src="/header/amazonpay.png" alt="Amazon Pay" width={40} height={40} className="w-10 h-10" />
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow-inner mb-4">
                                <Image 
                                    src="/navbar/qr.jpeg" 
                                    alt="QR Code for Payment" 
                                    width={200}
                                    height={200}
                                    className="w-full max-w-[200px] mx-auto"
                                />
                            </div>
                            
                            <div className="bg-green-100 border border-green-300 rounded-lg p-3">
                                <p className="text-xs text-green-700 font-medium">✓ Instant Payment</p>
                                <p className="text-xs text-green-700">✓ 100% Secure</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Middle Section - Form */}
                <div className="lg:col-span-6 order-2 lg:order-2">
                    <div
                        className='p-[3px] shadow-xl flex items-center justify-center w-full border-2 border-red-800 h-full rounded-2xl'
                      
                    >
                        <form className='w-full flex flex-col gap-4 p-5 rounded-2xl bg-white h-full' onSubmit={handleSubmit(onSubmit)}>
                            <div className='mb-4 text-center'>
                                <div className="bg-gradient-to-tl from-[#C6151D] to-[#600A0E] text-white px-4 py-2 rounded-lg mb-3 font-bold text-sm inline-block">
                                    OPTION - 2
                                </div>
                                <div className='font-bold text-2xl md:text-3xl text-gray-800 mb-2'>By Credit Card & Debit Card</div>
                                
                                {/* Credit Card and Debit Card Logos */}
                                <div className="flex justify-center items-center gap-3 mb-3">
                                    <Image src="/header/visa.png" alt="Visa Card" width={48} height={32} className="w-12 h-8 object-contain" />
                                    <Image src="/header/mastercard.png" alt="Mastercard" width={48} height={32} className="w-12 h-8 object-contain" />
                                    <Image src="/header/atm.webp" alt="Debit Card" width={48} height={48} className="w-12 h-12 object-contain" />
                                </div>

                                <div className="text-sm text-gray-600 mb-1">Enter Your Details</div>
                                <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
                            </div>

                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div className='w-full'>
                                    <label htmlFor='fullName' className='block mb-2 text-sm font-semibold text-gray-700'>Full Name *</label>
                                    <Input {...register('fullName')} type='text' id='fullName' name='fullName' className='w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200' placeholder='Enter your full name' required />
                                </div>

                                <div className='w-full'>
                                    <label htmlFor='email' className='block mb-2 text-sm font-semibold text-gray-700'>Email Address *</label>
                                    <Input {...register('email')} type='email' id='email' name='email' className='w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200' placeholder='Enter your email' required />
                                </div>
                            </div>

                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div className='w-full'>
                                    <label htmlFor='phone' className='block mb-2 text-sm font-semibold text-gray-700'>Phone Number *</label>
                                    <Input {...register('phone')} type='text' id='phone' name='phone' className='w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200' placeholder='Enter your phone number' required />
                                </div>

                                <div className='w-full'>
                                    <label htmlFor='amount' className='block mb-2 text-sm font-semibold text-gray-700'>Amount *</label>
                                    <Input {...register('amount')} type='text' id='amount' name='amount' className='w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200' placeholder='Enter course fee' required />
                                </div>
                            </div>

                            <div className='w-full'>
                                <label htmlFor='course' className='block mb-2 text-sm font-semibold text-gray-700'>Course *</label>
                                <Input {...register('course')} type='text' id='course' name='course' className='w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200' placeholder='Enter your course' required />
                            </div>

                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div className='w-full'>
                                    <label htmlFor='country' className='block mb-2 text-sm font-semibold text-gray-700'>Country *</label>
                                    <Input {...register('country')} type='text' id='country' name='country' className='w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200' placeholder='Enter your country' required />
                                </div>

                                <div className='w-full'>
                                    <label htmlFor='state' className='block mb-2 text-sm font-semibold text-gray-700'>State *</label>
                                    <Input {...register('state')} type='text' id='state' name='state' className='w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200' placeholder='Enter your state' required />
                                </div>
                            </div>
                            
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div className='w-full'>
                                    <label htmlFor='city' className='block mb-2 text-sm font-semibold text-gray-700'>City *</label>
                                    <Input {...register('city')} type='text' id='city' name='city' className='w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200' placeholder='Enter your city' required />
                                </div>

                                <div className='w-full'>
                                    <label htmlFor='pinCode' className='block mb-2 text-sm font-semibold text-gray-700'>Pin Code *</label>
                                    <Input {...register('pinCode')} type='text' id='pinCode' name='pinCode' className='w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200' placeholder='Enter your pin code' required />
                                </div>
                            </div>

                            <Button 
                                type='submit' 
                                className='w-full h-12 mt-6 text-lg font-semibold bg-gradient-to-tl from-[#C6151D] to-[#600A0E] hover:from-blue-700 hover:to-purple-700 text-white rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200' 
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        Processing...
                                    </div>
                                ) : (
                                    'Proceed to Payment'
                                )}
                            </Button>
                            {submitSuccess && (
                                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg text-center">
                                    <p className="font-medium">Form submitted successfully! We'll reach you soon!</p>
                                </div>
                            )}
                        </form>
                    </div>
                </div>

                {/* Right Section - Bank Details */}
       
            </div>
        </div>
    )
}

export default FormContact


        //  <div className="lg:col-span-3 order-3">
        //             <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 shadow-lg border border-green-200 h-full relative">
                        
        //                 {/* Kotak Logo - Top Right Corner */}
                      
                        
        //                 <div className="text-center mb-6">
        //                     <div className="bg-gradient-to-tl from-[#C6151D] to-[#600A0E] text-white px-4 py-2 rounded-lg mb-3 font-bold text-sm inline-block">
        //                         OPTION - 3
        //                     </div>
        //                     <h3 className="text-lg font-bold text-gray-800">Transfer to Bank</h3>
        //                     <div className="flex justify-center items-center ">
        //                             <Image src="/header/kotak.png" alt="Kotak Mahindra Bank" width={80} height={24} className="w-20 h-6 object-contain" />
        //                             {/* <Image src="/header/mastercard.png" alt="Mastercard" width={48} height={32} className="w-12 h-8 object-contain" /> */}
        //                         </div>
        //                     <p className="text-sm text-gray-600">Direct bank transfer details</p>
        //                 </div>
                        
        //                 <div className="space-y-2">
        //                     <div className="bg-white rounded-lg p-2 shadow-sm border border-gray-100">
        //                         <div className="text-xs text-gray-500 mb-1">Account Name</div>
        //                         <div className="font-semibold text-gray-800">Techpratham Training and Development Pvt. Ltd.</div>
        //                     </div>
                            
        //                     <div className="bg-white rounded-lg p-2 shadow-sm border border-gray-100">
        //                         <div className="text-xs text-gray-500 mb-1">Account Number</div>
        //                         <div className="font-mono text-sm font-semibold text-gray-800">7949729016</div>
        //                     </div>
                            
        //                     <div className="bg-white rounded-lg p-2 shadow-sm border border-gray-100">
        //                         <div className="text-xs text-gray-500 mb-1">IFSC Code</div>
        //                         <div className="font-mono text-sm font-semibold text-gray-800">KKBK0000181</div>
        //                     </div>
                            
        //                     <div className="bg-white rounded-lg p-2 shadow-sm border border-gray-100">
        //                         <div className="text-xs text-gray-500 mb-1">Bank Name</div>
        //                         <div className="font-semibold text-gray-800">Kotak Mahindra Bank</div>
        //                     </div>
                            
        //                     <div className="bg-white rounded-lg p-2 shadow-sm border border-gray-100">
        //                         <div className="text-xs text-gray-500 mb-1">Branch</div>
        //                         <div className="font-semibold text-sm text-gray-800">Kotak Mahindra Bank, Sector 18, Noida (Uttar Pradesh)</div>
        //                     </div>
        //                 </div>
                        
        //                 <div className="mt-6 bg-yellow-100 border border-yellow-300 rounded-lg p-3">
        //                     <p className="text-xs text-yellow-700 font-medium">⚠️ Important Note</p>
        //                     <p className="text-xs text-yellow-700 mt-1">Please share payment screenshot after transfer for verification.</p>
        //                 </div>
        //             </div>
        //         </div>