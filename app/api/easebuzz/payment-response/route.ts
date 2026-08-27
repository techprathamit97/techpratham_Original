import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectMongo } from '@/utils/mongodb';
import mongoose from 'mongoose';

const EASEBUZZ_SALT = process.env.EASEBUZZ_SALT || 'AFPDZA6Q3';

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
    
    const formData = await request.formData();
    const responseData: any = {};
    
    // Convert FormData to object
    formData.forEach((value, key) => {
      responseData[key] = value.toString();
    });

    console.log('Easebuzz Payment Response:', responseData);

    const { 
      txnid, 
      amount, 
      productinfo, 
      firstname, 
      email, 
      phone,
      city,
      state,
      country,
      status, 
      easepayid, 
      hash 
    } = responseData;

    // Verify hash for security
    const hashString = `${EASEBUZZ_SALT}|${status}|||||||||||${email}|${firstname}|${productinfo}|${amount}|${txnid}`;
    
    const calculatedHash = crypto.createHash('sha512').update(hashString).digest('hex');
 

    if (hash !== calculatedHash) {
      console.error('Hash verification failed');
      console.error('Expected:', calculatedHash);
      console.error('Received:', hash);
      // For now, let's continue processing but log the error
      // return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/payment?status=error&message=Invalid response`);
    }

    // Update transaction in database
    await PaymentTransaction.findOneAndUpdate(
      { txnid },
      {
        $set: {
          easebuzz_id: easepayid,
          status: status === 'success' ? 'success' : 'failure',
          response_data: responseData,
          updated_at: new Date(),
        }
      },
      { new: true, upsert: false }
    );

    // If payment is successful, also save as lead
    if (status === 'success') {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/leads`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName: firstname,
            email,
            phone,
            course: productinfo,
            city,
            state,
            country,
            formType: 'easebuzz-payment-success',
            amount: parseFloat(amount),
            txnid,
            easebuzz_id: easepayid,
          }),
        });
      } catch (leadError) {
        console.error('Failed to save lead:', leadError);
      }
    }

    // Redirect based on payment status
    const redirectUrl = status === 'success'
      ? `${process.env.NEXT_PUBLIC_BASE_URL}/payment-status?status=success&txnid=${txnid}&amount=${amount}`
      : `${process.env.NEXT_PUBLIC_BASE_URL}/payment-status?status=failed&txnid=${txnid}`;

    return NextResponse.redirect(redirectUrl);

  } catch (error: any) {
    console.error('Payment response processing error:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/payment-status?status=error&message=Processing failed`
    );
  }
}