import { NextRequest, NextResponse } from 'next/server';
import { sendQuizEmailToStudent } from '@/lib/sendQuizEmailToStudent';
import { sendQuizEmailFallback } from '@/lib/sendQuizEmailFallback';

export async function GET(request: NextRequest) {
  try {

    
    const testData = {
      userEmail: 'techpratham008@gmail.com',
      userName: 'Tech Pratham',
      quizTitle: 'Sample Quiz Test',
      totalMarks: 90,
      maxMarks: 100,
      percentage: 90,
      passed: true
    };

   

    let result;
    let emailMethod = 'Unknown';

    // Check if SMTP is configured
    const smtpConfigured = process.env.SMTP_USER && 
                          process.env.SMTP_PASS && 
                          process.env.SMTP_PASS !== 'your_gmail_app_password_here';

    if (smtpConfigured) {
      try {
        
        result = await sendQuizEmailToStudent(testData);
        emailMethod = 'Gmail SMTP';
      } catch (smtpError) {
        console.error('Gmail SMTP test failed, trying Web3Forms...', smtpError);
        result = await sendQuizEmailFallback(testData);
        emailMethod = 'Web3Forms (SMTP Fallback)';
      }
    } else {
    
      result = await sendQuizEmailFallback(testData);
      emailMethod = 'Web3Forms';
    }



    return NextResponse.json({ 
      success: true, 
      message: `Email test completed successfully via ${emailMethod}`,
      emailMethod,
      studentEmail: testData.userEmail,
      adminEmail: process.env.ADMIN_EMAIL,
      smtpConfigured,
      result
    });

  } catch (error: any) {
    console.error('=== EMAIL TEST ERROR ===');
    console.error('Error details:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to send email test', 
        details: error.message
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userEmail,
      userName,
      quizTitle,
      totalMarks,
      maxMarks,
      percentage,
      passed
    } = body;



    let result;
    let emailMethod = 'Unknown';

    // Check if SMTP is configured
    const smtpConfigured = process.env.SMTP_USER && 
                          process.env.SMTP_PASS && 
                          process.env.SMTP_PASS !== 'your_gmail_app_password_here';

    if (smtpConfigured) {
      try {
     
        result = await sendQuizEmailToStudent({
          userEmail,
          userName,
          quizTitle,
          totalMarks,
          maxMarks,
          percentage,
          passed
        });
        emailMethod = 'Gmail SMTP';
   
      } catch (smtpError) {
        console.error('❌ Gmail SMTP failed, trying fallback...', smtpError);
        // Fall back to Web3Forms
        result = await sendQuizEmailFallback({
          userEmail,
          userName,
          quizTitle,
          totalMarks,
          maxMarks,
          percentage,
          passed
        });
        emailMethod = 'Web3Forms (SMTP Fallback)';
      }
    } else {
    
      result = await sendQuizEmailFallback({
        userEmail,
        userName,
        quizTitle,
        totalMarks,
        maxMarks,
        percentage,
        passed
      });
      emailMethod = 'Web3Forms';
    }



    return NextResponse.json({ 
      success: true, 
      message: `Quiz completion email sent successfully via ${emailMethod}`,
      emailMethod,
      studentEmail: userEmail,
      adminNotified: true,
      result
    });

  } catch (error: any) {
    console.error('=== QUIZ COMPLETION EMAIL ERROR ===');
    console.error('Error details:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to send quiz completion email', 
        details: error.message
      },
      { status: 500 }
    );
  }
}