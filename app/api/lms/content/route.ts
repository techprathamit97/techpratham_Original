import { NextResponse } from "next/server";
import { connectMongo } from "@/utils/mongodb";
import LmsContent from "@/models/LmsContent";

/* ===================== GET ===================== */
// export async function GET(req: Request) {
//   try {
//     await connectMongo();
//     const { searchParams } = new URL(req.url);
//     const courseId = searchParams.get("courseId");

//     if (!courseId) {
//       return NextResponse.json({ error: "courseId is required" }, { status: 400 });
//     }

//     const content = await LmsContent.findOne({ courseId }).lean();

//     return NextResponse.json(
//       content || { courseId, sidebar: [], puckData: { root: {}, content: [] } }
//     );
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

export async function GET(req: Request) {
  try {
    await connectMongo();

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");
    const lite = searchParams.get("lite");

    if (!courseId) {
      return NextResponse.json(
        { error: "courseId is required" },
        { status: 400 }
      );
    }

    // ✅ LITE MODE: Exclude all puckData for faster loading in editor
    if (lite === "true") {
      const result = await LmsContent.aggregate([
        { $match: { courseId } },
        {
          $project: {
            _id: 0,
            courseId: 1,
            title: 1,
            sidebar: {
              $map: {
                input: "$sidebar",
                as: "lesson",
                in: {
                  title: "$$lesson.title",
                  slug: "$$lesson.slug",
                  link: "$$lesson.link",
                  sections: {
                    $map: {
                      input: { $ifNull: ["$$lesson.sections", []] },
                      as: "section",
                      in: {
                        title: "$$section.title",
                        slug: "$$section.slug",
                        type: "$$section.type",
                        link: "$$section.link",
                        subSections: {
                          $map: {
                            input: { $ifNull: ["$$section.subSections", []] },
                            as: "sub",
                            in: {
                              title: "$$sub.title",
                              slug: "$$sub.slug",
                              type: "$$sub.type",
                              link: "$$sub.link"
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      ]);

      const content = result[0] || { courseId, sidebar: [] };

      return NextResponse.json(content, {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120"
        }
      });
    }

    // ✅ NORMAL MODE: Return full content (used by other parts of the app)
    const content = await LmsContent.findOne({ courseId })
      .select("courseId sidebar title")
      .lean();

    return NextResponse.json(
      content || {
        courseId,
        sidebar: [],
        puckData: { root: {}, content: [] }
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=120, stale-while-revalidate=300"
        }
      }
    );
  } catch (error: any) {
    console.error("LMS Content GET Error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}


/* ===================== POST ===================== */
export async function POST(req: Request) {
  try {
    await connectMongo();
    const body = await req.json();

    const {
      courseId,
      sidebar,
      title,
      lessonId,
      sectionId,
      subSectionId,
      puckData
    } = body;

    if (!courseId) {
      return NextResponse.json({ error: "courseId is required" }, { status: 400 });
    }

    let content = await LmsContent.findOne({ courseId });

    /* ---------- FULL COURSE SAVE ---------- */
    if (sidebar) {
      if (!content) {
        content = new LmsContent({ courseId });
      }

      content.title = title;
      const updatedSidebar: any[] = [];

      for (const lessonInput of sidebar) {
        const oldLessonSlug = lessonInput.oldSlug || lessonInput.slug;
        let lesson = content.sidebar.find(
          (l: any) => l.slug === oldLessonSlug
        );

        if (!lesson) {
          lesson = {
            title: lessonInput.title,
            slug: lessonInput.slug,
            sections: [],
            puckData: { root: {}, content: [] } // ✅ Initialize puckData
          };
        } else {
          lesson.title = lessonInput.title;
          lesson.slug = lessonInput.slug;
          // ✅ Preserve existing puckData if not provided
          if (!lesson.puckData) {
            lesson.puckData = { root: {}, content: [] };
          }
        }

        const updatedSections: any[] = [];

        for (const sectionInput of lessonInput.sections || []) {
          const oldSectionSlug = sectionInput.oldSlug || sectionInput.slug;
          let section = (lesson.sections || []).find(
            (s: any) => s.slug === oldSectionSlug
          );

          if (!section) {
            section = {
              type: sectionInput.type || "content",
              title: sectionInput.title,
              slug: sectionInput.slug,
              subSections: [],
              puckData: { root: {}, content: [] } // ✅ Initialize puckData
            };
          } else {
            section.type = sectionInput.type || section.type || "content";
            section.title = sectionInput.title;
            section.slug = sectionInput.slug;
            // ✅ Preserve existing puckData
            if (!section.puckData) {
              section.puckData = { root: {}, content: [] };
            }
          }

          const updatedSubSections: any[] = [];

          for (const subInput of sectionInput.subSections || []) {
            const oldSubSlug = subInput.oldSlug || subInput.slug;
            let sub = (section.subSections || []).find(
              (ss: any) => ss.slug === oldSubSlug
            );

            if (!sub) {
              sub = {
                type: subInput.type || "content",
                title: subInput.title,
                slug: subInput.slug,
                puckData: { root: {}, content: [] } // ✅ Initialize puckData
              };
            } else {
              sub.type = subInput.type || sub.type || "content";
              sub.title = subInput.title;
              sub.slug = subInput.slug;
              // ✅ Preserve existing puckData
              if (!sub.puckData) {
                sub.puckData = { root: {}, content: [] };
              }
            }

            updatedSubSections.push(sub);
          }

          section.subSections = updatedSubSections;
          updatedSections.push(section);
        }

        lesson.sections = updatedSections;
        updatedSidebar.push(lesson);
      }

      content.sidebar = updatedSidebar;
      content.markModified("sidebar");
      await content.save();

      return NextResponse.json({ success: true });
    }

    /* ---------- PUCK CONTENT SAVE ---------- */
    if (!lessonId || !puckData) {
      return NextResponse.json(
        { error: "lessonId and puckData are required" },
        { status: 400 }
      );
    }

    if (!content) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const lesson = content.sidebar.find((l: any) => l.slug === lessonId);
    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    if (sectionId) {
      const section = lesson.sections.find(
        (s: any) => s.slug === sectionId
      );
      if (!section) {
        return NextResponse.json({ error: "Section not found" }, { status: 404 });
      }

      if (subSectionId) {
  let sub = section.subSections.find(
    (ss: any) => ss.slug === subSectionId
  );

  if (!sub) {
    // ✅ AUTO CREATE SUB-SECTION
    sub = {
      title: subSectionId,
      slug: subSectionId,
      type: "content",
      puckData
    };
    section.subSections.push(sub);
  } else {
    sub.puckData = puckData;
  }
}
 else {
        section.puckData = puckData;
      }
    } else {
      lesson.puckData = puckData;
    }

    content.markModified("sidebar");
    await content.save();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Save Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/* ===================== DELETE ===================== */
export async function DELETE(req: Request) {
  try {
    await connectMongo();
    const { searchParams } = new URL(req.url);

    const id = searchParams.get("id"); // FULL PAGE
    const courseId = searchParams.get("courseId");
    const lessonSlug = searchParams.get("lessonSlug");
    const sectionSlug = searchParams.get("sectionSlug");
    const subSectionSlug = searchParams.get("subSectionSlug");

    /* ---------- FULL PAGE DELETE ---------- */
    if (id) {
      const deleted = await LmsContent.findByIdAndDelete(id);
      if (!deleted) {
        return NextResponse.json(
          { error: "LMS content not found" },
          { status: 404 }
        );
      }   
      return NextResponse.json({ success: true });
    }

    if (!courseId || !lessonSlug) {
      return NextResponse.json(
        { error: "courseId and lessonSlug are required" },
        { status: 400 }
      );
    }

    const content = await LmsContent.findOne({ courseId });
    if (!content) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    /* ---------- DELETE SUB-SECTION ---------- */
    if (sectionSlug && subSectionSlug) {
      content.sidebar = content.sidebar.map((lesson: any) => {
        if (lesson.slug !== lessonSlug) return lesson;

        return {
          ...lesson,
          sections: lesson.sections.map((section: any) => {
            if (section.slug !== sectionSlug) return section;

            return {
              ...section,
              subSections: section.subSections.filter(
                (ss: any) => ss.slug !== subSectionSlug
              )
            };
          })
        };
      });

      content.markModified("sidebar");
      await content.save();
      return NextResponse.json({ success: true });
    }

    /* ---------- DELETE SECTION ---------- */
    if (sectionSlug) {
      content.sidebar = content.sidebar.map((lesson: any) => {
        if (lesson.slug !== lessonSlug) return lesson;

        return {
          ...lesson,
          sections: lesson.sections.filter(
            (s: any) => s.slug !== sectionSlug
          )
        };
      });

      content.markModified("sidebar");
      await content.save();
      return NextResponse.json({ success: true });
    }

    /* ---------- DELETE LESSON ---------- */
    content.sidebar = content.sidebar.filter(
      (lesson: any) => lesson.slug !== lessonSlug
    );

    content.markModified("sidebar");
    await content.save();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
