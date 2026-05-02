import React, { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { UserContext } from '@/context/userContext';
import SignOut from '@/src/account/common/SignOut';
import AdminLoader from '@/src/account/common/AdminLoader';
import UnauthorizedAccess from '@/src/account/common/UnauthorizedAccess';
import AdminSidebar from '@/src/account/common/AdminSidebar';
import AdminTopBar from '@/src/account/common/AdminTopBar';
import { ArrowLeft, Plus, Trash2, Upload, X } from 'lucide-react';
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

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
  studentId: string;
}

interface CourseDetails {
  title: string;
  price: number;
}

const CreateManualInvoice = () => {
  const router = useRouter();
  const { authenticated, loading, isAdmin, checkAccountantAccess, setCurrentTab } = useContext(UserContext);

  // Customer Information
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    name: '',
    email: '',
    phone: '',
    studentId: ''
  });

  // Course Information
  const [courseDetails, setCourseDetails] = useState<CourseDetails>({
    title: '',
    price: 0
  });

  // Payment Details
  const [feeType, setFeeType] = useState('Full Payment');
  const [paymentMode, setPaymentMode] = useState('online');
  const [paidAmount, setPaidAmount] = useState(0);
  const [paidDate, setPaidDate] = useState('');
  const [nextPaymentDate, setNextPaymentDate] = useState('');

  // Sales Person
  const [salesPerson, setSalesPerson] = useState('none');
  const [salesPersons, setSalesPersons] = useState<Array<{_id: string, name: string}>>([]);
  const [isLoadingSalesPersons, setIsLoadingSalesPersons] = useState(false);

  // Payment Screenshot
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);

  // Installment Details
  const [installmentDates, setInstallmentDates] = useState<Array<{
    installmentNumber: number;
    dueDate: string;
    amount: number;
  }>>([]);

  const [isCreating, setIsCreating] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editInvoiceId, setEditInvoiceId] = useState<string | null>(null);

  React.useEffect(() => {
    if (authenticated) {
      setCurrentTab("invoices");
      
      // Fetch sales persons for sales person dropdown
      fetchSalesPersons();
      
      // Check if we're in edit mode
      const urlParams = new URLSearchParams(window.location.search);
      const editId = urlParams.get('edit');
      
      if (editId) {
        setIsEditing(true);
        setEditInvoiceId(editId);
        fetchInvoiceForEdit(editId);
      } else {
        // Auto-generate student ID for new invoices
        generateStudentId();
        
        // Pre-fill form from URL parameters for new invoices
        if (urlParams.get('customerName')) {
          setCustomerDetails(prev => ({
            ...prev,
            name: urlParams.get('customerName') || '',
            email: urlParams.get('customerEmail') || '',
            phone: urlParams.get('customerPhone') || ''
          }));
        }
        
        if (urlParams.get('courseTitle')) {
          setCourseDetails(prev => ({
            ...prev,
            title: urlParams.get('courseTitle') || ''
          }));
        }
      }
    }
  }, [authenticated]);

  const fetchSalesPersons = async () => {
    setIsLoadingSalesPersons(true);
    try {
      const res = await fetch('/api/sales-persons');
      if (res.ok) {
        const salesPersonsData = await res.json();
        setSalesPersons(salesPersonsData);
      } else {
        console.error('Failed to fetch sales persons');
      }
    } catch (error) {
      console.error('Error fetching sales persons:', error);
    } finally {
      setIsLoadingSalesPersons(false);
    }
  };

  const generateStudentId = () => {
    const timestamp = Date.now();
    const studentId = `TP${timestamp.toString().slice(-6)}`;
    setCustomerDetails(prev => ({ ...prev, studentId }));
  };

  const fetchInvoiceForEdit = async (invoiceId: string) => {
    try {
      console.log('Fetching invoice for edit:', invoiceId);
      const res = await fetch(`/api/invoice/fetch?invoiceId=${invoiceId}`);
      const data = await res.json();
      
      if (data.success && data.invoice) {
        const invoice = data.invoice;
        console.log('Invoice data received:', invoice);
        
        // Pre-fill customer details
        setCustomerDetails({
          name: invoice.customerDetails.name || '',
          email: invoice.customerDetails.email || '',
          phone: invoice.customerDetails.phone || '',
          studentId: invoice.customerDetails.studentId || ''
        });
        
        // Pre-fill course details
        setCourseDetails({
          title: invoice.courseDetails.title || '',
          price: invoice.totalAmount || 0
        });
        
        // Pre-fill payment details
        setFeeType(invoice.feeType || 'Full Payment');
        setPaymentMode(invoice.paymentMode || 'online');
        setPaidAmount(invoice.paidAmount || 0);
        
        // Pre-fill dates
        if (invoice.paidDate) {
          const paidDateStr = new Date(invoice.paidDate).toISOString().split('T')[0];
          setPaidDate(paidDateStr);
          console.log('Set paid date:', paidDateStr);
        }
        
        if (invoice.dueDate) {
          const dueDateStr = new Date(invoice.dueDate).toISOString().split('T')[0];
          setNextPaymentDate(dueDateStr);
          console.log('Set due date:', dueDateStr);
        }
        
        // Pre-fill installment dates if they exist
        if (invoice.installmentDates && invoice.installmentDates.length > 0) {
          const installments = invoice.installmentDates.map((installment: any) => ({
            installmentNumber: installment.installmentNumber,
            dueDate: new Date(installment.dueDate).toISOString().split('T')[0],
            amount: installment.amount
          }));
          setInstallmentDates(installments);
          console.log('Set installment dates:', installments);
        }

        // Load payment screenshot if exists
        if (invoice.paymentScreenshot) {
          setScreenshotPreview(invoice.paymentScreenshot);
        }
        
        // Load sales person if exists
        if (invoice.salesPerson) {
          setSalesPerson(invoice.salesPerson);
        } else {
          setSalesPerson('none');
        }
        
        toast.success('Invoice data loaded successfully');
      } else {
        throw new Error(data.error || 'Invoice not found');
      }
    } catch (error) {
      console.error('Error fetching invoice for edit:', error);
      toast.error('Failed to load invoice data. Redirecting to invoices list.');
      setTimeout(() => {
        router.push('/admin/dashboard/invoices');
      }, 2000);
    }
  };

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        setScreenshotPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeScreenshot = () => {
    setPaymentScreenshot(null);
    setScreenshotPreview(null);
  };

  const calculateTotal = () => {
    return courseDetails.price || 0;
  };

  const calculateRemainingAmount = () => {
    return Math.max(0, calculateTotal() - paidAmount);
  };

  const handleFeeTypeChange = (newFeeType: string) => {
    setFeeType(newFeeType);
    
    if (newFeeType === 'Full Payment') {
      // For full payment, automatically set paid amount to course price
      setPaidAmount(courseDetails.price);
      setNextPaymentDate('');
      setInstallmentDates([]);
    } else if (newFeeType === '2 Installments') {
      // For 2 installments: first payment is current paid amount, second payment is remaining amount
      const totalAmount = calculateTotal();
      const remainingAmount = totalAmount - paidAmount;
      
      // Set next payment date to next day
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + 1);
      setNextPaymentDate(nextDate.toISOString().split('T')[0]);
      
      // Generate installment schedule
      const installments = [
        {
          installmentNumber: 1,
          dueDate: new Date().toISOString().split('T')[0], // Today
          amount: paidAmount
        },
        {
          installmentNumber: 2,
          dueDate: nextDate.toISOString().split('T')[0],
          amount: remainingAmount
        }
      ];
      
      setInstallmentDates(installments);
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

    // Customer validation
    if (!customerDetails.name.trim()) newErrors.push('Customer name is required');
    if (!customerDetails.email.trim()) newErrors.push('Customer email is required');
    if (!customerDetails.phone.trim()) newErrors.push('Customer phone is required');
    if (!customerDetails.studentId.trim()) newErrors.push('Student ID is required');

    // Course validation
    if (!courseDetails.title.trim()) newErrors.push('Course title is required');
    if (courseDetails.price <= 0) newErrors.push('Course price must be greater than 0');

    // Sales Person validation
    if (!salesPerson || salesPerson === 'none') newErrors.push('Sales Person selection is required');

    // Payment Mode validation
    if (!paymentMode) newErrors.push('Payment mode is required');

    // Fee Type validation
    if (!feeType) newErrors.push('Fee type is required');

    // Payment Date validation
    if (!paidDate) newErrors.push('Payment date is required');

    // Payment Screenshot validation
    if (!paymentScreenshot && !screenshotPreview) newErrors.push('Payment screenshot is required');

    // Payment validation based on fee type
    if (feeType === 'Full Payment') {
      // For full payment, amount paid must equal course price
      if (paidAmount !== courseDetails.price) {
        newErrors.push(`For Full Payment, amount paid must equal course price (₹${courseDetails.price.toLocaleString('en-IN')}). Either pay the full amount or select "2 Installments".`);
      }
    } else if (feeType === '2 Installments') {
      // For installments, validate partial payment
      if (paidAmount <= 0) newErrors.push('First installment amount must be greater than 0');
      if (paidAmount >= courseDetails.price) newErrors.push('First installment cannot be equal to or greater than total price');
      if (!nextPaymentDate) {
        newErrors.push('Next payment date is required for installments');
      } else {
        // Validate that next payment date is in the future
        const nextDate = new Date(nextPaymentDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to start of today
        
        if (nextDate <= today) {
          newErrors.push('Next payment date must be a future date');
        }
      }
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const uploadScreenshot = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('screenshot', file);
    
    const res = await fetch('/api/upload-payment-screenshot', {
      method: 'POST',
      body: formData
    });
    
    if (!res.ok) {
      throw new Error('Failed to upload screenshot');
    }
    
    const data = await res.json();
    return data.url;
  };

  const handleCreateInvoice = async () => {
    if (!validateForm()) {
      errors.forEach(err => toast.error(err));
      return;
    }

    setIsCreating(true);
    try {
      let screenshotUrl = screenshotPreview;
      
      // Upload screenshot if a new file is selected
      if (paymentScreenshot) {
        console.log('Uploading screenshot file:', paymentScreenshot.name);
        screenshotUrl = await uploadScreenshot(paymentScreenshot);
        console.log('Screenshot uploaded successfully, URL:', screenshotUrl);
      } else {
        console.log('No screenshot file to upload, using existing preview:', screenshotPreview);
      }

      const requestBody = {
        // Customer and course details (no enrollment needed)
        customerDetails,
        courseDetails,
        items: [{
          description: 'Course Fee',
          quantity: 1,
          unitPrice: courseDetails.price,
          amount: courseDetails.price
        }],
        tax: 0,
        paymentMode,
        feeType,
        paidAmount: paidAmount || 0,
        installmentDates: installmentDates.length > 0 ? installmentDates : undefined,
        dueDate: feeType === '2 Installments' ? nextPaymentDate : null,
        paidDate: paidDate || null,
        paymentScreenshot: screenshotUrl,
        salesPerson: salesPerson && salesPerson !== 'none' ? salesPerson : null
      };

      console.log('Final request body being sent:', {
        ...requestBody,
        paymentScreenshot: requestBody.paymentScreenshot
      });

      let res, data;
      
      if (isEditing && editInvoiceId) {
        // Update existing invoice
        res = await fetch('/api/invoice/manage', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            invoiceId: editInvoiceId,
            action: 'update_invoice',
            ...requestBody
          })
        });
      } else {
        // Create new invoice
        res = await fetch('/api/invoice/create-manual', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        });
      }

      data = await res.json();

      if (res.ok && data.success) {
        toast.success(isEditing ? 'Invoice updated successfully!' : 'Invoice created successfully!');
        setTimeout(() => {
          router.push('/admin/dashboard/invoices');
        }, 1000);
      } else {
        // Handle specific error types
        if (res.status === 409) {
          // Conflict error (duplicate)
          toast.error('Invoice number conflict. Please try again in a moment.');
        } else if (res.status === 400) {
          // Validation error
          toast.error(data.error || 'Please check your input and try again.');
        } else {
          toast.error(data.error || `Failed to ${isEditing ? 'update' : 'create'} invoice`);
        }
        throw new Error(data.error || `Failed to ${isEditing ? 'update' : 'create'} invoice`);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : `Failed to ${isEditing ? 'update' : 'create'} invoice`;
      console.error(`Error ${isEditing ? 'updating' : 'creating'} invoice:`, errorMsg);
      toast.error(errorMsg);
      setErrors([errorMsg]);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <React.Fragment>
      <Head>
        <title>{isEditing ? 'Edit Manual Invoice' : 'Create Manual Invoice'} | Admin Dashboard</title>
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
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Invoices
                    </Button>
                  </Link>
                  <h2 className="text-2xl font-bold text-white">
                    {isEditing ? 'Edit Manual Invoice' : 'Create Manual Invoice'}
                  </h2>
                </div>
              </div>

              <div className="max-w-6xl">
                {/* Customer Details */}
                <div className="bg-zinc-900 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Customer Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white">Customer Name *</Label>
                      <Input
                        value={customerDetails.name}
                        onChange={(e) => setCustomerDetails(prev => ({ ...prev, name: e.target.value }))}
                        className="bg-zinc-800 border-zinc-700 text-white"
                        placeholder="Enter customer name"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-white">Email *</Label>
                      <Input
                        type="email"
                        value={customerDetails.email}
                        onChange={(e) => setCustomerDetails(prev => ({ ...prev, email: e.target.value }))}
                        className="bg-zinc-800 border-zinc-700 text-white"
                        placeholder="customer@email.com"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-white">Phone *</Label>
                      <Input
                        value={customerDetails.phone}
                        onChange={(e) => setCustomerDetails(prev => ({ ...prev, phone: e.target.value }))}
                        className="bg-zinc-800 border-zinc-700 text-white"
                        placeholder="+91 9876543210"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-white">Student ID *</Label>
                      <Input
                        value={customerDetails.studentId}
                        onChange={(e) => setCustomerDetails(prev => ({ ...prev, studentId: e.target.value }))}
                        className="bg-zinc-800 border-zinc-700 text-white"
                        placeholder="Auto-generated"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Course Details */}
                <div className="bg-zinc-900 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Course Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white">Course Title *</Label>
                      <Input
                        value={courseDetails.title}
                        onChange={(e) => setCourseDetails(prev => ({ ...prev, title: e.target.value }))}
                        className="bg-zinc-800 border-zinc-700 text-white"
                        placeholder="e.g., Workday HCM Training"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-white">Course Price (₹) *</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={courseDetails.price}
                        onChange={(e) => setCourseDetails(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                        className="bg-zinc-800 border-zinc-700 text-white"
                        placeholder="Enter course price"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Sales Person */}
                <div className="bg-zinc-900 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Sales Information</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label className="text-white">Sales Person *</Label>
                      <Select value={salesPerson} onValueChange={setSalesPerson} required>
                        <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                          <SelectValue placeholder={isLoadingSalesPersons ? "Loading sales persons..." : "Select sales person"} />
                        </SelectTrigger>
                        <SelectContent className="bg-red-700 border-zinc-700">
                          <SelectItem value="none">No Sales Person</SelectItem>
                          {salesPersons.map((person) => (
                            <SelectItem key={person._id} value={person.name}>
                              {person.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="text-xs text-zinc-500 mt-1">
                        This field is for internal tracking only and will not appear on the invoice PDF.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Configuration */}
                <div className="bg-zinc-900 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Payment Configuration</h3>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div>
                      <Label className="text-white">Payment Mode *</Label>
                      <Select value={paymentMode} onValueChange={setPaymentMode} required>
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
                      <Select value={feeType} onValueChange={handleFeeTypeChange} required>
                        <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                          <SelectValue placeholder="Select fee type" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-800 border-zinc-700">
                          <SelectItem value="Full Payment">Full Payment</SelectItem>
                          <SelectItem value="2 Installments">2 Installments</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-white">Amount Paid Today (₹) *</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        max={courseDetails.price}
                        value={paidAmount}
                        onChange={(e) => {
                          const amount = parseFloat(e.target.value) || 0;
                          setPaidAmount(amount);
                          // Recalculate installments if in installment mode
                          if (feeType === '2 Installments') {
                            handleFeeTypeChange('2 Installments');
                          }
                        }}
                        className={`bg-zinc-800 border-zinc-700 text-white ${
                          feeType === 'Full Payment' && paidAmount !== courseDetails.price && paidAmount > 0
                            ? 'border-red-500 focus:border-red-500'
                            : ''
                        }`}
                        placeholder="0.00"
                        required
                      />
                      {/* Real-time validation hint */}
                      {feeType === 'Full Payment' && paidAmount > 0 && paidAmount !== courseDetails.price && (
                        <div className="text-red-400 text-xs mt-1">
                          For Full Payment, amount must be ₹{courseDetails.price.toLocaleString('en-IN')}
                        </div>
                      )}
                      {feeType === 'Full Payment' && paidAmount === courseDetails.price && paidAmount > 0 && (
                        <div className="text-green-400 text-xs mt-1">
                          ✓ Full payment amount correct
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Payment Screenshot Upload */}
                  <div className="mb-6">
                    <Label className="text-white">Payment Screenshot *</Label>
                    <div className="mt-2">
                      {!screenshotPreview ? (
                        <div className="border-2 border-dashed border-zinc-700 rounded-lg p-6 text-center">
                          <Upload className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
                          <p className="text-zinc-400 mb-2">Upload payment screenshot</p>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleScreenshotUpload}
                            className="hidden"
                            id="screenshot-upload"
                            required
                          />
                          <label
                            htmlFor="screenshot-upload"
                            className="cursor-pointer bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-md transition-colors"
                          >
                            Choose File
                          </label>
                          <p className="text-xs text-zinc-500 mt-2">Max file size: 5MB</p>
                        </div>
                      ) : (
                        <div className="relative">
                          <img
                            src={screenshotPreview}
                            alt="Payment Screenshot"
                            className="max-w-xs max-h-48 rounded-lg border border-zinc-700"
                          />
                          <button
                            onClick={removeScreenshot}
                            className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Payment Dates */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label className="text-white">Payment Date *</Label>
                      <Input
                        type="date"
                        value={paidDate}
                        max={new Date().toISOString().split('T')[0]} // Today
                        onChange={(e) => setPaidDate(e.target.value)}
                        className="bg-zinc-800 border-zinc-700 text-white"
                        required
                      />
                      <div className="text-xs text-zinc-500 mt-1">
                        Cannot be a future date
                      </div>
                    </div>
                    {feeType === '2 Installments' && (
                      <div>
                        <Label className="text-white">Next Payment Date *</Label>
                        <Input
                          type="date"
                          value={nextPaymentDate}
                          min={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]} // Tomorrow
                          onChange={(e) => setNextPaymentDate(e.target.value)}
                          className="bg-zinc-800 border-zinc-700 text-white"
                          required
                        />
                        <div className="text-xs text-zinc-500 mt-1">
                          Must be a future date
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Payment Summary */}
                  <div className="grid grid-cols-3 gap-4 p-4 bg-zinc-800 rounded-lg">
                    <div>
                      <Label className="text-xs text-zinc-400">Total Course Price</Label>
                      <div className="text-lg font-bold text-white">₹{courseDetails.price.toLocaleString('en-IN')}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-zinc-400">Amount Paid Today</Label>
                      <div className={`text-lg font-bold ${
                        feeType === 'Full Payment' && paidAmount !== courseDetails.price && paidAmount > 0
                          ? 'text-red-400'
                          : 'text-green-400'
                      }`}>
                        ₹{paidAmount.toLocaleString('en-IN')}
                      </div>
                      {feeType === 'Full Payment' && (
                        <div className="text-xs text-zinc-500">
                          Must equal course price
                        </div>
                      )}
                    </div>
                    <div>
                      <Label className="text-xs text-zinc-400">Remaining Amount</Label>
                      <div className="text-lg font-bold text-red-400">₹{calculateRemainingAmount().toLocaleString('en-IN')}</div>
                      {feeType === 'Full Payment' && calculateRemainingAmount() > 0 && (
                        <div className="text-xs text-red-400">
                          Must be ₹0 for full payment
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Error Messages */}
                {errors.length > 0 && (
                  <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 mb-6">
                    <h4 className="text-red-400 font-medium mb-2">Validation Errors:</h4>
                    <ul className="text-red-300 text-sm space-y-1">
                      {errors.map((error, idx) => (
                        <li key={idx}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-4">
                  <Button
                    onClick={handleCreateInvoice}
                    disabled={isCreating}
                    variant="manual"
                    className="flex-1 max-w-xs"
                  >
                    {isCreating 
                      ? (isEditing ? 'Updating Invoice...' : 'Creating Invoice...') 
                      : (isEditing ? 'Update Invoice' : 'Create Invoice')
                    }
                  </Button>
                  
                  <Link href="/admin/dashboard/invoices">
                    <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                      Cancel
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default CreateManualInvoice;