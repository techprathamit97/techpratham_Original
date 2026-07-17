import { NextRequest, NextResponse } from 'next/server';
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

export const runtime = "nodejs";

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.REGION!,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
});

// POST - Upload review image
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ message: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { message: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { message: 'File size too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    // Create buffer and file key
    const buffer = Buffer.from(await file.arrayBuffer());
    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileKey = `review-images/${timestamp}-${sanitizedFileName}`;

    // Upload using the same method as existing upload-image API
    const parallelUploads3 = new Upload({
      client: s3Client,
      params: {
        Bucket: process.env.BUCKET_NAME!,
        Key: fileKey,
        Body: buffer,
        ContentType: file.type,
      },
    });

    await parallelUploads3.done();

    // Construct the public URL
    const publicUrl = `https://${process.env.BUCKET_NAME}.s3.${process.env.REGION}.amazonaws.com/${fileKey}`;

    return NextResponse.json({
      url: publicUrl,
      fileKey: fileKey,
      message: 'File uploaded successfully'
    }, { status: 200 });

  } catch (error: any) {
    console.error('S3 upload error:', error);
    return NextResponse.json(
      { message: 'Failed to upload file to S3', error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete file from S3
export async function DELETE(request: NextRequest) {
  try {
    const { fileKey } = await request.json();

    if (!fileKey) {
      return NextResponse.json({ message: 'File key is required' }, { status: 400 });
    }

    const deleteCommand = new DeleteObjectCommand({
      Bucket: process.env.BUCKET_NAME!,
      Key: fileKey,
    });

    await s3Client.send(deleteCommand);

    return NextResponse.json({ message: 'File deleted successfully' }, { status: 200 });

  } catch (error: any) {
    console.error('S3 delete error:', error);
    return NextResponse.json(
      { message: 'Failed to delete file from S3', error: error.message },
      { status: 500 }
    );
  }
}