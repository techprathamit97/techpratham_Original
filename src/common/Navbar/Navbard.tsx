import React from 'react';
import Link from 'next/link';
import { IoIosArrowForward } from 'react-icons/io';

const Navbard: React.FC = () => {
  return (
    <div className="w-full bg-white h-auto py-1 flex items-center justify-center border-b border-b-gray-100 sticky top-0 z-50 shadow-sm">
      <nav className="flex flex-row gap-8 items-center justify-center text-gray-600">
        
        {/* Workday E-Book Dropdown */}
        <div className="relative group">
          <button className="flex items-center gap-1 text-gray-800 hover:text-blue-600 text-[13px] transition-colors">
            Workday E-Book 
            <IoIosArrowForward className="w-4 h-4 transform rotate-90 transition-transform group-hover:rotate-180" />
          </button>
          <div className="absolute top-full left-0 mt-1 w-48 bg-white shadow-lg rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <Link href="/certification/workday-hcm" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-t-lg hover:underline hover:decoration-red-600">
              Resources
            </Link>
            <Link href="/certification/workday-financials" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:underline hover:decoration-red-600">
              Interview Questions
            </Link>
            <Link href="/certification/workday-prism" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:underline hover:decoration-red-600">
              Certificate Dumps
            </Link>
            <Link href="/certification/workday-resume" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:underline hover:decoration-red-600">
              Sample Resume
            </Link>
            <Link href="/certification/workday-quiz" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:underline hover:decoration-red-600">
              Quizzes
            </Link>
            <Link href="/certification/workday-studio" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:underline hover:decoration-red-600 rounded-b-lg">
              Job Openings
            </Link>
          </div>
        </div>

        {/* ServiceNow E-Book Dropdown */}
        <div className="relative group">
          <button className="flex items-center gap-1 text-gray-800 hover:text-blue-600 text-[13px] transition-colors">
            ServiceNow E-Book 
            <IoIosArrowForward className="w-4 h-4 transform rotate-90 transition-transform group-hover:rotate-180" />
          </button>
          <div className="absolute top-full left-0 mt-1 w-48 bg-white shadow-lg rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <Link href="/interview/servicenow-resources" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-t-lg hover:underline hover:decoration-red-600">
              Resources
            </Link>
            <Link href="/interview/servicenow-questions" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:underline hover:decoration-red-600">
              Interview Questions
            </Link>
            <Link href="/certification/servicenow-dumps" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:underline hover:decoration-red-600">
              Certificate Dumps
            </Link>
            <Link href="/certification/servicenow-resume" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:underline hover:decoration-red-600">
              Sample Resume
            </Link>
            <Link href="/interview/servicenow-quiz" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:underline hover:decoration-red-600">
              Quizzes
            </Link>
            <Link href="/interview/servicenow-jobs" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:underline hover:decoration-red-600 rounded-b-lg">
              Job Openings
            </Link>
          </div>
        </div>

        {/* SAP E-Book Dropdown */}
        <div className="relative group">
          <button className="flex items-center gap-1 text-gray-800 hover:text-blue-600 text-[13px] transition-colors">
            SAP E-Book 
            <IoIosArrowForward className="w-4 h-4 transform rotate-90 transition-transform group-hover:rotate-180" />
          </button>
          <div className="absolute top-full left-0 mt-1 w-48 bg-white shadow-lg rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <Link href="/e-book/sap/resources" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-t-lg hover:underline hover:decoration-red-600">
              Resources
            </Link>
            <Link href="/e-book/sap/interview-questions" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:underline hover:decoration-red-600">
              Interview Questions
            </Link>
            <Link href="/certification/sap-dumps" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:underline hover:decoration-red-600">
              Certificate Dumps
            </Link>
            <Link href="/certification/sap-resume" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:underline hover:decoration-red-600">
              Sample Resume
            </Link>
            <Link href="/e-book/sap/quizzes" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:underline hover:decoration-red-600">
              Quizzes
            </Link>
            <Link href="/e-book/sap/jobs" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:underline hover:decoration-red-600 rounded-b-lg">
              Job Openings
            </Link>
          </div>
        </div>

        {/* MS Dynamics E-Book Dropdown */}
        <div className="relative group">
          <button className="flex items-center gap-1 text-gray-800 hover:text-blue-600 text-[13px] transition-colors">
            MS Dynamics E-Book 
            <IoIosArrowForward className="w-4 h-4 transform rotate-90 transition-transform group-hover:rotate-180" />
          </button>
          <div className="absolute top-full left-0 mt-1 w-48 bg-white shadow-lg rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <Link href="/resources/dynamics-documentation" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-t-lg hover:underline hover:decoration-red-600">
              Resources
            </Link>
            <Link href="/resources/dynamics-interviews" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:underline hover:decoration-red-600">
              Interview Questions
            </Link>
            <Link href="/certification/dynamics-dumps" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:underline hover:decoration-red-600">
              Certificate Dumps
            </Link>
            <Link href="/certification/dynamics-resume" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:underline hover:decoration-red-600">
              Sample Resume
            </Link>
            <Link href="/resources/dynamics-quizzes" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:underline hover:decoration-red-600">
              Quizzes
            </Link>
            <Link href="/resources/dynamics-jobs" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:underline hover:decoration-red-600 rounded-b-lg">
              Job Openings
            </Link>
          </div>
        </div>

        {/* Software Testing E-Book Dropdown */}
        <div className="relative group">
          <button className="flex items-center gap-1 text-gray-800 hover:text-blue-600 text-[13px] transition-colors">
            Software Testing E-Book 
            <IoIosArrowForward className="w-4 h-4 transform rotate-90 transition-transform group-hover:rotate-180" />
          </button>
          <div className="absolute top-full left-0 mt-1 w-48 bg-white shadow-lg rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <Link href="/resources/testing-documentation" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-t-lg hover:underline hover:decoration-red-600">
              Resources
            </Link>
            <Link href="/resources/testing-interviews" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:underline hover:decoration-red-600">
              Interview Questions
            </Link>
            <Link href="/certification/testing-dumps" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:underline hover:decoration-red-600">
              Certificate Dumps
            </Link>
            <Link href="/certification/testing-resume" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:underline hover:decoration-red-600">
              Sample Resume
            </Link>
            <Link href="/resources/testing-quizzes" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:underline hover:decoration-red-600">
              Quizzes
            </Link>
            <Link href="/resources/testing-jobs" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:underline hover:decoration-red-600 rounded-b-lg">
              Job Openings
            </Link>
          </div>
        </div>

        {/* Data Analytics E-Book Dropdown */}
        <div className="relative group">
          <button className="flex items-center gap-1 text-gray-800 hover:text-blue-600 text-[13px] transition-colors">
            Data Analytics E-Book 
            <IoIosArrowForward className="w-4 h-4 transform rotate-90 transition-transform group-hover:rotate-180" />
          </button>
          <div className="absolute top-full left-0 mt-1 w-48 bg-white shadow-lg rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <Link href="/resources/analytics-documentation" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-t-lg hover:underline hover:decoration-red-600">
              Resources
            </Link>
            <Link href="/resources/analytics-interviews" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:underline hover:decoration-red-600">
              Interview Questions
            </Link>
            <Link href="/certification/analytics-dumps" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:underline hover:decoration-red-600">
              Certificate Dumps
            </Link>
            <Link href="/certification/analytics-resume" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:underline hover:decoration-red-600">
              Sample Resume
            </Link>
            <Link href="/resources/analytics-quizzes" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:underline hover:decoration-red-600">
              Quizzes
            </Link>
            <Link href="/resources/analytics-jobs" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:underline hover:decoration-red-600 rounded-b-lg">
              Job Openings
            </Link>
          </div>
        </div>

      </nav>
    </div>
  );
};

export default Navbard;