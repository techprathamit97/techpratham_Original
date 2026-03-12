'use client';

import React from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';

const FAQSection = () => {
    const faqs = [
        {
            question: "What are your office hours?",
            answer: "Our offices are open Monday to Saturday from 9:00 AM to 6:00 PM IST. We're closed on Sundays and public holidays. For urgent inquiries outside business hours, you can reach us via email or WhatsApp."
        },
        {
            question: "How can I schedule a visit to your office?",
            answer: "You can schedule a visit by calling us at +91-8882178896 or sending an email to info@techpratham.com. We recommend booking an appointment in advance to ensure our team is available to assist you."
        },
        {
            question: "Do you offer online consultations?",
            answer: "Yes, we offer online consultations via video calls, phone calls, and email. Contact us to schedule a convenient time for your online consultation."
        },
        {
            question: "Which office should I visit for course enrollment?",
            answer: "You can visit any of our offices for course enrollment. All our locations offer the same services and support. Choose the office closest to you for convenience."
        },
        {
            question: "How quickly can I expect a response to my inquiry?",
            answer: "We typically respond to email inquiries within 24 hours on business days. For immediate assistance, we recommend calling us or using WhatsApp chat during business hours."
        },
        {
            question: "Can I get a callback from your team?",
            answer: "Absolutely! Fill out the contact form on this page with your details and preferred time, and our team will call you back at your convenience."
        }
    ];

    return (
        <div className='w-full h-auto flex flex-col items-center justify-center py-16 bg-gradient-to-b from-white to-gray-50'>
            <div className='md:w-10/12 w-11/12 h-auto flex flex-col gap-8'>
                <div className='text-center'>
                    <div className='flex items-center justify-center gap-3 mb-3'>
                       
                        <h2 className='text-3xl md:text-4xl font-bold text-[#7f1d1d]'>Frequently Asked Questions</h2>
                        
                    </div>
                     <svg
          className="mx-auto"
          width="340"
          height="6"
          viewBox="0 0 340 6"
          preserveAspectRatio="none"
        >
          <path
            d="M0 3 Q170 0 340 3 Q170 6 0 3 Z"
            fill="#7f1d1d"
          />
        </svg>
                    <p className='text-gray-600 text-lg'>Quick answers to common questions about contacting us</p>
                </div>

                <div className='w-full max-w-4xl mx-auto'>
                    <Accordion type="single" collapsible className="w-full space-y-4">
                        {faqs.map((faq, index) => (
                            <AccordionItem 
                                key={index} 
                                value={`item-${index}`}
                                className='border border-gray-200 rounded-xl px-6 bg-white hover:shadow-lg transition-all duration-300'
                            >
                                <AccordionTrigger className='text-left font-semibold text-gray-900 hover:text-[#C6151D] transition-colors py-5'>
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className='text-gray-600 leading-relaxed pb-5'>
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>

                <div className='text-center mt-8'>
                    <p className='text-gray-600 mb-4'>Still have questions?</p>
                    <a
                        href='mailto:info@techpratham.com'
                        className='inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#600A0E] to-[#C6151D] text-white font-semibold rounded-full hover:shadow-xl transition-all duration-300 hover:scale-105'
                    >
                        Contact Our Support Team
                    </a>
                </div>
            </div>
        </div>
    );
};

export default FAQSection;
