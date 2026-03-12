import React from 'react';
import Head from 'next/head';
import type { NextPage } from 'next';
import ReviewView from '@/src/review/views/ReviewView';
import { IndexController } from '@/src/index/controller/IndexController';

const ReviewsPage: NextPage = (props) => (
  <div>
    <IndexController {...props}>
      <Head>
        <link rel="icon" href="/favicon.ico" type="image/ico" sizes="70x70" />
        <title>Reviews & Testimonials | TechPratham - Student Success Stories</title>
        <meta name="description" content="Read authentic reviews and testimonials from TechPratham students. Share your learning experience and help others make informed decisions about their IT training journey." />
        <meta name="keywords" content="TechPratham Reviews, Student Testimonials, IT Training Reviews, Course Feedback, Student Success Stories, Training Reviews, Corporate Training Testimonials" />
        <meta name="author" content="the-bipu" />

        <meta property="og:title" content="Reviews & Testimonials | TechPratham - Student Success Stories" />
        <meta property="og:description" content="Discover what our students say about TechPratham's IT training programs. Real reviews from real people who transformed their careers." />
        <meta property="og:image" content="/navbar/techpratham.svg" />
        <meta property="og:url" content="https://www.techpratham.com/reviews" />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Reviews & Testimonials | TechPratham" />
        <meta name="twitter:description" content="Read authentic student reviews and share your TechPratham learning experience." />
        <meta name="twitter:image" content="/navbar/techpratham.svg" />

        <link rel="canonical" href="https://www.techpratham.com/reviews" />
      </Head>

      <ReviewView />
    </IndexController>
  </div>
);

export default ReviewsPage;
