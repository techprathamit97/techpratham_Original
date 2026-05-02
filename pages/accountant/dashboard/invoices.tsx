import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { UserContext } from '@/context/userContext';
import SignOut from '@/src/account/common/SignOut';
import AdminLoader from '@/src/account/common/AdminLoader';
import AccountantSidebar from '@/src/account/common/AccountantSidebar';
import AccountantTopBar from '@/src/account/common/AccountantTopBar';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  Check, 
  X, 
  Download,
  Plus,
  Pencil,
  Trash2,
  Shield,
  Upload
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
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

interface Invoice {
  _id: string;
  invoiceNumber: string;
  receiptNo: string;
  customerDetails: {
    name: string;
    email: string;
    phone: string;
    studentId: string;
  };
  courseDetails: {
    title: string;
    category: string;
  };
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  paymentMode: string;
  status: 'paid' | 'partial' | 'due' | 'overdue';
  isApproved: boolean;
  certificateApproved: boolean;
  invoiceDate: string;
  dueDate?: string;
  paidDate?: string;
  feeType?: string;
  remark?: string;
  salesPerson?: string;
  installmentDates?: Array<{
    installmentNumber: number;
    dueDate: string;
    amount: number;
    paidDate?: string;
    paidAmount?: number;
    status?: 'paid' | 'pending' | 'partial';
  }>;
  installmentPayments?: Array<{
    installmentNumber: number;
    paidDate: string;
    amount: number;
    paymentMode: string;
  }>;
  isManual?: boolean;
  paymentScreenshot?: string;
  paymentScreenshots?: Array<{
    url: string;
    uploadDate: string;
    paymentNumber: number;
  }>;
}

const InvoicesDashboard = () => {
  const { authenticated, loading, isAccountant, checkAccountantAccess, setCurrentTab } = useContext(UserContext);

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [salesPersonFilter, setSalesPersonFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [showAllInvoices, setShowAllInvoices] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('online');
  const [paidDate, setPaidDate] = useState('');
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<Invoice | null>(null);
  const [isScreenshotDialogOpen, setIsScreenshotDialogOpen] = useState(false);
  const [isRemarkDialogOpen, setIsRemarkDialogOpen] = useState(false);
  const [remarkText, setRemarkText] = useState('');
  const [selectedInvoiceForRemark, setSelectedInvoiceForRemark] = useState<Invoice | null>(null);
  
  // Payment screenshot upload states
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
  const [paymentScreenshotPreview, setPaymentScreenshotPreview] = useState<string | null>(null);

  const fetchInvoices = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      // Request all invoices by setting a high limit
      params.append('limit', '1000');
      
      const res = await fetch(`/api/invoice/fetch?${params.toString()}`);
      const data = await res.json();
      
      if (data.success) {
        // Sort invoices by most recent first (invoice date)
        const sortedInvoices = data.invoices.sort((a: Invoice, b: Invoice) => {
          return new Date(b.invoiceDate).getTime() - new Date(a.invoiceDate).getTime();
        });
        
        setInvoices(sortedInvoices);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
      toast.error('Failed to fetch invoices');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteInvoice = async () => {
    if (!invoiceToDelete) return;
    
    try {
      const res = await fetch(`/api/invoice/manage?id=${invoiceToDelete._id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Invoice deleted successfully');
        setIsDeleteDialogOpen(false);
        setInvoiceToDelete(null);
        fetchInvoices();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error deleting invoice:', error);
      toast.error('Failed to delete invoice');
    }
  };

  const handleEditInvoice = (invoice: Invoice) => {
    try {
      // Navigate to edit page based on invoice type
      if (invoice.isManual) {
        // For manual invoices, navigate to manual invoice edit page
        window.location.href = `/accountant/dashboard/create-manual-invoice?edit=${invoice._id}`;
      } else {
        // For regular invoices, navigate to regular invoice edit page
        window.location.href = `/accountant/dashboard/create-invoice?edit=${invoice._id}`;
      }
    } catch (error) {
      console.error('Error navigating to edit page:', error);
      toast.error('Failed to open edit page');
    }
  };

  useEffect(() => {
    if (authenticated) {
      fetchInvoices();
      setCurrentTab("invoices");
    }
  }, [authenticated, statusFilter, salesPersonFilter, dateFilter, customStartDate, customEndDate]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      paid: { color: 'bg-green-500/10 text-green-500 border-green-500/20', label: '🟢 Paid' },
      partial: { color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20', label: '🟡 Partial' },
      due: { color: 'bg-red-500/10 text-red-500 border-red-500/20', label: '🔴 Due' },
      overdue: { color: 'bg-red-600/10 text-red-600 border-red-600/20', label: '🔴 Overdue' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  // Get unique sales persons from invoices
  const getUniqueSalesPersons = () => {
    const salesPersons = invoices
      .map(invoice => invoice.salesPerson)
      .filter((person): person is string => person != null && person.trim() !== '')
      .filter((person, index, arr) => arr.indexOf(person) === index)
      .sort();
    return salesPersons;
  };

  // Get date range for filtering
  const getDateRange = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    switch (dateFilter) {
      case 'this_month':
        return {
          start: new Date(currentYear, currentMonth, 1),
          end: new Date(currentYear, currentMonth + 1, 0, 23, 59, 59)
        };
      case 'last_month':
        return {
          start: new Date(currentYear, currentMonth - 1, 1),
          end: new Date(currentYear, currentMonth, 0, 23, 59, 59)
        };
      case 'last_3_months':
        return {
          start: new Date(currentYear, currentMonth - 2, 1),
          end: new Date(currentYear, currentMonth + 1, 0, 23, 59, 59)
        };
      case 'this_year':
        return {
          start: new Date(currentYear, 0, 1),
          end: new Date(currentYear, 11, 31, 23, 59, 59)
        };
      case 'custom':
        if (customStartDate && customEndDate) {
          return {
            start: new Date(customStartDate),
            end: new Date(customEndDate + 'T23:59:59')
          };
        }
        return null;
      default:
        return null;
    }
  };

  // Filter invoices based on status, sales person, and date
  const filteredInvoices = invoices.filter(invoice => {
    const statusMatch = statusFilter === 'all' || invoice.status === statusFilter;
    const salesPersonMatch = salesPersonFilter === 'all' || 
      (salesPersonFilter === 'none' && (!invoice.salesPerson || invoice.salesPerson.trim() === '')) ||
      invoice.salesPerson === salesPersonFilter;
    
    // Date filtering
    let dateMatch = true;
    if (dateFilter !== 'all') {
      const dateRange = getDateRange();
      if (dateRange) {
        const invoiceDate = new Date(invoice.invoiceDate);
        dateMatch = invoiceDate >= dateRange.start && invoiceDate <= dateRange.end;
      }
    }
    
    return statusMatch && salesPersonMatch && dateMatch;
  });

  // Get sales summary by person for the filtered period
  const getSalesSummary = () => {
    const summary: { [key: string]: { count: number; total: number; paid: number } } = {};
    
    filteredInvoices.forEach(invoice => {
      const person = invoice.salesPerson || 'No Sales Person';
      if (!summary[person]) {
        summary[person] = { count: 0, total: 0, paid: 0 };
      }
      summary[person].count += 1;
      summary[person].total += invoice.totalAmount || 0;
      summary[person].paid += invoice.paidAmount || 0;
    });
    
    return Object.entries(summary)
      .map(([person, data]) => ({ person, ...data }))
      .sort((a, b) => b.total - a.total);
  };

  // Get overall totals for the filtered period
  const getOverallTotals = () => {
    const totals = filteredInvoices.reduce(
      (acc, invoice) => ({
        count: acc.count + 1,
        total: acc.total + (invoice.totalAmount || 0),
        paid: acc.paid + (invoice.paidAmount || 0)
      }),
      { count: 0, total: 0, paid: 0 }
    );
    
    return {
      ...totals,
      pending: totals.total - totals.paid,
      paidPercentage: totals.total > 0 ? (totals.paid / totals.total) * 100 : 0
    };
  };

  const handleApproveInvoice = async (invoiceId: string, action: 'approve' | 'unapprove') => {
    try {
      const res = await fetch('/api/invoice/manage', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceId, action })
      });

      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        fetchInvoices();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error updating invoice:', error);
      toast.error('Failed to update invoice');
    }
  };

  const handleApproveCertificate = async (invoiceId: string) => {
    try {
      const certificateData = {
        enrolledDate: new Date(),
        completionDate: new Date(),
        certificateId: `CERT-${Date.now()}`
      };

      const res = await fetch('/api/invoice/manage', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          invoiceId, 
          action: 'approve_certificate',
          certificateData 
        })
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Certificate approved successfully');
        fetchInvoices();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error approving certificate:', error);
      toast.error('Failed to approve certificate');
    }
  };

  const validatePaymentForm = () => {
    const errors: {[key: string]: string} = {};
    
    // Validate payment amount
    if (!paymentAmount || paymentAmount.trim() === '') {
      errors.paymentAmount = 'Payment amount is required';
    } else {
      const amount = parseFloat(paymentAmount);
      if (isNaN(amount) || amount <= 0) {
        errors.paymentAmount = 'Payment amount must be greater than 0';
      } else if (amount > selectedInvoice!.pendingAmount) {
        errors.paymentAmount = `Payment amount cannot exceed pending amount of ${formatCurrency(selectedInvoice!.pendingAmount)}`;
      }
    }
    
    // Validate payment mode
    if (!paymentMode || paymentMode.trim() === '') {
      errors.paymentMode = 'Payment mode is required';
    }
    
    // Validate payment date if provided
    if (paidDate && paidDate.trim() !== '') {
      const paymentDate = new Date(paidDate);
      const today = new Date();
      today.setHours(23, 59, 59, 999); // Set to end of today
      
      if (paymentDate > today) {
        errors.paidDate = 'Payment date cannot be in the future';
      }
    }
    
    return errors;
  };

  // Payment screenshot handling functions
  const handlePaymentScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      
      setPaymentScreenshot(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPaymentScreenshotPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePaymentScreenshot = () => {
    setPaymentScreenshot(null);
    setPaymentScreenshotPreview(null);
  };

  const uploadPaymentScreenshot = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('screenshot', file);
    
    const res = await fetch('/api/upload-payment-screenshot', {
      method: 'POST',
      body: formData
    });
    
    if (!res.ok) {
      throw new Error('Failed to upload payment screenshot');
    }
    
    const data = await res.json();
    return data.url;
  };

  const handleUpdateRemark = async () => {
    if (!selectedInvoiceForRemark) {
      toast.error('No invoice selected');
      return;
    }

    try {
      const res = await fetch('/api/invoice/manage', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          invoiceId: selectedInvoiceForRemark._id, 
          action: 'update_remark',
          remark: remarkText.trim()
        })
      });

      const data = await res.json();
      
      if (data.success) {
        toast.success('Remark updated successfully');
        setIsRemarkDialogOpen(false);
        setRemarkText('');
        setSelectedInvoiceForRemark(null);
        fetchInvoices();
      } else {
        toast.error(data.error || 'Failed to update remark');
      }
    } catch (error) {
      console.error('Error updating remark:', error);
      toast.error('Network error. Please try again.');
    }
  };

  const handleUpdatePayment = async () => {
    if (!selectedInvoice) {
      toast.error('No invoice selected');
      return;
    }

    // Validate form
    const errors = validatePaymentForm();
    setValidationErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      toast.error('Please fix the validation errors');
      return;
    }

    const paymentAmountNum = parseFloat(paymentAmount);
    
    // Round to 2 decimal places to avoid floating point issues
    const roundedPaymentAmount = Math.round(paymentAmountNum * 100) / 100;
    const roundedPendingAmount = Math.round(selectedInvoice.pendingAmount * 100) / 100;

    // Calculate new total paid amount (existing + new payment)
    const newTotalPaidAmount = Math.round((selectedInvoice.paidAmount + roundedPaymentAmount) * 100) / 100;
    const newPendingAmount = Math.round((selectedInvoice.totalAmount - newTotalPaidAmount) * 100) / 100;

    // Determine which installment this payment covers
    let installmentNumber = 1;
    if (selectedInvoice.installmentDates && selectedInvoice.feeType !== 'Full Payment') {
      let cumulativeAmount = 0;
      for (const installment of selectedInvoice.installmentDates) {
        cumulativeAmount += installment.amount;
        if (newTotalPaidAmount <= cumulativeAmount) {
          installmentNumber = installment.installmentNumber;
          break;
        }
      }
    }

    // Calculate next due date
    let nextDueDate = null;
    if (newPendingAmount > 0) {
      if (selectedInvoice.installmentDates && selectedInvoice.installmentDates.length > 0) {
        // Find the next unpaid installment
        let cumulativeAmount = 0;
        for (const installment of selectedInvoice.installmentDates) {
          cumulativeAmount += installment.amount;
          if (newTotalPaidAmount < cumulativeAmount) {
            nextDueDate = installment.dueDate;
            break;
          }
        }
      } else {
        // For full payment type, set due date to 30 days from now if there's still pending amount
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 30);
        nextDueDate = dueDate.toISOString().split('T')[0];
      }
    }

    try {
      let paymentScreenshotUrl = null;
      
      // Upload payment screenshot if provided
      if (paymentScreenshot) {
        console.log('Uploading payment screenshot...');
        paymentScreenshotUrl = await uploadPaymentScreenshot(paymentScreenshot);
        console.log('Payment screenshot uploaded successfully:', paymentScreenshotUrl);
      }

      const res = await fetch('/api/invoice/manage', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          invoiceId: selectedInvoice._id, 
          action: 'update_payment',
          amount: newTotalPaidAmount, // Send the new total paid amount
          paymentMode,
          paidDate: paidDate || null,
          installmentNumber, // Track which installment this payment covers
          installmentPaymentAmount: roundedPaymentAmount, // The actual payment amount for this installment
          nextDueDate, // Update the due date based on payment
          paymentScreenshotUrl // Add the screenshot URL
        })
      });

      const data = await res.json();
      
      if (data.success) {
        toast.success(`Payment of ${formatCurrency(roundedPaymentAmount)} added successfully`);
        setIsUpdateDialogOpen(false);
        setPaymentAmount('');
        setPaymentMode('online');
        setPaidDate('');
        setValidationErrors({});
        setSelectedInvoice(null);
        // Clear screenshot states
        setPaymentScreenshot(null);
        setPaymentScreenshotPreview(null);
        fetchInvoices();
      } else {
        toast.error(data.error || 'Failed to update payment');
      }
    } catch (error) {
      console.error('Error updating payment:', error);
      toast.error('Network error. Please try again.');
    }
  };

  const formatCurrency = (amount: number) => {
    // Round to 2 decimal places to avoid floating point precision issues
    const roundedAmount = Math.round(amount * 100) / 100;
    return `₹${roundedAmount.toLocaleString('en-IN', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <React.Fragment>
      <Head>
        <title>Invoices | Admin Dashboard</title>
      </Head>

      {loading ? (
        <AdminLoader />
      ) : (!authenticated || !isAccountant) ? (
        <SignOut />
      ) : (
        <div className='w-full h-full md:h-screen min-h-screen flex flex-row items-start justify-start'>
          <AccountantSidebar />
          <div className='bg-[#000] flex flex-col w-full h-full overflow-hidden'>
            <AccountantTopBar />

            <div className="bg-black p-6 overflow-y-auto h-full flex-1">
              <div className='w-full h-auto flex flex-row items-start justify-between mb-8'>
                <h2 className="text-2xl font-bold text-white">Invoice Management</h2>
                
                <div className="flex gap-4 items-center flex-wrap">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40 bg-zinc-900 border-zinc-700 text-white">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent className="bg-red-800 border-zinc-700">
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="partial">Partial</SelectItem>
                      <SelectItem value="due">Due</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={salesPersonFilter} onValueChange={setSalesPersonFilter}>
                    <SelectTrigger className="w-48 bg-zinc-900 border-zinc-700 text-white">
                      <SelectValue placeholder="Filter by sales person" />
                    </SelectTrigger>
                    <SelectContent className="bg-red-800 border-zinc-700">
                      <SelectItem value="all">All Sales Persons</SelectItem>
                      <SelectItem value="none">No Sales Person</SelectItem>
                      {getUniqueSalesPersons().map((person) => (
                        <SelectItem key={person} value={person}>
                          {person}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger className="w-48 bg-zinc-900 border-zinc-700 text-white">
                      <SelectValue placeholder="Filter by date" />
                    </SelectTrigger>
                    <SelectContent className="bg-red-800 border-zinc-700">
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="this_month">This Month</SelectItem>
                      <SelectItem value="last_month">Last Month</SelectItem>
                      <SelectItem value="last_3_months">Last 3 Months</SelectItem>
                      <SelectItem value="this_year">This Year</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>

                  {dateFilter === 'custom' && (
                    <>
                      <input
                        type="date"
                        value={customStartDate}
                        onChange={(e) => setCustomStartDate(e.target.value)}
                        className="px-3 py-2 bg-zinc-900 border border-zinc-700 text-white rounded-md text-sm"
                        placeholder="Start Date"
                      />
                      <input
                        type="date"
                        value={customEndDate}
                        onChange={(e) => setCustomEndDate(e.target.value)}
                        className="px-3 py-2 bg-zinc-900 border border-zinc-700 text-white rounded-md text-sm"
                        placeholder="End Date"
                      />
                    </>
                  )}

                  {(statusFilter !== 'all' || salesPersonFilter !== 'all' || dateFilter !== 'all') && (
                    <Button
                      onClick={() => {
                        setStatusFilter('all');
                        setSalesPersonFilter('all');
                        setDateFilter('all');
                        setCustomStartDate('');
                        setCustomEndDate('');
                      }}
                      variant="outline"
                      className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 text-sm"
                    >
                      Clear Filters
                    </Button>
                  )}

                  {isAccountant && (
                    <>
                      <Link href="/accountant/dashboard/create-manual-invoice">
                        <Button variant="outline" className="flex gap-2 border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                          <Plus className='w-5 h-5' />
                          Manual Invoice
                        </Button>
                      </Link>

                      <Link href="/accountant/dashboard/create-simple-invoice">
                        <Button variant="manual" className="flex gap-2">
                          <Plus className='w-5 h-5' />
                          Simple Invoice
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                </div>
              ) : (
                <>
                  {/* Sales Summary Section */}
                  {(dateFilter !== 'all' || salesPersonFilter !== 'all') && (
                    <div className="bg-zinc-900 rounded-lg p-6 mb-6">
                      <h3 className="text-lg font-semibold text-white mb-4">
                        Sales Summary 
                        {dateFilter !== 'all' && (
                          <span className="text-sm text-zinc-400 ml-2">
                            ({dateFilter === 'custom' ? 'Custom Range' : dateFilter.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())})
                          </span>
                        )}
                      </h3>
                      
                      {/* Overall Totals */}
                      <div className="bg-zinc-800 rounded-lg p-6 mb-6 border-l-4 border-blue-500">
                        <h4 className="text-white font-semibold text-lg mb-4">📊 Overall Totals</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-white">{getOverallTotals().count}</div>
                            <div className="text-sm text-zinc-400">Total Invoices</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-400">₹{getOverallTotals().total.toLocaleString('en-IN')}</div>
                            <div className="text-sm text-zinc-400">Total Sales</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-400">₹{getOverallTotals().paid.toLocaleString('en-IN')}</div>
                            <div className="text-sm text-zinc-400">Amount Collected</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-red-400">₹{getOverallTotals().pending.toLocaleString('en-IN')}</div>
                            <div className="text-sm text-zinc-400">Pending Amount</div>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-zinc-700">
                          <div className="flex justify-between items-center">
                            <span className="text-zinc-400">Collection Rate:</span>
                            <div className="flex items-center gap-2">
                              <div className="w-32 bg-zinc-700 rounded-full h-2">
                                <div 
                                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${Math.min(getOverallTotals().paidPercentage, 100)}%` }}
                                ></div>
                              </div>
                              <span className="text-white font-medium">{getOverallTotals().paidPercentage.toFixed(1)}%</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Individual Sales Person Performance */}
                      <h4 className="text-white font-semibold text-lg mb-4">👥 Sales Person Performance</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {getSalesSummary().map((summary) => (
                          <div key={summary.person} className="bg-zinc-800 rounded-lg p-4 border border-zinc-700 hover:border-zinc-600 transition-colors">
                            <h5 className="text-white font-medium text-sm mb-3 flex items-center gap-2">
                              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                              {summary.person}
                            </h5>
                            <div className="space-y-2 text-xs">
                              <div className="flex justify-between">
                                <span className="text-zinc-400">Invoices:</span>
                                <span className="text-white font-medium">{summary.count}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-zinc-400">Total Sales:</span>
                                <span className="text-blue-400 font-medium">₹{summary.total.toLocaleString('en-IN')}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-zinc-400">Collected:</span>
                                <span className="text-green-400 font-medium">₹{summary.paid.toLocaleString('en-IN')}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-zinc-400">Pending:</span>
                                <span className="text-red-400 font-medium">₹{(summary.total - summary.paid).toLocaleString('en-IN')}</span>
                              </div>
                              <div className="pt-2 border-t border-zinc-700">
                                <div className="flex justify-between items-center">
                                  <span className="text-zinc-400">Rate:</span>
                                  <span className="text-white font-medium">
                                    {summary.total > 0 ? ((summary.paid / summary.total) * 100).toFixed(1) : 0}%
                                  </span>
                                </div>
                                <div className="w-full bg-zinc-700 rounded-full h-1.5 mt-1">
                                  <div 
                                    className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                                    style={{ width: `${summary.total > 0 ? Math.min((summary.paid / summary.total) * 100, 100) : 0}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {getSalesSummary().length === 0 && (
                        <div className="text-center py-8 text-zinc-500">
                          No sales data found for the selected filters.
                        </div>
                      )}
                    </div>
                  )}

                  <div className="bg-zinc-900 rounded-lg overflow-hidden w-full">
                    <div className="overflow-x-auto w-full scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-zinc-800">
                      <div className="min-w-[1550px]">
                        <table className="w-full">
                          <thead className="bg-zinc-800">
                            <tr>
                              <th className="text-left p-3 text-white font-medium text-sm w-32">Invoice #</th>
                              <th className="text-left p-3 text-white font-medium text-sm w-48">Customer</th>
                              <th className="text-left p-3 text-white font-medium text-sm w-32">Phone</th>
                              <th className="text-left p-3 text-white font-medium text-sm w-40">Course</th>
                              <th className="text-left p-3 text-white font-medium text-sm w-32">Fee Type</th>
                              <th className="text-left p-3 text-white font-medium text-sm w-28">Total</th>
                              <th className="text-left p-3 text-white font-medium text-sm w-28">Paid</th>
                              <th className="text-left p-3 text-white font-medium text-sm w-28">Pending</th>
                              <th className="text-left p-3 text-white font-medium text-sm w-24">Status</th>
                              <th className="text-left p-3 text-white font-medium text-sm w-40">Payment Info</th>
                              <th className="text-left p-3 text-white font-medium text-sm w-32">Due Date</th>
                              <th className="text-left p-3 text-white font-medium text-sm w-24">Screenshot</th>
                              <th className="text-left p-3 text-white font-medium text-sm w-32">Sales Person</th>
                              <th className="text-left p-3 text-white font-medium text-sm w-48">Remark</th>
                              <th className="text-left p-3 text-white font-medium text-sm w-48">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                        {(showAllInvoices ? filteredInvoices : filteredInvoices.slice(0, 30)).map((invoice) => (
                          <tr key={invoice._id} className="border-b border-zinc-800 hover:bg-zinc-800/50">
                            <td className="p-3 text-white font-mono text-xs">
                              {invoice.invoiceNumber}
                            </td>
                            <td className="p-3">
                              <div className="text-white font-medium text-sm">{invoice.customerDetails.name}</div>
                              <div className="text-zinc-400 text-xs">{invoice.customerDetails.email}</div>
                              <div className="text-zinc-500 text-xs">
                                ID: {invoice.customerDetails.studentId}
                              </div>
                              <div className="text-zinc-500 text-xs">
                                {invoice.isManual ? '📝 Manual' : '🎓 Enrolled'}
                              </div>
                            </td>
                            <td className="p-3">
                              <div className="text-white text-sm">{invoice.customerDetails.phone || 'N/A'}</div>
                            </td>
                            <td className="p-3">
                              <div className="text-white text-sm">{invoice.courseDetails.title}</div>
                            </td>
                            <td className="p-3">
                              <div className="text-white font-medium text-sm">{invoice.feeType || 'Full Payment'}</div>
                              {invoice.installmentDates && invoice.installmentDates.length > 0 && (
                                <div className="text-zinc-400 text-xs">
                                  {invoice.installmentDates.length} Installments
                                </div>
                              )}
                            </td>
                            <td className="p-3">
                              <div className="text-white font-bold text-sm">{formatCurrency(invoice.totalAmount)}</div>
                            </td>
                            <td className="p-3">
                              <div className="text-green-400 font-bold text-sm">{formatCurrency(invoice.paidAmount)}</div>
                            </td>
                            <td className="p-3">
                              <div className="text-red-400 font-bold text-sm">{formatCurrency(invoice.pendingAmount)}</div>
                            </td>
                            <td className="p-3">
                              {getStatusBadge(invoice.status)}
                              <div className="mt-1 flex gap-1">
                                {invoice.isApproved && (
                                  <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-xs">
                                    ✓
                                  </Badge>
                                )}
                                {invoice.certificateApproved && (
                                  <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20 text-xs">
                                    Cert
                                  </Badge>
                                )}
                              </div>
                            </td>
                            <td className="p-3">
                              <div className="text-zinc-400 text-xs">
                                <div>Mode: {invoice.paymentMode?.replace('_', ' ').toUpperCase() || 'N/A'}</div>
                                <div>Date: {formatDate(invoice.invoiceDate)}</div>
                                {invoice.paidDate && invoice.feeType === 'Full Payment' && (
                                  <div className="text-green-400 text-xs">
                                    Paid: {formatDateTime(invoice.paidDate)}
                                  </div>
                                )}
                              </div>
                            </td>
                            
                            {/* Due Date Column */}
                            <td className="p-3">
                              <div className="text-xs">
                                {invoice.dueDate ? (
                                  <div>
                                    <div className="text-yellow-400 font-medium">
                                      {formatDate(invoice.dueDate)}
                                    </div>
                                    <div className="text-zinc-500">
                                      {invoice.feeType === 'Full Payment' ? 'Full Payment' : 'Next Due'}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="text-zinc-600">N/A</div>
                                )}
                              </div>
                            </td>
                            
                            {/* Payment Screenshot Column */}
                            <td className="p-3">
                              <div className="text-xs">
                                {(() => {
                                  const screenshots = [];
                                  
                                  // Add original screenshot if exists
                                  if (invoice.paymentScreenshot && invoice.paymentScreenshot.trim() !== '') {
                                    screenshots.push({
                                      url: invoice.paymentScreenshot,
                                      name: 'Original'
                                    });
                                  }
                                  
                                  // Add payment screenshots if exist
                                  if (invoice.paymentScreenshots && invoice.paymentScreenshots.length > 0) {
                                    invoice.paymentScreenshots.forEach((screenshot, index) => {
                                      screenshots.push({
                                        url: screenshot.url,
                                        name: `pay-${screenshot.paymentNumber || index + 1}`
                                      });
                                    });
                                  }
                                  
                                  if (screenshots.length > 0) {
                                    return (
                                      <div className="flex flex-wrap gap-1">
                                        {screenshots.map((screenshot, index) => (
                                          <Button
                                            key={index}
                                            size="sm"
                                            variant="outline"
                                            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 text-xs px-1 py-1"
                                            onClick={() => {
                                              setSelectedInvoice({
                                                ...invoice,
                                                paymentScreenshot: screenshot.url
                                              });
                                              setIsScreenshotDialogOpen(true);
                                            }}
                                            title={`View ${screenshot.name} Screenshot`}
                                          >
                                            📷 {screenshot.name}
                                          </Button>
                                        ))}
                                      </div>
                                    );
                                  } else {
                                    return <div className="text-zinc-600">No Image</div>;
                                  }
                                })()}
                              </div>
                            </td>
                            
                            {/* Sales Person Column */}
                            <td className="p-3">
                              <div className="text-xs">
                                {invoice.salesPerson ? (
                                  <div className="text-zinc-300">
                                    {invoice.salesPerson}
                                  </div>
                                ) : (
                                  <div className="text-zinc-600">Not assigned</div>
                                )}
                              </div>
                            </td>
                            
                            {/* Remark Column */}
                            <td className="p-3">
                              <div className="text-xs">
                                {invoice.remark ? (
                                  <div className="text-zinc-300 break-words">
                                    {invoice.remark}
                                  </div>
                                ) : (
                                  <div className="text-zinc-600">No remark</div>
                                )}
                              </div>
                            </td>
                            
                            <td className="p-3">
                              <div className="flex gap-1 flex-wrap">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 text-xs px-2 py-1"
                                  onClick={() => {
                                    setSelectedInvoice(invoice);
                                    setIsViewDialogOpen(true);
                                  }}
                                  title="View Invoice"
                                >
                                  <Eye className="w-3 h-3" />
                                </Button>

                                {/* Remark Button */}
                                {invoice.remark ? (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 text-xs px-2 py-1"
                                    onClick={() => {
                                      setSelectedInvoiceForRemark(invoice);
                                      setRemarkText(invoice.remark || '');
                                      setIsRemarkDialogOpen(true);
                                    }}
                                    title="Edit Remark"
                                  >
                                    Edit Remark
                                  </Button>
                                ) : (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 text-xs px-2 py-1"
                                    onClick={() => {
                                      setSelectedInvoiceForRemark(invoice);
                                      setRemarkText('');
                                      setIsRemarkDialogOpen(true);
                                    }}
                                    title="Add Remark"
                                  >
                                    Add Remark
                                  </Button>
                                )}

                                {/* Only show Pay button if there's pending amount */}
                                {invoice.pendingAmount > 0 && isAccountant && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 text-xs px-2 py-1"
                                    onClick={() => {
                                      setSelectedInvoice(invoice);
                                      // Round to 2 decimal places to avoid floating point issues
                                      const roundedPendingAmount = Math.round(invoice.pendingAmount * 100) / 100;
                                      setPaymentAmount(roundedPendingAmount.toString());
                                      setPaymentMode(invoice.paymentMode || 'online');
                                      setPaidDate(invoice.paidDate ? new Date(invoice.paidDate).toISOString().split('T')[0] : '');
                                      // Clear screenshot states
                                      setPaymentScreenshot(null);
                                      setPaymentScreenshotPreview(null);
                                      setIsUpdateDialogOpen(true);
                                    }}
                                    title="Update Payment"
                                  >
                                    Pay
                                  </Button>
                                )}

                                {isAccountant && (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="border-blue-700 text-blue-300 hover:bg-blue-800 text-xs px-2 py-1"
                                      onClick={() => handleEditInvoice(invoice)}
                                      title="Edit Invoice"
                                    >
                                      <Pencil className="w-3 h-3" />
                                    </Button>

                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="border-red-700 text-red-400 hover:bg-red-900/20 text-xs px-2 py-1"
                                      onClick={() => {
                                        setInvoiceToDelete(invoice);
                                        setIsDeleteDialogOpen(true);
                                      }}
                                      title="Delete Invoice"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Scroll indicator */}
                  <div className="text-center text-zinc-500 text-xs mt-2">
                    ← Scroll horizontally to view all columns → | Sorted by Invoice Date (most recent first)
                  </div>

                  {/* Show More/Less Button */}
                  {filteredInvoices.length > 30 && (
                    <div className="text-center mt-4">
                      <Button
                        onClick={() => setShowAllInvoices(!showAllInvoices)}
                        variant="outline"
                        className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                      >
                        {showAllInvoices ? 'Show Less' : `Show More (${filteredInvoices.length - 30} more invoices)`}
                      </Button>
                    </div>
                  )}

                  {filteredInvoices.length === 0 && (
                    <div className="text-center py-12 text-zinc-500">
                      No invoices found for the selected filter.
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* View Invoice Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="bg-black border-zinc-800 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Invoice Details</DialogTitle>
          </DialogHeader>
          {selectedInvoice && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Invoice Number</Label>
                  <div className="font-mono">{selectedInvoice.invoiceNumber}</div>
                </div>
                <div>
                  <Label>Receipt Number</Label>
                  <div className="font-mono">{selectedInvoice.receiptNo}</div>
                </div>
              </div>
              
              <div>
                <Label>Customer</Label>
                <div>{selectedInvoice.customerDetails.name}</div>
                <div className="text-sm text-zinc-400">{selectedInvoice.customerDetails.email}</div>
              </div>

              <div>
                <Label>Course</Label>
                <div>{selectedInvoice.courseDetails.title}</div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Total Amount</Label>
                  <div className="font-bold">{formatCurrency(selectedInvoice.totalAmount)}</div>
                </div>
                <div>
                  <Label>Paid Amount</Label>
                  <div className="text-green-400">{formatCurrency(selectedInvoice.paidAmount)}</div>
                </div>
                <div>
                  <Label>Pending Amount</Label>
                  <div className="text-red-400">{formatCurrency(selectedInvoice.pendingAmount)}</div>
                </div>
              </div>

              <div className="flex gap-2">
                <Link href={`/invoice/${selectedInvoice._id}`} target="_blank">
                  <Button variant="manual" className="flex gap-2">
                    <Download className="w-4 h-4" />
                    View Full Invoice
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Update Payment Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="bg-black border-zinc-800 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Update Payment - {selectedInvoice?.feeType}</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Update the payment for this invoice. Enter the outstanding amount to be paid.
            </DialogDescription>
          </DialogHeader>
          
          {selectedInvoice && (
            <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
              {/* Invoice Summary */}
              <div className="bg-zinc-900 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Invoice: {selectedInvoice.invoiceNumber}</Label>
                    <div className="text-sm text-zinc-400">
                      Customer: {selectedInvoice.customerDetails.name}
                    </div>
                  </div>
                  <div>
                    <Label>Course: {selectedInvoice.courseDetails.title}</Label>
                    <div className="text-sm text-zinc-400">
                      Fee Type: {selectedInvoice.feeType}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-zinc-900 p-3 rounded">
                  <Label className="text-xs">Total Amount</Label>
                  <div className="text-lg font-bold text-white">{formatCurrency(selectedInvoice.totalAmount)}</div>
                </div>
                <div className="bg-zinc-900 p-3 rounded">
                  <Label className="text-xs">Already Paid</Label>
                  <div className="text-lg font-bold text-green-400">{formatCurrency(selectedInvoice.paidAmount)}</div>
                </div>
                <div className="bg-zinc-900 p-3 rounded">
                  <Label className="text-xs">Outstanding Amount</Label>
                  <div className="text-lg font-bold text-red-400">{formatCurrency(selectedInvoice.pendingAmount)}</div>
                </div>
              </div>

              {/* Payment Update Form */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="payment-amount">Outstanding Amount to Pay *</Label>
                  <Input
                    id="payment-amount"
                    type="number"
                    step="0.01"
                    min="0"
                    max={selectedInvoice.pendingAmount}
                    value={paymentAmount}
                    onChange={(e) => {
                      setPaymentAmount(e.target.value);
                      // Clear validation error when user starts typing
                      if (validationErrors.paymentAmount) {
                        setValidationErrors(prev => ({ ...prev, paymentAmount: '' }));
                      }
                    }}
                    className={`bg-zinc-900 border-zinc-700 text-white ${validationErrors.paymentAmount ? 'border-red-500' : ''}`}
                    placeholder="Enter amount to pay now"
                  />
                  {validationErrors.paymentAmount && (
                    <div className="text-red-400 text-xs mt-1">{validationErrors.paymentAmount}</div>
                  )}
                  <div className="text-xs text-zinc-500 mt-1">
                    Enter the amount being paid now (max: {formatCurrency(selectedInvoice.pendingAmount)})
                  </div>
                  
                  {/* Quick Payment Buttons for Installments */}
                  {selectedInvoice.installmentDates && selectedInvoice.installmentDates.length > 0 && (
                    <div className="mt-2">
                      <div className="text-xs text-zinc-400 mb-1">Quick Pay Options:</div>
                      <div className="flex gap-2 flex-wrap">
                        {selectedInvoice.installmentDates.map((installment, index) => {
                          const cumulativeAmount = selectedInvoice.installmentDates!
                            .slice(0, index + 1)
                            .reduce((sum, inst) => sum + inst.amount, 0);
                          
                          // Calculate remaining amount for this installment
                          const remainingForInstallment = Math.max(0, cumulativeAmount - selectedInvoice.paidAmount);
                          // Round to 2 decimal places
                          const roundedRemaining = Math.round(remainingForInstallment * 100) / 100;
                          
                          if (roundedRemaining <= 0) return null;
                          
                          return (
                            <Button
                              key={index}
                              type="button"
                              size="sm"
                              variant="outline"
                              className="text-xs border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                              onClick={() => setPaymentAmount(roundedRemaining.toString())}
                            >
                              Pay Inst. {installment.installmentNumber} ({formatCurrency(roundedRemaining)})
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  {/* Always show Pay Full Outstanding button */}
                  <div className="mt-2">
                    <div className="text-xs text-zinc-400 mb-1">Quick Pay Full Amount:</div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="manual"
                        className="text-xs"
                        onClick={() => {
                          if (selectedInvoice && selectedInvoice.pendingAmount > 0) {
                            const roundedAmount = Math.round(selectedInvoice.pendingAmount * 100) / 100;
                            setPaymentAmount(roundedAmount.toString());
                          }
                        }}
                      >
                        Pay Full Outstanding ({selectedInvoice ? formatCurrency(selectedInvoice.pendingAmount) : '₹0'})
                      </Button>
                    </div>
                  </div>
                </div>
                <div>
                  <Label htmlFor="payment-mode">Payment Mode *</Label>
                  <Select 
                    value={paymentMode} 
                    onValueChange={(value) => {
                      setPaymentMode(value);
                      // Clear validation error when user selects
                      if (validationErrors.paymentMode) {
                        setValidationErrors(prev => ({ ...prev, paymentMode: '' }));
                      }
                    }}
                  >
                    <SelectTrigger className={`bg-zinc-900 border-zinc-700 text-white ${validationErrors.paymentMode ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder="Select payment mode" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-700">
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="credit_card">Credit Card</SelectItem>
                      <SelectItem value="debit_card">Debit Card</SelectItem>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                      <SelectItem value="upi">UPI</SelectItem>
                      <SelectItem value="cheque">Cheque</SelectItem>
                    </SelectContent>
                  </Select>
                  {validationErrors.paymentMode && (
                    <div className="text-red-400 text-xs mt-1">{validationErrors.paymentMode}</div>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="paid-date">Payment Date (Optional)</Label>
                <Input
                  id="paid-date"
                  type="date"
                  value={paidDate}
                  max={new Date().toISOString().split('T')[0]} // Prevent future dates
                  onChange={(e) => {
                    setPaidDate(e.target.value);
                    // Clear validation error when user changes date
                    if (validationErrors.paidDate) {
                      setValidationErrors(prev => ({ ...prev, paidDate: '' }));
                    }
                  }}
                  className={`bg-zinc-900 border-zinc-700 text-white ${validationErrors.paidDate ? 'border-red-500' : ''}`}
                />
                {validationErrors.paidDate && (
                  <div className="text-red-400 text-xs mt-1">{validationErrors.paidDate}</div>
                )}
                <div className="text-xs text-zinc-500 mt-1">
                  Leave empty to use current date. Cannot be a future date.
                </div>
              </div>

              {/* Payment Screenshot Upload */}
              <div>
                <Label>Payment Screenshot (Optional)</Label>
                <div className="mt-2">
                  {!paymentScreenshotPreview ? (
                    <div className="border-2 border-dashed border-zinc-700 rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
                      <p className="text-zinc-400 mb-2">Upload payment screenshot</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePaymentScreenshotUpload}
                        className="hidden"
                        id="payment-screenshot-upload"
                      />
                      <label
                        htmlFor="payment-screenshot-upload"
                        className="cursor-pointer bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-md transition-colors"
                      >
                        Choose File
                      </label>
                      <p className="text-xs text-zinc-500 mt-2">Max file size: 5MB</p>
                    </div>
                  ) : (
                    <div className="relative">
                      <img
                        src={paymentScreenshotPreview}
                        alt="Payment Screenshot"
                        className="max-w-xs max-h-48 rounded-lg border border-zinc-700"
                      />
                      <button
                        onClick={removePaymentScreenshot}
                        className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Calculation Preview */}
              {paymentAmount && (
                <div className="bg-zinc-900 p-4 rounded-lg">
                  <Label className="text-sm font-bold mb-2 block">Payment Preview</Label>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-zinc-400">Amount Being Paid:</span>
                      <span className="float-right text-green-400 font-bold">
                        {formatCurrency(Math.round((parseFloat(paymentAmount) || 0) * 100) / 100)}
                      </span>
                    </div>
                    <div>
                      <span className="text-zinc-400">New Total Paid:</span>
                      <span className="float-right text-green-400 font-bold">
                        {formatCurrency(Math.round((selectedInvoice.paidAmount + (parseFloat(paymentAmount) || 0)) * 100) / 100)}
                      </span>
                    </div>
                    <div>
                      <span className="text-zinc-400">Remaining Balance:</span>
                      <span className="float-right text-red-400 font-bold">
                        {formatCurrency(Math.round((selectedInvoice.pendingAmount - (parseFloat(paymentAmount) || 0)) * 100) / 100)}
                      </span>
                    </div>
                    <div className="col-span-2 pt-2 border-t border-zinc-700">
                      <span className="text-zinc-400">New Status:</span>
                      <span className="float-right font-bold">
                        {(selectedInvoice.paidAmount + (parseFloat(paymentAmount) || 0)) >= selectedInvoice.totalAmount ? (
                          <span className="text-green-400">PAID</span>
                        ) : (selectedInvoice.paidAmount + (parseFloat(paymentAmount) || 0)) > selectedInvoice.paidAmount ? (
                          <span className="text-yellow-400">PARTIAL</span>
                        ) : (
                          <span className="text-red-400">DUE</span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              onClick={() => {
                setIsUpdateDialogOpen(false);
                setPaymentAmount('');
                setPaymentMode('online');
                setPaidDate('');
                setValidationErrors({});
                setSelectedInvoice(null);
                // Clear screenshot states
                setPaymentScreenshot(null);
                setPaymentScreenshotPreview(null);
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="manual" 
              onClick={handleUpdatePayment}
            >
              Update Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-black border-zinc-800 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-400">Delete Invoice</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Are you sure you want to delete this invoice? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {invoiceToDelete && (
            <div className="space-y-4">
              <div className="bg-zinc-900 p-4 rounded-lg">
                <div className="text-sm">
                  <div className="font-medium text-white">Invoice: {invoiceToDelete.invoiceNumber}</div>
                  <div className="text-zinc-400">Customer: {invoiceToDelete.customerDetails.name}</div>
                  <div className="text-zinc-400">Course: {invoiceToDelete.courseDetails.title}</div>
                  <div className="text-zinc-400">Amount: {formatCurrency(invoiceToDelete.totalAmount)}</div>
                </div>
              </div>
              
              <div className="bg-red-900/20 border border-red-700 p-3 rounded-lg">
                <div className="text-red-400 text-sm font-medium">⚠️ Warning</div>
                <div className="text-red-300 text-xs mt-1">
                  This will permanently delete the invoice and all associated payment records.
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setInvoiceToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="outline"
              className="border-red-700 text-red-400 hover:bg-red-900/20"
              onClick={handleDeleteInvoice}
            >
              Delete Invoice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Screenshot Dialog */}
      <Dialog open={isScreenshotDialogOpen} onOpenChange={setIsScreenshotDialogOpen}>
        <DialogContent className="bg-black border-zinc-800 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Payment Screenshot</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Payment screenshot for invoice {selectedInvoice?.invoiceNumber}
            </DialogDescription>
          </DialogHeader>
          
          {selectedInvoice?.paymentScreenshot && (
            <div className="flex justify-center">
              <img
                src={selectedInvoice.paymentScreenshot}
                alt="Payment Screenshot"
                className="max-w-full max-h-96 rounded-lg border border-zinc-700"
              />
            </div>
          )}
          
          <DialogFooter>
            <Button
              variant="outline"
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              onClick={() => setIsScreenshotDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remark Dialog */}
      <Dialog open={isRemarkDialogOpen} onOpenChange={setIsRemarkDialogOpen}>
        <DialogContent className="bg-black border-zinc-800 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>Add/Edit Remark</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Add or edit a remark for invoice {selectedInvoiceForRemark?.invoiceNumber}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="remark-text">Remark</Label>
              <textarea
                id="remark-text"
                value={remarkText}
                onChange={(e) => setRemarkText(e.target.value)}
                className="w-full p-3 bg-zinc-900 border border-zinc-700 text-white rounded-lg resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                rows={4}
                placeholder="Enter remark for this invoice..."
                maxLength={500}
              />
              <div className="text-xs text-zinc-500 mt-1">
                {remarkText.length}/500 characters
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              onClick={() => {
                setIsRemarkDialogOpen(false);
                setRemarkText('');
                setSelectedInvoiceForRemark(null);
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="manual" 
              onClick={handleUpdateRemark}
              disabled={remarkText.trim() === (selectedInvoiceForRemark?.remark || '')}
            >
              Save Remark
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </React.Fragment>
  );
};

export default InvoicesDashboard;