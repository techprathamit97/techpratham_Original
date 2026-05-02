import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { UserContext } from '@/context/userContext';
import SignOut from '@/src/account/common/SignOut';
import AdminLoader from '@/src/account/common/AdminLoader';
import AdminSidebar from '@/src/account/common/AdminSidebar';
import AdminTopBar from '@/src/account/common/AdminTopBar';
import { ArrowLeftIcon, PlusIcon, TrashIcon } from '@radix-ui/react-icons';
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

interface Enrollment {
  _id: string;
  name: string;
  email: string;
  phone: string;
  studentId: string;
  course_title: string;
  totalAmount: number;
  advanceAmount: number;
  feeType: string;
  installmentDates: Array<{
    installmentNumber: number;
    dueDate: string;
    amount: number;
  }>;
}

const EnrollmentEditor = () => {
  const router = useRouter();
  const { enrollmentId } = router.query;
  const { authenticated, loading, isAdmin, setCurrentTab } = useContext(UserContext);

  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    feeType: 'Full Payment',
    totalAmount: 0,
    advanceAmount: 0,
    installmentDates: [] as Array<{
      installmentNumber: number;
      dueDate: string;
      amount: number;
    }>
  });

  const fetchEnrollment = async () => {
    if (!enrollmentId) return;
    
    setIsLoading(true);
    try {
      const res = await fetch(`/api/course/enrolled?id=${enrollmentId}`);
      const data = await res.json();
      
      if (res.ok && data.length > 0) {
        const enrollmentData = data[0];
        setEnrollment(enrollmentData);
        setFormData({
          feeType: enrollmentData.feeType || 'Full Payment',
          totalAmount: enrollmentData.totalAmount || 0,
          advanceAmount: enrollmentData.advanceAmount || 0,
          installmentDates: enrollmentData.installmentDates || []
        });
      } else {
        throw new Error('Enrollment not found');
      }
    } catch (error) {
      console.error('Failed to fetch enrollment:', error);
      toast.error('Failed to fetch enrollment');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (authenticated && enrollmentId) {
      fetchEnrollment();
      setCurrentTab("enrollments");
    }
  }, [authenticated, enrollmentId]);

  const handleFeeTypeChange = (feeType: string) => {
    setFormData(prev => {
      const updatedData = { ...prev, feeType };
      
      // Auto-generate installment dates based on fee type
      if (feeType !== 'Full Payment') {
        const installmentCount = parseInt(feeType.split(' ')[0]);
        const amountPerInstallment = Math.round(prev.totalAmount / installmentCount);
        
        const installments = [];
        for (let i = 1; i <= installmentCount; i++) {
          const dueDate = new Date();
          dueDate.setMonth(dueDate.getMonth() + i);
          
          installments.push({
            installmentNumber: i,
            dueDate: dueDate.toISOString().split('T')[0],
            amount: i === installmentCount 
              ? prev.totalAmount - (amountPerInstallment * (installmentCount - 1)) // Last installment gets remainder
              : amountPerInstallment
          });
        }
        
        updatedData.installmentDates = installments;
      } else {
        updatedData.installmentDates = [];
      }
      
      return updatedData;
    });
  };

  const updateInstallment = (index: number, field: string, value: string | number) => {
    const updatedInstallments = [...formData.installmentDates];
    updatedInstallments[index] = {
      ...updatedInstallments[index],
      [field]: field === 'amount' ? Number(value) : value
    };
    setFormData(prev => ({ ...prev, installmentDates: updatedInstallments }));
  };

  const handleSave = async () => {
    try {
      const res = await fetch('/api/course/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enrollmentId: enrollment?._id,
          ...formData
        })
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('Enrollment updated successfully');
        router.push('/admin/dashboard/enrollments');
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

  return (
    <React.Fragment>
      <Head>
        <title>Edit Enrollment | Admin Dashboard</title>
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
                <div className="flex items-center gap-4">
                  <Link href="/admin/dashboard/enrollments">
                    <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                      <ArrowLeftIcon className="w-4 h-4 mr-2" />
                      Back to Enrollments
                    </Button>
                  </Link>
                  <h2 className="text-2xl font-bold text-white">Edit Enrollment</h2>
                </div>
              </div>

              {isLoading ? (
                <div className="min-h-screen flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                </div>
              ) : enrollment ? (
                <div className="max-w-4xl">
                  {/* Student Info */}
                  <div className="bg-zinc-900 rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Student Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-zinc-400">Name:</span>
                        <span className="text-white ml-2">{enrollment.name}</span>
                      </div>
                      <div>
                        <span className="text-zinc-400">Email:</span>
                        <span className="text-white ml-2">{enrollment.email}</span>
                      </div>
                      <div>
                        <span className="text-zinc-400">Phone:</span>
                        <span className="text-white ml-2">{enrollment.phone}</span>
                      </div>
                      <div>
                        <span className="text-zinc-400">Student ID:</span>
                        <span className="text-white ml-2">{enrollment.studentId || 'Will be auto-generated'}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-zinc-400">Course:</span>
                        <span className="text-white ml-2">{enrollment.course_title?.replace(/<[^>]*>/g, '') || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Fee Configuration */}
                  <div className="bg-zinc-900 rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Fee Configuration</h3>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <Label className="text-white">Fee Type *</Label>
                        <Select value={formData.feeType} onValueChange={handleFeeTypeChange}>
                          <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                            <SelectValue placeholder="Select fee type" />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-800 border-zinc-700">
                            <SelectItem value="Full Payment">Full Payment</SelectItem>
                            <SelectItem value="2 Installments">2 Installments</SelectItem>
                            <SelectItem value="3 Installments">3 Installments</SelectItem>
                            <SelectItem value="4 Installments">4 Installments</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-white">Total Amount (₹) *</Label>
                        <Input
                          type="number"
                          min="0"
                          value={formData.totalAmount}
                          onChange={(e) => setFormData(prev => ({ ...prev, totalAmount: parseFloat(e.target.value) || 0 }))}
                          className="bg-zinc-800 border-zinc-700 text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 mb-6">
                      <div>
                        <Label className="text-white">Advance Amount (₹)</Label>
                        <Input
                          type="number"
                          min="0"
                          max={formData.totalAmount}
                          value={formData.advanceAmount}
                          onChange={(e) => setFormData(prev => ({ ...prev, advanceAmount: parseFloat(e.target.value) || 0 }))}
                          className="bg-zinc-800 border-zinc-700 text-white"
                        />
                      </div>
                    </div>

                    {/* Installment Schedule */}
                    {formData.feeType !== 'Full Payment' && formData.installmentDates.length > 0 && (
                      <div>
                        <h4 className="text-white font-medium mb-4">Installment Schedule</h4>
                        <div className="space-y-4">
                          {formData.installmentDates.map((installment, index) => (
                            <div key={index} className="grid grid-cols-3 gap-4 p-4 bg-zinc-800 rounded-lg">
                              <div>
                                <Label className="text-white">Installment {installment.installmentNumber}</Label>
                                <Input
                                  value={`Installment ${installment.installmentNumber}`}
                                  readOnly
                                  className="bg-zinc-700 border-zinc-600 text-white"
                                />
                              </div>
                              <div>
                                <Label className="text-white">Due Date</Label>
                                <Input
                                  type="date"
                                  value={installment.dueDate}
                                  onChange={(e) => updateInstallment(index, 'dueDate', e.target.value)}
                                  className="bg-zinc-800 border-zinc-700 text-white"
                                />
                              </div>
                              <div>
                                <Label className="text-white">Amount (₹)</Label>
                                <Input
                                  type="number"
                                  min="0"
                                  value={installment.amount}
                                  onChange={(e) => updateInstallment(index, 'amount', parseFloat(e.target.value) || 0)}
                                  className="bg-zinc-800 border-zinc-700 text-white"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="mt-4 p-4 bg-blue-900/20 border border-blue-500/20 rounded-lg">
                          <div className="text-blue-400 text-sm">
                            <div>Total Installments: {formatCurrency(formData.installmentDates.reduce((sum, inst) => sum + inst.amount, 0))}</div>
                            <div>Advance: {formatCurrency(formData.advanceAmount)}</div>
                            <div>Remaining: {formatCurrency(formData.totalAmount - formData.advanceAmount)}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4">
                    <Button onClick={handleSave} variant="manual" className="flex-1 max-w-xs">
                      Save Changes
                    </Button>
                    <Link href="/admin/dashboard/enrollments">
                      <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                        Cancel
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-zinc-500">
                  Enrollment not found.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default EnrollmentEditor;