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

const BUCKET = "techpratham-image-storage";

/* ================= UPLOAD IMAGE ================= */
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // ✅ ONLY REQUIRED CHANGE: puck/ → event/
    const fileKey = `event/${Date.now()}-${file.name}`;

    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: BUCKET,
        Key: fileKey,
        Body: buffer,
        ContentType: file.type,
      },
    });

    await upload.done();

    const url = `https://${BUCKET}.s3.ap-south-1.amazonaws.com/${fileKey}`;

    return NextResponse.json({ url, fileKey });
  } catch (err: any) {
    console.error("UPLOAD ERROR:", err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}

/* ================= DELETE IMAGE ================= */
export async function DELETE(req: Request) {
  try {
    const { fileKey } = await req.json();

    if (!fileKey) {
      return NextResponse.json(
        { error: "No file key provided" },
        { status: 400 }
      );
    }

    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: BUCKET,
        Key: fileKey,
      })
    );

    return NextResponse.json({
      message: "Image deleted successfully",
    });
  } catch (err: any) {
    console.error("DELETE ERROR:", err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
