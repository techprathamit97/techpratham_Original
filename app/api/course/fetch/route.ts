// import { NextResponse } from 'next/server';
// import { connectMongo } from '@/utils/mongodb';
// import course from '@/models/course';

// export async function GET() {
//     try {
//         await connectMongo();
//         const courseItem = await course.find();

//         return NextResponse.json(courseItem, { status: 200 });
//     } catch (error: any) {
//         console.error('Server Error:', error.message);
//         return NextResponse.json({ message: error.message }, { status: 500 });
//     }
// }

// pages/api/course/fetch (or app/api/course/fetch/route.ts)

import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/utils/mongodb";
import course from "@/models/course";

export async function GET(request: NextRequest) {
  try {
    await connectMongo();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const projection = {
      _id: 1,
      title: 1,
      category: 1,
      link: 1,
      shortDesc: 1,
      image: 1,
      alt: 1,
      level: 1,
      rating: 1,
      duration: 1,
    };

    let query: any = {};

    if (category) {
      query.category = {
        $regex: `^${category}$`,
        $options: "i",
      };
    }

    const courseItem = await course.find(query, projection).lean();

    return NextResponse.json(courseItem, { status: 200 });
  } catch (error: any) {
    console.error("Server Error:", error.message);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
