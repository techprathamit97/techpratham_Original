'use client';

import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { UserContext } from '@/context/userContext';
import SignOut from '@/src/account/common/SignOut';
import AdminLoader from '@/src/account/common/AdminLoader';
import UnauthorizedAccess from '@/src/account/common/UnauthorizedAccess';
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
  course_link: string;
  category: string;
  duration: string;
  level: string;
  totalAmount: number;
  advanceAmount: number;
  feeType: string;
  dueDate: string;
}

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

const CreateInvoice = () => {
  const router = useRouter();
  const { authenticated, loading, isAdmin, checkAccountantAccess, setCurrentTab } = useContext(UserContext);

  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);
  const [items, setItems] = useState<InvoiceItem[]>([
    { description: 'Course Fee', quantity: 1, unitPrice: 0, amount: 0 }
  ]);
  const [tax, setTax] = useState(0);
  const [paymentMode, setPaymentMode] = useState('online');
  const [dueDate, setDueDate] = useState('');
  const [paidDate, setPaidDate] = useState('');
  const [installmentDates, setInstallmentDates] = useState<Array<{
    installmentNumber: number;
    dueDate: string;
    amount: number;
  }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  // Fetch enrollments on mount
  useEffect(() => {
    if (authenticated && isAdmin) {
      fetchEnrollments();
      setCurrentTab("invoices");
    }
  }, [authenticated, isAdmin]);

  const fetchEnrollments = async () => {
    setIsLoading(true);
    setErrors([]);
    try {
      console.log('Fetching enrollments...');
      const res = await fetch('/api/course/enrolled?all=true');
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: Failed to fetch enrollments`);
      }
      
      const data = await res.json();
      console.log('Enrollments fetched:', data.length);
      setEnrollments(Array.isArray(data) ? data : []);
      
      if (!Array.isArray(data) || data.length === 0) {
        toast.warning('No enrollments found');
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to fetch enrollments';
      console.error('Fetch error:', errorMsg);
      setErrors([errorMsg]);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnrollmentSelect = (enrollmentId: string) => {
    console.log('Enrollment selected:', enrollmentId);
    const enrollment = enrollments.find(e => e._id === enrollmentId);
    
    if (enrollment) {
      setSelectedEnrollment(enrollment);
      setErrors([]);
      
      // Auto-populate first item with course fee
      const cleanTitle = enrollment.course_title?.replace(/<[^>]*>/g, '') || 'Course';
      const feeType = enrollment.feeType || 'Full Payment';
      
      const newItems = [{
        description: `${cleanTitle} - ${feeType}`,
        quantity: 1,
        unitPrice: enrollment.totalAmount || 0,
        amount: enrollment.totalAmount || 0
      }];
      setItems(newItems);
      console.log('Items set:', newItems);
    }
  };

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, unitPrice: 0, amount: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    } else {
      toast.error('At least one item is required');
    }
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const updatedItems = [...items];
    const item = { ...updatedItems[index] };
    
    if (field === 'quantity') {
      item.quantity = Math.max(1, Number(value) || 1);
    } else if (field === 'unitPrice') {
      item.unitPrice = Math.max(0, Number(value) || 0);
    } else if (field === 'description') {
      item.description = String(value);
    } else if (field === 'amount') {
      item.amount = Number(value) || 0;
    }
    
    // Recalculate amount
    item.amount = item.quantity * item.unitPrice;
    updatedItems[index] = item;
    setItems(updatedItems);
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.amount || 0), 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + tax;
  };

  const handleFeeTypeChange = (feeType: string) => {
    if (selectedEnrollment) {
      setSelectedEnrollment({...selectedEnrollment, feeType});
      
      // Clear due date for Full Payment
      if (feeType === 'Full Payment') {
        setDueDate('');
        setInstallmentDates([]);
      } else {
        // Generate installment dates based on fee type
        const installmentCount = parseInt(feeType.split(' ')[0]);
        const totalAmount = calculateTotal();
        const amountPerInstallment = Math.round(totalAmount / installmentCount);
        
        const installments = [];
        for (let i = 1; i <= installmentCount; i++) {
          const dueDate = new Date();
          dueDate.setMonth(dueDate.getMonth() + i);
          
          installments.push({
            installmentNumber: i,
            dueDate: dueDate.toISOString().split('T')[0],
            amount: i === installmentCount 
              ? totalAmount - (amountPerInstallment * (installmentCount - 1)) // Last installment gets remainder
              : amountPerInstallment
          });
        }
        
        setInstallmentDates(installments);
        // Set first installment date as due date
        if (installments.length > 0) {
          setDueDate(installments[0].dueDate);
        }
      }
    }
  };

  const updateInstallmentDate = (index: number, field: string, value: string | number) => {
    const updatedInstallments = [...installmentDates];
    updatedInstallments[index] = {
      ...updatedInstallments[index],
      [field]: field === 'amount' ? Number(value) : value
    };
    setInstallmentDates(updatedInstallments);
  };

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    if (!selectedEnrollment) {
      newErrors.push('Please select an enrollment');
    }

    if (!items || items.length === 0) {
      newErrors.push('At least one invoice item is required');
    }

    items.forEach((item, index) => {
      if (!item.description || item.description.trim() === '') {
        newErrors.push(`Item ${index + 1}: Description is required`);
      }
      if (item.quantity < 1) {
        newErrors.push(`Item ${index + 1}: Quantity must be at least 1`);
      }
      if (item.unitPrice <= 0) {
        newErrors.push(`Item ${index + 1}: Unit price must be greater than 0`);
      }
      if (item.amount <= 0) {
        newErrors.push(`Item ${index + 1}: Amount must be greater than 0`);
      }
    });

    if (tax < 0) {
      newErrors.push('Tax cannot be negative');
    }

    // Validate installment dates if not Full Payment
    if (selectedEnrollment?.feeType !== 'Full Payment') {
      if (installmentDates.length === 0) {
        newErrors.push('Installment dates are required for installment payments');
      } else {
        installmentDates.forEach((installment, index) => {
          if (!installment.dueDate) {
            newErrors.push(`Installment ${index + 1}: Due date is required`);
          }
          if (installment.amount <= 0) {
            newErrors.push(`Installment ${index + 1}: Amount must be greater than 0`);
          }
        });

        // Check if installment amounts match total
        const installmentTotal = installmentDates.reduce((sum, inst) => sum + inst.amount, 0);
        const invoiceTotal = calculateTotal();
        if (Math.abs(installmentTotal - invoiceTotal) > 0.01) {
          newErrors.push('Installment amounts must equal the total invoice amount');
        }
      }
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleCreateInvoice = async () => {
    console.log('=== Create Invoice Started ===');
    console.log('Selected enrollment:', selectedEnrollment);
    console.log('Items:', items);
    console.log('Tax:', tax);
    console.log('Payment Mode:', paymentMode);

    if (!validateForm()) {
      console.log('Validation failed:', errors);
      errors.forEach(err => toast.error(err));
      return;
    }

    setIsCreating(true);
    try {
      const requestBody = {
        enrollmentId: selectedEnrollment?._id,
        items: items.map(item => ({
          description: item.description.trim(),
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          amount: item.amount
        })),
        tax: tax || 0,
        paymentMode,
        feeType: selectedEnrollment?.feeType || 'Full Payment',
        installmentDates: installmentDates.length > 0 ? installmentDates : undefined,
        dueDate: dueDate || (installmentDates.length > 0 ? installmentDates[0].dueDate : null),
        paidDate: paidDate || null
      };

      console.log('Request body:', JSON.stringify(requestBody, null, 2));

      const res = await fetch('/api/invoice/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      console.log('Response status:', res.status);
      const data = await res.json();
      console.log('Response data:', data);

      if (res.ok && data.success) {
        toast.success('Invoice created successfully!');
        console.log('Invoice created, redirecting...');
        setTimeout(() => {
          router.push('/admin/dashboard/invoices');
        }, 1000);
      } else {
        const errorMsg = data?.error || data?.message || 'Failed to create invoice';
        throw new Error(errorMsg);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to create invoice';
      console.error('Error creating invoice:', errorMsg);
      toast.error(errorMsg);
      setErrors([errorMsg]);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <React.Fragment>
      <Head>
        <title>Create Invoice | Admin Dashboard</title>
      </Head>

      {loading ? (
        <AdminLoader />
      ) : (!authenticated || !isAdmin) ? (
        <SignOut />
      ) : (!checkAccountantAccess()) ? (
        <UnauthorizedAccess 
          requiredRole="Accountant" 
          message="You need accountant privileges to access invoice creation."
          redirectPath="/admin/dashboard"
        />
      ) : (
        <div className='w-full h-full md:h-screen min-h-screen flex flex-row items-start justify-start fixed'>
          <AdminSidebar />
          <div className='bg-[#000] flex flex-col w-full h-full md:relative fixed'>
            <AdminTopBar />

            <div className="bg-black p-6 overflow-y-auto">
              <div className='w-full h-auto flex flex-row items-start justify-between mb-8'>
                <div className="flex items-center gap-4">
                  <Link href="/admin/dashboard/invoices">
                    <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                      <ArrowLeftIcon className="w-4 h-4 mr-2" />
                      Back to Invoices
                    </Button>
                  </Link>
                  <h2 className="text-2xl font-bold text-white">Create New Invoice</h2>
                </div>
              </div>

              <div className="max-w-4xl">
                <div className="bg-zinc-900 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Select Enrollment</h3>
                  
                  {isLoading ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                    </div>
                  ) : (
                    <Select onValueChange={handleEnrollmentSelect}>
                      <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                        <SelectValue placeholder="Select an enrollment to create invoice" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-800 border-zinc-700">
                        {enrollments.map((enrollment) => (
                          <SelectItem key={enrollment._id} value={enrollment._id}>
                            {enrollment.name} - {enrollment.course_title?.replace(/<[^>]*>/g, '') || 'Course'} 
                            ({enrollment.feeType || 'Full Payment'}) - ₹{enrollment.totalAmount || 0}
                            {enrollment.studentId ? ` [${enrollment.studentId}]` : ' [ID: Auto-gen]'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {selectedEnrollment && (
                    <div className="mt-4 p-4 bg-zinc-800 rounded-lg">
                      <h4 className="font-medium text-white mb-2">Selected Enrollment Details</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-zinc-400">Student:</span>
                          <span className="text-white ml-2">{selectedEnrollment.name}</span>
                        </div>
                        <div>
                          <span className="text-zinc-400">Email:</span>
                          <span className="text-white ml-2">{selectedEnrollment.email}</span>
                        </div>
                        <div>
                          <span className="text-zinc-400">Phone:</span>
                          <span className="text-white ml-2">{selectedEnrollment.phone}</span>
                        </div>
                        <div>
                          <span className="text-zinc-400">Student ID:</span>
                          <span className="text-white ml-2">{selectedEnrollment.studentId || 'Auto-generated'}</span>
                        </div>
                        <div>
                          <span className="text-zinc-400">Course:</span>
                          <span className="text-white ml-2">{selectedEnrollment.course_title?.replace(/<[^>]*>/g, '') || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-zinc-400">Fee Type:</span>
                          <span className="text-white ml-2">{selectedEnrollment.feeType || 'Full Payment'}</span>
                        </div>
                        <div>
                          <span className="text-zinc-400">Total Amount:</span>
                          <span className="text-white ml-2">₹{selectedEnrollment.totalAmount || 0}</span>
                        </div>
                        <div>
                          <span className="text-zinc-400">Advance Paid:</span>
                          <span className="text-white ml-2">₹{selectedEnrollment.advanceAmount || 0}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {selectedEnrollment && (
                  <div className="bg-zinc-900 rounded-lg p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-white">Invoice Items</h3>
                      <Button onClick={addItem} variant="manual" size="sm">
                        <PlusIcon className="w-4 h-4 mr-2" />
                        Add Item
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {items.map((item, index) => (
                        <div key={index} className="grid grid-cols-12 gap-4 items-end">
                          <div className="col-span-5">
                            <Label className="text-white">Description *</Label>
                            <Input
                              value={item.description}
                              onChange={(e) => updateItem(index, 'description', e.target.value)}
                              className="bg-zinc-800 border-zinc-700 text-white"
                              placeholder="Enter item description (e.g., Course Fee, Books, etc.)"
                            />
                          </div>
                          <div className="col-span-2">
                            <Label className="text-white">Quantity *</Label>
                            <Input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                              className="bg-zinc-800 border-zinc-700 text-white"
                              placeholder="1"
                            />
                          </div>
                          <div className="col-span-2">
                            <Label className="text-white">Unit Price (₹) *</Label>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.unitPrice}
                              onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                              className="bg-zinc-800 border-zinc-700 text-white"
                              placeholder="0.00"
                            />
                          </div>
                          <div className="col-span-2">
                            <Label className="text-white">Total Amount (₹)</Label>
                            <Input
                              type="number"
                              value={item.amount}
                              readOnly
                              className="bg-zinc-700 border-zinc-600 text-white"
                              title="Auto-calculated: Quantity × Unit Price"
                            />
                          </div>
                          <div className="col-span-1">
                            {items.length > 1 && (
                              <Button
                                onClick={() => removeItem(index)}
                                variant="outline"
                                size="sm"
                                className="border-red-700 text-red-400 hover:bg-red-900/20"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 pt-4 border-t border-zinc-700">
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                          <Label className="text-white">Payment Mode *</Label>
                          <Select value={paymentMode} onValueChange={setPaymentMode}>
                            <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                              <SelectValue placeholder="Select payment method" />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-800 border-zinc-700">
                              <SelectItem value="online">Online Payment</SelectItem>
                              <SelectItem value="cash">Cash Payment</SelectItem>
                              <SelectItem value="credit_card">Credit Card</SelectItem>
                              <SelectItem value="debit_card">Debit Card</SelectItem>
                              <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                              <SelectItem value="upi">UPI Payment</SelectItem>
                              <SelectItem value="cheque">Cheque</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-white">Fee Type *</Label>
                          <Select 
                            value={selectedEnrollment?.feeType || 'Full Payment'} 
                            onValueChange={handleFeeTypeChange}
                          >
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
                          <Label className="text-white">Tax Amount (₹)</Label>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={tax}
                            onChange={(e) => setTax(parseFloat(e.target.value) || 0)}
                            className="bg-zinc-800 border-zinc-700 text-white"
                            placeholder="0.00"
                          />
                        </div>
                      </div>

                      {/* Fee Type Information */}
                      {selectedEnrollment && (
                        <div className="bg-blue-900/20 border border-blue-500/20 rounded-lg p-4 mb-4">
                          <h4 className="text-blue-400 font-medium mb-2">
                            📋 {selectedEnrollment.feeType || 'Full Payment'} Requirements:
                          </h4>
                          <div className="text-blue-300 text-sm">
                            {selectedEnrollment.feeType === 'Full Payment' ? (
                              <div>
                                ✅ No due date required<br/>
                                ✅ Only paid date needed (optional)<br/>
                                ✅ Single payment transaction
                              </div>
                            ) : (
                              <div>
                                ⚠️ Due date required for installments<br/>
                                ⚠️ Installment schedule must be completed<br/>
                                ⚠️ Multiple payment tracking needed
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        {selectedEnrollment?.feeType !== 'Full Payment' && (
                          <div>
                            <Label className="text-white">Due Date (Required for Installments)</Label>
                            <Input
                              type="date"
                              value={dueDate}
                              onChange={(e) => setDueDate(e.target.value)}
                              className="bg-zinc-800 border-zinc-700 text-white"
                              title="When payment is due"
                              required
                            />
                          </div>
                        )}
                        <div className={selectedEnrollment?.feeType === 'Full Payment' ? 'col-span-2' : ''}>
                          <Label className="text-white">Paid Date (Optional)</Label>
                          <Input
                            type="date"
                            value={paidDate}
                            onChange={(e) => setPaidDate(e.target.value)}
                            className="bg-zinc-800 border-zinc-700 text-white"
                            title="When payment was received"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 max-w-md ml-auto">
                        <div>
                          <Label className="text-white">Final Total Amount (₹)</Label>
                          <Input
                            type="number"
                            value={calculateTotal()}
                            readOnly
                            className="bg-zinc-700 border-zinc-600 text-white font-bold text-lg"
                            title="Subtotal + Tax"
                          />
                        </div>
                      </div>

                      {/* Installment Dates Section */}
                      {selectedEnrollment?.feeType !== 'Full Payment' && installmentDates.length > 0 && (
                        <div className="mt-6 pt-6 border-t border-zinc-700">
                          <h4 className="text-white font-medium mb-4">
                            Installment Schedule ({selectedEnrollment?.feeType})
                          </h4>
                          <div className="space-y-4">
                            {installmentDates.map((installment, index) => (
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
                                  <Label className="text-white">Due Date *</Label>
                                  <Input
                                    type="date"
                                    value={installment.dueDate}
                                    onChange={(e) => updateInstallmentDate(index, 'dueDate', e.target.value)}
                                    className="bg-zinc-800 border-zinc-700 text-white"
                                    required
                                  />
                                </div>
                                <div>
                                  <Label className="text-white">Amount (₹) *</Label>
                                  <Input
                                    type="number"
                                    min="0"
                                    value={installment.amount}
                                    onChange={(e) => updateInstallmentDate(index, 'amount', parseFloat(e.target.value) || 0)}
                                    className="bg-zinc-800 border-zinc-700 text-white"
                                    required
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          <div className="mt-4 p-4 bg-blue-900/20 border border-blue-500/20 rounded-lg">
                            <div className="text-blue-400 text-sm">
                              <div>Total Installments: ₹{installmentDates.reduce((sum, inst) => sum + inst.amount, 0).toLocaleString('en-IN')}</div>
                              <div>Invoice Total: ₹{calculateTotal().toLocaleString('en-IN')}</div>
                              <div className={installmentDates.reduce((sum, inst) => sum + inst.amount, 0) === calculateTotal() ? 'text-green-400' : 'text-red-400'}>
                                {installmentDates.reduce((sum, inst) => sum + inst.amount, 0) === calculateTotal() ? '✓ Amounts match' : '⚠ Amounts do not match'}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {selectedEnrollment && (
                  <div className="space-y-4">
                    {/* Error Messages */}
                    {errors.length > 0 && (
                      <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
                        <h4 className="text-red-400 font-medium mb-2">Validation Errors:</h4>
                        <ul className="text-red-300 text-sm space-y-1">
                          {errors.map((error, idx) => (
                            <li key={idx}>• {error}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Debug info */}
                    <div className="bg-zinc-800 p-4 rounded-lg">
                      <h4 className="text-white font-medium mb-2">Summary:</h4>
                      <div className="text-sm text-zinc-300 space-y-1">
                        <div>Selected Enrollment: {selectedEnrollment ? '✓' : '✗'}</div>
                        <div>Items Count: {items.length}</div>
                        <div>Items Valid: {items.every(item => item.description && item.amount > 0) ? '✓' : '✗'}</div>
                        <div>Subtotal: ₹{calculateSubtotal().toFixed(2)}</div>
                        <div>Tax: ₹{tax.toFixed(2)}</div>
                        <div>Total: ₹{calculateTotal().toFixed(2)}</div>
                        <div>Fee Type: {selectedEnrollment?.feeType || 'Full Payment'}</div>
                        <div>Payment Mode: {paymentMode}</div>
                        {selectedEnrollment?.feeType !== 'Full Payment' && (
                          <div>Due Date: {dueDate || 'Not set'}</div>
                        )}
                        {paidDate && (
                          <div>Paid Date: {paidDate}</div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        onClick={handleCreateInvoice}
                        disabled={isCreating || !selectedEnrollment || items.some(item => !item.description || item.amount <= 0)}
                        variant="manual"
                        className="flex-1 max-w-xs"
                      >
                        {isCreating ? 'Creating Invoice...' : 'Create Invoice'}
                      </Button>
                      
                      <Link href="/admin/dashboard/invoices">
                        <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                          Cancel
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default CreateInvoice;