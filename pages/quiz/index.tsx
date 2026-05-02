import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Clock, 
  Target, 
  Award, 
  BookOpen,
  Search,
  Filter,
  Users,
  TrendingUp
} from 'lucide-react';
import { withNavbarSSR } from '@/utils/withNavbarSSR';
import { NavbarData } from '@/utils/navbarData';
import Navbar from '@/src/common/Navbar/Navbar';

interface Quiz {
  _id: string;
  title: string;
  category: string;
  description: string;
  timing: number;
  passingMarks: number;
  maxMarks: number;
  totalQuestions: number;
  passingPercentage: string;
  isActive: boolean;
  createdAt: string;
}

interface QuizPageProps {
  navbarData: NavbarData;
  quizzes: Quiz[];
  categories: string[];
}

const QuizPage: React.FC<QuizPageProps> = ({ navbarData, quizzes, categories }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>(quizzes);

  useEffect(() => {
    let filtered = quizzes;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(quiz => quiz.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(quiz =>
        quiz.title.toLowerCase().includes(query) ||
        quiz.description.toLowerCase().includes(query) ||
        quiz.category.toLowerCase().includes(query)
      );
    }

    setFilteredQuizzes(filtered);
  }, [searchQuery, selectedCategory, quizzes]);

  const stats = {
    totalQuizzes: quizzes.length,
    categories: categories.length,
    avgDuration: quizzes.length > 0 ? 
      Math.round(quizzes.reduce((sum, q) => sum + q.timing, 0) / quizzes.length) : 0,
    totalQuestions: quizzes.reduce((sum, q) => sum + q.totalQuestions, 0)
  };

  return (
    <>
      <Head>
        <title>Online Quizzes - Test Your Knowledge | TechPratham</title>
        <meta name="description" content="Take online quizzes to test your knowledge in various technology domains. Practice with our comprehensive quiz collection." />
        <meta name="keywords" content="online quiz, technology quiz, assessment, test knowledge, practice quiz" />
      </Head>

      <Navbar navbarData={navbarData} />

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-red-900 via-black to-red-600 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Test Your Knowledge
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                Challenge yourself with our comprehensive quiz collection across various technology domains
              </p>
              
              {/* Stats Cards */}
              <div className="overflow-x-auto mt-12" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <style jsx>{`
                  div::-webkit-scrollbar {
                    display: none;
                  }
                `}</style>
                <div className="flex gap-4 md:gap-6 min-w-max px-2">
                  <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 transform hover:scale-105 transition-transform duration-300 min-w-[160px] md:min-w-[200px]">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl md:text-3xl font-bold text-gray-800">1.8+ Lakh</div>
                        <div className="text-xs md:text-sm text-gray-600 mt-1">Registered Candidates</div>
                      </div>
                      <Users className="h-8 w-8 md:h-10 md:w-10 text-blue-500" />
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 transform hover:scale-105 transition-transform duration-300 min-w-[160px] md:min-w-[200px]">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl md:text-3xl font-bold text-gray-800">6k+</div>
                        <div className="text-xs md:text-sm text-gray-600 mt-1">Test Attempted</div>
                      </div>
                      <BookOpen className="h-8 w-8 md:h-10 md:w-10 text-green-500" />
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 transform hover:scale-105 transition-transform duration-300 min-w-[160px] md:min-w-[200px]">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl md:text-3xl font-bold text-gray-800">682</div>
                        <div className="text-xs md:text-sm text-gray-600 mt-1">Got Certificate</div>
                      </div>
                      <Award className="h-8 w-8 md:h-10 md:w-10 text-purple-500" />
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 transform hover:scale-105 transition-transform duration-300 min-w-[160px] md:min-w-[200px]">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl md:text-3xl font-bold text-gray-800">130</div>
                        <div className="text-xs md:text-sm text-gray-600 mt-1">Total Quizzes</div>
                      </div>
                      <TrendingUp className="h-8 w-8 md:h-10 md:w-10 text-red-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content - Left Sidebar + Right Quiz Grid */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col lg:flex-row gap-8">
                
                {/* Left Sidebar - Categories */}
                <div className="lg:w-1/4">
                  <Card className="sticky top-8">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Filter className="h-5 w-5" />
                        Categories
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <button
                        onClick={() => setSelectedCategory('All')}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                          selectedCategory === 'All'
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span>All Categories</span>
                          <Badge variant="outline" className="text-xs">
                            {quizzes.length}
                          </Badge>
                        </div>
                      </button>
                      
                      {categories.map(category => {
                        const categoryCount = quizzes.filter(q => q.category === category).length;
                        return (
                          <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                              selectedCategory === category
                                ? 'bg-red-700 text-white'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <span>{category}</span>
                              <Badge variant="outline" className="text-xs">
                                {categoryCount}
                              </Badge>
                            </div>
                          </button>
                        );
                      })}
                    </CardContent>
                  </Card>
                </div>

                {/* Right Side - Quiz Grid */}
                <div className="lg:w-3/4">
                  {/* Search Bar */}
                  <div className="mb-6">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search quizzes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    
                    {/* Results count */}
                    <div className="mt-2 text-sm text-gray-600">
                      Showing {filteredQuizzes.length} of {quizzes.length} quizzes
                      {selectedCategory !== 'All' && ` in ${selectedCategory}`}
                      {searchQuery && ` matching "${searchQuery}"`}
                    </div>
                  </div>

                  {/* Quiz Cards */}
                  {filteredQuizzes.length === 0 ? (
                    <div className="text-center py-12">
                      <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">No quizzes found</h3>
                      <p className="text-gray-500">
                        {searchQuery || selectedCategory !== 'All' 
                          ? 'Try adjusting your search or filter criteria'
                          : 'No quizzes are currently available'
                        }
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredQuizzes.map((quiz) => (
                        <Card key={quiz._id} className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-blue-500">
                          <CardHeader>
                            <div className="flex justify-between items-start mb-2">
                              <Badge variant="secondary" className="text-xs">
                                {quiz.category}
                              </Badge>
                              <Badge className={quiz.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                                {quiz.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                            <CardTitle className="text-lg font-bold text-gray-800 line-clamp-2">
                              {quiz.title}
                            </CardTitle>
                            <p className="text-sm text-gray-600 line-clamp-3">
                              {quiz.description}
                            </p>
                          </CardHeader>
                          
                          <CardContent className="space-y-4">
                            {/* Quiz Stats */}
                            {/* <div className="grid grid-cols-2 gap-4 text-sm">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-blue-500" />
                                <span>{quiz.timing} minutes</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <BookOpen className="h-4 w-4 text-green-500" />
                                <span>{quiz.totalQuestions} questions</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Target className="h-4 w-4 text-orange-500" />
                                <span>{quiz.passingMarks}% to pass</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Award className="h-4 w-4 text-purple-500" />
                               <span>{quiz.maxMarks} max marks</span>
                              </div>
                            </div> */}

                            {/* Action Button */}
                            <Link href={`/quiz/${quiz._id}`} className="block">
                              <Button className="w-full bg-gradient-to-tl from-[#C6151D] to-[#600A0E]  hover:from-blue-700 hover:to-purple-700">
                                Start Quiz
                              </Button>
                            </Link>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = withNavbarSSR(async () => {
  try {
    // Fetch quizzes
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const quizzesRes = await fetch(`${baseUrl}/api/quiz?active=true`);
    const quizzes = quizzesRes.ok ? await quizzesRes.json() : [];

    // Extract unique categories
    const categories = [...new Set(quizzes.map((quiz: Quiz) => quiz.category))];

    return {
      props: {
        quizzes,
        categories
      }
    };
  } catch (error) {
    console.error('Error fetching quiz data:', error);
    return {
      props: {
        quizzes: [],
        categories: []
      }
    };
  }
});

export default QuizPage;