import { NextRequest } from "next/server";
import nodemailer from "nodemailer";

export async function GET(req: NextRequest) {
  try {
    // Check if SMTP credentials are configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return Response.json(
        { 
          success: false, 
          error: "SMTP credentials not configured",
          details: {
            SMTP_USER: process.env.SMTP_USER ? "✓ Set" : "✗ Missing",
            SMTP_PASS: process.env.SMTP_PASS ? "✓ Set" : "✗ Missing",
            SMTP_HOST: process.env.SMTP_HOST || "smtp.gmail.com",
            SMTP_PORT: process.env.SMTP_PORT || "587"
          }
        },
        { status: 500 }
      );
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Verify connection
    const isConnected = await transporter.verify();

    if (isConnected) {
      return Response.json({
        success: true,
        message: "SMTP connection successful!",
        details: {
          host: process.env.SMTP_HOST || "smtp.gmail.com",
          port: process.env.SMTP_PORT || "587",
          user: process.env.SMTP_USER,
          secure: process.env.SMTP_PORT === "465"
        }
      });
    } else {
      return Response.json(
        { 
          success: false, 
          error: "SMTP connection failed",
          details: "Unable to connect to SMTP server"
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("SMTP test error:", error);
    
    let errorMessage = "SMTP connection test failed";
    let specificError = "";
    
    if (error.code === "EAUTH" || error.message?.includes("Invalid login")) {
      specificError = "Authentication failed - Check your Gmail App Password";
    } else if (error.code === "ECONNREFUSED") {
      specificError = "Connection refused - Check your internet connection";
    } else if (error.code === "ETIMEDOUT") {
      specificError = "Connection timeout - Check firewall settings";
    } else if (error.message?.includes("535")) {
      specificError = "Gmail rejected credentials - Generate a new App Password";
    }
    
    return Response.json(
      { 
        success: false, 
        error: errorMessage,
        details: {
          code: error.code,
          message: error.message,
          specificError,
          solution: specificError ? 
            (specificError.includes("App Password") ? 
              "1. Enable 2-Step Verification on Gmail\n2. Generate new App Password\n3. Update SMTP_PASS in .env.local\n4. Restart server" :
              "Check your internet connection and firewall settings"
            ) : "Check server logs for more details"
        }
      },
      { status: 500 }
    );
  }
}