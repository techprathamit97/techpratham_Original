import { NextRequest } from "next/server";
import { connectMongo } from "@/utils/mongodb";
import { User } from "@/models/user";
import crypto from "crypto";
import { sendEmail } from "@/lib/sendEmail";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return Response.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Check if SMTP credentials are configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error("SMTP credentials not configured");
      return Response.json(
        { success: false, error: "Email service is not configured. Please contact support." },
        { status: 500 }
      );
    }

    // Check if NEXTAUTH_URL is configured
    if (!process.env.NEXTAUTH_URL) {
      console.error("NEXTAUTH_URL not configured");
      return Response.json(
        { success: false, error: "Application URL is not configured. Please contact support." },
        { status: 500 }
      );
    }

    await connectMongo();

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Don't reveal if user exists or not for security
      return Response.json({
        success: true,
        message: "If an account exists with this email, you will receive a password reset link.",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    console.log("Generated reset token:", resetToken);
    console.log("Token expiry:", resetTokenExpiry);

    // Save token to user
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiry = resetTokenExpiry;
    await user.save();

    console.log("Token saved to user:", user.email);
    console.log("Saved token:", user.resetPasswordToken);
    console.log("Saved expiry:", user.resetPasswordExpiry);

    // Create reset URL
    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`;

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
              padding: 30px;
              border-radius: 8px 8px 0 0;
              text-align: center;
            }
            .content {
              background: #f9f9f9;
              padding: 30px;
              border-radius: 0 0 8px 8px;
              border: 1px solid #e0e0e0;
            }
            .button {
              display: inline-block;
              padding: 12px 30px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
              font-weight: bold;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              padding-top: 20px;
              border-top: 1px solid #e0e0e0;
              color: #666;
              font-size: 14px;
            }
            .warning {
              background: #fff3cd;
              border: 1px solid #ffc107;
              padding: 15px;
              border-radius: 5px;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <p>Hi ${user.name || 'there'},</p>
            <p>We received a request to reset your password for your TechPratham account.</p>
            <p>Click the button below to reset your password:</p>
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </div>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #667eea;">${resetUrl}</p>
            <div class="warning">
              <strong>⚠️ Important:</strong>
              <ul>
                <li>This link will expire in 1 hour</li>
                <li>If you didn't request this, please ignore this email</li>
                <li>Your password won't change until you create a new one</li>
              </ul>
            </div>
            <div class="footer">
              <p>Best regards,<br>TechPratham Team</p>
              <p style="font-size: 12px; color: #999;">
                This is an automated email. Please do not reply.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email using utility function
    try {
      await sendEmail({
        to: email,
        subject: "Password Reset Request - TechPratham",
        html: emailHtml,
      });

      console.log("✅ Password reset email sent to:", email);
    } catch (emailError: any) {
      console.error("Email sending error:", emailError);
      console.error("Email error message:", emailError.message);
      
      // Rollback: Remove the token from user since email failed
      user.resetPasswordToken = undefined;
      user.resetPasswordExpiry = undefined;
      await user.save();
      
      // Return specific error
      if (emailError.message?.includes("Invalid login") || emailError.message?.includes("535")) {
        return Response.json(
          { success: false, error: "Email authentication failed. Please verify your Gmail App Password is correct and 2-Step Verification is enabled." },
          { status: 500 }
        );
      } else if (emailError.message?.includes("ECONNREFUSED") || emailError.message?.includes("ETIMEDOUT")) {
        return Response.json(
          { success: false, error: "Unable to connect to email service. Please check your internet connection and try again." },
          { status: 500 }
        );
      } else {
        return Response.json(
          { success: false, error: `Failed to send reset email: ${emailError.message}` },
          { status: 500 }
        );
      }
    }

    return Response.json({
      success: true,
      message: "If an account exists with this email, you will receive a password reset link.",
    });
  } catch (error: any) {
    console.error("Forgot password error:", error);
    console.error("Error stack:", error.stack);
    console.error("Error message:", error.message);
    
    // Return more specific error message
    let errorMessage = "Failed to process request";
    
    if (error.message?.includes("SMTP") || error.message?.includes("ECONNREFUSED")) {
      errorMessage = "Email service is currently unavailable. Please try again later.";
    } else if (error.message?.includes("Invalid login")) {
      errorMessage = "Email configuration error. Please contact support.";
    } else if (error.message) {
      errorMessage = `Error: ${error.message}`;
    }
    
    return Response.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
