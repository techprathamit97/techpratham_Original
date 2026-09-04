import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { IoIosArrowForward } from "react-icons/io";
import { NavbarCategory, NavbarCourse } from '@/utils/navbarData';

interface CoursesDropdownProps {
  isActive: boolean;
  coursesByCategory: NavbarCategory[];
  allCourses: NavbarCourse[];
  categoriesData: any[];
  isLoading: boolean;
  onCourseClick: () => void;
  dropdownRef?: React.RefObject<HTMLDivElement>;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;

  anchorTo?: 'button' | 'navbar';
}

const CoursesDropdown: React.FC<CoursesDropdownProps> = ({
  isActive,
  coursesByCategory,
  allCourses,
  categoriesData,
  isLoading,
  onCourseClick,
  dropdownRef,
  onMouseEnter,
  onMouseLeave,
  anchorTo = 'navbar',
}) => {
  const [hoveredCategory, setHoveredCategory] = useState<string>("");
  const [hoveredPath, setHoveredPath] = useState<string[]>([]); // Track the full path of nested subcategories

  // Get subcategories for a category from categories API data
  const getSubcategoriesForCategory = (categoryName: string) => {
    const categoryData = categoriesData.find(cat =>
      cat.name.toLowerCase() === categoryName.toLowerCase()
    );
    return categoryData?.subcategories || [];
  };

  // Get child subcategories for any subcategory at any level
  const getChildSubcategories = (parentPath: string[]): any[] => {
    if (parentPath.length === 0) return [];

    const categoryName = parentPath[0];
    let currentLevel = getSubcategoriesForCategory(categoryName);

    // Navigate through the path to find the current subcategory
    for (let i = 1; i < parentPath.length; i++) {
      const targetSubcategory = currentLevel.find((sub: any) => sub.name === parentPath[i]);
      if (targetSubcategory && targetSubcategory.children) {
        currentLevel = targetSubcategory.children;
      } else {
        return [];
      }
    }

    return currentLevel;
  };

  // Get courses for a subcategory at any level
  const getCoursesForSubcategoryPath = (categoryName: string, path: string[]): NavbarCourse[] => {
    if (path.length === 0) {
      // Return all courses for the category
      return allCourses.filter(course => course.category === categoryName);
    }

    // Get courses for the specific subcategory path
    const subcategoryName = path[path.length - 1]; // Last item in path
    return allCourses.filter(course =>
      course.category === categoryName &&
      course.subcategoryName === subcategoryName
    );
  };

  // Check if category has subcategories
  const categoryHasSubcategories = (categoryName: string): boolean => {
    const subcategories = getSubcategoriesForCategory(categoryName);
    return subcategories.length > 0;
  };

  // Get courses for hovered category from fetched data
  const hoveredCategoryCourses = useMemo(() => {
    if (!hoveredCategory) return [];
    const category = coursesByCategory.find(cat => cat.name === hoveredCategory);
    return category?.courses || [];
  }, [coursesByCategory, hoveredCategory]);

  // Calculate width based on how many levels are showing
  const calculateWidth = () => {
    if (!hoveredCategory) return '300px';

    let columns = 2; // Category + first level
    if (hoveredPath.length > 0) {
      columns += hoveredPath.length - 1; // Add columns for each nested level
    }

    return `${300 + (columns - 1) * 300}px`;
  };

  // Handle category hover
  const handleCategoryHover = (categoryName: string) => {
    setHoveredCategory(categoryName);
    setHoveredPath([]);
  };

  // Handle subcategory hover at any level
  const handleSubcategoryHover = (subcategoryName: string, level: number) => {
    const newPath = [...hoveredPath.slice(0, level), subcategoryName];
    setHoveredPath(newPath);
  };

  // Reset all hover allocations when leaving the entire component layout completely
  const handleDropdownLeave = () => {
    setHoveredCategory("");
    setHoveredPath([]);
  };

  // Use CSS visibility instead of conditional return so dropdown can detect hover
  // when parent is transitioning between states

  // Render columns dynamically
  const renderColumns = () => {
    const columns = [];

    // Always render categories column
    columns.push(
      <div
        key="categories"
        className='w-64 bg-white border-r rounded-lg border-gray-200 flex flex-col'
      >
        <h3 className='font-bold text-sm rounded-t-lg text-gray-800 p-4 border-b border-gray-200 bg-blue-50'>
          All Courses
        </h3>
        <div className='flex-1 overflow-y-auto max-h-[460px] [&::-webkit-scrollbar]:hidden'>
          {isLoading ? (
            <div className='p-4 text-center'>
              <span className='text-gray-500'>Loading categories...</span>
            </div>
          ) : coursesByCategory.length === 0 ? (
            <div className='p-4 text-center text-gray-500'>
              <p className="mb-2">No categories available</p>
            </div>
          ) : (
            coursesByCategory
              .filter((category) => {
                // Hide specific categories from navbar dropdown
                const hiddenCategories = ['High Demanding', 'Trending Courses'];
                if (hiddenCategories.includes(category.name)) {
                  return false;
                }

                // Only show categories that exist in the categories collection
                const categoryData = categoriesData.find(cat => cat.name === category.name);
                return categoryData && categoryData.slug; // Must have both category data and slug
              })
              .sort((a, b) => {
                // Sort categories by position (lower position = shown first)
                const categoryDataA = categoriesData.find(cat => cat.name === a.name);
                const categoryDataB = categoriesData.find(cat => cat.name === b.name);

                const positionA = categoryDataA?.position || 999;
                const positionB = categoryDataB?.position || 999;

                return positionA - positionB;
              })
              .map((category) => {
                const hasSubcategories = categoryHasSubcategories(category.name);
                const coursesCount = category.courses.length;
                const subcategoriesCount = getSubcategoriesForCategory(category.name).length;

                // Find category data to get the database slug  
                const categoryData = categoriesData.find(cat => cat.name === category.name);
                const categorySlug = categoryData?.slug;

                return (
                  <button
                    key={category.name}
                    onClick={() => {
                      handleCategoryHover(category.name);
                    }}
                    className={`w-60 flex items-center justify-between px-2 py-2 m-2 rounded-xl transition-all duration-300
    ${hoveredCategory === category.name
                        ? "bg-[#CA8A04] text-white shadow-lg"
                        : "bg-gradient-to-tl from-[#b73137] to-[#d72a33]  text-white hover:shadow-md"
                      }`}
                  >
                    <span className="text-[14px] font-semibold tracking-tight">
                      {category.name}
                    </span>

                    <IoIosArrowForward
                      className={`text-xl transition-transform duration-300 ${hoveredCategory === category.name

                        }`}
                    />
                  </button>
                );
              })
          )}
        </div>
      </div>
    );

    // Render subcategory columns dynamically
    if (hoveredCategory) {
      let currentSubcategories = getSubcategoriesForCategory(hoveredCategory);

      // Render first level subcategories or courses if no subcategories
      if (currentSubcategories.length > 0) {
        columns.push(
          <div
            key="level-1"
            className='w-56 bg-gray-25 border-r border-gray-200 flex flex-col'
          >
            <h3 className='font-bold text-sm text-gray-800 p-4 border-b border-gray-200 bg-gray-100'>
              {hoveredCategory} - Topics
            </h3>
            <div className='flex-1 bg-white overflow-y-auto max-h-[460px] [&::-webkit-scrollbar]:hidden'>
              {currentSubcategories.map((subcategory: any) => {
                const hasChildren = subcategory.children && subcategory.children.length > 0;
                const courseCount = getCoursesForSubcategoryPath(hoveredCategory, [subcategory.name]).length;

                // Get subcategory slug - use database slug if available, fallback to generated
                const subcategorySlug = subcategory.slug || subcategory.name.toLowerCase().replace(/\s+/g, '-');

                return (
                  <Link
                    key={subcategory.name}
                    href={`/courses/${subcategorySlug}`}
                    className={`w-full text-left p-3 border-b border-gray-100 hover:bg-gray-100 transition-colors flex items-center justify-between ${hoveredPath.length > 0 && hoveredPath[0] === subcategory.name ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700"
                      }`}
                    onMouseEnter={() => handleSubcategoryHover(subcategory.name, 0)}
                    onClick={onCourseClick}
                  >
                    <div className="flex-1">
                      <div className="font-medium text-sm">{subcategory.name}</div>

                    </div>
                    {(hasChildren || courseCount > 0) && (
                      <IoIosArrowForward className="text-gray-400 text-lg" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        );

        // Render nested levels
        let level = 0;
        while (level < hoveredPath.length) {
          const pathToLevel = [hoveredCategory, ...hoveredPath.slice(0, level + 1)];
          const children = getChildSubcategories(pathToLevel);

          if (children.length > 0) {
            const currentLevelIndex = level; // lock scope context for dynamic closure reference if needed
            columns.push(
              <div
                key={`level-${currentLevelIndex + 2}`}
                className='w-96 bg-white border-r border-gray-200 flex flex-col'
              >
                <h3 className='font-bold text-sm text-gray-800 p-4 border-b border-gray-200 bg-green-50'>
                  {hoveredPath[currentLevelIndex]} - Subtopics
                </h3>
                <div className='flex-1 bg-white overflow-y-auto max-h-[460px] [&::-webkit-scrollbar]:hidden'>
                  {children.map((child: any) => {
                    const hasGrandChildren = child.children && child.children.length > 0;
                    const courseCount = getCoursesForSubcategoryPath(hoveredCategory, [...hoveredPath.slice(0, currentLevelIndex + 1), child.name]).length;

                    // Use the nested subcategory's database slug  
                    const nestedSlug = child.slug || child.name.toLowerCase().replace(/\s+/g, '-');

                    return (
                      <Link
                        key={child.name}
                        href={`/courses/${nestedSlug}`}
                        className={`w-full text-left p-3 border-b border-gray-100 hover:bg-gray-100 transition-colors flex items-center justify-between ${hoveredPath.length > currentLevelIndex + 1 && hoveredPath[currentLevelIndex + 1] === child.name ? "bg-green-50 text-green-700 font-medium" : "text-gray-700"
                          }`}
                        onMouseEnter={() => handleSubcategoryHover(child.name, currentLevelIndex + 1)}
                        onClick={onCourseClick}
                      >
                        <div className="flex-1">
                          <div className="font-medium text-sm">{child.name}</div>
                          <div className="text-xs text-gray-500">
                            {hasGrandChildren ? `${child.children.length} subtopics` :
                              courseCount > 0 ? `${courseCount} courses` : ''}
                          </div>
                        </div>
                        {(hasGrandChildren || courseCount > 0) && (
                          <IoIosArrowForward className="text-gray-400 text-sm" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          } else {
            // Show courses for this level
            const courses = getCoursesForSubcategoryPath(hoveredCategory, pathToLevel.slice(1));
            if (courses.length > 0) {
              columns.push(
                <div
                  key={`courses-${level + 2}`}
                  className='w-96 bg-white flex flex-col'
                >
                  <h3 className='font-bold text-sm text-gray-800 p-4 border-b border-gray-200 bg-blue-50'>
                    {hoveredPath[level]} - Courses
                  </h3>
                  <div className='flex-1 bg-white '>
                    {courses.map((course) => (
                      <Link
                        key={course.id}
                        href={`/courses/${course.link}`}
                        className="block w-full text-left p-3 border-b border-gray-100 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                        onClick={onCourseClick}
                      >
                        <div className="font-medium text-sm line-clamp-2" dangerouslySetInnerHTML={{ __html: course.title }} />
                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <span>⭐ {course.rating}</span>
                          <span className='bg-gray-200 px-1.5 py-0.5 rounded text-[10px]'>{course.level}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            }
            break;
          }
          level++;
        }
      } else {
        // No subcategories, show all courses for this category
        columns.push(
          <div
            key="courses-direct"
            className='w-96  flex flex-col'
          >
            <h3 className='font-bold text-sm rounded-t-lg text-gray-800 p-4 border-b border-gray-200 bg-blue-50'>
              {hoveredCategory} - All Courses
            </h3>
            <div className='flex-1 bg-white overflow-y-auto  max-h-[460px] [&::-webkit-scrollbar]:hidden '>
              {hoveredCategoryCourses.length > 0 ? (
                hoveredCategoryCourses
                  .map((course) => (
                    <Link
                      key={course.id}
                      href={`/courses/${course.link}`}
                      className="block w-full text-left p-3 border-b hover:underline hover:decoration-red-600 underline-offset-4 border-gray-100  transition-colors"
                      onClick={onCourseClick}
                    >
                      <div className="font-medium text-sm line-clamp-2" dangerouslySetInnerHTML={{ __html: course.title }} />

                    </Link>
                  ))
              ) : (
                <div className='p-4 text-sm text-gray-500 text-center'>

                  <p className="text-xs mt-1">Add courses in admin panel</p>
                </div>
              )}
            </div>
          </div>
        );
      }
    }

    return columns;
  };

  return (
    <div
      ref={dropdownRef}
      className={`transition-all duration-300 ${
        anchorTo === 'button'
          ? 'top-full mt-2 left-0'
          : 'top-12 left-1/2 -translate-x-1/2'
      } absolute md:flex h-auto flex-col items-center md:overflow-hidden overflow-y-auto md:pb-0 pb-5 z-40 ${isActive ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
      style={{ width: calculateWidth() }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className='px-2 h-auto w-full flex py-4'>
        {renderColumns()}
      </div>
    </div>
  );
};

export default CoursesDropdown;