"use client";

import React, { useContext, useEffect, useState, useRef, useMemo, useCallback } from 'react';
// import { Input } from '@/components/ui/input'; // removed — plain <input> used to prevent hydration mismatch
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
  MagnifyingGlassIcon,
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
// import { createPortal } from 'react-dom';
// Portal branch removed - see comment near the render return. Uncomment if
// the navbar ever needs to escape a transformed ancestor again.

interface UserContextType {
  authenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  userData: any;
}

interface NavbarProps {
  navbarData?: NavbarData;
}

const Navbar2: React.FC<NavbarProps> = () => {
  /* ----------------------------- state ----------------------------- */
  const [isActive, setIsActive] = useState<boolean>(false);
  const [navOpen, setNavOpen] = useState<boolean>(false);
  const [searchActive, setSearchActive] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openEbook, setOpenEbook] = useState<string | null>(null);


  const userCtx = useContext(UserContext) as UserContextType | undefined;

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  /**
   * Transparent-to-solid scroll effect.
   *
   * At the top of the page the navbar wrapper is transparent so the hero
   * image shows through around the pill (matches the reference initial state).
   * Once the user scrolls past a small threshold, the wrapper picks up a
   * solid white background and a soft shadow so the navbar reads clearly over
   * whatever content is scrolling under it (matches the reference scrolled
   * state).
   *
   * Uses passive scroll listener + requestAnimationFrame so it never causes
   * scroll jank, and only setState when the boolean actually flips.
   */
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    let raf = 0;
    let latest = false;
    const THRESHOLD = 20;

    const check = () => {
      raf = 0;
      const next = window.scrollY > THRESHOLD;
      if (next !== latest) {
        latest = next;
        setScrolled(next);
      }
    };

    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(check);
    };

    // Run once on mount so a hard-refresh at scrollY>0 applies the solid style.
    check();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  const authenticated = mounted && !!userCtx?.authenticated;
  const isAdmin = mounted && !!userCtx?.isAdmin;
  const loading = mounted ? !!userCtx?.loading : false;
  const userData = mounted ? userCtx?.userData ?? null : null;

  const [coursesByCategory, setCoursesByCategory] = useState<NavbarCategory[]>([]);
  const [allCourses, setAllCourses] = useState<NavbarCourse[]>([]);
  const [categoriesData, setCategoriesData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
 
  const hasFetchedRef = useRef(false);


  const livePathname = usePathname();
  const pathname = mounted ? (livePathname ?? '') : '';

  /* ----------------------------- refs ------------------------------ */
  const coursesDropdownRef = useRef<HTMLDivElement>(null);
  const coursesButtonRef = useRef<HTMLButtonElement>(null);
  const searchDrawerRef = useRef<HTMLDivElement>(null);
 
  const searchDesktopFormRef = useRef<HTMLFormElement>(null);
  const searchMobileFormRef = useRef<HTMLFormElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const ensureCoursesLoaded = useCallback(async () => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    setIsLoading(true);
    try {
      const [coursesRes, categoriesRes] = await Promise.all([
        fetch('/api/course/fetch-grouped'),
        fetch('/api/category/fetch'),
      ]);

      const coursesData: NavbarCategory[] = await coursesRes.json();
      setCoursesByCategory(coursesData);

      const flat: NavbarCourse[] = [];
      coursesData.forEach((cat) => {
        cat.courses.forEach((c) => flat.push({ ...c, category: cat.name }));
      });
      setAllCourses(flat);

      const cats = await categoriesRes.json();
      setCategoriesData(cats);
    } catch (err) {
      // Reset the guard so the next open retries. A permanent failure here
      // must not leave the dropdown empty forever.
      hasFetchedRef.current = false;
      console.error('Failed to load navbar course data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /* ---------------------- dropdown hover logic --------------------- */
  const handleButtonMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    ensureCoursesLoaded();
    setIsActive(true);
  };

  const handleButtonMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => setIsActive(false), 200);
  };

  const handleDropdownMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setIsActive(true);
  };

  const handleDropdownMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => setIsActive(false), 200);
  };

  const handleCoursesClick = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    ensureCoursesLoaded();
    setIsActive((v) => !v);
  };

  /* -------------------- click-outside handling --------------------- */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isActive &&
        coursesDropdownRef.current &&
        !coursesDropdownRef.current.contains(event.target as Node) &&
        coursesButtonRef.current &&
        !coursesButtonRef.current.contains(event.target as Node)
      ) {
        setIsActive(false);
      }
      // Click-outside for the search drawer: dismiss if the click was not
      // inside the drawer AND not inside either the desktop or mobile form.
      const inDrawer =
        !!searchDrawerRef.current &&
        searchDrawerRef.current.contains(event.target as Node);
      const inDesktopForm =
        !!searchDesktopFormRef.current &&
        searchDesktopFormRef.current.contains(event.target as Node);
      const inMobileForm =
        !!searchMobileFormRef.current &&
        searchMobileFormRef.current.contains(event.target as Node);
      if (!inDrawer && !inDesktopForm && !inMobileForm) {
        setSearchActive(false);
        setSearchQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isActive]);

  /* --------------------------- search ------------------------------ */
  const filteredCourses = useMemo(() => {
    if (!searchQuery.trim() || !allCourses) return [];
    const q = searchQuery.toLowerCase();
    return allCourses.filter(
      (c) =>
        c.title?.toLowerCase().includes(q) ||
        c.category?.toLowerCase().includes(q) ||
        c.shortDesc?.toLowerCase().includes(q) ||
        c.level?.toLowerCase().includes(q)
    );
  }, [allCourses, searchQuery]);

  const searchResultsByCategory = useMemo(() => {
    if (filteredCourses.length === 0) return [];
    const cats = [...new Set(filteredCourses.map((c) => c?.category).filter(Boolean))];
    return cats.map((name) => ({
      name,
      courses: filteredCourses.filter((c) => c?.category === name),
    }));
  }, [filteredCourses]);

  const handleCourseClick = () => {
    setIsActive(false);
    setSearchActive(false);
    setSearchQuery('');
  };

  const handleNavToggle = () => {
    setNavOpen((v) => !v);
    setOpenEbook(null);
    ensureCoursesLoaded();
  };

  const handleSearchFocus = () => {
    setSearchActive(true);
    ensureCoursesLoaded();
    if (isActive) setIsActive(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (!searchActive) setSearchActive(true);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  /* ------------------------ helpers -------------------------------- */
  const isActivePath = (href: string) => pathname === href;
 
  // When scrolled (white bg), links must be dark-gray; when transparent (hero), links are white.
  const navLinkCls = (href: string) =>
    `flex items-center gap-1 whitespace-nowrap text-[16px] font-medium transition-colors ${
      isActivePath(href)
        ? 'text-[#C6151D]'
        : scrolled
        ? 'text-gray-700 hover:text-[#C6151D]'
        : 'text-white hover:text-[#C6151D]'
    }`;

  const fixedNavbar = (
    <div
      className="fixed top-0 left-0 right-0 w-full flex flex-col items-center"
      style={{ zIndex: 100, position: 'fixed', top: 0, left: 0, right: 0 }}
    >
      {/*
        The visible top-strip. Transparent at the top of the page so the hero
        image shows through around the pill; picks up a solid white background
        with a soft shadow once the page has scrolled a little.
      */}
      {/* On mobile: always white/solid. On desktop: transparent at top, solid on scroll. */}
      <div
        className={`w-full transition-colors duration-200 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-[0_2px_10px_rgba(0,0,0,0.06)]'
            : 'bg-white/95 backdrop-blur-md shadow-[0_2px_10px_rgba(0,0,0,0.06)] md:bg-transparent md:backdrop-blur-none md:shadow-none'
        }`}
      >
        <div
          className={`mx-auto w-full max-w-[1400px] px-3 md:px-6 transition-[padding] duration-200 ${
            scrolled ? 'py-0' : 'py-1 md:py-3'
          }`}
        >
          <div
            className={`flex w-full items-center justify-between md:justify-start gap-3 rounded-full px-3 md:px-4 transition-all duration-200 ${
              scrolled
                ? ' py-1'
                : ' md:py-2'
            }`}
          >
          {/* -------- Logo -------- */}
          <Link href="/" aria-label="TechPratham home" className="shrink-0">
            <div className="relative h-9 w-28 md:h-10 md:w-32">
              <Image
                src="/navbar/lmslogo.png"
                alt="TechPratham"
                fill
                sizes="(max-width: 768px) 112px, 128px"
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>

          {/* -------- Desktop inline nav --------
              Plain text items with a chevron on the one that opens a dropdown,
              mirroring the reference navbar's density and hierarchy. */}
          <nav className="hidden lg:flex flex-1 items-center justify-center gap-6 xl:gap-8">
            <Link href="/" className={navLinkCls('/')}>Home</Link>

            {/* All Courses trigger + dropdown — wrapped in relative so the
                dropdown positions directly below this button, not the page center. */}
            <div className="relative">
              <button
                ref={coursesButtonRef}
                onClick={handleCoursesClick}
                onMouseEnter={handleButtonMouseEnter}
                onMouseLeave={handleButtonMouseLeave}
                className={`flex items-center gap-1 whitespace-nowrap font-medium transition-colors ${
                  isActive ? 'text-[#C6151D]' : scrolled ? 'text-gray-700 hover:text-[#C6151D]' : 'text-white hover:text-[#C6151D]'
                }`}
                aria-haspopup="true"
                aria-expanded={isActive}
                aria-label="All Courses"
              >
                <span>All Courses</span>
                <IoIosArrowDown
                  className={`w-3.5 h-3.5 transition-transform ${
                    isActive ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Dropdown anchored to the button */}
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
                anchorTo="button"
              />
            </div>

            <Link href="/about-us" className={navLinkCls('/about-us')}>About Us</Link>
            <Link href="/corporate-training" className={navLinkCls('/corporate-training')}>Corporate Training</Link>
            <Link href="/blog" className={navLinkCls('/blog')}>Blog</Link>
            <Link href="/payment" className={navLinkCls('/payment')}>Payment</Link>
            <Link href="/contact-us" className={navLinkCls('/contact-us')}>Contact Us</Link>
          </nav>

          {/* -------- Search (md+) -------- */}
          <form
            onSubmit={handleSearchSubmit}
            ref={searchDesktopFormRef}
            className="hidden md:flex items-center flex-1 lg:flex-none lg:w-56 max-w-xs"
          >
            <div className="relative flex w-full items-center border border-red-500 rounded-full bg-white focus-within:ring-2 focus-within:ring-red-100 transition overflow-hidden">
              {/* <Search className="w-4 h-4 text-gray-400 ml-3 shrink-0" /> */}
              <input
                ref={searchInputRef}
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={handleSearchFocus}
                placeholder="Search courses..."
                aria-label="Search courses"
                suppressHydrationWarning
                className="flex-1 border-0 outline-none bg-transparent h-7 pl-2 pr-3 text-sm text-gray-800 placeholder:text-gray-700"
              />
              <button
                type="submit"
                aria-label="Search"
                className=" flex h-7 w-8 shrink-0 items-center justify-center rounded-full bg-[#ff2a3b] text-white transition hover:opacity-90"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>


          <div className="hidden md:flex items-center shrink-0">
            {mounted && loading ? (
              <span className="text-xs text-gray-500 px-3">Loading...</span>
            ) : mounted && authenticated ? (
              <Link
                href={isAdmin ? '/admin/dashboard' : '/user/dashboard'}
                title={`Go to ${isAdmin ? 'Admin' : 'User'} Dashboard`}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C6151D] text-white font-bold text-sm shadow-sm hover:brightness-110 transition"
              >
                {userData?.name
                  ? userData.name.charAt(0).toUpperCase()
                  : userData?.email?.charAt(0).toUpperCase() || 'U'}
              </Link>
            ) : (
              <Link
                href="/auth/login"
                className="rounded-full bg-[#C6151D] text-white text-[12px] font-bold tracking-wider uppercase px-5 py-2 shadow-sm hover:brightness-110 transition"
              >
                Sign Up
              </Link>
            )}
          </div>

          {/* Mobile: always dark icon on white bg. Desktop: adapts to scroll state. */}
          <button
            className={`md:hidden flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors border-gray-200 bg-white text-gray-700`}
            onClick={handleNavToggle}
            aria-label="Toggle navigation menu"
            aria-expanded={navOpen}
          >
            {navOpen ? <Cross2Icon className="w-5 h-5" /> : <HamburgerMenuIcon className="w-5 h-5" />}
          </button>
        </div>

        </div>
      </div>

      {/* ==================== MOBILE DRAWER ==================== */}
     
      <div
        className={`w-full lg:hidden md:hidden flex items-start justify-center bg-white border-b border-gray-100 transition-all duration-300 ease-in-out transform origin-top ${
          navOpen
            ? 'max-h-[85vh] overflow-y-auto opacity-100 translate-y-0 scale-y-100'
            : 'max-h-0 opacity-0 -translate-y-4 scale-y-0 overflow-hidden'
        }`}
      >
        <nav
          className={`w-11/12 py-3 text-xs grid grid-cols-2 gap-2 transition-all duration-300 delay-100 ${
            navOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
          }`}
        >
          <Link href="/" onClick={handleNavToggle} className="w-full">
            <Button variant="outline" className="w-full flex items-center gap-2 hover:bg-red-50 hover:text-red-700 hover:border-red-200">
              <HomeIcon className="w-4 h-4" /> Home
            </Button>
          </Link>
          <Link href="/courses" onClick={handleNavToggle} className="w-full">
            <Button variant="outline" className="w-full flex items-center gap-2 hover:bg-red-50 hover:text-red-700 hover:border-red-200">
              <DashboardIcon className="w-4 h-4" /> Courses
            </Button>
          </Link>
          <Link href="/about-us" onClick={handleNavToggle} className="w-full">
            <Button variant="outline" className="w-full flex items-center gap-2 hover:bg-red-50 hover:text-red-700 hover:border-red-200">
              <PersonIcon className="w-4 h-4" /> About Us
            </Button>
          </Link>
          <Link href="/training-certificate" onClick={handleNavToggle} className="w-full">
            <Button variant="outline" className="w-full flex items-center gap-2 hover:bg-red-50 hover:text-red-700 hover:border-red-200">
              <IdCardIcon className="w-4 h-4" /> Training Certificate
            </Button>
          </Link>
          <Link href="/job-openings" onClick={handleNavToggle} className="w-full">
            <Button variant="outline" className="w-full flex items-center gap-2 hover:bg-red-50 hover:text-red-700 hover:border-red-200">
              <MagnifyingGlassIcon className="w-4 h-4" /> Job Openings
            </Button>
          </Link>
          <Link href="/blog" onClick={handleNavToggle} className="w-full">
            <Button variant="outline" className="w-full flex items-center gap-2 hover:bg-red-50 hover:text-red-700 hover:border-red-200">
              <FileTextIcon className="w-4 h-4" /> Blogs
            </Button>
          </Link>
          <Link href="/payment" onClick={handleNavToggle} className="w-full">
            <Button variant="outline" className="w-full flex items-center gap-2 hover:bg-red-50 hover:text-red-700 hover:border-red-200">
              <CardStackIcon className="w-4 h-4" /> Payment
            </Button>
          </Link>
          <Link href="/contact-us" onClick={handleNavToggle} className="w-full">
            <Button variant="outline" className="w-full flex items-center gap-2 hover:bg-red-50 hover:text-red-700 hover:border-red-200">
              <EnvelopeClosedIcon className="w-4 h-4" /> Contact Us
            </Button>
          </Link>

          {loading ? (
            <Button variant="outline" className="w-full" disabled>
              Loading...
            </Button>
          ) : authenticated ? (
            isAdmin ? (
              <Link href="/admin/dashboard" onClick={handleNavToggle} className="w-full">
                <Button variant="outline" className="w-full hover:bg-red-50 hover:text-red-700 hover:border-red-200">
                  Admin Dashboard
                </Button>
              </Link>
            ) : (
              <Link href="/user/dashboard" onClick={handleNavToggle} className="w-full">
                <Button variant="outline" className="w-full hover:bg-red-50 hover:text-red-700 hover:border-red-200">
                  Dashboard
                </Button>
              </Link>
            )
          ) : (
            <Link href="/auth/login" onClick={handleNavToggle} className="w-full">
              <Button variant="outline" className="w-full hover:bg-red-50 hover:text-red-700 hover:border-red-200">
                Login
              </Button>
            </Link>
          )}

          {authenticated && (
            <Button
              variant="outline"
              onClick={() => signOut()}
              className="w-full hover:bg-red-50 hover:text-red-700 hover:border-red-200"
            >
              Sign Out
            </Button>
          )}

          {/* E-Books accordion, mirrors Navbar.tsx behaviour. */}
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

      {/* ==================== SEARCH DRAWER ==================== */}
      {/* Same drawer markup and behaviour as Navbar.tsx. */}
      {/*
        Search drawer sits above the fixed navbar (z-index 100) so its results
        overlay everything else. Absolute-positioned inside the fixed wrapper
        so it scrolls with the navbar and stays anchored to it.
      */}
      <div
        ref={searchDrawerRef}
        style={{ zIndex: 99 }}
        className={`transition-all duration-300 border-b border-b-gray-200 ${
          !searchActive ? '-top-80 right-0' : 'top-16 right-0'
        } absolute flex w-[70%] h-auto rounded-sm bg-white text-[#1a1a1a] flex-col items-center md:overflow-hidden overflow-y-auto pb-4`}
      >
        <div className="p-2  h-auto md:py-2 py-4 max-h-96 content-center overflow-y-auto hide-scrollbar">
          <div className="md:mb-6 mb-4">
            <h3 className="font-semibold text-lg text-black">
              {searchQuery ? `Search Results for "${searchQuery}"` : 'Start typing to search courses...'}
            </h3>
            {searchQuery && (
              <p className="text-sm text-black">
                Found {filteredCourses.length} course.{filteredCourses.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          {!searchQuery ? (
            <div className="flex items-center justify-center h-32">
              <span className="text-black">Type in the search box to find courses</span>
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center h-32">
              <span className="text-black">Searching courses...</span>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <span className="text-black">No courses found matching your search</span>
            </div>
          ) : (
            <div className="space-y-2">
              {searchResultsByCategory.map((category) => (
                <div key={category.name}>
                  <h4 className="font-medium text-md text-black mb-3 pb-1 border-b border-gray-200">
                    {category.name} ({category.courses.length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {category.courses.map((course) => (
                      <Link
                        key={`search-${course.id}-${course.link}`}
                        href={`/courses/${course.link}`}
                        onClick={handleCourseClick}
                        className="block p-3 bg-gradient-to-tl from-[#C6151D] to-[#600A0E] rounded-lg border border-gray-200 hover:border-red-300 hover:shadow-sm transition-all duration-200 group"
                      >
                        <div className="flex flex-col gap-2">
                          <div className="flex items-start justify-between">
                            <h5 className="font-medium text-sm text-white group-hover:text-green-300 transition-colors">
                              <span dangerouslySetInnerHTML={{ __html: course.title }} />
                            </h5>
                            <span className="text-xs bg-yellow-600 text-black px-2 py-1 rounded-full whitespace-nowrap ml-2">
                              {course.level}
                            </span>
                          </div>
                          <div
                            className="text-xs text-white group-hover:text-green-300 line-clamp-2"
                            dangerouslySetInnerHTML={{ __html: course.shortDesc }}
                          />
                          <div className="flex items-center gap-4 text-xs text-white">
                            <span className="flex items-center gap-1">⭐ {course.rating}</span>
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

  return (
    <>
   
      <div
        aria-hidden="true"
        className="w-full h-[64px] md:h-[80px] shrink-0 pointer-events-none"
      />

     
      {fixedNavbar}
    </>
  );
};

export default Navbar2;
