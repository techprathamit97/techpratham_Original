import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectMongo } from "@/utils/mongodb";
import { User } from "@/models/user";

/**
 * Server-side role checks for API routes.
 *
 * authOptions defines no session/jwt callback, so the session only carries
 * name/email/image. The role therefore has to be read from the database rather
 * than trusted from the token.
 */

export type StaffRole = "admin" | "accountant";

/**
 * Roles permitted to read and modify lead data.
 *
 * "accountant" is included because pages/accountant/dashboard/leads.tsx is an
 * existing feature that lists leads. This mirrors checkAccountantAccess() in
 * context/userContext.js. Remove "accountant" here to make it admin-only.
 */
export const LEAD_ACCESS_ROLES: StaffRole[] = ["admin", "accountant"];

/** Resolves the caller's role from their session, or null when not signed in. */
export async function getCallerRole(): Promise<string | null> {
  try {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;

    if (!email) return null;

    await connectMongo();
    const user = await User.findOne({ email }, { role: 1 }).lean();

    return (user as any)?.role?.type ?? null;
  } catch (error) {
    // Fail closed: an error here must never be read as "authorised".
    console.error("Role lookup failed:", error);
    return null;
  }
}

/**
 * Returns a 401/403 response when the caller lacks one of the allowed roles,
 * or null when the request may proceed.
 *
 * Usage:
 *   const denied = await requireRole(LEAD_ACCESS_ROLES);
 *   if (denied) return denied;
 */
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
