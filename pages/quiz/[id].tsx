import React, { useState, useEffect, useContext } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Clock, 
  Target, 
  Award, 
  BookOpen,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Flag,
  Home,
  Eye
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { UserContext } from '@/context/userContext';
import { useSession } from 'next-auth/react';
import { withNavbarSSR } from '@/utils/withNavbarSSR';
import { NavbarData } from '@/utils/navbarData';
import Navbar from '@/src/common/Navbar/Navbar';
import { toast } from 'sonner';

interface Question {
  _id: string;
  questionText: string;
  questionType: 'multiple_choice' | 'true_false';
  options?: Array<{ text: string; isCorrect: boolean }>;
  correctAnswer?: boolean;
  explanation: string;
  marks: number;
}

interface Step {
  _id: string;
  stepNumber: number;
  stepTitle: string;
  stepDescription: string;
  timing: number;
  passingMarks: number;
  questions: Question[];
  isActive: boolean;
}

interface Quiz {
  _id: string;
  title: string;
  category: string;
  description: string;
  quizType?: 'single_step' | 'multi_step';
  // Single-step fields
  timing?: number;
  passingMarks?: number;
  maxMarks?: number;
  questions?: Question[];
  // Multi-step fields
  steps?: Step[];
  // Common fields
  eachQuestionMarks: number;
  negativeMarking: {
    enabled: boolean;
    marksDeducted: number;
  };
  allowStepNavigation?: boolean;
  requireSequentialCompletion?: boolean;
  showStepResults?: boolean;
  overallPassingPercentage?: number;
  totalQuestions: number;
  passingPercentage: string;
}

interface QuizPageProps {
  navbarData: NavbarData;
  quiz: Quiz | null;
  canTakeQuiz: boolean;
  eligibilityMessage: string | null;
}

const QuizTakingPage: React.FC<QuizPageProps> = ({ navbarData, quiz, canTakeQuiz, eligibilityMessage }) => {
  const router = useRouter();
  const { authenticated, userData } = useContext(UserContext);
  const { data: session } = useSession();
  
  // Multi-step quiz states
  const [currentStep, setCurrentStep] = useState(0);
  const [currentStepQuestion, setCurrentStepQuestion] = useState(0);
  const [stepAnswers, setStepAnswers] = useState<Record<number, Record<number, any>>>({});
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [showStepCompleteDialog, setShowStepCompleteDialog] = useState(false);
  const [showTimeExpiredDialog, setShowTimeExpiredDialog] = useState(false);
  const [showStepNavigationConfirm, setShowStepNavigationConfirm] = useState(false);
  const [autoProgressTimer, setAutoProgressTimer] = useState<number | null>(null);
  
  // Single-step quiz states
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  
  // Common states
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Fullscreen functionality
  const enterFullscreen = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if ((element as any).webkitRequestFullscreen) {
      (element as any).webkitRequestFullscreen();
    } else if ((element as any).msRequestFullscreen) {
      (element as any).msRequestFullscreen();
    }
  };

  const exitFullscreen = () => {
    // Check if document is actually in fullscreen before trying to exit
    if (document.fullscreenElement || 
        (document as any).webkitFullscreenElement || 
        (document as any).msFullscreenElement) {
      
      if (document.exitFullscreen) {
        document.exitFullscreen().catch((err) => {
          console.log('Error exiting fullscreen:', err);
        });
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
    }
  };

  // Monitor fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isInFullscreen = !!(
        document.fullscreenElement || 
        (document as any).webkitFullscreenElement || 
        (document as any).msFullscreenElement ||
        (document as any).mozFullScreenElement
      );
      setIsFullscreen(isInFullscreen);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Auto-enter fullscreen when quiz starts (only for question interface)
  useEffect(() => {
    if (quizStarted && !isFullscreen) {
      enterFullscreen();
    }
  }, [quizStarted, isFullscreen]);

  // Exit fullscreen when quiz ends or user navigates away
  useEffect(() => {
    return () => {
      if (isFullscreen) {
        exitFullscreen();
      }
    };
  }, [isFullscreen]);

  // Prevent right-click and common shortcuts during quiz
  useEffect(() => {
    if (quizStarted) {
      const handleKeyDown = (e: KeyboardEvent) => {
        // Prevent F12, Ctrl+Shift+I, Ctrl+U, etc.
        if (
          e.key === 'F12' ||
          (e.ctrlKey && e.shiftKey && e.key === 'I') ||
          (e.ctrlKey && e.shiftKey && e.key === 'C') ||
          (e.ctrlKey && e.key === 'u') ||
          (e.ctrlKey && e.key === 'U') ||
          (e.altKey && e.key === 'Tab')
        ) {
          e.preventDefault();
          toast.error('This action is not allowed during the quiz');
        }
      };

      const handleContextMenu = (e: MouseEvent) => {
        e.preventDefault();
        toast.error('Right-click is disabled during the quiz');
      };

      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('contextmenu', handleContextMenu);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('contextmenu', handleContextMenu);
      };
    }
  }, [quizStarted]);

  useEffect(() => {
    if (quiz && quizStarted) {
      if (quiz.quizType === 'multi_step' && quiz.steps && quiz.steps.length > 0) {
        // For multi-step, use current step's timing
        const currentStepData = quiz.steps[currentStep];
        setTimeLeft(currentStepData.timing * 60);
      } else if (quiz.timing) {
        // For single-step, use quiz timing
        setTimeLeft(quiz.timing * 60);
      }
      setStartTime(new Date());
    }
  }, [quiz, quizStarted, currentStep]);

  useEffect(() => {
    if (timeLeft > 0 && quizStarted) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && quizStarted && startTime) {
      // Only trigger time expired if quiz has actually started (startTime is set)
      // Time's up - show dialog and handle accordingly
      if (quiz?.quizType === 'multi_step' && quiz.steps && currentStep < quiz.steps.length - 1) {
        // For multi-step, show time expired dialog
        setShowTimeExpiredDialog(true);
      } else {
        // For single-step or last step, auto-submit
        toast.error('Time is up! Submitting your quiz...');
        handleSubmitQuiz();
      }
    }
  }, [timeLeft, quizStarted, startTime]);

  const handleTimeExpiredContinue = () => {
    setShowTimeExpiredDialog(false);
    setCompletedSteps(prev => new Set([...prev, currentStep]));
    
    // Move to next step
    if (quiz?.steps && quiz.steps[currentStep + 1]) {
      setCurrentStep(currentStep + 1);
      setCurrentStepQuestion(0);
      const nextStepData = quiz.steps[currentStep + 1];
      setTimeLeft(nextStepData.timing * 60);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionIndex: number, answer: any) => {
    if (quiz?.quizType === 'multi_step') {
      // For multi-step, store answers per step
      setStepAnswers(prev => ({
        ...prev,
        [currentStep]: {
          ...(prev[currentStep] || {}),
          [questionIndex]: answer
        }
      }));
    } else {
      // For single-step
      setAnswers(prev => ({
        ...prev,
        [questionIndex]: answer
      }));
    }
  };

  const handleNextQuestion = () => {
    if (quiz?.quizType === 'multi_step' && quiz.steps) {
      const currentStepData = quiz.steps[currentStep];
      if (currentStepQuestion < currentStepData.questions.length - 1) {
        setCurrentStepQuestion(currentStepQuestion + 1);
      }
    } else if (quiz?.questions && currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (quiz?.quizType === 'multi_step') {
      if (currentStepQuestion > 0) {
        setCurrentStepQuestion(currentStepQuestion - 1);
      }
    } else if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleNextStep = () => {
    // Show confirmation dialog before moving to next step
    setShowStepNavigationConfirm(true);
  };

  const confirmNextStep = () => {
    setShowStepNavigationConfirm(false);
    
    if (quiz?.quizType === 'multi_step' && quiz.steps && currentStep < quiz.steps.length - 1) {
      // Mark current step as completed
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      
      // Check if all questions in current step are answered
      const currentStepData = quiz.steps[currentStep];
      const allAnswered = currentStepData.questions.every((_, qIndex) => 
        stepAnswers[currentStep]?.[qIndex] !== undefined
      );
      
      if (allAnswered) {
        // Show completion dialog
        setShowStepCompleteDialog(true);
        
        // Auto-progress after 10 seconds
        const timer = window.setTimeout(() => {
          setShowStepCompleteDialog(false);
          setCurrentStep(currentStep + 1);
          setCurrentStepQuestion(0);
          // Reset timer for next step
          if (quiz.steps && quiz.steps[currentStep + 1]) {
            const nextStepData = quiz.steps[currentStep + 1];
            setTimeLeft(nextStepData.timing * 60);
          }
        }, 10000);
        
        setAutoProgressTimer(timer);
      } else {
        // Move to next step immediately if not all answered
        setCurrentStep(currentStep + 1);
        setCurrentStepQuestion(0);
        // Reset timer for next step
        if (quiz.steps && quiz.steps[currentStep + 1]) {
          const nextStepData = quiz.steps[currentStep + 1];
          setTimeLeft(nextStepData.timing * 60);
        }
      }
    }
  };

  const handleManualNextStep = () => {
    if (autoProgressTimer) {
      clearTimeout(autoProgressTimer);
      setAutoProgressTimer(null);
    }
    setShowStepCompleteDialog(false);
    if (quiz?.quizType === 'multi_step' && quiz.steps && currentStep < quiz.steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setCurrentStepQuestion(0);
      if (quiz.steps[currentStep + 1]) {
        const nextStepData = quiz.steps[currentStep + 1];
        setTimeLeft(nextStepData.timing * 60);
      }
    }
  };

  const handlePreviousStep = () => {
    if (quiz?.quizType === 'multi_step' && quiz.steps && currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setCurrentStepQuestion(0);
      // Reset timer for previous step
      if (quiz.steps[currentStep - 1]) {
        const prevStepData = quiz.steps[currentStep - 1];
        setTimeLeft(prevStepData.timing * 60);
      }
    }
  };

  const handleSubmitQuiz = async () => {
    if (!authenticated || !session?.user || !quiz || !startTime) {
      toast.error('Please login to submit the quiz');
      router.push(`/auth/login?redirect=/quiz/${quiz?._id}`);
      return;
    }

    // Check if it's single-step and has no questions
    if (quiz.quizType !== 'multi_step' && (!quiz.questions || quiz.questions.length === 0)) {
      toast.error('No questions available');
      return;
    }

    setIsSubmitting(true);

    try {
      const timeSpent = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
      
      let submissionAnswers: any[];
      
      if (quiz.quizType === 'multi_step' && quiz.steps) {
        // For multi-step quizzes, flatten all step answers
        submissionAnswers = quiz.steps.flatMap((step, stepIndex) => 
          step.questions.map((_, questionIndex) => ({
            stepIndex,
            questionIndex,
            selectedAnswer: stepAnswers[stepIndex]?.[questionIndex] !== undefined 
              ? stepAnswers[stepIndex][questionIndex] 
              : null
          }))
        );
      } else {
        // For single-step quizzes
        submissionAnswers = quiz.questions!.map((_, index) => ({
          selectedAnswer: answers[index] !== undefined ? answers[index] : null
        }));
      }

      // Get user data from session and userData context
      const userId = userData._id || session.user.email || 'unknown';
      const userEmail = session.user.email || userData.email || 'unknown@example.com';
      const userName = userData.firstName && userData.lastName 
        ? `${userData.firstName} ${userData.lastName}`
        : session.user.name || userData.name || 'Unknown User';

      console.log('Submitting quiz with data:', {
        quizId: quiz._id,
        quizType: quiz.quizType,
        userId,
        userEmail,
        userName,
        answersCount: submissionAnswers.length,
        timeSpent
      });

      const response = await fetch('/api/quiz/attempt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          quizId: quiz._id,
          quizType: quiz.quizType || 'single_step',
          userId,
          userEmail,
          userName,
          answers: submissionAnswers,
          timeSpent,
          startedAt: startTime.toISOString()
        })
      });

      console.log('Response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Submit result:', result);
        setAttemptId(result.attemptId);
        setShowConfirmDialog(false);
        setShowSuccessDialog(true);
        toast.success(result.message || 'Quiz completed successfully!');
      } else {
        const error = await response.json();
        console.error('Submit error:', error);
        
        if (response.status === 403) {
          // User not eligible (already attempted)
          toast.error(error.error);
          setShowConfirmDialog(false);
        } else {
          toast.error(error.error || 'Failed to submit quiz');
        }
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast.error('Failed to submit quiz');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAnsweredCount = () => {
    if (quiz?.quizType === 'multi_step' && quiz.steps) {
      // Count all answered questions across all steps
      return quiz.steps.reduce((total, step, stepIndex) => {
        const stepAnswerCount = step.questions.filter((_, qIndex) => 
          stepAnswers[stepIndex]?.[qIndex] !== undefined
        ).length;
        return total + stepAnswerCount;
      }, 0);
    }
    return Object.keys(answers).length;
  };

  const getCurrentStepAnsweredCount = () => {
    if (quiz?.quizType === 'multi_step' && quiz.steps) {
      const currentStepData = quiz.steps[currentStep];
      return currentStepData.questions.filter((_, qIndex) => 
        stepAnswers[currentStep]?.[qIndex] !== undefined
      ).length;
    }
    return 0;
  };

  const getTotalQuestions = () => {
    if (quiz?.quizType === 'multi_step' && quiz.steps) {
      return quiz.steps.reduce((total, step) => total + step.questions.length, 0);
    }
    return quiz?.questions?.length || 0;
  };

  const getProgressPercentage = () => {
    const total = getTotalQuestions();
    if (total === 0) return 0;
    return (getAnsweredCount() / total) * 100;
  };

  if (!quiz) {
    return (
      <>
        <Navbar navbarData={navbarData} />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Quiz Not Found</h1>
            <p className="text-gray-600 mb-6">The quiz you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => router.push('/quiz')}>
              Back to Quizzes
            </Button>
          </div>
        </div>
      </>
    );
  }

  // Debug logging
  if (typeof window !== 'undefined') {
    console.log('Quiz data:', {
      quizType: quiz.quizType,
      hasSteps: !!quiz.steps,
      stepsLength: quiz.steps?.length,
      hasQuestions: !!quiz.questions,
      questionsLength: quiz.questions?.length
    });
  }

  // Check if this is a multi-step quiz - but don't block it, we support it now!
  // Just ensure we have valid data
  if (quiz.quizType === 'multi_step' && (!quiz.steps || quiz.steps.length === 0)) {
    return (
      <>
        <Navbar navbarData={navbarData} />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-4">No Steps Available</h1>
            <p className="text-gray-600 mb-6">
              This multi-step quiz doesn't have any steps configured yet.
            </p>
            <Button onClick={() => router.push('/quiz')}>
              Back to Quizzes
            </Button>
          </div>
        </div>
      </>
    );
  }

  // Ensure questions/steps array exists
  if (quiz.quizType === 'multi_step') {
    // For multi-step, check if steps exist and have questions
    if (!quiz.steps || quiz.steps.length === 0 || quiz.steps.every(step => !step.questions || step.questions.length === 0)) {
      return (
        <>
          <Navbar navbarData={navbarData} />
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">No Questions Available</h1>
              <p className="text-gray-600 mb-6">This quiz doesn't have any questions yet.</p>
              <Button onClick={() => router.push('/quiz')}>
                Back to Quizzes
              </Button>
            </div>
          </div>
        </>
      );
    }
  } else {
    // For single-step, check if questions exist
    if (!quiz.questions || quiz.questions.length === 0) {
      return (
        <>
          <Navbar navbarData={navbarData} />
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">No Questions Available</h1>
              <p className="text-gray-600 mb-6">This quiz doesn't have any questions yet.</p>
              <Button onClick={() => router.push('/quiz')}>
                Back to Quizzes
              </Button>
            </div>
          </div>
        </>
      );
    }
  }

  if (!quizStarted) {
    return (
      <>
        <Head>
          <title>{quiz.title} - Online Quiz | TechPratham</title>
          <meta name="description" content={quiz.description} />
        </Head>

        {/* Normal interface with navbar BEFORE quiz starts */}
        <Navbar navbarData={navbarData} />

        <div className="min-h-screen bg-gray-50 py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Quiz Info Card */}
              <Card className="mb-8">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => router.push('/quiz')}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Quizzes
                    </Button>
                    <Badge variant="secondary">{quiz.category}</Badge>
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-800">
                    {quiz.title}
                  </CardTitle>
                  <p className="text-gray-600 mt-2">{quiz.description}</p>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Quiz Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-blue-700">
                        {quiz.quizType === 'multi_step' && quiz.steps
                          ? quiz.steps.reduce((total, step) => total + step.timing, 0)
                          : quiz.timing || 0}
                      </div>
                      <div className="text-sm text-blue-600">Minutes{quiz.quizType === 'multi_step' ? ' (Total)' : ''}</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <BookOpen className="h-8 w-8 text-green-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-green-700">
                        {quiz.quizType === 'multi_step' && quiz.steps
                          ? quiz.steps.reduce((total, step) => total + step.questions.length, 0)
                          : quiz.questions?.length || 0}
                      </div>
                      <div className="text-sm text-green-600">Questions{quiz.quizType === 'multi_step' ? ' (Total)' : ''}</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <Target className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-orange-700">
                        {quiz.quizType === 'multi_step' 
                          ? quiz.overallPassingPercentage || 70
                          : quiz.passingMarks || 0}%
                      </div>
                      <div className="text-sm text-orange-600">To Pass</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <Award className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-purple-700">
                        {quiz.quizType === 'multi_step' && quiz.steps
                          ? quiz.steps.reduce((total, step) => total + (step.questions.length * (quiz.eachQuestionMarks || 1)), 0)
                          : quiz.maxMarks || 0}
                      </div>
                      <div className="text-sm text-purple-600">Max Marks</div>
                    </div>
                  </div>

                  {/* Multi-step specific info */}
                  {quiz.quizType === 'multi_step' && quiz.steps && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="font-semibold text-blue-800 mb-2">Multi-Step Quiz Structure</h3>
                      <div className="space-y-2 text-sm text-blue-700">
                        <p>• This quiz has {quiz.steps.length} steps/modules</p>
                        {quiz.steps.map((step, index) => (
                          <p key={index}>
                            • Step {step.stepNumber}: {step.stepTitle} ({step.questions.length} questions, {step.timing} minutes)
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Instructions */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <h3 className="font-semibold text-yellow-800 mb-3 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Instructions
                    </h3>
                    <ul className="space-y-2 text-yellow-700 text-sm">
                      {quiz.quizType === 'multi_step' && quiz.steps ? (
                        <>
                          <li>• This is a multi-step quiz with {quiz.steps.length} modules</li>
                          <li>• Each step has its own time limit and passing criteria</li>
                          <li>• Total time: {quiz.steps.reduce((total, step) => total + step.timing, 0)} minutes</li>
                          <li>• Overall passing percentage: {quiz.overallPassingPercentage || 70}%</li>
                          {quiz.allowStepNavigation && <li>• You can navigate between steps</li>}
                          {quiz.requireSequentialCompletion && <li>• Steps must be completed in order</li>}
                        </>
                      ) : (
                        <>
                          <li>• You have {quiz.timing || 0} minutes to complete this quiz</li>
                          <li>• You need {quiz.passingMarks || 0}% to pass this quiz</li>
                        </>
                      )}
                      <li>• Each question carries {quiz.eachQuestionMarks} marks</li>
                      {quiz.negativeMarking.enabled && (
                        <li>• Negative marking: -{quiz.negativeMarking.marksDeducted} marks for wrong answers</li>
                      )}
                      <li>• The quiz will open in fullscreen mode for security</li>
                      <li>• You can navigate between questions and change your answers</li>
                      <li>• The quiz will auto-submit when time runs out</li>
                      <li>• Right-click and keyboard shortcuts are disabled during the quiz</li>
                      <li>• Make sure you have a stable internet connection</li>
                    </ul>
                  </div>

                  {/* Fullscreen Notice */}
                 
                  {/* 24-Hour Restriction Notice */}
                  {!canTakeQuiz && eligibilityMessage && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                      <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                        <XCircle className="h-5 w-5" />
                        Quiz Unavailable
                      </h3>
                      <p className="text-red-700 text-sm">
                        {eligibilityMessage}
                      </p>
                      <p className="text-red-600 text-xs mt-2">
                        You can only attempt each quiz once every 24 hours. Please try again later.
                      </p>
                    </div>
                  )}

                  {/* Start Button */}
                  <div className="text-center">
                    {!authenticated ? (
                      <div className="space-y-4">
                        <p className="text-gray-600">Please login to take this quiz</p>
                        <Button onClick={() => router.push(`/auth/login?redirect=/quiz/${quiz._id}`)}>
                          Login to Start Quiz
                        </Button>
                      </div>
                    ) : !canTakeQuiz ? (
                      <div className="space-y-4">
                        <p className="text-gray-600">You have already attempted this quiz recently</p>
                        <Button 
                          onClick={() => router.push('/quiz')}
                          variant="outline"
                        >
                          Back to Quizzes
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        size="lg" 
                        className="bg-gradient-to-tl from-[#C6151D] to-[#600A0E] hover:from-blue-700 hover:to-purple-700 px-8 py-3"
                        onClick={() => setQuizStarted(true)}
                      >
                        Start Quiz
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Get current question based on quiz type
  const currentQ = quiz.quizType === 'multi_step' && quiz.steps
    ? quiz.steps[currentStep]?.questions[currentStepQuestion]
    : quiz.questions?.[currentQuestion];

  const currentAnswer = quiz.quizType === 'multi_step'
    ? stepAnswers[currentStep]?.[currentStepQuestion]
    : answers[currentQuestion];

  if (!currentQ) {
    return (
      <>
        <Navbar navbarData={navbarData} />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Question Not Found</h1>
            <p className="text-gray-600 mb-6">Unable to load the current question.</p>
            <Button onClick={() => router.push('/quiz')}>
              Back to Quizzes
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{quiz.title} - Question {currentQuestion + 1} | TechPratham</title>
      </Head>

      {/* Fullscreen Quiz Interface - No Navbar */}
      <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
        {/* Fullscreen Warning */}
        {quizStarted && !isFullscreen && (
          <div className="bg-red-600 text-white p-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-semibold">Please enable fullscreen mode for the quiz</span>
              <Button 
                onClick={enterFullscreen}
                size="sm"
                className="ml-4 bg-white text-red-600 hover:bg-gray-100"
              >
                Enter Fullscreen
              </Button>
            </div>
          </div>
        )}

        {/* Minimal Header with Timer and Progress - FIXED */}
        <div className="bg-gradient-to-tl from-[#C6151D] to-[#600A0E] text-white shadow-lg flex-shrink-0">
          <div className="container mx-auto px-4 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <h1 className="text-lg font-bold">{quiz.title}</h1>
                  {quiz.quizType === 'multi_step' && quiz.steps ? (
                    <div className="text-blue-100 text-xs space-y-0.5">
                      <p>Step {currentStep + 1} of {quiz.steps.length}: {quiz.steps[currentStep].stepTitle}</p>
                      <p>Question {currentStepQuestion + 1} of {quiz.steps[currentStep].questions.length}</p>
                    </div>
                  ) : (
                    <p className="text-blue-100 text-xs">
                      Question {currentQuestion + 1} of {quiz.questions?.length || 0}
                    </p>
                  )}
                </div>
                
                {/* Progress Indicator */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-blue-100">Progress:</span>
                  <span className="font-semibold">{getAnsweredCount()}/{getTotalQuestions()}</span>
                  <div className="w-24 bg-blue-500 rounded-full h-1.5">
                    <div 
                      className="bg-yellow-400 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${getProgressPercentage()}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Timer */}
                <div className="text-center">
                  <div className="text-xs text-blue-100">
                    {quiz.quizType === 'multi_step' ? 'Step Time' : 'Time Remaining'}
                  </div>
                  <div className={`text-xl font-bold ${timeLeft < 300 ? 'text-red-300' : 'text-white'}`}>
                    {formatTime(timeLeft)}
                  </div>
                </div>
                
                {/* Submit Button */}
                <Button 
                  variant="outline" 
                  onClick={() => setShowConfirmDialog(true)}
                  className="bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700 text-sm py-1.5 px-3"
                >
                  <Flag className="h-3 w-3 mr-1" />
                  Submit Quiz
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Quiz Content - SCROLLABLE */}
        <div className="flex-1 flex overflow-hidden">
          {quiz.quizType === 'multi_step' && quiz.steps ? (
            /* Multi-step three-column layout */
            <>
              {/* Left Sidebar - Module Navigation - SCROLLABLE WITHOUT SCROLLBAR */}
              <div className="w-56 bg-white border-r shadow-lg overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <style jsx>{`
                  div::-webkit-scrollbar {
                    display: none;
                  }
                `}</style>
                <div className="p-3">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 text-sm">
                    <BookOpen className="h-4 w-4" />
                    Modules
                  </h3>
                  
                  <div className="space-y-2">
                    {quiz.steps.map((step, stepIndex) => (
                      <div
                        key={stepIndex}
                        className={`p-2 rounded-lg border-2 transition-all ${
                          stepIndex === currentStep
                            ? 'border-blue-500 bg-blue-50'
                            : completedSteps.has(stepIndex)
                            ? 'border-green-300 bg-green-50'
                            : 'border-gray-200 bg-white'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            stepIndex === currentStep
                              ? 'bg-blue-600 text-white'
                              : completedSteps.has(stepIndex)
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-300 text-gray-600'
                          }`}>
                            {completedSteps.has(stepIndex) ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : (
                              step.stepNumber
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-xs text-gray-800 truncate">
                              {step.stepTitle}
                            </h4>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {step.questions.length}Q • {step.timing}min
                            </p>
                            <div className="mt-1">
                              <div className="flex items-center gap-1 text-xs text-gray-600">
                                <span>{stepIndex === currentStep ? getCurrentStepAnsweredCount() : (stepAnswers[stepIndex] ? Object.keys(stepAnswers[stepIndex]).length : 0)}/{step.questions.length}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Middle - Question Area - SCROLLABLE WITHOUT SCROLLBAR */}
              <div className="flex-1 p-4 overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <style jsx>{`
                  div::-webkit-scrollbar {
                    display: none;
                  }
                `}</style>
                <div className="max-w-4xl mx-auto">
                  <Card className="shadow-lg border-0">
                    <CardHeader className="bg-gray-50 border-b p-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-semibold text-gray-800">
                          Question {currentStepQuestion + 1} of {quiz.steps[currentStep].questions.length}
                        </CardTitle>
                        <div className="flex items-center gap-3 text-xs text-gray-600">
                          <Badge variant="outline" className="px-2 py-0.5">
                            {currentQ.marks || quiz.eachQuestionMarks || 1} {(currentQ.marks || quiz.eachQuestionMarks || 1) === 1 ? 'Mark' : 'Marks'}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {currentQ.questionType === 'multiple_choice' ? 'MCQ' : 'T/F'}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="p-4">
                      {/* Question Text */}
                      <div className="mb-8">
                        <h2 className="text-lg font-medium text-gray-800 leading-relaxed">
                          {currentQ.questionText}
                        </h2>
                      </div>

                      {/* Answer Options */}
                      {currentQ.questionType === 'multiple_choice' ? (
                        <div className="space-y-4">
                          {currentQ.options?.map((option, index) => (
                            <label
                              key={index}
                              className={`flex items-start p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                                currentAnswer === index
                                  ? 'border-blue-500 bg-blue-50 shadow-md'
                                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              <input
                                type="radio"
                                name={`question-${currentStep}-${currentStepQuestion}`}
                                value={index}
                                checked={currentAnswer === index}
                                onChange={() => handleAnswerSelect(currentStepQuestion, index)}
                                className="mt-1 mr-4 w-5 h-5 text-blue-600"
                              />
                              <span className="text-gray-800 text-base leading-relaxed flex-1">
                                <span className="font-semibold mr-2">
                                  {String.fromCharCode(65 + index)}.
                                </span>
                                {option.text}
                              </span>
                            </label>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <label
                            className={`flex items-center p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                              currentAnswer === true
                                ? 'border-blue-500 bg-blue-50 shadow-md'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            <input
                              type="radio"
                              name={`question-${currentStep}-${currentStepQuestion}`}
                              value="true"
                              checked={currentAnswer === true}
                              onChange={() => handleAnswerSelect(currentStepQuestion, true)}
                              className="mr-4 w-5 h-5 text-blue-600"
                            />
                            <span className="text-gray-800 text-base font-medium">True</span>
                          </label>
                          
                          <label
                            className={`flex items-center p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                              currentAnswer === false
                                ? 'border-blue-500 bg-blue-50 shadow-md'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            <input
                              type="radio"
                              name={`question-${currentStep}-${currentStepQuestion}`}
                              value="false"
                              checked={currentAnswer === false}
                              onChange={() => handleAnswerSelect(currentStepQuestion, false)}
                              className="mr-4 w-5 h-5 text-blue-600"
                            />
                            <span className="text-gray-800 text-base font-medium">False</span>
                          </label>
                        </div>
                      )}

                      {/* Navigation Buttons */}
                      <div className="flex justify-between items-center mt-12 pt-6 border-t">
                        <Button
                          variant="outline"
                          onClick={handlePreviousQuestion}
                          disabled={currentStepQuestion === 0}
                          className="flex items-center gap-2 px-6 py-3"
                        >
                          <ArrowLeft className="h-4 w-4" />
                          Previous
                        </Button>
                        
                        <div className="text-sm text-gray-500">
                          Question {currentStepQuestion + 1} of {quiz.steps[currentStep].questions.length}
                        </div>
                        
                        <div className="flex gap-2">
                          {currentStepQuestion < quiz.steps[currentStep].questions.length - 1 ? (
                            <Button
                              onClick={handleNextQuestion}
                              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700"
                            >
                              Next Question
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                          ) : currentStep < quiz.steps.length - 1 ? (
                            <Button
                              onClick={handleNextStep}
                              className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700"
                            >
                              Complete Module
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              onClick={() => setShowConfirmDialog(true)}
                              className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700"
                            >
                              <Flag className="h-4 w-4" />
                              Submit Quiz
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Right Sidebar - Attempt Details - SCROLLABLE WITHOUT SCROLLBAR */}
              <div className="w-80 bg-white border-l shadow-lg overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <style jsx>{`
                  div::-webkit-scrollbar {
                    display: none;
                  }
                `}</style>
                <div className="p-6">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Current Module
                  </h3>
                  
                  {/* Current Module Info */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h4 className="font-medium text-blue-900 mb-2">
                      {quiz.steps[currentStep].stepTitle}
                    </h4>
                    <p className="text-sm text-blue-700 mb-3">
                      {quiz.steps[currentStep].stepDescription || 'Complete all questions in this module'}
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-blue-800">
                        <span>Progress:</span>
                        <span className="font-medium">
                          {getCurrentStepAnsweredCount()}/{quiz.steps[currentStep].questions.length}
                        </span>
                      </div>
                      <div className="w-full bg-blue-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(getCurrentStepAnsweredCount() / quiz.steps[currentStep].questions.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Question Grid for Current Module */}
                  <h4 className="font-medium text-gray-800 mb-3 text-sm">Questions in this Module</h4>
                  <div className="grid grid-cols-5 gap-2 mb-6">
                    {quiz.steps[currentStep].questions.map((_, qIndex) => (
                      <button
                        key={qIndex}
                        onClick={() => setCurrentStepQuestion(qIndex)}
                        className={`w-10 h-10 rounded-lg text-xs font-medium transition-all duration-200 ${
                          qIndex === currentStepQuestion
                            ? 'bg-blue-600 text-white shadow-lg'
                            : stepAnswers[currentStep]?.[qIndex] !== undefined
                            ? 'bg-green-100 text-green-800 border-2 border-green-300 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-600 border-2 border-gray-300 hover:bg-gray-200'
                        }`}
                      >
                        {qIndex + 1}
                      </button>
                    ))}
                  </div>

                  {/* Overall Progress */}
                  <div className="border-t pt-6">
                    <h4 className="font-medium text-gray-800 mb-3 text-sm">Overall Progress</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Modules:</span>
                        <span className="font-medium">{quiz.steps.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Completed:</span>
                        <span className="font-medium text-green-600">{completedSteps.size}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Current:</span>
                        <span className="font-medium text-blue-600">{currentStep + 1}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Questions:</span>
                        <span className="font-medium">{getTotalQuestions()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Answered:</span>
                        <span className="font-medium text-green-600">{getAnsweredCount()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Passing:</span>
                        <span className="font-medium">{quiz.overallPassingPercentage || 70}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="border-t pt-6 mt-6">
                    <h4 className="font-medium text-gray-800 mb-3 text-sm">Legend</h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-blue-600 rounded"></div>
                        <span className="text-gray-700">Current</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-green-100 border-2 border-green-300 rounded"></div>
                        <span className="text-gray-700">Answered</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-gray-100 border-2 border-gray-300 rounded"></div>
                        <span className="text-gray-700">Not Answered</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Single-step two-column layout (existing) */
            <>
              {/* Left Side - Question */}
              <div className="flex-1 p-8">
                <div className="max-w-4xl mx-auto">
                  <Card className="shadow-lg border-0">
                    <CardHeader className="bg-gray-50 border-b">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl font-semibold text-gray-800">
                          Question {currentQuestion + 1}
                        </CardTitle>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <Badge variant="outline" className="px-3 py-1">
                            {currentQ.marks || quiz.eachQuestionMarks || 1} {(currentQ.marks || quiz.eachQuestionMarks || 1) === 1 ? 'Mark' : 'Marks'}
                          </Badge>
                          <Badge variant="secondary">
                            {currentQ.questionType === 'multiple_choice' ? 'Multiple Choice' : 'True/False'}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                
                <CardContent className="p-8">
                  {/* Question Text */}
                  <div className="mb-8">
                    <h2 className="text-lg font-medium text-gray-800 leading-relaxed">
                      {currentQ.questionText}
                    </h2>
                  </div>

                  {/* Answer Options */}
                  {currentQ.questionType === 'multiple_choice' ? (
                    <div className="space-y-4">
                      {currentQ.options?.map((option, index) => (
                        <label
                          key={index}
                          className={`flex items-start p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                            currentAnswer === index
                              ? 'border-blue-500 bg-blue-50 shadow-md'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${quiz.quizType === 'multi_step' ? `${currentStep}-${currentStepQuestion}` : currentQuestion}`}
                            value={index}
                            checked={currentAnswer === index}
                            onChange={() => handleAnswerSelect(
                              quiz.quizType === 'multi_step' ? currentStepQuestion : currentQuestion,
                              index
                            )}
                            className="mt-1 mr-4 w-5 h-5 text-blue-600"
                          />
                          <span className="text-gray-800 text-base leading-relaxed flex-1">
                            <span className="font-semibold mr-2">
                              {String.fromCharCode(65 + index)}.
                            </span>
                            {option.text}
                          </span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <label
                        className={`flex items-center p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                          currentAnswer === true
                            ? 'border-blue-500 bg-blue-50 shadow-md'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${quiz.quizType === 'multi_step' ? `${currentStep}-${currentStepQuestion}` : currentQuestion}`}
                          value="true"
                          checked={currentAnswer === true}
                          onChange={() => handleAnswerSelect(
                            quiz.quizType === 'multi_step' ? currentStepQuestion : currentQuestion,
                            true
                          )}
                          className="mr-4 w-5 h-5 text-blue-600"
                        />
                        <span className="text-gray-800 text-base font-medium">True</span>
                      </label>
                      
                      <label
                        className={`flex items-center p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                          currentAnswer === false
                            ? 'border-blue-500 bg-blue-50 shadow-md'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${quiz.quizType === 'multi_step' ? `${currentStep}-${currentStepQuestion}` : currentQuestion}`}
                          value="false"
                          checked={currentAnswer === false}
                          onChange={() => handleAnswerSelect(
                            quiz.quizType === 'multi_step' ? currentStepQuestion : currentQuestion,
                            false
                          )}
                          className="mr-4 w-5 h-5 text-blue-600"
                        />
                        <span className="text-gray-800 text-base font-medium">False</span>
                      </label>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between items-center mt-12 pt-6 border-t">
                    <div className="flex gap-2">
                      {quiz.quizType === 'multi_step' && currentStep > 0 && quiz.allowStepNavigation && (
                        <Button
                          variant="outline"
                          onClick={handlePreviousStep}
                          className="flex items-center gap-2 px-4 py-3"
                        >
                          <ArrowLeft className="h-4 w-4" />
                          Previous Step
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        onClick={handlePreviousQuestion}
                        disabled={
                          quiz.quizType === 'multi_step' 
                            ? currentStepQuestion === 0
                            : currentQuestion === 0
                        }
                        className="flex items-center gap-2 px-6 py-3"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Previous
                      </Button>
                    </div>
                    
                    <div className="text-sm text-gray-500">
                      {quiz.quizType === 'multi_step' && quiz.steps ? (
                        <>
                          Step {currentStep + 1}/{quiz.steps.length} - 
                          Question {currentStepQuestion + 1}/{quiz.steps[currentStep].questions.length}
                        </>
                      ) : (
                        <>
                          Question {currentQuestion + 1} of {quiz.questions?.length || 0}
                        </>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={handleNextQuestion}
                        disabled={
                          quiz.quizType === 'multi_step' && quiz.steps
                            ? currentStepQuestion === quiz.steps[currentStep].questions.length - 1
                            : currentQuestion === (quiz.questions?.length || 0) - 1
                        }
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700"
                      >
                        Next
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                      {quiz.quizType === 'multi_step' && quiz.steps && 
                       currentStep < quiz.steps.length - 1 && 
                       currentStepQuestion === quiz.steps[currentStep].questions.length - 1 && (
                        <Button
                          onClick={handleNextStep}
                          className="flex items-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700"
                        >
                          Next Step
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Side - Question Navigation Panel */}
          <div className="w-80 bg-white border-l shadow-lg overflow-y-auto">
            <div className="p-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Question Navigation
              </h3>
              
              {quiz.quizType === 'multi_step' && quiz.steps ? (
                /* Multi-step navigation */
                <div className="space-y-6">
                  {quiz.steps.map((step, stepIndex) => (
                    <div key={stepIndex} className={`${stepIndex === currentStep ? 'bg-blue-50 p-3 rounded-lg' : ''}`}>
                      <h4 className="font-medium text-sm text-gray-700 mb-2">
                        Step {step.stepNumber}: {step.stepTitle}
                      </h4>
                      <div className="grid grid-cols-5 gap-2">
                        {step.questions.map((_, qIndex) => (
                          <button
                            key={qIndex}
                            onClick={() => {
                              if (quiz.allowStepNavigation || stepIndex === currentStep) {
                                setCurrentStep(stepIndex);
                                setCurrentStepQuestion(qIndex);
                              }
                            }}
                            disabled={!quiz.allowStepNavigation && stepIndex !== currentStep}
                            className={`w-10 h-10 rounded-lg text-xs font-medium transition-all duration-200 ${
                              stepIndex === currentStep && qIndex === currentStepQuestion
                                ? 'bg-blue-600 text-white shadow-lg'
                                : stepAnswers[stepIndex]?.[qIndex] !== undefined
                                ? 'bg-green-100 text-green-800 border-2 border-green-300 hover:bg-green-200'
                                : 'bg-gray-100 text-gray-600 border-2 border-gray-300 hover:bg-gray-200'
                            } ${!quiz.allowStepNavigation && stepIndex !== currentStep ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            {qIndex + 1}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Single-step navigation */
                <div className="grid grid-cols-5 gap-2 mb-6">
                  {quiz.questions?.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentQuestion(index)}
                      className={`w-12 h-12 rounded-lg text-sm font-medium transition-all duration-200 ${
                        index === currentQuestion
                          ? 'bg-blue-600 text-white shadow-lg'
                          : answers[index] !== undefined
                          ? 'bg-green-100 text-green-800 border-2 border-green-300 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-600 border-2 border-gray-300 hover:bg-gray-200'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              )}

              {/* Legend */}
              <div className="space-y-3 text-sm mt-6">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-600 rounded"></div>
                  <span className="text-gray-700">Current Question</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-100 border-2 border-green-300 rounded"></div>
                  <span className="text-gray-700">Answered</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-gray-100 border-2 border-gray-300 rounded"></div>
                  <span className="text-gray-700">Not Answered</span>
                </div>
              </div>

              {/* Quiz Stats */}
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-3">Quiz Summary</h4>
                <div className="space-y-2 text-sm">
                  {quiz.quizType === 'multi_step' && quiz.steps ? (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Steps:</span>
                        <span className="font-medium">{quiz.steps.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Current Step:</span>
                        <span className="font-medium">{currentStep + 1}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Step Questions:</span>
                        <span className="font-medium">{quiz.steps[currentStep].questions.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Step Answered:</span>
                        <span className="font-medium text-green-600">{getCurrentStepAnsweredCount()}</span>
                      </div>
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Questions:</span>
                          <span className="font-medium">{getTotalQuestions()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Answered:</span>
                          <span className="font-medium text-green-600">{getAnsweredCount()}</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Questions:</span>
                        <span className="font-medium">{quiz.questions?.length || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Answered:</span>
                        <span className="font-medium text-green-600">{getAnsweredCount()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Remaining:</span>
                        <span className="font-medium text-orange-600">{(quiz.questions?.length || 0) - getAnsweredCount()}</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Max Marks:</span>
                    <span className="font-medium">
                      {quiz.quizType === 'multi_step' && quiz.steps
                        ? quiz.steps.reduce((total, step) => total + (step.questions.length * (quiz.eachQuestionMarks || 1)), 0)
                        : quiz.maxMarks || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Passing:</span>
                    <span className="font-medium">
                      {quiz.quizType === 'multi_step' 
                        ? `${quiz.overallPassingPercentage || 70}%`
                        : `${quiz.passingMarks || 0}%`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
          )}
        </div>
      </div>

      {/* Module Completion Dialog */}
      <Dialog open={showStepCompleteDialog} onOpenChange={(open) => {
        if (!open && autoProgressTimer) {
          clearTimeout(autoProgressTimer);
          setAutoProgressTimer(null);
        }
        setShowStepCompleteDialog(open);
      }}>
        <DialogContent className='bg-white max-w-lg'>
          <DialogHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-20 w-20 text-green-500" />
            </div>
            <DialogTitle className="text-2xl font-bold text-green-700">
              Module Completed!
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-4 text-base leading-relaxed">
              Congratulations! You have completed <strong>{quiz.steps?.[currentStep]?.stepTitle}</strong>.
              <br /><br />
              {currentStep < (quiz.steps?.length || 0) - 1 ? (
                <>
                  Moving to the next module automatically in <strong>10 seconds</strong>...
                  <br /><br />
                  Or click the button below to continue immediately.
                </>
              ) : (
                <>
                  This was the final module. You can now submit your quiz.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter className="flex justify-center mt-6">
            {currentStep < (quiz.steps?.length || 0) - 1 ? (
              <Button 
                onClick={handleManualNextStep}
                className="w-full max-w-xs bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 flex items-center gap-2"
              >
                Continue to Next Module
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button 
                onClick={() => {
                  setShowStepCompleteDialog(false);
                  setShowConfirmDialog(true);
                }}
                className="w-full max-w-xs bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 flex items-center gap-2"
              >
                <Flag className="h-4 w-4" />
                Submit Quiz
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Time Expired Dialog */}
      <Dialog open={showTimeExpiredDialog} onOpenChange={setShowTimeExpiredDialog}>
        <DialogContent className='bg-white max-w-lg'>
          <DialogHeader className="text-center">
            <div className="flex justify-center mb-4">
              <AlertTriangle className="h-20 w-20 text-orange-500" />
            </div>
            <DialogTitle className="text-2xl font-bold text-orange-700">
              Time Expired!
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-4 text-base leading-relaxed">
              The time for <strong>{quiz.steps?.[currentStep]?.stepTitle}</strong> has expired.
              <br /><br />
              {currentStep < (quiz.steps?.length || 0) - 1 ? (
                <>
                  You will now move to the next module.
                  <br /><br />
                  Any unanswered questions in this module will be marked as incorrect.
                </>
              ) : (
                <>
                  This was the final module. Your quiz will be submitted now.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter className="flex justify-center mt-6">
            {currentStep < (quiz.steps?.length || 0) - 1 ? (
              <Button 
                onClick={handleTimeExpiredContinue}
                className="w-full max-w-xs bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 flex items-center gap-2"
              >
                Continue to Next Module
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button 
                onClick={() => {
                  setShowTimeExpiredDialog(false);
                  handleSubmitQuiz();
                }}
                className="w-full max-w-xs bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 flex items-center gap-2"
              >
                <Flag className="h-4 w-4" />
                Submit Quiz
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Step Navigation Confirmation Dialog */}
      <Dialog open={showStepNavigationConfirm} onOpenChange={setShowStepNavigationConfirm}>
        <DialogContent className='bg-white max-w-lg'>
          <DialogHeader className="text-center">
            <div className="flex justify-center mb-4">
              <AlertTriangle className="h-16 w-16 text-blue-500" />
            </div>
            <DialogTitle className="text-2xl font-bold text-gray-800">
              Complete This Module?
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-4 text-base leading-relaxed">
              {quiz.steps && quiz.steps[currentStep] && (
                <>
                  You are about to complete <strong>{quiz.steps[currentStep].stepTitle}</strong> and move to the next module.
                  <br /><br />
                  {getCurrentStepAnsweredCount() < quiz.steps[currentStep].questions.length && (
                    <>
                      <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded text-left my-4">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-orange-800">Warning: Unanswered Questions</p>
                            <p className="text-orange-700 text-sm mt-1">
                              You have <strong>{quiz.steps[currentStep].questions.length - getCurrentStepAnsweredCount()} unanswered question{quiz.steps[currentStep].questions.length - getCurrentStepAnsweredCount() > 1 ? 's' : ''}</strong> in this module.
                              <br />
                              These will be marked as incorrect.
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  Once you move to the next module, you cannot return to this one.
                  <br /><br />
                  Are you sure you want to continue?
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter className="flex justify-center gap-3 mt-6">
            <Button 
              variant="outline"
              onClick={() => setShowStepNavigationConfirm(false)}
              className="px-6"
            >
              Cancel
            </Button>
            <Button 
              onClick={confirmNextStep}
              className="px-6 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 flex items-center gap-2"
            >
              Yes, Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Submit Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className='bg-slate-50 max-w-md'>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Submit Quiz?</DialogTitle>
            <DialogDescription className="space-y-3 mt-4">
              <div className="text-gray-700">
                You have answered <strong className="text-green-600">{getAnsweredCount()}</strong> out of <strong>{getTotalQuestions()}</strong> questions.
              </div>
              
              {getAnsweredCount() < getTotalQuestions() && (
                <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-orange-800">Warning: Unanswered Questions</p>
                      <p className="text-orange-700 text-sm mt-1">
                        You have <strong>{getTotalQuestions() - getAnsweredCount()} unanswered question{getTotalQuestions() - getAnsweredCount() > 1 ? 's' : ''}</strong>.
                      </p>
                      <p className="text-orange-600 text-sm mt-2">
                        Once you submit, you cannot attempt these questions again. They will be marked as incorrect.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <p className="text-gray-600 text-sm">
                Are you sure you want to submit your quiz now?
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Go Back to Quiz
            </Button>
            <Button 
              onClick={handleSubmitQuiz}
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isSubmitting ? 'Submitting...' : 'Yes, Submit Quiz'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={() => {}}>
        <DialogContent className="bg-white max-w-lg">
          <DialogHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <DialogTitle className="text-2xl font-bold text-green-700">
              Test Completed Successfully!
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-4 text-base leading-relaxed">
              Congratulations! You have successfully completed the test. 
              <br /><br />
              <strong>Our TechPratham team will get back to you</strong> with your results and next steps.
              <br /><br />
              You will also receive a confirmation email shortly.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter className="flex justify-center mt-6">
            <Button 
              onClick={() => {
                // Exit fullscreen safely if in fullscreen mode
                if (isFullscreen && (document.fullscreenElement || 
                    (document as any).webkitFullscreenElement || 
                    (document as any).msFullscreenElement)) {
                  exitFullscreen();
                }
                // Navigate after a short delay to ensure fullscreen exit completes
                setTimeout(() => {
                  router.push('/quiz');
                }, 200);
              }}
              className="w-full max-w-xs bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = withNavbarSSR(async (context) => {
  const { id } = context.params!;
  
  try {
    // Import database utilities and models directly
    const { connectMongo } = await import('@/utils/mongodb');
    const Quiz = (await import('@/models/Quiz')).default;
    const QuizAttempt = (await import('@/models/QuizAttempt')).default;
    
    await connectMongo();
    
    // Fetch quiz directly from database
    const quizDoc: any = await Quiz.findById(id).lean();
    
    if (!quizDoc) {
      console.error('Quiz not found:', id);
      return {
        props: {
          quiz: null,
          canTakeQuiz: false,
          eligibilityMessage: null
        }
      };
    }
    
    // Use JSON.parse(JSON.stringify()) to properly serialize MongoDB objects
    const quiz = JSON.parse(JSON.stringify(quizDoc));
    
    // Ensure quizType is set
    if (!quiz.quizType) {
      if (quiz.steps && quiz.steps.length > 0) {
        quiz.quizType = 'multi_step';
      } else {
        quiz.quizType = 'single_step';
      }
    }
    
    // Add virtual fields for lean queries
    if (quiz.quizType === 'multi_step' && quiz.steps) {
      quiz.totalQuestions = quiz.steps.reduce((total: number, step: any) => total + step.questions.length, 0);
      quiz.totalTiming = quiz.steps.reduce((total: number, step: any) => total + step.timing, 0);
      quiz.totalMaxMarks = quiz.steps.reduce((total: number, step: any) => 
        total + (step.questions.length * (quiz.eachQuestionMarks || 1)), 0);
      quiz.passingPercentage = quiz.overallPassingPercentage?.toString() || '70';
    } else if (quiz.questions) {
      quiz.totalQuestions = quiz.questions.length;
      quiz.totalTiming = quiz.timing;
      quiz.totalMaxMarks = quiz.maxMarks;
      quiz.passingPercentage = quiz.maxMarks ? ((quiz.passingMarks / quiz.maxMarks) * 100).toFixed(2) : '0';
    }
    
    // Check authentication (optional - will be enforced on client side)
    let canTakeQuiz = true;
    let eligibilityMessage = null;
    
    try {
      const { getServerSession } = await import('next-auth');
      const { authOptions } = await import('@/lib/authOptions');
      const session = await getServerSession(context.req, context.res, authOptions);
      
      // Check 24-hour restriction only if user is logged in
      if (session?.user?.email) {
        const lastAttempt: any = await QuizAttempt.findOne({
          quizId: id,
          userEmail: session.user.email
        }).sort({ createdAt: -1 }).lean();
        
        if (lastAttempt && lastAttempt.createdAt) {
          const lastAttemptTime = new Date(lastAttempt.createdAt).getTime();
          const currentTime = new Date().getTime();
          const hoursSinceLastAttempt = (currentTime - lastAttemptTime) / (1000 * 60 * 60);
          
          if (hoursSinceLastAttempt < 24) {
            const hoursRemaining = Math.ceil(24 - hoursSinceLastAttempt);
            canTakeQuiz = false;
            eligibilityMessage = `You can retake this quiz in ${hoursRemaining} hour${hoursRemaining > 1 ? 's' : ''}`;
          }
        }
      }
    } catch (authError) {
      console.warn('Auth check failed, continuing without restriction check:', authError);
      // Continue without auth check - will be handled on client side
    }
    
    return {
      props: {
        quiz,
        canTakeQuiz,
        eligibilityMessage
      }
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return {
      props: {
        quiz: null,
        canTakeQuiz: false,
        eligibilityMessage: null
      }
    };
  }
});

export default QuizTakingPage;