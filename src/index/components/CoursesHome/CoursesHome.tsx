"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon, ChevronDownIcon } from "lucide-react";
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
  priority?: number; 
  trending_priority?: number; // Order ONLY within the Trending Courses section
}

interface CourseCategory {
  name: string;
  courses: Course[];
}

interface CoursesHomeProps {
  initialGroupedCourses?: CourseCategory[];
}

// Helper function to sort courses by priority (same as navbar logic)
const sortCoursesByPriority = (courses: Course[]): Course[] => {
  // DON'T SORT - use the order as it comes from the API (same as navbar)
  return courses;
};

// Sort used ONLY for the "Trending Courses" section. Orders trending courses by
// their `trending_priority` (lower number first). This does NOT affect any other
// category — regular categories keep using sortCoursesByPriority (a no-op).
// Courses without a trending_priority (0/undefined) fall to the end but keep
// their existing relative order (stable sort).
const sortTrendingCourses = (courses: Course[]): Course[] => {
  return [...courses].sort((a, b) => {
    const tpA = a.trending_priority && a.trending_priority > 0 ? a.trending_priority : 9999;
    const tpB = b.trending_priority && b.trending_priority > 0 ? b.trending_priority : 9999;
    return tpA - tpB;
  });
};

export default function CoursesHome({ initialGroupedCourses = [] }: CoursesHomeProps) {
  const [categoriesData, setCategoriesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  // Ref for the desktop horizontal category pill bar (used by the arrow buttons).
  const desktopCatScrollRef = useRef<HTMLDivElement | null>(null);
  const [selectedCategoryIdx, setSelectedCategoryIdx] = useState<number | null>(null);
  const [visibleLimit, setVisibleLimit] = useState(4);
  const [showAllCategories, setShowAllCategories] = useState(false);
  
  // Initialize with server-side data to prevent layout shift
  const [coursesByCategory, setCoursesByCategory] = useState<CourseCategory[]>(
    () => initialGroupedCourses || []
  );

  // Function to process categories - create "Trending Courses" from trending courses
  const processCategories = (courses: CourseCategory[]): CourseCategory[] => {
   
    
    // Filter out any remaining "Trending Courses" and "High Demanding" categories
    const filteredCourses = courses.filter(category => 
      !['Trending Courses', 'High Demanding'].includes(category.name)
    );

    // Collect all trending courses from all categories
    const trendingCourses: Course[] = [];
    const nonTrendingCategories: CourseCategory[] = [];

    filteredCourses.forEach(category => {
      const trending = category.courses.filter(c => c.trending === true);
      const nonTrending = category.courses.filter(c => c.trending !== true);

      // Add trending courses to the collection
      trendingCourses.push(...trending);

      // Keep non-trending courses in their original category, sorted by priority
      if (nonTrending.length > 0) {
        nonTrendingCategories.push({
          name: category.name,
          courses: sortCoursesByPriority(nonTrending) // Sort courses by priority
        });
      }
    });

    // Create Trending Courses category with all trending courses (only if there are any)
    const result: CourseCategory[] = [];
    
    if (trendingCourses.length > 0) {
      const sortedTrendingCourses = sortTrendingCourses(trendingCourses);
      result.push({
        name: 'Trending Courses',
        courses: sortedTrendingCourses
      });
    
    }

    // Add other categories
    result.push(...nonTrendingCategories);
    
   
    return result;
  };

  // Function to filter categories
  const filterCategories = (courses: CourseCategory[], categories: any[]) => {
   
    
   
    const allTrendingCourses: Course[] = [];
    
    courses.forEach(category => {
      const trendingInCategory = category.courses.filter(c => c.trending === true);
      allTrendingCourses.push(...trendingInCategory);
   
    });
    
   
    

    const processedCourses = processCategories(courses);
   


    const categoriesFiltered = processedCourses.filter((category) => {
        // Hide specific categories (should already be removed by processCategories, but double-check)
        const hiddenCategories = ['High Demanding', 'Trending Courses'];
        if (hiddenCategories.includes(category.name)) {
       
          return false;
        }

        // Always show "Trending Courses" (dynamically created from trending courses)
        if (category.name === 'Trending Courses') {
        
          return true;
        }

        // If categories data exists, only show categories that exist in the collection
        // Otherwise show all categories from courses
        if (categories.length > 0) {
          const categoryData = categories.find((cat: any) => cat.name === category.name);
          const shouldShow = categoryData && categoryData.slug;
         
          return shouldShow;
        }
    
        return true;
      });


    const finalResult = categoriesFiltered.map(category => {
      if (category.name === 'Trending Courses') {
      
        const sortedTrendingCourses = sortTrendingCourses(allTrendingCourses);
     
        sortedTrendingCourses.forEach((course, idx) => {
       
        });
        return {
          ...category,
          courses: sortedTrendingCourses // Use ALL trending courses we found earlier, sorted by trending_priority
        };
      }
      return category;
    });

    // STEP 5: If no Trending Courses category exists but we have trending courses, create it
    const hasTrainingCoursesCategory = finalResult.some(cat => cat.name === 'Trending Courses');
    if (!hasTrainingCoursesCategory && allTrendingCourses.length > 0) {
     
      const sortedTrendingCourses = sortTrendingCourses(allTrendingCourses);
      finalResult.unshift({
        name: 'Trending Courses',
        courses: sortedTrendingCourses
      });
    }

    const sortedResult = finalResult.sort((a, b) => {
        // Always put "Trending Courses" first
        if (a.name === 'Trending Courses') return -1;
        if (b.name === 'Trending Courses') return 1;

        // If categories data exists, sort by position
        if (categories.length > 0) {
          const categoryDataA = categories.find((cat: any) => cat.name === a.name);
          const categoryDataB = categories.find((cat: any) => cat.name === b.name);

          const positionA = categoryDataA?.position || 999;
          const positionB = categoryDataB?.position || 999;

          return positionA - positionB;
        }
        // Otherwise keep original order
        return 0;
      });
      

    return sortedResult;
  };

  // ✅ FETCH GROUPED API (Only if no initial data)
  useEffect(() => {
    if (initialGroupedCourses.length > 0) {
      // Already have server-side data
      return;
    }

    const fetchCourses = async () => {
      setLoading(true);
      try {
        // Fetch both courses and categories data
        const [coursesRes, categoriesRes] = await Promise.all([
          fetch("/api/course/fetch-grouped"),
          fetch("/api/category/fetch")
        ]);
        
        const coursesData: CourseCategory[] = await coursesRes.json();
        const categoriesApiData = await categoriesRes.json();
        setCategoriesData(categoriesApiData);

        const filteredCourses = filterCategories(coursesData, categoriesApiData);
        setCoursesByCategory(filteredCourses);
      
      } catch (err) {
        console.error("Failed to fetch courses", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [initialGroupedCourses]);

  // ✅ Filter initial courses when categoriesData is available
  useEffect(() => {
    if (initialGroupedCourses.length > 0 && categoriesData.length > 0) {
      const filteredCourses = filterCategories(initialGroupedCourses, categoriesData);
      setCoursesByCategory(filteredCourses);
     
    }
  }, [initialGroupedCourses, categoriesData]);

  // ✅ Fetch categories data when initial courses are provided
  useEffect(() => {
    if (initialGroupedCourses.length > 0 && categoriesData.length === 0) {
      const fetchCategories = async () => {
        try {
          const categoriesRes = await fetch("/api/category/fetch");
          const categoriesApiData = await categoriesRes.json();
          setCategoriesData(categoriesApiData);
          
          // Immediately filter the initial courses once categories are fetched
          const filteredCourses = filterCategories(initialGroupedCourses, categoriesApiData);
          setCoursesByCategory(filteredCourses);
          
        } catch (err) {
          console.error("Failed to fetch categories", err);
        }
      };
      
      fetchCategories();
    }
  }, [initialGroupedCourses, categoriesData.length]);
  
  // ✅ AUTO SELECT "Trending Courses" CATEGORY - Immediate selection to prevent layout shift
  useEffect(() => {
    if (coursesByCategory.length) {
   
     

      // Find "Trending Courses" category (should be first after processing)
      const trainingIdx = coursesByCategory.findIndex(
        cat => cat.name.toLowerCase() === 'trending courses'
      );

     

      // Select Trending Courses if found, otherwise first category - immediate to prevent layout shift
      setSelectedCategoryIdx(trainingIdx !== -1 ? trainingIdx : 0);
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

  // 🔹 COURSE CARD - Optimized for CLS
  const CourseCard = ({ course }: { course: Course }) => {
    // ✅ FIX: Use consistent hash-based values to prevent re-renders causing layout shift
    const courseId = course._id || course.id || course.title;
    const rating = useMemo(() => {
      // Create a simple hash from course ID for consistent rating
      let hash = 0;
      for (let i = 0; i < courseId.length; i++) {
        const char = courseId.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
      }
      const normalizedHash = Math.abs(hash) / Math.pow(2, 31);
      return Number((normalizedHash * (5 - 4.6) + 4.6).toFixed(1));
    }, [courseId]);

    const ratingCount = useMemo(() => {
      // Create another hash for rating count
      let hash = 0;
      for (let i = 0; i < courseId.length; i++) {
        const char = courseId.charCodeAt(i);
        hash = ((hash << 3) - hash) + char;
        hash = hash & hash;
      }
      return Math.abs(hash % 1000) + 6000; // 6000-7000 range
    }, [courseId]);

    return (
      <Link
        href={`/courses/${course.link}`}
        className="group block min-w-[280px] sm:min-w-0 w-full rounded-xl shadow-lg overflow-hidden border border-gray-200 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl relative bg-white flex flex-col"
        style={{ minHeight: '360px' }} // Min height keeps cards uniform but lets them grow so content never clips (fixes mobile overflow)
      >
        {/* Fixed aspect ratio image container */}
        <div className="relative bg-white w-full overflow-hidden" style={{ height: '144px' }}>
          {course.image && (
            <Image
              src={course.image}
              alt={course.alt ?? course.title}
              width={320}
              height={144}
              sizes="(max-width: 768px) 90vw, 320px"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              style={{ aspectRatio: '20/9' }}
              priority={false}
              loading="lazy"
            />
          )}
          <div className="absolute bottom-0 right-0 flex items-center gap-1 bg-white px-1 py-1 rounded-tl-xl z-10">
            <Image 
              src="/home/hero/logo/microsoft.svg" 
              width={40} 
              height={24} 
              alt="Microsoft"
              style={{ width: '40px', height: '24px' }}
            />
            <Image 
              src="/home/hero/logo/ibm.svg" 
              width={22} 
              height={24} 
              alt="IBM"
              style={{ width: '22px', height: '24px' }}
            />
            <Image 
              src="/home/hero/logo/iso.png" 
              width={22} 
              height={24} 
              alt="ISO"
              style={{ width: '22px', height: '24px' }}
            />
          </div>
        </div>

        <div className="p-4 flex flex-col flex-grow" style={{ minHeight: '216px' }}>
          {/* Fixed height title container */}
          <div style={{ minHeight: '40px', maxHeight: '60px' }}>
            <span
              className="text-sm font-bold text-gray-900 leading-tight group-hover:text-[#C6151D] transition-colors line-clamp-3"
              dangerouslySetInnerHTML={{ __html: course.title }}
            />
          </div>

          {/* Short description (2 lines) from DB - fixed height to avoid layout shift */}
          {course.shortDesc && (
            <div style={{ minHeight: '32px' }} className="mt-1">
              <p
                className="text-xs text-gray-500 leading-snug line-clamp-2"
                dangerouslySetInnerHTML={{ __html: course.shortDesc }}
              />
            </div>
          )}

          {/* Fixed height rating section */}
          <div className="flex items-center gap-1 text-yellow-400" style={{ height: '24px', marginTop: '8px', marginBottom: '8px' }}>
            <span className="text-sm">★ ★ ★ ★</span>
            <span className="text-xs text-blue-700 font-medium">
              {rating} ({ratingCount})
            </span>
          </div>

          {/* Fixed height button container */}
          <div className="border-t pt-4 mt-auto" style={{ minHeight: '56px' }}>
            <div className="w-full py-2 rounded-md text-center text-xs font-semibold bg-[#ff2a3b] text-white">
              View Program
            </div>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <section ref={sectionRef} id="courses" className="w-full  p-2 bg-white py-3">
      <div className=" p-1">
      <div className="max-w-6xl mx-auto px-4">
        {/* Pre-allocate space for title to prevent shift */}
               <div className="text-center py-2 ">
        <h2 className="text-[#ff2a3b] md:text-3xl text-2xl font-bold">
          Explore Our All Courses
        </h2>

        <svg
          className="mx-auto"
          width="340"
          height="6"
          viewBox="0 0 340 6"
          preserveAspectRatio="none"
        >
          <path
            d="M0 3 Q170 0 340 3 Q170 6 0 3 Z"
            fill="#7f1d1d"
          />
        </svg>
      </div>

        <div className="flex flex-col gap-6">
          {/* CATEGORY BAR (top) + COURSES (below) */}
          <aside className="w-full flex flex-col gap-3">
            {loading ? (
              // Loading skeleton with fixed dimensions
              <div className="hidden md:flex gap-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
                ))}
              </div>
            ) : (
              <>
                {/* DESKTOP - HORIZONTAL SCROLLABLE PILL BAR WITH ARROWS */}
                <div className="hidden md:flex relative items-center border border-[#C6151D] rounded-lg px-9 py-2 bg-white">
                  {/* Left arrow */}
                  <button
                    type="button"
                    aria-label="Scroll categories left"
                    onClick={() => desktopCatScrollRef.current?.scrollBy({ left: -240, behavior: 'smooth' })}
                    className="absolute left-1.5 top-1/2 -translate-y-1/2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-[#ff2a3b] text-white hover:bg-[#c84b52] transition"
                  >
                    <ChevronLeftIcon className="w-4 h-4" />
                  </button>

                  <div
                    ref={desktopCatScrollRef}
                    className="flex gap-2 overflow-x-auto no-scrollbar w-full"
                  >
                    {coursesByCategory.map((cat, idx) => (
                      <button
                        key={cat.name}
                        onClick={() => handleCategoryChange(idx)}
                        className={`whitespace-nowrap px-4 border py-1.5 rounded-md text-sm font-medium transition-all shrink-0
                          ${selectedCategoryIdx === idx
                            ? "bg-[#ff2a3b] text-white"
                            : "bg-white text-gray-700 hover:text-[#C6151D]"
                          }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>

                  {/* Right arrow */}
                  <button
                    type="button"
                    aria-label="Scroll categories right"
                    onClick={() => desktopCatScrollRef.current?.scrollBy({ left: 240, behavior: 'smooth' })}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-[#ff2a3b] text-white hover:bg-[#C6151D] transition"
                  >
                    <ChevronRightIcon className="w-4 h-4" />
                  </button>
                </div>

                {/* MOBILE - horizontal category pill bar + horizontal course row.
                    Redesigned to match the reference: a scrollable row of
                    category pills (with left/right arrows) on top, and the
                    selected category's courses in a horizontally scrolling row
                    below, ending with a "Show more" button. Desktop is untouched. */}
                <div className="md:hidden flex flex-col gap-3" style={{ minHeight: '260px' }}>
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
                        style={{ minHeight: '40px' }} // Fixed button height
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
                              <div key={course._id} className="flex-shrink-0 w-[280px] max-w-[85vw]">
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
                          <>Show Less <ChevronUpIcon className="w-4 h-4" /></>
                        ) : (
                          <>Show More <ChevronDownIcon className="w-4 h-4" /></>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </aside>

          {/* DESKTOP GRID - Pre-allocate space (full width, below the pill bar) */}
          <main className="hidden md:block w-full" style={{ minHeight: '400px' }}>
            {loading ? (
              // Loading skeleton with fixed dimensions matching actual content
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden" style={{ height: '320px' }}>
                    {/* Image skeleton */}
                    <div className="w-full bg-gray-200 animate-pulse" style={{ height: '144px' }}></div>
                    {/* Content skeleton */}
                    <div className="p-4 space-y-3">
                      {/* Title skeleton */}
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                      </div>
                      {/* Rating skeleton */}
                      <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                      {/* Button skeleton */}
                      <div className="border-t pt-4 mt-auto">
                        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                  </div>
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
            ) : (
              // Placeholder when no category selected - prevents layout shift
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-80 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <span className="text-gray-500">Select a category</span>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
      </div>
    </section>
  );
}
