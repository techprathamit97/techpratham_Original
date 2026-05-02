import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const FixStudentIds = () => {
  const [isFixing, setIsFixing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleFixStudentIds = async () => {
    setIsFixing(true);
    try {
      const res = await fetch('/api/course/fix-student-ids', {
        method: 'POST'
      });
      
      const data = await res.json();
      
      if (data.success) {
        setResult(data);
        toast.success(`Fixed ${data.updatedCount} student IDs`);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error fixing student IDs:', error);
      toast.error('Failed to fix student IDs');
    } finally {
      setIsFixing(false);
    }
  };

  return (
    <div className="p-6 bg-black min-h-screen">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">Fix Student IDs</h1>
        
        <div className="bg-zinc-900 rounded-lg p-6">
          <p className="text-zinc-300 mb-4">
            This utility will generate student IDs for all enrollments that don't have them.
          </p>
          
          <Button 
            onClick={handleFixStudentIds}
            disabled={isFixing}
            variant="manual"
          >
            {isFixing ? 'Fixing...' : 'Fix Student IDs'}
          </Button>
          
          {result && (
            <div className="mt-4 p-4 bg-green-900/20 border border-green-500/20 rounded-lg">
              <p className="text-green-400">
                ✅ Successfully updated {result.updatedCount} enrollments with student IDs
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FixStudentIds;