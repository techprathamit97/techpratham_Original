"use client";

import React, { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Head from "next/head";
import Loader from "@/components/common/Loader/Loader";

/**
 * Secure admin / accountant login portal (/super-user).
 *
 * Flow:
 *   1. Enter email + password.
 *   2. Server verifies credentials AND role. Only `admin`/`accountant` are
 *      allowed here — any other account is rejected. An OTP is emailed to the
 *      selected recipient.
 *   3. Enter the OTP. On success the server returns a one-time `proof`.
 *   4. That proof is passed to NextAuth signIn. authorize() REQUIRES the proof
 *      for staff, so OTP cannot be bypassed from any other page.
 */
const SuperUserLogin = () => {
  const router = useRouter();
  const { status: sessionStatus } = useSession();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState("");
  const [pendingCreds, setPendingCreds] = useState<{ email: string; password: string } | null>(null);

  const [showPass, setShowPass] = useState(false);

  const [otpRecipients, setOtpRecipients] = useState<string[]>([]);
  const [selectedRecipient, setSelectedRecipient] = useState("");

  // Redirect if already authenticated.
  useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.replace("/account");
    }
  }, [sessionStatus, router]);

  // Load the allowed OTP recipient list.
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

  const isValidEmail = (email: string) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email);

  const handleCredentialsSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    setInfo("");

    const email = e.target[0].value?.trim();
    const password = e.target[1].value;

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password || password.length < 8) {
      setError("Password is invalid.");
      return;
    }

    setLoading(true);
    try {
      const resp = await fetch("/api/auth/login-otp/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, recipient: selectedRecipient }),
      });
      const data = await resp.json();

      if (!resp.ok) {
        // 403 for non-staff, 401 for bad credentials.
        setError(data?.message || "Invalid email or password.");
        setLoading(false);
        return;
      }

      // Staff verified → OTP sent.
      setPendingCreds({ email, password });
      setOtpStep(true);
      setInfo(`An OTP has been sent to ${data.sentTo || "the selected email"}. Enter it to continue.`);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    if (!pendingCreds) {
      setError("Session expired. Please start again.");
      setOtpStep(false);
      return;
    }
    if (!otp || otp.trim().length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    setLoading(true);
    try {
      // 1) Verify OTP → get one-time proof.
      const resp = await fetch("/api/auth/login-otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: pendingCreds.email, otp: otp.trim() }),
      });
      const data = await resp.json();

      if (!resp.ok || !data.verified || !data.proof) {
        setError(data?.message || "Incorrect OTP.");
        setLoading(false);
        return;
      }

      // 2) Sign in with the proof — authorize() requires it for staff.
      const res = await signIn("credentials", {
        redirect: false,
        email: pendingCreds.email,
        password: pendingCreds.password,
        otpProof: data.proof,
      });

      if (res?.error) {
        setError("Login failed. Please try again.");
        setLoading(false);
        return;
      }

      setLoading(false);
      router.push("/account");
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
        <title>Admin Login | TechPratham</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div
        className="w-full min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: "url('/home/banner/login3.jpeg')" }}
      >
        <div className="absolute inset-0 bg-black/50"></div>

        {loading && <Loader />}

        {sessionStatus !== "authenticated" && (
          <div className="w-full max-w-md relative z-10 px-6">
            <div className="w-full bg-black/30 backdrop-blur-md p-8 rounded-xl text-white">
              <h2 className="text-3xl font-semibold mb-2 text-center">Admin Portal</h2>
              <p className="text-center text-sm text-gray-300 mb-6">
                Restricted access — admin &amp; accounts only.
              </p>

              {!otpStep ? (
                <form onSubmit={handleCredentialsSubmit} className="flex flex-col gap-4">
                  <Label htmlFor="email" className="text-white">Email Address</Label>
                  <Input type="email" id="email" placeholder="admin@techpratham.com" className="bg-white text-black" required />

                  <Label htmlFor="password" className="text-white">Password</Label>
                  <div className="relative">
                    <Input
                      type={showPass ? "text" : "password"}
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

                  {otpRecipients.length > 0 && (
                    <div className="flex flex-col gap-1">
                      <Label htmlFor="otp-recipient" className="text-white">Send OTP to</Label>
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

                  {error && <div className="text-red-400 text-sm text-center">{error}</div>}

                  <Button type="submit" className="mt-2 bg-orange-500 hover:bg-orange-600">
                    Continue
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleOtpSubmit} className="flex flex-col gap-4">
                  {info && <div className="text-green-300 text-sm text-center">{info}</div>}

                  <Label htmlFor="otp" className="text-white">One-Time Password (OTP)</Label>
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

                  {error && <div className="text-red-400 text-sm text-center">{error}</div>}

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
                    Back
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default SuperUserLogin;
