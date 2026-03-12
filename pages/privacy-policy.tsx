import React from 'react';
import Navbar from '@/src/common/Navbar/Navbar';
import Footer from '@/src/common/Footer/Footer';

const PrivacyPolicy = () => {
    return (
        <React.Fragment>
            <Navbar />
            <div className='w-full h-auto flex flex-col items-center justify-center pt-36 pb-16'>
                <div className='md:w-10/12 w-11/12 text-black'>

                    {/* Header */}
                    <div className='text-center mb-12'>
                        <h1 className='text-4xl font-bold text-gray-900 mb-4'>Privacy Policy</h1>
                        <div className='w-24 h-1 bg-blue-600 mx-auto'></div>
                    </div>

                    {/* Introduction */}
                    <div className='mb-8'>
                        <p className='text-gray-700 leading-relaxed text-lg'>
                            At Tech Pratham, we prioritize the protection of your privacy while delivering exceptional services. 
                            We are committed to safeguarding the privacy, confidentiality, and accuracy of personal information 
                            as per applicable laws. We take all necessary measures to ensure your data remains secure throughout 
                            our operations.
                        </p>
                    </div>

                    {/* Information We Collect */}
                    <div className='mb-8'>
                        <h2 className='text-2xl font-semibold text-gray-900 mb-4'>Information We Collect</h2>
                        <p className='text-gray-700 leading-relaxed mb-4'>
                            We may collect the following types of information:
                        </p>
                        <ul className='list-disc list-inside space-y-2 text-gray-700 ml-4'>
                            <li>Demographic details such as postal code, preferences, and interests.</li>
                            <li>Information related to your inquiries, surveys, or offers.</li>
                            <li>Your Name and Job Designation.</li>
                            <li>Contact information, including email addresses.</li>
                        </ul>
                        <p className='text-gray-700 leading-relaxed mt-4'>
                            We are dedicated to ensuring your information is protected. To prevent unauthorized access, 
                            we have implemented suitable physical, electronic, and managerial procedures to secure the 
                            data we collect online.
                        </p>
                    </div>

                    {/* How We Use Cookies */}
                    <div className='mb-8'>
                        <h2 className='text-2xl font-semibold text-gray-900 mb-4'>How We Use Cookies</h2>
                        <p className='text-gray-700 leading-relaxed mb-4'>
                            Cookies allow websites to recognize you as an individual and personalize your browsing experience. 
                            They help customize the website based on your preferences, needs, and dislikes by collecting 
                            information about your activities.
                        </p>
                        <p className='text-gray-700 leading-relaxed mb-4'>
                            We use traffic log cookies to understand which pages are being visited, enabling us to analyze 
                            website performance and improve user experience. This data is only used for statistical purposes 
                            and is removed from the system once processed.
                        </p>
                        <p className='text-gray-700 leading-relaxed mb-4'>
                            Cookies help us deliver a more tailored browsing experience by remembering the pages you interact 
                            with the most. A cookie cannot access your computer or any personal details unless you choose to 
                            share such data.
                        </p>
                        <p className='text-gray-700 leading-relaxed'>
                            Most web browsers automatically accept cookies, but you can modify your browser settings to decline 
                            cookies if you prefer. Note that declining cookies may limit some features of our website.
                        </p>
                    </div>

                    {/* Links to Other Websites */}
                    <div className='mb-8'>
                        <h2 className='text-2xl font-semibold text-gray-900 mb-4'>Links to Other Websites</h2>
                        <p className='text-gray-700 leading-relaxed mb-4'>
                            Our website may include links to third party websites for additional resources. However, once you 
                            use these links to leave our website, please note that we do not have control over those external sites.
                        </p>
                        <p className='text-gray-700 leading-relaxed'>
                            We are not responsible for protecting the privacy of your information when visiting external websites, 
                            as they operate under their own privacy policies. These sites are not covered by this Privacy Policy.
                        </p>
                    </div>

                    {/* Managing Your Personal Information */}
                    <div className='mb-8'>
                        <h2 className='text-2xl font-semibold text-gray-900 mb-4'>Managing Your Personal Information</h2>
                        <p className='text-gray-700 leading-relaxed mb-4'>
                            You can control how your personal information is collected and used in the following ways:
                        </p>
                        <div className='space-y-4 text-gray-700'>
                            <p className='leading-relaxed'>
                                When filling out forms on the website, check the appropriate box to indicate you do not want 
                                your information used for direct marketing purposes. If you have previously agreed to the use 
                                of your data for direct marketing, you can revoke your consent by emailing us at{' '}
                                <a href="mailto:techpratham56@gmail.com" className='text-blue-600 hover:text-blue-800 underline'>
                                    techpratham56@gmail.com
                                </a>
                                .
                            </p>
                            <p className='leading-relaxed'>
                                We will not sell, distribute, or lease your personal information to third parties without your 
                                consent unless required by law. We may use your data to send promotional information about 
                                third-party services that align with your interests if you have approved this.
                            </p>
                            <p className='leading-relaxed'>
                                If you believe any information we hold is incorrect or incomplete, please reach out to us at{' '}
                                <a href="mailto:techpratham56@gmail.com" className='text-blue-600 hover:text-blue-800 underline'>
                                    techpratham56@gmail.com
                                </a>
                                , and we will promptly update it.
                            </p>
                        </div>
                    </div>

                    {/* Online Privacy Policy Only */}
                    <div className='mb-8'>
                        <h2 className='text-2xl font-semibold text-gray-900 mb-4'>Online Privacy Policy Only</h2>
                        <p className='text-gray-700 leading-relaxed'>
                            This policy applies exclusively to information collected via our website and not to offline 
                            data collection.
                        </p>
                    </div>

                    {/* Your Consent */}
                    <div className='mb-8'>
                        <h2 className='text-2xl font-semibold text-gray-900 mb-4'>Your Consent</h2>
                        <p className='text-gray-700 leading-relaxed'>
                            By using our website, you consent to this Privacy Policy. If we make any changes, updates 
                            will be posted on this page.
                        </p>
                    </div>

                    {/* Contact Information */}
                    <div className='bg-gray-50 p-6 rounded-lg border-l-4 border-blue-600'>
                        <h3 className='text-xl font-semibold text-gray-900 mb-2'>Contact Us</h3>
                        <p className='text-gray-700 mb-2'>
                            If you have any questions about this Privacy Policy, please contact us at:
                        </p>
                        <p className='text-gray-700'>
                            Email:{' '}
                            <a href="mailto:techpratham56@gmail.com" className='text-blue-600 hover:text-blue-800 underline'>
                                techpratham56@gmail.com
                            </a>
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

export default PrivacyPolicy