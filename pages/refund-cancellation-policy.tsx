import Footer from '@/src/common/Footer/Footer';
import Navbar from '@/src/common/Navbar/Navbar';
import React from 'react';

const CancellationRefundPolicy = () => {
    return (
        <React.Fragment>
            <Navbar />
            <div className='w-full h-auto flex flex-col items-center justify-center pt-36 pb-16'>
                <div className='md:w-10/12 w-11/12 text-black'>
                    {/* Header */}
                    <div className='text-center mb-12'>
                        <h1 className='text-4xl font-bold text-gray-900 mb-4'>Cancellation & Refund Policy</h1>
                        <div className='w-24 h-1 bg-blue-600 mx-auto'></div>
                    </div>

                    {/* Introduction */}
                    <div className='mb-8 bg-green-50 p-6 rounded-lg border-l-4 border-green-600'>
                        <h2 className='text-xl font-semibold text-gray-900 mb-3'>Our Success Story</h2>
                        <p className='text-gray-700 leading-relaxed'>
                            Explore the achievements of our successfully placed learners through our placement platform. 
                            Many are now working with leading multinational corporations, earning exceptional salaries 
                            that once seemed unattainable. It's now your opportunity to join their ranks.
                        </p>
                    </div>

                    {/* Refund Policy */}
                    <div className='mb-8'>
                        <h2 className='text-2xl font-semibold text-gray-900 mb-4'>Refund Policy</h2>
                        <div className='space-y-3'>
                            <div className='flex items-start'>
                                <span className='inline-block w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0'></span>
                                <p className='text-gray-700 leading-relaxed'>
                                    Refund requests will not be entertained after attending the first session of the enrolled course.
                                </p>
                            </div>
                            <div className='flex items-start'>
                                <span className='inline-block w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0'></span>
                                <p className='text-gray-700 leading-relaxed'>
                                    Refunds will not be granted if access to course materials has been shared with others by the user.
                                </p>
                            </div>
                            <div className='flex items-start'>
                                <span className='inline-block w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0'></span>
                                <p className='text-gray-700 leading-relaxed'>
                                    No refunds will be issued once the training session has been scheduled and commenced for the participant.
                                </p>
                            </div>
                            <div className='flex items-start'>
                                <span className='inline-block w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0'></span>
                                <p className='text-gray-700 leading-relaxed'>
                                    Refund claims submitted beyond the specified refund window will not be processed under any circumstances.
                                </p>
                            </div>
                            <div className='flex items-start'>
                                <span className='inline-block w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0'></span>
                                <p className='text-gray-700 leading-relaxed'>
                                    <strong>Refund requests must be initiated within 7 days of payment.</strong> Refund requests 
                                    submitted after this period will not be considered.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 5-Day No Questions Asked Policy */}
                    <div className='mb-8'>
                        <h2 className='text-2xl font-semibold text-gray-900 mb-4'>5-Day No Questions Asked Refund Policy</h2>
                        <p className='text-gray-700 leading-relaxed mb-4'>
                            The "5-Day No Questions Asked Refund Policy" is considered invalid in the following cases:
                        </p>
                        <div className='bg-red-50 p-6 rounded-lg border-l-4 border-red-500'>
                            <div className='space-y-3'>
                                <div className='flex items-start'>
                                    <span className='inline-block w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0'></span>
                                    <p className='text-gray-700 leading-relaxed'>
                                        Course content has been downloaded from the Learning Management System.
                                    </p>
                                </div>
                                <div className='flex items-start'>
                                    <span className='inline-block w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0'></span>
                                    <p className='text-gray-700 leading-relaxed'>
                                        Refunds for official course materials are not available.
                                    </p>
                                </div>
                                <div className='flex items-start'>
                                    <span className='inline-block w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0'></span>
                                    <p className='text-gray-700 leading-relaxed'>
                                        Refund requests for self-paced learning packages will not be accepted.
                                    </p>
                                </div>
                                <div className='flex items-start'>
                                    <span className='inline-block w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0'></span>
                                    <p className='text-gray-700 leading-relaxed'>
                                        Exam fees, if booked through our platform, are non-refundable if our refund policy is misused.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Company Rights */}
                    <div className='mb-8'>
                        <h2 className='text-2xl font-semibold text-gray-900 mb-4'>Company Rights</h2>
                        <div className='bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-500'>
                            <div className='space-y-3'>
                                <p className='text-gray-700 leading-relaxed'>
                                    The company reserves the right to restrict or terminate access to current or future 
                                    services without prior notice.
                                </p>
                                <p className='text-gray-700 leading-relaxed'>
                                    We retain the sole right to revise these terms at any time by updating them on the 
                                    website, with no prior notification required.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Changes to Schedule or Course */}
                    <div className='mb-8'>
                        <h2 className='text-2xl font-semibold text-gray-900 mb-4'>Changes to Schedule or Course</h2>
                        <div className='bg-blue-50 p-6 rounded-lg border-l-4 border-blue-600'>
                            <p className='text-gray-700 leading-relaxed mb-3'>
                                Adjustments to schedules or courses may take between 0 to 3 weeks to accommodate due to 
                                resource availability. While we aim to honor all requests, changes may be denied if 
                                resources are unavailable.
                            </p>
                            <p className='text-gray-700 leading-relaxed'>
                                <strong>Important:</strong> In cases where schedule changes cannot be accommodated, 
                                a 10% administrative fee will apply.
                            </p>
                        </div>
                    </div>

                    {/* Refund Process */}
                    <div className='mb-8'>
                        <h2 className='text-2xl font-semibold text-gray-900 mb-4'>Refund Process</h2>
                        <div className='bg-gray-50 p-6 rounded-lg border-l-4 border-gray-400'>
                            <p className='text-gray-700 leading-relaxed mb-3'>
                                For any cancellation or refund inquiries, kindly email us at{' '}
                                <a href="mailto:techpratham56@gmail.com" className='text-blue-600 hover:text-blue-800 underline font-semibold'>
                                    techpratham56@gmail.com
                                </a>
                            </p>
                            <p className='text-gray-700 leading-relaxed'>
                                <strong>Processing Time:</strong> Refunds will be processed within 30 days of verifying 
                                the validity of the refund request.
                            </p>
                        </div>
                    </div>

                    {/* Important Reminders */}
                    <div className='mb-8'>
                        <h2 className='text-2xl font-semibold text-gray-900 mb-4'>Important Reminders</h2>
                        <div className='grid md:grid-cols-2 gap-4'>
                            <div className='bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500'>
                                <h3 className='font-semibold text-gray-900 mb-2'>⏰ Time Sensitive</h3>
                                <p className='text-gray-700 text-sm leading-relaxed'>
                                    All refund requests must be submitted within 7 days of payment to be eligible for processing.
                                </p>
                            </div>
                            <div className='bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500'>
                                <h3 className='font-semibold text-gray-900 mb-2'>📚 Course Materials</h3>
                                <p className='text-gray-700 text-sm leading-relaxed'>
                                    Downloading course content or sharing access voids your refund eligibility.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className='bg-gray-50 p-6 rounded-lg border-l-4 border-blue-600'>
                        <h3 className='text-xl font-semibold text-gray-900 mb-2'>Contact Us</h3>
                        <p className='text-gray-700 mb-2'>
                            For questions about cancellations, refunds, or policy clarifications:
                        </p>
                        <p className='text-gray-700'>
                            Email:{' '}
                            <a href="mailto:techpratham56@gmail.com" className='text-blue-600 hover:text-blue-800 underline'>
                                techpratham56@gmail.com
                            </a>
                        </p>
                        <p className='text-gray-700 text-sm mt-2 italic'>
                            Please allow up to 48 hours for initial response to your inquiry.
                        </p>
                    </div>

                    {/* Last Updated */}
                    <div className='text-center mt-12 pt-8 border-t border-gray-200'>
                        <p className='text-gray-500 text-sm'>
                            Last updated: {new Date().toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                            })}
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </React.Fragment>
    )
}

export default CancellationRefundPolicy