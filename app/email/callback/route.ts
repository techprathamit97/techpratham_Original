
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_CODE);
const admin = process.env.ADMIN_EMAIL || "";

export async function POST(request: Request) {
  try {
    // Extract form data
    const formData = await request.json();
    const { fullName, email, course, phone, message } = formData;

    // --- ✅ Capture User IP Address ---
    const forwardedFor = request.headers.get("x-forwarded-for"); 
    const realIp =
      forwardedFor?.split(",")[0].trim() ||
      request.headers.get("x-real-ip") ||
      "Unknown IP";

    console.log("📌 Lead Received From IP:", realIp);

    // --------------------------------------------------

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
            
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">📞 Callback Request</h1>
              <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0 0; font-size: 16px;">Student Inquiry - TechPratham</p>
            </div>

            <div style="padding: 40px 30px;">

              <h2 style="color: #1e293b; font-size: 20px; font-weight: 600; margin-bottom: 20px;">👤 Student Information</h2>
              <div style="background: #f0f9ff; border-radius: 12px; padding: 20px; border-left: 4px solid #0ea5e9;">
                <p><strong>Name:</strong> ${fullName}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
              </div>

              <h2 style="color: #1e293b; font-size: 20px; font-weight: 600; margin: 30px 0 20px;">📚 Course Interest</h2>
              <div style="background: #fef3c7; border-radius: 12px; padding: 20px; border-left: 4px solid #f59e0b;">
                <p><strong>Course:</strong> ${course}</p>
              </div>

              <h2 style="color: #1e293b; font-size: 20px; font-weight: 600; margin: 30px 0 20px;">💬 Student Query</h2>
              <div style="background: #f3f4f6; border-radius: 12px; padding: 20px; border-left: 4px solid #6b7280;">
                <p>${message}</p>
              </div>

              <!-- NEW: IP ADDRESS SECTION -->
              <h2 style="color: #1e293b; font-size: 20px; font-weight: 600; margin: 30px 0 20px;">🛡️ Lead Origin</h2>
              <div style="background: #eef2ff; border-radius: 12px; padding: 20px; border-left: 4px solid #6366f1;">
                <p><strong>User IP Address:</strong> ${realIp}</p>
              </div>
            </div>

            <div style="background: #f8fafc; padding: 20px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #64748b; margin: 0; font-size: 14px;">🤖 Automated Callback Request from TechPratham</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return NextResponse.json({ status: "ok" });

  } catch (error) {
    console.error("Error processing callback request:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to process callback request" },
      { status: 500 }
    );
  }
}
