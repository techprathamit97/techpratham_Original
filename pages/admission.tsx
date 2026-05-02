import React from 'react';
import Head from 'next/head';

import type { NextPage, GetServerSideProps } from 'next';
import AdmissionView from '@/src/admission/views/AdmissionView';
import { IndexController } from '@/src/index/controller/IndexController';
import { NavbarData } from '@/utils/navbarData';
import { withNavbarSSR } from '@/utils/withNavbarSSR';

interface AdmissionPageProps {
    navbarData: NavbarData;
}

const AdmissionPage: NextPage<AdmissionPageProps> = ({ navbarData }) => (
  <div>
    <IndexController navbarData={navbarData}>
      <Head>
        <link rel="icon" href="/favicon.ico" type="image/ico" sizes="70x70" />
        <title>Admission | TechPratham - Apply for IT Training Programs</title>
        <meta name="description" content="Apply for IT training programs at TechPratham. Start your journey with our expert-led courses and boost your career in technology." />
        <meta name="keywords" content="TechPratham Admission, IT Training Application, Enroll TechPratham, IT Courses Admission, Training Registration" />
        <meta name="author" content="the-bipu" />

        <meta property="og:title" content="Admission | TechPratham - Apply for IT Training Programs" />
        <meta property="og:description" content="Join TechPratham's IT training programs. Apply now to enhance your skills with industry-leading instructors." />
        <meta property="og:image" content="/navbar/techpratham.svg" />
        <meta property="og:url" content="https://www.techpratham.com/admission" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Admission | TechPratham - Apply for IT Training Programs" />
        <meta name="twitter:description" content="Apply for IT training at TechPratham. Take the next step in your tech career with our expert-led courses." />
        <meta name="twitter:image" content="/navbar/techpratham.svg" />
      </Head>

      <AdmissionView />
    </IndexController>
  </div>
);

export const getServerSideProps: GetServerSideProps<AdmissionPageProps> = withNavbarSSR();

export default AdmissionPage;