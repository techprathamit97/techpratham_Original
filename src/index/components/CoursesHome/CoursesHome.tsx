"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import Link from "next/link";
import { ChevronRightIcon, ChevronUpIcon, ChevronDownIcon } from "lucide-react";
import Image from "next/image";

interface Course {
  _id?: string;
  id?: string;
  title: string;
  image: string;
  alt?: string;
  category: string;
  link: string;
  shortDesc?: string;
  trending?: boolean;
}

interface CourseCategory {
  name: string;
  courses: Course[];
}

interface CoursesHomeProps {
  initialGroupedCourses?: CourseCategory[];
}

export default function CoursesHome({ initialGroupedCourses = [] }: CoursesHomeProps) {
  const [coursesByCategory, setCoursesByCategory] = useState<CourseCategory[]>(initialGroupedCourses);
  const [loading, setLoading] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const [selectedCategoryIdx, setSelectedCategoryIdx] = useState<number | null>(null);
  const [visibleLimit, setVisibleLimit] = useState(4);
  const [showAllCategories, setShowAllCategories] = useState(false);

  // ✅ FETCH GROUPED API (Only if no initial data)
  useEffect(() => {
    if (initialGroupedCourses.length > 0) {
      // Already have server-side data
      return;
    }

    const fetchCourses = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/course/fetch-grouped");
        const data: CourseCategory[] = await res.json();
        setCoursesByCategory(data);
      } catch (err) {
        console.error("Failed to fetch courses", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [initialGroupedCourses]);

  // ✅ AUTO SELECT FIRST CATEGORY
  useEffect(() => {
    if (coursesByCategory.length) {
      setSelectedCategoryIdx(0);
    }
  }, [coursesByCategory]);

  const handleCategoryChange = (idx: number) => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

    // ✅ MOBILE → TOGGLE
    if (isMobile && selectedCategoryIdx === idx) {
      setSelectedCategoryIdx(null);
      return;
    }

    // ✅ SELECT CATEGORY
    setSelectedCategoryIdx(idx);
    setVisibleLimit(4);

    // ✅ DESKTOP SCROLL ONLY
    if (!isMobile && sectionRef.current) {
      sectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const currentCategory =
    selectedCategoryIdx !== null
      ? coursesByCategory[selectedCategoryIdx]
      : null;

  // 🔹 COURSE CARD
  const CourseCard = ({ course }: { course: Course }) => {
    // ✅ FIX: Memoize random values so they don't change on every render
    const rating = useMemo(() => Number((Math.random() * (5 - 4.6) + 4.6).toFixed(1)), [course._id || course.id]);
    const ratingCount = useMemo(() => Math.floor(Math.random() * (7000 - 6000 + 1)) + 6000, [course._id || course.id]);

    return (
      <Link
        href={`/courses/${course.link}`}
        className="group block min-w-[280px] sm:min-w-0 w-full h-full rounded-xl shadow-lg overflow-hidden border border-gray-200 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl relative bg-white flex flex-col"
      >
        <div className="relative bg-gray-500 h-36 w-full overflow-hidden">
          {course.image && (
            <Image
              src={course.image}
              alt={course.alt ?? ""}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          )}
          <div className="absolute bottom-0 right-0 flex items-center gap-1 bg-[#f7f7f7] px-1 py-1 rounded-tl-xl z-10">
            <Image src="/home/hero/logo/microsoft.svg" width={40} height={24} alt="Microsoft" />
            <Image src="/home/hero/logo/ibm.svg" width={22} height={24} alt="IBM" />
            <Image src="/home/hero/logo/iso.png" width={22} height={24} alt="ISO" />
          </div>
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <div className="min-h-[40px]">
            <span
              className="text-sm font-bold text-gray-900 leading-tight group-hover:text-[#C6151D] transition-colors"
              dangerouslySetInnerHTML={{ __html: course.title }}
            />
          </div>

          <div className="flex items-center gap-1 text-yellow-400 my-2">
            <span className="text-sm">★ ★ ★ ★</span>
            <span className="text-xs text-blue-500 font-medium">
              {rating} ({ratingCount})
            </span>
          </div>

          <div className="border-t pt-4 mt-auto">
            <div className="w-full py-2 rounded-md text-center text-xs font-semibold bg-gradient-to-tl from-[#C6151D] to-[#600A0E] text-white">
              View Program
            </div>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <section ref={sectionRef} id="courses" className="w-full bg-[#f3f9ff] py-10">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 md:mb-10 text-center md:text-left">
          Explore Our All Courses
        </h2>

        <div className="flex flex-col md:flex-row gap-8">
          {/* SIDEBAR - SCROLLABLE FOR DESKTOP, SHOW MORE/LESS FOR MOBILE */}
          <aside className="w-full md:w-1/4 flex flex-col gap-3">
            {loading ? (
              <div className="flex flex-col gap-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                ))}
              </div>
            ) : (
              <>
                {/* DESKTOP - SCROLLABLE */}
                <div 
                  className="hidden md:flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-2" 
                  style={{ scrollbarWidth: 'thin', scrollbarColor: '#C6151D #f3f9ff' }}
                >
                  <style jsx>{`
                    div::-webkit-scrollbar {
                      width: 6px;
                    }
                    div::-webkit-scrollbar-track {
                      background: #f3f9ff;
                      border-radius: 10px;
                    }
                    div::-webkit-scrollbar-thumb {
                      background: #C6151D;
                      border-radius: 10px;
                    }
                    div::-webkit-scrollbar-thumb:hover {
                      background: #600A0E;
                    }
                  `}</style>
                  {coursesByCategory.map((cat, idx) => (
                    <div key={cat.name}>
                      <button
                        onClick={() => handleCategoryChange(idx)}
                        onMouseEnter={() => {
                          // Only trigger on desktop
                          if (typeof window !== 'undefined' && window.innerWidth >= 768) {
                            setSelectedCategoryIdx(idx);
                            setVisibleLimit(4);
                          }
                        }}
                        className={`flex items-center justify-between px-5 py-2 rounded-lg w-full border transition-all
                          ${selectedCategoryIdx === idx
                            ? "bg-gradient-to-tl from-[#C6151D] to-[#600A0E] text-white"
                            : "bg-white text-gray-700 hover:bg-yellow-500"
                          }`}
                      >
                        {cat.name}
                      </button>
                    </div>
                  ))}
                </div>

                {/* MOBILE - SHOW MORE/LESS */}
                <div className="md:hidden flex flex-col gap-3">
                  {coursesByCategory
                    .slice(0, showAllCategories ? coursesByCategory.length : 5)
                    .map((cat, idx) => (
                    <div key={cat.name}>
                      <button
                        onClick={() => handleCategoryChange(idx)}
                        className={`flex items-center justify-between px-5 py-2 rounded-lg w-full border transition-all
                          ${selectedCategoryIdx === idx
                            ? "bg-gradient-to-tl from-[#C6151D] to-[#600A0E] text-white"
                            : "bg-white text-gray-700 hover:bg-yellow-500"
                          }`}
                      >
                        {cat.name}
                        <ChevronDownIcon
                          className={`transition-transform ${selectedCategoryIdx === idx ? "rotate-180" : ""
                            }`}
                        />
                      </button>

                      {/* MOBILE COURSES */}
                      {selectedCategoryIdx === idx && (
                        <div className="mt-4">
                          <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar">
                            {cat.courses.slice(0, visibleLimit).map(course => (
                              <div key={course._id} className="flex-shrink-0 w-[85%]">
                                <CourseCard course={course} />
                              </div>
                            ))}
                          </div>

                          {cat.courses.length > 4 && (
                            <div className="flex justify-center mt-2">
                              <button
                                onClick={() =>
                                  setVisibleLimit(
                                    visibleLimit === 4 ? cat.courses.length : 4
                                  )
                                }
                                className="text-[#C6151D] text-xs font-bold"
                              >
                                {visibleLimit === 4 ? "Show More" : "Show Less"}
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {/* SHOW MORE/LESS CATEGORIES BUTTON - MOBILE ONLY */}
                  {coursesByCategory.length > 5 && (
                    <div className="flex justify-center mt-4">
                      <button
                        onClick={() => setShowAllCategories(!showAllCategories)}
                        className="flex items-center gap-2 bg-white border border-[#C6151D] text-[#C6151D] px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#C6151D] hover:text-white transition-colors"
                      >
                        {showAllCategories ? (
                          <>
                            Show Less <ChevronUpIcon className="w-4 h-4" />
                          </>
                        ) : (
                          <>
                            Show More <ChevronDownIcon className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </aside>

          {/* DESKTOP GRID */}
          <main className="hidden md:block w-3/4">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-64 bg-gray-200 rounded-xl animate-pulse"></div>
                ))}
              </div>
            ) : currentCategory ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {currentCategory.courses.slice(0, visibleLimit).map(course => (
                    <CourseCard key={course._id} course={course} />
                  ))}
                </div>

                {currentCategory.courses.length > 4 && (
                  <div className="flex justify-center mt-10">
                    <button
                      onClick={() =>
                        setVisibleLimit(
                          visibleLimit === 4
                            ? currentCategory.courses.length
                            : 4
                        )
                      }
                      className="flex items-center gap-2 bg-white border border-[#C6151D] text-[#C6151D] px-6 py-2 rounded-full font-semibold hover:bg-[#C6151D] hover:text-white transition-colors"
                    >
                      {visibleLimit === 4 ? (
                        <>
                          Show more <ChevronRightIcon className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          Show less <ChevronUpIcon className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                )}
              </>
            ) : null}
          </main>
        </div>
      </div>
    </section>
  );
}
