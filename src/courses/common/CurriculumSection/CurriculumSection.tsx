import React, { useState, useEffect, useMemo } from "react";
import { CircleCheckBig } from "lucide-react";
import { CaretUpIcon } from "@radix-ui/react-icons";
import { Separator } from "@/components/ui/separator";
import CourseCard from "./CourseCard";

const VISIBLE_COUNT = 6;
const VISIBLE = 4;

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
  curriculumTitle?: string;
}

export default function CurriculumSection({ id, course }: { id?: string; course: Course }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [showAllCurriculum, setShowAllCurriculum] = useState(false);
  const [showAllRelated, setShowAllRelated] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      const res = await fetch("/api/course/fetch");
      const data = await res.json();
      setCourses(data);
    };
    fetchCourses();
  }, []);

  const relatedCourses = useMemo(() => {
    if (!courses.length || !course?.category) return [];
    return courses.filter(
      (c) => c.category === course.category && c._id !== course._id
    );
  }, [courses, course]);

  const visibleCourses = showAllRelated
    ? relatedCourses
    : relatedCourses.slice(0, VISIBLE);

  function toggle(index: number) {
    setSelected(selected === index ? null : index);
  }

  const curriculumData = course.curriculum_data ?? [];

  const visibleCurriculum = showAllCurriculum
    ? curriculumData
    : curriculumData.slice(0, VISIBLE_COUNT);

  return (
    <section id={id} className="w-full bg-white ">
      <div className="flex justify-center m-2 border-2">
        <div className="w-11/12 max-w-7xl grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* LEFT SIDE */}
          <div className="lg:col-span-3 flex flex-col gap-6">

            <div className="text-center flex flex-col mt-5 items-left">
              <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#CD4647] to-[#7F3B40]">
                {course.curriculumTitle || `${course.title} Course Curriculum`}
              </h2>
            </div>

            <div className="bg-[#f7f7f7] rounded-lg p-5 flex flex-col gap-4">
              {visibleCurriculum.map((item, index) => (
                <div key={index} className="flex gap-4">
                  
                  {/* Timeline */}
                  <div className={`flex flex-col items-center ${
                    item.que.toLowerCase().includes("value added learning with extra module recordings") ||
                    (item.que.toLowerCase().includes("value") && item.que.toLowerCase().includes("added") && item.que.toLowerCase().includes("learning"))
                      ? "hidden"
                      : ""
                  }`}>
                    <div className="w-3 h-3 bg-red-800 rounded-full mt-6" />
                    <Separator orientation="vertical" className="flex-1 bg-red-800" />
                  </div>

                  {/* Accordion */}
                  <div
                    {...(!(item.que.toLowerCase().includes("value added learning with extra module recordings") ||
                      (item.que.toLowerCase().includes("value") && item.que.toLowerCase().includes("added") && item.que.toLowerCase().includes("learning"))) && {
                      onClick: () => toggle(index)
                    })}
                    className={`w-full rounded-xl py-2 transition-colors duration-200 ${
                      item.que.toLowerCase().includes("value added learning with extra module recordings") ||
                      (item.que.toLowerCase().includes("value") && item.que.toLowerCase().includes("added") && item.que.toLowerCase().includes("learning"))
                        ? "bg-gradient-to-tl from-[#C6151D] to-[#600A0E] ml-7 text-white"
                        : "bg-yellow-600 text-black hover:bg-red-800 hover:text-white cursor-pointer px-3"
                    }`}
                  >
                    <div className={`flex items-center ${
                      item.que.toLowerCase().includes("value added learning with extra module recordings") ||
                      (item.que.toLowerCase().includes("value") && item.que.toLowerCase().includes("added") && item.que.toLowerCase().includes("learning"))
                        ? "justify-between w-full"
                        : "px-3"
                    }`}>
                      {/* Left Arrows for Value Added Learning */}
                      {(item.que.toLowerCase().includes("value added learning with extra module recordings") ||
                        (item.que.toLowerCase().includes("value") && item.que.toLowerCase().includes("added") && item.que.toLowerCase().includes("learning"))) && (
                        <div className="flex items-center w-16 justify-center">
                          <span className="arrow text-2xl text-orange-200 font-bold">❯</span>
                          <span className="arrow text-2xl text-orange-200 font-bold">❯</span>
                          <span className="arrow text-2xl text-orange-200 font-bold">❯</span>
                        </div>
                      )}

                      <div
                        className={`text-lg font-semibold transition-colors duration-200 ${
                          item.que.toLowerCase().includes("value added learning with extra module recordings") ||
                          (item.que.toLowerCase().includes("value") && item.que.toLowerCase().includes("added") && item.que.toLowerCase().includes("learning"))
                            ? "text-orange-200 pl-3 font-bold text-[17px] text-center flex-1"
                            : "hover:text-white flex-1"
                        }`}
                        dangerouslySetInnerHTML={{ __html: item.que }}
                      />

                      {/* Right Arrows for Value Added Learning */}
                      {(item.que.toLowerCase().includes("value added learning with extra module recordings") ||
                        (item.que.toLowerCase().includes("value") && item.que.toLowerCase().includes("added") && item.que.toLowerCase().includes("learning"))) && (
                        <div className="flex items-center w-16 justify-center">
                          <span className="arrow text-2xl text-orange-200 font-bold">❮</span>
                          <span className="arrow text-2xl text-orange-200 font-bold">❮</span>
                          <span className="arrow text-2xl text-orange-200 font-bold">❮</span>
                        </div>
                      )}

                      {/* CaretUpIcon - Only for regular questions */}
                      {!(item.que.toLowerCase().includes("value added learning with extra module recordings") ||
                        (item.que.toLowerCase().includes("value") && item.que.toLowerCase().includes("added") && item.que.toLowerCase().includes("learning"))) && (
                        <CaretUpIcon
                          className={`w-6 h-6 transition-transform duration-300 ml-2 text-white ${
                            selected === index ? "rotate-0" : "rotate-180"
                          }`}
                        />
                      )}
                    </div>

                    {/* CONTENT - Only for regular questions */}
                    {!(item.que.toLowerCase().includes("value added learning with extra module recordings") ||
                      (item.que.toLowerCase().includes("value") && item.que.toLowerCase().includes("added") && item.que.toLowerCase().includes("learning"))) && (
                      <div
                        className={`transition-all duration-500 ease-in-out ${
                          selected === index
                            ? "max-h-[500px] opacity-100 mt-4"
                            : "max-h-0 opacity-0 overflow-hidden"
                        }`}
                      >
                        <Separator className="mb-4 bg-yellow-600" />

                        <div
                          className="text-sm"
                          dangerouslySetInnerHTML={{ __html: item.ans }}
                        />

                        {item?.topics?.map((topic: string, i: number) => (
                          <div key={i} className="flex items-center gap-2 mt-2 text-sm">
                            <CircleCheckBig className="w-4 h-4 text-red-800" />
                            <span>{topic}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* SHOW MORE / LESS */}
              {curriculumData.length > VISIBLE_COUNT && (
                <button
                  onClick={() => setShowAllCurriculum(!showAllCurriculum)}
                  className="mt-4 text-red-800 font-semibold text-sm hover:text-yellow-700"
                >
                  {showAllCurriculum ? "Show Less" : "Show More"}
                </button>
              )}
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="lg:col-span-2 flex flex-col md:mt-16 gap-4">
            <h3 className="text-lg font-semibold text-red-800">
              {course.category} Courses
            </h3>

            {visibleCourses.length === 0 && (
              <p className="text-sm text-gray-500">No related courses found</p>
            )}

            {visibleCourses.map((c) => (
              <CourseCard key={c._id} course={c} />
            ))}

            {/* SHOW MORE / LESS */}
            {relatedCourses.length > VISIBLE && (
              <button
                onClick={() => setShowAllRelated(!showAllRelated)}
                className="text-red-800 font-semibold text-sm mt-2 hover:text-yellow-700"
              >
                {showAllRelated ? "Show Less" : "Show More"}
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes bgMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .arrow {
          animation: moveArrow 1.5s linear infinite;
        }
        .arrow:nth-child(1) { 
          animation-delay: 0s; 
        }
        .arrow:nth-child(2) { 
          animation-delay: 0.2s; 
        }
        .arrow:nth-child(3) { 
          animation-delay: 0.4s; 
        }
        @keyframes moveArrow {
          0% {
            transform: translateX(0);
            opacity: 0.3;
          }
          50% {
            transform: translateX(8px);
            opacity: 1;
          }
          100% {
            transform: translateX(16px);
            opacity: 0.3;
          }
        }
      `}</style>
    </section>
  );
}
