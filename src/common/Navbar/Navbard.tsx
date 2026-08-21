import React from 'react';
import Link from 'next/link';
import { IoIosArrowForward } from 'react-icons/io';
import { EBOOK_GROUPS } from './ebookLinks';

/**
 * Desktop e-book strip.
 *
 * Hidden below md, where the six long labels cannot fit on one line. Those
 * links live in the Navbar mobile menu instead, driven by the same EBOOK_GROUPS
 * data.
 */
const Navbard: React.FC = () => {
  const lastIndex = EBOOK_GROUPS.length - 1;

  return (
    <div className="w-full bg-white h-auto py-1 hidden md:flex items-center justify-center border-b border-b-gray-100 sticky top-0 z-50 shadow-sm">
      <nav
        aria-label="E-book navigation"
        className="w-11/12 lg:w-10/12 flex flex-row flex-wrap gap-x-5 lg:gap-x-8 gap-y-1 items-center justify-center text-gray-600"
      >
        {EBOOK_GROUPS.map((group, index) => {
          // Keep the right-most menus inside the viewport.
          const alignRight = index >= lastIndex - 1;

          return (
            /**
             * focus-within keeps the menu reachable by keyboard; the original
             * markup opened on hover only.
             */
            <div key={group.label} className="relative group">
              <button
                type="button"
                aria-haspopup="true"
                className="flex items-center gap-1 whitespace-nowrap text-gray-800 hover:text-blue-600 text-[12px] lg:text-[13px] transition-colors"
              >
                {group.label}
                <IoIosArrowForward className="w-4 h-4 shrink-0 transform rotate-90 transition-transform group-hover:rotate-180 group-focus-within:rotate-180" />
              </button>

              <div
                className={`absolute top-full mt-1 w-48 bg-white shadow-lg rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-200 z-50 ${
                  alignRight ? 'right-0' : 'left-0'
                }`}
              >
                {group.links.map((link, linkIndex) => (
                  <Link
                    key={`${link.href}-${link.label}`}
                    href={link.href}
                    className={`block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:underline hover:decoration-red-600 ${
                      linkIndex === 0 ? 'rounded-t-lg' : ''
                    } ${linkIndex === group.links.length - 1 ? 'rounded-b-lg' : ''}`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </nav>
    </div>
  );
};

export default Navbard;
