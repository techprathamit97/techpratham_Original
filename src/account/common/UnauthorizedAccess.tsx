import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Lock } from 'lucide-react';
import Link from 'next/link';

interface UnauthorizedAccessProps {
  requiredRole?: string;
  message?: string;
  redirectPath?: string;
}

const UnauthorizedAccess: React.FC<UnauthorizedAccessProps> = ({
  requiredRole = "accountant",
  message = "You don't have permission to access this page.",
  redirectPath = "/admin/dashboard"
}) => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="max-w-md w-full mx-auto p-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-900/20 mb-6">
            <Lock className="h-8 w-8 text-red-400" />
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-4">
            Access Denied
          </h1>
          
          <p className="text-zinc-400 mb-2">
            {message}
          </p>
          
          <p className="text-zinc-500 text-sm mb-8">
            This page requires <span className="text-red-400 font-medium">{requiredRole}</span> role access.
          </p>
          
          <div className="space-y-4">
            <Link href={redirectPath}>
              <Button 
                variant="outline" 
                className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            
            <div className="text-xs text-zinc-600">
              Contact your administrator if you believe this is an error.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedAccess;