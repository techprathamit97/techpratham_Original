// // import { useRouter } from "next/router";
// // import { useEffect, useState } from "react";
// // import CourseLayout from "@/components/lms/CourseLayout";
// // import { Render } from "@measured/puck";
// // import "@measured/puck/puck.css";
// // import { puckConfig } from "@/src/lms/puckConfig";
// // import { IndexController } from "@/src/index/controller/IndexController";
// // import { withNavbarSSR } from '@/utils/withNavbarSSR';
// // import LeadForm from '@/components/common/LeadForm/LeadForm';

// // /* ---------- COMPONENT ---------- */
// // export default function CoursePage({ navbarData }) {
// //   const router = useRouter();
// //   const { courseId, slug } = router.query;

// //   // slug = ["lesson-1", "section-1", "sub-section-1"]
// //   const lessonSlug = slug?.[0] || null;
// //   const sectionSlug = slug?.[1] || null;
// //   const subSectionSlug = slug?.[2] || null;

// //   const [data, setData] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [redirecting, setRedirecting] = useState(false);

// //   /* ---------- REDIRECT TO FIRST LESSON IF NEEDED ---------- */
// //   useEffect(() => {
// //     if (!router.isReady || !courseId) return;
    
// //     // If we have a lesson slug, we're not redirecting
// //     if (lessonSlug) {
// //       setRedirecting(false);
// //       setLoading(false);
// //       return;
// //     }

// //     // No lesson slug, need to redirect to first lesson
// //     setRedirecting(true);
    
// //     const redirectToFirstLesson = async () => {
// //       try {
// //         const res = await fetch(`/api/lms/sidebar?courseId=${courseId}`);
// //         const lessons = await res.json();

// //         if (lessons?.length > 0) {
// //           const firstSlug = lessons[0].slug;
// //           await router.replace(`/e-book/${courseId}/${firstSlug}`);
// //         } else {
// //           setLoading(false);
// //           setRedirecting(false);
// //         }
// //       } catch (error) {
// //         console.error("Failed to fetch lessons:", error);
// //         setLoading(false);
// //         setRedirecting(false);
// //       }
// //     };

// //     redirectToFirstLesson();
// //   }, [router.isReady, courseId, lessonSlug, router]);

// //   /* ---------- LOAD PUCK CONTENT (LESSON / SECTION / SUB-SECTION) ---------- */
// //   useEffect(() => {
// //     if (!courseId || !lessonSlug) {
// //       setData(null);
// //       return;
// //     }

// //     setLoading(true);

// //     const fetchPuckData = async () => {
// //       try {
// //         const query = new URLSearchParams({
// //           courseId,
// //           lessonId: lessonSlug,
// //           ...(sectionSlug && { sectionId: sectionSlug }),
// //           ...(subSectionSlug && { subSectionId: subSectionSlug }),
// //           // Always add timestamp for fresh data
// //           t: Date.now().toString()
// //         });

// //         console.log('Fetching puck data with query:', query.toString());

// //         const res = await fetch(`/api/lms/puck?${query.toString()}`, {
// //           headers: {
// //             'Cache-Control': 'no-cache',
// //             'Pragma': 'no-cache'
// //           }
// //         });
        
// //         if (!res.ok) {
// //           throw new Error(`HTTP ${res.status}: ${res.statusText}`);
// //         }
        
// //         const result = await res.json();
        
// //         console.log('Fetched puck data:', result);
// //         console.log('Data structure check:', {
// //           hasContent: !!result.content,
// //           contentLength: result.content?.length || 0,
// //           hasZones: !!result.zones,
// //           zonesKeys: result.zones ? Object.keys(result.zones) : [],
// //           fullData: result
// //         });
        
// //         setData(result);
// //       } catch (error) {
// //         console.error("Failed to fetch puck data:", error);
// //         console.error("Error details:", {
// //           courseId,
// //           lessonSlug,
// //           sectionSlug,
// //           subSectionSlug,
// //           error: error.message
// //         });
// //         setData({ root: {}, content: [] });
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchPuckData();
// //   }, [courseId, lessonSlug, sectionSlug, subSectionSlug]);

// //   /* ---------- LISTEN FOR CONTENT UPDATES FROM EDITOR ---------- */
// //   useEffect(() => {
// //     if (typeof window === 'undefined') return;

// //     const handleStorageChange = (e) => {
// //       if (e.key === 'lms-content-updated') {
// //         try {
// //           const updateInfo = JSON.parse(e.newValue || '{}');
          
// //           // Check if this update is for the current content
// //           if (updateInfo.courseId === courseId && 
// //               updateInfo.lessonId === lessonSlug &&
// //               (!sectionSlug || updateInfo.sectionId === sectionSlug) &&
// //               (!subSectionSlug || updateInfo.subSectionId === subSectionSlug)) {
            
// //             console.log('Content updated, refetching...');
            
// //             // Refetch the data
// //             const fetchUpdatedData = async () => {
// //               try {
// //                 const query = new URLSearchParams({
// //                   courseId,
// //                   lessonId: lessonSlug,
// //                   ...(sectionSlug && { sectionId: sectionSlug }),
// //                   ...(subSectionSlug && { subSectionId: subSectionSlug }),
// //                   t: Date.now().toString()
// //                 });

// //                 const res = await fetch(`/api/lms/puck?${query.toString()}`);
// //                 const result = await res.json();
// //                 console.log('Refetched data after content update:', result);
// //                 setData(result);
// //               } catch (error) {
// //                 console.error("Failed to refetch puck data:", error);
// //               }
// //             };

// //             fetchUpdatedData();
// //           }
// //         } catch (error) {
// //           console.error('Error parsing storage update:', error);
// //         }
// //       }
      
// //       // Also listen for sidebar updates
// //       if (e.key === 'lms-sidebar-updated') {
// //         try {
// //           const updateInfo = JSON.parse(e.newValue || '{}');
// //           if (updateInfo.courseId === courseId) {
// //             console.log('Sidebar updated, refetching content...');
            
// //             // Refetch content after sidebar update
// //             setTimeout(async () => {
// //               try {
// //                 const query = new URLSearchParams({
// //                   courseId,
// //                   lessonId: lessonSlug,
// //                   ...(sectionSlug && { sectionId: sectionSlug }),
// //                   ...(subSectionSlug && { subSectionId: subSectionSlug }),
// //                   t: Date.now().toString()
// //                 });

// //                 const res = await fetch(`/api/lms/puck?${query.toString()}`);
// //                 const result = await res.json();
// //                 console.log('Refetched data after sidebar update:', result);
// //                 setData(result);
// //               } catch (error) {
// //                 console.error("Failed to refetch after sidebar update:", error);
// //               }
// //             }, 500); // Small delay to ensure DB is updated
// //           }
// //         } catch (error) {
// //           console.error('Error parsing sidebar update:', error);
// //         }
// //       }
// //     };

// //     // Also listen for popstate events (browser navigation)
// //     const handlePopState = () => {
// //       // Small delay to ensure URL has updated
// //       setTimeout(() => {
// //         const urlParams = new URLSearchParams(window.location.search);
// //         if (urlParams.get('t')) {
// //           // Force refetch if timestamp in URL
// //           window.location.reload();
// //         }
// //       }, 100);
// //     };

// //     window.addEventListener('storage', handleStorageChange);
// //     window.addEventListener('popstate', handlePopState);
    
// //     return () => {
// //       window.removeEventListener('storage', handleStorageChange);
// //       window.removeEventListener('popstate', handlePopState);
// //     };
// //   }, [courseId, lessonSlug, sectionSlug, subSectionSlug]);

// //   /* ---------- SCROLL PROGRESS TRACKING ---------- */
// //    const [showLeadForm, setShowLeadForm] = useState(false);
// //  useEffect(() => {
// //     // Show popup after 10 seconds for all users
// //     const timer = setTimeout(() => {
// //       setShowLeadForm(true);
// //     }, 10000); // 10 seconds

// //     return () => clearTimeout(timer);
// //   }, []);
// //   useEffect(() => {
// //     if (!lessonSlug || !courseId) return;

// //     const onScroll = () => {
// //       const total =
// //         document.documentElement.scrollHeight - window.innerHeight;
// //       if (total <= 0) return;

// //       const percent = Math.round((window.scrollY / total) * 100);

// //       const scroll =
// //         JSON.parse(
// //           localStorage.getItem(`course-scroll-${courseId}`) || "{}"
// //         );

// //       scroll[lessonSlug] = percent;
// //       localStorage.setItem(
// //         `course-scroll-${courseId}`,
// //         JSON.stringify(scroll)
// //       );

// //       if (percent >= 95) {
// //         const progress =
// //           JSON.parse(
// //             localStorage.getItem(`course-progress-${courseId}`) || "{}"
// //           );
// //         progress[lessonSlug] = true;
// //         localStorage.setItem(
// //           `course-progress-${courseId}`,
// //           JSON.stringify(progress)
// //         );
// //       }
// //     };

// //     window.addEventListener("scroll", onScroll, { passive: true });
// //     return () => window.removeEventListener("scroll", onScroll);
// //   }, [lessonSlug, courseId]);
 
// //   return (
// //     <IndexController navbarData={navbarData}>
// //       <CourseLayout
// //         courseId={courseId}
// //         activeLesson={lessonSlug}
// //         activeSection={sectionSlug}
// //         activeSubSection={subSectionSlug}
// //         onLessonSelect={({ lesson, section, subSection }) => {
// //           router.push(
// //             subSection
// //               ? `/e-book/${courseId}/${lesson}/${section}/${subSection}`
// //               : section
// //               ? `/e-book/${courseId}/${lesson}/${section}`
// //               : `/e-book/${courseId}/${lesson}`
// //           );
// //         }}
// //       >

// //         {/* CONTENT AREA */}
// //         {redirecting ? (
// //           <div
// //             style={{
// //               minHeight: "60vh",
// //               display: "flex",
// //               alignItems: "center",
// //               justifyContent: "center",
// //               fontSize: "16px",
// //               fontWeight: 500
// //             }}
// //           >
// //             Redirecting to first lesson...
// //           </div>
// //         ) : loading ? (
// //           <div
// //             style={{
// //               minHeight: "60vh",
// //               display: "flex",
// //               alignItems: "center",
// //               justifyContent: "center",
// //               fontSize: "16px",
// //               fontWeight: 500
// //             }}
// //           >
// //             Loading course content...
// //           </div>
// //         ) : !data ? (
// //           <div
// //             style={{
// //               minHeight: "60vh",
// //               display: "flex",
// //               alignItems: "center",
// //               justifyContent: "center",
// //               fontSize: "16px",
// //               fontWeight: 500,
// //               flexDirection: "column",
// //               gap: "10px"
// //             }}
// //           >
// //             <div>No data received</div>
// //             <div style={{ fontSize: "14px", color: "#666" }}>
// //               Course: {courseId} | Lesson: {lessonSlug} | Section: {sectionSlug}
// //             </div>
// //           </div>
// //         ) : (
// //           <div>
// //             {console.log('Rendering with data:', data)}
// //             {/* Add error boundary and better handling */}
// //             {(() => {
// //               try {
// //                 // Check if data has the right structure
// //                 if (!data || typeof data !== 'object') {
// //                   console.error('Invalid data structure:', data);
// //                   return (
// //                     <div style={{ padding: '20px', textAlign: 'center' }}>
// //                       <div>Invalid data structure</div>
// //                       <pre style={{ fontSize: '12px', color: '#666' }}>
// //                         {JSON.stringify(data, null, 2)}
// //                       </pre>
// //                     </div>
// //                   );
// //                 }

// //                 // Ensure data has required structure for Puck
// //                 const puckData = {
// //                   root: data.root || {},
// //                   content: Array.isArray(data.content) ? data.content : [],
// //                   zones: data.zones || {}
// //                 };

// //                 console.log('Rendering Puck with:', puckData);
// //                 console.log('Content items:', puckData.content.map((item, i) => ({
// //                   index: i,
// //                   type: item.type,
// //                   hasProps: !!item.props,
// //                   propsKeys: item.props ? Object.keys(item.props) : []
// //                 })));

// //                 // Add validation for each content item
// //                 const validatedContent = puckData.content.map((item, index) => {
// //                   if (!item.type) {
// //                     console.error(`Content item ${index} missing type:`, item);
// //                     return null;
// //                   }
// //                   if (!item.props) {
// //                     console.warn(`Content item ${index} missing props, adding empty:`, item);
// //                     item.props = {};
// //                   }
// //                   return item;
// //                 }).filter(Boolean);

// //                 const finalPuckData = {
// //                   ...puckData,
// //                   content: validatedContent
// //                 };

// //                 console.log('Final validated Puck data:', finalPuckData);

// //                 // DEBUG: Add a simple fallback renderer to test
// //                 if (typeof window !== 'undefined' && window.location.search.includes('debug=true')) {
// //                   return (
// //                     <div style={{ padding: '20px' }}>
// //                       <h2>Debug Mode - Raw Content</h2>
// //                       {finalPuckData.content.map((item, index) => (
// //                         <div key={index} style={{ 
// //                           border: '1px solid #ccc', 
// //                           margin: '10px 0', 
// //                           padding: '10px',
// //                           backgroundColor: '#f9f9f9'
// //                         }}>
// //                           <strong>Type:</strong> {item.type}<br/>
// //                           <strong>Props:</strong>
// //                           <pre style={{ fontSize: '12px', overflow: 'auto' }}>
// //                             {JSON.stringify(item.props, null, 2)}
// //                           </pre>
// //                           {item.type === 'RichText' && item.props?.content && (
// //                             <div>
// //                               <strong>Rendered HTML:</strong>
// //                               <div 
// //                                 style={{ 
// //                                   border: '1px solid #ddd', 
// //                                   padding: '10px', 
// //                                   marginTop: '5px',
// //                                   backgroundColor: 'white'
// //                                 }}
// //                                 dangerouslySetInnerHTML={{ __html: item.props.content }}
// //                               />
// //                             </div>
// //                           )}
// //                         </div>
// //                       ))}
                      
// //                       <h3>Zones:</h3>
// //                       <pre style={{ fontSize: '12px', backgroundColor: '#f0f0f0', padding: '10px' }}>
// //                         {JSON.stringify(finalPuckData.zones, null, 2)}
// //                       </pre>
// //                     </div>
// //                   );
// //                 }

// //                 return (
// //                   <Render
// //                     key={`${lessonSlug}-${sectionSlug}-${subSectionSlug}-${Date.now()}`}
// //                     config={puckConfig}
// //                     data={finalPuckData}
// //                   />
// //                 );
// //               } catch (error) {
// //                 console.error('Error rendering Puck:', error);
// //                 console.error('Error stack:', error.stack);
// //                 return (
// //                   <div style={{ padding: '20px', textAlign: 'center' }}>
// //                     <div>Error rendering content</div>
// //                     <div style={{ fontSize: '14px', color: '#666' }}>
// //                       {error.message}
// //                     </div>
// //                     <pre style={{ fontSize: '12px', color: '#666', textAlign: 'left', maxHeight: '300px', overflow: 'auto' }}>
// //                       {JSON.stringify(data, null, 2)}
// //                     </pre>
// //                   </div>
// //                 );
// //               }
// //             })()}
// //           </div>
// //         )}
// //       </CourseLayout>
// //        {showLeadForm && (
// //           <LeadForm 
// //             course={{ title: '' }}
// //             onClose={() => setShowLeadForm(false)}
// //             onSuccess={() => setShowLeadForm(false)}
// //           />
// //         )}
// //     </IndexController>
// //   );
// // }

// // // Add navbar SSR
// // export const getServerSideProps = withNavbarSSR();

// import { useRouter } from "next/router";
// import { useEffect, useState } from "react";
// import Head from "next/head";
// import CourseLayout from "@/components/lms/CourseLayout";
// import { Render } from "@measured/puck";
// import "@measured/puck/puck.css";
// import { puckConfig } from "@/src/lms/puckConfig";
// import { IndexController } from "@/src/index/controller/IndexController";
// import { withNavbarSSR } from '@/utils/withNavbarSSR';
// import LeadForm from '@/components/common/LeadForm/LeadForm';

// /* ---------- SCHEMA HELPERS ---------- */

// /**
//  * Builds all JSON-LD schema objects for the current e-book page.
//  * courseId  → e.g. "workday"
//  * lessonSlug → e.g. "welcome-to-techpratham"
//  */
// function buildSchemas(courseId, lessonSlug, sectionSlug, subSectionSlug) {
//   const baseUrl = "https://www.techpratham.com";

//   // Canonical URL for this exact page
//   const pageUrl = [
//     `${baseUrl}/e-book/${courseId}`,
//     lessonSlug,
//     sectionSlug,
//     subSectionSlug,
//   ]
//     .filter(Boolean)
//     .join("/");

//   // ── 1. Organization ──────────────────────────────────────────────────────
//   const organization = {
//     "@context": "https://schema.org",
//     "@type": "Organization",
//     "@id": `${baseUrl}/#organization`,
//     name: "TechPratham",
//     url: baseUrl,
//     logo: {
//       "@type": "ImageObject",
//       url: `${baseUrl}/navbar/logotechnolyfirst2.svg`,
//     },
//     address: [
//       {
//         "@type": "PostalAddress",
//         streetAddress: "G-31, 1st Floor, Sector-3",
//         addressLocality: "Noida",
//         postalCode: "201301",
//         addressRegion: "Uttar Pradesh",
//         addressCountry: "IN",
//       },
//       {
//         "@type": "PostalAddress",
//         streetAddress: "LVS Arcade, 71, Hitech, 6th Floor, Madhapur Road, Jubilee Enclave, HITEC City",
//         addressLocality: "Hyderabad",
//         addressRegion: "Telangana",
//         addressCountry: "IN",
//       },
//     ],
//     contactPoint: {
//       "@type": "ContactPoint",
//       contactType: "customer support",
//       url: `${baseUrl}/contact-us`,
//     },
//     sameAs: [baseUrl],
//   };

//   // ── 2. WebSite (enables Sitelinks Search Box) ────────────────────────────
//   const website = {
//     "@context": "https://schema.org",
//     "@type": "WebSite",
//     "@id": `${baseUrl}/#website`,
//     url: baseUrl,
//     name: "TechPratham",
//     publisher: { "@id": `${baseUrl}/#organization` },
//   };

//   // ── 3. WebPage ───────────────────────────────────────────────────────────
//   const pageName = [courseId, lessonSlug, sectionSlug, subSectionSlug]
//     .filter(Boolean)
//     .map((s) => s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()))
//     .join(" – ");

//   const webpage = {
//     "@context": "https://schema.org",
//     "@type": "WebPage",
//     "@id": `${pageUrl}#webpage`,
//     url: pageUrl,
//     name: pageName || "Welcome to TechPratham – Workday e-Book",
//     description:
//       "Free Workday e-Book by TechPratham covering HCM, Staffing, Compensation, Security, Business Processes, Reporting and more.",
//     isPartOf: { "@id": `${baseUrl}/#website` },
//     publisher: { "@id": `${baseUrl}/#organization` },
//     inLanguage: "en",
//     breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
//   };

//   // ── 4. BreadcrumbList ────────────────────────────────────────────────────
//   const breadcrumbItems = [
//     { name: "Home", url: baseUrl },
//     { name: "e-Book", url: `${baseUrl}/e-book` },
//     {
//       name: courseId
//         ? courseId.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
//         : "Course",
//       url: `${baseUrl}/e-book/${courseId}`,
//     },
//   ];
//   if (lessonSlug)
//     breadcrumbItems.push({
//       name: lessonSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
//       url: `${baseUrl}/e-book/${courseId}/${lessonSlug}`,
//     });
//   if (sectionSlug)
//     breadcrumbItems.push({
//       name: sectionSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
//       url: `${baseUrl}/e-book/${courseId}/${lessonSlug}/${sectionSlug}`,
//     });
//   if (subSectionSlug)
//     breadcrumbItems.push({
//       name: subSectionSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
//       url: `${baseUrl}/e-book/${courseId}/${lessonSlug}/${sectionSlug}/${subSectionSlug}`,
//     });

//   const breadcrumb = {
//     "@context": "https://schema.org",
//     "@type": "BreadcrumbList",
//     "@id": `${pageUrl}#breadcrumb`,
//     itemListElement: breadcrumbItems.map((item, i) => ({
//       "@type": "ListItem",
//       position: i + 1,
//       name: item.name,
//       item: item.url,
//     })),
//   };

//   // ── 5. Course ────────────────────────────────────────────────────────────
//   const course = {
//     "@context": "https://schema.org",
//     "@type": "Course",
//     "@id": `${baseUrl}/e-book/${courseId}#course`,
//     name: courseId
//       ? `${courseId.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} e-Book`
//       : "Workday e-Book",
//     description:
//       "A comprehensive free Workday e-Book by TechPratham covering Organizations, Staffing Models, Job Profiles, Core Compensation, Security, Business Processes, Reporting, EIB, Absence Management, and Performance Management.",
//     url: `${baseUrl}/e-book/${courseId}`,
//     provider: { "@id": `${baseUrl}/#organization` },
//     educationalLevel: "Beginner to Advanced",
//     inLanguage: "en",
//     isAccessibleForFree: true,
//     hasCourseInstance: {
//       "@type": "CourseInstance",
//       courseMode: "online",
//       courseWorkload: "PT5H",
//     },
//     about: {
//       "@type": "Thing",
//       name: courseId
//         ? courseId.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
//         : "Workday HCM",
//     },
//     teaches:
//       "Workday HCM, Organizations, Staffing, Job Profiles, Core Compensation, Security, Business Processes, Reporting, EIB, Absence Management, Performance Management",
//     syllabusSections: [
//       { "@type": "Syllabus", name: "Organization in Workday" },
//       { "@type": "Syllabus", name: "Staffing in Workday" },
//       { "@type": "Syllabus", name: "Job Profile in Workday" },
//       { "@type": "Syllabus", name: "Core Compensation in Workday" },
//       { "@type": "Syllabus", name: "Security in Workday" },
//       { "@type": "Syllabus", name: "Business Process in Workday" },
//       { "@type": "Syllabus", name: "Reporting in Workday" },
//       { "@type": "Syllabus", name: "EIB in Workday" },
//       { "@type": "Syllabus", name: "Absence Management & Time Off in Workday" },
//       { "@type": "Syllabus", name: "Performance Management in Workday" },
//     ],
//   };

//   // ── 6. Book (e-Book specific) ────────────────────────────────────────────
//   const book = {
//     "@context": "https://schema.org",
//     "@type": "Book",
//     "@id": `${baseUrl}/e-book/${courseId}#book`,
//     name: courseId
//       ? `${courseId.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} e-Book`
//       : "Workday e-Book",
//     bookFormat: "EBook",
//     url: `${baseUrl}/e-book/${courseId}`,
//     inLanguage: "en",
//     publisher: { "@id": `${baseUrl}/#organization` },
//     about: {
//       "@type": "Thing",
//       name: courseId
//         ? courseId.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
//         : "Workday HCM",
//     },
//     isAccessibleForFree: true,
//   };

//   // ── 7. LearningResource (current lesson page) ────────────────────────────
//   const learningResource = lessonSlug
//     ? {
//         "@context": "https://schema.org",
//         "@type": "LearningResource",
//         "@id": `${pageUrl}#learningresource`,
//         name: lessonSlug
//           .replace(/-/g, " ")
//           .replace(/\b\w/g, (c) => c.toUpperCase()),
//         url: pageUrl,
//         isPartOf: { "@id": `${baseUrl}/e-book/${courseId}#course` },
//         provider: { "@id": `${baseUrl}/#organization` },
//         inLanguage: "en",
//         learningResourceType: "lesson",
//         educationalLevel: "Beginner to Advanced",
//         isAccessibleForFree: true,
//       }
//     : null;

//   return [
//     organization,
//     website,
//     webpage,
//     breadcrumb,
//     course,
//     book,
//     learningResource,
//   ].filter(Boolean);
// }

// /* ---------- COMPONENT ---------- */
// export default function CoursePage({ navbarData }) {
//   const router = useRouter();
//   const { courseId, slug } = router.query;
//   // slug = ["lesson-1", "section-1", "sub-section-1"]
//   const lessonSlug = slug?.[0] || null;
//   const sectionSlug = slug?.[1] || null;
//   const subSectionSlug = slug?.[2] || null;
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [redirecting, setRedirecting] = useState(false);

//   /* ---------- REDIRECT TO FIRST LESSON IF NEEDED ---------- */
//   useEffect(() => {
//     if (!router.isReady || !courseId) return;
    
//     // If we have a lesson slug, we're not redirecting
//     if (lessonSlug) {
//       setRedirecting(false);
//       setLoading(false);
//       return;
//     }
//     // No lesson slug, need to redirect to first lesson
//     setRedirecting(true);
    
//     const redirectToFirstLesson = async () => {
//       try {
//         const res = await fetch(`/api/lms/sidebar?courseId=${courseId}`);
//         const lessons = await res.json();
//         if (lessons?.length > 0) {
//           const firstSlug = lessons[0].slug;
//           await router.replace(`/e-book/${courseId}/${firstSlug}`);
//         } else {
//           setLoading(false);
//           setRedirecting(false);
//         }
//       } catch (error) {
//         console.error("Failed to fetch lessons:", error);
//         setLoading(false);
//         setRedirecting(false);
//       }
//     };
//     redirectToFirstLesson();
//   }, [router.isReady, courseId, lessonSlug, router]);

//   /* ---------- LOAD PUCK CONTENT (LESSON / SECTION / SUB-SECTION) ---------- */
//   useEffect(() => {
//     if (!courseId || !lessonSlug) {
//       setData(null);
//       return;
//     }
//     setLoading(true);
//     const fetchPuckData = async () => {
//       try {
//         const query = new URLSearchParams({
//           courseId,
//           lessonId: lessonSlug,
//           ...(sectionSlug && { sectionId: sectionSlug }),
//           ...(subSectionSlug && { subSectionId: subSectionSlug }),
//           // Always add timestamp for fresh data
//           t: Date.now().toString()
//         });
//         console.log('Fetching puck data with query:', query.toString());
//         const res = await fetch(`/api/lms/puck?${query.toString()}`, {
//           headers: {
//             'Cache-Control': 'no-cache',
//             'Pragma': 'no-cache'
//           }
//         });
        
//         if (!res.ok) {
//           throw new Error(`HTTP ${res.status}: ${res.statusText}`);
//         }
        
//         const result = await res.json();
        
//         console.log('Fetched puck data:', result);
//         console.log('Data structure check:', {
//           hasContent: !!result.content,
//           contentLength: result.content?.length || 0,
//           hasZones: !!result.zones,
//           zonesKeys: result.zones ? Object.keys(result.zones) : [],
//           fullData: result
//         });
        
//         setData(result);
//       } catch (error) {
//         console.error("Failed to fetch puck data:", error);
//         console.error("Error details:", {
//           courseId,
//           lessonSlug,
//           sectionSlug,
//           subSectionSlug,
//           error: error.message
//         });
//         setData({ root: {}, content: [] });
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchPuckData();
//   }, [courseId, lessonSlug, sectionSlug, subSectionSlug]);

//   /* ---------- LISTEN FOR CONTENT UPDATES FROM EDITOR ---------- */
//   useEffect(() => {
//     if (typeof window === 'undefined') return;
//     const handleStorageChange = (e) => {
//       if (e.key === 'lms-content-updated') {
//         try {
//           const updateInfo = JSON.parse(e.newValue || '{}');
          
//           // Check if this update is for the current content
//           if (updateInfo.courseId === courseId && 
//               updateInfo.lessonId === lessonSlug &&
//               (!sectionSlug || updateInfo.sectionId === sectionSlug) &&
//               (!subSectionSlug || updateInfo.subSectionId === subSectionSlug)) {
            
//             console.log('Content updated, refetching...');
            
//             // Refetch the data
//             const fetchUpdatedData = async () => {
//               try {
//                 const query = new URLSearchParams({
//                   courseId,
//                   lessonId: lessonSlug,
//                   ...(sectionSlug && { sectionId: sectionSlug }),
//                   ...(subSectionSlug && { subSectionId: subSectionSlug }),
//                   t: Date.now().toString()
//                 });
//                 const res = await fetch(`/api/lms/puck?${query.toString()}`);
//                 const result = await res.json();
//                 console.log('Refetched data after content update:', result);
//                 setData(result);
//               } catch (error) {
//                 console.error("Failed to refetch puck data:", error);
//               }
//             };
//             fetchUpdatedData();
//           }
//         } catch (error) {
//           console.error('Error parsing storage update:', error);
//         }
//       }
      
//       // Also listen for sidebar updates
//       if (e.key === 'lms-sidebar-updated') {
//         try {
//           const updateInfo = JSON.parse(e.newValue || '{}');
//           if (updateInfo.courseId === courseId) {
//             console.log('Sidebar updated, refetching content...');
            
//             // Refetch content after sidebar update
//             setTimeout(async () => {
//               try {
//                 const query = new URLSearchParams({
//                   courseId,
//                   lessonId: lessonSlug,
//                   ...(sectionSlug && { sectionId: sectionSlug }),
//                   ...(subSectionSlug && { subSectionId: subSectionSlug }),
//                   t: Date.now().toString()
//                 });
//                 const res = await fetch(`/api/lms/puck?${query.toString()}`);
//                 const result = await res.json();
//                 console.log('Refetched data after sidebar update:', result);
//                 setData(result);
//               } catch (error) {
//                 console.error("Failed to refetch after sidebar update:", error);
//               }
//             }, 500); // Small delay to ensure DB is updated
//           }
//         } catch (error) {
//           console.error('Error parsing sidebar update:', error);
//         }
//       }
//     };
//     // Also listen for popstate events (browser navigation)
//     const handlePopState = () => {
//       // Small delay to ensure URL has updated
//       setTimeout(() => {
//         const urlParams = new URLSearchParams(window.location.search);
//         if (urlParams.get('t')) {
//           // Force refetch if timestamp in URL
//           window.location.reload();
//         }
//       }, 100);
//     };
//     window.addEventListener('storage', handleStorageChange);
//     window.addEventListener('popstate', handlePopState);
    
//     return () => {
//       window.removeEventListener('storage', handleStorageChange);
//       window.removeEventListener('popstate', handlePopState);
//     };
//   }, [courseId, lessonSlug, sectionSlug, subSectionSlug]);

//   /* ---------- SCROLL PROGRESS TRACKING ---------- */
//   const [showLeadForm, setShowLeadForm] = useState(false);
//   useEffect(() => {
//     // Show popup after 10 seconds for all users
//     const timer = setTimeout(() => {
//       setShowLeadForm(true);
//     }, 10000); // 10 seconds
//     return () => clearTimeout(timer);
//   }, []);

//   useEffect(() => {
//     if (!lessonSlug || !courseId) return;
//     const onScroll = () => {
//       const total =
//         document.documentElement.scrollHeight - window.innerHeight;
//       if (total <= 0) return;
//       const percent = Math.round((window.scrollY / total) * 100);
//       const scroll =
//         JSON.parse(
//           localStorage.getItem(`course-scroll-${courseId}`) || "{}"
//         );
//       scroll[lessonSlug] = percent;
//       localStorage.setItem(
//         `course-scroll-${courseId}`,
//         JSON.stringify(scroll)
//       );
//       if (percent >= 95) {
//         const progress =
//           JSON.parse(
//             localStorage.getItem(`course-progress-${courseId}`) || "{}"
//           );
//         progress[lessonSlug] = true;
//         localStorage.setItem(
//           `course-progress-${courseId}`,
//           JSON.stringify(progress)
//         );
//       }
//     };
//     window.addEventListener("scroll", onScroll, { passive: true });
//     return () => window.removeEventListener("scroll", onScroll);
//   }, [lessonSlug, courseId]);

//   /* ---------- BUILD DYNAMIC SCHEMA ---------- */
//   const schemas = buildSchemas(courseId, lessonSlug, sectionSlug, subSectionSlug);

//   return (
//     <IndexController navbarData={navbarData}>

//       {/* ── SCHEMA INJECTION ─────────────────────────────────────────────── */}
//       <Head>
//         {schemas.map((schema, i) => (
//           <script
//             key={`schema-${i}`}
//             type="application/ld+json"
//             dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
//           />
//         ))}
//       </Head>
//       {/* ─────────────────────────────────────────────────────────────────── */}

//       <CourseLayout
//         courseId={courseId}
//         activeLesson={lessonSlug}
//         activeSection={sectionSlug}
//         activeSubSection={subSectionSlug}
//         onLessonSelect={({ lesson, section, subSection }) => {
//           router.push(
//             subSection
//               ? `/e-book/${courseId}/${lesson}/${section}/${subSection}`
//               : section
//               ? `/e-book/${courseId}/${lesson}/${section}`
//               : `/e-book/${courseId}/${lesson}`
//           );
//         }}
//       >
//         {/* CONTENT AREA */}
//         {redirecting ? (
//           <div
//             style={{
//               minHeight: "60vh",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               fontSize: "16px",
//               fontWeight: 500
//             }}
//           >
//             Redirecting to first lesson...
//           </div>
//         ) : loading ? (
//           <div
//             style={{
//               minHeight: "60vh",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               fontSize: "16px",
//               fontWeight: 500
//             }}
//           >
//             Loading course content...
//           </div>
//         ) : !data ? (
//           <div
//             style={{
//               minHeight: "60vh",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               fontSize: "16px",
//               fontWeight: 500,
//               flexDirection: "column",
//               gap: "10px"
//             }}
//           >
//             <div>No data received</div>
//             <div style={{ fontSize: "14px", color: "#666" }}>
//               Course: {courseId} | Lesson: {lessonSlug} | Section: {sectionSlug}
//             </div>
//           </div>
//         ) : (
//           <div>
//             {console.log('Rendering with data:', data)}
//             {/* Add error boundary and better handling */}
//             {(() => {
//               try {
//                 // Check if data has the right structure
//                 if (!data || typeof data !== 'object') {
//                   console.error('Invalid data structure:', data);
//                   return (
//                     <div style={{ padding: '20px', textAlign: 'center' }}>
//                       <div>Invalid data structure</div>
//                       <pre style={{ fontSize: '12px', color: '#666' }}>
//                         {JSON.stringify(data, null, 2)}
//                       </pre>
//                     </div>
//                   );
//                 }
//                 // Ensure data has required structure for Puck
//                 const puckData = {
//                   root: data.root || {},
//                   content: Array.isArray(data.content) ? data.content : [],
//                   zones: data.zones || {}
//                 };
//                 console.log('Rendering Puck with:', puckData);
//                 console.log('Content items:', puckData.content.map((item, i) => ({
//                   index: i,
//                   type: item.type,
//                   hasProps: !!item.props,
//                   propsKeys: item.props ? Object.keys(item.props) : []
//                 })));
//                 // Add validation for each content item
//                 const validatedContent = puckData.content.map((item, index) => {
//                   if (!item.type) {
//                     console.error(`Content item ${index} missing type:`, item);
//                     return null;
//                   }
//                   if (!item.props) {
//                     console.warn(`Content item ${index} missing props, adding empty:`, item);
//                     item.props = {};
//                   }
//                   return item;
//                 }).filter(Boolean);
//                 const finalPuckData = {
//                   ...puckData,
//                   content: validatedContent
//                 };
//                 console.log('Final validated Puck data:', finalPuckData);
//                 // DEBUG: Add a simple fallback renderer to test
//                 if (typeof window !== 'undefined' && window.location.search.includes('debug=true')) {
//                   return (
//                     <div style={{ padding: '20px' }}>
//                       <h2>Debug Mode - Raw Content</h2>
//                       {finalPuckData.content.map((item, index) => (
//                         <div key={index} style={{ 
//                           border: '1px solid #ccc', 
//                           margin: '10px 0', 
//                           padding: '10px',
//                           backgroundColor: '#f9f9f9'
//                         }}>
//                           <strong>Type:</strong> {item.type}<br/>
//                           <strong>Props:</strong>
//                           <pre style={{ fontSize: '12px', overflow: 'auto' }}>
//                             {JSON.stringify(item.props, null, 2)}
//                           </pre>
//                           {item.type === 'RichText' && item.props?.content && (
//                             <div>
//                               <strong>Rendered HTML:</strong>
//                               <div 
//                                 style={{ 
//                                   border: '1px solid #ddd', 
//                                   padding: '10px', 
//                                   marginTop: '5px',
//                                   backgroundColor: 'white'
//                                 }}
//                                 dangerouslySetInnerHTML={{ __html: item.props.content }}
//                               />
//                             </div>
//                           )}
//                         </div>
//                       ))}
                      
//                       <h3>Zones:</h3>
//                       <pre style={{ fontSize: '12px', backgroundColor: '#f0f0f0', padding: '10px' }}>
//                         {JSON.stringify(finalPuckData.zones, null, 2)}
//                       </pre>
//                     </div>
//                   );
//                 }
//                 return (
//                   <Render
//                     key={`${lessonSlug}-${sectionSlug}-${subSectionSlug}-${Date.now()}`}
//                     config={puckConfig}
//                     data={finalPuckData}
//                   />
//                 );
//               } catch (error) {
//                 console.error('Error rendering Puck:', error);
//                 console.error('Error stack:', error.stack);
//                 return (
//                   <div style={{ padding: '20px', textAlign: 'center' }}>
//                     <div>Error rendering content</div>
//                     <div style={{ fontSize: '14px', color: '#666' }}>
//                       {error.message}
//                     </div>
//                     <pre style={{ fontSize: '12px', color: '#666', textAlign: 'left', maxHeight: '300px', overflow: 'auto' }}>
//                       {JSON.stringify(data, null, 2)}
//                     </pre>
//                   </div>
//                 );
//               }
//             })()}
//           </div>
//         )}
//       </CourseLayout>

//       {showLeadForm && (
//         <LeadForm 
//           course={{ title: '' }}
//           onClose={() => setShowLeadForm(false)}
//           onSuccess={() => setShowLeadForm(false)}
//         />
//       )}
//     </IndexController>
//   );
// }

// // Add navbar SSR
// export const getServerSideProps = withNavbarSSR();

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";
import CourseLayout from "@/components/lms/CourseLayout";
import { Render } from "@measured/puck";
import "@measured/puck/puck.css";
import { puckConfig } from "@/src/lms/puckConfig";
import { IndexController } from "@/src/index/controller/IndexController";
import { withNavbarSSR } from '@/utils/withNavbarSSR';
import LeadForm from '@/components/common/LeadForm/LeadForm';

/* ---------- SCHEMA HELPERS ---------- */

/**
 * Builds all JSON-LD schema objects for the current e-book page.
 * courseId  → e.g. "workday"
 * lessonSlug → e.g. "welcome-to-techpratham"
 */
function buildSchemas(courseId, lessonSlug, sectionSlug, subSectionSlug) {
  const baseUrl = "https://www.techpratham.com";

  // Canonical URL for this exact page
  const pageUrl = [
    `${baseUrl}/e-book/${courseId}`,
    lessonSlug,
    sectionSlug,
    subSectionSlug,
  ]
    .filter(Boolean)
    .join("/");

  // ── 1. Organization ──────────────────────────────────────────────────────
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${baseUrl}/#organization`,
    name: "TechPratham",
    url: baseUrl,
    logo: {
      "@type": "ImageObject",
      url: `${baseUrl}/navbar/logotechnolyfirst2.svg`,
    },
    address: [
      {
        "@type": "PostalAddress",
        streetAddress: "G-31, 1st Floor, Sector-3",
        addressLocality: "Noida",
        postalCode: "201301",
        addressRegion: "Uttar Pradesh",
        addressCountry: "IN",
      },
      {
        "@type": "PostalAddress",
        streetAddress: "LVS Arcade, 71, Hitech, 6th Floor, Madhapur Road, Jubilee Enclave, HITEC City",
        addressLocality: "Hyderabad",
        addressRegion: "Telangana",
        addressCountry: "IN",
      },
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      url: `${baseUrl}/contact-us`,
    },
    sameAs: [baseUrl],
  };


  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    url: baseUrl,
    name: "TechPratham",
    publisher: { "@id": `${baseUrl}/#organization` },
  };

  // ── 3. WebPage ───────────────────────────────────────────────────────────
  const pageName = [courseId, lessonSlug, sectionSlug, subSectionSlug]
    .filter(Boolean)
    .map((s) => s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()))
    .join(" – ");

  const webpage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name: pageName || "Welcome to TechPratham – Workday e-Book",
    description:
      "Free Workday e-Book by TechPratham covering HCM, Staffing, Compensation, Security, Business Processes, Reporting and more.",
    isPartOf: { "@id": `${baseUrl}/#website` },
    publisher: { "@id": `${baseUrl}/#organization` },
    inLanguage: "en",
    breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
  };

  // ── 4. BreadcrumbList ────────────────────────────────────────────────────
  const breadcrumbItems = [
    { name: "Home", url: baseUrl },
    { name: "e-Book", url: `${baseUrl}/e-book` },
    {
      name: courseId
        ? courseId.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
        : "Course",
      url: `${baseUrl}/e-book/${courseId}`,
    },
  ];
  if (lessonSlug)
    breadcrumbItems.push({
      name: lessonSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      url: `${baseUrl}/e-book/${courseId}/${lessonSlug}`,
    });
  if (sectionSlug)
    breadcrumbItems.push({
      name: sectionSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      url: `${baseUrl}/e-book/${courseId}/${lessonSlug}/${sectionSlug}`,
    });
  if (subSectionSlug)
    breadcrumbItems.push({
      name: subSectionSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      url: `${baseUrl}/e-book/${courseId}/${lessonSlug}/${sectionSlug}/${subSectionSlug}`,
    });

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}#breadcrumb`,
    itemListElement: breadcrumbItems.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
  const course = {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": `${baseUrl}/e-book/${courseId}#course`,
    name: courseId
      ? `${courseId.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} e-Book`
      : "Workday e-Book",
    description:
      "A comprehensive free Workday e-Book by TechPratham covering Organizations, Staffing Models, Job Profiles, Core Compensation, Security, Business Processes, Reporting, EIB, Absence Management, and Performance Management.",
    url: `${baseUrl}/e-book/${courseId}`,
    provider: { "@id": `${baseUrl}/#organization` },
    educationalLevel: "Beginner to Advanced",
    inLanguage: "en",
    isAccessibleForFree: true,
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      courseWorkload: "PT5H",
    },
    about: {
      "@type": "Thing",
      name: courseId
        ? courseId.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
        : "Workday HCM",
    },
    teaches:
      "Workday HCM, Organizations, Staffing, Job Profiles, Core Compensation, Security, Business Processes, Reporting, EIB, Absence Management, Performance Management",
    syllabusSections: [
      { "@type": "Syllabus", name: "Organization in Workday" },
      { "@type": "Syllabus", name: "Staffing in Workday" },
      { "@type": "Syllabus", name: "Job Profile in Workday" },
      { "@type": "Syllabus", name: "Core Compensation in Workday" },
      { "@type": "Syllabus", name: "Security in Workday" },
      { "@type": "Syllabus", name: "Business Process in Workday" },
      { "@type": "Syllabus", name: "Reporting in Workday" },
      { "@type": "Syllabus", name: "EIB in Workday" },
      { "@type": "Syllabus", name: "Absence Management & Time Off in Workday" },
      { "@type": "Syllabus", name: "Performance Management in Workday" },
    ],
  };
  const book = {
    "@context": "https://schema.org",
    "@type": "Book",
    "@id": `${baseUrl}/e-book/${courseId}#book`,
    name: courseId
      ? `${courseId.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} e-Book`
      : "Workday e-Book",
    bookFormat: "EBook",
    url: `${baseUrl}/e-book/${courseId}`,
    inLanguage: "en",
    publisher: { "@id": `${baseUrl}/#organization` },
    about: {
      "@type": "Thing",
      name: courseId
        ? courseId.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
        : "Workday HCM",
    },
    isAccessibleForFree: true,
  };
  const learningResource = lessonSlug
    ? {
        "@context": "https://schema.org",
        "@type": "LearningResource",
        "@id": `${pageUrl}#learningresource`,
        name: lessonSlug
          .replace(/-/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase()),
        url: pageUrl,
        isPartOf: { "@id": `${baseUrl}/e-book/${courseId}#course` },
        provider: { "@id": `${baseUrl}/#organization` },
        inLanguage: "en",
        learningResourceType: "lesson",
        educationalLevel: "Beginner to Advanced",
        isAccessibleForFree: true,
      }
    : null;

  return [
    organization,
    website,
    webpage,
    breadcrumb,
    course,
    book,
    learningResource,
  ].filter(Boolean);
}

export default function CoursePage({ navbarData }) {
  const router = useRouter();
  const { courseId, slug } = router.query;
  // slug = ["lesson-1", "section-1", "sub-section-1"]
  const lessonSlug = slug?.[0] || null;
  const sectionSlug = slug?.[1] || null;
  const subSectionSlug = slug?.[2] || null;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);

  /* ---------- REDIRECT TO FIRST LESSON IF NEEDED ---------- */
  useEffect(() => {
    if (!router.isReady || !courseId) return;
    
    // If we have a lesson slug, we're not redirecting
    if (lessonSlug) {
      setRedirecting(false);
      setLoading(false);
      return;
    }
    // No lesson slug, need to redirect to first lesson
    setRedirecting(true);
    
    const redirectToFirstLesson = async () => {
      try {
        const res = await fetch(`/api/lms/sidebar?courseId=${courseId}`);
        const lessons = await res.json();
        if (lessons?.length > 0) {
          const firstSlug = lessons[0].slug;
          await router.replace(`/e-book/${courseId}/${firstSlug}`);
        } else {
          setLoading(false);
          setRedirecting(false);
        }
      } catch (error) {
        console.error("Failed to fetch lessons:", error);
        setLoading(false);
        setRedirecting(false);
      }
    };
    redirectToFirstLesson();
  }, [router.isReady, courseId, lessonSlug, router]);

  /* ---------- LOAD PUCK CONTENT (LESSON / SECTION / SUB-SECTION) ---------- */
  useEffect(() => {
    if (!courseId || !lessonSlug) {
      setData(null);
      return;
    }
    setLoading(true);
    const fetchPuckData = async () => {
      try {
        const query = new URLSearchParams({
          courseId,
          lessonId: lessonSlug,
          ...(sectionSlug && { sectionId: sectionSlug }),
          ...(subSectionSlug && { subSectionId: subSectionSlug }),
          // Always add timestamp for fresh data
          t: Date.now().toString()
        });
        console.log('Fetching puck data with query:', query.toString());
        const res = await fetch(`/api/lms/puck?${query.toString()}`, {
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        
        const result = await res.json();
        
        console.log('Fetched puck data:', result);
        console.log('Data structure check:', {
          hasContent: !!result.content,
          contentLength: result.content?.length || 0,
          hasZones: !!result.zones,
          zonesKeys: result.zones ? Object.keys(result.zones) : [],
          fullData: result
        });
        
        setData(result);
      } catch (error) {
        console.error("Failed to fetch puck data:", error);
        console.error("Error details:", {
          courseId,
          lessonSlug,
          sectionSlug,
          subSectionSlug,
          error: error.message
        });
        setData({ root: {}, content: [] });
      } finally {
        setLoading(false);
      }
    };
    fetchPuckData();
  }, [courseId, lessonSlug, sectionSlug, subSectionSlug]);

  /* ---------- LISTEN FOR CONTENT UPDATES FROM EDITOR ---------- */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleStorageChange = (e) => {
      if (e.key === 'lms-content-updated') {
        try {
          const updateInfo = JSON.parse(e.newValue || '{}');
          
          // Check if this update is for the current content
          if (updateInfo.courseId === courseId && 
              updateInfo.lessonId === lessonSlug &&
              (!sectionSlug || updateInfo.sectionId === sectionSlug) &&
              (!subSectionSlug || updateInfo.subSectionId === subSectionSlug)) {
            
            console.log('Content updated, refetching...');
            
            // Refetch the data
            const fetchUpdatedData = async () => {
              try {
                const query = new URLSearchParams({
                  courseId,
                  lessonId: lessonSlug,
                  ...(sectionSlug && { sectionId: sectionSlug }),
                  ...(subSectionSlug && { subSectionId: subSectionSlug }),
                  t: Date.now().toString()
                });
                const res = await fetch(`/api/lms/puck?${query.toString()}`);
                const result = await res.json();
                console.log('Refetched data after content update:', result);
                setData(result);
              } catch (error) {
                console.error("Failed to refetch puck data:", error);
              }
            };
            fetchUpdatedData();
          }
        } catch (error) {
          console.error('Error parsing storage update:', error);
        }
      }
      
      // Also listen for sidebar updates
      if (e.key === 'lms-sidebar-updated') {
        try {
          const updateInfo = JSON.parse(e.newValue || '{}');
          if (updateInfo.courseId === courseId) {
            console.log('Sidebar updated, refetching content...');
            
            // Refetch content after sidebar update
            setTimeout(async () => {
              try {
                const query = new URLSearchParams({
                  courseId,
                  lessonId: lessonSlug,
                  ...(sectionSlug && { sectionId: sectionSlug }),
                  ...(subSectionSlug && { subSectionId: subSectionSlug }),
                  t: Date.now().toString()
                });
                const res = await fetch(`/api/lms/puck?${query.toString()}`);
                const result = await res.json();
                console.log('Refetched data after sidebar update:', result);
                setData(result);
              } catch (error) {
                console.error("Failed to refetch after sidebar update:", error);
              }
            }, 500); // Small delay to ensure DB is updated
          }
        } catch (error) {
          console.error('Error parsing sidebar update:', error);
        }
      }
    };
    // Also listen for popstate events (browser navigation)
    const handlePopState = () => {
      // Small delay to ensure URL has updated
      setTimeout(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('t')) {
          // Force refetch if timestamp in URL
          window.location.reload();
        }
      }, 100);
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [courseId, lessonSlug, sectionSlug, subSectionSlug]);

  /* ---------- SCROLL PROGRESS TRACKING ---------- */
  const [showLeadForm, setShowLeadForm] = useState(false);
  useEffect(() => {
    // Show popup after 10 seconds for all users
    const timer = setTimeout(() => {
      setShowLeadForm(true);
    }, 10000); // 10 seconds
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!lessonSlug || !courseId) return;
    const onScroll = () => {
      const total =
        document.documentElement.scrollHeight - window.innerHeight;
      if (total <= 0) return;
      const percent = Math.round((window.scrollY / total) * 100);
      const scroll =
        JSON.parse(
          localStorage.getItem(`course-scroll-${courseId}`) || "{}"
        );
      scroll[lessonSlug] = percent;
      localStorage.setItem(
        `course-scroll-${courseId}`,
        JSON.stringify(scroll)
      );
      if (percent >= 95) {
        const progress =
          JSON.parse(
            localStorage.getItem(`course-progress-${courseId}`) || "{}"
          );
        progress[lessonSlug] = true;
        localStorage.setItem(
          `course-progress-${courseId}`,
          JSON.stringify(progress)
        );
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lessonSlug, courseId]);

  /* ---------- BUILD DYNAMIC SCHEMA ---------- */
  const schemas = buildSchemas(courseId, lessonSlug, sectionSlug, subSectionSlug);

  return (
    <IndexController navbarData={navbarData}>

      {/* ── SCHEMA INJECTION ─────────────────────────────────────────────── */}
      <Head>
        {schemas.map((schema, i) => (
          <script
            key={`schema-${i}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
      </Head>
      {/* ─────────────────────────────────────────────────────────────────── */}

      <CourseLayout
        courseId={courseId}
        activeLesson={lessonSlug}
        activeSection={sectionSlug}
        activeSubSection={subSectionSlug}
        onLessonSelect={({ lesson, section, subSection }) => {
          router.push(
            subSection
              ? `/e-book/${courseId}/${lesson}/${section}/${subSection}`
              : section
              ? `/e-book/${courseId}/${lesson}/${section}`
              : `/e-book/${courseId}/${lesson}`
          );
        }}
      >
        {/* CONTENT AREA */}
        {redirecting ? (
          <div
            style={{
              minHeight: "60vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
              fontWeight: 500
            }}
          >
            Redirecting to first lesson...
          </div>
        ) : loading ? (
          <div
            style={{
              minHeight: "60vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
              fontWeight: 500
            }}
          >
            Loading course content...
          </div>
        ) : !data ? (
          <div
            style={{
              minHeight: "60vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
              fontWeight: 500,
              flexDirection: "column",
              gap: "10px"
            }}
          >
            <div>No data received</div>
            <div style={{ fontSize: "14px", color: "#666" }}>
              Course: {courseId} | Lesson: {lessonSlug} | Section: {sectionSlug}
            </div>
          </div>
        ) : (
          <div>
            {console.log('Rendering with data:', data)}
            {/* Add error boundary and better handling */}
            {(() => {
              try {
                // Check if data has the right structure
                if (!data || typeof data !== 'object') {
                  console.error('Invalid data structure:', data);
                  return (
                    <div style={{ padding: '20px', textAlign: 'center' }}>
                      <div>Invalid data structure</div>
                      <pre style={{ fontSize: '12px', color: '#666' }}>
                        {JSON.stringify(data, null, 2)}
                      </pre>
                    </div>
                  );
                }
                // Ensure data has required structure for Puck
                const puckData = {
                  root: data.root || {},
                  content: Array.isArray(data.content) ? data.content : [],
                  zones: data.zones || {}
                };
                console.log('Rendering Puck with:', puckData);
                console.log('Content items:', puckData.content.map((item, i) => ({
                  index: i,
                  type: item.type,
                  hasProps: !!item.props,
                  propsKeys: item.props ? Object.keys(item.props) : []
                })));
                // Add validation for each content item
                const validatedContent = puckData.content.map((item, index) => {
                  if (!item.type) {
                    console.error(`Content item ${index} missing type:`, item);
                    return null;
                  }
                  if (!item.props) {
                    console.warn(`Content item ${index} missing props, adding empty:`, item);
                    item.props = {};
                  }
                  return item;
                }).filter(Boolean);
                const finalPuckData = {
                  ...puckData,
                  content: validatedContent
                };
                console.log('Final validated Puck data:', finalPuckData);
                // DEBUG: Add a simple fallback renderer to test
                if (typeof window !== 'undefined' && window.location.search.includes('debug=true')) {
                  return (
                    <div style={{ padding: '20px' }}>
                      <h2>Debug Mode - Raw Content</h2>
                      {finalPuckData.content.map((item, index) => (
                        <div key={index} style={{ 
                          border: '1px solid #ccc', 
                          margin: '10px 0', 
                          padding: '10px',
                          backgroundColor: '#f9f9f9'
                        }}>
                          <strong>Type:</strong> {item.type}<br/>
                          <strong>Props:</strong>
                          <pre style={{ fontSize: '12px', overflow: 'auto' }}>
                            {JSON.stringify(item.props, null, 2)}
                          </pre>
                          {item.type === 'RichText' && item.props?.content && (
                            <div>
                              <strong>Rendered HTML:</strong>
                              <div 
                                style={{ 
                                  border: '1px solid #ddd', 
                                  padding: '10px', 
                                  marginTop: '5px',
                                  backgroundColor: 'white'
                                }}
                                dangerouslySetInnerHTML={{ __html: item.props.content }}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                      
                      <h3>Zones:</h3>
                      <pre style={{ fontSize: '12px', backgroundColor: '#f0f0f0', padding: '10px' }}>
                        {JSON.stringify(finalPuckData.zones, null, 2)}
                      </pre>
                    </div>
                  );
                }
                return (
                  <Render
                    key={`${lessonSlug}-${sectionSlug}-${subSectionSlug}-${Date.now()}`}
                    config={puckConfig}
                    data={finalPuckData}
                  />
                );
              } catch (error) {
                console.error('Error rendering Puck:', error);
                console.error('Error stack:', error.stack);
                return (
                  <div style={{ padding: '20px', textAlign: 'center' }}>
                    <div>Error rendering content</div>
                    <div style={{ fontSize: '14px', color: '#666' }}>
                      {error.message}
                    </div>
                    <pre style={{ fontSize: '12px', color: '#666', textAlign: 'left', maxHeight: '300px', overflow: 'auto' }}>
                      {JSON.stringify(data, null, 2)}
                    </pre>
                  </div>
                );
              }
            })()}
          </div>
        )}
      </CourseLayout>

      {showLeadForm && (
        <LeadForm 
          course={{ title: '' }}
          onClose={() => setShowLeadForm(false)}
          onSuccess={() => setShowLeadForm(false)}
        />
      )}
    </IndexController>
  );
}

// Add navbar SSR
export const getServerSideProps = withNavbarSSR();