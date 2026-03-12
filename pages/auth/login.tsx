// "use client";

// import React, { useEffect, useState } from "react";
// import { signIn, useSession } from "next-auth/react";
// import { useRouter } from "next/router";

// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { FaGoogle } from "react-icons/fa";
// import Head from "next/head";
// import { LinkedInLogoIcon } from "@radix-ui/react-icons";
// import Loader from "@/components/common/Loader/Loader";
// import Link from "next/link";
// import Session from "@/components/common/Session/Session";

// const Login = () => {
//     const router = useRouter();
//     const forwardurl = router.query;

//     const { data: session, status: sessionStatus } = useSession();
//     const [error, setError] = useState("");

//     const [showPass, setShowPass] = useState(false);

//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         if (sessionStatus === "authenticated") {
//             if (forwardurl.url) {
//                 router.replace(`${forwardurl.url}`);
//             } else {
//                 router.replace("/");
//             }
//         }
//     }, [sessionStatus, router]);

//     const isValidEmail = (email: string) => {
//         const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
//         return emailRegex.test(email);
//     };

//     const handleSubmit = async (e: any) => {
//         e.preventDefault();
//         setError("");

//         const email = e.target[0].value;
//         const password = e.target[1].value;

//         if (!isValidEmail(email)) {
//             console.error("Please enter a valid email address.");
//             setError("Email is invalid");
//             return;
//         }

//         if (!password || password.length < 8) {
//             console.error("Password is invalid.");
//             setError("Password is invalid");
//             return;
//         }

//         setLoading(true);
//         const res = await signIn("credentials", {
//             redirect: false,
//             email,
//             password,
//         });

//         if (res?.error === "not-registered") {
//             console.error("You’ve to register first.");
//         } else if (res?.error) {
//             console.error(res?.error);
//             setError("Invalid email or password");
//             setLoading(false);
//             if (res?.url) router.replace("/");
//         } else {
//             setLoading(false);
//             if (forwardurl.url) {
//                 router.push(`${forwardurl.url}`);
//             }
//             setError("");
//         }
//     };

//     return (
//         <React.Fragment>
//             <Head>
//                 <link rel="icon" href="/favicon.ico" type="image/ico" sizes="70x70" />
//                 <title>Login | TechPratham</title>
//                 <meta name="description" content="Log in to your TechPratham account or register to join our tech community. Stay updated with the latest news, events, and opportunities." />
//                 <meta name="keywords" content="TechPratham Login, TechPratham Register, Tech Community, Login, Register, TechPratham" />
//                 <meta name="author" content="TechPratham" />

//                 <meta property="og:title" content="Login | TechPratham" />
//                 <meta property="og:description" content="Access your TechPratham account or become a registered member. Connect, collaborate, and grow with the TechPratham community." />
//                 <meta property="og:image" content="/logo/og-techpratham.png" />
//                 <meta property="og:url" content="https://techpratham.com/auth/login/" />

//                 <meta name="twitter:card" content="summary_large_image" />
//                 <meta name="twitter:title" content="Login | TechPratham" />
//                 <meta name="twitter:description" content="Login or register with TechPratham to stay engaged with your peers and be part of our vibrant tech community." />
//                 <meta name="twitter:image" content="/logo/og-techpratham.png" />
//             </Head>

//             <div className="w-full bg-red-900 md:fixed relative md:h-screen h-auto flex flex-col items-center justify-start md:overflow-hidden overflow-auto">

//                 {loading && <Loader />}

//                 {sessionStatus !== "authenticated" ? (
//                     <div className="w-full flex-1 min-h-0 bg-red-800 md:px-8 px-0 md:py-8 py-0">
//                         <div className='  w-full h-full flex flex-col items-center justify-center md:rounded-2xl rounded-none px-8 py-8 overflow-hidden'>
//                             <main className="w-full  flex flex-col row-start-2 items-center justify-center">

//                                 <div className='md:w-[600px] p-2 border-2  rounded-lg w-full h-full flex flex-col justify-between'>
//                                     <div className='w-full text-center mb-14 flex flex-col'>
//                                         <p className=' text-white md:text-3xl text-2xl font-semibold'>Enter your credentials</p>
//                                     </div>

//                                     <form onSubmit={handleSubmit} className=' flex flex-col justify-center'>
//                                         <Label htmlFor="email" className=' text-sm font-normal text-white'>
//                                             Your email address
//                                             <span className=' text-red-500'> *</span>
//                                         </Label>
//                                         <Input type="email" id="email" placeholder='variant@provider.com' className='mt-1 mb-4 placeholder:font-normal w-full md:h-10 h-11 indent-1 bg-white' required />

//                                         <Label htmlFor="password" className=' text-sm font-normal text-white'>
//                                             Password
//                                             <span className=' text-red-500'> *</span>
//                                         </Label>
//                                         <div className='mt-1 relative'>
//                                             <Input type={`${showPass ? 'text' : 'password'}`} id="password" placeholder='password' className=" placeholder:font-normal w-full md:h-10 h-11 indent-1 bg-white" required />
//                                             <div onClick={() => setShowPass(!showPass)} className='absolute inset-y-0 right-0 w-14 bg-[#efeff0] text-sm text-[#1d1d1d] font-medium flex items-center justify-center cursor-pointer m-1 rounded-r'>{showPass ? 'Hide' : 'Show'}</div>
//                                         </div>
//                                         {error && (
//                                             <div className="mt-2 text-sm text-red-500 text-center">
//                                                 {error}
//                                             </div>
//                                         )}

//                                         <Button type='submit' variant='default' className="mt-10 md:h-10 h-11 cursor-pointer">Log in</Button>

//                                     </form>

//                                     <div className='relative w-full h-auto flex flex-row justify-center items-center capitalize gap-2 my-4'>
//                                         <hr className='w-full border-[#0000004d] h-[1px]' />
//                                         <span className=' min-w-20 px-2 text-center'> or just</span>
//                                         <hr className='w-full border-[#0000004d] h-[1px]' />
//                                     </div>

//                                     <Button variant='default' onClick={() => { signIn("google"); }} className="w-full md:h-10 h-11 px-4 flex flex-row items-center justify-center gap-2 cursor-pointer">
//                                         <FaGoogle className="text-lg" />
//                                         Login with Google
//                                     </Button>

//                                     <div className='w-full text-center mt-4 flex items-center justify-center'>
//                                         <p className=' text-sm text-white flex flex-row gap-2'>
//                                             <span className='font-medium'>Don't have an account!?</span>
//                                             <Link href={'/auth/register'} className='font-bold hover:underline cursor-pointer'>Create One</Link>
//                                         </p>
//                                     </div>

//                                 </div>

//                             </main>
//                         </div>
//                     </div>
//                 ) : (
//                     <Session />
//                 )}
//             </div>

//         </React.Fragment>
//     );
// };

// export default Login;


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
            if (forwardurl.url) {
                router.replace(`${forwardurl.url}`);
            } else {
                router.replace("/");
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
            if (forwardurl.url) {
                router.push(`${forwardurl.url}`);
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

          <p className="text-center text-sm mt-3 opacity-80 cursor-pointer">
            Lost your password?
          </p>

          <div className="relative flex items-center gap-2 my-6">
            <hr className="flex-1 border-gray-600" />
            <span className="text-sm">or</span>
            <hr className="flex-1 border-gray-600" />
          </div>

          <Button
            onClick={() => signIn("google")}
            className="w-full flex items-center justify-center gap-2 bg-white text-black hover:bg-gray-200"
          >
            <FaGoogle />
            Login with Google
          </Button>

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