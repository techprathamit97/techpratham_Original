import React from 'react';
import Head from 'next/head';

import type { NextPage, GetServerSideProps } from 'next';
import TrainingView from '@/src/training/views/TrainingView';
import { IndexController } from '@/src/index/controller/IndexController';
import { NavbarData } from '@/utils/navbarData';
import { withNavbarSSR } from '@/utils/withNavbarSSR';
import ReviewsView from '@/src/reviews/views/ReviewsView';

interface TrainingPageProps {
    navbarData: NavbarData;
}

const TrainingPage: NextPage<TrainingPageProps> = ({ navbarData }) => (
    <div>
        <IndexController navbarData={navbarData}>
            <Head>
                <link rel="icon" href="/favicon.ico" type="image/ico" sizes="70x70" />
                <title>TechPratham Reviews | Tech Pratham Feedback</title>
                <meta name="description" content="Read TechPratham reviews and Tech Pratham feedback to explore customer experiences, student opinions, and feedback about TechPratham." />
                <meta name="keywords" content="TechPratham Reviews, Tech Pratham Feedback, TechPratham Customer Reviews, TechPratham Student Reviews, TechPratham Testimonials, TechPratham Experiences, TechPratham Opinions" />
                <meta name="author" content="techpratham" />

                <meta property="og:title" content="TechPratham Reviews | Tech Pratham Feedback" />
                <meta property="og:description" content="Read TechPratham reviews and Tech Pratham feedback to explore customer experiences, student opinions, and feedback about TechPratham." />
                <meta property="og:image" content="/navbar/techpratham.svg" />
                <meta property="og:url" content="https://www.techpratham.com/review" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="TechPratham Reviews | Tech Pratham Feedback" />
                <meta name="twitter:description" content="Read TechPratham reviews and Tech Pratham feedback to explore customer experiences, student opinions, and feedback about TechPratham." />
                <meta name="twitter:image" content="/navbar/techpratham.svg" />
            </Head>

            <ReviewsView/>
        </IndexController>
    </div>
);

export const getServerSideProps: GetServerSideProps<TrainingPageProps> = withNavbarSSR();

export default TrainingPage;