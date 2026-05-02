import React, { useRef } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Target, 
  Award,
  TrendingUp,
  RotateCcw,
  Home,
  FileText,
  AlertCircle,
  Download
} from 'lucide-react';
import { withNavbarSSR } from '@/utils/withNavbarSSR';
import { NavbarData } from '@/utils/navbarData';
import Navbar from '@/src/common/Navbar/Navbar';

interface QuestionResult {
  questionText: string;
  questionType: 'multiple_choice' | 'true_false';
  options?: Array<{ text: string; isCorrect: boolean }>;
  correctAnswer?: boolean;
  explanation: string;
  marks: number;
  userAnswer: any;
  isCorrect: boolean;
  marksAwarded: number;
}

interface StepResult {
  stepNumber: number;
  stepTitle: string;
  totalMarks: number;
  maxMarks: number;
  percentage: number;
  passed: boolean;
  correctAnswers: number;
  totalQuestions: number;
  questions: QuestionResult[];
}

interface QuizResult {
  _id: string;
  quizId: string;
  userId: string;
  userEmail: string;
  userName: string;
  totalMarks: number;
  maxMarks: number;
  percentage: number;
  passed: boolean;
  timeSpent: number;
  startedAt: string;
  completedAt: string;
  quizType?: 'single_step' | 'multi_step';
  quiz: {
    title: string;
    category: string;
    description: string;
    quizType?: 'single_step' | 'multi_step';
    timing?: number;
    passingMarks?: number;
    maxMarks?: number;
    overallPassingPercentage?: number;
    eachQuestionMarks: number;
    negativeMarking: {
      enabled: boolean;
      marksDeducted: number;
    };
  };
  questions?: QuestionResult[];
  stepResults?: StepResult[];
  correctAnswers: number;
  incorrectAnswers: number;
}

interface QuizResultPageProps {
  navbarData: NavbarData;
  result: QuizResult | null;
}

const QuizResultPage: React.FC<QuizResultPageProps> = ({ navbarData, result }) => {
  const printRef = useRef<HTMLDivElement>(null);

  if (!result) {
    return (
      <>
        <Navbar navbarData={navbarData} />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Result Not Found</h1>
            <p className="text-gray-600 mb-6">The quiz result you're looking for doesn't exist.</p>
            <Button asChild>
              <Link href="/quiz">Back to Quizzes</Link>
            </Button>
          </div>
        </div>
      </>
    );
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getPerformanceColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceMessage = (percentage: number, passed: boolean) => {
    if (passed) {
      if (percentage >= 90) return 'Excellent! Outstanding performance!';
      if (percentage >= 80) return 'Great job! Well done!';
      return 'Good work! You passed the quiz!';
    } else {
      return 'Keep practicing! You can retake the quiz to improve your score.';
    }
  };

  const handleDownloadPDF = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const isMultiStep = result.quizType === 'multi_step' || result.quiz.quizType === 'multi_step';

  return (
    <>
      <Head>
        <title>Quiz Result - {result.quiz.title} | TechPratham</title>
        <meta name="description" content={`Quiz result for ${result.quiz.title}`} />
      </Head>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-content, #printable-content * {
            visibility: visible;
          }
          #printable-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <Navbar navbarData={navbarData} />

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8" ref={printRef} id="printable-content">
            
            {/* Result Header */}
            <Card className={`border-l-4 ${result.passed ? 'border-l-green-500' : 'border-l-red-500'}`}>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  {result.passed ? (
                    <CheckCircle className="h-16 w-16 text-green-500" />
                  ) : (
                    <XCircle className="h-16 w-16 text-red-500" />
                  )}
                </div>
                <CardTitle className="text-2xl font-bold text-gray-800">
                  {result.passed ? 'Congratulations!' : 'Quiz Completed'}
                </CardTitle>
                <p className="text-lg text-gray-600 mt-2">
                  {getPerformanceMessage(result.percentage, result.passed)}
                </p>
                <Badge 
                  className={`mt-4 text-lg px-4 py-2 ${
                    result.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {result.passed ? 'PASSED' : 'FAILED'}
                </Badge>
              </CardHeader>
            </Card>

            {/* Quiz Info */}
          

            {/* Score Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Award className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <div className={`text-3xl font-bold ${getPerformanceColor(result.percentage)}`}>
                    {result.percentage.toFixed(2)}%
                  </div>
                  <div className="text-sm text-gray-600">Final Score</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {result.totalMarks}/{result.maxMarks} marks
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-green-600">
                    {result.correctAnswers}
                  </div>
                  <div className="text-sm text-gray-600">Correct Answers</div>
                  <div className="text-xs text-gray-500 mt-1">
                    out of {isMultiStep 
                      ? result.stepResults?.reduce((sum, step) => sum + step.totalQuestions, 0)
                      : result.questions?.length || 0
                    }
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <XCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-red-600">
                    {result.incorrectAnswers}
                  </div>
                  <div className="text-sm text-gray-600">Incorrect Answers</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Clock className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-purple-600">
                    {formatTime(result.timeSpent)}
                  </div>
                  <div className="text-sm text-gray-600">Time Taken</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {isMultiStep ? 'Total time' : `out of ${result.quiz.timing} minutes`}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Module-wise Performance (Multi-step only) */}
            {isMultiStep && result.stepResults && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Module-wise Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {result.stepResults.map((step, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-800">
                          Module {step.stepNumber}: {step.stepTitle}
                        </h4>
                        <Badge className={step.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {step.passed ? 'Passed' : 'Failed'}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-2">
                        <div>
                          <span className="text-gray-600">Score:</span>
                          <span className={`font-semibold ml-2 ${getPerformanceColor(step.percentage)}`}>
                            {step.percentage.toFixed(2)}%
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Marks:</span>
                          <span className="font-semibold ml-2">
                            {step.totalMarks}/{step.maxMarks}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Correct:</span>
                          <span className="font-semibold ml-2 text-green-600">
                            {step.correctAnswers}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Total:</span>
                          <span className="font-semibold ml-2">
                            {step.totalQuestions}
                          </span>
                        </div>
                      </div>
                      <Progress value={step.percentage} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Performance Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Performance Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Overall Performance</span>
                    <span className={getPerformanceColor(result.percentage)}>
                      {result.percentage.toFixed(2)}%
                    </span>
                  </div>
                  <Progress value={result.percentage} className="h-3" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Passing Score Required:</span>
                    <span className="font-semibold ml-2">
                      {isMultiStep ? result.quiz.overallPassingPercentage : result.quiz.passingMarks}%
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Your Score:</span>
                    <span className={`font-semibold ml-2 ${getPerformanceColor(result.percentage)}`}>
                      {result.percentage.toFixed(2)}%
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Accuracy:</span>
                    <span className="font-semibold ml-2">
                      {Math.round((result.correctAnswers / (isMultiStep 
                        ? result.stepResults?.reduce((sum, step) => sum + step.totalQuestions, 0) || 1
                        : result.questions?.length || 1
                      )) * 100)}%
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Total Questions:</span>
                    <span className="font-semibold ml-2">
                      {isMultiStep 
                        ? result.stepResults?.reduce((sum, step) => sum + step.totalQuestions, 0)
                        : result.questions?.length || 0
                      }
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Results */}
            {isMultiStep && result.stepResults ? (
              // Multi-step detailed results
              result.stepResults.map((step, stepIndex) => (
                <Card key={stepIndex}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Module {step.stepNumber}: {step.stepTitle} - Detailed Results
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      Score: {step.totalMarks}/{step.maxMarks} ({step.percentage.toFixed(2)}%) - {step.passed ? 'Passed' : 'Failed'}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {step.questions.map((question, qIndex) => (
                      <QuestionDetail key={qIndex} question={question} index={qIndex} />
                    ))}
                  </CardContent>
                </Card>
              ))
            ) : (
              // Single-step detailed results
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Detailed Results
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    Review your answers and explanations for each question
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {result.questions?.map((question, index) => (
                    <QuestionDetail key={index} question={question} index={index} />
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center no-print">
              <Button onClick={handleDownloadPDF} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download as PDF
              </Button>
              
              <Button asChild variant="outline">
                <Link href="/quiz" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Back to Quizzes
                </Link>
              </Button>
              
              <Button asChild>
                <Link href={`/quiz/${result.quizId}`} className="flex items-center gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Retake Quiz
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Question Detail Component
const QuestionDetail: React.FC<{ question: QuestionResult; index: number }> = ({ question, index }) => {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-semibold text-gray-800 flex-1">
          Question {index + 1}: {question.questionText}
        </h4>
        <div className="flex items-center gap-2 ml-4">
          {question.isCorrect ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <XCircle className="h-5 w-5 text-red-500" />
          )}
          <span className={`text-sm font-semibold ${
            question.isCorrect ? 'text-green-600' : 'text-red-600'
          }`}>
            {question.marksAwarded > 0 ? '+' : ''}{question.marksAwarded} marks
          </span>
        </div>
      </div>

      {question.questionType === 'multiple_choice' ? (
        <div className="space-y-2">
          {question.options?.map((option, optionIndex) => {
            const isUserAnswer = question.userAnswer === optionIndex;
            const isCorrectAnswer = option.isCorrect === true;
            
            // Determine background color priority: correct answer (green) > user's wrong answer (red) > default (gray)
            let bgClass = 'bg-gray-50 border-gray-200';
            if (isCorrectAnswer) {
              bgClass = 'bg-green-50 border-green-200';
            } else if (isUserAnswer && !isCorrectAnswer) {
              bgClass = 'bg-red-50 border-red-200';
            }
            
            return (
              <div
                key={optionIndex}
                className={`p-3 rounded border ${bgClass}`}
              >
                <div className="flex items-center gap-2">
                  {isCorrectAnswer && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                  {isUserAnswer && !isCorrectAnswer && (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-sm flex-1">{option.text}</span>
                  <div className="flex items-center gap-2">
                    {isUserAnswer && (
                      <Badge variant="outline" className="text-xs">
                        Your Answer
                      </Badge>
                    )}
                    {isCorrectAnswer && (
                      <Badge className="text-xs bg-green-100 text-green-800">
                        Correct Answer
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-2">
          {/* True option */}
          <div className={`p-3 rounded border ${
            question.correctAnswer === true
              ? 'bg-green-50 border-green-200'
              : (question.userAnswer === true && question.correctAnswer === false)
              ? 'bg-red-50 border-red-200'
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center gap-2">
              {question.correctAnswer === true && (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
              {(question.userAnswer === true && question.correctAnswer === false) && (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
              <span className="text-sm flex-1">True</span>
              <div className="flex items-center gap-2">
                {question.userAnswer === true && (
                  <Badge variant="outline" className="text-xs">
                    Your Answer
                  </Badge>
                )}
                {question.correctAnswer === true && (
                  <Badge className="text-xs bg-green-100 text-green-800">
                    Correct Answer
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          {/* False option */}
          <div className={`p-3 rounded border ${
            question.correctAnswer === false
              ? 'bg-green-50 border-green-200'
              : (question.userAnswer === false && question.correctAnswer === true)
              ? 'bg-red-50 border-red-200'
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center gap-2">
              {question.correctAnswer === false && (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
              {(question.userAnswer === false && question.correctAnswer === true) && (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
              <span className="text-sm flex-1">False</span>
              <div className="flex items-center gap-2">
                {question.userAnswer === false && (
                  <Badge variant="outline" className="text-xs">
                    Your Answer
                  </Badge>
                )}
                {question.correctAnswer === false && (
                  <Badge className="text-xs bg-green-100 text-green-800">
                    Correct Answer
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {question.explanation && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-sm font-semibold text-blue-800 mb-1">
                Explanation:
              </div>
              <div className="text-sm text-blue-700">
                {question.explanation}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = withNavbarSSR(async (context) => {
  const { attemptId } = context.params!;
  
  try {
    const protocol = context.req.headers.host?.includes('localhost') ? 'http' : 'https';
    const baseUrl = process.env.NEXTAUTH_URL || `${protocol}://${context.req.headers.host}`;
    const response = await fetch(`${baseUrl}/api/quiz/attempt/${attemptId}`);
    
    if (!response.ok) {
      return {
        props: {
          result: null
        }
      };
    }
    
    const result = await response.json();
    
    return {
      props: {
        result: JSON.parse(JSON.stringify(result))
      }
    };
  } catch (error) {
    console.error('Error fetching quiz result:', error);
    return {
      props: {
        result: null
      }
    };
  }
});

export default QuizResultPage;
