import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectMongo } from '@/utils/mongodb';
import mongoose from 'mongoose';

const RAZORPAY_KEY_SECRET = process.env.Razorpay_KEY_SECRET || '';

// Payment Transaction Schema (shared collection with Easebuzz transactions)
const paymentTransactionSchema = new mongoose.Schema({
  txnid: { type: String, required: true, unique: true },
  razorpay_order_id: String,
  razorpay_payment_id: String,
  amount: { type: Number, required: true },
  productinfo: String,
  firstname: String,
  email: String,
  phone: String,
  address1: String,
  city: String,
  state: String,
  country: String,
  zipcode: String,
  status: { type: String, enum: ['pending', 'success', 'failure', 'cancelled'], default: 'pending' },
  payment_source: { type: String, default: 'razorpay' },
  response_data: mongoose.Schema.Types.Mixed,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const PaymentTransaction = mongoose.models.PaymentTransaction ||
  mongoose.model('PaymentTransaction', paymentTransactionSchema);

export async function POST(request: NextRequest) {
  try {
    if (!RAZORPAY_KEY_SECRET) {
      return NextResponse.json(
        { success: false, message: 'Razorpay is not configured on the server.' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      txnid,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, message: 'Missing payment verification parameters.' },
        { status: 400 }
      );
    }

    // Verify the signature: HMAC-SHA256(order_id|payment_id, secret).
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const isValid =
      expectedSignature.length === razorpay_signature.length &&
      crypto.timingSafeEqual(
        Buffer.from(expectedSignature),
        Buffer.from(razorpay_signature)
      );

    // Derive base URL for the internal leads call.
    const host = request.headers.get('host') || 'localhost:3000';
    const proto = request.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
    const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXTAUTH_URL || `${proto}://${host}`).replace(/\/+$/, '');

    await connectMongo();

    const newStatus = isValid ? 'success' : 'failure';

    const transaction = await PaymentTransaction.findOneAndUpdate(
      razorpay_order_id ? { razorpay_order_id } : { txnid },
      {
        $set: {
          razorpay_payment_id,
          status: newStatus,
          response_data: { razorpay_order_id, razorpay_payment_id, razorpay_signature },
          updated_at: new Date(),
        },
      },
      { new: true }
    );

    if (!isValid) {
      console.error('Razorpay signature verification failed for order:', razorpay_order_id);
      return NextResponse.json(
        { success: false, message: 'Payment verification failed.' },
        { status: 400 }
      );
    }

    // On success, also save the customer as a lead (mirrors the Easebuzz flow).
    if (transaction) {
      try {
        await fetch(`${baseUrl}/api/leads`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName: transaction.firstname,
            email: transaction.email,
            phone: transaction.phone,
            course: transaction.productinfo,
            city: transaction.city,
            state: transaction.state,
            country: transaction.country,
            formType: 'razorpay-payment-success',
            amount: transaction.amount,
            txnid: transaction.txnid,
            razorpay_payment_id,
          }),
        });
      } catch (leadError) {
        console.error('Failed to save lead:', leadError);
      }
    }

    return NextResponse.json({
      success: true,
      txnid: transaction?.txnid || txnid,
      amount: transaction?.amount,
      razorpay_payment_id,
    });
  } catch (error: any) {
    console.error('Razorpay verification error:', error);
    return NextResponse.json(
      { success: false, message: 'Verification failed', error: error.message },
      { status: 500 }
    );
  }
}
