import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const TrainingHeader = () => {
  return (
    <div className="relative w-full md:h-[520px] h-auto min-h-[460px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <Image
        src="/home/hero/corporate.webp"
        alt="Corporate technology training with TechPratham"
        fill
        className="object-cover"
        priority
      />

      {/* Brand gradient overlay (red/maroon theme) */}
      <div className="absolute inset-0 " />
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 w-11/12 md:w-10/12 max-w-6xl mx-auto py-14 md:py-20 text-white">
        <p className="uppercase tracking-[0.25em] text-xs md:text-sm font-semibold text-white/80 border-l-4 border-[#FF2E41] pl-3 mb-5">
          Corporate Upskilling
        </p>

        <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold leading-tight max-w-4xl">
          Corporate Training for Workday, SAP, ServiceNow and Agentic AI
        </h1>

        <p className="mt-5 text-base md:text-xl text-white/90 max-w-3xl leading-relaxed">
          Plan your team&apos;s technology upskilling with practical, role-based
          learning options aligned to your business goals.
        </p>

        {/* Technology pills */}
        <div className="mt-7 flex flex-wrap gap-2.5">
          {['Workday', 'SAP', 'ServiceNow', 'Agentic AI'].map((tech) => (
            <span
              key={tech}
              className="px-4 py-1.5 rounded-full bg-white/10 border border-white/25 backdrop-blur-sm text-sm font-medium"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link href="#enquiry">
            <Button
              variant="default"
              className="h-11 px-7 text-base bg-gradient-to-r from-[#FF2E41] to-[#FF2E41] hover:from-[#E0202F] hover:to-[#E0202F] transition-all duration-200"
            >
              Discuss Your Requirements
            </Button>
          </Link>
          <Link href="#programs">
            <Button
              variant="outline"
              className="h-11 px-7 text-base bg-transparent border-white/60 text-white hover:bg-white hover:text-[#FF2E41] transition-all duration-200"
            >
              Explore Training Areas
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TrainingHeader;
