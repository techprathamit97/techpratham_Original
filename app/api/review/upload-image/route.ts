import { NextResponse } from "next/server";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

export const runtime = "nodejs";

const s3Client = new S3Client({
  region: process.env.REGION || "ap-south-1",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, and WebP are allowed" },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size exceeds 5MB limit" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `reviews/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    const parallelUploads3 = new Upload({
      client: s3Client,
      params: {
        Bucket: process.env.BUCKET_NAME || "techpratham-image-storage",
        Key: fileName,
        Body: buffer,
        ContentType: file.type,
      },
    });

    await parallelUploads3.done();

    const url = `https://${process.env.BUCKET_NAME || "techpratham-image-storage"}.s3.${process.env.REGION || "ap-south-1"}.amazonaws.com/${fileName}`;

    return NextResponse.json({ 
      url,
      fileKey: fileName
    });
  } catch (err: any) {
    console.error("REVIEW IMAGE UPLOAD ERROR:", err);
    return NextResponse.json(
      { error: err.message || "Upload failed" },
      { status: 500 }
    );
  }
}
