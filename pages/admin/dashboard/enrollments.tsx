import React, { useContext, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { UserContext } from '@/context/userContext';
import SignOut from '@/src/account/common/SignOut';
import AdminLoader from '@/src/account/common/AdminLoader';
import AdminSidebar from '@/src/account/common/AdminSidebar';
import AdminTopBar from '@/src/account/common/AdminTopBar';
import { Badge } from '@/components/ui/badge';
import { 
  EyeOpenIcon, 
  CheckIcon, 
  Cross2Icon,
  Pencil1Icon,
  PlusIcon 
} from '@radix-ui/react-icons';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

interface Enrollment {
  _id: string;
  name: string;
  email: string;
  phone: string;
  studentId: string;
  course_title: string;
  course_link: string;
  category: string;
  duration: string;
  level: string;
  totalAmount: number;
  advanceAmount: number;
  finalPayment: number;
  feeType: string;
  verifyPayment: boolean;
  courseCompletion: boolean;
  createdAt: string;
  dueDate: string;
}

const EnrollmentsDashboard = () => {
  const { authenticated, loading, isAdmin, setCurrentTab } = useContext(UserContext);

  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    feeType: '',
    totalAmount: 0,
    advanceAmount: 0,
    verifyPayment: false,
    courseCompletion: false,
    dueDate: ''
  });

  const fetchEnrollments = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/course/enrolled?all=true');
      const data = await res.json();
      
      if (res.ok) {
        setEnrollments(data);
      } else {
        throw new Error(data.message || 'Failed to fetch enrollments');
      }
    } catch (error) {
      console.error('Failed to fetch enrollments:', error);
      toast.error('Failed to fetch enrollments');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (authenticated) {
      fetchEnrollments();
      setCurrentTab("enrollments");
    }
  }, [authenticated]);

  const getStatusBadge = (enrollment: Enrollment) => {
    if (enrollment.courseCompletion) {
      return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">✅ Completed</Badge>;
    }
    if (enrollment.verifyPayment) {
      return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">💳 Payment Verified</Badge>;
    }
    return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">⏳ Pending</Badge>;
  };

  const getFeeTypeBadge = (feeType: string) => {
    const colors = {
      'Full Payment': 'bg-green-500/10 text-green-500 border-green-500/20',
      '2 Installments': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      '3 Installments': 'bg-purple-500/10 text-purple-500 border-purple-500/20'
    };
    
    return (
      <Badge className={colors[feeType as keyof typeof colors] || 'bg-gray-500/10 text-gray-500 border-gray-500/20'}>
        {feeType || 'Full Payment'}
      </Badge>
    );
  };

  const handleEditEnrollment = (enrollment: Enrollment) => {
    setSelectedEnrollment(enrollment);
    setEditForm({
      feeType: enrollment.feeType || 'Full Payment',
      totalAmount: enrollment.totalAmount || 0,
      advanceAmount: enrollment.advanceAmount || 0,
      verifyPayment: enrollment.verifyPayment || false,
      courseCompletion: enrollment.courseCompletion || false,
      dueDate: enrollment.dueDate || ''
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateEnrollment = async () => {
    if (!selectedEnrollment) return;

    try {
      const res = await fetch('/api/course/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enrollmentId: selectedEnrollment._id,
          ...editForm
        })
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('Enrollment updated successfully');
        setIsEditDialogOpen(false);
        setSelectedEnrollment(null);
        fetchEnrollments();
      } else {
        throw new Error(data.message || 'Failed to update enrollment');
      }
    } catch (error) {
      console.error('Error updating enrollment:', error);
      toast.error('Failed to update enrollment');
    }
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  return (
    <React.Fragment>
      <Head>
        <title>Enrollments | Admin Dashboard</title>
      </Head>

      {loading ? (
        <AdminLoader />
      ) : (!authenticated || !isAdmin) ? (
        <SignOut />
      ) : (
        <div className='w-full h-full md:h-screen min-h-screen flex flex-row items-start justify-start fixed'>
          <AdminSidebar />
          <div className='bg-[#000] flex flex-col w-full h-full md:relative fixed'>
            <AdminTopBar />

            <div className="bg-black p-6 overflow-y-auto">
              <div className='w-full h-auto flex flex-row items-start justify-between mb-8'>
                <h2 className="text-2xl font-bold text-white">Enrollment Management</h2>
                
                <div className="flex gap-4 items-center">
                  <div className="text-sm text-zinc-400">
                    Total Enrollments: {enrollments.length}
                  </div>
                </div>
              </div>

              {isLoading ? (
                <div className="min-h-screen flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                </div>
              ) : (
                <div className="bg-zinc-900 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-zinc-800">
                        <tr>
                          <th className="text-left p-4 text-white font-medium">Student</th>
                          <th className="text-left p-4 text-white font-medium">Course</th>
                          <th className="text-left p-4 text-white font-medium">Fee Details</th>
                          <th className="text-left p-4 text-white font-medium">Status</th>
                          <th className="text-left p-4 text-white font-medium">Joined Date</th>
                          <th className="text-left p-4 text-white font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {enrollments.map((enrollment) => (
                          <tr key={enrollment._id} className="border-b border-zinc-800 hover:bg-zinc-800/50">
                            <td className="p-4">
                              <div className="text-white font-medium">{enrollment.name}</div>
                              <div className="text-zinc-400 text-sm">{enrollment.email}</div>
                              <div className="text-zinc-500 text-xs">
                                ID: {enrollment.studentId || 'Auto-generating...'}
                              </div>
                              <div className="text-zinc-500 text-xs">
                                📞 {enrollment.phone}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="text-white">{enrollment.course_title?.replace(/<[^>]*>/g, '') || 'N/A'}</div>
                              <Badge variant="secondary" className="mt-1 text-xs">
                                {enrollment.category}
                              </Badge>
                              <div className="text-zinc-400 text-xs mt-1">
                                {enrollment.duration} • {enrollment.level}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="text-white font-medium">{formatCurrency(enrollment.totalAmount)}</div>
                              <div className="text-green-400 text-sm">
                                Advance: {formatCurrency(enrollment.advanceAmount)}
                              </div>
                              <div className="text-yellow-400 text-sm">
                                Balance: {formatCurrency(enrollment.totalAmount - enrollment.advanceAmount)}
                              </div>
                              <div className="mt-1">
                                {getFeeTypeBadge(enrollment.feeType)}
                              </div>
                            </td>
                            <td className="p-4">
                              {getStatusBadge(enrollment)}
                              {enrollment.dueDate && (
                                <div className="text-yellow-400 text-xs mt-1">
                                  Due: {formatDate(enrollment.dueDate)}
                                </div>
                              )}
                            </td>
                            <td className="p-4 text-zinc-400 text-sm">
                              <div>{formatDate(enrollment.createdAt)}</div>
                            </td>
                            <td className="p-4">
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                                  onClick={() => handleEditEnrollment(enrollment)}
                                >
                                  <Pencil1Icon className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {enrollments.length === 0 && (
                    <div className="text-center py-12 text-zinc-500">
                      No enrollments found.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Enrollment Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-black border-zinc-800 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Enrollment</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Update enrollment details and payment status.
            </DialogDescription>
          </DialogHeader>
          
          {selectedEnrollment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Student Name</Label>
                  <div className="text-white font-medium">{selectedEnrollment.name}</div>
                </div>
                <div>
                  <Label>Course</Label>
                  <div className="text-white">{selectedEnrollment.course_title?.replace(/<[^>]*>/g, '') || 'N/A'}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fee-type">Fee Type</Label>
                  <Select value={editForm.feeType} onValueChange={(value) => setEditForm({...editForm, feeType: value})}>
                    <SelectTrigger className="bg-zinc-900 border-zinc-700 text-white">
                      <SelectValue placeholder="Select fee type" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-700">
                      <SelectItem value="Full Payment">Full Payment</SelectItem>
                      <SelectItem value="2 Installments">2 Installments</SelectItem>
                      <SelectItem value="3 Installments">3 Installments</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="total-amount">Total Amount (₹)</Label>
                  <Input
                    id="total-amount"
                    type="number"
                    min="0"
                    value={editForm.totalAmount}
                    onChange={(e) => setEditForm({...editForm, totalAmount: parseFloat(e.target.value) || 0})}
                    className="bg-zinc-900 border-zinc-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="advance-amount">Advance Amount (₹)</Label>
                  <Input
                    id="advance-amount"
                    type="number"
                    min="0"
                    value={editForm.advanceAmount}
                    onChange={(e) => setEditForm({...editForm, advanceAmount: parseFloat(e.target.value) || 0})}
                    className="bg-zinc-900 border-zinc-700 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="due-date">Due Date</Label>
                  <Input
                    id="due-date"
                    type="date"
                    value={editForm.dueDate}
                    onChange={(e) => setEditForm({...editForm, dueDate: e.target.value})}
                    className="bg-zinc-900 border-zinc-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="verify-payment"
                    checked={editForm.verifyPayment}
                    onChange={(e) => setEditForm({...editForm, verifyPayment: e.target.checked})}
                    className="rounded"
                  />
                  <Label htmlFor="verify-payment">Payment Verified</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="course-completion"
                    checked={editForm.courseCompletion}
                    onChange={(e) => setEditForm({...editForm, courseCompletion: e.target.checked})}
                    className="rounded"
                  />
                  <Label htmlFor="course-completion">Course Completed</Label>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="manual" onClick={handleUpdateEnrollment}>
              Update Enrollment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

export default EnrollmentsDashboard;