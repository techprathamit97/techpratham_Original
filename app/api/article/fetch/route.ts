import { NextResponse } from "next/server";
import { Article } from '@/models/article.js';
import { connectMongo } from '@/utils/mongodb';

export async function GET() {
  try {
    await connectMongo();
    
    const articles = await Article.find({}, {
      slug: 1,
      title: 1,
      image: 1,
      description: 1,
      postedBy: 1,
      createdAt: 1,
      _id: 0
    });
    
    const revArticles = articles.reverse();
    const response = NextResponse.json(revArticles);
    
    return response;
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";