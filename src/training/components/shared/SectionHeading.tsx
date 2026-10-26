import React from 'react';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'center' | 'left';
}

/**
 * Shared section heading that matches the TechPratham brand language:
 * a gradient red/maroon title with the decorative curve underline used
 * across the site (see SpecialityHome / Placement Process).
 */
const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  description,
  align = 'center',
}) => {
  const isCenter = align === 'center';

  return (
    <div
      className={`flex flex-col ${
        isCenter ? 'items-center text-center' : 'items-start text-left'
      } gap-3`}
    >
      {eyebrow && (
        <span className="px-4 py-1 rounded-full border border-[#FF2E41]/40 bg-[#FF2E41]/5 text-[#FF2E41] uppercase tracking-widest text-xs font-semibold">
          {eyebrow}
        </span>
      )}

      <h2 className="text-2xl md:text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#FF2E41] to-[#FF2E41] drop-shadow-sm">
        {title}
      </h2>

      <svg
        className={isCenter ? '' : ''}
        width="220"
        height="6"
        viewBox="0 0 340 6"
        preserveAspectRatio="none"
      >
        <path d="M0 3 Q170 0 340 3 Q170 6 0 3 Z" fill="#FF2E41" />
      </svg>

      {description && (
        <p
          className={`text-gray-600 text-base md:text-lg leading-relaxed ${
            isCenter ? 'max-w-3xl' : 'max-w-2xl'
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;
