import React from 'react';
import Navbar from '@/src/common/Navbar/Navbar';
import Footer from '@/src/common/Footer/Footer';

const TermsConditions = () => {
    return (
        <React.Fragment>
            <Navbar />
            <div className='w-full h-auto flex flex-col items-center justify-center pt-36 pb-16'>
                <div className='md:w-10/12 w-11/12 text-black'>
                    {/* Header */}
                    <div className='text-center mb-12'>
                        <h1 className='text-4xl font-bold text-gray-900 mb-4'>Terms & Conditions</h1>
                        <div className='w-24 h-1 bg-blue-600 mx-auto'></div>
                    </div>

                    {/* Introduction */}
                    <div className='mb-8'>
                        <p className='text-gray-700 leading-relaxed text-lg mb-4'>
                            We are delighted to announce our robust placement assistance program that includes 100% guidance
                            on building impressive resumes, applying for jobs, and receiving expert interview tips from
                            professionals working in top-tier companies.
                        </p>
                        <p className='text-gray-700 leading-relaxed'>
                            Welcome to our website! By accessing and using this website, you agree to comply with the terms
                            and conditions outlined below, along with our Privacy Policy. The terms "we," "us," or "our" refer
                            to Tech Pratham, whose registered office is located at Noida. The term "you" refers to the user
                            or visitor of this website.
                        </p>
                    </div>

                    {/* Website Usage Terms */}
                    <div className='mb-8'>
                        <h2 className='text-2xl font-semibold text-gray-900 mb-4'>Website Usage Terms</h2>
                        <p className='text-gray-700 leading-relaxed mb-4'>
                            The use of this website is governed by the following conditions:
                        </p>
                        <ul className='list-disc list-inside space-y-3 text-gray-700 ml-4'>
                            <li className='leading-relaxed'>
                                The content provided on this website is for general informational purposes only and is
                                subject to change without prior notice.
                            </li>
                            <li className='leading-relaxed'>
                                Neither we nor any third parties offer guarantees regarding the accuracy, reliability,
                                timeliness, or suitability of the materials or information found on this site for any
                                specific purpose. You acknowledge that such materials may contain inaccuracies, and we
                                disclaim liability for any such errors to the fullest extent permitted by law.
                            </li>
                            <li className='leading-relaxed'>
                                The use of any information or materials on this website is entirely at your own risk,
                                and it is your responsibility to ensure that any services or information meet your
                                specific requirements.
                            </li>
                            <li className='leading-relaxed'>
                                Prices, course offerings, and other content may be updated without prior notice.
                            </li>
                            <li className='leading-relaxed'>
                                All content on this website, including but not limited to text, images, and graphics,
                                is either owned by or licensed to us. Unauthorized reproduction or use is prohibited
                                unless in compliance with our copyright notice.
                            </li>
                            <li className='leading-relaxed'>
                                All trademarks displayed on this site, which are not owned by or licensed to us, are
                                acknowledged on the website.
                            </li>
                            <li className='leading-relaxed'>
                                Unauthorized use of this website may result in legal action for damages and/or constitute
                                a criminal offense.
                            </li>
                            <li className='leading-relaxed'>
                                This website may include links to third-party websites for additional information. These
                                links are provided for convenience only, and we do not endorse or assume responsibility
                                for the content of linked sites.
                            </li>
                            <li className='leading-relaxed'>
                                Users are prohibited from creating links to this website from other sites or documents
                                without prior written consent.
                            </li>
                            <li className='leading-relaxed'>
                                Disputes arising from the use of this website will be governed by the laws of India.
                            </li>
                            <li className='leading-relaxed'>
                                <strong>Referral Program:</strong> You can earn discounts on course fees by referring
                                friends, as per the guidelines of our referral policy.
                            </li>
                        </ul>
                    </div>

                    {/* Revisions to Terms */}
                    <div className='mb-8'>
                        <h2 className='text-2xl font-semibold text-gray-900 mb-4'>Revisions to Terms</h2>
                        <p className='text-gray-700 leading-relaxed'>
                            We reserve the right to update or amend these terms at any time without prior notice by
                            publishing the revised terms on this website. It is your responsibility to review the terms
                            regularly. Continued use of the website following such updates constitutes acceptance of the
                            revised terms.
                        </p>
                    </div>

                    {/* Courses and Intellectual Property */}
                    <div className='mb-8'>
                        <h2 className='text-2xl font-semibold text-gray-900 mb-4'>Courses and Intellectual Property</h2>
                        <p className='text-gray-700 leading-relaxed mb-4'>
                            The courses and training materials provided by Tech Pratham may include third-party copyrighted
                            content. Such content is used with the consent of the copyright holders. Unauthorized reproduction,
                            distribution, or use of the course materials may result in legal action.
                        </p>
                        <p className='text-gray-700 leading-relaxed'>
                            In case of any copyright concerns related to the content, you may contact us at{' '}
                            <a href="mailto:techpratham56@gmail.com" className='text-blue-600 hover:text-blue-800 underline'>
                                techpratham56@gmail.com
                            </a>
                            . After proper verification, necessary actions will be taken.
                        </p>
                    </div>

                    {/* Placement Assistance */}
                    <div className='mb-8 bg-blue-50 p-6 rounded-lg border-l-4 border-blue-600'>
                        <h3 className='text-xl font-semibold text-gray-900 mb-3'>Placement Assistance Program</h3>
                        <p className='text-gray-700 leading-relaxed'>
                            Our comprehensive placement assistance program includes professional guidance for resume building,
                            job applications, and interview preparation. While we provide extensive support and resources,
                            job placement depends on various factors including market conditions, individual performance,
                            and employer requirements.
                        </p>
                    </div>

                    {/* Important Notice */}
                    <div className='mb-8 bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-500'>
                        <h3 className='text-xl font-semibold text-gray-900 mb-3'>Important Notice</h3>
                        <p className='text-gray-700 leading-relaxed mb-2'>
                            By using this website and our services, you acknowledge that you have read, understood, and
                            agreed to be bound by these Terms & Conditions.
                        </p>
                        <p className='text-gray-700 leading-relaxed'>
                            These terms are governed by the laws of India, and any disputes will be subject to the
                            jurisdiction of Indian courts.
                        </p>
                    </div>

                    {/* Contact Information */}
                    <div className='bg-gray-50 p-6 rounded-lg border-l-4 border-blue-600'>
                        <h3 className='text-xl font-semibold text-gray-900 mb-2'>Contact Us</h3>
                        <p className='text-gray-700 mb-2'>
                            If you have any questions about these Terms & Conditions, please contact us at:
                        </p>
                        <div className='text-gray-700'>
                            <p className='mb-1'>
                                <strong>Email:</strong>{' '}
                                <a href="mailto:techpratham56@gmail.com" className='text-blue-600 hover:text-blue-800 underline'>
                                    techpratham56@gmail.com
                                </a>
                            </p>
                            <p>
                                <strong>Address:</strong> Noida, India
                            </p>
                        </div>
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

export default TermsConditions