import React from 'react';
import TrainerLayout from '@/src/trainer/common/TrainerLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail } from 'lucide-react';

const TrainerSendEmail = () => {
  return (
    <TrainerLayout>
      <div className="p-6 space-y-6">
        <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-lg p-6 text-white">
          <h1 className="text-3xl font-bold">Send Email</h1>
          <p className="text-green-100 mt-2">Send emails to your students</p>
        </div>

        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <Mail className="h-5 w-5 text-green-600" />
              Email Composer
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-center py-12">
              <Mail className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Email functionality will be available here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </TrainerLayout>
  );
};

export default TrainerSendEmail;
