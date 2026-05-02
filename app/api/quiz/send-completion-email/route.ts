import { NextRequest, NextResponse } from 'next/server';
import { sendQuizEmailToStudent } from '@/lib/sendQuizEmailToStudent';
import { sendQuizEmailFallback } from '@/lib/sendQuizEmailFallback';

export async function GET(request: NextRequest) {
  try {
    console.log('=== QUIZ EMAIL TEST ===');
    
    const testData = {
      userEmail: 'techpratham008@gmail.com',
      userName: 'Tech Pratham',
      quizTitle: 'Sample Quiz Test',
      totalMarks: 90,
      maxMarks: 100,
      percentage: 90,
      passed: true
    };

    console.log('Testing email system...');

    let result;
    let emailMethod = 'Unknown';

    // Check if SMTP is configured
    const smtpConfigured = process.env.SMTP_USER && 
                          process.env.SMTP_PASS && 
                          process.env.SMTP_PASS !== 'your_gmail_app_password_here';

    if (smtpConfigured) {
      try {
        console.log('Testing Gmail SMTP...');
        result = await sendQuizEmailToStudent(testData);
        emailMethod = 'Gmail SMTP';
      } catch (smtpError) {
        console.error('Gmail SMTP test failed, trying Web3Forms...', smtpError);
        result = await sendQuizEmailFallback(testData);
        emailMethod = 'Web3Forms (SMTP Fallback)';
      }
    } else {
      console.log('SMTP not configured, testing Web3Forms...');
      result = await sendQuizEmailFallback(testData);
      emailMethod = 'Web3Forms';
    }

    console.log(`Email test completed successfully via ${emailMethod}!`);

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

    console.log('=== QUIZ COMPLETION EMAIL ===');
    console.log('Processing quiz completion email...');
    console.log('Student Email:', userEmail);
    console.log('Student Name:', userName);
    console.log('Quiz Title:', quizTitle);
    console.log('Score:', `${totalMarks}/${maxMarks} (${percentage}%)`);
    console.log('Passed:', passed);

    let result;
    let emailMethod = 'Unknown';

    // Check if SMTP is configured
    const smtpConfigured = process.env.SMTP_USER && 
                          process.env.SMTP_PASS && 
                          process.env.SMTP_PASS !== 'your_gmail_app_password_here';

    if (smtpConfigured) {
      try {
        console.log('Attempting to send via Gmail SMTP...');
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
        console.log('✅ Email sent successfully via Gmail SMTP');
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
      console.log('SMTP not configured, using Web3Forms...');
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

    console.log(`Quiz completion email sent successfully via ${emailMethod}!`);

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