import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const TrainingHeader = () => {
  return (
    <div className="relative w-full aspect-[16/9] md:aspect-auto md:h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <Image
        src="/home/hero/carporaten.jpeg"
        alt="Corporate technology training with TechPratham"
        fill
        className="object-cover"
        priority
      />

      {/* Brand gradient overlay (red/maroon theme) */}
      <div className="absolute inset-0 " />
      <div className="absolute inset-0 bg-black/10" />

    
    </div>
  );
};

export default TrainingHeader;
