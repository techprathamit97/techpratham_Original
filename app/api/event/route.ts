import { NextResponse } from "next/server";
import { connectMongo } from "@/utils/mongodb";
import Event from "@/models/event";

export async function GET() {
  await connectMongo();

  const events = await Event.find()
    .select("type videoUrl image order createdAt")
    .sort({ order: 1, createdAt: -1 })
    .lean();

  return NextResponse.json(events, {
    headers: {
      "Cache-Control":
        "public, s-maxage=300, stale-while-revalidate=600",
    },
  });
}


export async function POST(req: Request) {
  await connectMongo();
  const body = await req.json();
  const event = await Event.create(body);
  return NextResponse.json(event, { status: 201 });
}
