import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import StudentLayout from '@/src/student/common/StudentLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';
import { toast } from 'sonner';

interface Invoice {
  _id: string;
  invoiceNumber: string;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  status: string;
  invoiceDate: string;
  dueDate?: string;
  courseDetails: {
    title: string;
    category: string;
  };
  feeType: string;
}

const StudentInvoices = () => {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [studentId, setStudentId] = useState('');

  useEffect(() => {
    const storedData = sessionStorage.getItem('studentAuth');
    if (!storedData) {
      router.push('/student/login');
      return;
    }

    const student = JSON.parse(storedData);
    setStudentId(student.studentId);
    fetchInvoices(student.studentId);
  }, []);

  const fetchInvoices = async (studentId: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/student/dashboard?studentId=${studentId}`);
      const data = await res.json();

      if (res.ok) {
        setInvoices(data.data.invoices);
      } else {
        toast.error(data.error || 'Failed to fetch invoices');
      }
    } catch (error) {
      console.error('Invoices fetch error:', error);
      toast.error('Failed to load invoices');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'partial':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'due':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'overdue':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handleDownloadInvoice = (invoiceId: string, customerName: string) => {
    // Open the invoice page in a new tab, which has the download functionality
    window.open(`/invoice/${invoiceId}`, '_blank');
  };

  if (isLoading) {
    return (
      <StudentLayout>
        <div className="p-6 flex items-center justify-center">
          <p className="text-gray-600">Loading invoices...</p>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="p-6 space-y-6">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
          <h1 className="text-3xl font-bold">Invoices</h1>
          <p className="text-blue-100 mt-2">View and manage your payment invoices</p>
        </div>

        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              All Invoices ({invoices.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {invoices.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No invoices found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left text-gray-600 font-medium p-3">Invoice #</th>
                      <th className="text-left text-gray-600 font-medium p-3">Course</th>
                      <th className="text-left text-gray-600 font-medium p-3">Date</th>
                      <th className="text-left text-gray-600 font-medium p-3">Total Amount</th>
                      <th className="text-left text-gray-600 font-medium p-3">Paid</th>
                      <th className="text-left text-gray-600 font-medium p-3">Pending</th>
                      <th className="text-left text-gray-600 font-medium p-3">Status</th>
                      <th className="text-left text-gray-600 font-medium p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((invoice) => (
                      <tr key={invoice._id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-3 text-gray-900 font-medium">{invoice.invoiceNumber}</td>
                        <td className="p-3">
                          <div>
                            <p className="text-gray-900 font-medium">{invoice.courseDetails.title}</p>
                            <p className="text-gray-500 text-xs">{invoice.courseDetails.category}</p>
                          </div>
                        </td>
                        <td className="p-3 text-gray-900">
                          {new Date(invoice.invoiceDate).toLocaleDateString()}
                        </td>
                        <td className="p-3 text-gray-900 font-medium">
                          ₹{invoice.totalAmount.toLocaleString()}
                        </td>
                        <td className="p-3 text-green-600 font-medium">
                          ₹{invoice.paidAmount.toLocaleString()}
                        </td>
                        <td className="p-3 text-red-600 font-medium">
                          ₹{invoice.pendingAmount.toLocaleString()}
                        </td>
                        <td className="p-3">
                          <Badge className={getStatusColor(invoice.status)}>
                            {invoice.status.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownloadInvoice(invoice._id, invoice.courseDetails.title)}
                            className="flex items-center gap-1"
                          >
                            <Download className="h-3 w-3" />
                            Download
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </StudentLayout>
  );
};

export default StudentInvoices;
