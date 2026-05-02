import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { UserContext } from '@/context/userContext';
import SignOut from '@/src/account/common/SignOut';
import AdminLoader from '@/src/account/common/AdminLoader';
import UnauthorizedAccess from '@/src/account/common/UnauthorizedAccess';
import AdminSidebar from '@/src/account/common/AdminSidebar';
import AdminTopBar from '@/src/account/common/AdminTopBar';
import { ArrowLeftIcon } from '@radix-ui/react-icons';
import { generateReceiptNumber } from '@/utils/receiptGenerator';
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

interface Course {
  _id: string;
  title: string;
  category: string;
  duration: string;
  level: string;
  price: number;
}

const CreateSimpleInvoice = () => {
  const router = useRouter();
  const { authenticated, loading, isAdmin, checkAccountantAccess, setCurrentTab } = useContext(UserContext);

  // Form Data
  const [formData, setFormData] = useState({
    // Customer Details
    name: '',
    email: '',
    phone: '',
    
    // Course Selection
    selectedCourse: '',
    
    // Payment Details
    feeType: 'Full Payment',
    paymentMode: 'online',
    paidAmount: 0,
    paidDate: '',
    dueDate: ''
  });

  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseData, setSelectedCourseData] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (authenticated) {
      setCurrentTab("invoices");
      fetchCourses();
    }
  }, [authenticated]);

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/course/fetch');
      const data = await res.json();
      
      if (res.ok) {
        setCourses(Array.isArray(data) ? data : []);
      } else {
        throw new Error(data.message || 'Failed to fetch courses');
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      toast.error('Failed to fetch courses');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCourseSelect = (courseId: string) => {
    const course = courses.find(c => c._id === courseId);
    if (course) {
      setSelectedCourseData(course);
      setFormData(prev => ({ 
        ...prev, 
        selectedCourse: courseId 
      }));
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateTotal = () => {
    return selectedCourseData?.price || 0;
  };

  const calculateBalance = () => {
    return calculateTotal() - formData.paidAmount;
  };

  const handleCreateInvoice = async () => {
    // Validation
    if (!formData.name.trim()) {
      toast.error('Customer name is required');
      return;
    }
    if (!formData.email.trim()) {
      toast.error('Customer email is required');
      return;
    }
    if (!formData.phone.trim()) {
      toast.error('Customer phone is required');
      return;
    }
    if (!selectedCourseData) {
      toast.error('Please select a course');
      return;
    }

    setIsCreating(true);
    try {
      const invoiceData = {
        customerDetails: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          studentId: `TP${Date.now().toString().slice(-6)}`
        },
        courseDetails: {
          title: selectedCourseData.title,
          category: selectedCourseData.category,
          duration: selectedCourseData.duration,
          level: selectedCourseData.level
        },
        items: [{
          description: `${selectedCourseData.title} - ${formData.feeType}`,
          quantity: 1,
          unitPrice: selectedCourseData.price,
          amount: selectedCourseData.price
        }],
        tax: 0,
        paymentMode: formData.paymentMode,
        feeType: formData.feeType,
        paidAmount: formData.paidAmount,
        paidDate: formData.paidDate || null,
        dueDate: formData.feeType !== 'Full Payment' ? formData.dueDate || null : null
      };

      const res = await fetch('/api/invoice/create-manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoiceData)
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success('Invoice created successfully!');
        setTimeout(() => {
          router.push('/admin/dashboard/invoices');
        }, 1000);
      } else {
        throw new Error(data.error || 'Failed to create invoice');
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to create invoice';
      console.error('Error creating invoice:', errorMsg);
      toast.error(errorMsg);
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
                  <h2 className="text-2xl font-bold text-white">Create Invoice</h2>
                </div>
              </div>

              {/* Invoice Preview Card */}
              <div className="max-w-4xl mx-auto">
                <div className="bg-white text-black rounded-lg overflow-hidden shadow-2xl">
                  
                  {/* Header with Logo */}
                  <div className="relative bg-gradient-to-r from-gray-800 to-red-600 text-white p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <div className="bg-white text-gray-800 p-3 rounded-lg mr-4">
                          <div className="text-2xl font-bold">tp</div>
                          <div className="text-xs">tech pratham</div>
                          <div className="text-xs">Technology First</div>
                        </div>
                        <div className="text-sm">
                          <div>📍 Noida, Uttar Pradesh 201301</div>
                          <div>📞 +91-8882786865</div>
                          <div>✉️ accounts@techpratham.com</div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="bg-red-600 text-white px-6 py-2 rounded-l-full mb-2">
                          <h1 className="text-2xl font-bold">FEE RECEIPT</h1>
                        </div>
                        <div className="text-sm">
                          <div><strong>Receipt No:</strong> {generateReceiptNumber()}</div>
                          <div><strong>Receipt Date:</strong> {new Date().toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Receipt To Section */}
                  <div className="p-6">
                    <h3 className="text-red-600 font-bold mb-2">RECEIPT TO:</h3>
                    
                    {/* Customer Name */}
                    <div className="mb-4">
                      <Input
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="text-2xl font-bold border-0 border-b-2 border-gray-300 rounded-none bg-transparent focus:border-red-600 p-2"
                        placeholder="Enter Customer Name"
                      />
                    </div>
                    
                    {/* Details Grid */}
                    <div className="grid grid-cols-3 gap-4 bg-gray-100 p-4 rounded mb-6">
                      <div>
                        <div className="text-xs text-gray-600 mb-1">MAIL ID</div>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="border-0 bg-transparent p-1 font-medium"
                          placeholder="customer@email.com"
                        />
                      </div>
                      <div>
                        <div className="text-xs text-gray-600 mb-1">Course</div>
                        <Select value={formData.selectedCourse} onValueChange={handleCourseSelect}>
                          <SelectTrigger className="border-0 bg-transparent p-1 font-medium">
                            <SelectValue placeholder="Select Course" />
                          </SelectTrigger>
                          <SelectContent>
                            {courses.map((course) => (
                              <SelectItem key={course._id} value={course._id}>
                                {course.title} - ₹{course.price?.toLocaleString('en-IN')}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600 mb-1">Fees Type</div>
                        <Select value={formData.feeType} onValueChange={(value) => handleInputChange('feeType', value)}>
                          <SelectTrigger className="border-0 bg-transparent p-1 font-medium">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Full Payment">Full Payment</SelectItem>
                            <SelectItem value="2 Installments">2 Installments</SelectItem>
                            <SelectItem value="3 Installments">3 Installments</SelectItem>
                            <SelectItem value="4 Installments">4 Installments</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600 mb-1">Mobile Number</div>
                        <Input
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="border-0 bg-transparent p-1 font-medium"
                          placeholder="+91 9876543210"
                        />
                      </div>
                      <div>
                        <div className="text-xs text-gray-600 mb-1">Student Id</div>
                        <div className="p-1 font-medium text-gray-500">Auto-generated</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600 mb-1">Payment Mode</div>
                        <Select value={formData.paymentMode} onValueChange={(value) => handleInputChange('paymentMode', value)}>
                          <SelectTrigger className="border-0 bg-transparent p-1 font-medium">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="online">Online</SelectItem>
                            <SelectItem value="cash">Cash</SelectItem>
                            <SelectItem value="upi">UPI</SelectItem>
                            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                            <SelectItem value="cheque">Cheque</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {formData.feeType !== 'Full Payment' && (
                        <div>
                          <div className="text-xs text-gray-600 mb-1">Next Due Date</div>
                          <Input
                            type="date"
                            value={formData.dueDate}
                            onChange={(e) => handleInputChange('dueDate', e.target.value)}
                            className="border-0 bg-transparent p-1 font-medium"
                          />
                        </div>
                      )}
                      <div>
                        <div className="text-xs text-gray-600 mb-1">Paid Date</div>
                        <Input
                          type="date"
                          value={formData.paidDate}
                          onChange={(e) => handleInputChange('paidDate', e.target.value)}
                          className="border-0 bg-transparent p-1 font-medium"
                        />
                      </div>
                      <div>
                        <div className="text-xs text-gray-600 mb-1">Amount Paid (₹)</div>
                        <Input
                          type="number"
                          min="0"
                          value={formData.paidAmount}
                          onChange={(e) => handleInputChange('paidAmount', parseFloat(e.target.value) || 0)}
                          className="border-0 bg-transparent p-1 font-medium"
                          placeholder="0"
                        />
                      </div>
                    </div>

                    {/* Payment Table */}
                    {selectedCourseData && (
                      <div className="mb-6">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-red-600 text-white">
                              <th className="border border-gray-300 p-3 text-left">Pay Components</th>
                              <th className="border border-gray-300 p-3 text-right">Amount (₹)</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="bg-gray-50">
                              <td className="border border-gray-300 p-3">
                                {selectedCourseData.title} - {formData.feeType}
                              </td>
                              <td className="border border-gray-300 p-3 text-right font-bold">
                                ₹ {selectedCourseData.price?.toLocaleString('en-IN')}
                              </td>
                            </tr>
                            <tr className="bg-gray-100">
                              <td className="border border-gray-300 p-3 font-bold">Net Amount</td>
                              <td className="border border-gray-300 p-3 text-right font-bold">
                                ₹ {calculateTotal().toLocaleString('en-IN')}
                              </td>
                            </tr>
                            <tr className="bg-gray-100">
                              <td className="border border-gray-300 p-3 font-bold">Amount Paid</td>
                              <td className="border border-gray-300 p-3 text-right font-bold">
                                ₹ {formData.paidAmount.toLocaleString('en-IN')}
                              </td>
                            </tr>
                            <tr className="bg-gray-100">
                              <td className="border border-gray-300 p-3 font-bold">Balance Due</td>
                              <td className="border border-gray-300 p-3 text-right font-bold">
                                ₹ {calculateBalance().toLocaleString('en-IN')}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Signature */}
                    <div className="mb-6">
                      <div className="font-bold">Bharat sahai</div>
                      <div className="text-sm text-gray-600">Authorised Signature</div>
                    </div>

                    {/* Terms */}
                    <div className="mb-6">
                      <h4 className="font-bold mb-2">Terms & Conditions:</h4>
                      <div className="text-sm text-gray-600">
                        <div>Fee Once Paid will not be Refunded Back in Any Case</div>
                        <div>This is E-Invoice, Signature Not Required For any query pls write us <span className="text-blue-600">accounts@techpratham.com</span></div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center mt-8">
                      <div className="flex items-center justify-center mb-2">
                        <div className="bg-gray-800 text-white p-2 rounded mr-2">
                          <div className="text-sm font-bold">tp</div>
                        </div>
                        <div className="text-sm text-gray-600">tech pratham</div>
                      </div>
                      <div className="text-lg font-bold text-gray-800">Thank you!</div>
                      <div className="text-sm text-gray-600">for with joining us</div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 mt-6 justify-center">
                  <Button
                    onClick={handleCreateInvoice}
                    disabled={isCreating || !selectedCourseData || !formData.name || !formData.email}
                    variant="manual"
                    className="px-8 py-3"
                  >
                    {isCreating ? 'Creating Invoice...' : 'Create Invoice'}
                  </Button>
                  
                  <Link href="/admin/dashboard/invoices">
                    <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 px-8 py-3">
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

export default CreateSimpleInvoice;