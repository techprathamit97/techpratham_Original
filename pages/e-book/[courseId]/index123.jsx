"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CourseLayout from "@/components/lms/CourseLayout";
import { Render } from "@measured/puck";
import { puckConfig } from "@/src/lms/puckConfig";
import { IndexController } from "@/src/index/controller/IndexController";
import { withNavbarSSR } from '@/utils/withNavbarSSR';

/* 🔑 Normalize sidebar link → lesson-1 */
function normalizeSlug(link) {
  if (!link) return null;

  // remove leading /
  let cleaned = link.replace(/^\/+/, "");

  // take last path segment if URL-like
  if (cleaned.includes("/")) {
    cleaned = cleaned.split("/").pop();
  }

  return cleaned; // no restriction
}


export default function CoursePage({ navbarData }) {
  const router = useRouter();
  const { courseId } = router.query;

  const [activeLesson, setActiveLesson] = useState(null);
  const [data, setData] = useState(null);

  /* 🔹 Load FIRST lesson by default */
  useEffect(() => {
    if (!router.isReady || !courseId) return;

    const courseRaw = localStorage.getItem(`course-${courseId}`);
    if (!courseRaw) return;

    const course = JSON.parse(courseRaw);
    if (!course?.sidebar?.length) return;

    const firstLesson = normalizeSlug(course.sidebar[0].link);
    if (firstLesson) {
      setActiveLesson(firstLesson);
    }
  }, [router.isReady, courseId]);

  /* 🔹 Load lesson content when lesson changes */
  useEffect(() => {
    if (!activeLesson || !courseId) return;

    setData(null); // prevent stale render

    const key = `course-${courseId}-${activeLesson}`;
    console.log("Loading lesson key:", key);

    const saved = localStorage.getItem(key);
    if (saved) {
      setData(JSON.parse(saved));
    } else {
      console.warn("Lesson data missing for:", key);
    }
  }, [activeLesson, courseId]);

  if (!data) return <p>Loading course...</p>;

  return (
    <IndexController navbarData={navbarData}>
      <CourseLayout
        courseId={courseId}
        activeLesson={activeLesson}
        onLessonSelect={(link) => {
          const lessonId = normalizeSlug(link);
          if (lessonId) setActiveLesson(lessonId);
        }}
      >
        <Render config={puckConfig} data={data} />
      </CourseLayout>
    </IndexController>
  );
}

// Add navbar SSR
export const getServerSideProps = withNavbarSSR();