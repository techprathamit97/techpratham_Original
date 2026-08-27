import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const EASEBUZZ_KEY = process.env.EASEBUZZ_KEY || 'ZM883DLY1';
const EASEBUZZ_SALT = process.env.EASEBUZZ_SALT || 'AFPDZA6Q3';
const EASEBUZZ_ENV = process.env.EASEBUZZ_ENV || 'test';

export async function POST(request: NextRequest) {
  try {
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
      zipcode 
    } = body;

    // Generate transaction ID
    const txnid = `TXN_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    
    // Format amount to 2 decimal places
    const formattedAmount = parseFloat(amount).toFixed(2);

    // URLs for success/failure/cancel
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const surl = `${baseUrl}/api/easebuzz/payment-response`;
    const furl = `${baseUrl}/api/easebuzz/payment-response`;
    const curl = `${baseUrl}/payment-status?status=cancelled`;

    // Create hash for Easebuzz - Fixed format according to Easebuzz docs
    // Format: key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5|udf6|udf7|udf8|udf9|udf10|salt
    const hashString = `${EASEBUZZ_KEY}|${txnid}|${formattedAmount}|${productinfo}|${firstname}|${email}|||||||||||${EASEBUZZ_SALT}`;
  
    const hash = crypto.createHash('sha512').update(hashString).digest('hex');
   

   

    const paymentData = {
      key: EASEBUZZ_KEY,
      txnid,
      amount: formattedAmount,
      productinfo,
      firstname,
      email,
      phone,
      address1,
      city,
      state,
      country,
      zipcode,
      surl,
      furl,
      curl,
      hash,
      // Add empty UDF fields that Easebuzz expects
      udf1: '',
      udf2: '',
      udf3: '',
      udf4: '',
      udf5: '',
      udf6: '',
      udf7: '',
      udf8: '',
      udf9: '',
      udf10: '',
    };

    // Save transaction to database before redirecting
    await fetch(`${baseUrl}/api/easebuzz/save-transaction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        txnid,
        amount: parseFloat(amount),
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
        payment_source: 'easebuzz',
        created_at: new Date(),
      }),
    });

    // Call Easebuzz initiate API to get access key
    const initiateUrl = EASEBUZZ_ENV === 'test' 
      ? 'https://testpay.easebuzz.in/payment/initiateLink'
      : 'https://pay.easebuzz.in/payment/initiateLink';

    const initiateResponse = await fetch(initiateUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: Object.keys(paymentData)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent((paymentData as any)[key])}`)
        .join('&')
    });

    const initiateResult = await initiateResponse.json();
    console.log('Easebuzz initiate response:', initiateResult);

    if (initiateResult.status === 1) {
      // Success - redirect to payment page with access key
      // Correct URL format for Easebuzz test environment
      const paymentUrl = EASEBUZZ_ENV === 'test'
        ? `https://testpay.easebuzz.in/pay/${initiateResult.data}`
        : `https://pay.easebuzz.in/pay/${initiateResult.data}`;

      return NextResponse.json({
        success: true,
        paymentUrl,
        accessKey: initiateResult.data,
        directRedirect: true
      });
    } else {
      throw new Error(`Easebuzz initiate failed: ${initiateResult.error_desc || 'Unknown error'}`);
    }

  } catch (error: any) {
    console.error('Easebuzz payment creation error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create payment', error: error.message },
      { status: 500 }
    );
  }
}