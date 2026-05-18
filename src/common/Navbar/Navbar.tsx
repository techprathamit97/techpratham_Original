import React, { useContext, useEffect, useState, useRef } from 'react';
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
import Link from 'next/link';
import Image from 'next/image';
import { Search } from 'lucide-react';
import { UserContext } from '@/context/userContext';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { NavbarData, NavbarCategory } from '@/utils/navbarData';


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
}

interface NavbarProps {
  navbarData?: NavbarData;
}

const Navbar: React.FC<NavbarProps> = ({ navbarData }) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [navOpen, setNavOpen] = useState<boolean>(false);
  const [searchActive, setSearchActive] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { authenticated, isAdmin, loading } = useContext(UserContext) as UserContextType;
  
  // Initialize with server-side data or empty arrays
  const [categories] = useState<NavbarCategory[]>(navbarData?.categories || []);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [allCourses] = useState<Course[]>(navbarData?.allCourses || []);
  const [isLoading] = useState<boolean>(false);
  const pathname = usePathname();
  // const [hasFetched, setHasFetched] = useState<boolean>(false);
  // Refs for click outside detection
  const coursesDropdownRef = useRef<HTMLDivElement>(null);
  const coursesButtonRef = useRef<HTMLButtonElement>(null);
  const searchDrawerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLFormElement>(null);

  // Initialize selected category when categories are available
  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0].name);
    }
  }, [categories, selectedCategory]);

  // Fallback: fetch data client-side if not provided via props
 
  // Get courses for the selected category from server-side data
  const selectedCategoryCourses = React.useMemo(() => {
    const category = categories.find(cat => cat.name === selectedCategory);
    return category?.courses || [];
  }, [categories, selectedCategory]);


  // Remove the filteredCategories memo since categories already come filtered from server
  // const filteredCategories = React.useMemo(() => {
  //   return categories.filter(
  //     (cat) => cat.name !== "Trending Courses"
  //   );
  // }, [categories]);


  // Remove the useEffect that fetches courses by category since we have server-side data
  // useEffect(() => {
  //   if (filteredCategories.length) {
  //     const first = filteredCategories[0].name;
  //     setSelectedCategory(first);
  //     fetchCoursesByCategory(first);
  //   }
  // }, [filteredCategories]);

  // Remove the useEffect that fetches all courses since we have server-side data
  // useEffect(() => {
  //   // Only fetch all courses if not provided via props
  //   if (navbarData?.allCourses && navbarData.allCourses.length > 0) {
  //     return; // Use server-side data
  //   }

  //   const fetchAllCourses = async () => {
  //     try {
  //       const res = await fetch(`/api/course/fetch`);

  //       if (!res.ok) throw new Error("Failed");

  //       const data: Course[] = await res.json();

  //       setAllCourses(data);

  //     } catch (err) {
  //       console.error("Global course fetch failed", err);
  //     }
  //   };

  //   fetchAllCourses();
  // }, [navbarData]);


  // useEffect(() => {
  //   const fetchCourseData = async (): Promise<void> => {
  //     setIsLoading(true);
  //     try {
  //       const res = await fetch(`/api/course/fetch`);
  //       if (!res.ok) throw new Error(`API request failed with status ${res.status}`);

  //       const data: Course[] = await res.json();
  //       setCourse(data);

  //     } catch (error: any) {
  //       console.error("Failed to fetch course data:", error);
  //       toast.error("Failed to fetch course data. Please try again.");
  //       setCourse([]);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchCourseData();
  // }, []);

  useEffect(() => {
    if (isActive || searchActive) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isActive, searchActive]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      const target = event.target as Node;

      if (
        coursesDropdownRef.current &&
        coursesButtonRef.current &&
        !coursesDropdownRef.current.contains(target) &&
        !coursesButtonRef.current.contains(target)
      ) {
        setIsActive(false);
      }
    };

    if (isActive) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isActive]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      const target = event.target as Node;

      if (
        searchDrawerRef.current &&
        searchContainerRef.current &&
        !searchDrawerRef.current.contains(target) &&
        !searchContainerRef.current.contains(target)
      ) {
        setSearchActive(false);
        setSearchQuery('');
      }
    };

    // Add event listener when search drawer is active
    if (searchActive) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchActive]);

  // Filter courses based on search query
  const filteredCourses = React.useMemo((): Course[] => {
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
  const searchResultsByCategory = React.useMemo((): CourseCategory[] => {
    if (filteredCourses.length === 0) return [];

    const categories = [...new Set(filteredCourses.map(c => c?.category).filter(Boolean))];

    return categories.map(category => ({
      name: category,
      courses: filteredCourses.filter(c => c?.category === category)
    }));
  }, [filteredCourses]);

  // Remove the old coursesByCategory memo since we're using selectedCategoryCourses
  // const coursesByCategory = React.useMemo(() => {
  //   return filteredCategories.map((category) => ({
  //     name: category.name,
  //     courses:
  //       selectedCategory === category.name
  //         ? course
  //         : [],
  //   }));
  // }, [filteredCategories, course, selectedCategory]);



  // Simplified category selection - no need to fetch since we have all data
  const handleCategorySelect = (name: string) => {
    setSelectedCategory(name);
  };


  const handleNavToggle = (): void => {
    setNavOpen(!navOpen);
  };

  const handleCoursesToggle = (): void => {
    setIsActive(!isActive);
    // Close search drawer if open
    if (searchActive) {
      setSearchActive(false);
      setSearchQuery('');
    }
  };

  const handleCourseClick = (): void => {
    setIsActive(false);
    setSearchActive(false);
    setSearchQuery('');
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
            <button
              ref={coursesButtonRef}
              onClick={handleCoursesToggle}
              onMouseEnter={handleCoursesToggle}
              className="hidden sm:flex flex-row text-white gap-1 items-center justify-center cursor-pointer text-xs hover:opacity-80 transition-opacity"
              aria-label="Toggle courses menu"
            >
              <DashboardIcon className="w-4 h-4" />
              <span className='text-sm'>All Courses</span>
            </button>
            <button className='lg:hidden flex' onClick={handleNavToggle} aria-label='Toggle navigation menu'>
              <HamburgerMenuIcon className='w-5 h-5' />
            </button>
          </div>


          <Link href="/" className={`cursor-pointer text-sm transition-colors flex items-center gap-1 ${pathname === '/' ? 'text-yellow-600 font-semibold' : 'text-white hover:text-yellow-600'}`}>
            <HomeIcon className="w-4 h-4" />
            <span>Home</span>
          </Link>
          <Link href="/about-us" className={`cursor-pointer text-sm transition-colors flex items-center gap-1 ${pathname === '/about-us' ? 'text-yellow-600 font-semibold' : 'text-white hover:text-yellow-600'}`}>
            <PersonIcon className="w-4 h-4" />
            <span>About Us</span>
          </Link>
          <Link href="/payment" className={`cursor-pointer text-sm transition-colors flex items-center gap-1 ${pathname === '/payment' ? 'text-yellow-600 font-semibold' : 'text-white hover:text-yellow-600'}`}>
            <CardStackIcon className="w-4 h-4" />
            <span>Payment</span>
          </Link>
          <Link href="/contact-us" className={`cursor-pointer text-sm transition-colors flex items-center gap-1 ${pathname === '/contact-us' ? 'text-yellow-600 font-semibold' : 'text-white hover:text-yellow-600'}`}>
            <EnvelopeClosedIcon className="w-4 h-4" />
            <span>Contact Us</span>
          </Link>

          <Link href='/corporate-training' className='lg:flex hidden flex-row gap-2 items-center text-sm justify-center cursor-pointer hover:opacity-80 transition-opacity'>
            <BackpackIcon className='w-4 h-4' />
            <span>Corporate Training</span>
          </Link>
          {/* <Link href="/contact-us" className={`cursor-pointer transition-colors ${pathname === '/contact-us' ? 'text-red-700 font-semibold' : 'text-gray-800 hover:text-red-700'}`}>Contact Us</Link> */}

          {loading ? (
            <span className='cursor-pointer opacity-50'>Loading...</span>
          ) : authenticated ? (
            isAdmin ? (
              <Link href='/admin/dashboard' className='cursor-pointer text-sm hover:text-red-700 transition-colors'>Admin Dashboard</Link>
            ) : (
              <Link href='/user/dashboard' className='cursor-pointer text-sm hover:text-red-700 transition-colors'>Dashboard</Link>
            )
          ) : (
            <Link href='/auth/login' className='bg-yellow-600 px-4  py-1 text-sm rounded-2xl cursor-pointer hover:text-black transition-colors'>Login</Link>
          )}
          {authenticated && (
            <div onClick={() => signOut()} className='cursor-pointer hover:text-red-700'>Sign Out</div>
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

      <div className="w-full bg-yellow-600  h-auto py-1 lg:flex items-center justify-center  border-b border-b-gray-100 z-50">
        <nav className="menu w-full md:pl-3  text-xs  font-extrabold flex flex-row flex-wrap gap-2 items-center justify-start">

          <div className="flex flex-col items-center  sm:flex-row gap-3">

            <Link
              href="/courses/servicenow-training-in-india"
              className="cursor-pointer hidden sm:flex  bg-gradient-to-tl from-[#C6151D] to-[#600A0E] px-2 py-2 rounded-lg text-gray-300 font-extrabold "
            >
              ServiceNow Training
            </Link>

            <Link
              href="/e-book/workday"
              className="cursor-pointer text-gray-300 hidden sm:flex bg-gradient-to-tl from-[#C6151D] to-[#600A0E] px-2 py-2 rounded-lg   text-xs font-extrabold "
            >
              Workday e-Book
            </Link>


          </div>

          {/* 🔹 Scrolling Section */}
          <div className="overflow-x-scroll flex-1 relative md:ml-4 no-scrollbar z-50">
            <div className="whitespace-nowrap animate-scroll flex flex-row gap-2">
              {[
                { href: "/e-book/workday/Organizations-and-Organizations-Types", text: "Organization in Workday" },
                { href: "/e-book/workday/Foundations-Of-Staffing-Model", text: "Staffing in Workday" },
                { href: "/e-book/workday/Job-Profiles", text: "Job Profile in Workday" },
                { href: "/e-book/workday/Core-Compensation", text: " Core Compensation in Workday" },
                { href: "/e-book/workday/Security", text: "Security in Workday" },
                { href: "/e-book/workday/Business-Processes", text: "Business Process in Workday" },  
                { href: "/e-book/workday/Reporting", text: "Reporting in Workday" },
                { href: "/content/workday-hcm-training", text: "Recruitment in Workday" },
                { href: "/e-book/workday/workday-absence-management-time-off", text: "Absence management & Time Off in Workday" },
                { href: "/e-book/workday/workday-talent-and-performance-management", text: "Performance Management in Workday" },
                { href: "/content/workday-hcm-training", text: "Advanced Compensation" },
                { href: "/e-book/workday/EIB", text: "EIB in Workday" },
              ].map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="px-2 py-1 border-2 border-red-800 rounded-lg text-black font-medium 
                       hover:bg-red-700 hover:text-white  transition-all duration-300 inline-block"
                >
                  {item.text}
                </Link>
              ))}
            </div>

          </div>
        </nav>
      </div>



      <div className={`
        w-full h-auto  md:hidden flex items-center justify-center bg-white border-b border-b-gray-100 z-20
        transition-all duration-300 ease-in-out transform origin-top
        ${navOpen
          ? 'max-h-96 opacity-100 translate-y-0 scale-y-100'
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

          <Link href='/e-book/workday' onClick={handleNavToggle} className="w-full">
            <Button variant="outline" className="w-full hover:bg-red-50 hover:text-red-700 hover:border-red-200 transform hover:scale-105 flex items-center gap-2">
              <StarIcon className="w-4 h-4" />
              Workday e-Book
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
        </nav>
      </div>

      {/* Courses Dropdown */}
      <div
        ref={coursesDropdownRef}
        className={`transition-all duration-300 border-2 border-red-600 ${!isActive ? '-top-80 ' : 'top-24 '} absolute left-1/2 -translate-x-1/2 md:flex hidden w-full h-auto bg-black/40 text-[#1a1a1a] flex-col items-center  md:overflow-hidden overflow-y-auto md:pb-0 pb-5 z-40`}
      >
        <div className='px-4 h-auto w-full bg-white grid grid-cols-1 md:grid-cols-3 gap-4 py-4'>

          <div className='col-span-1  p-2 flex h-80 flex-col gap-2 overflow-auto'>
            <h3 className='font-semibold text-lg text-gray-800'>Course Categories</h3>
            {categories.length === 0 ? (
              <span>No categories available</span>
            ) : (
              categories.map((category) => (
                <button
                  key={category.name}
                  data-testid="category-button"
                  className={`text-left bg-gray-50 px-3 py-1 rounded ${selectedCategory === category.name
                    ? "bg-red-700 text-white font-semibold"
                    : "hover:bg-gray-100 text-gray-700"
                    }`}
                  onClick={() =>
                    handleCategorySelect(category.name)
                  }
                  onMouseEnter={() =>
                    handleCategorySelect(category.name)
                  }
                >
                  {category.name}

                  {selectedCategory === category.name && (
                    <span className="ml-2 text-xs opacity-75">
                      ({selectedCategoryCourses.length})
                    </span>
                  )}
                </button>
              ))

            )}

          </div>

          <div className='col-span-1 md:col-span-2 p-4 flex flex-col bg-gray-100 rounded gap-2 border border-gray-200 max-h-80 overflow-y-auto'>
            <div className='bg-[#B91C1C] rounded-lg text-center justify-center  border-b border-gray-200'>
              <h3 className='font-semibold text-lg text-white p-1'>
                {selectedCategory || 'All'} Courses
              </h3>
            </div>

            <div className='grid grid-cols-1 gap-3'>
              {isLoading ? (
                <div className='flex items-center justify-center h-32'>
                  <span className='text-gray-500'>Loading courses...</span>
                </div>
              ) : selectedCategoryCourses.length === 0 ? (
                <div className='flex items-center justify-center h-32'>
                  <span className='text-gray-500'>
                    No courses available in this category
                  </span>
                </div>
              ) : (
                selectedCategoryCourses.map((c: Course) => (
                  <Link
                    key={`${c.id}-${c.link}`}
                    href={`/courses/${c.link}`}
                    onClick={handleCourseClick}
                    data-testid="course-item"
                    className='block p-2 bg-white rounded-lg border border-gray-200 hover:border-red-300 hover:shadow-sm transition-all duration-200 group'
                  >
                    <div className='flex flex-col gap-1'>
                      <div className='flex items-start justify-between'>
                        <h5 className='text-sm font-bold text-gray-900 group-hover:text-red-700 transition-colors'>
                          <span
                            dangerouslySetInnerHTML={{
                              __html: c.title,
                            }}
                          />
                        </h5>

                        <span className='text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full whitespace-nowrap ml-2'>
                          {c.level}
                        </span>
                      </div>

                      <div className='text-sm text-gray-600 line-clamp-1'>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: c.shortDesc,
                          }}
                        />
                      </div>

                      <div className='flex items-center gap-4 text-xs text-gray-500'>
                        <span>⭐ {c.rating}</span>
                        <span>📅 {c.duration}</span>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>



        </div>
      </div>

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
                Found {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''}
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
                          <p className='text-xs text-white group-hover:text-green-300 line-clamp-2'>
                            <div dangerouslySetInnerHTML={{ __html: course.shortDesc }} />

                          </p>
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