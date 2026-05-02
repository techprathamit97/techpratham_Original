import React from 'react';
import Head from 'next/head';

import type { NextPage, GetServerSideProps } from 'next';
import { IndexController } from '@/src/index/controller/IndexController';
import { NavbarData } from '@/utils/navbarData';
import { withNavbarSSR } from '@/utils/withNavbarSSR';
import JobsView from '@/src/jobs/views/JobsView';

interface JobOpeningsPageProps {
    navbarData: NavbarData;
}

const JobOpeningsPage: NextPage<JobOpeningsPageProps> = ({ navbarData }) => (
    <div>
        <IndexController navbarData={navbarData}>
            <Head>
                <link rel="icon" href="/favicon.ico" type="image/ico" sizes="70x70" />
                <title>Job Openings | TechPratham - Careers & Opportunities</title>
                <meta name="description" content="Explore current job openings at TechPratham. Join our team and advance your career in IT education and training." />
                <meta name="keywords" content="TechPratham Jobs, IT Careers, Job Openings, TechPratham Careers, IT Training Jobs, Work at TechPratham" />
                <meta name="author" content="the-bipu" />

                <meta property="og:title" content="Job Openings | TechPratham - Careers & Opportunities" />
                <meta property="og:description" content="Discover exciting career opportunities at TechPratham and become part of our mission to empower IT professionals." />
                <meta property="og:image" content="/navbar/techpratham.svg" />
                <meta property="og:url" content="https://www.techpratham.com/job-openings" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Job Openings | TechPratham - Careers & Opportunities" />
                <meta name="twitter:description" content="Apply for the latest job openings at TechPratham and grow your career in IT education." />
                <meta name="twitter:image" content="/navbar/techpratham.svg" />
            </Head>

            <JobsView />
        </IndexController>
    </div>
);

export const getServerSideProps: GetServerSideProps<JobOpeningsPageProps> = withNavbarSSR();

export default JobOpeningsPage;