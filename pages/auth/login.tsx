"use client";

import React, { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaGoogle } from "react-icons/fa";
import Head from "next/head";
import { LinkedInLogoIcon } from "@radix-ui/react-icons";
import Loader from "@/components/common/Loader/Loader";
import Link from "next/link";
import Session from "@/components/common/Session/Session";

const Login = () => {
    const router = useRouter();
    const forwardurl = router.query;

    const { data: session, status: sessionStatus } = useSession();
    const [error, setError] = useState("");

    const [showPass, setShowPass] = useState(false);

    const [loading, setLoading] = useState(false);

    // ---- Admin/Accountant OTP 2FA state ----
    // When an admin/accountant enters valid credentials, we switch to an OTP
    // step instead of signing in immediately. Normal users skip this entirely.
    const [otpStep, setOtpStep] = useState(false);
    const [otp, setOtp] = useState("");
    const [pendingCreds, setPendingCreds] = useState<{ email: string; password: string } | null>(null);
    const [info, setInfo] = useState("");

    // Allowed OTP recipient addresses + the one selected by the admin/accountant.
    const [otpRecipients, setOtpRecipients] = useState<string[]>([]);
    const [selectedRecipient, setSelectedRecipient] = useState("");

    // Load the allowed OTP recipient list for the dropdown.
    useEffect(() => {
        fetch("/api/auth/login-otp/request")
            .then((r) => r.json())
            .then((d) => {
                const list: string[] = d?.recipients || [];
                setOtpRecipients(list);
                if (list.length > 0) setSelectedRecipient(list[0]);
            })
            .catch(() => {});
    }, []);

    // Performs the actual NextAuth sign-in + redirect once credentials (and OTP
    // if required) are validated.
    const completeSignIn = async (email: string, password: string) => {
        const res = await signIn("credentials", { redirect: false, email, password });
        if (res?.error) {
            setError("Invalid email or password");
            setLoading(false);
            return;
        }
        setLoading(false);
        const redirectParam = Array.isArray(forwardurl.redirect) ? forwardurl.redirect[0] : forwardurl.redirect;
        const urlParam = Array.isArray(forwardurl.url) ? forwardurl.url[0] : forwardurl.url;
        if (redirectParam) router.push(redirectParam);
        else if (urlParam) router.push(urlParam);
        else router.push("/account");
        setError("");
    };

    useEffect(() => {
        if (sessionStatus === "authenticated") {
            const redirectParam = Array.isArray(forwardurl.redirect) ? forwardurl.redirect[0] : forwardurl.redirect;
            const urlParam = Array.isArray(forwardurl.url) ? forwardurl.url[0] : forwardurl.url;
            
            if (redirectParam) {
                router.replace(redirectParam);
            } else if (urlParam) {
                router.replace(urlParam);
            } else {
                router.replace("/account"); // Changed from "/" to "/account" for role-based redirect
            }
        }
    }, [sessionStatus, router]);

    const isValidEmail = (email: string) => {
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setError("");

        const email = e.target[0].value;
        const password = e.target[1].value;

        if (!isValidEmail(email)) {
            console.error("Please enter a valid email address.");
            setError("Email is invalid");
            return;
        }

        if (!password || password.length < 8) {
            console.error("Password is invalid.");
            setError("Password is invalid");
            return;
        }

        setLoading(true);

        // Step 1: verify credentials + role server-side. Admin/accountant get an
        // OTP emailed; normal users are told to sign in directly.
        try {
            const resp = await fetch("/api/auth/login-otp/request", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, recipient: selectedRecipient }),
            });
            const data = await resp.json();

            if (!resp.ok) {
                setError(data?.message || "Invalid email or password");
                setLoading(false);
                return;
            }

            if (data.requiresOtp) {
                // Admin / accountant → show OTP step.
                setPendingCreds({ email, password });
                setOtpStep(true);
                setInfo(`An OTP has been sent to ${data.sentTo || "the selected email"}. Please enter it to continue.`);
                setLoading(false);
                return;
            }

            // Normal user → sign in directly.
            await completeSignIn(email, password);
        } catch (err) {
            console.error(err);
            setError("Something went wrong. Please try again.");
            setLoading(false);
        }
    };

    // Verifies the OTP for admin/accountant, then completes the sign-in.
    const handleOtpSubmit = async (e: any) => {
        e.preventDefault();
        setError("");
        if (!pendingCreds) {
            setError("Session expired. Please log in again.");
            setOtpStep(false);
            return;
        }
        if (!otp || otp.trim().length !== 6) {
            setError("Please enter the 6-digit OTP.");
            return;
        }

        setLoading(true);
        try {
            const resp = await fetch("/api/auth/login-otp/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: pendingCreds.email, otp: otp.trim() }),
            });
            const data = await resp.json();

            if (!resp.ok || !data.verified) {
                setError(data?.message || "Incorrect OTP.");
                setLoading(false);
                return;
            }

            await completeSignIn(pendingCreds.email, pendingCreds.password);
        } catch (err) {
            console.error(err);
            setError("Could not verify OTP. Please try again.");
            setLoading(false);
        }
    };

    return (
        <React.Fragment>
            <Head>
                <link rel="icon" href="/favicon.ico" type="image/ico" sizes="70x70" />
                <title>Login | TechPratham</title>
                <meta name="description" content="Log in to your TechPratham account or register to join our tech community. Stay updated with the latest news, events, and opportunities." />
                <meta name="keywords" content="TechPratham Login, TechPratham Register, Tech Community, Login, Register, TechPratham" />
                <meta name="author" content="TechPratham" />

                <meta property="og:title" content="Login | TechPratham" />
                <meta property="og:description" content="Access your TechPratham account or become a registered member. Connect, collaborate, and grow with the TechPratham community." />
                <meta property="og:image" content="/logo/og-techpratham.png" />
                <meta property="og:url" content="https://techpratham.com/auth/login/" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Login | TechPratham" />
                <meta name="twitter:description" content="Login or register with TechPratham to stay engaged with your peers and be part of our vibrant tech community." />
                <meta name="twitter:image" content="/logo/og-techpratham.png" />
            </Head>

          <div
  className="w-full min-h-screen flex items-center justify-center bg-cover  bg-center bg-no-repeat relative"
  style={{ backgroundImage: "url('/home/banner/login3.jpeg')" }}
>

  {/* GLOBAL OVERLAY */}
  <div className="absolute inset-0 bg-black/40"></div>

  {loading && <Loader />}

  {sessionStatus !== "authenticated" ? (
    <div className="w-full h-screen flex relative z-10">

      {/* LEFT SIDE */}
      <div className="hidden md:flex w-1/2 items-center justify-center">
        <div className="text-white px-16">
          <h1 className="text-5xl font-bold mb-6">Welcome Back</h1>

          <p className="text-sm max-w-md opacity-90">
            It is a long established fact that a reader will be distracted
            by the readable content of a page when looking at its layout.
          </p>

         
        </div>
      </div>

      {/* RIGHT SIDE LOGIN */}
      <div className="w-full md:w-1/2 flex items-center justify-center text-white px-6">

        <div className="w-full max-w-md bg-black/20 backdrop-blur-md p-8 rounded-xl">

          <h2 className="text-3xl font-semibold mb-8 text-center">
            {otpStep ? "Enter OTP" : "Sign in"}
          </h2>

          {!otpStep ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <Label htmlFor="email" className="text-white">
              Email Address
            </Label>

            <Input
              type="email"
              id="email"
              placeholder="variant@provider.com"
              className="bg-white text-black"
              required
            />

            <Label htmlFor="password" className="text-white">
              Password
            </Label>

            <div className="relative">
              <Input
                type={`${showPass ? "text" : "password"}`}
                id="password"
                placeholder="password"
                className="bg-white text-black"
                required
              />

              <div
                onClick={() => setShowPass(!showPass)}
                className="absolute right-2 top-2 text-sm text-black cursor-pointer"
              >
                {showPass ? "Hide" : "Show"}
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <input type="checkbox" />
              <span>Remember Me</span>
            </div>

            {/* OTP recipient selector — only relevant for admin/accountant.
                Normal users are unaffected (their login skips OTP entirely). */}
            {otpRecipients.length > 0 && (
              <div className="flex flex-col gap-1">
                <Label htmlFor="otp-recipient" className="text-white">
                  Send OTP to (for admin/accounts)
                </Label>
                <select
                  id="otp-recipient"
                  value={selectedRecipient}
                  onChange={(e) => setSelectedRecipient(e.target.value)}
                  className="bg-white text-black rounded-md h-10 px-3 text-sm"
                >
                  {otpRecipients.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            )}

            {error && (
              <div className="text-red-400 text-sm text-center">{error}</div>
            )}

            <Button type="submit" className="mt-2 bg-orange-500 hover:bg-orange-600">
              Sign in now
            </Button>

          </form>
          ) : (
          <form onSubmit={handleOtpSubmit} className="flex flex-col gap-4">

            {info && (
              <div className="text-green-300 text-sm text-center">{info}</div>
            )}

            <Label htmlFor="otp" className="text-white">
              One-Time Password (OTP)
            </Label>

            <Input
              type="text"
              id="otp"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              placeholder="Enter 6-digit OTP"
              className="bg-white text-black tracking-widest text-center"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              required
            />

            {error && (
              <div className="text-red-400 text-sm text-center">{error}</div>
            )}

            <Button type="submit" className="mt-2 bg-orange-500 hover:bg-orange-600">
              Verify &amp; Sign in
            </Button>

            <button
              type="button"
              onClick={() => {
                setOtpStep(false);
                setOtp("");
                setError("");
                setInfo("");
                setPendingCreds(null);
              }}
              className="text-sm text-gray-300 hover:text-white hover:underline mt-1"
            >
              Back to login
            </button>

          </form>
          )}

          <div className="text-center mt-3">
            <Link href="/auth/forgot-password" className="text-sm text-gray-300 hover:text-white hover:underline">
              Forgot your password?
            </Link>
          </div>

          <div className="relative flex items-center gap-2 my-6">
            <hr className="flex-1 border-gray-600" />
            <span className="text-sm">or</span>
            <hr className="flex-1 border-gray-600" />
          </div>

          <Button
            onClick={() => {
              const redirectParam = Array.isArray(forwardurl.redirect) ? forwardurl.redirect[0] : forwardurl.redirect;
              const urlParam = Array.isArray(forwardurl.url) ? forwardurl.url[0] : forwardurl.url;
              const callbackUrl = redirectParam || urlParam || '/account';
              signIn("google", { callbackUrl });
            }}
            className="w-full flex items-center justify-center gap-2 bg-white text-black hover:bg-gray-200"
          >
            <FaGoogle />
            Login with Google
          </Button>

          {error && error.includes('OAuthCallback') && (
            <div className="mt-3 p-3 bg-red-900/30 border border-red-700 rounded text-sm text-red-400">
              Google OAuth Error: Please check your Google Cloud Console configuration.
              See GOOGLE_OAUTH_SETUP.md for setup instructions.
            </div>
          )}

          <div className="text-center mt-6 text-sm">
            Don’t have an account?
            <Link href="/auth/register" className="ml-2 underline">
              Create One
            </Link>
          </div>

        </div>
      </div>
    </div>
  ) : (
    <Session />
  )}
</div>

        </React.Fragment>
    );
};

export default Login;