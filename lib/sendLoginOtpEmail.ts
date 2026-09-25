import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_CODE);

/**
 * Allowed OTP recipient addresses. The admin/accountant picks ONE of these on
 * the login screen; the server validates the choice against this list so no
 * arbitrary address can be injected.
 *
 * Extra addresses can be appended via LOGIN_OTP_RECIPIENTS (comma-separated)
 * without a code change. The list is de-duplicated.
 */
export function getAllowedOtpRecipients(): string[] {
  const base = [
    "techpratham016@gmail.com",
    "techpratham003@gmail.com",
    "techprathamit@gmail.com",
    "techpratham008@gmail.com",
  ];
  const extra = (process.env.LOGIN_OTP_RECIPIENTS || "")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);
  return Array.from(new Set([...base, ...extra]));
}

/** Returns true if `email` is one of the allowed OTP recipients. */
export function isAllowedOtpRecipient(email: string): boolean {
  return getAllowedOtpRecipients().includes(email);
}

/**
 * Sends the 6-digit login OTP to a single chosen recipient.
 *
 * @param otp       
 * @param forEmail  
 * @param role       
 * @param recipient  
 */
export async function sendLoginOtpEmail(
  otp: string,
  forEmail: string,
  role: string,
  recipient: string
) {
  await resend.emails.send({
    from: "TechPratham <noreply@techpratham.com>",
    to: [recipient],
    subject: "Your TechPratham admin login OTP",
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
      <body style="margin:0;padding:20px;font-family:Arial,sans-serif;background-color:#f9f9f9;color:#333;">
        <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:6px;border:1px solid #ddd;">
          <div style="background:#C6151D;padding:16px;text-align:center;">
            <h1 style="color:#fff;margin:0;font-size:18px;">Admin Login Verification</h1>
          </div>
          <div style="padding:24px;">
            <p style="margin:0 0 16px 0;font-size:14px;">
              A login was attempted for <strong>${forEmail}</strong> (role: ${role}).
              Use the one-time code below to complete the sign-in.
            </p>
            <div style="text-align:center;margin:20px 0;">
              <span style="display:inline-block;font-size:32px;letter-spacing:8px;font-weight:bold;color:#111827;background:#f3f4f6;padding:12px 20px;border-radius:8px;">
                ${otp}
              </span>
            </div>
            <p style="margin:0;font-size:13px;color:#6b7280;">
              This code expires in 5 minutes. If you did not attempt to log in, ignore this email and consider changing the account password.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  });
}
