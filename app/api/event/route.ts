import { NextResponse } from "next/server";
import { connectMongo } from "@/utils/mongodb";
import Event from "@/models/event";

export async function GET() {
  try {
    await connectMongo();

    const events = await Event.find()
      .select("type videoUrl image order createdAt updatedAt")
      .sort({ order: 1, createdAt: -1 })
      .lean();

    return NextResponse.json(events, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        "CDN-Cache-Control": "public, s-maxage=60",
        "Vercel-CDN-Cache-Control": "public, s-maxage=60",
      },
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}


export async function POST(req: Request) {
  await connectMongo();
  const body = await req.json();
  const event = await Event.create(body);
  return NextResponse.json(event, { status: 201 });
}
