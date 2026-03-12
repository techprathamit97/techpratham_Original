import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_CODE);
const admin = process.env.ADMIN_EMAIL || "";

export async function POST(request: Request) {
  try {
    const formData = await request.json();
    const { fullName, email, course, phone } = formData;

const forwardedFor = request.headers.get("x-forwarded-for");
const realIp =
  forwardedFor?.split(",")[0].trim() ||
  request.headers.get("x-real-ip") ||
  request.headers.get("cf-connecting-ip") || // Cloudflare
  request.headers.get("x-client-ip") ||
  "Unknown IP";

    await resend.emails.send({
      from: "TechPratham <onboarding@resend.dev>",
      to: [admin],
      subject: "📞 New Callback Request - TechPratham",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Callback Request</title>
        </head>
        <body style="margin: 0; padding: 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; color: #334155;">
          <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); overflow: hidden;">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">📞 Callback Request</h1>
              <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0 0; font-size: 16px;">Student Inquiry - TechPratham</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
              
              <!-- Student Information -->
              <div style="margin-bottom: 30px;">
                <h2 style="color: #1e293b; font-size: 20px; font-weight: 600; margin: 0 0 20px 0; display: flex; align-items: center;">
                  👤 Student Information
                </h2>
                <div style="background: #f0f9ff; border-radius: 12px; padding: 20px; border-left: 4px solid #0ea5e9;">
                  <div style="margin-bottom: 12px;">
                    <span style="color: #64748b; font-weight: 500; display: inline-block; width: 80px;">Name:</span>
                    <span style="color: #1e293b; font-weight: 600;">${fullName}</span>
                  </div>
                  <div>
                    <span style="color: #64748b; font-weight: 500; display: inline-block; width: 80px;">Phone:</span>
                    <span style="color: #059669; font-weight: 700; font-size: 16px;">${phone}</span>
                  </div>
                </div>
              </div>

              <!-- Course Interest -->
              <div style="margin-bottom: 30px;">
                <h2 style="color: #1e293b; font-size: 20px; font-weight: 600; margin: 0 0 20px 0; display: flex; align-items: center;">
                  📚 Course Interest
                </h2>
                <div style="background: #fef3c7; border-radius: 12px; padding: 20px; border-left: 4px solid #f59e0b;">
                  <div>
                    <span style="color: #64748b; font-weight: 500; display: inline-block; width: 80px;">Course:</span>
                    <span style="color: #92400e; font-weight: 600; font-size: 16px;">${course}</span>
                  </div>
                </div>
              </div>

              <!-- Priority Action -->
              <div style="background: linear-gradient(135deg, #ddd6fe 0%, #c4b5fd 100%); border-radius: 12px; padding: 20px; text-align: center; border-left: 4px solid #8b5cf6;">
                <p style="color: #7c3aed; font-weight: 600; margin: 0; font-size: 16px;">🎯 Priority Action Required</p>
                <p style="color: #6d28d9; margin: 8px 0 0 0; font-size: 14px;">Please call back within 2 hours for better conversion rate.</p>
              </div>

              <!-- Quick Actions -->
              <div style="margin-top: 25px; padding: 20px; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
                <h3 style="color: #1e293b; font-size: 16px; font-weight: 600; margin: 0 0 15px 0;">🚀 Quick Actions:</h3>
                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                  <a href="tel:${phone}" style="background: #10b981; color: white; padding: 8px 16px; border-radius: 8px; text-decoration: none; font-weight: 500; font-size: 14px;">📱 Call Now</a>
                  <a href="mailto:${email}" style="background: #3b82f6; color: white; padding: 8px 16px; border-radius: 8px; text-decoration: none; font-weight: 500; font-size: 14px;">✉️ Send Email</a>
                  <a href="https://wa.me/${phone.replace(/[^0-9]/g, '')}" style="background: #059669; color: white; padding: 8px 16px; border-radius: 8px; text-decoration: none; font-weight: 500; font-size: 14px;">📲 WhatsApp</a>
                </div>
              </div>
            </div>
            
 <!-- IP Address Block -->
              <div style="background: #eff6ff; padding: 15px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #3b82f6;">
                <p style="margin:0; color:#1e40af; font-size:14px; font-weight:600;">
                  🌍 Lead Submitted From IP: <span style="color:#0f172a;">${realIp}</span>
                </p>
              </div>

            </div>

            <!-- Footer -->
            <div style="background: #f8fafc; padding: 20px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #64748b; margin: 0; font-size: 14px;">
                🤖 This is an automated callback request from TechPratham
              </p>
              <p style="color: #94a3b8; margin: 8px 0 0 0; font-size: 12px;">
                Received on ${new Date().toLocaleDateString('en-IN', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Error processing callback request:", error);
    return NextResponse.json({ status: "error", message: "Failed to process callback request" }, { status: 500 });
  }
}