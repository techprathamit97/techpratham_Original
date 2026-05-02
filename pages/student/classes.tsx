import React from 'react';
import StudentLayout from '@/src/student/common/StudentLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Video } from 'lucide-react';

const StudentClasses = () => {
  return (
    <StudentLayout>
      <div className="p-6">
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <Video className="h-5 w-5 text-red-600" />
              Daily Classes
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-gray-600">Your daily class schedule will appear here.</p>
          </CardContent>
        </Card>
      </div>
    </StudentLayout>
  );
};

export default StudentClasses;
