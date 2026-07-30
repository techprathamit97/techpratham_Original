
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_CODE);
const admin = process.env.ADMIN_EMAIL || "";

export async function POST(request: Request) {
  try {
    const formData = await request.json();
    const { fullName, email, phone, amount, course, country, state, city, pinCode } = formData;

    // Add IP capturing
    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIp =
      forwardedFor?.split(",")[0].trim() ||
      request.headers.get("x-real-ip") ||
      request.headers.get("cf-connecting-ip") ||
      request.headers.get("x-client-ip") ||
      "Unknown IP";

    console.log("Payment Form Submitted From IP:", realIp);

    await resend.emails.send({
      from: "TechPratham <noreply@techpratham.com>",
      to: [admin],
      subject: `New Contact Inquiry - TechPratham`,
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
              <h1 style="color: white; margin: 0; font-size: 20px;">Contact Inquiry</h1>
            </div>
            
            <div style="padding: 25px;">

              <div style="margin-bottom: 20px;">
                <h2 style="color: #1f2937; font-size: 16px; margin: 0 0 12px 0;">Contact Information</h2>
                <div style="background: #f3f4f6; padding: 15px; border-radius: 4px;">
                  <p style="margin: 6px 0;"><strong>Name:</strong> ${fullName}</p>
                  <p style="margin: 6px 0;"><strong>Email:</strong> ${email}</p>
                  <p style="margin: 6px 0;"><strong>Phone:</strong> ${phone}</p>
                  <p style="margin: 6px 0;"><strong>Course:</strong> ${course}</p>
                  <p style="margin: 6px 0;"><strong>Amount:</strong> Rs. ${amount}</p>
                </div>
              </div>

              <div style="margin-bottom: 20px;">
                <h2 style="color: #1f2937; font-size: 16px; margin: 0 0 12px 0;">Address Information</h2>
                <div style="background: #f3f4f6; padding: 15px; border-radius: 4px;">
                  <p style="margin: 6px 0;"><strong>Country:</strong> ${country}</p>
                  <p style="margin: 6px 0;"><strong>State:</strong> ${state}</p>
                  <p style="margin: 6px 0;"><strong>City:</strong> ${city}</p>
                  <p style="margin: 6px 0;"><strong>Pin Code:</strong> ${pinCode}</p>
                </div>
              </div>

              <div style="border-top: 1px solid #e5e7eb; padding-top: 15px; margin-top: 20px;">
                <p style="font-size: 11px; color: #6b7280; margin: 2px 0;">Received: ${new Date().toLocaleString()}</p>
                <p style="font-size: 11px; color: #6b7280; margin: 2px 0;">IP: ${realIp}</p>
              </div>
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
