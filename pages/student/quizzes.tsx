import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import StudentLayout from '@/src/student/common/StudentLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileQuestion, Target, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

interface QuizAttempt {
  _id: string;
  quizTitle: string;
  quizCategory: string;
  totalMarks: number;
  maxMarks: number;
  percentage: number;
  passed: boolean;
  completedAt: string;
  timeSpent: number;
}

const StudentQuizzes = () => {
  const router = useRouter();
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, passed: 0, avgScore: 0 });

  useEffect(() => {
    const storedData = sessionStorage.getItem('studentAuth');
    if (!storedData) {
      router.push('/student/login');
      return;
    }

    const student = JSON.parse(storedData);
    fetchQuizzes(student.studentId);
  }, []);

  const fetchQuizzes = async (studentId: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/student/dashboard?studentId=${studentId}`);
      const data = await res.json();

      if (res.ok) {
        setQuizAttempts(data.data.quizAttempts);
        setStats({
          total: data.data.stats.totalQuizzes,
          passed: data.data.stats.passedQuizzes,
          avgScore: data.data.stats.avgQuizScore
        });
      } else {
        toast.error(data.error || 'Failed to fetch quizzes');
      }
    } catch (error) {
      console.error('Quizzes fetch error:', error);
      toast.error('Failed to load quizzes');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <StudentLayout>
        <div className="p-6 flex items-center justify-center">
          <p className="text-gray-600">Loading quizzes...</p>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="p-6 space-y-6">
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-lg p-6 text-white">
          <h1 className="text-3xl font-bold">Quizzes</h1>
          <p className="text-indigo-100 mt-2">Track your quiz performance and progress</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-gray-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Attempts</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <FileQuestion className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Passed</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.passed}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {stats.total > 0 ? Math.round((stats.passed / stats.total) * 100) : 0}% pass rate
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Target className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Average Score</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.avgScore}%</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quiz Attempts */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <FileQuestion className="h-5 w-5 text-indigo-600" />
              All Quiz Attempts ({quizAttempts.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {quizAttempts.length === 0 ? (
              <div className="text-center py-12">
                <FileQuestion className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No quiz attempts yet</p>
                <p className="text-gray-400 text-sm mt-2">Start taking quizzes to track your progress</p>
              </div>
            ) : (
              <div className="space-y-4">
                {quizAttempts.map((attempt) => (
                  <Card key={attempt._id} className="border-gray-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="text-gray-900 font-semibold text-lg">{attempt.quizTitle}</h3>
                          <p className="text-gray-500 text-sm">{attempt.quizCategory}</p>
                        </div>
                        <Badge className={attempt.passed ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}>
                          {attempt.passed ? 'Passed' : 'Failed'}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Score</p>
                          <p className="text-gray-900 font-medium">
                            {attempt.totalMarks}/{attempt.maxMarks}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Percentage</p>
                          <p className="text-gray-900 font-medium">{attempt.percentage}%</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Time Spent</p>
                          <p className="text-gray-900 font-medium">
                            {Math.round(attempt.timeSpent / 60)} min
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Completed</p>
                          <p className="text-gray-900 font-medium">
                            {new Date(attempt.completedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all ${
                              attempt.passed ? 'bg-green-600' : 'bg-red-600'
                            }`}
                            style={{ width: `${attempt.percentage}%` }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </StudentLayout>
  );
};

export default StudentQuizzes;
