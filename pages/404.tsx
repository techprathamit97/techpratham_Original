import Link from "next/link";
import Image from "next/image";

export default function Custom404() {
  return (
    <div className="h-[300px] bg-[#f3f9ff] flex flex-col items-center justify-center px-4 py-8">
      <div className="text-center max-w-2xl">
        {/* 404 Image */}
        <div className="relative w-64 h-64 mx-auto mb-8">
          <Image
            src="/home/hero/logo/microsoft.svg"
            alt="404 Error"
            fill
            className="object-contain"
          />
        </div>

        {/* Heading */}
        <h1 className="text-6xl font-bold text-[#C6151D] mb-4">404</h1>

        {/* Subtitle */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Oops! Page Not Found
        </h2>

        {/* Description */}
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
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
  );
}