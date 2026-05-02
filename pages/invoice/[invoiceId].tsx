import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, DownloadIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import Image from 'next/image';
interface Invoice {
  _id: string;
  invoiceNumber: string;
  receiptNo: string;
  invoiceDate: string;
  customerDetails: {
    name: string;
    email: string;
    phone: string;
    studentId: string;
  };
  courseDetails: {
    title: string;
    category: string;
    level: string;
  };
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
  }>;
  subtotal: number;
  tax: number;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  feeType: string;
  paymentMode?: string;
  dueDate?: string;
  paidDate?: string;
  installmentDates?: Array<{
    installmentNumber: number;
    dueDate: string;
    amount: number;
  }>;
  isManual?: boolean;
}

const InvoiceViewPage = () => {
  const router = useRouter();
  const { invoiceId } = router.query;

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (invoiceId && typeof invoiceId === 'string') {
      fetchInvoice(invoiceId);
    }
  }, [invoiceId]);

  const fetchInvoice = async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/invoice/fetch?invoiceId=${id}`);
      const data = await res.json();

      if (data.success && data.invoice) {
        setInvoice(data.invoice);
      } else {
        setError(data.error || 'Invoice not found');
      }
    } catch (error) {
      console.error('Failed to fetch invoice:', error);
      setError('Failed to load invoice');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!invoice) return;

    try {
      // Import html2canvas and jsPDF dynamically
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;

      const element = document.getElementById('invoice-template');
      if (!element) return;

      // Hide the action buttons during capture
      const actionButtons = document.querySelectorAll('.no-print');
      actionButtons.forEach(btn => (btn as HTMLElement).style.display = 'none');

      // Capture the invoice as canvas
      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.7);

      const pdf = new jsPDF('p', 'mm', 'a4');

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pageHeight;
      }

      pdf.save(`Invoice-${invoice.customerDetails.name}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invoice Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The requested invoice could not be found.'}</p>
          <Link href="/admin/dashboard/invoices">
            <Button variant="outline" className="flex gap-2">
              <ArrowLeftIcon className="w-4 h-4" />
              Back to Invoices
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <React.Fragment>
      <Head>
        <title>Invoice {invoice.invoiceNumber} | TechPratham</title>
        <meta name="description" content={`Invoice for ${invoice.customerDetails.name} - ${invoice.courseDetails.title}`} />
      </Head>

      <div className="min-h-screen ">
        {/* Header Actions - Hidden in print */}
        <div className="no-print bg-white  sticky top-0 z-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center gap-4">
                <Link href="/admin/dashboard/invoices">
                  <Button variant="outline" className="flex gap-2">
                    <ArrowLeftIcon className="w-4 h-4" />
                    Back to Invoices
                  </Button>
                </Link>
                <h1 className="text-xl font-semibold text-gray-900">
                  Invoice {invoice.invoiceNumber}
                </h1>
              </div>

              <div className="flex gap-2">
                <Button onClick={handlePrint} variant="outline" className="flex gap-2">
                  <DownloadIcon className="w-4 h-4" />
                  Print
                </Button>
                <Button onClick={handleDownloadPDF} variant="manual" className="flex gap-2">
                  <DownloadIcon className="w-4 h-4" />
                  Download PDF
                </Button>
                <Button
                  onClick={() => {
                    router.push('/admin/dashboard/invoices');
                  }}
                  variant="outline"
                  className="flex gap-2 border-red-700 text-red-400 hover:bg-red-900/20"
                >
                  Back to Invoices
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Content with Background Image */}
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div
            id="invoice-template"
            className="relative shadow-2x  overflow-hidden"
            style={{
              backgroundImage: `url('/about/invoicebg.jpeg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'bottom center',
              backgroundRepeat: 'no-repeat',
              width: '210mm',      // ✅ FIXED
              minHeight: '287mm',
              margin: '0 auto'
            }}
          >
            {/* Content Container with Normal Flow */}
            <div className="relative z-0">

              {/* Header Text Content - Normal Flow */}
              <div className="flex justify-between items-start   px-8 pt-8 pb-6 text-white">

                {/* Left Side */}
                <div className="w-64 pr-10 pt- flex items-start relative">
                  <Image
                    src={'/navbar/logotechnolyfirst2.svg'}
                    alt='Techpratham Logo'
                    width={60}
                    height={25}
                    className='w-full h-auto'
                  />

                  <span className="absolute bottom-4 pl-2 left-1/4 text-[8px] text-white">
                    Technology First
                  </span>
                </div>

                {/* Center - Address with vertical line */}
                <div className="text-[10px] text-left border-r mt-4 border-white pr-6">
                  <div className="flex items-center">
                    <span className="mr-2">📍</span>
                    <span>C-2, Block C, Sector 1, Noida, Uttar Pradesh 201301
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">📞</span>
                    <span>+91-8882178896</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">✉️</span>
                    <span>accounts@techpratham.com</span>
                  </div>
                </div>

                {/* Right Side */}
                <div className="text-right w-64 pl-3">
                  <h1 className="text-3xl font-bold">FEE RECEIPT</h1>
                  <div className="text-[10px] mt-5 space-y-1">
                    <div><strong>Receipt No :</strong> {invoice.receiptNo}</div>
                    <div><strong>Receipt Date :</strong> {formatDate(invoice.invoiceDate)}</div>
                  </div>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="px-8">
                {/* RECEIPT TO Section */}
                <div className="mb-1 mt-20">
                  <div className="text-red-600 font-bold text-xs">RECEIPT TO:</div>
                </div>

                {/* Customer Name */}
                <div className="mb-3">
                  <h2 className="text-xl font-bold text-gray-900">{invoice.customerDetails.name}</h2>
                </div>

                {/* Customer Details Table */}
                <div className="mb-4">
                  <table className="w-full border-collapse">
                    <tbody>
                      <tr>
                        <td className="border border-gray-400 pb-3 text-[10px] text-black" style={{ width: '33.33%' }}>
                          <span className="font-semibold">Email Id :</span>{' '}
                          <span className="text-[10px]">{invoice.customerDetails.email}</span>
                        </td>
                        <td className="border border-gray-400 pb-3  text-[10px] text-black" style={{ width: '33.33%' }}>
                          <span className="font-semibold">Course :</span>{' '}
                          <span className="text-[10px]">{invoice.courseDetails.title}</span>
                        </td>
                        <td className="border border-gray-400 pb-3  text-[10px] text-black" style={{ width: '33.33%' }}>
                          <span className="font-semibold">Fees Type :</span>{' '}
                          <span className="text-[10px]">{invoice.feeType}</span>
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-gray-400 pb-3  text-[10px] text-black align-middle">
                          <span className="font-semibold">Mobile Number :</span>{' '}
                          <span className="text-[10px]">{invoice.customerDetails.phone}</span>
                        </td>
                        <td className="border border-gray-400 pb-3  text-[10px] text-black align-middle">
                          <span className="font-semibold">Student Id :</span>{' '}
                          <span className="text-[10px]">{invoice.customerDetails.studentId}</span>
                        </td>
                        <td className="border border-gray-400 pb-3 text-[10px] text-black align-middle">
                          <span className="font-semibold">Next Due Date :-</span>{' '}
                          <span className="text-[10px]">
                            {invoice.pendingAmount > 0 && invoice.dueDate ? formatDate(invoice.dueDate) : 'N.A'}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Payment Components Table */}
                <div className="mb-4">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="border border-gray-400 bg-red-600 text-white p-2 text-left font-bold text-[12px] align-middle">
                          Pay Components
                        </th>
                        <th className="border border-gray-400 bg-red-600 text-white p-2 text-right font-bold text-[12px] align-middle">
                          Amount ( ₹ )
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-400 font-semibold p-2 text-[10px]  text-black align-middle">
                          Course Price
                        </td>
                        <td className="border border-gray-400  p-2 text-[10px] font-bold text-black text-right align-middle">
                          {invoice.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                      {invoice.paidAmount > 0 && (
                        <tr>
                          <td className="border border-gray-400  p-2 text-[10px] font-semibold text-black align-middle">
                            Amount Paid
                          </td>
                          <td className="border border-gray-400  p-2 text-[10px] font-bold text-black text-right align-middle">
                            {invoice.paidAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      )}
                      {invoice.pendingAmount > 0 && (
                        <tr>
                          <td className="border border-gray-400  p-2 text-[10px] font-semibold text-black align-middle">
                            Due Amount
                          </td>
                          <td className="border border-gray-400  p-2 text-[10px] font-bold text-black text-right  align-middle">
                            {invoice.pendingAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Payment Mode and Paid Date */}
                {invoice.paidDate && (
                  <div className="mb-2">
                    <div className="text-[10px] ">
                      <span className="font-semibold">Payment Mode:</span>{' '}
                      {invoice.paymentMode?.replace('_', ' ').toUpperCase() || 'ONLINE'}{' '}
                      |{' '}
                      <span className="font-semibold">Paid Date:</span>{' '}
                      {formatDate(invoice.paidDate)}
                    </div>
                  </div>
                )}

                {/* Signature Section */}


                {/* Terms & Conditions */}
                <div>
                  <div className="text-xs font-bold text-gray-800 mb-1">Terms & Conditions:</div>
                  <div className="text-xs text-black leading-tight">
                    <div>Fee Once Paid will not be Refunded Back in Any Case.</div>
                    <div>
                      This is E-Invoice, Signature Not Required.For any query pls write us{' '}
                      <span className="text-blue-600 underline">accounts@techpratham.com</span>
                    </div>
                  </div>
                </div>
                <div className=" mt-10 text-start">
                  <div className="text-sm font-bold text-gray-800">Thank you!</div>
                  <div className="text-xs text-gray-600">for joining us</div>
                </div>
                <div className="mt-2">
                  <div className="text-sm font-bold text-gray-800">Bharat Sahai</div>
                  <div className="text-xs text-black">Authorised Signature</div>
                </div>
                {/* Thank You Message positioned over the bottom logo */}

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #invoice-template,
          #invoice-template * {
            visibility: visible;
          }
          #invoice-template {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            max-width: none !important;
            margin: 0 !important;
            box-shadow: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </React.Fragment>
  );
};

export default InvoiceViewPage;