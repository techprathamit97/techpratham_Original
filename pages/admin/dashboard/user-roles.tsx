import React, { useContext, useState } from 'react';
import { Button } from '@/components/ui/button';
import { UserContext } from '@/context/userContext';
import SignOut from '@/src/account/common/SignOut';
import AdminLoader from '@/src/account/common/AdminLoader';
import AdminSidebar from '@/src/account/common/AdminSidebar';
import AdminTopBar from '@/src/account/common/AdminTopBar';
import { ArrowLeftIcon } from '@radix-ui/react-icons';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import Head from 'next/head';
import Link from 'next/link';

const UserRoleManagement = () => {
  const { authenticated, loading, isAdmin, setCurrentTab } = useContext(UserContext);

  const [email, setEmail] = useState('');
  const [roleType, setRoleType] = useState('user');
  const [position, setPosition] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  React.useEffect(() => {
    if (authenticated && isAdmin) {
      setCurrentTab("users");
    }
  }, [authenticated, isAdmin]);

  const handleUpdateRole = async () => {
    if (!email.trim()) {
      toast.error('Email is required');
      return;
    }

    setIsUpdating(true);
    try {
      const res = await fetch('/api/users/update-role', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          roleType,
          position: position.trim()
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(data.message);
        setEmail('');
        setRoleType('user');
        setPosition('');
      } else {
        toast.error(data.error || 'Failed to update user role');
      }
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <React.Fragment>
      <Head>
        <title>User Role Management | Admin Dashboard</title>
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
                      <ArrowLeftIcon className="w-4 h-4 mr-2" />
                      Back to Dashboard
                    </Button>
                  </Link>
                  <h2 className="text-2xl font-bold text-white">User Role Management</h2>
                </div>
              </div>

              <div className="max-w-2xl">
                <div className="bg-zinc-900 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-6">Update User Role</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="email" className="text-white">User Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-zinc-800 border-zinc-700 text-white"
                        placeholder="Enter user email"
                      />
                    </div>

                    <div>
                      <Label htmlFor="role" className="text-white">Role Type *</Label>
                      <Select value={roleType} onValueChange={setRoleType}>
                        <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                          <SelectValue placeholder="Select role type" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-700">
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="accountant">Accountant</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="position" className="text-white">Position (Optional)</Label>
                      <Input
                        id="position"
                        type="text"
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                        className="bg-zinc-800 border-zinc-700 text-white"
                        placeholder="e.g., Senior Accountant, Finance Manager"
                      />
                    </div>

                    <div className="pt-4">
                      <Button
                        onClick={handleUpdateRole}
                        disabled={isUpdating}
                        variant="manual"
                        className="w-full"
                      >
                        {isUpdating ? 'Updating Role...' : 'Update User Role'}
                      </Button>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-zinc-800 rounded-lg">
                    <h4 className="text-sm font-medium text-white mb-2">Role Permissions:</h4>
                    <div className="text-xs text-zinc-400 space-y-1">
                      <div><strong>User:</strong> Basic access to user dashboard</div>
                      <div><strong>Accountant:</strong> Can create, edit, and manage invoices</div>
                      <div><strong>Admin:</strong> Full access to all features</div>
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

export default UserRoleManagement;