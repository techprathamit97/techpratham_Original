import { NextRequest, NextResponse } from 'next/server';
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

export const runtime = "nodejs";

const s3Client = new S3Client({
  region: process.env.REGION!,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: NextRequest) {
  console.log('=== PAYMENT SCREENSHOT UPLOAD DEBUG ===');
  try {
    const formData = await request.formData();
    const file = formData.get('screenshot') as File;

    console.log('File received:', file ? file.name : 'No file');
    console.log('File size:', file ? file.size : 'N/A');
    console.log('File type:', file ? file.type : 'N/A');

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only image files are allowed' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileKey = `payment-screenshots/${Date.now()}-${file.name}`;

    await new Upload({
      client: s3Client,
      params: {
        Bucket: process.env.BUCKET_NAME!,
        Key: fileKey,
        Body: buffer,
        ContentType: file.type,
      },
    }).done();

    // Return the S3 URL
    const url = `https://${process.env.BUCKET_NAME}.s3.${process.env.REGION}.amazonaws.com/${fileKey}`;

  

    return NextResponse.json({
      success: true,
      url: url,
      fileKey: fileKey
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to upload screenshot' },
      { status: 500 }
    );
  }
}