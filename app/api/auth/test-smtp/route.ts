import { NextRequest } from "next/server";
import nodemailer from "nodemailer";

export async function GET(req: NextRequest) {
  try {
    console.log("Testing SMTP configuration...");
    console.log("SMTP_USER:", process.env.SMTP_USER);
    console.log("SMTP_PASS:", process.env.SMTP_PASS ? "***configured***" : "NOT SET");
    console.log("SMTP_HOST:", process.env.SMTP_HOST);
    console.log("SMTP_PORT:", process.env.SMTP_PORT);

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return Response.json({
        success: false,
        error: "SMTP credentials not configured",
        details: {
          SMTP_USER: !!process.env.SMTP_USER,
          SMTP_PASS: !!process.env.SMTP_PASS,
        }
      }, { status: 500 });
    }

    // Test with explicit configuration
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    console.log("Verifying SMTP connection...");
    await transporter.verify();
    console.log("✅ SMTP connection successful!");

    return Response.json({
      success: true,
      message: "SMTP connection successful!",
      config: {
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: process.env.SMTP_PORT || "587",
        user: process.env.SMTP_USER,
      }
    });

  } catch (error: any) {
    console.error("SMTP test error:", error);
    console.error("Error message:", error.message);
    console.error("Error code:", error.code);
    
    return Response.json({
      success: false,
      error: error.message,
      code: error.code,
      details: error.toString(),
    }, { status: 500 });
  }
}
