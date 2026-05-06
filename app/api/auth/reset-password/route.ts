import { NextRequest } from "next/server";
import { connectMongo } from "@/utils/mongodb";
import { User } from "@/models/user";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return Response.json(
        { success: false, error: "Token and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return Response.json(
        { success: false, error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    await connectMongo();

    console.log("Looking for token:", token);
    console.log("Current time:", new Date());

    // Find user with valid token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: new Date() }, // Token not expired
    });

    console.log("User found:", user ? user.email : "No user found");
    
    if (user) {
      console.log("User's token:", user.resetPasswordToken);
      console.log("User's expiry:", user.resetPasswordExpiry);
      console.log("Token matches:", user.resetPasswordToken === token);
      console.log("Token expired:", user.resetPasswordExpiry < new Date());
    }

    if (!user) {
      return Response.json(
        { success: false, error: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user password and clear reset token
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    console.log("✅ Password reset successful for:", user.email);

    return Response.json({
      success: true,
      message: "Password reset successful! You can now login with your new password.",
    });
  } catch (error: any) {
    console.error("Reset password error:", error);
    console.error("Error stack:", error.stack);
    console.error("Error message:", error.message);
    
    // Return more specific error message
    let errorMessage = "Failed to reset password";
    
    if (error.message?.includes("validation")) {
      errorMessage = "Invalid password format. Please try again.";
    } else if (error.message) {
      errorMessage = `Error: ${error.message}`;
    }
    
    return Response.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
