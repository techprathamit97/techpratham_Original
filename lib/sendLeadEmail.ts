

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
  "payment-form": "Payment Form",
};

export async function sendLeadEmail(data: any) {
  const formLabel = FORM_LABELS[data.formType] || data.formType;

  // Single consistent template for ALL forms to avoid spam detection
  await resend.emails.send({
    from: "TechPratham <noreply@techpratham.com>",
    to: [admin],
    subject: `${formLabel} - New Contact Inquiry - TechPratham`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Contact Inquiry</title>
      </head>
      <body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f9f9f9; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 6px; border: 1px solid #ddd;">
          
          <div style="background: #2563eb; padding: 15px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 20px;">Contact Inquiry - ${formLabel}</h1>
          </div>
          
          <div style="padding: 25px;">

            <div style="margin-bottom: 20px;">
              <h2 style="color: #1f2937; font-size: 16px; margin: 0 0 12px 0;">Contact Information</h2>
              <div style="background: #f3f4f6; padding: 15px; border-radius: 4px;">
                <p style="margin: 6px 0;"><strong>Name:</strong> ${data.fullName || "Not provided"}</p>
                <p style="margin: 6px 0;"><strong>Phone:</strong> ${data.phone || "Not provided"}</p>
                <p style="margin: 6px 0;"><strong>Email:</strong> ${data.email || "Not provided"}</p>
                <p style="margin: 6px 0;"><strong>Course:</strong> ${data.course || "General inquiry"}</p>
                <p style="margin: 6px 0;"><strong>Form Type:</strong> ${formLabel}</p>
              </div>
            </div>

            ${data.message ? `
              <div style="margin-bottom: 20px;">
                <h2 style="color: #1f2937; font-size: 16px; margin: 0 0 12px 0;">Message</h2>
                <div style="background: #f3f4f6; padding: 15px; border-radius: 4px;">${data.message}</div>
              </div>
            ` : ""}

            <div style="border-top: 1px solid #e5e7eb; padding-top: 15px; margin-top: 20px;">
              <p style="font-size: 11px; color: #6b7280; margin: 2px 0;">Received: ${new Date().toLocaleString()}</p>
              <p style="font-size: 11px; color: #6b7280; margin: 2px 0;">Source: ${data.source || "Website"}</p>
              ${data.ipAddress ? `<p style="font-size: 11px; color: #6b7280; margin: 2px 0;">IP: ${data.ipAddress}</p>` : ""}
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
  });
}
