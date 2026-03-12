
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_CODE);
const admin = process.env.ADMIN_EMAIL || "";

export async function POST(request: Request) {
  try {
    const formData = await request.json();
    const { fullName, email, phone, amount, course, country, state, city, pinCode } = formData;

    // ✅ Add IP capturing
    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIp =
      forwardedFor?.split(",")[0].trim() ||
      request.headers.get("x-real-ip") ||
      request.headers.get("cf-connecting-ip") ||
      request.headers.get("x-client-ip") ||
      "Unknown IP";

    console.log("💳 Payment Form Submitted From IP:", realIp);

    await resend.emails.send({
      from: "TechPratham <onboarding@resend.dev>",
      to: [admin],
      subject: "💳 New Fee Payment Request - TechPratham",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Payment Request</title>
        </head>
        <body style="margin: 0; padding: 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; color: #334155;">
          <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); overflow: hidden;">
            
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">💳 Payment Request</h1>
              <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0 0; font-size: 16px;">TechPratham Fee Payment</p>
            </div>
            
            <div style="padding: 40px 30px;">

              <div style="margin-bottom: 30px;">
                <h2 style="color: #1e293b; font-size: 20px; font-weight: 600; margin: 0 0 20px 0;">👤 Student Information</h2>
                <div style="background: #f8fafc; border-radius: 12px; padding: 20px; border-left: 4px solid #3b82f6;">
                  <div style="margin-bottom: 12px;">
                    <span style="color: #64748b; font-weight: 500; display: inline-block; width: 80px;">Name:</span>
                    <span style="color: #1e293b; font-weight: 600;">${fullName}</span>
                  </div>
                  <div style="margin-bottom: 12px;">
                    <span style="color: #64748b; font-weight: 500; display: inline-block; width: 80px;">Email:</span>
                    <span style="color: #3b82f6; font-weight: 500;">${email}</span>
                  </div>
                  <div>
                    <span style="color: #64748b; font-weight: 500; display: inline-block; width: 80px;">Phone:</span>
                    <span style="color: #1e293b; font-weight: 600;">${phone}</span>
                  </div>
                </div>
              </div>

              <div style="margin-bottom: 30px;">
                <h2 style="color: #1e293b; font-size: 20px; font-weight: 600; margin: 0 0 20px 0;">📚 Course Details</h2>
                <div style="background: #f0fdf4; border-radius: 12px; padding: 20px; border-left: 4px solid #22c55e;">
                  <div style="margin-bottom: 12px;">
                    <span style="color: #64748b; font-weight: 500; display: inline-block; width: 80px;">Course:</span>
                    <span style="color: #1e293b; font-weight: 600;">${course}</span>
                  </div>
                  <div>
                    <span style="color: #64748b; font-weight: 500; display: inline-block; width: 80px;">Amount:</span>
                    <span style="color: #059669; font-weight: 700; font-size: 18px;">₹${amount}</span>
                  </div>
                </div>
              </div>

              <div style="margin-bottom: 30px;">
                <h2 style="color: #1e293b; font-size: 20px; font-weight: 600; margin: 0 0 20px 0;">📍 Address Information</h2>
                <div style="background: #fef3c7; border-radius: 12px; padding: 20px; border-left: 4px solid #f59e0b;">
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                    <div>
                      <span style="color: #64748b; font-weight: 500;">Country:</span>
                      <span style="color: #1e293b; font-weight: 600;">${country}</span>
                    </div>
                    <div>
                      <span style="color: #64748b; font-weight: 500;">State:</span>
                      <span style="color: #1e293b; font-weight: 600;">${state}</span>
                    </div>
                    <div>
                      <span style="color: #64748b; font-weight: 500;">City:</span>
                      <span style="color: #1e293b; font-weight: 600;">${city}</span>
                    </div>
                    <div>
                      <span style="color: #64748b; font-weight: 500;">Pin Code:</span>
                      <span style="color: #1e293b; font-weight: 600;">${pinCode}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- ✅ Added IP Block -->
              <div style="background:#eff6ff; padding:12px; border-radius:10px; border-left:4px solid #3b82f6; margin-bottom:20px;">
                <p style="margin:0; color:#1e40af; font-size:14px;">
                  🌍 Payment Request Submitted From IP:  
                  <strong style="color:#0f172a;">${realIp}</strong>
                </p>
              </div>

              <div style="background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%); padding: 20px; border-radius: 12px;">
                <p style="color: #dc2626; font-weight: 600;">⚡ Action Required</p>
                <p style="color: #991b1b;">Please process this payment request and contact the student for confirmation.</p>
              </div>
            </div>

            <div style="background: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #64748b;">🤖 Automated Email from TechPratham</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Error processing payment form submission:", error);
    return NextResponse.json({ status: "error", message: "Failed to process payment request" }, { status: 500 });
  }
}
