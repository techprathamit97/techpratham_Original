import { NextResponse } from "next/server";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

export const runtime = "nodejs";

const s3Client = new S3Client({
  region: process.env.REGION!,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
});

// ================= UPLOAD =================
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileKey = `courses/${Date.now()}-${file.name}`;

    await new Upload({
      client: s3Client,
      params: {
        Bucket: process.env.BUCKET_NAME!,
        Key: fileKey,
        Body: buffer,
        ContentType: file.type,
      },
    }).done();

    const url = `https://${process.env.BUCKET_NAME}.s3.${process.env.REGION}.amazonaws.com/${fileKey}`;

    return NextResponse.json({ url, fileKey });
  } catch (error: any) {
    console.error("UPLOAD ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ================= DELETE =================
export async function DELETE(req: Request) {
  try {
    const { fileKey } = await req.json();

    if (!fileKey) {
      return NextResponse.json({ error: "File key required" }, { status: 400 });
    }

    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: process.env.BUCKET_NAME!,
        Key: fileKey,
      })
    );

    return NextResponse.json({ message: "Image deleted successfully" });
  } catch (error: any) {
    console.error("DELETE ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
