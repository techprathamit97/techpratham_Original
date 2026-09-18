import React from 'react';
import Head from 'next/head';
import IndexView from '@/src/index/views/IndexView';
import { IndexController } from '@/src/index/controller/IndexController';
import type { NextPage, GetStaticProps } from 'next';
import Script from 'next/script';
import { getNavbarData, NavbarData } from '@/utils/navbarData';
import { getTrendingCourses, getGroupedCourses, getEvents } from '@/lib/homeData';
import LeadForm from '@/components/common/LeadForm/LeadForm';


interface Course {
  _id?: string;
  id?: string;
  title: string;
  image: string;
  alt?: string;
  category: string;
  link: string;
  shortDesc?: string;
  level?: string;
  rating?: number;
  duration?: string;
  description?: string;
  trending?: boolean;
}

interface CourseCategory {
  name: string;
  courses: Course[];
}

interface EventItem {
  _id: string;
  type: "video" | "placement" | "hiring";
  videoUrl?: string;
  image?: string;
}

interface IndexPageProps {
  trendingCourses: Course[];
  groupedCourses: CourseCategory[];
  events: EventItem[];
  navbarData: NavbarData;
}

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

const IndexPage: NextPage<IndexPageProps> = ({ trendingCourses, groupedCourses, events, navbarData }) => {
  const [showLeadForm, setShowLeadForm] = React.useState(false);

  React.useEffect(() => {
    // Show popup after 10 seconds for all users
    const timer = setTimeout(() => {
      setShowLeadForm(true);
    }, 10000); // 10 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <Script
        id="home-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <IndexController navbarData={navbarData} useNavbar2={true}>
        <Head>
          <link rel="canonical" href="https://www.techpratham.com/" />
          <link rel="icon" href="/favicon.ico" type="image/ico" sizes="70x70" />
          
          {/* LCP hero image preload is emitted automatically by the
              <Image priority fetchPriority="high"> in HeroHome, and it points
              at the exact /_next/image optimized URL + srcset the browser
              actually renders. A manual preload to the raw .webp was removed
              because it targeted a different URL than the optimized <img>,
              which double-downloaded the image and left the real LCP resource
              undiscovered until <img> parse time. */}
          
          <title>India's No.1 Best IT Training Institute | Corporate Learning</title>
          <meta name="description" content="Corporate Learning is the best IT Training Institute in India for Industrial Training, provide training in 180+ courses as IT, Software, SAP, Data science & AWS." />
          <meta name="keywords" content="India's No.1 IT Training Institute,IT training institute in delhi with placement, IT training institute near me, IT training institute in india, best IT training institute in delhi, IT training institute in ghaziabad, IT training institute in noida, IT training institute in gurgaon, Professional courses training online, Professional courses training near me, professional development training courses, IT training institute India" />
          <meta name="author" content="techpratham" />

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
          
        </Head>
        {/* Navbard removed here because Navbar2 now includes the e-book chip
            strip inline. Uncomment to restore the standalone strip:
            <Navbard/> */}
        <IndexView 
          initialTrendingCourses={trendingCourses}
          initialGroupedCourses={groupedCourses}
          initialEvents={events}
        />

        {showLeadForm && (
          <LeadForm 
            course={{ title: '' }}
            onClose={() => setShowLeadForm(false)}
            onSuccess={() => setShowLeadForm(false)}
          />
        )}
      </IndexController>
    </div>
  );
};

// Static generation with ISR - the page HTML is cached and regenerated in the
// background at most once per `revalidate` window, instead of running the full
// data fetch on every request. Data is read directly from the DB layer
// (lib/homeData) so there are no self-HTTP round-trips or middleware overhead.
export const getStaticProps: GetStaticProps<IndexPageProps> = async () => {
  try {
    // Fetch all data in parallel for better performance
    const [trendingCourses, groupedCourses, events, navbarData] = await Promise.all([
      getTrendingCourses(),
      getGroupedCourses(),
      getEvents(),
      getNavbarData(),
    ]);

    return {
      props: {
        trendingCourses: trendingCourses as Course[],
        groupedCourses: groupedCourses as CourseCategory[],
        events: events as EventItem[],
        navbarData,
      },
      // Rebuild the page in the background at most once every 5 minutes.
      revalidate: 300,
    };
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    // Return empty arrays on error so page still renders
    const navbarData = await getNavbarData();
    return {
      props: {
        trendingCourses: [],
        groupedCourses: [],
        events: [],
        navbarData,
      },
      // Retry sooner if the first build hit an error.
      revalidate: 60,
    };
  }
};

export default IndexPage;