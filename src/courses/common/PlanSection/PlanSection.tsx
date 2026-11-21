"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

/* ================= DATA ================= */

export const training_data = [
  { que: "About Trainer", icons: "/course/icons/1.webp", ans: "Working professional who is carrying more than 10 years of industry experience.", videoUrl: "https://content.techpratham.com/study_tips.mp4" },
  { que: "Decks & Updated Content", icons: "/course/icons/2.webp", ans: "Access to updated presentation decks shared during live training sessions.", videoUrl: "https://content.techpratham.com/study_tips.mp4" },
  { que: "e-Book", icons: "/course/icons/3.webp", ans: "E-book provided by TechPratham. All rights reserved.", link: "/e-book/workday" },
  { que: "Assignments & MCQs", icons: "/course/icons/4.webp", ans: "Module-wise assignments and MCQs provided for practice.", link: "/e-book/workday" },
  { que: "Video Recording", icons: "/course/icons/6.webp", ans: "Daily Session would be recorded and shared to the candidate.", videoUrl: "https://content.techpratham.com/study_tips.mp4" },
  { que: "Projects", icons: "/course/icons/5.webp", ans: "Live projects will be provided for hands-on practice.", videoUrl: "https://content.techpratham.com/live_project_demonstration.mp4" },
  { que: "Resume Building", icons: "/course/icons/7.webp", ans: "Expert-guided resume building with industry-focused content support.", videoUrl: "https://content.techpratham.com/resume-buidling-session.mp4" },
  { que: "Interview Preparation", icons: "/course/icons/8.webp", ans: "Comprehensive interview preparation with real-time scenario practice.", videoUrl: "https://content.techpratham.com/interview_preparation.mp4" }
];

/* ================= ICONS (white line icons shown on the coloured strip) ================= */

const cardIcons = [
  // About Trainer
  <>
    <path d="M3 4h18M4 4v10h16V4M12 14v4M8 21l4-3 4 3" />
    <path d="m8 10 3-3 2 2 3-3" />
  </>,
  // Decks & Updated Content
  <>
    <path d="M12 2 2 7l10 5 10-5-10-5Z" />
    <path d="m2 17 10 5 10-5" />
    <path d="m2 12 10 5 10-5" />
  </>,
  // e-Book
  <>
    <path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2Z" />
    <path d="M22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7Z" />
  </>,
  // Assignments & MCQs
  <>
    <rect x="5" y="3" width="14" height="18" rx="2" />
    <path d="M9 3h6v3H9z" />
    <path d="m9 13 2 2 4-4" />
  </>,
  // Video Recording
  <>
    <rect x="2" y="6" width="14" height="12" rx="2" />
    <path d="m16 10 6-3v10l-6-3" />
  </>,
  // Projects
  <>
    <path d="m8 8-5 4 5 4M16 8l5 4-5 4M14 4l-4 16" />
  </>,
  // Resume Building
  <>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
    <path d="M14 2v6h6M8 13h8M8 17h5" />
  </>,
  // Interview Preparation
  <>
    <path d="M21 12a8 8 0 0 1-11.6 7.1L3 21l1.9-6.4A8 8 0 1 1 21 12Z" />
    <path d="M8 11h.01M12 11h.01M16 11h.01" />
  </>,
];

/* ================= CARD ================= */

const InfoCard = ({ number, title, desc, index, isAlt, show, videoUrl, link, onVideoClick, onLinkClick, scrollId }: any) => {
  const handleClick = () => {
    if (videoUrl) {
      onVideoClick(videoUrl);
    } else if (scrollId) {
      const section = document.getElementById(scrollId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else if (link) {
      onLinkClick(link);
    }
  };

  return (
    <article
      onClick={handleClick}
      className={`tp-card group ${isAlt ? "tp-card--alt" : ""} ${show ? "tp-show" : ""}`}
      style={{ transitionDelay: `${(index % 4) * 110}ms` }}
    >
      {/* HEADER STRIP */}
      <div className="tp-top">
        <span className="tp-num">{number}</span>
        <span className="tp-icon">
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {cardIcons[index]}
          </svg>
        </span>
      </div>

      {/* BODY */}
      <div className="tp-body">
        <h3>
          <span>{title}</span>
        </h3>
        <p>{desc}</p>
      </div>
    </article>
  );
};

/* ================= MAIN ================= */

const InfoGraphicSection = ({ id }: any) => {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setInView(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div id={id} ref={sectionRef} className="tp-section">
      {/* ===== HEADING ===== */}
      <div className="tp-head">
        <h2 className={`tp-title ${inView ? "tp-title--in" : ""}`}>
          Training <span>Plan</span>
        </h2>
      </div>

      {/* ===== CARD GRID ===== */}
      <div className="tp-grid">
        {training_data.map((item, i) => {
          const row = Math.floor(i / 4);
          const isAlt = (i + row) % 2 === 1; // red / navy checkerboard
          return (
            <InfoCard
              key={i}
              index={i}
              number={(i + 1).toString().padStart(2, "0")}
              title={item.que}
              desc={item.ans}
              isAlt={isAlt}
              show={inView}
              videoUrl={item.videoUrl}
              link={item.link}
              onVideoClick={(url: any) => setActiveVideo(url)}
              onLinkClick={(url: any) => router.push(url)}
            />
          );
        })}
      </div>

      {/* ===== VIDEO MODAL ===== */}
      {activeVideo && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="relative w-[90%] md:w-[700px] bg-white rounded-xl p-4">
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-0 right-0 text-red-600 text-7xl"
            >
              ✕
            </button>
            <video
              width="100%"
              height="400"
              controls
              autoPlay
              className="rounded-lg"
              src={activeVideo}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}

      {/* ===== SCOPED STYLES ===== */}
      <style jsx>{`
        .tp-section {
          --red: #ff2a3b;
          --navy: #1b1445;
          --white: #ffffff;
          background: var(--white);
          padding: 10px 0px;
          color: var(--navy);
        }

        /* heading */
        .tp-head {
          text-align: center;
          margin-bottom: 32px;
        }
        .tp-title {
          position: relative;
          display: inline-block;
          font-size: clamp(32px, 5vw, 52px);
          font-weight: 800;
          letter-spacing: -1px;
          color: var(--navy);
        }
        .tp-title span {
          color: var(--red);
        }
        .tp-title::after {
          content: "";
          position: absolute;
          left: 50%;
          bottom: -14px;
          height: 5px;
          width: 0;
          border-radius: 5px;
          background: var(--red);
          transform: translateX(-50%);
          transition: width 1s cubic-bezier(0.2, 0.8, 0.2, 1) 0.25s;
        }
        .tp-title--in::after {
          width: 60%;
        }

        /* grid */
        .tp-grid {
          width: 91.666667%; /* matches w-11/12 on other sections */
          max-width: 80rem; /* matches max-w-7xl (1280px) */
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 28px;
        }

        /* card */
        :global(.tp-card) {
          position: relative;
          background: var(--white);
          border: 3px solid var(--navy);
          border-radius: 16px;
          box-shadow: 7px 7px 0 var(--navy);
          overflow: hidden;
          cursor: pointer;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1),
            box-shadow 0.2s ease;
        }
        :global(.tp-card.tp-show) {
          opacity: 1;
          transform: none;
        }
        :global(.tp-card.tp-show:hover) {
          transform: translate(-5px, -5px);
          box-shadow: 12px 12px 0 var(--red);
        }
        :global(.tp-card.tp-show:active) {
          transform: translate(3px, 3px);
          box-shadow: 3px 3px 0 var(--navy);
        }

        /* header strip */
        :global(.tp-top) {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 18px;
          border-bottom: 3px solid var(--navy);
          background: var(--red);
          color: var(--white);
          position: relative;
          overflow: hidden;
        }
        :global(.tp-card--alt .tp-top) {
          background: var(--navy);
        }
        /* shine sweep on hover */
        :global(.tp-top::after) {
          content: "";
          position: absolute;
          top: 0;
          bottom: 0;
          left: -60%;
          width: 40%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.35),
            transparent
          );
          transform: skewX(-20deg);
          transition: left 0.6s ease;
        }
        :global(.tp-card:hover .tp-top::after) {
          left: 130%;
        }

        :global(.tp-num) {
          font-weight: 800;
          font-size: 18px;
          background: var(--white);
          color: var(--navy);
          border: 2.5px solid var(--navy);
          border-radius: 9px;
          padding: 2px 12px;
          line-height: 1.3;
        }
        :global(.tp-icon) {
          display: grid;
          place-items: center;
          transition: transform 0.45s cubic-bezier(0.3, 1.6, 0.5, 1);
        }
        :global(.tp-card:hover .tp-icon) {
          transform: rotate(-12deg) scale(1.2);
        }

        :global(.tp-body) {
          padding: 20px 20px 24px;
        }
        :global(.tp-body h3) {
          position: relative;
          font-size: 18px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: -0.2px;
          line-height: 1.25;
          color: var(--navy);
          padding-bottom: 10px;
          margin-bottom: 10px;
        }
        :global(.tp-body p) {
          font-size: 15px;
          line-height: 1.6;
          color: var(--navy);
          opacity: 0.78;
        }
        /* red underline grows below the full title on hover (never through it) */
        :global(.tp-body h3 span) {
          display: inline;
        }
        :global(.tp-body h3::after) {
          content: "";
          position: absolute;
          left: 0;
          bottom: 0;
          height: 3px;
          width: 0;
          border-radius: 3px;
          background: var(--red);
          transition: width 0.4s ease;
        }
        :global(.tp-card:hover .tp-body h3::after) {
          width: 56px;
        }

        @media (max-width: 1100px) {
          .tp-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 600px) {
          .tp-section {
            padding: 24px 16px;
          }
          /* show ~2 cards, rest scroll vertically (touch) inside the box */
          .tp-grid {
            grid-template-columns: 1fr;
            gap: 20px;
            max-height: 620px;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
            overscroll-behavior-y: auto;
            padding: 6px 10px 6px 4px;
          }
          /* slim scrollbar */
          .tp-grid::-webkit-scrollbar {
            width: 6px;
          }
          .tp-grid::-webkit-scrollbar-thumb {
            background: var(--red);
            border-radius: 6px;
          }
          .tp-grid::-webkit-scrollbar-track {
            background: rgba(27, 20, 69, 0.08);
            border-radius: 6px;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          :global(.tp-card) {
            opacity: 1;
            transform: none;
            transition: none;
          }
        }
      `}</style>
    </div>
  );
};

export default InfoGraphicSection;
