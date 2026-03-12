import React from 'react';
import Head from 'next/head';

import type { NextPage } from 'next';
import { IndexController } from '@/src/index/controller/IndexController';
import PaymentView from '@/src/payment/views/PaymentView';

const PaymentPage: NextPage = (props) => (
  <div>
    <IndexController {...props}>
      <Head>
        <link rel="icon" href="/favicon.ico" type="image/ico" sizes="70x70" />
        <title>Payment | TechPratham - Tech Insights & Career Tips</title>
        <meta name="description" content="Explore insightful payment options and guides at TechPratham." />
        <meta name="keywords" content="TechPratham Payment, IT Career Tips, Software Development Articles, Tech Insights, Programming Guides" />
        <meta name="author" content="the-bipu" />

        <meta property="og:title" content="Payment | TechPratham - Tech Insights & Career Tips" />
        <meta property="og:description" content="Explore insightful payment options and guides at TechPratham." />
        <meta property="og:image" content="/navbar/techpratham.svg" />
        <meta property="og:url" content="https://www.techpratham.com/payment" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Payment | TechPratham - Tech Insights & Career Tips" />
        <meta name="twitter:description" content="Explore insightful payment options and guides at TechPratham." />
        <meta name="twitter:image" content="/navbar/techpratham.svg" />
      </Head>

      <PaymentView />
    </IndexController>
  </div>
);

export default PaymentPage;