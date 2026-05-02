import React, { useContext, useState } from 'react';
import { Button } from '@/components/ui/button';
import { UserContext } from '@/context/userContext';
import SignOut from '@/src/account/common/SignOut';
import AdminLoader from '@/src/account/common/AdminLoader';
import AdminSidebar from '@/src/account/common/AdminSidebar';
import AdminTopBar from '@/src/account/common/AdminTopBar';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import Head from 'next/head';
import Link from 'next/link';

const SetupPasswords = () => {
  const { authenticated, loading, isAdmin, setCurrentTab } = useContext(UserContext);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    adminKey: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  React.useEffect(() => {
    if (authenticated && isAdmin) {
      setCurrentTab("users");
    }
  }, [authenticated, isAdmin]);

  const handleSetPassword = async () => {
    if (!formData.email.trim() || !formData.password.trim() || !formData.adminKey.trim()) {
      toast.error('All fields are required');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setIsUpdating(true);
    try {
      const res = await fetch('/api/users/set-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
          adminKey: formData.adminKey
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(data.message);
        setFormData({
          email: '',
          password: '',
          confirmPassword: '',
          adminKey: ''
        });
      } else {
        toast.error(data.error || 'Failed to set password');
      }
    } catch (error) {
      console.error('Error setting password:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <React.Fragment>
      <Head>
        <title>Setup User Passwords | Admin Dashboard</title>
      </Head>

      {loading ? (
        <AdminLoader />
      ) : (!authenticated || !isAdmin) ? (
        <SignOut />
      ) : (
        <div className='w-full h-full md:h-screen min-h-screen flex flex-row items-start justify-start'>
          <AdminSidebar />
          <div className='bg-[#000] flex flex-col w-full h-full overflow-hidden'>
            <AdminTopBar />

            <div className="bg-black p-6 overflow-y-auto h-full flex-1">
              <div className='w-full h-auto flex flex-row items-start justify-between mb-8'>
                <div className="flex items-center gap-4">
                  <Link href="/admin/dashboard">
                    <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Dashboard
                    </Button>
                  </Link>
                  <h2 className="text-2xl font-bold text-white">Setup User Passwords</h2>
                </div>
              </div>

              <div className="max-w-2xl">
                <div className="bg-zinc-900 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-6">Set Password for Invoice Access</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="email" className="text-white">User Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="bg-zinc-800 border-zinc-700 text-white"
                        placeholder="Enter user email"
                      />
                    </div>

                    <div>
                      <Label htmlFor="password" className="text-white">Password *</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                          className="bg-zinc-800 border-zinc-700 text-white pr-10"
                          placeholder="Enter password (min 6 characters)"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 text-zinc-400 hover:text-white"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="confirmPassword" className="text-white">Confirm Password *</Label>
                      <Input
                        id="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="bg-zinc-800 border-zinc-700 text-white"
                        placeholder="Confirm password"
                      />
                    </div>

                    <div>
                      <Label htmlFor="adminKey" className="text-white">Admin Key *</Label>
                      <Input
                        id="adminKey"
                        type="password"
                        value={formData.adminKey}
                        onChange={(e) => setFormData(prev => ({ ...prev, adminKey: e.target.value }))}
                        className="bg-zinc-800 border-zinc-700 text-white"
                        placeholder="Enter admin key"
                      />
                      <div className="text-xs text-zinc-500 mt-1">
                        Use: admin123 (for testing purposes)
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button
                        onClick={handleSetPassword}
                        disabled={isUpdating}
                        variant="manual"
                        className="w-full"
                      >
                        {isUpdating ? 'Setting Password...' : 'Set Password'}
                      </Button>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-zinc-800 rounded-lg">
                    <h4 className="text-sm font-medium text-white mb-2">Important Notes:</h4>
                    <div className="text-xs text-zinc-400 space-y-1">
                      <div>• Only users with accountant or admin roles can access invoices</div>
                      <div>• Passwords are required for secure invoice viewing</div>
                      <div>• Users must authenticate each time they want to view invoices</div>
                      <div>• Access sessions expire after 30 minutes of inactivity</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default SetupPasswords;