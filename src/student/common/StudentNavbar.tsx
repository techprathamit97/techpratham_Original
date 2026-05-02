import React, { useEffect, useState } from 'react';
import { Bell, User, Search } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const StudentNavbar = () => {
  const [studentData, setStudentData] = useState<any>(null);

  useEffect(() => {
    const storedData = sessionStorage.getItem('studentAuth');
    if (storedData) {
      setStudentData(JSON.parse(storedData));
    }
  }, []);

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Search Bar */}
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search courses, assignments, quizzes..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4 ml-6">
            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <Avatar className="w-9 h-9">
                <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                  {studentData?.name?.split(' ').map((n: string) => n[0]).join('') || 'S'}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900">{studentData?.name || 'Student'}</p>
                <p className="text-xs text-gray-500">{studentData?.studentId || ''}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentNavbar;
