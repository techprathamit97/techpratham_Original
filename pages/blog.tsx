import React from 'react';
import Head from 'next/head';

import type { NextPage } from 'next';
import { IndexController } from '@/src/index/controller/IndexController';
import BlogsView from '@/src/blogs/views/BlogsView';

const BlogsPage: NextPage = (props) => (
  <div>
    <IndexController {...props}>
      <Head>
        <link rel="icon" href="/favicon.ico" type="image/ico" sizes="70x70" />
        <title>Blogs | TechPratham - Tech Insights & Career Tips</title>
        <meta name="description" content="Explore insightful blogs on IT, software development, and career tips written by industry experts at TechPratham." />
        <meta name="keywords" content="TechPratham Blogs, IT Career Tips, Software Development Articles, Tech Insights, Programming Guides" />
        <meta name="author" content="the-bipu" />

        <meta property="og:title" content="Blogs | TechPratham - Tech Insights & Career Tips" />
        <meta property="og:description" content="Stay updated with the latest tech trends, learning guides, and career advice through TechPratham's blog posts." />
        <meta property="og:image" content="/navbar/techpratham.svg" />
        <meta property="og:url" content="https://www.techpratham.com/blogs" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Blogs | TechPratham - Tech Insights & Career Tips" />
        <meta name="twitter:description" content="Read blogs on technology, software skills, and career-building strategies from the TechPratham community." />
        <meta name="twitter:image" content="/navbar/techpratham.svg" />
      </Head>

      <BlogsView />
    </IndexController>
  </div>
);

export default BlogsPage;