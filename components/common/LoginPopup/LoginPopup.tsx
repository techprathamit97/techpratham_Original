"use client";

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FaGoogle } from 'react-icons/fa';
import { X } from 'lucide-react';
import PhoneInput from '../PhoneInput/PhoneInput';

interface LoginPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginPopup: React.FC<LoginPopupProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Login state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Signup state
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [isPhoneValid, setIsPhoneValid] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await signIn('credentials', {
      redirect: false,
      email: loginData.email,
      password: loginData.password,
    });

    if (res?.error) {
      setError('Invalid email or password');
      setLoading(false);
    } else {
      setLoading(false);
      onClose();
      router.push('/account');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent submission if phone is invalid
    if (!isPhoneValid) {
      return;
    }
    
    setError('');
    setLoading(true);

    try {
      const userData = {
        name: signupData.name,
        email: signupData.email,
        phone: signupData.phone,
        password: signupData.password,
        role: {
          type: 'user',
          position: '',
        },
        profile: '',
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
        const res = await signIn('credentials', {
          redirect: false,
          email: signupData.email,
          password: signupData.password,
        });

        if (res?.error) {
          setError('Registration successful, but login failed. Please try logging in manually.');
          setLoading(false);
        } else {
          setLoading(false);
          onClose();
          router.push('/account');
        }
      } else {
        const errorData = await userResponse.json();
        setError(errorData.message || 'Registration failed');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    signIn('google');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-red-900 border-gray-700 text-white max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">Welcome to TechPratham</DialogTitle>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {/* <X className="h-5 w-5" /> */}
            </button>
          </div>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800">
            <TabsTrigger value="login" className="data-[state=active]:bg-gray-700">
              Login
            </TabsTrigger>
            <TabsTrigger value="signup" className="data-[state=active]:bg-gray-700">
              Sign Up
            </TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login" className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="login-email" className="text-white">
                  Email Address
                </Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="your@email.com"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="login-password" className="text-white">
                  Password
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 hover:text-white"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-red-400 text-sm text-center bg-red-900/30 p-2 rounded">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="relative flex items-center gap-2 my-4">
              <hr className="flex-1 border-gray-700" />
              <span className="text-sm text-gray-400">or</span>
              <hr className="flex-1 border-gray-700" />
            </div>

            <Button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-2 bg-white text-black hover:bg-gray-200"
            >
              <FaGoogle className="text-red-500" />
              Continue with Google
            </Button>
          </TabsContent>

          {/* Signup Tab */}
          <TabsContent value="signup" className="space-y-4">
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <Label htmlFor="signup-name" className="text-white">
                  Full Name
                </Label>
                <Input
                  id="signup-name"
                  type="text"
                  placeholder="Your full name"
                  value={signupData.name}
                  onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="signup-email" className="text-white">
                  Email Address
                </Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="your@email.com"
                  value={signupData.email}
                  onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="signup-phone" className="text-white">
                  Phone Number
                </Label>
                <PhoneInput
                  value={signupData.phone}
                  onChange={(phone) => setSignupData({ ...signupData, phone })}
                  onValidationChange={setIsPhoneValid}
                  placeholder="Phone Number"
                  required
                  size="md"
                />
              </div>

              <div>
                <Label htmlFor="signup-password" className="text-white">
                  Password
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="signup-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 hover:text-white"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-red-400 text-sm text-center bg-red-900/30 p-2 rounded">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600"
                disabled={loading || !isPhoneValid}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            <div className="relative flex items-center gap-2 my-4">
              <hr className="flex-1 border-gray-700" />
              <span className="text-sm text-gray-400">or</span>
              <hr className="flex-1 border-gray-700" />
            </div>

            <Button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-2 bg-white text-black hover:bg-gray-200"
            >
              <FaGoogle className="text-red-500" />
              Sign up with Google
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default LoginPopup;
