import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/utils/mongodb';
import mongoose from 'mongoose';

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
    
    const transactionData = await request.json();
    
    const transaction = new PaymentTransaction(transactionData);
    await transaction.save();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Transaction saved successfully',
      txnid: transaction.txnid 
    });
    
  } catch (error: any) {
    console.error('Save transaction error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to save transaction', error: error.message },
      { status: 500 }
    );
  }
}