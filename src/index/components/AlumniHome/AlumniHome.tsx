import React from 'react';
import './alumni.css'
import Image from 'next/image';

interface PlacedAlumni {
  name: string;
  company: string;
  file: string;        // photo file inside /public/home/placed
  logo: string | null; // company logo path, or null (shows company name text)
  color: string;
}

const RED = '#E3172C';
const NAVY = '#1E1546';

const photo = (file: string) => `/home/placed/${encodeURIComponent(file)}`;

// Real placed students. Logo mapped to an existing /home/client-logo asset where
// one exists; otherwise null → the company name shows as text (see list at bottom).
const placed: Omit<PlacedAlumni, 'color'>[] = [
  { name: 'PRASHANT PATIL', company: 'PWD Maharashtra ', file: 'PRASHANT.webp', logo: '/home/client-logo/pwd.webp' },
  { name: 'Ananya', company: 'Cognizant', file: 'ANANYA= cognizant_11zon.jpg', logo: '/home/client-logo/Cognizent.svg' },
  { name: 'Abdul', company: 'TCS', file: 'Abdul=  tata consultancy services_11zon.webp', logo: '/home/client-logo/tcs.svg' },
  { name: 'Anilkumar', company: 'Accenture', file: 'Anilkumar =accenture_11zon.webp', logo: '/home/client-logo/accenture.svg' },
  { name: 'Ankur ', company: 'Ascent HR', file: 'Ankit Kumar = ascent hr_11zon.jpg', logo: '/home/client-logo/AscentHR.svg' },
  { name: 'Chhavi ', company: 'Genpact', file: 'Chhavi Srivastava == genpact_11zon.webp', logo: '/home/client-logo/genpact.svg' },
  { name: 'G Gowthami', company: 'Zelis', file: 'G Gowthami zelis_11zon.webp', logo: '/home/client-logo/ZELIS.svg' },
  { name: 'Nandani', company: 'Cognizant', file: 'NANDANI =cognizant_11zon.jpg', logo: '/home/client-logo/Cognizent.svg' },
  { name: 'Mahaboob', company: 'ONX', file: 'P Mahaboob Basha = onx_11zon.jpg', logo: '/home/client-logo/ONX.svg' },
  { name: 'Priya', company: 'Bosch', file: 'PRIYA = bosch_11zon.jpg', logo: '/home/client-logo/bosch.png' },
  { name: 'Priyanka', company: 'Accenture', file: 'PRIYANKA = accenture_11zon.jpg', logo: '/home/client-logo/accenture.svg' },
  { name: 'Preeti', company: 'WNS', file: 'Preeti Saini = wns_11zon.jpg', logo: '/home/client-logo/WNS.svg' },
  { name: 'Rachamreddy', company: 'Zelis', file: 'Rachamreddy Hemanth Reddy = zelis_11zon.jpg', logo: '/home/client-logo/ZELIS.svg' },
  { name: 'Simran', company: 'Deloitte', file: 'SIMRAN = deloitte_11zon.jpg', logo: '/home/client-logo/deloitte.svg' },
  { name: 'Soraj', company: 'Cognizant', file: 'SORAJ = cognizant_11zon.jpg', logo: '/home/client-logo/Cognizent.svg' },
  { name: 'Vidhi', company: 'Accenture', file: 'VIDHI =accenture_11zon.jpg', logo: '/home/client-logo/accenture.svg' },
  { name: 'Vibhati', company: 'Accenture', file: 'Vibhati= accenture_11zon.jpg', logo: '/home/client-logo/accenture.svg' },
  { name: 'Vijay', company: 'Accenture', file: 'Vijay = accenture_11zon.jpg', logo: '/home/client-logo/accenture.svg' },
  { name: 'Hamsini', company: 'Cognizant', file: 'hamsini chiruvolu= cognizant_11zon.webp', logo: '/home/client-logo/Cognizent.svg' },
  { name: 'Swetha', company: 'Deloitte', file: 'swetha T = deloitte_11zon.jpg', logo: '/home/client-logo/deloitte.svg' },

  { name: 'Ashish', company: 'Techchilla', file: 'ASHISH techchilla_11zon.webp', logo: '/home/client-logo/Techchilla.jpeg' },
  { name: 'Anand Mirle', company: 'IT Pros', file: 'Anand Mirle it pros_11zon.webp', logo: '/home/client-logo/IT Pros.png' },
  { name: 'Ashutosh Gupta', company: 'RST Solutions', file: 'Ashutosh Gupta rst soltion_11zon.webp', logo: '/home/client-logo/RST.jpeg' },
  { name: 'Bhanu', company: 'VIP Point Solutions', file: 'Bhanu= vip point slotion_11zon.jpg', logo: '/home/client-logo/VIP Point Solutions.jpeg' },
  { name: 'Dasarath Anand', company: 'Jade Global', file: 'Dasarath Anand  jade global_11zon.webp', logo: '/home/client-logo/Jade Global.png' },
  { name: 'MD Faiz', company: 'Mercer', file: 'MD FAIZ = mercer_11zon.jpg', logo: '/home/client-logo/Mercer.webp' },
  { name: 'Madhava Reddy', company: 'Nana Solutions', file: 'Madhava Reddy nana soltion_11zon.webp', logo: '/home/client-logo/Nana Solutions.png' },
  { name: 'Madhusudhan Rao', company: 'Infoyas', file: 'Madhusudhan Rao  = infoyas_11zon.jpg', logo: '/home/client-logo/Infoyas.png' },
  { name: 'Mahizhan Chandiran', company: 'Workday', file: 'Mahizhan Chandiran= workday_11zon.webp', logo: '/home/client-logo/Workday.jpeg' },
  { name: 'Natasha', company: '360 Cloud', file: 'NATASHA = 360 cloud_11zon.jpg', logo: '/home/client-logo/360 Cloud.jpeg' },
  { name: 'Natasha', company: 'PwC', file: 'NATASHA = pwc_11zon.jpg', logo: '/home/client-logo/PwC.png' },
  { name: 'Nikhil', company: 'Nagarro', file: 'NIKHIL = nagaroo_11zon.jpg', logo: '/home/client-logo/Nagarro.png' },
  { name: 'Naveen', company: 'Kimberly-Clark', file: 'Naveen = kimberly clerk_11zon.jpg', logo: '/home/client-logo/Kimberly-Clark.jpeg' },
  { name: 'Suresh', company: 'Hero Honda', file: 'SURESH = honda hero_11zon.jpg', logo: '/home/client-logo/Hero Honda.png' },
  { name: 'Sai Manohar', company: 'Kforce', file: 'Sai Manohar = kforce_11zon.jpg', logo: '/home/client-logo/Kforce.png' },
  { name: 'Shivangi Sharma', company: 'Frozen Fox Studio', file: 'Shivangi Sharma= Frozen Fox Studio_11zon.jpg', logo: '/home/client-logo/Frozen Fox Studio.jpeg' },
  { name: 'Vandhana', company: 'Whitehead', file: 'VANDHANA = white head_11zon.jpg', logo: '/home/client-logo/Whitehead.png' },
  { name: 'Vikram N', company: 'Reliable Software', file: 'Vikram N =  Reliable Software_11zon.jpg', logo: '/home/client-logo/Reliable Software.jpeg' },
];

// Alternate red / navy and split into two marquee rows.
const withColor: PlacedAlumni[] = placed.map((p, i) => ({ ...p, color: i % 2 === 0 ? RED : NAVY }));
const half = Math.ceil(withColor.length / 2);
const row1 = withColor.slice(0, half);
const row2 = withColor.slice(half);

const PassCard = ({ item }: { item: PlacedAlumni }) => (
  <div className="pass-card" style={{ ['--tc' as string]: item.color }}>
    {/* Person stub (left) */}
    <div className="pass-stub">
      <div className="pass-photo">
        <Image src={photo(item.file)} alt={item.name} fill className="object-cover" />
      </div>
      <div className="pass-name">
        <span className="pass-name-main">{item.name}</span>
        <span className="pass-name-sub">{item.company}</span>
      </div>
    </div>

    {/* Perforated tear */}
    <div className="pass-tear" aria-hidden="true" />

    {/* Colored main (right) */}
    <div className="pass-main">
      <div className="pass-lbl">
        <span>TechPratham Placed</span>
      </div>
      <div className="pass-logo">
        {item.logo ? (
          <div className="pass-logo-img">
            <Image src={encodeURI(item.logo)} alt={item.company} fill className="object-contain" />
          </div>
        ) : (
          <span className="pass-logo-text">{item.company}</span>
        )}
      </div>
    </div>
  </div>
);

const AlumniHome = () => {
  return (
    <div className='w-full h-auto flex flex-col items-center justify-center py-10 gap-8 bg-white text-black'>
      <div className='w-full max-w-6xl px-4 h-auto flex flex-col items-center justify-center gap-6'>

        <div className='w-full h-auto flex flex-col gap-2 items-center text-center'>
          <div className="md:text-3xl text-2xl md:font-semibold font-medium capitalize">
            Our <span className='text-[#E3172C] font-bold'>Alumni</span> Works At
          </div>
        </div>

        {/* Row 1 - scroll left */}
        <section className='overflow-x-hidden w-full'>
          <div className='marquee-row flex nowrap whitespace-nowrap'>
            <div className="pass-track left-scroll">
              {row1.map((item, index) => <PassCard key={`a-${index}`} item={item} />)}
            </div>
            <div className="pass-track left-scroll" aria-hidden="true">
              {row1.map((item, index) => <PassCard key={`b-${index}`} item={item} />)}
            </div>
          </div>
        </section>

        {/* Row 2 - scroll right */}
        <section className='overflow-x-hidden w-full'>
          <div className='marquee-row flex nowrap whitespace-nowrap'>
            <div className="pass-track right-scroll">
              {row2.map((item, index) => <PassCard key={`c-${index}`} item={item} />)}
            </div>
            <div className="pass-track right-scroll" aria-hidden="true">
              {row2.map((item, index) => <PassCard key={`d-${index}`} item={item} />)}
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}

export default AlumniHome
