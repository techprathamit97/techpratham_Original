import { NextResponse } from "next/server";
import { S3Client, GetObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";

export const runtime = "nodejs";

/**
 * Streams a PDF from S3 through the server so the bucket URL is never exposed
 * to the browser. Supports HTTP range requests, which pdf.js uses to fetch the
 * document in chunks instead of pulling the whole file in one response.
 *
 * This route is intentionally standalone and is not referenced by the existing
 * PDFSection component or the e-book pages.
 */

const BUCKET = process.env.BUCKET_NAME || "techpratham-image-storage";
const REGION = process.env.REGION?.trim() || "ap-south-1";

const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
});

/**
 * Only objects under these prefixes may be served. Without this an attacker
 * could pass an arbitrary key and read anything in the bucket.
 */
const ALLOWED_PREFIXES = ["puck/"];

function isAllowedKey(key: string) {
  if (!key) return false;
  // Reject traversal and absolute/protocol-relative paths outright.
  if (key.includes("..") || key.startsWith("/") || key.includes("://")) return false;
  return ALLOWED_PREFIXES.some((prefix) => key.startsWith(prefix));
}

/** Accepts either a bare S3 key or a full bucket URL, and returns the key. */
function normalizeKey(input: string) {
  let value = input.trim();

  if (value.startsWith("http")) {
    try {
      const parsed = new URL(value);
      if (!parsed.hostname.endsWith(".amazonaws.com")) return null;
      value = decodeURIComponent(parsed.pathname.replace(/^\//, ""));
    } catch {
      return null;
    }
  }

  return value;
}

/**
 * Collects the S3 stream into a Uint8Array backed by a plain ArrayBuffer.
 *
 * A Node Buffer, and any Uint8Array typed as ArrayBufferLike, is not assignable
 * to BodyInit, so the backing store is allocated explicitly.
 */
async function toBytes(body: any): Promise<Uint8Array<ArrayBuffer>> {
  const chunks: Buffer[] = [];
  for await (const chunk of body) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  const merged = Buffer.concat(chunks);
  const bytes = new Uint8Array(new ArrayBuffer(merged.byteLength));
  bytes.set(merged);
  return bytes;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const rawKey = searchParams.get("key");

    if (!rawKey) {
      return NextResponse.json({ error: "Missing key parameter" }, { status: 400 });
    }

    const key = normalizeKey(rawKey);

    if (!key || !isAllowedKey(key)) {
      return NextResponse.json({ error: "Key not permitted" }, { status: 403 });
    }

    if (!key.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json({ error: "Only PDF files are served" }, { status: 403 });
    }

    const range = req.headers.get("range") || undefined;

    const object = await s3Client.send(
      new GetObjectCommand({
        Bucket: BUCKET,
        Key: key,
        ...(range ? { Range: range } : {}),
      })
    );

    const body = await toBytes(object.Body);

    // inline (not attachment) so the browser hands bytes to pdf.js rather than
    // offering a save dialog.
    const headers: Record<string, string> = {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline",
      "Content-Length": String(body.byteLength),
      "Accept-Ranges": "bytes",
      "Cache-Control": "private, max-age=3600",
      "X-Content-Type-Options": "nosniff",
    };

    if (object.ContentRange) {
      headers["Content-Range"] = object.ContentRange;
    }

    return new NextResponse(body, {
      status: object.ContentRange ? 206 : 200,
      headers,
    });
  } catch (error: any) {
    const name = error?.name || "";

    if (name === "NoSuchKey" || name === "NotFound") {
      return NextResponse.json({ error: "PDF not found" }, { status: 404 });
    }

    if (name === "InvalidRange") {
      return NextResponse.json({ error: "Invalid range" }, { status: 416 });
    }

    console.error("SECURE PDF ERROR:", error);
    return NextResponse.json({ error: "Failed to load PDF" }, { status: 500 });
  }
}

/** Reports file size and content type without transferring the body. */
export async function HEAD(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const rawKey = searchParams.get("key");

    if (!rawKey) return new NextResponse(null, { status: 400 });

    const key = normalizeKey(rawKey);
    if (!key || !isAllowedKey(key)) return new NextResponse(null, { status: 403 });

    const head = await s3Client.send(
      new HeadObjectCommand({ Bucket: BUCKET, Key: key })
    );

    return new NextResponse(null, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Length": String(head.ContentLength ?? 0),
        "Accept-Ranges": "bytes",
      },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
