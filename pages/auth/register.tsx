"use client";

import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { signIn, useSession } from 'next-auth/react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import Head from 'next/head';
import Loader from '@/components/common/Loader/Loader';
import Session from '@/components/common/Session/Session';

interface RegisterFormData {
    name: string
    email: string
    phone: string
    password: string
}

const Register = () => {
    const router = useRouter();
    const forwardurl = router.query;

    const { data: session, status: sessionStatus } = useSession();
    const [error, setError] = useState("");

    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);

    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxChange = (checked: boolean) => {
        setIsChecked(checked);
    };

    useEffect(() => {
        if (sessionStatus === "authenticated") {
            if (forwardurl.url) {
                router.replace(`${forwardurl.url}`);
            } else {
                router.replace("/");
            }
        }
    }, [sessionStatus, router, forwardurl]);

    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<RegisterFormData>({});

    const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
        try {
            setLoading(true);

            const userData = {
                name: data.name,
                email: data.email,
                phone: data.phone,
                password: data.password,
                role: {
                    type: 'user',
                    position: '',
                },
                profile: "",
                courses: {
                    enrolled: [],
                    completed: []
                }
            };

            const userResponse = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (userResponse.ok) {
                const res = await signIn("credentials", {
                    redirect: false,
                    email: data.email,
                    password: data.password,
                });

                if (res?.error) {
                    setError("Registration successful, but login failed. Please try logging in manually.");
                    setLoading(false);
                    if (forwardurl.url) {
                        router.push(`${forwardurl.url}`);
                    } else {
                        router.push("/");
                    }
                } else {
                    setLoading(false);
                    if (forwardurl.url) {
                        router.push(`${forwardurl.url}`);
                    } else {
                        router.push("/");
                    }
                }
            } else {
                const errorData = await userResponse.json();
                setError(errorData.message || "Registration failed");
                setLoading(false);
            }
        } catch (error) {
            console.error('Error:', error);
            setError("An unexpected error occurred");
            setLoading(false);
        }
    };

    const LoginBtnClick = () => {
        router.push('/auth/login');
    };

    return (
        <React.Fragment>
            <Head>
                <link rel="icon" href="/favicon.ico" type="image/ico" sizes="70x70" />
                <title>Register | TechPratham</title>
                <meta name="description" content="Create your TechPratham account and get access to powerful tools and resources for learning, innovation, and growth." />
                <meta name="keywords" content="TechPratham Register, Sign Up TechPratham, Join TechPratham, Tech Learning Platform" />
                <meta name="author" content="TechPratham Team" />

                <meta property="og:title" content="Register | TechPratham" />
                <meta property="og:description" content="Join TechPratham to access personalized tech learning, projects, and innovation opportunities." />
                <meta property="og:image" content="/logo/og-techpratham.png" />
                <meta property="og:url" content="https://techpratham.in/auth/register/" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Register | TechPratham" />
                <meta name="twitter:description" content="Register now on TechPratham to unlock personalized tools and learning experiences for your tech journey." />
                <meta name="twitter:image" content="/logo/og-techpratham.png" />
            </Head>

            <div className="w-full fixed md:h-screen h-auto flex flex-col items-center justify-start md:overflow-hidden overflow-auto">

                {loading && <Loader />}

                {sessionStatus !== "authenticated" ? (
                    <div className="w-full flex-1 min-h-0 bg-white md:px-8 px-0 md:py-8 py-0">
                        <div className='bg-[#EDEBE9] w-full h-full flex flex-col items-center justify-center md:rounded-2xl rounded-none px-8 py-8 overflow-hidden'>
                            <div className="w-full flex flex-col row-start-2 items-center justify-center">

                                <form action='/' onSubmit={handleSubmit(onSubmit)} className='flex flex-col items-start lg:w-10/12 w-full h-auto'>

                                    {error && (
                                        <div className="w-full p-3 mb-4 text-sm text-red-500 bg-red-100 rounded">
                                            {error}
                                        </div>
                                    )}

                                    <div className='w-full flex md:flex-row flex-col items-start justify-center gap-8'>
                                        <div className='lg:w-8/12 md:w-10/12 w-full flex flex-col items-center justify-center'>

                                            {/* Personal Information */}
                                            <div className="w-full mb-6">
                                                <h4 className="text-lg font-medium mb-3">Personal Information</h4>
                                                <Separator className="mb-4 border md:border-gray-500 border-gray-700" />

                                                {/* Name Field */}
                                                <div className='flex flex-col w-full h-auto mb-4'>
                                                    <Label htmlFor="fullName" className='text-sm font-normal text-[#1a202c] mb-1'>
                                                        Full Name
                                                        <span className='text-red-500'> *</span>
                                                    </Label>
                                                    <Input
                                                        type="text"
                                                        id="fullName"
                                                        {...register("name", {
                                                            required: "Full name is required",
                                                            minLength: {
                                                                value: 2,
                                                                message: "Name must be at least 2 characters"
                                                            },
                                                            maxLength: {
                                                                value: 50,
                                                                message: "Name cannot exceed 50 characters"
                                                            }
                                                        })}
                                                        placeholder='Your Full Name'
                                                        className='w-full min-h-11 h-full indent-1 bg-white'
                                                    />
                                                    {errors.name && <span className="text-sm text-red-500 mt-1">{errors.name.message}</span>}
                                                </div>

                                                {/* Email Field */}
                                                <div className='flex flex-col w-full h-auto mb-4'>
                                                    <Label htmlFor="email" className='text-sm font-normal text-[#1a202c] mb-1'>
                                                        Email Address
                                                        <span className='text-red-500'> *</span>
                                                    </Label>
                                                    <Input
                                                        type="email"
                                                        id="email"
                                                        {...register("email", {
                                                            required: "Email is required",
                                                            pattern: {
                                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                                message: "Invalid email address"
                                                            }
                                                        })}
                                                        placeholder='Enter Your Email'
                                                        className='w-full min-h-11 h-full indent-1 bg-white'
                                                    />
                                                    {errors.email && <span className="text-sm text-red-500 mt-1">{errors.email.message}</span>}
                                                </div>

                                                {/* Phone Field */}
                                                <div className='flex flex-col w-full h-auto mb-4'>
                                                    <Label htmlFor="phone" className='text-sm font-normal text-[#1a202c] mb-1'>
                                                        Phone Number
                                                        <span className='text-red-500'> *</span>
                                                    </Label>
                                                    <Input
                                                        type="tel"
                                                        id="phone"
                                                        {...register("phone", {
                                                            required: "Phone number is required",
                                                            pattern: {
                                                                value: /^[0-9]{10}$/,
                                                                message: "Phone number must be 10 digits"
                                                            }
                                                        })}
                                                        placeholder='Enter Your Phone Number'
                                                        className='w-full min-h-11 h-full indent-1 bg-white'
                                                    />
                                                    {errors.phone && <span className="text-sm text-red-500 mt-1">{errors.phone.message}</span>}
                                                </div>

                                                {/* Password Field */}
                                                <div className='flex flex-col w-full h-auto mb-4'>
                                                    <Label htmlFor="password" className='text-sm font-normal text-[#1a202c] mb-1'>
                                                        Password
                                                        <span className='text-red-500'> *</span>
                                                    </Label>
                                                    <div className='w-full mt-1 h-11 relative'>
                                                        <Input
                                                            type={showPass ? 'text' : 'password'}
                                                            id="password"
                                                            {...register("password", {
                                                                required: "Password is required",
                                                                minLength: {
                                                                    value: 8,
                                                                    message: "Password must be at least 8 characters"
                                                                },
                                                                pattern: {
                                                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                                                                    message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
                                                                }
                                                            })}
                                                            placeholder='Enter Your Password'
                                                            className='w-full min-h-11 h-full indent-1 bg-white'
                                                        />
                                                        <div
                                                            onClick={() => setShowPass(!showPass)}
                                                            className='absolute inset-y-0 right-0 w-14 bg-[#efeff0] text-sm text-[#1d1d1d] font-medium flex items-center justify-center cursor-pointer m-1 rounded-r'
                                                        >
                                                            {showPass ? 'Hide' : 'Show'}
                                                        </div>
                                                    </div>
                                                    {errors.password && <span className="text-sm text-red-500 mt-1">{errors.password.message}</span>}
                                                </div>

                                                <div className="flex items-start space-x-2 mb-4">
                                                    <Checkbox
                                                        id="privacyPolicyAccepted"
                                                        checked={isChecked}
                                                        onCheckedChange={handleCheckboxChange}
                                                    />
                                                    <div className="flex flex-col">
                                                        <Label
                                                            htmlFor="privacyPolicyAccepted"
                                                            className="text-sm font-normal cursor-pointer"
                                                        >
                                                            I have read and agree to the{' '}
                                                            <Link href="/privacy-policy" className="text-blue-600 hover:underline">
                                                                Privacy Policy
                                                            </Link>
                                                            {' '}and{' '}
                                                            <Link href="/terms-of-service" className="text-blue-600 hover:underline">
                                                                Terms of Service
                                                            </Link>
                                                            {' '}of the TechPratham website.
                                                            <span className='text-red-500'> *</span>
                                                        </Label>
                                                    </div>
                                                </div>

                                                <Button 
                                                    type='submit' 
                                                    variant='default' 
                                                    className='w-full min-h-11 mt-2' 
                                                    disabled={!isChecked || loading}
                                                >
                                                    {loading ? 'Creating Account...' : 'Register'}
                                                </Button>

                                                <div className='w-full text-center mt-4 flex items-center justify-center'>
                                                    <p className='text-sm text-[#1a202c] flex flex-row gap-2'>
                                                        <span className='font-medium'>Already have an account?</span>
                                                        <Link href='/auth/login' className='font-bold hover:underline cursor-pointer'>Login</Link>
                                                    </p>
                                                </div>

                                            </div>
                                        </div>
                                    </div>

                                </form>
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

export default Register;