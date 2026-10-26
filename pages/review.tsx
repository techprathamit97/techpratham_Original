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
                <title>TechPratham Corporate Training | Workday, ServiceNow, SAP & AI</title>
                <meta name="description" content="Explore corporate training in Workday, ServiceNow, SAP and Agentic AI with TechPratham. Discuss practical, role-based learning options for your team." />
                <meta name="keywords" content="Corporate Training, Workday Training, SAP Training, ServiceNow Training, Agentic AI Training, Employee Upskilling, TechPratham Corporate, Role-based Training, Team Training India" />
                <meta name="author" content="techpratham" />

                <meta property="og:title" content="TechPratham Corporate Training | Workday, ServiceNow, SAP & AI" />
                <meta property="og:description" content="Explore corporate training in Workday, ServiceNow, SAP and Agentic AI with TechPratham. Discuss practical, role-based learning options for your team." />
                <meta property="og:image" content="/navbar/techpratham.svg" />
                <meta property="og:url" content="https://www.techpratham.com/corporate-training" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="TechPratham Corporate Training | Workday, ServiceNow, SAP & AI" />
                <meta name="twitter:description" content="Explore corporate training in Workday, ServiceNow, SAP and Agentic AI with TechPratham. Discuss practical, role-based learning options for your team." />
                <meta name="twitter:image" content="/navbar/techpratham.svg" />
            </Head>

            <ReviewsView/>
        </IndexController>
    </div>
);

export const getServerSideProps: GetServerSideProps<TrainingPageProps> = withNavbarSSR();

export default TrainingPage;