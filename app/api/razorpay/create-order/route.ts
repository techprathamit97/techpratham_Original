import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/utils/mongodb';
import mongoose from 'mongoose';

const RAZORPAY_KEY = process.env.Razorpay_KEY || '';
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
    if (!RAZORPAY_KEY || !RAZORPAY_KEY_SECRET) {
      return NextResponse.json(
        { success: false, message: 'Razorpay is not configured on the server.' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const {
      amount,
      firstname,
      email,
      phone,
      productinfo,
      address1,
      city,
      state,
      country,
      zipcode,
    } = body;

    // Validate and format amount. Razorpay expects the amount in the smallest
    // currency unit (paise), so we convert rupees -> paise (integer).
    const rawAmount = String(amount ?? '').trim().replace(/,/g, '');
    const parsedAmount = parseFloat(rawAmount);
    if (!rawAmount || isNaN(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid amount. Please enter a positive number.' },
        { status: 400 }
      );
    }
    const amountInPaise = Math.round(parsedAmount * 100);

    // Generate our own transaction id (used as Razorpay receipt + DB key).
    const txnid = `TXN_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;

    // Create an order via the Razorpay Orders API using Basic Auth (key:secret).
    const auth = Buffer.from(`${RAZORPAY_KEY}:${RAZORPAY_KEY_SECRET}`).toString('base64');
    const orderResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: 'INR',
        receipt: txnid,
        notes: {
          firstname: firstname || '',
          email: email || '',
          phone: phone || '',
          productinfo: productinfo || '',
        },
      }),
    });

    const orderResult = await orderResponse.json();

    if (!orderResponse.ok || !orderResult.id) {
      console.error('Razorpay order creation failed:', orderResult);
      return NextResponse.json(
        {
          success: false,
          message: orderResult?.error?.description || 'Failed to create Razorpay order',
        },
        { status: 502 }
      );
    }

    // Save a pending transaction before handing control to the checkout.
    try {
      await connectMongo();
      await PaymentTransaction.create({
        txnid,
        razorpay_order_id: orderResult.id,
        amount: parsedAmount,
        productinfo,
        firstname,
        email,
        phone,
        address1,
        city,
        state,
        country,
        zipcode,
        status: 'pending',
        payment_source: 'razorpay',
        created_at: new Date(),
      });
    } catch (dbError) {
      // Don't block the payment if the pending record can't be saved.
      console.error('Failed to save pending Razorpay transaction:', dbError);
    }

    return NextResponse.json({
      success: true,
      key: RAZORPAY_KEY,
      orderId: orderResult.id,
      amount: amountInPaise,
      currency: 'INR',
      txnid,
    });
  } catch (error: any) {
    console.error('Razorpay order creation error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create order', error: error.message },
      { status: 500 }
    );
  }
}
