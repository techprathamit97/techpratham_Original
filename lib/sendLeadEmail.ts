

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
  
  // Create different email templates for different form types to avoid spam detection
  const isLeadForm = data.formType === 'course-callback';
  const isHeaderForm = data.formType === 'course-header-enquiry';
  
  // Use different subject lines and content structure for different forms
  let subject = '';
  let emailContent = '';
  
  if (isLeadForm) {
    subject = `Training Inquiry - ${data.fullName || 'New Student'} - TechPratham`;
    emailContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Training Inquiry</title>
      </head>
      <body style="margin:0; padding:20px; font-family: Arial, sans-serif; background-color: #f9f9f9; color: #333;">
        <div style="max-width:600px; margin: 0 auto; background: #ffffff; border-radius: 6px; border: 1px solid #ddd;">
          
          <div style="background: #2563eb; padding: 15px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 20px;">Training Inquiry Received</h1>
          </div>

          <div style="padding: 25px;">
            <h2 style="color: #1f2937; font-size: 16px; margin: 0 0 15px 0;">Student Details</h2>
            <div style="background: #f3f4f6; padding: 15px; border-radius: 4px;">
              <p style="margin: 6px 0;"><strong>Student Name:</strong> ${data.fullName || "Not provided"}</p>
              <p style="margin: 6px 0;"><strong>Contact Number:</strong> ${data.phone || "Not provided"}</p>
              <p style="margin: 6px 0;"><strong>Email Address:</strong> ${data.email || "Not provided"}</p>
              <p style="margin: 6px 0;"><strong>Training Interest:</strong> ${data.course || "General inquiry"}</p>
            </div>

            <div style="border-top: 1px solid #e5e7eb; margin-top: 20px; padding-top: 15px;">
              <p style="font-size: 11px; color: #6b7280; margin: 2px 0;">Inquiry Date: ${new Date().toLocaleString()}</p>
              <p style="font-size: 11px; color: #6b7280; margin: 2px 0;">Source: ${data.source || "Website"}</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  } else if (isHeaderForm) {
    subject = `Course Information Request - ${data.course || 'Course'} - TechPratham`;
    emailContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Course Information Request</title>
      </head>
      <body style="margin:0; padding:20px; font-family: Arial, sans-serif; background-color: #f5f5f5; color: #333;">
        <div style="max-width:600px; margin: 0 auto; background: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          
          <div style="background: #059669; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 22px;">Course Information Request</h1>
          </div>

          <div style="padding: 30px;">
            <h2 style="color: #333; font-size: 18px; margin: 0 0 15px 0;">Prospective Student</h2>
            <div style="background: #ecfdf5; border: 1px solid #d1fae5; border-radius: 6px; padding: 15px;">
              <p style="margin: 8px 0;"><strong>Name:</strong> ${data.fullName || "Not provided"}</p>
              <p style="margin: 8px 0;"><strong>Phone:</strong> ${data.phone || "Not provided"}</p>
              <p style="margin: 8px 0;"><strong>Email:</strong> ${data.email || "Not provided"}</p>
              <p style="margin: 8px 0;"><strong>Course of Interest:</strong> ${data.course || "General inquiry"}</p>
            </div>

            <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 20px;">
              <p style="font-size: 12px; color: #666; margin: 3px 0;">Submitted: ${new Date().toLocaleString()}</p>
              <p style="font-size: 12px; color: #666; margin: 3px 0;">Platform: ${data.source || "Website"}</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  } else {
    // Default template for other forms
    subject = `New Contact from ${formLabel} - TechPratham`;
    emailContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>New Contact</title>
      </head>
      <body style="margin:0; padding:20px; font-family: Arial, sans-serif; background-color: #f5f5f5; color: #333;">
        <div style="max-width:600px; margin: 0 auto; background: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">

          <div style="background: #C6151D; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">New Contact Request</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0; font-size: 14px;">From: ${formLabel}</p>
          </div>

          <div style="padding: 30px;">
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
    `;
  }

  await resend.emails.send({
    from: "TechPratham <onboarding@resend.dev>",
    to: [admin],
    subject: subject,
    html: emailContent,
  });
}
