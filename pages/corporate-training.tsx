import React from 'react';
import Head from 'next/head';

import type { NextPage, GetServerSideProps } from 'next';
import TrainingView from '@/src/training/views/TrainingView';
import { IndexController } from '@/src/index/controller/IndexController';
import { NavbarData } from '@/utils/navbarData';
import { withNavbarSSR } from '@/utils/withNavbarSSR';

interface TrainingPageProps {
    navbarData: NavbarData;
}

const TrainingPage: NextPage<TrainingPageProps> = ({ navbarData }) => (
    <div>
        <IndexController navbarData={navbarData}>
            <Head>
                <link rel="icon" href="/favicon.ico" type="image/ico" sizes="70x70" />
                <title>Corporate Training | TechPratham - Upskill Your Team with Industry Experts</title>
                <meta name="description" content="Empower your workforce with TechPratham's customized corporate IT training solutions. Enhance productivity, bridge skill gaps, and drive business growth with expert-led programs." />
                <meta name="keywords" content="Corporate Training, IT Training for Companies, Employee Upskilling, TechPratham Corporate, Customized Training, Business IT Solutions, Team Training India" />
                <meta name="author" content="the-bipu" />

                <meta property="og:title" content="Corporate Training | TechPratham - Upskill Your Team with Industry Experts" />
                <meta property="og:description" content="Empower your workforce with tailored IT training from TechPratham. Drive business success with expert-led corporate learning solutions." />
                <meta property="og:image" content="/navbar/techpratham.svg" />
                <meta property="og:url" content="https://www.techpratham.com/corporate-training" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Corporate Training | TechPratham - Upskill Your Team with Industry Experts" />
                <meta name="twitter:description" content="Boost your team's skills with TechPratham's corporate IT training programs. Customized solutions for business growth and productivity." />
                <meta name="twitter:image" content="/navbar/techpratham.svg" />
            </Head>

            <TrainingView />
        </IndexController>
    </div>
);

export const getServerSideProps: GetServerSideProps<TrainingPageProps> = withNavbarSSR();

export default TrainingPage;