import { NextResponse } from "next/server";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

export const runtime = "nodejs";

const s3Client = new S3Client({
  region: "ap-south-1",
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
      return NextResponse.json({ 
        error: "Invalid file type. Only JPEG, PNG, and WebP images are allowed." 
      }, { status: 400 });
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: "File too large. Maximum size is 5MB." 
      }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `blog/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    const parallelUploads3 = new Upload({
      client: s3Client,
      params: {
        Bucket: "techpratham-image-storage",
        Key: fileName,
        Body: buffer,
        ContentType: file.type,
      },
    });

    await parallelUploads3.done();

    // Construct the URL
    const url = `https://techpratham-image-storage.s3.ap-south-1.amazonaws.com/${fileName}`;

    return NextResponse.json({ 
      url,
      fileKey: fileName,
      message: "Image uploaded successfully"
    });
  } catch (err: any) {
    console.error("BLOG IMAGE UPLOAD ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { fileKey } = await req.json();

    if (!fileKey) {
      return NextResponse.json({ error: "No file key provided" }, { status: 400 });
    }

    const deleteCommand = new DeleteObjectCommand({
      Bucket: "techpratham-image-storage",
      Key: fileKey,
    });

    await s3Client.send(deleteCommand);

    return NextResponse.json({ message: "Image deleted successfully" });
  } catch (err: any) {
    console.error("BLOG IMAGE DELETE ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}