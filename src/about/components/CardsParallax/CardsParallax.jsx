
import React from 'react';

const stepsData = [
  { 
    title: "Industry Expert Trainer",
    description: "Our trainers are industry leaders, skilled at simplifying complex concepts and empowering you with practical knowledge to excel in your IT career.",
    backgroundImage: "/about/ang.jpg",
    imagePath: "/about/card1.svg",
    alt: "Trainer leading a session",
    features: [
      { title: "Expert Guidance", description: "Learn directly from IT professionals with real-world experience." },
      { title: "In-depth Knowledge", description: "Up-to-date insights and industry-standard practices." }
    ]
  },
  { 
    title: "Fully Hands-on Training & Lab Assistance",
    description: "Our courses include immersive, hands-on sessions designed to mirror real job challenges from day one.",
    backgroundImage: "/about/yellow.jpg",
    imagePath: "/about/card2.svg",
    alt: "Hands-on lab training",
    features: [
      { title: "Practical Labs", description: "Experience real-world labs with guided instructions." },
      { title: "Project Based Learning", description: "Work on live-like projects to enhance your skills." }
    ]
  },
  { 
    title: "Flexible Class Timings",
    description: "Choose flexible class schedules that fit your daily routine—ideal for both students and working professionals.",
    backgroundImage: "/about/ang.jpg",
    imagePath: "/about/handontraning.svg",
    alt: "Flexible clock times",
    features: [
      { title: "Weekend Batches", description: "For working professionals and students." },
      { title: "Multiple Time Slots", description: "Morning, afternoon and evening options." }
    ]
  },
  { 
    title: "24/7 Support",
    description: "We provide round-the-clock technical and academic support to help you learn without interruption.",
    backgroundImage: "/about/yellow.jpg",
    imagePath: "/about/24Support.svg",
    alt: "Customer support agents",
    features: [
      { title: "Dedicated Helpdesk", description: "Get support anytime you need help." },
      { title: "Instant Assistance", description: "Quick solutions via chat, call, or email." }
    ]
  },
  { 
    title: "Interview Preparation",
    description: "Get fully prepared with mock interviews, commonly asked questions, and job-winning strategies.",
    backgroundImage: "/about/ang.jpg",
    imagePath: "/about/card4.svg",
    alt: "Interview preparation graphic",
    features: [
      { title: "Mock Interviews", description: "Practice with real interview scenarios." },
      { title: "HR & Technical Rounds", description: "Complete end-to-end interview training." }
    ]
  },
  { 
    title: "Job Assistance",
    description: "We help you connect with top companies, prepare job-ready resumes, and guide you through placements.",
    backgroundImage: "/about/yellow.jpg",
    imagePath: "/about/jobA.svg",
    alt: "Job placement assistance",
    features: [
      { title: "Resume Building", description: "Professional resume creation support." },
      { title: "Placement Support", description: "Guidance for job openings and referrals." }
    ]
  }
];

// Component for a single step
const StepSection = ({ data, index }) => {
  return (
    <div
      className="h-screen sticky top-20"
      style={{
        backgroundImage: `url(${data.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        zIndex: 27 + index,
      }}
    >
      <div className="h-full w-full flex items-center justify-center pb-20 bg-black/30">
        <div className="flex flex-col md:flex-row md:gap-10 w-full max-w-6xl p-8 text-white">

          {/* LEFT SIDE */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h2 className="text-xl md:text-3xl font-bold mb-3">{data.title}</h2>
              <p className="text-sm md:text-base text-white/80 mb-6">{data.description}</p>

              {/* FEATURES */}
              <div className="flex flex-col gap-3">
                {data.features?.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-green-500/20 text-green-400">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-base font-semibold">{feature.title}</h3>
                      <p className="text-xs text-white/60">{feature.description}</p>
                    </div>
                  </div>
                ))}

                {/* BUTTON */}
                <div className="mt-4 md:mt-6">
                  <button className="bg-white text-gray-900 font-semibold text-sm py-3 px-5 rounded-lg shadow-lg hover:bg-gray-200 transition w-full md:w-auto">
                    Connect to our expert counselor
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE IMAGE */}
          <div className="flex-1 relative min-w-[65%] rounded-xl ml-auto">
            <img
              src={data.imagePath}
              alt={data.alt || data.title}
              className="w-full h-full md:object-cover object-contain rounded-lg"
            />
          </div>

        </div>
      </div>
    </div>
  );
};

// Main App
const App = () => {
  return (
    <>
                    <div className="sticky top-[0vh] md:w-10/12 w-11/12 mx-auto pt-5 flex flex-col gap-4 text-center z-15">
                    <h1 className="md:text-4xl sm:text-3xl text-xl font-bold">
                        Climb your career ladder with world-class professional
                    </h1>
                    </div>
    <div className="relative w-full ">
      {stepsData.map((data, index) => (
        <StepSection key={index} data={data} index={index} />
      ))}

      <div className="h-screen bg-white flex items-center justify-center">
        <div className="text-center text-gray-800">
          <h2 className="text-2xl mb-2">End of Sticky Sections</h2>
          <p>Scroll down further to reveal the next content.</p>
        </div>
      </div>

      <style jsx global>{`
        /* Negative margin to start the sticky effect from top */
        .-mt-screen { margin-top: -100vh; }
      `}</style>
    </div>
    </>
  );
};

export default App;
