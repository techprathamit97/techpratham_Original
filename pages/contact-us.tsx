import React from 'react';
import Head from 'next/head';

import type { NextPage, GetServerSideProps } from 'next';
import ContactViewNew from '@/src/contact/views/ContactViewNew';
import { IndexController } from '@/src/index/controller/IndexController';
import { NavbarData } from '@/utils/navbarData';
import { withNavbarSSR } from '@/utils/withNavbarSSR';

interface ContactPageProps {
    navbarData: NavbarData;
}

const ContactPage: NextPage<ContactPageProps> = ({ navbarData }) => (
    <div>
        <IndexController navbarData={navbarData}>
            <Head>
                <link rel="icon" href="/favicon.ico" type="image/ico" sizes="70x70" />
                <title>Contact Us | TechPratham - Get in Touch for IT Training Solutions</title>
                <meta name="description" content="Contact TechPratham for customized IT training solutions. Reach out to our team for inquiries, support, or partnership opportunities." />
                <meta name="keywords" content="Contact TechPratham, IT Training Contact, Corporate Training Inquiry, TechPratham Support, Training Solutions, Business IT Contact" />
                <meta name="author" content="the-bipu" />

                <meta property="og:title" content="Contact Us | TechPratham - Get in Touch for IT Training Solutions" />
                <meta property="og:description" content="Connect with TechPratham for expert-led IT training. We're here to answer your questions and discuss your training needs." />
                <meta property="og:image" content="/navbar/techpratham.svg" />
                <meta property="og:url" content="https://www.techpratham.com/contact-us" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Contact Us | TechPratham - Get in Touch for IT Training Solutions" />
                <meta name="twitter:description" content="Reach out to TechPratham for IT training inquiries, support, or partnership discussions. We're ready to help your business grow." />
                <meta name="twitter:image" content="/navbar/techpratham.svg" />
            </Head>

            <ContactViewNew />
        </IndexController>
    </div>
);

export const getServerSideProps: GetServerSideProps<ContactPageProps> = withNavbarSSR();

export default ContactPage;