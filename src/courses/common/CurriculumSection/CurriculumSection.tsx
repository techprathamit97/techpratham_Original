import React, { useState, useEffect, useMemo } from "react";
import { CircleCheckBig } from "lucide-react";
import { CaretUpIcon } from "@radix-ui/react-icons";
import { Separator } from "@/components/ui/separator";
import CourseCard from "./CourseCard";

const VISIBLE_COUNT = 6; // for left side curriculum items
const VISIBLE = 4; // for right side related courses

interface CurriculumItem {
  que: string;
  ans: string;
  topics?: string[];
 id?: string;
}

interface Course {
  _id: string;
  title: string;
  category: string;
  link: string;
  curriculum_data?: CurriculumItem[];
}

export default function CurriculumSection({ id, course }: { id?: string; course: Course }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [showAllCurriculum, setShowAllCurriculum] = useState(false);
  const [showAllRelated, setShowAllRelated] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);

  /* ---------- FETCH ALL COURSES ---------- */
  useEffect(() => {
    const fetchCourses = async () => {
      const res = await fetch("/api/course/fetch");
      const data = await res.json();
      setCourses(data);
    };
    fetchCourses();
  }, []);

  /* ---------- FIND SAME CATEGORY COURSES ---------- */
  const relatedCourses = useMemo(() => {
    if (!courses.length || !course?.category) return [];
    return courses.filter(
      (c) => c.category === course.category && c._id !== course._id
    );
  }, [courses, course]);

  const visibleCourses = showAllRelated
    ? relatedCourses
    : relatedCourses.slice(0, VISIBLE);

  /* ---------- HANDLE ACCORDION TOGGLE ---------- */
  function toggle(index: number) {
    setSelected(selected === index ? null : index);
  }

  /* ---------- VISIBLE CURRICULUM DATA ---------- */
  // Use fallback empty array so no undefined issues
  const curriculumData = course.curriculum_data ?? [];

  const visibleCurriculum = showAllCurriculum
    ? curriculumData
    : curriculumData.slice(0, VISIBLE_COUNT);

  return (
    <section id={id} className="w-full bg-white py-16 flex justify-center">
      <div className="w-11/12 max-w-7xl grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* LEFT SIDE */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              <span dangerouslySetInnerHTML={{ __html: course.title }} /> Course Curriculum
            </h2>
            <div className="w-32 h-1 bg-orange-500 mt-2" />
          </div>

          <div className="bg-[#f7f7f7] rounded-lg p-5 flex flex-col gap-4">
            {visibleCurriculum.map((item, index) => (
              <div key={index} className="flex gap-4">
                {/* Timeline */}
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-blue-900 rounded-full mt-6" />
                  <Separator orientation="vertical" className="flex-1 bg-blue-200" />
                </div>

                {/* Accordion */}
                <div
                  onClick={() => toggle(index)}
                  className="w-full bg-[#CA8A04]/60 hover:bg-[#b0dcfb] transition-all rounded-xl px-6 py-2 cursor-pointer"
                >
                  <div className="flex justify-between items-center">
                    <div
                      className="text-lg font-semibold text-black"
                      dangerouslySetInnerHTML={{ __html: item.que }}
                    />

                    <CaretUpIcon
                      className={`w-6 h-6 text-blue-900 transition-transform duration-300 ${
                        selected === index ? "rotate-0" : "rotate-180"
                      }`}
                    />
                  </div>

                  {/* CONTENT */}
                  <div
                    className={`transition-all duration-500 ease-in-out ${
                      selected === index
                        ? "max-h-[500px] opacity-100 mt-4"
                        : "max-h-0 opacity-0 overflow-hidden"
                    }`}
                  >
                    <Separator className="mb-4 bg-yellow-800" />

                    <div
                      className="text-sm text-gray-700"
                      dangerouslySetInnerHTML={{ __html: item.ans }}
                    />

                    {item?.topics?.map((topic: string, i: number) => (
                      <div key={i} className="flex items-center gap-2 mt-2 text-sm">
                        <CircleCheckBig className="w-4 h-4 text-green-600" />
                        <span>{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* SHOW MORE / LESS for curriculum */}
            {curriculumData.length > VISIBLE_COUNT && (
              <button
                onClick={() => setShowAllCurriculum(!showAllCurriculum)}
                className="mt-4 text-blue-800 font-semibold text-sm hover:underline"
              >
                {showAllCurriculum ? "Show Less" : "Show More"}
              </button>
            )}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="lg:col-span-2 flex flex-col md:mt-14 gap-4">
          <h3 className="text-lg font-semibold">{course.category} Courses</h3>

          {visibleCourses.length === 0 && (
            <p className="text-sm text-gray-500">No related courses found</p>
          )}

          {visibleCourses.map((c) => (
            <CourseCard key={c._id} course={c} />
          ))}

          {/* SHOW MORE / LESS for related courses */}
          {relatedCourses.length > VISIBLE && (
            <button
              onClick={() => setShowAllRelated(!showAllRelated)}
              className="text-[#C6151D] font-semibold text-sm mt-2"
            >
              {showAllRelated ? "Show Less" : "Show More"}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

// export default CurriculumSection;



// "use client";

// import { useEffect, useMemo, useState } from "react";
// import CourseCard from "./CourseCard";

// const VISIBLE = 4;

// interface Course {
//   _id: string;
//   title: string;
//   category: string;
//   link: string;
// }

// export default function CurriculumSection({ course }: { course: Course }) {
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [showAll, setShowAll] = useState(false);

//   /* ---------- FETCH ALL COURSES ---------- */
//   useEffect(() => {
//     const fetchCourses = async () => {
//       const res = await fetch("/api/course/fetch");
//       const data = await res.json();
//       setCourses(data);
//     };
//     fetchCourses();
//   }, []);

//   /* ---------- FIND SAME CATEGORY COURSES ---------- */
//   const relatedCourses = useMemo(() => {
//     if (!courses.length || !course?.category) return [];
//     return courses.filter(
//       (c) => c.category === course.category && c._id !== course._id
//     );
//   }, [courses, course]);

//   const visibleCourses = showAll
//     ? relatedCourses
//     : relatedCourses.slice(0, VISIBLE);

//   return (
//     <section className="w-full py-16 bg-white">
//       <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">

//         {/* LEFT */}
//         <div className="lg:col-span-3">
//           <h2 className="text-2xl font-bold">
//             Curriculum
//           </h2>
//           <div className="w-32 h-1 bg-orange-500 mt-2" />
//           {/* curriculum content here */}
//         </div>

//         {/* RIGHT */}
//         <div className="lg:col-span-2 flex flex-col gap-4">
//           <h3 className="text-lg font-semibold">
//             {course.category} Courses
//           </h3>

//           {visibleCourses.length === 0 && (
//             <p className="text-sm text-gray-500">
//               No related courses found
//             </p>
//           )}

//           {visibleCourses.map((c) => (
//             <CourseCard key={c._id} course={c} />
//           ))}

//           {relatedCourses.length > VISIBLE && (
//             <button
//               onClick={() => setShowAll(!showAll)}
//               className="text-[#C6151D] font-semibold text-sm mt-2"
//             >
//               {showAll ? "Show Less" : "Show More"}
//             </button>
//           )}
//         </div>

//       </div>
//     </section>
//   );
// }
