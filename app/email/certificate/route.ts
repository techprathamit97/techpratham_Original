import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_CODE);
const admin = process.env.ADMIN_EMAIL || "";

export async function POST(request: Request) {
  try {
    const formData = await request.json();
    const { fullName, email, phone, course } = formData;

    await resend.emails.send({
      from: "TechPratham <onboarding@resend.dev>",
      to: [admin],
      subject: "🏆 Training Certificate Request - TechPratham",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Certificate Request</title>
        </head>
        <body style="margin: 0; padding: 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; color: #334155;">
          <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); overflow: hidden;">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">🏆 Certificate Request</h1>
              <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0 0; font-size: 16px;">TechPratham Training Certificate</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
              
              <!-- Student Information -->
              <div style="margin-bottom: 30px;">
                <h2 style="color: #1e293b; font-size: 20px; font-weight: 600; margin: 0 0 20px 0; display: flex; align-items: center;">
                  👤 Student Information
                </h2>
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

              <!-- Course Details -->
              <div style="margin-bottom: 30px;">
                <h2 style="color: #1e293b; font-size: 20px; font-weight: 600; margin: 0 0 20px 0; display: flex; align-items: center;">
                  📚 Course Completed
                </h2>
                <div style="background: #f0fdf4; border-radius: 12px; padding: 20px; border-left: 4px solid #22c55e;">
                  <div>
                    <span style="color: #64748b; font-weight: 500; display: inline-block; width: 80px;">Course:</span>
                    <span style="color: #1e293b; font-weight: 600; font-size: 16px;">${course}</span>
                  </div>
                </div>
              </div>

              <!-- Certificate Request Info -->
              <div style="margin-bottom: 30px;">
                <h2 style="color: #1e293b; font-size: 20px; font-weight: 600; margin: 0 0 20px 0; display: flex; align-items: center;">
                  📜 Request Details
                </h2>
                <div style="background: #fef3c7; border-radius: 12px; padding: 20px; border-left: 4px solid #f59e0b;">
                  <p style="color: #92400e; margin: 0; font-size: 14px; line-height: 1.6;">
                    <strong>Certificate Type:</strong> Training Completion Certificate<br>
                    <strong>Request Status:</strong> Pending Review<br>
                    <strong>Processing Time:</strong> 3-5 business days
                  </p>
                </div>
              </div>

              <!-- Action Required -->
              <div style="background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); border-radius: 12px; padding: 20px; text-align: center; border-left: 4px solid #3b82f6;">
                <p style="color: #1d4ed8; font-weight: 600; margin: 0; font-size: 16px;">⚡ Action Required</p>
                <p style="color: #1e40af; margin: 8px 0 0 0; font-size: 14px;">Please verify the student's course completion and generate the training certificate.</p>
              </div>
            </div>

            <!-- Footer -->
            <div style="background: #f8fafc; padding: 20px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #64748b; margin: 0; font-size: 14px;">
                🤖 This is an automated email from TechPratham Certificate System
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

    return NextResponse.json({ status: "ok", message: "Certificate request submitted successfully" });
  } catch (error) {
    console.error("Error processing certificate request:", error);
    return NextResponse.json({ status: "error", message: "Failed to process certificate request" }, { status: 500 });
  }
}