import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectMongo } from "@/utils/mongodb";
import { User } from "@/models/user";



export type StaffRole = "admin" | "accountant";


export const LEAD_ACCESS_ROLES: StaffRole[] = ["admin", "accountant"];


export async function getCallerRole(): Promise<string | null> {
  try {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;

    if (!email) return null;

    await connectMongo();
    const user = await User.findOne({ email }, { role: 1 }).lean();

    return (user as any)?.role?.type ?? null;
  } catch (error) {
    
    console.error("Role lookup failed:", error);
    return null;
  }
}


export async function requireRole(
  allowed: readonly string[]
): Promise<NextResponse | null> {
  const role = await getCallerRole();

  if (!role) {
    return NextResponse.json(
      { status: "error", message: "Authentication required" },
      { status: 401 }
    );
  }

  if (!allowed.includes(role)) {
    return NextResponse.json(
      { status: "error", message: "Forbidden" },
      { status: 403 }
    );
  }

  return null;
}
