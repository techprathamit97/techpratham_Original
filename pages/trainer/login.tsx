import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Briefcase, Lock, User } from 'lucide-react';
import { toast } from 'sonner';

const TrainerLogin = () => {
  const router = useRouter();
  const [trainerId, setTrainerId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!trainerId || !password) {
      toast.error('Please enter both Login ID and password');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/trainer-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trainerId, password })
      });

      const data = await res.json();

      if (res.ok) {
        // Store trainer data in session storage
        sessionStorage.setItem('trainerAuth', JSON.stringify(data.trainer));
        toast.success('Login successful!');
        router.push('/trainer/dashboard');
      } else {
        toast.error(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center">
              <Briefcase className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-white">Trainer Portal</CardTitle>
          <p className="text-gray-400 mt-2">Login to manage your batches</p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label className="text-white">Login ID</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  value={trainerId}
                  onChange={(e) => setTrainerId(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white pl-10"
                  placeholder="Enter your Login ID"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <Label className="text-white">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white pl-10"
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-gray-400 text-sm">
              Forgot your password?{' '}
              <a href="#" className="text-green-400 hover:text-green-300">
                Contact Support
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainerLogin;
