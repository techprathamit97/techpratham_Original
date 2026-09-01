
import { NextResponse } from "next/server";
import { connectMongo } from "@/utils/mongodb";
import LmsContent from "@/models/LmsContent";
import { requireRole, LEAD_ACCESS_ROLES } from '@/lib/apiAuth';

export async function DELETE(req: Request) {
  try {
    const denied = await requireRole(LEAD_ACCESS_ROLES);
    if (denied) return denied;

    await connectMongo();

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");  
    const lessonSlug = searchParams.get("lessonSlug");

    if (!courseId || !lessonSlug) {
      return NextResponse.json(
        { error: "courseId and lessonSlug are required" },
        { status: 400 }
      );
    }

    const updated = await LmsContent.findOneAndUpdate(
      { courseId },
      {
        $pull: {
          sidebar: { slug: lessonSlug }
        }
      },
      { new: true }
    );

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
