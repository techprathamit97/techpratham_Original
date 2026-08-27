import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface PaymentStatus {
  status: 'success' | 'failed' | 'cancelled' | 'error' | 'pending';
  txnid?: string;
  amount?: string;
  message?: string;
}

const normalizePaymentStatus = (value: string | string[] | undefined): PaymentStatus['status'] => {
  const normalizedValue = Array.isArray(value) ? value[0] : value;

  switch (normalizedValue) {
    case 'success':
    case 'failed':
    case 'cancelled':
    case 'error':
    case 'pending':
      return normalizedValue;
    default:
      return 'pending';
  }
};

const PaymentStatusPage = () => {
  const router = useRouter();
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>({ status: 'pending' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (router.isReady) {
      const { status, txnid, amount, message } = router.query;
      
      const normalizedStatus = normalizePaymentStatus(status as string | string[] | undefined);

      setPaymentStatus({
        status: normalizedStatus,
        txnid: Array.isArray(txnid) ? txnid[0] : (txnid as string),
        amount: Array.isArray(amount) ? amount[0] : (amount as string),
        message: Array.isArray(message) ? message[0] : (message as string),
      });
      
      setLoading(false);

      // If we have a transaction ID, verify the payment
      if (txnid && status === 'success') {
        verifyPayment(txnid as string);
      }
    }
  }, [router.isReady, router.query]);

  const verifyPayment = async (txnid: string) => {
    try {
      const response = await fetch('/api/easebuzz/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ txnid }),
      });

      const result = await response.json();
     
    } catch (error) {
      console.error('Payment verification error:', error);
    }
  };

  const getStatusIcon = () => {
    switch (paymentStatus.status) {
      case 'success':
        return '✅';
      case 'failed':
        return '❌';
      case 'cancelled':
        return '⚠️';
      case 'error':
        return '🚫';
      default:
        return '⏳';
    }
  };

  const getStatusMessage = () => {
    switch (paymentStatus.status) {
      case 'success':
        return 'Payment Successful!';
      case 'failed':
        return 'Payment Failed';
      case 'cancelled':
        return 'Payment Cancelled';
      case 'error':
        return 'Payment Error';
      default:
        return 'Processing Payment...';
    }
  };

  const getStatusDescription = () => {
    switch (paymentStatus.status) {
      case 'success':
        return 'Your payment has been processed successfully. You will receive a confirmation email shortly.';
      case 'failed':
        return 'Your payment could not be processed. Please try again or contact support.';
      case 'cancelled':
        return 'The payment was cancelled by you. You can try again if needed.';
      case 'error':
        return paymentStatus.message || 'An error occurred while processing your payment.';
      default:
        return 'Please wait while we process your payment...';
    }
  };

  const getStatusColor = () => {
    switch (paymentStatus.status) {
      case 'success':
        return 'text-green-600';
      case 'failed':
        return 'text-red-600';
      case 'cancelled':
        return 'text-yellow-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Payment Status | TechPratham</title>
        <meta name="description" content="Payment status for your TechPratham course" />
      </Head>

      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-10 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <Image 
              src="/navbar/lmslogo.png"
              alt="TechPratham Logo" 
              width={190}
              height={60}
              className="mx-auto mb-8"
            />
          </div>

          <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
            <div className="text-center">
              <div className="text-6xl mb-4">
                {getStatusIcon()}
              </div>
              
              <h2 className={`text-2xl font-bold ${getStatusColor()} mb-2`}>
                {getStatusMessage()}
              </h2>
              
              <p className="text-gray-600 mb-6">
                {getStatusDescription()}
              </p>

              {paymentStatus.txnid && (
                <div className="bg-gray-100 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-600">Transaction ID</p>
                  <p className="font-mono text-sm font-medium">{paymentStatus.txnid}</p>
                </div>
              )}

              {paymentStatus.amount && (
                <div className="bg-gray-100 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-600">Amount</p>
                  <p className="text-lg font-bold text-gray-800">₹{paymentStatus.amount}</p>
                </div>
              )}

              <div className="space-y-3">
                <Button
                  onClick={() => router.push('/')}
                  className="w-full bg-gradient-to-tl from-[#C6151D] to-[#600A0E] hover:from-red-700 hover:to-red-900 text-white"
                >
                  Back to Home
                </Button>

                {paymentStatus.status === 'failed' && (
                  <Button
                    onClick={() => router.push('/payment')}
                    variant="outline"
                    className="w-full"
                  >
                    Try Again
                  </Button>
                )}

                {paymentStatus.status === 'success' && (
                  <Button
                    onClick={() => router.push('/courses')}
                    variant="outline"
                    className="w-full"
                  >
                    View Courses
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Need help? Contact us at{' '}
              <a 
                href="mailto:techprathamit@gmail.com"
                className="text-blue-600 hover:text-blue-800"
              >
                accounts@techpratham.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentStatusPage;