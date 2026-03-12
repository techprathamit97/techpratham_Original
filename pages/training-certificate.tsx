import React from 'react';
import Head from 'next/head';

import type { NextPage } from 'next';
import CertificateView from '@/src/certificate/views/CertificateView';
import { IndexController } from '@/src/index/controller/IndexController';

const CertificatePage: NextPage = (props) => (
    <div>
        <IndexController {...props}>
            <Head>
                <link rel="icon" href="/favicon.ico" type="image/ico" sizes="70x70" />
                <title>Training Certificate | TechPratham - India's Leading IT Training Institute</title>
                <meta name="description" content="Download and verify your TechPratham training certificates. Showcase your achievements and boost your career with recognized credentials." />
                <meta name="keywords" content="TechPratham Certificate, Training Certificate, IT Certification, Course Completion, TechPratham Credentials" />
                <meta name="author" content="the-bipu" />

                <meta property="og:title" content="Training Certificate | TechPratham - India's Leading IT Training Institute" />
                <meta property="og:description" content="Access and verify your TechPratham training certificates. Demonstrate your skills and accomplishments." />
                <meta property="og:image" content="/navbar/techpratham.svg" />
                <meta property="og:url" content="https://www.techpratham.com/training-certificate" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Training Certificate | TechPratham - India's Leading IT Training Institute" />
                <meta name="twitter:description" content="Showcase your TechPratham training certificates and advance your IT career." />
                <meta name="twitter:image" content="/navbar/techpratham.svg" />
            </Head>

            <CertificateView />
        </IndexController>
    </div>
);

export default CertificatePage;