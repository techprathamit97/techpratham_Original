"use client";
import Image from "next/image";
import React from 'react';
import Link from "next/link";
import { usePathname } from "next/navigation";
// Old navbar kept as backup, uncomment to roll back:

// import Navbar from '@/src/common/Navbar/Navbar';

import Navbar from '@/src/common/Navbar/Navbar'; // Navbar2 only on home page
import Footer from '@/src/common/Footer/Footer';

export default function NotFound() {
  const pathname = usePathname();

  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* 404 Content */}
      <div className="min-h-[70vh] bg-[#f3f9ff] flex flex-col items-center justify-center px-4 py-4">
        <div className="text-center max-w-2xl">
          {/* Heading */}
        
          <div className="relative w-64 h-40 mx-auto">
            <Image
              src="/navbar/404.webp"
              alt="404 Error"
              fill
              className="object-contain"
            />
          </div>
            <h1 className="text-6xl font-bold text-[#C6151D]">404</h1>
          {/* Subtitle */}
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Oops! Page Not Found
          </h2>

          {/* Description */}
          <p className="text-gray-600 mb-2">
            The page <code className="bg-gray-200 px-2 py-1 rounded">{pathname}</code> doesn&apos;t exist.
          </p>
          <p className="text-gray-600 mb-4">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-6 py-3 bg-gradient-to-tl from-[#C6151D] to-[#600A0E] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              Go Home
            </Link>

            <Link
              href="/courses"
              className="px-6 py-3 border-2 border-[#C6151D] text-[#C6151D] font-semibold rounded-lg hover:bg-[#C6151D] hover:text-white transition-colors"
            >
              Browse Courses
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
}