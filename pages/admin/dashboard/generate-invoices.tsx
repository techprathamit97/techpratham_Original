import React, { useContext, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { UserContext } from '@/context/userContext';
import SignOut from '@/src/account/common/SignOut';
import AdminLoader from '@/src/account/common/AdminLoader';
import AdminSidebar from '@/src/account/common/AdminSidebar';
import AdminTopBar from '@/src/account/common/AdminTopBar';
import { ArrowLeftIcon, CheckIcon } from '@radix-ui/react-icons';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import Head from 'next/head';
import Link from 'next/link';

interface Enrollment {
  _id: string;
  name: string;
  email: string;
  course_title: string;
  totalAmount: number;
  verifyPayment: boolean;
  hasInvoice?: boolean;
}

const GenerateInvoices = () => {
  const { authenticated, loading, isAdmin, setCurrentTab } = useContext(UserContext);

  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [generatingIds, setGeneratingIds] = useState<Set<string>>(new Set());

  const fetchEnrollments = async () => {
    setIsLoading(true);
    try {
      // Fetch enrollments
      const enrollRes = await fetch('/api/course/enrolled?all=true');
      
      // Fetch existing invoices to check which enrollments already have invoices
      const invoiceRes = await fetch('/api/invoice/fetch?limit=1000');
      
      if (enrollRes.ok && invoiceRes.ok) {
        const enrollData = await enrollRes.json();
        const invoiceData = await invoiceRes.json();
        
        const existingInvoiceEnrollmentIds = new Set(
          invoiceData.invoices?.map((inv: any) => inv.enrollmentId) || []
        );
        
        const enrichedEnrollments = enrollData.map((enrollment: Enrollment) => ({
          ...enrollment,
          hasInvoice: existingInvoiceEnrollmentIds.has(enrollment._id)
        }));
        
        setEnrollments(enrichedEnrollments);
      } else {
        const enrollError = enrollRes.ok ? null : await enrollRes.json();
        const invoiceError = invoiceRes.ok ? null : await invoiceRes.json();
        throw new Error(
          enrollError?.message || invoiceError?.error || 'Failed to fetch data'
        );
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
      setCurrentTab("invoices");
    }
  }, [authenticated]);

  const handleGenerateInvoice = async (enrollmentId: string) => {
    setGeneratingIds(prev => new Set(prev).add(enrollmentId));
    
    try {
      const res = await fetch('/api/invoice/auto-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enrollmentId })
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Invoice generated successfully');
        // Update the enrollment to show it now has an invoice
        setEnrollments(prev => 
          prev.map(enrollment => 
            enrollment._id === enrollmentId 
              ? { ...enrollment, hasInvoice: true }
              : enrollment
          )
        );
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error generating invoice:', error);
      toast.error('Failed to generate invoice');
    } finally {
      setGeneratingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(enrollmentId);
        return newSet;
      });
    }
  };

  const handleGenerateAllInvoices = async () => {
    const enrollmentsWithoutInvoices = enrollments.filter(e => !e.hasInvoice);
    
    if (enrollmentsWithoutInvoices.length === 0) {
      toast.info('All enrollments already have invoices');
      return;
    }

    const confirmed = window.confirm(
      `Generate invoices for ${enrollmentsWithoutInvoices.length} enrollments?`
    );
    
    if (!confirmed) return;

    for (const enrollment of enrollmentsWithoutInvoices) {
      await handleGenerateInvoice(enrollment._id);
      // Small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const enrollmentsWithoutInvoices = enrollments.filter(e => !e.hasInvoice);

  return (
    <React.Fragment>
      <Head>
        <title>Generate Invoices | Admin Dashboard</title>
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
                  <Link href="/admin/dashboard/invoices">
                    <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                      <ArrowLeftIcon className="w-4 h-4 mr-2" />
                      Back to Invoices
                    </Button>
                  </Link>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Generate Invoices</h2>
                    <p className="text-zinc-400">Auto-generate invoices for enrollments</p>
                  </div>
                </div>
                
                {enrollmentsWithoutInvoices.length > 0 && (
                  <Button 
                    onClick={handleGenerateAllInvoices}
                    variant="manual"
                    disabled={generatingIds.size > 0}
                  >
                    Generate All ({enrollmentsWithoutInvoices.length})
                  </Button>
                )}
              </div>

              {isLoading ? (
                <div className="min-h-screen flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                </div>
              ) : (
                <div className="bg-zinc-900 rounded-lg overflow-hidden">
                  <div className="p-4 bg-zinc-800 border-b border-zinc-700">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-white">
                        Enrollments ({enrollments.length})
                      </h3>
                      <div className="flex gap-4 text-sm">
                        <span className="text-green-400">
                          With Invoice: {enrollments.filter(e => e.hasInvoice).length}
                        </span>
                        <span className="text-yellow-400">
                          Without Invoice: {enrollmentsWithoutInvoices.length}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-zinc-800">
                        <tr>
                          <th className="text-left p-4 text-white font-medium">Student</th>
                          <th className="text-left p-4 text-white font-medium">Course</th>
                          <th className="text-left p-4 text-white font-medium">Amount</th>
                          <th className="text-left p-4 text-white font-medium">Payment</th>
                          <th className="text-left p-4 text-white font-medium">Invoice</th>
                          <th className="text-left p-4 text-white font-medium">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {enrollments.map((enrollment) => (
                          <tr key={enrollment._id} className="border-b border-zinc-800 hover:bg-zinc-800/50">
                            <td className="p-4">
                              <div className="text-white font-medium">{enrollment.name}</div>
                              <div className="text-zinc-400 text-sm">{enrollment.email}</div>
                            </td>
                            <td className="p-4">
                              <div className="text-white">{enrollment.course_title}</div>
                            </td>
                            <td className="p-4">
                              <div className="text-white font-medium">{formatCurrency(enrollment.totalAmount)}</div>
                            </td>
                            <td className="p-4">
                              {enrollment.verifyPayment ? (
                                <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                                  ✓ Verified
                                </Badge>
                              ) : (
                                <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                                  Pending
                                </Badge>
                              )}
                            </td>
                            <td className="p-4">
                              {enrollment.hasInvoice ? (
                                <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                                  <CheckIcon className="w-3 h-3 mr-1" />
                                  Generated
                                </Badge>
                              ) : (
                                <Badge className="bg-zinc-500/10 text-zinc-500 border-zinc-500/20">
                                  Not Generated
                                </Badge>
                              )}
                            </td>
                            <td className="p-4">
                              {!enrollment.hasInvoice ? (
                                <Button
                                  size="sm"
                                  variant="manual"
                                  onClick={() => handleGenerateInvoice(enrollment._id)}
                                  disabled={generatingIds.has(enrollment._id)}
                                >
                                  {generatingIds.has(enrollment._id) ? 'Generating...' : 'Generate'}
                                </Button>
                              ) : (
                                <span className="text-zinc-500 text-sm">Already generated</span>
                              )}
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
    </React.Fragment>
  );
};

export default GenerateInvoices;