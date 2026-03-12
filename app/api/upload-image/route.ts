// import { NextResponse } from "next/server";
// import AWS from "aws-sdk";

// const s3 = new AWS.S3({
//   accessKeyId: process.env.S3_ACCESS_KEY_ID!,
//   secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
//   region: "ap-south-1"
// });

// export async function POST(req: Request) {
//   try {
//     const formData = await req.formData();
//     const file = formData.get("file") as File | null;

//     if (!file) {
//       return NextResponse.json({ error: "No file provided" }, { status: 400 });
//     }

//     const buffer = Buffer.from(await file.arrayBuffer());

//     const result = await s3
//       .upload({
//         Bucket: "techpratham-image-storage",
//         Key: `puck/${Date.now()}-${file.name}`,
//         Body: buffer,
//         ContentType: file.type
//         // 🚫 NO ACL HERE
//       })
//       .promise();

//     return NextResponse.json({ url: result.Location });
//   } catch (err: any) {
//     console.error("UPLOAD ERROR:", err);
//     return NextResponse.json(
//       { error: err.message || "Upload failed" },
//       { status: 500 }
//     );
//   }
// }

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

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `puck/${Date.now()}-${file.name}`;

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

    // Construct the URL manually or use the bucket URL
    const url = `https://techpratham-image-storage.s3.ap-south-1.amazonaws.com/${fileName}`;

    return NextResponse.json({ url });
  } catch (err: any) {
    console.error("UPLOAD ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { fileKey } = await req.json(); // Get the S3 file key from the request body

    if (!fileKey) {
      return NextResponse.json({ error: "No file key provided" }, { status: 400 });
    }

    const deleteCommand = new DeleteObjectCommand({
      Bucket: "techpratham-image-storage",
      Key: fileKey, // This is the key of the image to delete
    });

    // Perform the delete operation
    await s3Client.send(deleteCommand);

    return NextResponse.json({ message: "Image deleted successfully" });
  } catch (err: any) {
    console.error("DELETE ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}