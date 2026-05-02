import nodemailer from "nodemailer";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { to, subject, message } = await req.json();

    // Validate required fields
    if (!to || !subject || !message) {
      return Response.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Parse multiple emails (comma-separated)
    const recipients = to.split(',').map((email: string) => email.trim()).filter((email: string) => email);
    
    if (recipients.length === 0) {
      return Response.json(
        { success: false, error: "No valid email addresses provided" },
        { status: 400 }
      );
    }

    console.log(`📧 Sending email to ${recipients.length} recipient(s):`, recipients);

    // Create transporter using Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false, // Fix for self-signed certificate error
      },
    });

    // Email HTML template
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 20px;
              border-radius: 8px 8px 0 0;
              text-align: center;
            }
            .content {
              background: #f9f9f9;
              padding: 30px;
              border-radius: 0 0 8px 8px;
              border: 1px solid #e0e0e0;
            }
            .message {
              background: white;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
              white-space: pre-wrap;
              word-wrap: break-word;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              padding-top: 20px;
              border-top: 1px solid #e0e0e0;
              color: #666;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>TechPratham</h1>
          </div>
          <div class="content">
            <div class="message">
              ${message.replace(/\n/g, '<br>')}
            </div>
            <div class="footer">
              <p>Sent from TechPratham</p>
              <p><strong>Sent at:</strong> ${new Date().toLocaleString()}</p>
              <p>Best regards,<br>TechPratham Team</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email
    const info = await transporter.sendMail({
      from: `"TechPratham" <${process.env.SMTP_USER}>`,
      to: recipients.join(', '), // Multiple recipients
      subject: subject,
      text: message,
      html: emailHtml,
    });

    console.log("✅ Email sent successfully!");
    console.log("Message ID:", info.messageId);
    console.log("To:", recipients.join(', '));
    console.log("From:", process.env.SMTP_USER);
    console.log("Total recipients:", recipients.length);

    return Response.json({ 
      success: true, 
      message: `Email sent successfully to ${recipients.length} recipient(s)!`,
      messageId: info.messageId,
      recipients: recipients,
      count: recipients.length
    });
  } catch (error: any) {
    console.error("Email send error:", error);
    return Response.json(
      { success: false, error: error.message || "Failed to send email" },
      { status: 500 }
    );
  }
}
