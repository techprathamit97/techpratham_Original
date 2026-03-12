
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_CODE);
const admin = process.env.ADMIN_EMAIL || "";

export async function POST(request: Request) {
  try {
    const formData = await request.json();
    const { fullName, email, course, company, phone, whatsapp } = formData;

    // ----------------------------
    // ✅ Capture User Real IP Address
    // ----------------------------
    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIp =
      forwardedFor?.split(",")[0].trim() ||
      request.headers.get("x-real-ip") ||
      "Unknown IP";

    console.log("📌 Pop-up Lead Received From IP:", realIp);
    // ----------------------------

    await resend.emails.send({
      from: "TechPratham <onboarding@resend.dev>",
      to: [admin],
      subject: "🎯 New Lead - Callback Request - TechPratham",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Lead Callback Request</title>
        </head>
        <body style="margin: 0; padding: 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; color: #334155;">
          <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); overflow: hidden;">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">🎯 New Lead Generated!</h1>
              <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0 0; font-size: 16px;">Callback Request - Pop-up Submission</p>
            </div>
            
            <!-- Lead Badge -->
            <div style="text-align: center; margin: -20px auto 0; position: relative; z-index: 1;">
              <span style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); color: #78350f; padding: 8px 24px; border-radius: 20px; font-weight: 700; font-size: 14px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); display: inline-block;">
                ⭐ HOT LEAD - Pop-up Form
              </span>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
              
              <!-- Student Information -->
              <div style="margin-bottom: 30px;">
                <h2 style="color: #1e293b; font-size: 20px; font-weight: 600; margin: 0 0 20px 0;">
                  👤 Lead Information
                </h2>
                <div style="background: #fef2f2; border-radius: 12px; padding: 20px; border-left: 4px solid #ef4444;">
                  <p><strong style="width: 100px; display:inline-block; color:#64748b;">Full Name:</strong> ${fullName}</p>
                  <p><strong style="width: 100px; display:inline-block; color:#64748b;">Phone:</strong> <span style="color:#dc2626; font-size:16px; font-weight:700;">${phone}</span></p>
                  <p><strong style="width: 100px; display:inline-block; color:#64748b;">Email:</strong> ${email}</p>
                </div>
              </div>

              <!-- Course Interest -->
              <div style="margin-bottom: 30px;">
                <h2 style="color: #1e293b; font-size: 20px; font-weight: 600; margin: 0 0 20px;">
                  📚 Course Interest
                </h2>
                <div style="background: #fef3c7; border-radius: 12px; padding: 20px; border-left: 4px solid #f59e0b;">
                  <p><strong style="width: 100px; display:inline-block; color:#64748b;">Course:</strong> ${course}</p>
                  <p><strong style="width: 100px; display:inline-block; color:#64748b;">Company:</strong> ${company}</p>
                </div>
              </div>

              <!-- WhatsApp Preference -->
              <div style="margin-bottom: 30px;">
                <h2 style="color: #1e293b; font-size: 20px; font-weight: 600; margin: 0 0 20px;">
                  💬 Communication Preference
                </h2>
                <div style="background: ${whatsapp ? '#dcfce7' : '#f1f5f9'}; border-radius: 12px; padding: 20px; border-left: 4px solid ${whatsapp ? '#10b981' : '#94a3b8'};">
                  <p>
                    <strong style="width: 150px; display:inline-block; color:#64748b;">WhatsApp Connect:</strong>
                    <span style="color:${whatsapp ? '#059669' : '#64748b'}; font-size:16px; font-weight:700;">
                      ${whatsapp ? "✅ Yes - Preferred" : "❌ Not Selected"}
                    </span>
                  </p>
                </div>
              </div>

              <!-- 🛡️ IP Address Section -->
              <div style="margin-bottom: 30px;">
                <h2 style="color:#1e293b; font-size:20px; font-weight:600; margin:0 0 20px;">
                  🛡️ Lead Origin
                </h2>
                <div style="background:#eef2ff; border-radius:12px; padding:20px; border-left:4px solid #6366f1;">
                  <p><strong style="width:150px; display:inline-block; color:#64748b;">User IP Address:</strong> ${realIp}</p>
                </div>
              </div>

              <!-- Quick Actions -->
              <div style="margin-top: 25px; padding: 20px; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
                <h3 style="color: #1e293b; font-size: 16px; font-weight: 600; margin-bottom: 15px;">🚀 Quick Actions:</h3>
                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                  <a href="tel:${phone}" style="background:#ef4444; color:white; padding:10px 18px; border-radius:8px; text-decoration:none; font-weight:600;">📱 Call Now</a>
                  <a href="mailto:${email}" style="background:#3b82f6; color:white; padding:10px 18px; border-radius:8px; text-decoration:none; font-weight:600;">✉️ Send Email</a>
                  ${whatsapp ? `<a href="https://wa.me/${phone.replace(/[^0-9]/g, '')}" style="background:#10b981; color:white; padding:10px 18px; border-radius:8px; text-decoration:none; font-weight:600;">📲 WhatsApp</a>` : ""}
                </div>
              </div>

            </div>

            <!-- Footer -->
            <div style="background:#f8fafc; padding:20px 30px; text-align:center; border-top:1px solid #e2e8f0;">
              <p style="color:#64748b; margin:0; font-size:14px;">🤖 Automated Lead Notification - TechPratham</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Error processing lead callback request:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to process lead callback request" },
      { status: 500 }
    );
  }
}
