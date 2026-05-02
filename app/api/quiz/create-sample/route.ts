import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/utils/mongodb';
import Quiz from '@/models/Quiz';

export async function POST(request: NextRequest) {
  try {
    await connectMongo();
    
    // Check if quizzes already exist
    const existingQuizzes = await Quiz.find({});
    if (existingQuizzes.length > 0) {
      return NextResponse.json({
        message: 'Sample quizzes already exist',
        count: existingQuizzes.length,
        quizzes: existingQuizzes.map(q => ({ id: q._id, title: q.title }))
      });
    }

    // Create sample quizzes
    const sampleQuizzes = [
      {
        title: 'JavaScript Fundamentals',
        category: 'Programming',
        description: 'Test your knowledge of JavaScript basics',
        timing: 15, // 15 minutes
        passingMarks: 70,
        maxMarks: 100,
        eachQuestionMarks: 10,
        negativeMarking: {
          enabled: false,
          marksDeducted: 0
        },
        isActive: true,
        questions: [
          {
            questionText: 'What is the correct way to declare a variable in JavaScript?',
            questionType: 'multiple_choice',
            options: [
              { text: 'var myVar = 5;', isCorrect: true },
              { text: 'variable myVar = 5;', isCorrect: false },
              { text: 'v myVar = 5;', isCorrect: false },
              { text: 'declare myVar = 5;', isCorrect: false }
            ],
            explanation: 'In JavaScript, variables can be declared using var, let, or const keywords.',
            marks: 10
          },
          {
            questionText: 'JavaScript is a compiled language.',
            questionType: 'true_false',
            correctAnswer: false,
            explanation: 'JavaScript is an interpreted language, not a compiled language.',
            marks: 10
          },
          {
            questionText: 'Which method is used to add an element to the end of an array?',
            questionType: 'multiple_choice',
            options: [
              { text: 'push()', isCorrect: true },
              { text: 'add()', isCorrect: false },
              { text: 'append()', isCorrect: false },
              { text: 'insert()', isCorrect: false }
            ],
            explanation: 'The push() method adds one or more elements to the end of an array.',
            marks: 10
          },
          {
            questionText: 'What does "=== " operator do in JavaScript?',
            questionType: 'multiple_choice',
            options: [
              { text: 'Assigns a value', isCorrect: false },
              { text: 'Compares values only', isCorrect: false },
              { text: 'Compares both value and type', isCorrect: true },
              { text: 'Creates a new variable', isCorrect: false }
            ],
            explanation: 'The === operator compares both value and type (strict equality).',
            marks: 10
          },
          {
            questionText: 'Arrays in JavaScript can hold different data types.',
            questionType: 'true_false',
            correctAnswer: true,
            explanation: 'JavaScript arrays can contain elements of different data types in the same array.',
            marks: 10
          },
          {
            questionText: 'Which of the following is NOT a JavaScript data type?',
            questionType: 'multiple_choice',
            options: [
              { text: 'String', isCorrect: false },
              { text: 'Boolean', isCorrect: false },
              { text: 'Float', isCorrect: true },
              { text: 'Number', isCorrect: false }
            ],
            explanation: 'JavaScript has Number type for all numeric values, not separate Integer and Float types.',
            marks: 10
          },
          {
            questionText: 'What is the output of: console.log(typeof null)?',
            questionType: 'multiple_choice',
            options: [
              { text: 'null', isCorrect: false },
              { text: 'undefined', isCorrect: false },
              { text: 'object', isCorrect: true },
              { text: 'string', isCorrect: false }
            ],
            explanation: 'This is a known quirk in JavaScript - typeof null returns "object".',
            marks: 10
          },
          {
            questionText: 'Functions in JavaScript are first-class objects.',
            questionType: 'true_false',
            correctAnswer: true,
            explanation: 'In JavaScript, functions are first-class objects, meaning they can be assigned to variables, passed as arguments, and returned from other functions.',
            marks: 10
          },
          {
            questionText: 'Which method is used to remove the last element from an array?',
            questionType: 'multiple_choice',
            options: [
              { text: 'pop()', isCorrect: true },
              { text: 'remove()', isCorrect: false },
              { text: 'delete()', isCorrect: false },
              { text: 'splice()', isCorrect: false }
            ],
            explanation: 'The pop() method removes and returns the last element from an array.',
            marks: 10
          },
          {
            questionText: 'JavaScript is case-sensitive.',
            questionType: 'true_false',
            correctAnswer: true,
            explanation: 'JavaScript is case-sensitive, so "myVariable" and "myvariable" are different identifiers.',
            marks: 10
          }
        ]
      },
      {
        title: 'React Basics',
        category: 'Frontend',
        description: 'Test your understanding of React fundamentals',
        timing: 20, // 20 minutes
        passingMarks: 75,
        maxMarks: 80,
        eachQuestionMarks: 10,
        negativeMarking: {
          enabled: false,
          marksDeducted: 0
        },
        isActive: true,
        questions: [
          {
            questionText: 'What is React?',
            questionType: 'multiple_choice',
            options: [
              { text: 'A JavaScript library for building user interfaces', isCorrect: true },
              { text: 'A database management system', isCorrect: false },
              { text: 'A web server', isCorrect: false },
              { text: 'A CSS framework', isCorrect: false }
            ],
            explanation: 'React is a JavaScript library developed by Facebook for building user interfaces.',
            marks: 10
          },
          {
            questionText: 'JSX stands for JavaScript XML.',
            questionType: 'true_false',
            correctAnswer: true,
            explanation: 'JSX stands for JavaScript XML and allows you to write HTML-like syntax in JavaScript.',
            marks: 10
          },
          {
            questionText: 'Which method is used to create components in React?',
            questionType: 'multiple_choice',
            options: [
              { text: 'React.createComponent()', isCorrect: false },
              { text: 'React.createElement()', isCorrect: true },
              { text: 'React.component()', isCorrect: false },
              { text: 'React.makeComponent()', isCorrect: false }
            ],
            explanation: 'React.createElement() is the fundamental method for creating React elements.',
            marks: 10
          },
          {
            questionText: 'What is the virtual DOM?',
            questionType: 'multiple_choice',
            options: [
              { text: 'A copy of the real DOM kept in memory', isCorrect: true },
              { text: 'A new web browser', isCorrect: false },
              { text: 'A CSS framework', isCorrect: false },
              { text: 'A database', isCorrect: false }
            ],
            explanation: 'The virtual DOM is a JavaScript representation of the real DOM kept in memory.',
            marks: 10
          },
          {
            questionText: 'Props in React are mutable.',
            questionType: 'true_false',
            correctAnswer: false,
            explanation: 'Props are read-only and should not be modified by the component that receives them.',
            marks: 10
          },
          {
            questionText: 'Which hook is used to manage state in functional components?',
            questionType: 'multiple_choice',
            options: [
              { text: 'useState', isCorrect: true },
              { text: 'useEffect', isCorrect: false },
              { text: 'useContext', isCorrect: false },
              { text: 'useReducer', isCorrect: false }
            ],
            explanation: 'useState is the React hook used to add state to functional components.',
            marks: 10
          },
          {
            questionText: 'React components must return a single parent element.',
            questionType: 'true_false',
            correctAnswer: true,
            explanation: 'React components must return a single parent element, though you can use React.Fragment to avoid extra DOM nodes.',
            marks: 10
          },
          {
            questionText: 'What is the purpose of keys in React lists?',
            questionType: 'multiple_choice',
            options: [
              { text: 'To style list items', isCorrect: false },
              { text: 'To help React identify which items have changed', isCorrect: true },
              { text: 'To sort the list', isCorrect: false },
              { text: 'To add animations', isCorrect: false }
            ],
            explanation: 'Keys help React identify which items have changed, are added, or are removed.',
            marks: 10
          }
        ]
      }
    ];

    // Insert sample quizzes
    const createdQuizzes = await Quiz.insertMany(sampleQuizzes);
    
    console.log('Sample quizzes created:', createdQuizzes.length);

    return NextResponse.json({
      success: true,
      message: 'Sample quizzes created successfully',
      count: createdQuizzes.length,
      quizzes: createdQuizzes.map(q => ({ id: q._id, title: q.title, category: q.category }))
    });

  } catch (error) {
    console.error('Error creating sample quizzes:', error);
    return NextResponse.json(
      { error: 'Failed to create sample quizzes', success: false },
      { status: 500 }
    );
  }
}