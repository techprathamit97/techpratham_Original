import { useEffect } from 'react';
import { useRouter } from 'next/router';

// Redirect to the main LMS quizzes page
const QuizzesRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace('/lms/quizzes');
  }, [router]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white">Redirecting to Quiz Management...</div>
    </div>
  );
};

export default QuizzesRedirect;
