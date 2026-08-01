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
