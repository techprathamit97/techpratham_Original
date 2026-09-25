import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectMongo } from "@/utils/mongodb";
import { User } from "@/models/user";
import {
  sendLoginOtpEmail,
  getAllowedOtpRecipients,
  isAllowedOtpRecipient,
} from "@/lib/sendLoginOtpEmail";

// Returns the list of allowed OTP recipient addresses so the login page can
// populate the "send OTP to" dropdown.
export async function GET() {
  return NextResponse.json({ recipients: getAllowedOtpRecipients() });
}

/**
 * Step 1 of admin/accountant 2FA login.
 *
 * Verifies email + password server-side. If the account is a normal `user`,
 * responds { requiresOtp: false } so the client can sign in directly. If the
 * account is `admin` or `accountant`, generates a 6-digit OTP, stores its hash
 * + expiry on the user, emails it to the configured recipients, and responds
 * { requiresOtp: true }.
 *
 * The OTP is never returned to the client.
 */

const OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes
const OTP_ROLES = ["admin", "accountant"];

export async function POST(req: Request) {
  try {
    const { email, password, recipient } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { status: "error", message: "Email and password are required." },
        { status: 400 }
      );
    }

    await connectMongo();
    const user = await User.findOne({ email });

    // Do not reveal whether the email exists; use a generic error.
    if (!user || !user.password) {
      return NextResponse.json(
        { status: "error", message: "Invalid email or password." },
        { status: 401 }
      );
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return NextResponse.json(
        { status: "error", message: "Invalid email or password." },
        { status: 401 }
      );
    }

    const role = user?.role?.type ?? "user";

    // Normal users: no OTP required.
    if (!OTP_ROLES.includes(role)) {
      return NextResponse.json({ status: "ok", requiresOtp: false });
    }

    // admin / accountant: determine the OTP recipient (must be from the
    // allow-list). Falls back to the first allowed address if none/invalid.
    const allowed = getAllowedOtpRecipients();
    const chosenRecipient =
      recipient && isAllowedOtpRecipient(recipient) ? recipient : allowed[0];

    // generate + email an OTP.
    const otp = String(Math.floor(100000 + Math.random() * 900000)); // 6 digits
    const otpHash = await bcrypt.hash(otp, 10);

    user.loginOtpHash = otpHash;
    user.loginOtpExpiry = new Date(Date.now() + OTP_TTL_MS);
    await user.save();

    await sendLoginOtpEmail(otp, email, role, chosenRecipient);

    // Return a masked recipient so the UI can confirm where the code was sent.
    return NextResponse.json({
      status: "ok",
      requiresOtp: true,
      sentTo: chosenRecipient,
    });
  } catch (error: any) {
    console.error("login-otp/request error:", error);
    return NextResponse.json(
      { status: "error", message: "Could not process login. Please try again." },
      { status: 500 }
    );
  }
}
