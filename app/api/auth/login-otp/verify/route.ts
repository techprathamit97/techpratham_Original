import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectMongo } from "@/utils/mongodb";
import { User } from "@/models/user";

/**
 * Step 2 of admin/accountant 2FA login.
 *
 * Verifies the submitted OTP against the stored hash + expiry. On success it
 * clears the stored OTP and responds { verified: true } — the client then
 * performs the actual NextAuth sign-in (which re-checks the password).
 */

const OTP_ROLES = ["admin", "accountant"];

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { status: "error", message: "Email and OTP are required." },
        { status: 400 }
      );
    }

    await connectMongo();
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { status: "error", message: "Invalid request." },
        { status: 400 }
      );
    }

    const role = user?.role?.type ?? "user";
    if (!OTP_ROLES.includes(role)) {
      // Normal users should not be here; nothing to verify.
      return NextResponse.json({ status: "ok", verified: true });
    }

    if (!user.loginOtpHash || !user.loginOtpExpiry) {
      return NextResponse.json(
        { status: "error", message: "No OTP requested. Please try logging in again." },
        { status: 400 }
      );
    }

    if (new Date(user.loginOtpExpiry).getTime() < Date.now()) {
      // Expired — clear it.
      user.loginOtpHash = undefined;
      user.loginOtpExpiry = undefined;
      await user.save();
      return NextResponse.json(
        { status: "error", message: "OTP has expired. Please try logging in again." },
        { status: 400 }
      );
    }

    const ok = await bcrypt.compare(String(otp), user.loginOtpHash);
    if (!ok) {
      return NextResponse.json(
        { status: "error", message: "Incorrect OTP. Please try again." },
        { status: 401 }
      );
    }

    // Success — invalidate the OTP so it can't be reused.
    user.loginOtpHash = undefined;
    user.loginOtpExpiry = undefined;
    await user.save();

    return NextResponse.json({ status: "ok", verified: true });
  } catch (error: any) {
    console.error("login-otp/verify error:", error);
    return NextResponse.json(
      { status: "error", message: "Could not verify OTP. Please try again." },
      { status: 500 }
    );
  }
}
