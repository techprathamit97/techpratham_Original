
import { NextResponse } from "next/server";
import { connectMongo } from "@/utils/mongodb";
import LmsContent from "@/models/LmsContent";

type LmsDoc = {
  sidebar: any[];
};
export async function GET(req: Request) {
  try {
    await connectMongo();
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");
    const lessonId = searchParams.get("lessonId");
    const sectionId = searchParams.get("sectionId");
    const subSectionId = searchParams.get("subSectionId");

    if (!courseId || !lessonId) {
      return NextResponse.json({ error: "courseId and lessonId are required" }, { status: 400 });
    }

    /* ⭐ OPTIMIZED: Use aggregation to fetch only the specific puckData */
    const pipeline: any[] = [
      { $match: { courseId } },
      { $unwind: "$sidebar" },
      { $match: { "sidebar.slug": lessonId } }
    ];

    if (subSectionId && sectionId) {
      // Fetch specific subsection puckData
      pipeline.push(
        { $unwind: "$sidebar.sections" },
        { $match: { "sidebar.sections.slug": sectionId } },
        { $unwind: "$sidebar.sections.subSections" },
        { $match: { "sidebar.sections.subSections.slug": subSectionId } },
        {
          $project: {
            _id: 0,
            puckData: "$sidebar.sections.subSections.puckData"
          }
        }
      );
    } else if (sectionId) {
      // Fetch specific section puckData
      pipeline.push(
        { $unwind: "$sidebar.sections" },
        { $match: { "sidebar.sections.slug": sectionId } },
        {
          $project: {
            _id: 0,
            puckData: "$sidebar.sections.puckData"
          }
        }
      );
    } else {
      // Fetch lesson puckData only
      pipeline.push({
        $project: {
          _id: 0,
          puckData: "$sidebar.puckData"
        }
      });
    }

    const result = await LmsContent.aggregate(pipeline);

    const puckData = result[0]?.puckData || { root: {}, content: [] };

    return NextResponse.json(puckData, {
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60"
      }
    });
  } catch (error: any) {
    console.error("Puck API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const startTime = Date.now();
  
  try {
    await connectMongo();
    const body = await req.json();
    const { courseId, lessonId, sectionId, subSectionId, puckData } = body;

    console.log(`[Puck POST] Saving ${subSectionId ? 'subsection' : sectionId ? 'section' : 'lesson'} for course: ${courseId}`);
    console.log(`[Puck POST] Data size: ${JSON.stringify(puckData).length} bytes`);

    if (!courseId || !lessonId || !puckData) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    /* ⭐ OPTIMIZED: Use MongoDB update operators instead of loading entire document */
    
    // Build the update path based on what we're updating
    let updatePath: string;
    let arrayFilters: any[] = [];

    if (subSectionId && sectionId) {
      // Update subsection puckData
      updatePath = "sidebar.$[lesson].sections.$[section].subSections.$[sub].puckData";
      arrayFilters = [
        { "lesson.slug": lessonId },
        { "section.slug": sectionId },
        { "sub.slug": subSectionId }
      ];
    } else if (sectionId) {
      // Update section puckData
      updatePath = "sidebar.$[lesson].sections.$[section].puckData";
      arrayFilters = [
        { "lesson.slug": lessonId },
        { "section.slug": sectionId }
      ];
    } else {
      // Update lesson puckData
      updatePath = "sidebar.$[lesson].puckData";
      arrayFilters = [
        { "lesson.slug": lessonId }
      ];
    }

    const updateStart = Date.now();
    const result = await LmsContent.updateOne(
      { courseId },
      { $set: { [updatePath]: puckData } },
      { arrayFilters }
    );
    console.log(`[Puck POST] Update took: ${Date.now() - updateStart}ms`);

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    if (result.modifiedCount === 0) {
      console.log(`[Puck POST] No modification, item might not exist. Falling back to creation.`);
      // Item might not exist, need to create it
      // Fall back to the old method only for creation
      let content = await LmsContent.findOne({ courseId });
      
      if (!content) {
        return NextResponse.json({ error: "Course not found" }, { status: 404 });
      }

      let lesson = content.sidebar.find((l: any) => l.slug === lessonId);
      if (!lesson) {
        return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
      }

      if (sectionId) {
        let section = lesson.sections?.find((s: any) => s.slug === sectionId);
        if (!section) {
          return NextResponse.json({ error: "Section not found" }, { status: 404 });
        }

        if (subSectionId) {
          let sub = section.subSections?.find((ss: any) => ss.slug === subSectionId);
          if (!sub) {
            // Create new subsection
            sub = {
              type: 'content',
              title: subSectionId.replace(/-/g, ' '),
              slug: subSectionId,
              puckData
            };
            section.subSections = section.subSections || [];
            section.subSections.push(sub);
          } else {
            sub.puckData = puckData;
          }
        } else {
          section.puckData = puckData;
        }
      } else {
        lesson.puckData = puckData;
      }

      content.markModified('sidebar');
      await content.save();
    }

    console.log(`[Puck POST] Total time: ${Date.now() - startTime}ms`);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[Puck POST] Save Error:", error);
    console.log(`[Puck POST] Failed after: ${Date.now() - startTime}ms`);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
