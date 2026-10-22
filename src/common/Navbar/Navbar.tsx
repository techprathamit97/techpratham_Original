import React, { useContext, useEffect, useState, useRef, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import {
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
import { IoIosArrowForward, IoIosArrowDown } from 'react-icons/io';
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
  const searchMobileFormRef = useRef<HTMLFormElement>(null);
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

      // Handle search drawer click outside — dismiss only when the click is
      // outside the drawer AND both the desktop and mobile search forms.
      const inDrawer =
        !!searchDrawerRef.current && searchDrawerRef.current.contains(event.target as Node);
      const inDesktopForm =
        !!searchContainerRef.current && searchContainerRef.current.contains(event.target as Node);
      const inMobileForm =
        !!searchMobileFormRef.current && searchMobileFormRef.current.contains(event.target as Node);
      if (!inDrawer && !inDesktopForm && !inMobileForm) {
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

  // Shared style for the white navbar's text links (dark text, red active/hover).
  const navLinkCls = (href: string): string =>
    `flex items-center gap-1 whitespace-nowrap text-[15px] transition-colors ${
      pathname === href ? 'text-[#C6151D] font-bold' : 'text-black  hover:text-[#C6151D]'
    }`;

  return (
    <div className={`sticky top-0 left-0 w-full flex flex-col items-center z-50 shadow-md justify-center`}>

      <div className='w-full bg-white/95 backdrop-blur-md shadow-[0_2px_10px_rgba(0,0,0,0.06)] z-[50]'>
        <div className='mx-auto w-full max-w-[1250px] px-3 md:px-10 py-2'>

          {/* ===== Desktop / tablet top bar (md+) ===== */}
          <div className='hidden md:flex w-full items-center justify-between gap-4'>
            {/* Logo */}
            <Link href={'/'} aria-label='Techpratham' className='shrink-0'>
              <div className='relative h-9 w-28 md:w-32'>
                <Image
                  src={'/navbar/techpratham.png'}
                  alt='TechPratham'
                  fill
                  sizes='(max-width: 768px) 112px, 128px'
                  className='object-contain object-left'
                  priority
                />
              </div>
            </Link>

            {/* Center inline nav (lg+) */}
            <nav className='hidden lg:flex flex-1 items-center justify-center gap-6 xl:gap-8'>
              <Link href='/' className={navLinkCls('/')}>Home</Link>

              {/* All Courses trigger + dropdown anchored to the button */}
              <div className='relative'>
                <button
                  ref={coursesButtonRef}
                  onClick={handleCoursesClick}
                  onMouseEnter={handleButtonMouseEnter}
                  onMouseLeave={handleButtonMouseLeave}
                  className={`flex items-center gap-1 whitespace-nowrap text-[15px]  transition-colors ${
                    isActive ? 'text-[#C6151D]' : 'text-black hover:text-[#C6151D]'
                  }`}
                  aria-haspopup='true'
                  aria-expanded={isActive}
                  aria-label='All Courses'
                >
                  <span>All Courses</span>
                  <IoIosArrowDown className={`w-3.5 h-3.5 transition-transform ${isActive ? 'rotate-180' : ''}`} />
                </button>

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
                  anchorTo='button'
                />
              </div>

              <Link href='/about-us' className={navLinkCls('/about-us')}>About Us</Link>
              <Link href='/corporate-training' className={navLinkCls('/corporate-training')}>Corporate Training</Link>
              <Link href='/blog' className={navLinkCls('/blog')}>Blog</Link>
              <Link href='/payment' className={navLinkCls('/payment')}>Payment</Link>
              <Link href='/contact-us' className={navLinkCls('/contact-us')}>Contact Us</Link>
            </nav>

            {/* Right cluster: search + auth (lg+) / hamburger (tablet) */}
            <div className='flex items-center gap-3 shrink-0'>
              {/* Compact search (lg+) — feature kept */}
              <form onSubmit={handleSearchSubmit} ref={searchContainerRef} className='hidden lg:flex items-center w-52'>
                <div className='relative flex w-full items-center rounded-full border border-gray-300 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-red-100 transition'>
                  <Input
                    ref={searchInputRef}
                    className='flex-1 h-8 border-0 bg-transparent pl-3 pr-2 text-sm text-gray-800 shadow-none focus-visible:ring-0'
                    placeholder='Search courses...'
                    aria-label='Search courses'
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={handleSearchFocus}
                  />
                  <button
                    type='submit'
                    className='flex h-8 w-9 shrink-0 items-center justify-center bg-[#ff2a3b] text-white transition hover:brightness-110'
                    aria-label='Search'
                  >
                    <Search className='w-4 h-4' />
                  </button>
                </div>
              </form>

              {/* Auth: Sign Up pill / avatar (lg+) */}
              <div className='hidden lg:flex items-center'>
                {loading ? (
                  <span className='text-xs text-gray-500 px-3'>Loading...</span>
                ) : authenticated ? (
                  <Link
                    href={isAdmin ? '/admin/dashboard' : '/user/dashboard'}
                    title={`Go to ${isAdmin ? 'Admin' : 'User'} Dashboard`}
                    className='flex h-9 w-9 items-center justify-center rounded-full bg-[#C6151D] text-white font-bold text-sm shadow-sm hover:brightness-110 transition'
                  >
                    {userData?.name ? userData.name.charAt(0).toUpperCase() : userData?.email?.charAt(0).toUpperCase() || 'U'}
                  </Link>
                ) : (
                  <Link
                    href='/auth/login'
                    className='rounded-full bg-[#ff2a3b] text-white text-[12px] font-bold tracking-wider uppercase px-5 py-2 shadow-sm hover:brightness-110 transition'
                  >
                    Sign Up
                  </Link>
                )}
              </div>

              {/* Tablet hamburger (md to lg) */}
              <button
                className='lg:hidden flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700'
                onClick={handleNavToggle}
                aria-label='Toggle navigation menu'
                aria-expanded={navOpen}
              >
                {navOpen ? <Cross2Icon className='w-5 h-5' /> : <HamburgerMenuIcon className='w-5 h-5' />}
              </button>
            </div>
          </div>

          {/* ===== Mobile top bar (below md) ===== */}
          <div className='md:hidden flex w-full items-center justify-between gap-3'>
            <Link href={'/'} aria-label='Techpratham' className='shrink-0'>
              <div className='relative h-9 w-28'>
                <Image
                  src={'/navbar/techpratham.png'}
                  alt='TechPratham'
                  fill
                  sizes='112px'
                  className='object-contain object-left'
                  priority
                />
              </div>
            </Link>

            <form onSubmit={handleSearchSubmit} ref={searchMobileFormRef} className='flex flex-1 max-w-[190px]'>
              <Input
                ref={searchInputRef}
                className='w-full h-9 bg-white text-black rounded-r-none rounded-l-md text-sm border-gray-300'
                placeholder='Search...'
                aria-label='Search courses'
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={handleSearchFocus}
              />
              <button
                type='submit'
                className='px-3 bg-[#ff2a3b] flex items-center justify-center rounded-r-md text-white hover:brightness-110 transition'
                aria-label='Search'
              >
                <Search className='w-4 h-4' />
              </button>
            </form>

            <button
              onClick={handleNavToggle}
              aria-label='Toggle navigation menu'
              className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700'
            >
              {!navOpen ? <HamburgerMenuIcon className='w-5 h-5' /> : <Cross2Icon className='w-5 h-5' />}
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

      {/* Courses dropdown is rendered inline under the "All Courses" button (desktop). */}

      {/* Search Drawer */}
      <div
        ref={searchDrawerRef}
        className={`transition-all duration-300 border-b border-b-gray-200 rounded-b-lg shadow-lg ${!searchActive ? '-top-80 right-0 md:right-10' : 'top-16 right-0 md:right-10'} absolute flex w-full md:w-[55%] h-auto bg-white text-[#1a1a1a] flex-col items-start md:overflow-hidden overflow-y-auto pb-4 z-40`}
      >
        {/* <div className="absolute inset-0 bg-black/50 z-50 pointer-events-none"></div> */}

        <div className='p-2 h-auto md:py-3 py-2 max-h-96 overflow-y-auto hide-scrollbar'>

          {/* Search Results Header */}
          <div className='md:mb-6 mb-4'>
            <h3 className='font-semibold text-lg text-black'>
              {searchQuery ? `Search Results for "${searchQuery}"` : 'Start typing to search courses...'}
            </h3>
            {searchQuery && (
              <p className='text-sm text-black mt-1'>
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
                  <h4 className='font-medium text-md text-black mb-3 pb-1 border-b border-gray-200'>
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