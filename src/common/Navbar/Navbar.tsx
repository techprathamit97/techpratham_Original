import React, { useContext, useEffect, useState, useRef, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import {
  BackpackIcon,
  Cross2Icon,
  DashboardIcon,
  HamburgerMenuIcon,
  HomeIcon,
  PersonIcon,
  CardStackIcon,
  EnvelopeClosedIcon,
  StarIcon,
  FileTextIcon,
  IdCardIcon,
  MagnifyingGlassIcon
} from '@radix-ui/react-icons';
import { IoIosArrowForward } from 'react-icons/io';
import Link from 'next/link';
import Image from 'next/image';
import { Search } from 'lucide-react';
import { UserContext } from '@/context/userContext';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { NavbarData, NavbarCategory, NavbarCourse } from '@/utils/navbarData';
import CoursesDropdown from './CoursesDropdown';
import { EBOOK_GROUPS } from './ebookLinks';


// Type definitions
interface Course {
  id: string;
  title: string;
  category: string;
  link: string;
  shortDesc: string;
  level: string;
  rating: number;
  duration: string;
}

interface CourseCategory {
  name: string;
  courses: Course[];
}

interface UserContextType {
  authenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  userData: any;
}

interface NavbarProps {
  navbarData?: NavbarData;
}

const Navbar: React.FC<NavbarProps> = ({ navbarData }) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [navOpen, setNavOpen] = useState<boolean>(false);
  const [searchActive, setSearchActive] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  /** Which e-book group is expanded in the mobile menu, if any. */
  const [openEbook, setOpenEbook] = useState<string | null>(null);

  // Handle case when UserContext is not available (e.g., in App Router pages)
  let authenticated = false;
  let isAdmin = false;
  let loading = false;
  let userData = null;

  try {
    const context = useContext(UserContext) as UserContextType | undefined;
    if (context) {
      ({ authenticated, isAdmin, loading, userData } = context);
    }
  } catch (e) {
    // UserContext not available, use defaults
  }

  // Data states - using same approach as CoursesHome
  const [coursesByCategory, setCoursesByCategory] = useState<NavbarCategory[]>([]);
  const [allCourses, setAllCourses] = useState<NavbarCourse[]>([]);
  const [categoriesData, setCategoriesData] = useState<any[]>([]); // Categories with subcategories
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  // Refs for click outside detection
  const coursesDropdownRef = useRef<HTMLDivElement>(null);
  const coursesButtonRef = useRef<HTMLButtonElement>(null);
  const searchDrawerRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLFormElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Hover handlers for dropdown - open on hover, close on mouse leave
  const handleButtonMouseEnter = () => {
    // Clear any pending close timeout
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setIsActive(true);
  };

  const handleButtonMouseLeave = () => {
    // Delay closing to allow mouse to reach dropdown
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsActive(false);
    }, 200);
  };

  const handleDropdownMouseEnter = () => {
    // Clear any pending close timeout when mouse enters dropdown
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setIsActive(true);
  };

  const handleDropdownMouseLeave = () => {
    // Close dropdown when mouse leaves the dropdown area
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsActive(false);
    }, 200);
  };

  // Click handler for toggle (works with hover)
  const handleCoursesClick = () => {
    // Clear any pending close timeout
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setIsActive(!isActive);
  };

  // Click outside handler to close dropdown AND search
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Handle courses dropdown click outside
      if (
        isActive &&
        coursesDropdownRef.current &&
        !coursesDropdownRef.current.contains(event.target as Node) &&
        coursesButtonRef.current &&
        !coursesButtonRef.current.contains(event.target as Node)
      ) {
        setIsActive(false);
      }

      // Handle search drawer click outside
      if (
        searchDrawerRef.current &&
        !searchDrawerRef.current.contains(event.target as Node) &&
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setSearchActive(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isActive]);

  // ✅ FETCH GROUPED API (courses) and categories with subcategories
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch courses grouped by category
        const coursesRes = await fetch("/api/course/fetch-grouped");
        const coursesData: NavbarCategory[] = await coursesRes.json();
        setCoursesByCategory(coursesData);

        // Extract all courses for search
        const allCoursesData: NavbarCourse[] = [];
        coursesData.forEach(category => {
          category.courses.forEach(course => {
            allCoursesData.push({
              ...course,
              category: category.name
            });
          });
        });
        setAllCourses(allCoursesData);

        // Fetch categories with subcategories
        const categoriesRes = await fetch("/api/category/fetch");
        const categoriesApiData = await categoriesRes.json();
        setCategoriesData(categoriesApiData);

       
      } catch (err) {
        console.error("Failed to fetch navbar data", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter courses based on search query
  const filteredCourses = useMemo(() => {
    if (!searchQuery.trim() || !allCourses) return [];

    const query = searchQuery.toLowerCase();
    return allCourses.filter(c =>
      c.title?.toLowerCase().includes(query) ||
      c.category?.toLowerCase().includes(query) ||
      c.shortDesc?.toLowerCase().includes(query) ||
      c.level?.toLowerCase().includes(query)
    );
  }, [allCourses, searchQuery]);

  // Group filtered courses by category for search results
  const searchResultsByCategory = useMemo(() => {
    if (filteredCourses.length === 0) return [];

    const categories = [...new Set(filteredCourses.map(c => c?.category).filter(Boolean))];

    return categories.map(category => ({
      name: category,
      courses: filteredCourses.filter(c => c?.category === category)
    }));
  }, [filteredCourses]);

  const handleCourseClick = (): void => {
    setIsActive(false);
    setSearchActive(false);
    setSearchQuery('');
  };


  const handleNavToggle = (): void => {
    setNavOpen(!navOpen);
    // Collapse any expanded e-book group so the menu reopens in a clean state.
    setOpenEbook(null);
  };

  const handleSearchFocus = (): void => {
    setSearchActive(true);
    // Close courses dropdown if open
    if (isActive) {
      setIsActive(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value);
    if (!searchActive) {
      setSearchActive(true);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    // You can add search submit logic here if needed
  };

  return (
    <div className={`${(isActive || searchActive) ? 'fixed top-0 left-0' : 'absolute'}  w-full bottom-0 flex flex-col items-center md:static sticky left-0 z-30 shadow-md justify-center`}>

      <div className='bg-gradient-to-tl from-[#C6151D] to-[#600A0E] text-white w-full h-auto flex items-center justify-center z-[50]'>
        <div className='w-full lg:py-1 md:py-1 py-1 md:flex hidden flex-row gap-4 lg:justify-center justify-between items-center font-light'>
          <Link href={'/'} aria-label='Techpratham'>
            <div className="relative w-36 ">
              <Image
                src={'/navbar/logotechnolyfirst2.svg'}
                alt='Techpratham Logo'
                width={80}
                height={30}
                className='w-full h-auto'
              />

              <span className="absolute bottom-2 pl-1 left-1/2 -translate-x-1/2 text-[7px] text-white">
                Technology First
              </span>
            </div>
          </Link>


          <div className='flex flex-row gap-1 items-center justify-center'>
            <form onSubmit={handleSearchSubmit} className='flex flex-row lg:w-60 md:w-72' ref={searchContainerRef}>
              <Input
                ref={searchInputRef}
                className='lg:max-w-60 max-w-72 h-7 bg-white text-black rounded-r-none rounded-l-md'
                placeholder='Search courses...'
                aria-label='Search courses'
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={handleSearchFocus}
              />
              <button
                type="submit"
                className='p-1 bg-yellow-600 flex items-center justify-center rounded-r-md hover:bg-red-800 transition-colors'
                aria-label='Search'
              >
                <Search className='w-4 h-4' />
              </button>
            </form>


          </div>
          <Link href="/" className={`cursor-pointer text-[15px] transition-colors flex items-center gap-1 ${pathname === '/' ? 'text-yellow-600 font-semibold' : 'text-white hover:text-yellow-600'}`}>
            <HomeIcon className="w-4 h-4" />
            <span>Home</span>
          </Link>
          <button
            ref={coursesButtonRef}
            onClick={handleCoursesClick}
            onMouseEnter={handleButtonMouseEnter}
            onMouseLeave={handleButtonMouseLeave}
            className="hidden sm:flex flex-row text-white gap-1 items-center justify-center cursor-pointer text-[15px] hover:opacity-80 transition-opacity"
            aria-label="All Courses"
          >
            <DashboardIcon className="w-4 h-4" />
            <span className='text-sm'>All Courses</span>
          </button>
          <button className='lg:hidden flex' onClick={handleNavToggle} aria-label='Toggle navigation menu'>
            <HamburgerMenuIcon className='w-5 h-5' />
          </button>

          <Link href="/about-us" className={`cursor-pointer text-[15px] transition-colors flex items-center gap-1 ${pathname === '/about-us' ? 'text-yellow-600 font-semibold' : 'text-white hover:text-yellow-600'}`}>
            <PersonIcon className="w-4 h-4" />
            <span>About Us</span>
          </Link>
          <Link href="/payment" className={`cursor-pointer text-[15px] transition-colors flex items-center gap-1 ${pathname === '/payment' ? 'text-yellow-600 font-semibold' : 'text-white hover:text-yellow-600'}`}>
            <CardStackIcon className="w-4 h-4" />
            <span>Payment</span>
          </Link>
          <Link href="/contact-us" className={`cursor-pointer text-[15px] transition-colors flex items-center gap-1 ${pathname === '/contact-us' ? 'text-yellow-600 font-semibold' : 'text-white hover:text-yellow-600'}`}>
            <EnvelopeClosedIcon className="w-4 h-4" />
            <span>Contact Us</span>
          </Link>

          <Link href='/corporate-training' className='lg:flex hidden flex-row gap-2 items-center text-[15px] justify-center cursor-pointer hover:opacity-80 transition-opacity'>
            <BackpackIcon className='w-4 h-4' />
            <span>Corporate Training</span>
          </Link>
          <Link href='/blog' className='lg:flex hidden flex-row gap-2 items-center text-[15px] justify-center cursor-pointer hover:opacity-80 transition-opacity'>
            <FileTextIcon className='w-4 h-4' />
            <span>Blog</span>
          </Link>

          {/* Conditional User Authentication */}
          {loading ? (
            <div className="text-sm text-gray-300">Loading...</div>
          ) : authenticated ? (
            /* Direct Dashboard Link - Only when authenticated */
            <Link
              href={isAdmin ? '/admin/dashboard' : '/user/dashboard'}
              className="ml-4 cursor-pointer text-sm bg-yellow-600 text-white hover:bg-yellow-700 transition-colors flex items-center justify-center rounded-full w-8 h-8 font-semibold"
              title={`Go to ${isAdmin ? 'Admin' : 'User'} Dashboard`}
            >
              {userData?.name ? userData.name.charAt(0).toUpperCase() : userData?.email?.charAt(0).toUpperCase() || 'U'}
            </Link>
          ) : (
            /* Login Button - Only when not authenticated */
            <Link
              href='/auth/login'
              className="cursor-pointer text-sm hover:text-yellow-600 transition-colors flex items-center justify-center hover:bg-white/10 rounded-full"
            >
              {/* <PersonIcon className="w-4 h-4 mr-1" /> */}
              <span>Login</span>
            </Link>
          )}

        </div>

        <div className='w-11/12 md:hidden flex flex-col gap-1 items-center  justify-between sticky pb-3  '>
          <div className='w-full h-full flex flex-row items-center gap-4 justify-between '>
            <Link href={'/'} aria-label='Techpratham'>
              <div className="relative w-32">
                <Image
                  src={'/navbar/logotechnolyfirst2.svg'}
                  alt='Techpratham Logo'
                  width={128}
                  height={48}
                  className='w-full h-auto'
                />
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[6px] text-white whitespace-nowrap">
                  Technology First
                </span>
              </div>
            </Link>
            <form onSubmit={handleSearchSubmit} className='flex flex-row md:w-full w-22' ref={searchContainerRef}>
              <Input
                ref={searchInputRef}
                className='w-full h-9 bg-white text-black rounded-r-none rounded-l-md text-sm font-light placeholder:font-light placeholder:text-sm'
                placeholder='Search courses...'
                aria-label='Search courses'
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={handleSearchFocus}
              />
              <button
                type="submit"
                className='p-2 bg-yellow-600 flex items-center justify-center rounded-r-md hover:bg-red-800 transition-colors'
                aria-label='Search'
              >
                <Search className='w-4 h-4' />
              </button>
            </form>
            <button onClick={handleNavToggle} aria-label='Toggle navigation menu'>
              {!navOpen ? (
                <HamburgerMenuIcon className='w-5 h-5' />
              ) : (
                <Cross2Icon className='w-5 h-5' />
              )}
            </button>
          </div>

        </div>
      </div>

      {/*
        lg:hidden matches the hamburger button above, which is also lg:hidden.
        While this was md:hidden, tapping the hamburger between md and lg opened
        nothing. max-h-[85vh] with scrolling replaces max-h-96, which clipped the
        list once the e-book section was added.
      */}
      <div className={`
        w-full h-auto  lg:hidden flex items-start justify-center bg-white border-b border-b-gray-100 z-20
        transition-all duration-300 ease-in-out transform origin-top
        ${navOpen
          ? 'max-h-[85vh] overflow-y-auto opacity-100 translate-y-0 scale-y-100'
          : 'max-h-0 opacity-0 -translate-y-4 scale-y-0 overflow-hidden'
        }
      `}>
        <nav className={`
          lg:w-10/12 w-11/12 py-1 text-xs grid grid-cols-2 gap-2 transition-all duration-300 delay-100
          ${navOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}
        `}>
          <Link href='/' onClick={handleNavToggle} className="w-full">
            <Button variant="outline" className="w-full hover:bg-red-50 hover:text-red-700 hover:border-red-200 transform hover:scale-105 flex items-center gap-2">
              <HomeIcon className="w-4 h-4" />
              Home
            </Button>
          </Link>
          <Link href='/courses' onClick={handleNavToggle} className="w-full">
            <Button variant="outline" className="w-full hover:bg-red-50 hover:text-red-700 hover:border-red-200 transform hover:scale-105 flex items-center gap-2">
              <DashboardIcon className="w-4 h-4" />
              Courses
            </Button>
          </Link>
          <Link href='/about-us' onClick={handleNavToggle} className="w-full">
            <Button variant="outline" className="w-full hover:bg-red-50 hover:text-red-700 hover:border-red-200 transform hover:scale-105 flex items-center gap-2">
              <PersonIcon className="w-4 h-4" />
              About Us
            </Button>
          </Link>

          <Link href='/training-certificate' onClick={handleNavToggle} className="w-full">
            <Button variant="outline" className="w-full hover:bg-red-50 hover:text-red-700 hover:border-red-200 transform hover:scale-105 flex items-center gap-2">
              <IdCardIcon className="w-4 h-4" />
              Training Certificate
            </Button>
          </Link>

          <Link href='/job-openings' onClick={handleNavToggle} className="w-full">
            <Button variant="outline" className="w-full hover:bg-red-50 hover:text-red-700 hover:border-red-200 transform hover:scale-105 flex items-center gap-2">
              <MagnifyingGlassIcon className="w-4 h-4" />
              Job Openings
            </Button>
          </Link>

          <Link href='/blog' onClick={handleNavToggle} className="w-full">
            <Button variant="outline" className="w-full hover:bg-red-50 hover:text-red-700 hover:border-red-200 transform hover:scale-105 flex items-center gap-2">
              <FileTextIcon className="w-4 h-4" />
              Blogs
            </Button>
          </Link>

          <Link href='/payment' onClick={handleNavToggle} className="w-full">
            <Button variant="outline" className="w-full hover:bg-red-50 hover:text-red-700 hover:border-red-200 transform hover:scale-105 flex items-center gap-2">
              <CardStackIcon className="w-4 h-4" />
              Payment
            </Button>
          </Link>

          <Link href='/contact-us' onClick={handleNavToggle} className="w-full">
            <Button variant="outline" className="w-full hover:bg-red-50 hover:text-red-700 hover:border-red-200 transform hover:scale-105 flex items-center gap-2">
              <EnvelopeClosedIcon className="w-4 h-4" />
              Contact Us
            </Button>
          </Link>



          {loading ? (
            <Button variant="outline" className="w-full" disabled>
              Loading...
            </Button>
          ) : authenticated ? (
            isAdmin ? (
              <Link href='/admin/dashboard' onClick={handleNavToggle} className="w-full">
                <Button variant="outline" className="w-full hover:bg-red-50 hover:text-red-700 hover:border-red-200 transform hover:scale-105">
                  Admin Dashboard
                </Button>
              </Link>
            ) : (
              <Link href='/user/dashboard' onClick={handleNavToggle} className="w-full">
                <Button variant="outline" className="w-full hover:bg-red-50 hover:text-red-700 hover:border-red-200 transform hover:scale-105">
                  Dashboard
                </Button>
              </Link>
            )
          ) : (
            <Link href='/auth/login' onClick={handleNavToggle} className="w-full">
              <Button variant="outline" className="w-full hover:bg-red-50 hover:text-red-700 hover:border-red-200 transform hover:scale-105">
                Login
              </Button>
            </Link>
          )}

          {authenticated && (
            <Button
              variant="outline"
              onClick={() => signOut()}
              className="w-full hover:bg-red-50 hover:text-red-700 hover:border-red-200 transform hover:scale-105"
            >
              Sign Out
            </Button>
          )}

          {/*
            E-Books accordion, kept last so the primary links stay reachable
            without scrolling. Mirrors the desktop Navbard strip, which is hidden
            below md, using the same EBOOK_GROUPS source.
          */}
          <div className="col-span-2 w-full flex flex-col gap-1 border-t border-gray-100 pt-2 mt-1">
            <span className="flex items-center gap-2 px-1 pb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
              <StarIcon className="w-3.5 h-3.5" />
              E-Books
            </span>

            {EBOOK_GROUPS.map((group) => {
              const isOpen = openEbook === group.label;

              return (
                <div key={group.label} className="w-full">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenEbook(isOpen ? null : group.label)}
                    className={`w-full flex items-center justify-between gap-2 rounded-md border px-3 py-2 text-left transition-colors ${
                      isOpen
                        ? 'border-red-200 bg-red-50 text-red-700'
                        : 'border-gray-200 bg-white text-gray-700 hover:bg-red-50 hover:text-red-700 hover:border-red-200'
                    }`}
                  >
                    <span>{group.shortLabel} e-Book</span>
                    <IoIosArrowForward
                      className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-90' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="mt-1 mb-1 flex flex-col gap-0.5 rounded-md bg-gray-50 py-1 pl-3">
                      {group.links.map((link) => (
                        <Link
                          key={`${group.label}-${link.href}-${link.label}`}
                          href={link.href}
                          onClick={handleNavToggle}
                          className="rounded px-2 py-1.5 text-[11px] text-gray-700 hover:bg-white hover:text-red-700"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Courses Dropdown Component */}
      <CoursesDropdown
        isActive={isActive}
        coursesByCategory={coursesByCategory}
        allCourses={allCourses}
        categoriesData={categoriesData}
        isLoading={isLoading}
        onCourseClick={handleCourseClick}
        dropdownRef={coursesDropdownRef}
        onMouseEnter={handleDropdownMouseEnter}
        onMouseLeave={handleDropdownMouseLeave}
      />

      {/* Search Drawer */}
      <div
        ref={searchDrawerRef}
        className={`transition-all duration-300 border-b border-b-gray-200 ${!searchActive ? '-top-80 left-0' : 'top-28 left-0'} absolute flex w-full h-auto bg-black/70 text-[#1a1a1a] flex-col items-center md:overflow-hidden overflow-y-auto pb-4 z-40`}
      >
        {/* <div className="absolute inset-0 bg-black/50 z-50 pointer-events-none"></div> */}

        <div className='md:w-10/12 w-11/12 h-auto md:py-8 py-4 max-h-96 overflow-y-auto hide-scrollbar'>

          {/* Search Results Header */}
          <div className='md:mb-6 mb-4'>
            <h3 className='font-semibold text-lg text-white'>
              {searchQuery ? `Search Results for "${searchQuery}"` : 'Start typing to search courses...'}
            </h3>
            {searchQuery && (
              <p className='text-sm text-white mt-1'>
                Found {filteredCourses.length} course.{filteredCourses.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          {/* Search Results Content */}
          {!searchQuery ? (
            <div className='flex items-center justify-center h-32'>
              <span className='text-gray-500'>Type in the search box to find courses</span>
            </div>
          ) : isLoading ? (
            <div className='flex items-center justify-center h-32'>
              <span className='text-gray-500'>Searching courses...</span>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className='flex items-center justify-center h-32'>
              <span className='text-gray-500'>No courses found matching your search</span>
            </div>
          ) : (
              <div className='space-y-6'>
              {searchResultsByCategory.map((category) => (
                <div key={category.name}>
                  <h4 className='font-medium text-md text-white mb-3 pb-1 border-b border-gray-200'>
                    {category.name} ({category.courses.length})
                  </h4>
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
                    {category.courses.map((course) => (
                      <Link
                        key={`search-${course.id}-${course.link}`}
                        href={`/courses/${course.link}`}
                        onClick={handleCourseClick}
                        className='block p-3 bg-gradient-to-tl from-[#C6151D] to-[#600A0E] rounded-lg border border-gray-200 hover:border-red-300 hover:shadow-sm transition-all duration-200 group'
                      >
                        <div className='flex flex-col gap-2'>
                          <div className='flex items-start justify-between'>
                            <h5 className='font-medium text-sm text-white group-hover:text-green-300 transition-colors'>
                              <span dangerouslySetInnerHTML={{ __html: course.title }} />
                            </h5>
                            <span className='text-xs bg-yellow-600 text-balck px-2 py-1 rounded-full whitespace-nowrap ml-2'>
                              {course.level}
                            </span>
                          </div>
                          <div
                            className="text-xs text-white group-hover:text-green-300 line-clamp-2"
                            dangerouslySetInnerHTML={{ __html: course.shortDesc }}
                          />
                          <div className='flex items-center gap-4 text-xs text-white'>
                            <span className='flex items-center gap-1'>
                              ⭐ {course.rating}
                            </span>
                            <span>📅 {course.duration}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;