import React from 'react';
import Head from 'next/head';

import type { NextPage } from 'next';
import { IndexController } from '@/src/index/controller/IndexController';

import AboutView from '@/src/about/views/AboutView';

const AboutPage: NextPage = (props) => (
    <div>
        <IndexController {...props}>
            <Head>
                <link rel="icon" href="/favicon.ico" type="image/ico" sizes="70x70" />
                <title>About Us | TechPratham - India's Leading IT Training Institute</title>
                <meta name="description" content="Learn more about TechPratham, India's leading IT Training Institute. Discover our mission, vision, team, and commitment to delivering top-notch IT education and corporate learning solutions." />
                <meta name="keywords" content="About TechPratham, IT Training Institute, Our Team, Our Mission, Corporate Learning, IT Education, Best IT Institute India" />
                <meta name="author" content="the-bipu" />

                <meta property="og:title" content="About Us | TechPratham - India's Leading IT Training Institute" />
                <meta property="og:description" content="Learn more about TechPratham, our mission, vision, and commitment to delivering the best IT education and corporate learning in India." />
                <meta property="og:image" content="/navbar/techpratham.svg" />
                <meta property="og:url" content="https://www.techpratham.com/about-us" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="About Us | TechPratham - India's Leading IT Training Institute" />
                <meta name="twitter:description" content="Discover TechPratham's story, our team, and our dedication to providing top-quality IT training and corporate learning solutions." />
                <meta name="twitter:image" content="/navbar/techpratham.svg" />
            </Head>

            <AboutView />
        </IndexController>
    </div>
);

export default AboutPage;