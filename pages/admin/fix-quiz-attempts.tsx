import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const FixQuizAttemptsPage = () => {
  const [attemptId, setAttemptId] = useState('');
  const [quizId, setQuizId] = useState('');
  const [loading, setLoading] = useState(false);

  const fixSingleAttempt = async () => {
    if (!attemptId) {
      toast.error('Please enter an attempt ID');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/quiz/fix-negative-marking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attemptId })
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message);
        console.log('Fixed attempt:', result);
      } else {
        toast.error(result.error || 'Failed to fix attempt');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to fix attempt');
    } finally {
      setLoading(false);
    }
  };

  const fixAllAttemptsForQuiz = async () => {
    if (!quizId) {
      toast.error('Please enter a quiz ID');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/quiz/fix-negative-marking', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quizId })
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message);
        console.log('Fixed attempts:', result);
      } else {
        toast.error(result.error || 'Failed to fix attempts');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to fix attempts');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Fix Quiz Attempts - Remove Negative Marking</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Fix Single Attempt</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attempt ID
              </label>
              <Input
                type="text"
                value={attemptId}
                onChange={(e) => setAttemptId(e.target.value)}
                placeholder="Enter attempt ID (e.g., 69d342ff35131c2bc455bde2)"
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                Get the attempt ID from the URL: /quiz/result/[attemptId]
              </p>
            </div>
            <Button 
              onClick={fixSingleAttempt} 
              disabled={loading || !attemptId}
              className="w-full"
            >
              {loading ? 'Fixing...' : 'Fix This Attempt'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fix All Attempts for a Quiz</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quiz ID
              </label>
              <Input
                type="text"
                value={quizId}
                onChange={(e) => setQuizId(e.target.value)}
                placeholder="Enter quiz ID"
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                This will recalculate all attempts for this quiz
              </p>
            </div>
            <Button 
              onClick={fixAllAttemptsForQuiz} 
              disabled={loading || !quizId}
              className="w-full bg-orange-600 hover:bg-orange-700"
            >
              {loading ? 'Fixing...' : 'Fix All Attempts for This Quiz'}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <h3 className="font-semibold text-blue-800 mb-2">What does this do?</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Recalculates quiz scores without negative marking</li>
              <li>• Incorrect answers will get 0 marks instead of negative marks</li>
              <li>• Updates the total marks, percentage, and pass/fail status</li>
              <li>• Only affects existing attempts - new attempts already use the correct calculation</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FixQuizAttemptsPage;
