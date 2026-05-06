import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail({ to, subject, html, from }: EmailOptions) {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Verify connection
    await transporter.verify();
    console.log('✅ SMTP connection verified');

    // Send email
    const info = await transporter.sendMail({
      from: from || `"TechPratham" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });

    console.log('✅ Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };

  } catch (error: any) {
    console.error('❌ Email sending failed:', error);
    throw error;
  }
}
