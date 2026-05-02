"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import Head from 'next/head';
import { Mail, ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        setEmail('');
      } else {
        setError(data.error || 'Failed to send reset email');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
      <Head>
        <title>Forgot Password | TechPratham</title>
      </Head>

      <div
        className="w-full min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: "url('/home/banner/login3.jpeg')" }}
      >
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="w-full max-w-md relative z-10 px-6">
          <div className="bg-black/20 backdrop-blur-md p-8 rounded-xl">
            <div className="flex items-center gap-3 mb-6">
              <Mail className="h-8 w-8 text-white" />
              <h2 className="text-3xl font-semibold text-white">Forgot Password</h2>
            </div>

            <p className="text-gray-300 text-sm mb-6">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            {message && (
              <div className="mb-4 p-3 bg-green-900/30 border border-green-700 rounded text-green-400 text-sm">
                {message}
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-white">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white text-black mt-2"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/auth/login"
                className="text-white hover:underline flex items-center justify-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ForgotPassword;
