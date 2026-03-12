import { NextResponse } from "next/server";
import { connectMongo } from "@/utils/mongodb";
import Event from "@/models/event";

type Params = {
  id: string;
};

export async function PUT(
  req: Request,
  context: { params: Promise<Params> }
) {
  await connectMongo();

  const { id } = await context.params;
  const body = await req.json();

  const updated = await Event.findByIdAndUpdate(id, body, {
    new: true,
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  req: Request,
  context: { params: Promise<Params> }
) {
  await connectMongo();

  const { id } = await context.params;
  await Event.findByIdAndDelete(id);

  return NextResponse.json({ success: true });
}
