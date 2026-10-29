import React from 'react';
import { LogoCloud } from '@/src/index/components/ClientHome/logo-cloud-3';

const clientLogos = [
  { src: '/home/client-logo/techmd.png', alt: 'Accenture Logo' },
  { src: '/home/client-logo/tcsd.jpg', alt: 'AWS Logo' },
  { src: '/home/client-logo/microshofd.png', alt: 'Capgemini Logo' },
  { src: '/home/client-logo/download (1).png', alt: 'Deloitte Logo' },
  { src: '/home/client-logo/genpactd.png', alt: 'Genpact Logo' },
  { src: '/home/client-logo/deloitted.png', alt: 'HP Logo' },
  { src: '/home/client-logo/awsd.png', alt: 'Intel Logo' },
  { src: '/home/client-logo/CapgeminiD.svg', alt: 'Microsoft Logo' },
  { src: '/home/client-logo/wiprod.png', alt: 'Infosys Logo' },
  { src: '/home/client-logo/zohod.png', alt: 'Zoho Logo' },
  { src: '/home/client-logo/zelis.jpg', alt: 'Zelis Logo' },
  { src: '/home/client-logo/wns.png', alt: 'Wipro Logo' },
  { src: '/home/client-logo/saintg.png', alt: 'Saint Gobain Logo' },
  { src: '/home/client-logo/onx.png', alt: 'ONX Logo' },
  { src: '/home/client-logo/nava.png', alt: 'Nava Logo' },
  { src: '/home/client-logo/infosysd.png', alt: 'Infosys Logo' },
  { src: '/home/client-logo/downlohcl.png', alt: 'HCL Logo' },
  { src: '/home/client-logo/egonzehnderd.png', alt: 'Egon Zehnder Logo' },
  { src: '/home/client-logo/congnizantd.jpg', alt: 'Cognizant Logo' },
  { src: '/home/client-logo/bosch.png', alt: 'Bosch Logo' },
  { src: '/home/client-logo/bankofa.jpg', alt: 'Bank of America Logo' },
];

const Introsection = () => {
  return (
    <section className="w-full overflow-hidden flex justify-center py-4 md:py-8">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 flex flex-col items-center text-center">
        {/* Heading */}
        <h1 className="text-xl sm:text-3xl md:text-2xl font-bold leading-tight text-gray-900 max-w-6xl">
          Corporate Training for Workday, ServiceNow, SAP and Agentic AI
        </h1>

        {/* Paragraph */}
        <p className="mt-5 text-base md:text-xl text-gray-600 max-w-3xl leading-relaxed">
          Plan your team&apos;s technology upskilling with practical, role-based
          learning options aligned to your business goals.
        </p>

        {/* Logos */}
        <div className="w-full min-w-0 overflow-hidden mt-12">
          <LogoCloud logos={clientLogos} />

          {/* Small caption */}
          <p className="mt-6 text-sm font-medium text-gray-500 uppercase tracking-widest">
            Companies where we&apos;ve already delivered corporate training
          </p>
        </div>
      </div>
    </section>
  );
};

export default Introsection;
