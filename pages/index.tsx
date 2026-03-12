import React from 'react';
import Head from 'next/head';
import IndexView from '@/src/index/views/IndexView';
import { IndexController } from '@/src/index/controller/IndexController';
import type { NextPage } from 'next';
import Script from 'next/script';

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.techpratham.com/#organization",
      "name": "TechPratham",
      "url": "https://www.techpratham.com/",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.techpratham.com/logo.png",
        "width": 112,
        "height": 112
      },
      "sameAs": [
        "https://www.youtube.com/@TechPratham_official",
        "https://www.facebook.com/people/Techprathamofficial/61573041693401/",
        "https://www.threads.com/@techprathamofficial",
        "https://www.instagram.com/techprathamofficial"


      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91-8882178896", // REPLACE
        "contactType": "customer service",
        "areaServed": "IN",
        "availableLanguage": "en"
      },

      // ✅ NEW SECTION: List all your target cities here
      "areaServed": [
        { "@type": "City", "name": "Noida" },
        { "@type": "City", "name": "Delhi" },
        { "@type": "City", "name": "Gurgaon" },
        { "@type": "City", "name": "Pune" },
        { "@type": "City", "name": "Mumbai" },
        { "@type": "City", "name": "Hyderabad" },
        { "@type": "City", "name": "Bengaluru" }
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://www.techpratham.com/#website",
      "url": "https://www.techpratham.com/",
      "name": "TechPratham - India's No.1 IT Training Institute",
      "publisher": {
        "@id": "https://www.techpratham.com/#organization"
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://www.techpratham.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    },
    {
      // Keep Noida as the physical Head Office
      "@type": "LocalBusiness",
      "parentOrganization": {
        "@id": "https://www.techpratham.com/#organization"
      },
      "name": "TechPratham - Head Office",
      "image": "https://www.techpratham.com/office-image.jpg",
      "telephone": "+91-8882178896",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "C-2, Sector 1",
        "addressLocality": "Noida",
        "addressRegion": "Uttar Pradesh",
        "postalCode": "201301",
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 28.5355,
        "longitude": 77.3910
      },

    }
  ]
}

const IndexPage: NextPage = () => {
  return (
    <div>
      <Script id="gtm-script" strategy="beforeInteractive">
        {`
                    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                    })(window,document,'script','dataLayer','GTM-KXS7C3FM');
                `}
      </Script>
      <Script
        id="home-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <IndexController>
        <Head>
          <link rel="canonical" href="https://www.techpratham.com/" />
          <link rel="icon" href="/favicon.ico" type="image/ico" sizes="70x70" />
          <title>India's No.1 Best IT Training Institute | Corporate Learning</title>
          <meta name="description" content="Corporate Learning is the best IT Training Institute in India for Industrial Training, provide training in 180+ courses as IT, Software, SAP, Data science & AWS." />
          <meta name="keywords" content="India's No.1 IT Training Institute,IT training institute in delhi with placement, IT training institute near me, IT training institute in india, best IT training institute in delhi, IT training institute in ghaziabad, IT training institute in noida, IT training institute in gurgaon, Professional courses training online, Professional courses training near me, professional development training courses, IT training institute India" />
          <meta name="author" content="the-bipu" />

          <meta property="og:title" content="India's No.1 Best IT Training Institute | Corporate Learning" />
          <meta property="og:description" content="Corporate Learning is the best IT Training Institute in India for Industrial Training, provide training in 180+ courses as IT, Software, SAP, Data science & AWS." />
          <meta property="og:image" content="https://www.techpratham.com/og.jpg" />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:image:type" content="image/jpeg" />
          <meta property="og:url" content="https://www.techpratham.com/" />

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="India's No.1 Best IT Training Institute in India | Corporate Learning" />
          <meta name="twitter:description" content="Corporate Learning is the best IT Training Institute in India for Industrial Training, provide training in 180+ courses as IT, Software, SAP, Data science & AWS." />
          <meta name="twitter:image" content="https://www.techpratham.com/og.jpg" />
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
            integrity="sha512-4oV0X7Vr5tKSGhzu8HngZ6NAfnPquKyV3GLfegHMCU+O7mRqaQE8nIYkAs6z0wZmvP0jJR30B2lV0QbnZSCz4g=="
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
          />
        </Head>

        <IndexView />
      </IndexController>
    </div>
  );
};

export default IndexPage;