import { NextResponse } from "next/server";

/**
 * Server-side confirmation of an MSG91 OTP verification.
 *
 * The client verifies the OTP via the MSG91 Web SDK and receives a short-lived
 * JWT "access token". We re-validate that token here using the secret Auth Key
 * (kept server-side only) so a lead can only be submitted after a genuine,
 * server-confirmed phone verification.
 *
 * MSG91 docs: POST https://control.msg91.com/api/v5/widget/verifyAccessToken
 */
export async function POST(request: Request) {
  try {
    const { accessToken } = await request.json();

    if (!accessToken || typeof accessToken !== "string") {
      return NextResponse.json(
        { status: "error", message: "Missing access token." },
        { status: 400 }
      );
    }

    const authkey = process.env.MSG91_AUTH_KEY;
    if (!authkey) {
      console.error("MSG91_AUTH_KEY is not configured.");
      return NextResponse.json(
        { status: "error", message: "OTP verification is not configured." },
        { status: 500 }
      );
    }

    const resp = await fetch(
      "https://control.msg91.com/api/v5/widget/verifyAccessToken",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authkey, "access-token": accessToken }),
        cache: "no-store",
      }
    );

    const data = await resp.json().catch(() => null);

    // MSG91's widget routes can return HTTP 200 even on failure, signalling the
    // error with `type: "error"` (or code "201"). A valid token comes back as
    // `type: "success"` with `message` holding the verified identifier. Treat it
    // as verified only when there is a positive response and no error marker.
    const isError =
      !data || data.type === "error" || String(data.code) === "201";

    if (resp.ok && !isError) {
      return NextResponse.json({ status: "ok", verified: true });
    }

    return NextResponse.json(
      {
        status: "error",
        verified: false,
        message: data?.message || "Phone verification failed.",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("OTP verify error:", error);
    return NextResponse.json(
      { status: "error", message: "OTP verification failed." },
      { status: 500 }
    );
  }
}
