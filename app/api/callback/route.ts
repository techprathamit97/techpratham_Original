import { NextResponse } from "next/server";
import { Resend } from "resend";
// import { connectDB } from "@/utils/mongodb";
import { connectMongo } from '@/utils/mongodb';

import { Lead } from "@/models/Lead";

const resend = new Resend(process.env.RESEND_CODE);
const admin = process.env.ADMIN_EMAIL || "";

export async function POST(request: Request) {
  try {
    const formData = await request.json();
    const { fullName, email, course, phone, message } = formData;

    // 📌 Capture IP
    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIp =
      forwardedFor?.split(",")[0].trim() ||
      request.headers.get("x-real-ip") ||
      "Unknown IP";

    // ✅ Save lead to DB
    await connectMongo();
    await Lead.create({
      fullName,
      email,
      phone,
      course,
      message,
      ipAddress: realIp,
    });
const emailHtml = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; background:#f8fafc; padding:20px;">
    <div style="max-width:600px; background:#ffffff; padding:24px; border-radius:12px; box-shadow:0 6px 16px rgba(0,0,0,0.08);">
      
      <h2 style="margin-top:0;">📩 New Lead Received</h2>

      <p><strong>Name:</strong> ${fullName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Course:</strong> ${course}</p>

      ${message ? `<p><strong>Message:</strong> ${message}</p>` : ""}

      <hr />

      <p><strong>IP Address:</strong> ${realIp}</p>
      <p><strong>Submitted At:</strong> ${new Date().toLocaleString()}</p>

    </div>
  </div>
`;

    // ✅ Send Email
    await resend.emails.send({
      from: "TechPratham <onboarding@resend.dev>",
      to: [admin],
      subject: "📞 New Callback Request - TechPratham",
      html: emailHtml,
    });

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Callback API error:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to process callback" },
      { status: 500 }
    );
  }
}
