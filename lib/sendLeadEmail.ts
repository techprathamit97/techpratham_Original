

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_CODE);
const admin = process.env.ADMIN_EMAIL || "";

const FORM_LABELS: Record<string, string> = {
  "reach-form": "Reach Out Widget",
  "lead-form": "Course Callback",
  "course-callback": "Course Callback",
  "course-header-enquiry": "Course Enquiry",
  "certificate": "Certificate Inquiry",
  "training-lead": "Training Lead",
  "Reach out to us": "Reach Out Widget",
};

export async function sendLeadEmail(data: any) {
  const formLabel = FORM_LABELS[data.formType] || data.formType;

  await resend.emails.send({
    from: "TechPratham <onboarding@resend.dev>",
    to: [admin],
    subject: `New Lead from ${formLabel} - TechPratham`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>New Lead</title>
      </head>
      <body style="margin:0; padding:20px; font-family: Arial, sans-serif; background-color: #f5f5f5; color: #333;">
        <div style="max-width:600px; margin: 0 auto; background: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">

          <!-- Header -->
          <div style="background: #C6151D; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">New Contact Request</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0; font-size: 14px;">From: ${formLabel}</p>
          </div>

          <!-- Content -->
          <div style="padding: 30px;">

            <!-- Lead Information -->
            <div style="margin-bottom: 25px;">
              <h2 style="color: #333; font-size: 18px; margin: 0 0 15px 0;">Contact Information</h2>
              <div style="background: #f8f9fa; border-radius: 6px; padding: 15px;">
                <p style="margin: 8px 0;"><strong>Name:</strong> ${data.fullName || "Not provided"}</p>
                <p style="margin: 8px 0;"><strong>Phone:</strong> ${data.phone || "Not provided"}</p>
                <p style="margin: 8px 0;"><strong>Email:</strong> ${data.email || "Not provided"}</p>
                <p style="margin: 8px 0;"><strong>Course:</strong> ${data.course || "General inquiry"}</p>
              </div>
            </div>

            ${
              data.message
                ? `<div style="margin-bottom: 25px;">
                    <h2 style="color: #333; font-size: 18px; margin: 0 0 15px;">Additional Message</h2>
                    <div style="background: #f8f9fa; border-radius: 6px; padding: 15px;">${data.message}</div>
                  </div>`
                : ""
            }

            <!-- Submission Details -->
            <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 20px;">
              <p style="font-size: 12px; color: #666; margin: 3px 0;">
                <strong>Date:</strong> ${new Date().toLocaleString()}
              </p>
              <p style="font-size: 12px; color: #666; margin: 3px 0;">
                <strong>Source:</strong> ${data.source || "Website"}
              </p>
              ${data.ipAddress ? `<p style="font-size: 12px; color: #666; margin: 3px 0;"><strong>IP:</strong> ${data.ipAddress}</p>` : ''}
            </div>

          </div>
        </div>
      </body>
      </html>
    `,
  });
}
