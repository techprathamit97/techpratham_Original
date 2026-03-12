import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CourseLayout from "@/components/lms/CourseLayout";
import { Render } from "@measured/puck";
import { puckConfig } from "@/src/lms/puckConfig";
import { IndexController } from "@/src/index/controller/IndexController";

/* ---------- COMPONENT ---------- */
export default function CoursePage() {
  const router = useRouter();
  const { courseId, slug } = router.query;

  // slug = ["lesson-1", "section-1", "sub-section-1"]
  const lessonSlug = slug?.[0] || null;
  const sectionSlug = slug?.[1] || null;
  const subSectionSlug = slug?.[2] || null;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);

  /* ---------- REDIRECT TO FIRST LESSON IF NEEDED ---------- */
  useEffect(() => {
    if (!router.isReady || !courseId) return;
    
    // If we have a lesson slug, we're not redirecting
    if (lessonSlug) {
      setRedirecting(false);
      setLoading(false);
      return;
    }

    // No lesson slug, need to redirect to first lesson
    setRedirecting(true);
    
    const redirectToFirstLesson = async () => {
      try {
        const res = await fetch(`/api/lms/sidebar?courseId=${courseId}`);
        const lessons = await res.json();

        if (lessons?.length > 0) {
          const firstSlug = lessons[0].slug;
          await router.replace(`/contents/${courseId}/${firstSlug}`);
        } else {
          setLoading(false);
          setRedirecting(false);
        }
      } catch (error) {
        console.error("Failed to fetch lessons:", error);
        setLoading(false);
        setRedirecting(false);
      }
    };

    redirectToFirstLesson();
  }, [router.isReady, courseId, lessonSlug, router]);

  /* ---------- LOAD PUCK CONTENT (LESSON / SECTION / SUB-SECTION) ---------- */
  useEffect(() => {
    if (!courseId || !lessonSlug) {
      setData(null);
      return;
    }

    setLoading(true);

    const fetchPuckData = async () => {
      try {
        const query = new URLSearchParams({
          courseId,
          lessonId: lessonSlug,
          ...(sectionSlug && { sectionId: sectionSlug }),
          ...(subSectionSlug && { subSectionId: subSectionSlug }),
          // ⭐ CACHE BUSTING: Add timestamp to bypass cache
          t: Date.now().toString()
        });

        const res = await fetch(`/api/lms/puck?${query.toString()}`);
        const result = await res.json();
        setData(result);
      } catch (error) {
        console.error("Failed to fetch puck data:", error);
        setData({ root: {}, content: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchPuckData();
  }, [courseId, lessonSlug, sectionSlug, subSectionSlug]);

  /* ---------- LISTEN FOR CONTENT UPDATES FROM EDITOR ---------- */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = (e) => {
      if (e.key === 'lms-content-updated') {
        try {
          const updateInfo = JSON.parse(e.newValue || '{}');
          
          // Check if this update is for the current content
          if (updateInfo.courseId === courseId && 
              updateInfo.lessonId === lessonSlug &&
              (!sectionSlug || updateInfo.sectionId === sectionSlug) &&
              (!subSectionSlug || updateInfo.subSectionId === subSectionSlug)) {
            
            console.log('Content updated, refetching...');
            
            // Refetch the data
            const fetchUpdatedData = async () => {
              try {
                const query = new URLSearchParams({
                  courseId,
                  lessonId: lessonSlug,
                  ...(sectionSlug && { sectionId: sectionSlug }),
                  ...(subSectionSlug && { subSectionId: subSectionSlug }),
                  t: Date.now().toString()
                });

                const res = await fetch(`/api/lms/puck?${query.toString()}`);
                const result = await res.json();
                setData(result);
              } catch (error) {
                console.error("Failed to refetch puck data:", error);
              }
            };

            fetchUpdatedData();
          }
        } catch (error) {
          console.error('Error parsing storage update:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [courseId, lessonSlug, sectionSlug, subSectionSlug]);

  /* ---------- SCROLL PROGRESS TRACKING ---------- */
  useEffect(() => {
    if (!lessonSlug || !courseId) return;

    const onScroll = () => {
      const total =
        document.documentElement.scrollHeight - window.innerHeight;
      if (total <= 0) return;

      const percent = Math.round((window.scrollY / total) * 100);

      const scroll =
        JSON.parse(
          localStorage.getItem(`course-scroll-${courseId}`) || "{}"
        );

      scroll[lessonSlug] = percent;
      localStorage.setItem(
        `course-scroll-${courseId}`,
        JSON.stringify(scroll)
      );

      if (percent >= 95) {
        const progress =
          JSON.parse(
            localStorage.getItem(`course-progress-${courseId}`) || "{}"
          );
        progress[lessonSlug] = true;
        localStorage.setItem(
          `course-progress-${courseId}`,
          JSON.stringify(progress)
        );
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lessonSlug, courseId]);

  return (
    <IndexController>
      <CourseLayout
        courseId={courseId}
        activeLesson={lessonSlug}
        activeSection={sectionSlug}
        activeSubSection={subSectionSlug}
        onLessonSelect={({ lesson, section, subSection }) => {
          router.push(
            subSection
              ? `/contents/${courseId}/${lesson}/${section}/${subSection}`
              : section
              ? `/contents/${courseId}/${lesson}/${section}`
              : `/contents/${courseId}/${lesson}`
          );
        }}
      >

        {/* CONTENT AREA */}
        {redirecting ? (
          <div
            style={{
              minHeight: "60vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
              fontWeight: 500
            }}
          >
            Redirecting to first lesson...
          </div>
        ) : loading ? (
          <div
            style={{
              minHeight: "60vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
              fontWeight: 500
            }}
          >
            Loading course content...
          </div>
        ) : !data || (!data.content && !data.root) ? (
          <div
            style={{
              minHeight: "60vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
              fontWeight: 500,
              flexDirection: "column",
              gap: "10px"
            }}
          >
            <div>No content available for this lesson</div>
            <div style={{ fontSize: "14px", color: "#666" }}>
              Course: {courseId} | Lesson: {lessonSlug}
            </div>
          </div>
        ) : (
          <Render
            key={`${lessonSlug}-${sectionSlug}-${subSectionSlug}`}
            config={puckConfig}
            data={data}
          />
        )}
      </CourseLayout>
    </IndexController>
  );
}
