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
        const res = await signIn("credentials", {
            redirect: false,
            email,
            password,
        });

        if (res?.error === "not-registered") {
            console.error("You’ve to register first.");
        } else if (res?.error) {
            console.error(res?.error);
            setError("Invalid email or password");
            setLoading(false);
            if (res?.url) router.replace("/");
        } else {
            setLoading(false);
            const redirectParam = Array.isArray(forwardurl.redirect) ? forwardurl.redirect[0] : forwardurl.redirect;
            const urlParam = Array.isArray(forwardurl.url) ? forwardurl.url[0] : forwardurl.url;
            
            if (redirectParam) {
                router.push(redirectParam);
            } else if (urlParam) {
                router.push(urlParam);
            } else {
                router.push("/account"); // Changed from default to "/account" for role-based redirect
            }
            setError("");
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

          <h2 className="text-3xl font-semibold mb-8 text-center">Sign in</h2>

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

            {error && (
              <div className="text-red-400 text-sm text-center">{error}</div>
            )}

            <Button type="submit" className="mt-2 bg-orange-500 hover:bg-orange-600">
              Sign in now
            </Button>

          </form>

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