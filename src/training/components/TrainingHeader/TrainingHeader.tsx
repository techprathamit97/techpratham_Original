import Image from "next/image";

const HeaderContact = () => {
  return (
    <div className="relative w-full md:h-[400px] h-56">
      {/* Background Image */}
      <Image
        src="/home/hero/corporate.webp"
        alt="Header Image"
        fill
        className="object-cover"
        priority
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="absolute inset-0 flex items-end justify-center pb-8 md:pb-12">
        <div className="max-w-5xl px-6 md:px-16 text-center text-white">
          <p className="uppercase tracking-widest text-xs md:text-base border-b-2 border-white inline-block pb-1 mb-4">
            Corporate Upskilling
          </p>

          <h1 className="text-xs md:text-2xl font-semibold mb-2">
            Future-Ready Workforce Solutions
          </h1>

          <h2 className="text-xl md:text-4xl font-bold mb-4">
            Transforming Talent Into Impact
          </h2>

          
        </div>
      </div>
    </div>
  );
};

export default HeaderContact;