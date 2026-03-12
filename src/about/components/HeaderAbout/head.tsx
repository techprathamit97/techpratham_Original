// import Image from "next/image";
// import D3Image from '../threeDmoveIcon'


// export default function AboutHeader() {
//   return (
//     <div className="relative w-full md:h-[400px] h-[250px] overflow-hidden">

//       {/* ===== Background ===== */}
//       <div
//         className="
//           absolute inset-0 

//           bg-[url('/about/aboutbg.webp')]
//           bg-cover bg-center
//         "
//       />

//       {/* Overlay (all screens) */}
//       <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-black/60 to-transparent z-0" />

//       {/* ===== DESKTOP VIEW ===== */}

//       {/* Director Image - LEFT */}
//       <div className="absolute left-0 bottom-0 hidden md:block z-5">
//         <div
//           className="relative md:w-[80vh] md:h-[60vh]"
//           style={{
//             opacity: 0,
//             animation: "slideFromBottom 1s ease-out 0.5s forwards",
//           }}
//         >
//           <Image
//             src="/about/Sirab.webp"
//             alt="Director"
//             fill
//             className="object-contain"
//           />
//         </div>
//       </div>

//       {/* D3 Image - RIGHT */}
//       <div className="absolute right-20 top-1/2 -translate-y-1/2  z-5">
//         <D3Image />
//       </div>

//       {/* Heading (Desktop Center) */}
//       <h1
//         className="
//           absolute hidden md:flex
//           top-1/2 left-1/2 
//           -translate-x-1/2 -translate-y-1/2
//           text-white text-6xl font-extrabold
//           drop-shadow-lg z-10
//         "
//         style={{ fontFamily: "Abril Fatface, cursive" }}
//       >
//         ABOUT US
//       </h1>

//       {/* ===== MOBILE VIEW ===== */}



//       {/* Director Image - FRONT (Mobile) */}
//       <div className="absolute md:hidden right-0 bottom-0 z-10">
//         <div className="relative w-64 h-52">
//           <Image
//             src="/about/Sirab.webp"
//             alt="Director"
//             fill
//             className="object-contain"
//           />
//         </div>
//       </div>

//       {/* Mobile Heading */}
//       <h1
//         className="
//           absolute hidden md:hidden
//           top-6 left-1/2 -translate-x-1/2
//           text-white text-3xl font-extrabold
//           z-10
//         "
//         style={{ fontFamily: "Abril Fatface, cursive" }}
//       >
//         ABOUT US
//       </h1>

//       {/* Font */}
//       <link
//         href="https://fonts.googleapis.com/css2?family=Abril+Fatface&display=swap"
//         rel="stylesheet"
//       />
//     </div>
//   );
// }



import HeroSection from './hero-section-9'; // Adjust the import path as needed
import { Users, Briefcase, Link as LinkIcon } from 'lucide-react';

const HeroSectionDemo = () => {
  // Sample data to be passed as props
  const heroData = {
    title: (
      <>
        You Learn... <br /> We Make It Happen.
      </>
    ),
    subtitle: 'Turning potential into professional power.',
    actions: [
      {
        text: "Join the Class",
        onClick: () => alert("Join the Class clicked!"),
        className: "bg-[#CA8A04] hover:bg-yellow-600 text-black",
      },
     {
  text: 'Learn more',
  onClick: () => alert('Learn More clicked!'),
  variant: 'outline' as const,
},
    ],
    stats: [
      {
        value: '15,2K',
        label: 'Active students',
        icon: <Users className="h-5 w-5 text-muted-foreground" />,
      },
      {
        value: '4,5K',
        label: 'Tutors',
        icon: <Briefcase className="h-5 w-5 text-muted-foreground" />,
      },
      {
        value: 'Resources',
        label: '',
        icon: <LinkIcon className="h-5 w-5 text-muted-foreground" />,
      },
    ],
    images: [
      '/about/Sirab.webp',
      '/about/teams/teams.jpeg',
      '/about/teams/teams.jpeg',
    ],
  };

  return (
    <div className="w-full h-full bg-gradient-to-tl from-[#C6151D] to-[#600A0E]  bg-background">
      <HeroSection
        title={heroData.title}
        subtitle={heroData.subtitle}
        actions={heroData.actions}
        stats={heroData.stats}
        images={heroData.images}
      />
    </div>
  );
};

export default HeroSectionDemo;
