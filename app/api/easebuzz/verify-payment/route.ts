import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectMongo } from '@/utils/mongodb';
import mongoose from 'mongoose';

const EASEBUZZ_KEY = process.env.EASEBUZZ_KEY || 'ZM883DLY1';
const EASEBUZZ_SALT = process.env.EASEBUZZ_SALT || 'AFPDZA6Q3';
const EASEBUZZ_ENV = process.env.EASEBUZZ_ENV || 'test';

// Payment Transaction Schema
const paymentTransactionSchema = new mongoose.Schema({
  txnid: { type: String, required: true, unique: true },
  easebuzz_id: String,
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
  payment_source: { type: String, default: 'easebuzz' },
  response_data: mongoose.Schema.Types.Mixed,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const PaymentTransaction = mongoose.models.PaymentTransaction || 
  mongoose.model('PaymentTransaction', paymentTransactionSchema);

export async function POST(request: NextRequest) {
  try {
    await connectMongo();
    
    const { txnid } = await request.json();

    if (!txnid) {
      return NextResponse.json(
        { success: false, message: 'Transaction ID is required' },
        { status: 400 }
      );
    }

    // Get transaction from database
    const transaction = await PaymentTransaction.findOne({ txnid });
    
    if (!transaction) {
      return NextResponse.json(
        { success: false, message: 'Transaction not found' },
        { status: 404 }
      );
    }

    // Create hash for verification API call to Easebuzz
    const hashString = `${EASEBUZZ_KEY}|${txnid}|${EASEBUZZ_SALT}`;
    const hash = crypto.createHash('sha512').update(hashString).digest('hex');

    // Call Easebuzz verification API
    const verificationUrl = EASEBUZZ_ENV === 'test'
      ? 'https://testdashboard.easebuzz.in/transaction/v2/retrieve'
      : 'https://dashboard.easebuzz.in/transaction/v2/retrieve';

    const verificationData = {
      key: EASEBUZZ_KEY,
      txnid,
      hash,
    };

    const verificationResponse = await fetch(verificationUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(verificationData),
    });

    const verificationResult = await verificationResponse.json();

    // Update transaction status based on verification result
    if (verificationResult.status === 1 && verificationResult.data) {
      const paymentData = verificationResult.data;
      
      await PaymentTransaction.findOneAndUpdate(
        { txnid },
        {
          $set: {
            easebuzz_id: paymentData.easepayid,
            status: paymentData.status === 'success' ? 'success' : 'failure',
            response_data: paymentData,
            updated_at: new Date(),
          }
        }
      );

      return NextResponse.json({
        success: true,
        transaction: {
          txnid,
          status: paymentData.status,
          amount: paymentData.amount,
          easebuzz_id: paymentData.easepayid,
        },
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Payment verification failed',
        transaction: {
          txnid,
          status: transaction.status,
        },
      });
    }

  } catch (error: any) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { success: false, message: 'Verification failed', error: error.message },
      { status: 500 }
    );
  }
}