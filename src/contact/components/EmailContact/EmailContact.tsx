import { ArrowTopRightIcon, EnvelopeClosedIcon, ChatBubbleIcon, QuestionMarkCircledIcon } from '@radix-ui/react-icons';
import React from 'react';

const EmailContact = () => {
    const contactOptions = [
        {
            title: "General Information",
            description: "Get in touch with our team for general questions, partnerships, or collaboration opportunities.",
            email: "info@techpratham.com",
            icon: <EnvelopeClosedIcon className="w-5 h-5 text-[#C6151D]" />
        },
        {
            title: "Human Resources",
            description: "Career opportunities, job applications, and HR-related inquiries.",
            email: "hr@techpratham.com",
            icon: <ChatBubbleIcon className="w-5 h-5 text-[#C6151D]" />
        },
        {
            title: "Accounts & Billing",
            description: "Questions about invoices, payments, billing, and financial matters.",
            email: "accounts@techpratham.com",
            icon: <QuestionMarkCircledIcon className="w-5 h-5 text-[#C6151D]" />
        }
    ];

    const handleEmailClick = (email: string) => {
        window.open(`mailto:${email}`, '_blank');
    };

    return (
        <div className='md:w-full w-11/12 h-auto flex flex-col items-center justify-center md:py-16 py-8 px-0 bg-white'>
           <div className="md:w-10/12 w-full h-auto flex flex-col items-start justify-center mb-8">
  
  <div className="text-2xl font-semibold text-[#7f1d1d]">
    Contact Us
  </div>

  <svg
    width="130"
    height="6"
    viewBox="0 0 340 6"
    preserveAspectRatio="none"
    className="mt-2"
  >
    <path
      d="M0 3 Q170 0 340 3 Q170 6 0 3 Z"
      fill="#7f1d1d"
    />
  </svg>

</div>

            <div className='md:w-10/12 w-full h-auto flex flex-col md:flex-row items-stretch justify-center gap-6'>
                {contactOptions.map((option, index) => (
                    <div
                        key={index}
                        onClick={() => handleEmailClick(option.email)}
                        className="flex-1 group py-8 px-6 cursor-pointer border border-gray-200 rounded-xl bg-white text-black hover:border-gray-300 transition-all duration-300 flex flex-col"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                {option.icon}
                                <h3 className="text-lg md:text-xl font-semibold text-gray-900 tracking-tight">
                                    {option.title}
                                </h3>
                            </div>
                            <ArrowTopRightIcon className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                        </div>

                        <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-4 min-h-[3rem] flex-grow">
                            {option.description}
                        </p>

                        <div className="flex items-center gap-2 text-base font-medium text-[#C6151D]">
                            <EnvelopeClosedIcon className="w-5 h-5" />
                            <span>{option.email}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EmailContact;