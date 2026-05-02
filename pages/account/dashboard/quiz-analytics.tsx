import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '@/context/userContext';
import AdminLoader from '@/src/account/common/AdminLoader';
import SignOut from '@/src/account/common/SignOut';
import AdminSidebar from '@/src/account/common/AdminSidebar';
import AdminTopBar from '@/src/account/common/AdminTopBar';
import Head from 'next/head';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Target, 
  Award,
  TrendingUp,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface Quiz {
  _id: string;
  title: string;
  category: string;
}

interface QuizAttempt {
  _id: string;
  userName: string;
  userEmail: string;
  totalMarks: number;
  maxMarks: number;
  percentage: number;
  passed: boolean;
  correctAnswers: number;
  incorrectAnswers: number;
  timeSpent: number;
  completedAt: string;
  createdAt: string;
}

interface QuizAnalytics {
  quiz: {
    title: string;
    category: string;
    totalQuestions: number;
    maxMarks: number;
    passingMarks: number;
  };
  totalAttempts: number;
  passedAttempts: number;
  failedAttempts: number;
  averageScore: number;
  averageMarks: number;
  highestScore: number;
  lowestScore: number;
  averageTimeSpent: number;
  attempts: QuizAttempt[];
}

const QuizAnalytics = () => {
  const { loading, authenticated, isAdmin, setCurrentTab } = useContext(UserContext);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuizId, setSelectedQuizId] = useState<string>('');
  const [analytics, setAnalytics] = useState<QuizAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setCurrentTab("quiz-analytics");
  }, [setCurrentTab]);

  useEffect(() => {
    if (authenticated && isAdmin) {
      fetchQuizzes();
    }
  }, [authenticated, isAdmin]);

  const fetchQuizzes = async () => {
    try {
      const res = await fetch('/api/quiz');
      const data = await res.json();
      if (res.ok) {
        setQuizzes(data);
        if (data.length > 0) {
          setSelectedQuizId(data[0]._id);
        }
      }
    } catch (error) {
      console.error('Failed to fetch quizzes:', error);
      toast.error('Failed to fetch quizzes');
    }
  };

  const fetchAnalytics = async (quizId: string) => {
    if (!quizId) return;
    
    setIsLoading(true);
    try {
      const res = await fetch(`/api/quiz/attempts/analytics?quizId=${quizId}`);
      const data = await res.json();
      
      if (res.ok) {
        setAnalytics(data);
      } else {
        throw new Error(data.error || 'Failed to fetch analytics');
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      toast.error('Failed to fetch quiz analytics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedQuizId) {
      fetchAnalytics(selectedQuizId);
    }
  }, [selectedQuizId]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <AdminLoader />;
  if (!authenticated || !isAdmin) return <SignOut />;

  return (
    <>
      <Head>
        <title>Quiz Analytics | Account Dashboard</title>
        <meta name="description" content="View quiz analytics and student performance data." />
      </Head>

      <div className='w-full h-full md:h-screen min-h-screen flex flex-row items-start justify-start fixed'>
        <AdminSidebar />

        <div className='bg-black flex flex-col w-full h-full md:relative fixed'>
          <AdminTopBar />

          <div className="bg-black p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Quiz Analytics</h2>
                <p className="text-gray-400 mt-1">View student performance and quiz statistics</p>
              </div>
              
              <div className="w-64">
                <Select value={selectedQuizId} onValueChange={setSelectedQuizId}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select a quiz" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {quizzes.map((quiz) => (
                      <SelectItem key={quiz._id} value={quiz._id}>
                        {quiz.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-400">Loading analytics...</p>
              </div>
            ) : !analytics ? (
              <div className="text-center py-8">
                <p className="text-gray-400">Select a quiz to view analytics</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Quiz Info */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">{analytics.quiz.title}</CardTitle>
                    <div className="flex gap-2">
                      <Badge variant="secondary">{analytics.quiz.category}</Badge>
                      <Badge variant="outline" className="text-gray-300">
                        {analytics.quiz.totalQuestions} Questions
                      </Badge>
                      <Badge variant="outline" className="text-gray-300">
                        {analytics.quiz.maxMarks} Max Marks
                      </Badge>
                      <Badge variant="outline" className="text-gray-300">
                        {analytics.quiz.passingMarks}% to Pass
                      </Badge>
                    </div>
                  </CardHeader>
                </Card>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-400 text-sm">Total Attempts</p>
                          <p className="text-2xl font-bold text-white">{analytics.totalAttempts}</p>
                        </div>
                        <Users className="h-8 w-8 text-blue-400" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-400 text-sm">Passed</p>
                          <p className="text-2xl font-bold text-green-400">{analytics.passedAttempts}</p>
                          <p className="text-xs text-gray-500">
                            {analytics.totalAttempts > 0 ? 
                              Math.round((analytics.passedAttempts / analytics.totalAttempts) * 100) : 0}%
                          </p>
                        </div>
                        <CheckCircle className="h-8 w-8 text-green-400" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-400 text-sm">Failed</p>
                          <p className="text-2xl font-bold text-red-400">{analytics.failedAttempts}</p>
                          <p className="text-xs text-gray-500">
                            {analytics.totalAttempts > 0 ? 
                              Math.round((analytics.failedAttempts / analytics.totalAttempts) * 100) : 0}%
                          </p>
                        </div>
                        <XCircle className="h-8 w-8 text-red-400" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-400 text-sm">Average Score</p>
                          <p className="text-2xl font-bold text-yellow-400">{analytics.averageScore}%</p>
                          <p className="text-xs text-gray-500">
                            {analytics.averageMarks}/{analytics.quiz.maxMarks} marks
                          </p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-yellow-400" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Performance Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4 text-center">
                      <Target className="h-8 w-8 text-green-400 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">Highest Score</p>
                      <p className="text-xl font-bold text-green-400">{analytics.highestScore}%</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4 text-center">
                      <Award className="h-8 w-8 text-red-400 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">Lowest Score</p>
                      <p className="text-xl font-bold text-red-400">{analytics.lowestScore}%</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4 text-center">
                      <Clock className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">Avg Time</p>
                      <p className="text-xl font-bold text-blue-400">
                        {formatTime(analytics.averageTimeSpent)}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Student Attempts Table */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Student Attempts</CardTitle>
                    <p className="text-gray-400 text-sm">
                      Detailed view of all quiz attempts
                    </p>
                  </CardHeader>
                  <CardContent>
                    {analytics.attempts.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-400">No attempts found for this quiz</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-gray-700">
                              <th className="text-left py-3 px-2 text-gray-300">Student</th>
                              <th className="text-left py-3 px-2 text-gray-300">Score</th>
                              <th className="text-left py-3 px-2 text-gray-300">Marks</th>
                              <th className="text-left py-3 px-2 text-gray-300">Correct</th>
                              <th className="text-left py-3 px-2 text-gray-300">Incorrect</th>
                              <th className="text-left py-3 px-2 text-gray-300">Time</th>
                              <th className="text-left py-3 px-2 text-gray-300">Status</th>
                              <th className="text-left py-3 px-2 text-gray-300">Date</th>
                              <th className="text-left py-3 px-2 text-gray-300">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {analytics.attempts.map((attempt) => (
                              <tr key={attempt._id} className="border-b border-gray-700 hover:bg-gray-700/50">
                                <td className="py-3 px-2">
                                  <div>
                                    <p className="text-white font-medium">{attempt.userName}</p>
                                    <p className="text-gray-400 text-xs">{attempt.userEmail}</p>
                                  </div>
                                </td>
                                <td className="py-3 px-2">
                                  <span className={`font-bold ${
                                    attempt.passed ? 'text-green-400' : 'text-red-400'
                                  }`}>
                                    {attempt.percentage}%
                                  </span>
                                </td>
                                <td className="py-3 px-2 text-white">
                                  {attempt.totalMarks}/{attempt.maxMarks}
                                </td>
                                <td className="py-3 px-2 text-green-400">
                                  {attempt.correctAnswers}
                                </td>
                                <td className="py-3 px-2 text-red-400">
                                  {attempt.incorrectAnswers}
                                </td>
                                <td className="py-3 px-2 text-white">
                                  {formatTime(attempt.timeSpent)}
                                </td>
                                <td className="py-3 px-2">
                                  <Badge className={
                                    attempt.passed 
                                      ? 'bg-green-600 text-white' 
                                      : 'bg-red-600 text-white'
                                  }>
                                    {attempt.passed ? 'Passed' : 'Failed'}
                                  </Badge>
                                </td>
                                <td className="py-3 px-2 text-gray-300 text-xs">
                                  {formatDate(attempt.completedAt)}
                                </td>
                                <td className="py-3 px-2">
                                  <Button size="sm" variant="outline" asChild>
                                    <Link href={`/quiz/result/${attempt._id}`}>
                                      <Eye className="h-3 w-3 mr-1" />
                                      View
                                    </Link>
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default QuizAnalytics;
