"use client";

import Image from "next/image";

const news = [
  {
    logo: "/about/tribunerlogo.png",
    title: "TechPratham Introduces Hire-Train-Deploy Model to Transform HR & ERP Talent in the AI Era",
    image: "/about/tribun.webp",
    link: "https://www.tribuneindia.com/news/business/techpratham-transforming-the-hr-erp-landscape-with-hire-train-deploy-in-the-ai-era/",
  },
  {
    logo: "/about/thewire.webp",
    title: "TechPratham Empowering Future Professionals Through AI-Focused HR & ERP Training",
    image: "/about/thewire.webp",
    link: "https://thewire.in/ptiprnews/techpratham-transforming-the-hr-erp-landscape-with-hire-train-deploy-in-the-ai-era",
  },
  {
    logo: "/about/tribun.webp",
    title: "TechPratham Gains Recognition for Bridging the HR & ERP Skills Gap with Hire-Train-Deploy",
    image: "/about/ptin.webp",
    link: "https://www.ptinews.com/press-release/techpratham-transforming-the-hr-erp-landscape-with-hire-train-deploy-in-the-ai-era/3418112",
  },
  
  {
    logo: "/about/theweek.webp",
    title: "TechPratham's Hire-Train-Deploy Approach Reshaping HR & ERP Careers in the AI-Driven Industry",
    image: "/about/theweek.webp",
    link: "https://www.theweek.in/wire-updates/business/2026/02/27/techpratham-transforming-the-hr--erp-landscape-with-%E2%80%98hire-train-deploy%E2%80%99-in-the-ai-era.html",
  },
];

// Featured media logos for the center card - with individual article links
const featuredLogos = [
  {
    logo: "/about/newslogo/wire.webp",
    link: "https://thewire.in/ptiprnews/techpratham-transforming-the-hr-erp-landscape-with-hire-train-deploy-in-the-ai-era",
  },
  {
    logo: "/about/newslogo/yahoo.webp",
    link: "https://search.yahoo.com/search?p=TechPratham+Announces+Expanded+Training+Initiatives+in+Bangalore+and+Chennai+to+Meet+Surging+Demand+for+Workday+Specialists+in+the+Ai+Era",
  },
  {
    logo: "/about/newslogo/google.webp",
    link: "https://news.google.com/search?q=TechPratham+Announces+Expanded+Training+Initiatives+in+Bangalore+and+Chennai+to+Meet+Surging+Demand+for+Workday+Specialists+in+the+Ai+Era&hl=en-IN&gl=IN&ceid=IN:en",
  },
  {
    logo: "/about/newslogo/wiscosin.webp",
    link: "https://www.wisconsinjournal.news/news/techpratham-announces-expanded-training-initiatives-in-bangalore-and-chennai-to-meet-surging-demand-for-workday-specialists-in-the-ai-era20260422124405/",
  },
  {
    logo: "/about/newslogo/lokmat.webp",
    link: "https://www.lokmattimes.com/business/techpratham-announces-expanded-training-initiatives-in-bangalore-and-chennai-to-meet-surging-demand-for-workday-specialists-in-the-ai-era/",
  },
  {
    logo: "/about/newslogo/indiaN.webp",
    link: "https://indianewsconnect.co.in/techpratham-announces-expanded-training-initiatives-in-bangalore-and-chennai-to-meet-surging-demand-for-workday-specialists-in-the-ai-era/",
  },
  {
    logo: "/about/newslogo/ly.webp",
    link: "https://www.latestly.com/agency-news/business-news-techpratham-announces-expanded-training-initiatives-in-bangalore-and-chennai-to-meet-surging-demand-for-workday-specialists-in-the-ai-era-7402665.html",
  },
  {
    logo: "/about/newslogo/worldNews.webp",
    link: "https://www.worldnewsnetwork.net/news/techpratham-announces-expanded-training-initiatives-in-bangalore-and-chennai-to-meet-surging-demand-for-workday-specialists-in-the-ai-era20260422124405/",
  },
  {
    logo: "/about/newslogo/pti.webp",
    link: "https://www.ptinews.com/press-release/techpratham-transforming-the-hr-erp-landscape-with-hire-train-deploy-in-the-ai-era/3418112",
  },
  {
    logo: "/about/newslogo/tribune.webp",
    link: "https://www.tribuneindia.com/news/business/techpratham-transforming-the-hr-erp-landscape-with-hire-train-deploy-in-the-ai-era/",
  },
  {
    logo: "/about/newslogo/week.webp",
    link: "https://www.theweek.in/wire-updates/business/2026/02/27/techpratham-transforming-the-hr--erp-landscape-with-%E2%80%98hire-train-deploy%E2%80%99-in-the-ai-era.html",
  },
  {
    logo: "/about/newslogo/ani.webp",
    link: "https://www.aninews.in/news/business/techpratham-announces-expanded-training-initiatives-in-bangalore-and-chennai-to-meet-surging-demand-for-workday-specialists-in-the-ai-era20260422124410/",
  },
];

export default function NewsHighlights() {
  return (
    <section className="w-full m-2 bg-gray-100">
      <div className="mx-auto border-2 py-3 ml-2 px-4">

        {/* Heading */}
        <div className="text-center mb-3 flex flex-col items-center">
          <h2 className="text-3xl md:text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#CD4647] to-[#7F3B40]">
            News Highlights
          </h2>

          <svg
            className="mt-2"
            width="300"
            height="6"
            viewBox="0 0 340 6"
            preserveAspectRatio="none"
          >
            <path
              d="M0 3 Q170 0 340 3 Q170 6 0 3 Z"
              fill="#CD4647"
            />
          </svg>
        </div>

        {/* Layout: 2 Left | 1 Center (Featured) | 2 Right */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr_1fr] gap-4">

          {/* LEFT COLUMN - 2 Cards (Images Only) */}
          <div className="flex flex-col gap-4">
            {news.slice(0, 2).map((item, index) => (
              <a
                key={index}
                href={item.link}
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden h-full"
              >
                {/* Article Image Only */}
                <div className="relative w-full h-full min-h-[200px]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-contain"
                  />
                </div>
              </a>
            ))}
          </div>

          {/* CENTER COLUMN - Featured "Featured in" Card */}
          <div className="bg-gradient-to-tl from-[#C6151D] to-[#600A0E] rounded-2xl shadow-lg px-6 flex flex-col items-center justify-center">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-2 text-center">
              Featured In
            </h3>

            {/* White Container with Logo Grid */}
            <div className="bg-white rounded-2xl  w-full">
              <div className="grid grid-cols-2">
                {featuredLogos.map((item, index) => (
                  <a
                    key={index}
                    href={item.link}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="relative h-10 py-7 flex items-center p-5 justify-center"
                  >
                    <Image
                      src={item.logo}
                      alt={`Featured Logo ${index + 1}`}
                      width={120}   // adjust size here
                      height={70}  // adjust size here
                      className="object-contain"
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - 2 Cards (Images Only) */}
          <div className="flex flex-col gap-4">
            {news.slice(2, 4).map((item, index) => (
              <a
                key={index}
                href={item.link}
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden h-full"
              >
                {/* Article Image Only */}
                <div className="relative w-full h-full min-h-[200px]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-contain"
                  />
                </div>
              </a>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
