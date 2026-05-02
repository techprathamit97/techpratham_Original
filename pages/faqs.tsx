import React from 'react';
import ReachForm from '@/components/common/ReachForm/ReachForm';
import ToolTip from '@/components/common/ToolTip/ToolTip';
import HeaderFaqs from '@/src/faqs/components/HeaderFaqs/HeaderFaqs';
import Navbar from '@/src/common/Navbar/Navbar';
import Footer from '@/src/common/Footer/Footer';
import ContentFaqs from '@/src/faqs/components/ContentFaqs/ContentFaqs';
import Head from 'next/head';
import type { NextPage, GetServerSideProps } from 'next';
import { NavbarData } from '@/utils/navbarData';
import { withNavbarSSR } from '@/utils/withNavbarSSR';

interface FaqsProps {
    navbarData: NavbarData;
}

const faqs: NextPage<FaqsProps> = ({ navbarData }) => {
    return (
        <React.Fragment>
            <Head>
                <link rel="icon" href="/favicon.ico" type="image/ico" sizes="70x70" />
                <title>FAQs | TechPratham - Frequently Asked Questions</title>
                <meta name="description" content="Find answers to frequently asked questions about TechPratham’s IT training programs, certifications, admissions, courses, fees, and learning process." />
                <meta name="keywords" content="TechPratham FAQs, IT Training FAQs, TechPratham Help, Course Queries, Admission FAQs, Certification Questions, IT Institute Support" />
                <meta name="author" content="the-bipu" />

                <meta property="og:title" content="FAQs | TechPratham - Frequently Asked Questions" />
                <meta property="og:description" content="Have questions about TechPratham? Explore our FAQs to learn more about our IT training programs, certifications, and admission process." />
                <meta property="og:image" content="/navbar/techpratham.svg" />
                <meta property="og:url" content="https://www.techpratham.com/faqs" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="FAQs | TechPratham - Frequently Asked Questions" />
                <meta name="twitter:description" content="Find quick answers to common questions about TechPratham’s IT courses, admissions, and certifications." />
                <meta name="twitter:image" content="/navbar/techpratham.svg" />
            </Head>

            <Navbar navbarData={navbarData} />

            <div className='w-full h-auto flex flex-col items-center justify-center'>

                <ReachForm />

                <ToolTip />

                <HeaderFaqs />

                <ContentFaqs />

            </div>

            <Footer />
        </React.Fragment>
    )
}

export default faqs;

// Add navbar SSR
export const getServerSideProps = withNavbarSSR();