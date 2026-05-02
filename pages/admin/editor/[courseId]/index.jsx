
// "use client";

// import { Puck } from "@measured/puck";
// import "@measured/puck/puck.css";
// import { puckConfig } from "../../../../src/lms/puckConfig";
// import { useEffect, useMemo, useState, useContext } from "react";
// import { useRouter } from "next/router";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { UserContext } from "@/context/userContext";
// import AdminLoader from "@/src/account/common/AdminLoader";
// import SignOut from "@/src/account/common/SignOut";

// export default function CourseEditor() {
//   const router = useRouter();
//   const { courseId } = router.query;
//   const { authenticated, loading: userLoading, isAdmin } = useContext(UserContext);

//   const [puckData, setPuckData] = useState({ content: [] });
//   const [sidebar, setSidebar] = useState([]);

//   // slugify only used on new items
//   const slugify = useMemo(
//     () => (text = "") =>
//       text
//         .toString()
//         .trim()
//         .toLowerCase()
//         .replace(/[^a-z0-9\s-]/g, "")
//         .replace(/\s+/g, "-")
//         .replace(/-+/g, "-"),
//     []
//   );

//   useEffect(() => {
//     if (!courseId) return;

//     const fetchData = async () => {
//       try {
//         const res = await fetch(`/api/lms/content?courseId=${courseId}`);
//         const parsed = await res.json();

//         if (parsed && !parsed.error) {
//           setPuckData(parsed.puckData || { root: {}, content: [] });
//           setSidebar(
//             (parsed.sidebar || []).map((item) => ({
//               ...item,
//               sections: item.sections || [],
//               // Preserve oldSlug initially same as current slug
//               oldSlug: item.slug,
//               sections: (item.sections || []).map((section) => ({
//                 ...section,
//                 oldSlug: section.slug,
//               })),
//             }))
//           );
//         }
//       } catch (error) {
//         console.error("Failed to fetch course data:", error);
//       }
//     };

//     fetchData();
//   }, [courseId]);

//   if (userLoading) return <AdminLoader />;
//   if (!authenticated || !isAdmin) return <SignOut />;
//   if (!courseId) return <p>Loading editor...</p>;

//   /* ---------- SIDEBAR HANDLERS ---------- */

//   const addSidebarItem = () => {
//     setSidebar([
//       ...sidebar,
//       {
//         title: "New Lesson",
//         slug: slugify(`lesson-${sidebar.length + 1}`),
//         oldSlug: null, // new item has no oldSlug
//         sections: [],
//       },
//     ]);
//   };

//   const addSection = (lessonIndex) => {
//     const updated = [...sidebar];
//     updated[lessonIndex].sections.push({
//       title: "New Section",
//       slug: slugify(`section-${updated[lessonIndex].sections.length + 1}`),
//       oldSlug: null, // new section no oldSlug
//     });
//     setSidebar(updated);
//   };

//   // Update title or slug independently for lessons, track oldSlug if slug changed
//   const updateSidebarItem = (index, field, value) => {
//     setSidebar((prev) => {
//       const updated = [...prev];
//       const item = { ...updated[index] };

//       if (field === "title") {
//         item.title = value;
//       } else if (field === "slug") {
//         // Only set oldSlug if slug changed from initial value and oldSlug is not set yet
//         if (!item.oldSlug) {
//           item.oldSlug = item.slug;
//         }
//         item.slug = value;
//       }

//       updated[index] = item;
//       return updated;
//     });
//   };

//   // Update title or slug independently for sections, track oldSlug if slug changed
//   const updateSection = (lessonIndex, sectionIndex, field, value) => {
//     setSidebar((prev) => {
//       const updated = [...prev];
//       const section = { ...updated[lessonIndex].sections[sectionIndex] };

//       if (field === "title") {
//         section.title = value;
//       } else if (field === "slug") {
//         if (!section.oldSlug) {
//           section.oldSlug = section.slug;
//         }
//         section.slug = value;
//       }

//       updated[lessonIndex].sections[sectionIndex] = section;
//       return updated;
//     });
//   };

//   const removeSection = async (lessonIndex, sectionIndex) => {
//     const lesson = sidebar[lessonIndex];
//     const section = lesson.sections[sectionIndex];

//     if (!lesson?.slug || !section?.slug) return;

//     const confirmDelete = confirm(
//       `Are you sure you want to delete section "${section.title}"?`
//     );
//     if (!confirmDelete) return;

//     try {
//       await fetch(
//         `/api/lms/content?courseId=${courseId}&lessonSlug=${lesson.slug}&sectionSlug=${section.slug}`,
//         { method: "DELETE" }
//       );

//       setSidebar((prev) => {
//         const updated = [...prev];
//         updated[lessonIndex] = {
//           ...updated[lessonIndex],
//           sections: updated[lessonIndex].sections.filter(
//             (_, i) => i !== sectionIndex
//           ),
//         };
//         return updated;
//       });
//     } catch (error) {
//       console.error("Failed to remove section:", error);
//       alert("Failed to remove section");
//     }
//   };

//   const removeSidebarItem = async (index) => {
//     const lesson = sidebar[index];
//     if (!lesson?.slug) return;

//     const confirmDelete = confirm(
//       `Are you sure you want to delete "${lesson.title}"?`
//     );
//     if (!confirmDelete) return;

//     try {
//       const res = await fetch(
//         `/api/lms/content?courseId=${courseId}&lessonSlug=${lesson.slug}`,
//         { method: "DELETE" }
//       );

//       const result = await res.json();

//       if (!res.ok) {
//         alert(result.error || "Failed to delete lesson");
//         return;
//       }

//       setSidebar((prev) => prev.filter((_, i) => i !== index));
//     } catch (error) {
//       console.error("Delete error:", error);
//       alert("Something went wrong while deleting");
//     }
//   };

//   /* ---------- SAVE ---------- */

//   const handlePublish = async (newData) => {
//     try {
//       const courseTitle = sidebar.length > 0 ? sidebar[0].title : courseId;

//       // Include oldSlug in payload to preserve slugs when changed
//       const payload = {
//         courseId,
//         title: courseTitle,
//         sidebar: sidebar.map((item, i) => ({
//           title: item.title || `Section ${i + 1}`,
//           slug: item.slug,
//           oldSlug: item.oldSlug || null,
//           sections: (item.sections || []).map((s) => ({
//             type: s.type,
//             title: s.title,
//             slug: s.slug,
//             oldSlug: s.oldSlug || null,
//           })),
//         })),
//         puckData: newData,
//       };

//       const res = await fetch("/api/lms/content", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (res.ok) {
//         alert("Course page saved successfully to MongoDB");
//         // Reset oldSlug to current slug after successful save
//         setSidebar((prev) =>
//           prev.map((lesson) => ({
//             ...lesson,
//             oldSlug: lesson.slug,
//             sections: (lesson.sections || []).map((section) => ({
//               ...section,
//               oldSlug: section.slug,
//             })),
//           }))
//         );
//       } else {
//         const err = await res.json();
//         alert(`Error: ${err.error}`);
//       }
//     } catch (error) {
//       console.error("Save error:", error);
//       alert("Failed to save course data");
//     }
//   };

//   return (
//     <div style={{ display: "flex", height: "100vh" }}>
//       {/* ================= SIDEBAR EDITOR ================= */}
//       <div
//         style={{
//           width: "320px",
//           borderRight: "1px solid #eee",
//           padding: "16px",
//           overflowY: "auto",
//           background: "#fafafa",
//         }}
//       >
//         <h3>📌 Sidebar Menu</h3>

//         {sidebar.map((item, i) => (
//           <div
//             key={i}
//             style={{
//               background: "#fff",
//               padding: "10px",
//               borderRadius: "8px",
//               marginBottom: "10px",
//               boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
//             }}
//           >
//             {/* Title input */}
//             <input
//               placeholder="Title"
//               value={item.title}
//               onChange={(e) => updateSidebarItem(i, "title", e.target.value)}
//               style={{ width: "100%", marginBottom: "6px" }}
//             />

//             {/* Slug input */}
//             <input
//               placeholder="Slug"
//               value={item.slug}
//               onChange={(e) => updateSidebarItem(i, "slug", e.target.value)}
//               style={{ width: "100%", marginBottom: "6px" }}
//             />

//             <div className="flex gap-2 items-center mb-2">
//               <span className="text-[10px] text-zinc-500 truncate flex-1">
//                 Slug: <span className="text-red-600 font-mono">/{item.slug}</span>
//               </span>
//               <Link href={`/admin/editor/${courseId}/${item.slug}`} target="_blank">
//                 <Button variant="outline" size="sm" className="h-6 text-[10px] px-2">
//                   Edit Lesson Content
//                 </Button>
//               </Link>
//             </div>

//             <div
//               style={{
//                 marginTop: "10px",
//                 borderTop: "1px solid #eee",
//                 paddingTop: "8px",
//                 display: "grid",
//                 gap: "6px",
//               }}
//             >
//               <div className="mt-2">
//                 <h4 className="text-xs font-semibold mb-1">Sections</h4>

//                 {item.sections.map((section, sIdx) => (
//                   <div key={sIdx} className="mb-2 border p-2 rounded relative">
//                     {/* Section Title input */}
//                     <input
//                       placeholder="Section title"
//                       value={section.title}
//                       onChange={(e) => updateSection(i, sIdx, "title", e.target.value)}
//                       className="w-full mb-1"
//                     />

//                     {/* Section Slug input */}
//                     <input
//                       placeholder="Section slug"
//                       value={section.slug}
//                       onChange={(e) => updateSection(i, sIdx, "slug", e.target.value)}
//                       className="w-full mb-1"
//                     />

//                     <div className="text-[10px] text-zinc-500">
//                       Slug: <span className="text-red-600">/{section.slug}</span>
//                     </div>

//                     <Link
//                       href={`/admin/editor/${courseId}/${item.slug}/${section.slug}`}
//                       target="_blank"
//                     >
//                       <Button variant="outline" size="sm" className="h-6 text-[10px] w-full mt-1">
//                         Edit Section Content
//                       </Button>
//                     </Link>
//                     <button
//                       onClick={() => removeSection(i, sIdx)}
//                       className="text-red-600 text-[10px] mt-1 w-full"
//                     >
//                       ❌ Remove Section
//                     </button>
//                   </div>
//                 ))}

//                 <button onClick={() => addSection(i)} className="text-blue-600 text-xs">
//                   ➕ Add Section
//                 </button>
//               </div>
//             </div>

//             <button
//               onClick={() => removeSidebarItem(i)}
//               style={{
//                 marginTop: "6px",
//                 color: "red",
//                 border: "none",
//                 background: "transparent",
//                 cursor: "pointer",
//               }}
//             >
//               ❌ Remove
//             </button>
//           </div>
//         ))}

//         <button
//           onClick={addSidebarItem}
//           style={{
//             width: "100%",
//             padding: "10px",
//             borderRadius: "8px",
//             background: "#000",
//             color: "#fff",
//             border: "none",
//             cursor: "pointer",
//           }}
//         >
//           ➕ Add Sidebar Item
//         </button>
//       </div>

//       {/* ================= PUCK EDITOR ================= */}
//       <div style={{ flex: 1 }}>
//         <Puck config={puckConfig} data={puckData} onPublish={handlePublish} />
//       </div>
//     </div>
//   );
// }

// "use client";

// import { Puck } from "@measured/puck";
// import "@measured/puck/puck.css";
// import { puckConfig } from "../../../../src/lms/puckConfig";
// import { useEffect, useMemo, useState, useContext } from "react";
// import { useRouter } from "next/router";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { UserContext } from "@/context/userContext";
// import AdminLoader from "@/src/account/common/AdminLoader";
// import SignOut from "@/src/account/common/SignOut";

// export default function CourseEditor() {
//   const router = useRouter();
//   const { courseId } = router.query;
//   const { authenticated, loading: userLoading, isAdmin } = useContext(UserContext);

//   const [puckData, setPuckData] = useState({ content: [] });
//   const [sidebar, setSidebar] = useState([]);

//   const slugify = useMemo(
//     () => (text = "") =>
//       text
//         .toString()
//         .trim()
//         .toLowerCase()
//         .replace(/[^a-z0-9\s-]/g, "")
//         .replace(/\s+/g, "-")
//         .replace(/-+/g, "-"),
//     []
//   );

//   useEffect(() => {
//     if (!courseId) return;

//     const fetchData = async () => {
//       const res = await fetch(`/api/lms/content?courseId=${courseId}`);
//       const parsed = await res.json();

//       if (parsed && !parsed.error) {
//         setPuckData(parsed.puckData || { root: {}, content: [] });
//         setSidebar(
//           (parsed.sidebar || []).map((lesson) => ({
//             ...lesson,
//             oldSlug: lesson.slug,
//             sections: (lesson.sections || []).map((section) => ({
//               ...section,
//               oldSlug: section.slug,
//               subSections: (section.subSections || []).map((ss) => ({
//                 ...ss,
//                 oldSlug: ss.slug,
//               })),
//             })),
//           }))
//         );
//       }
//     };

//     fetchData();
//   }, [courseId]);

//   if (userLoading) return <AdminLoader />;
//   if (!authenticated || !isAdmin) return <SignOut />;
//   if (!courseId) return <p>Loading editor...</p>;

//   /* ---------- ADDERS ---------- */

//   const addSidebarItem = () => {
//     setSidebar([
//       ...sidebar,
//       {
//         title: "New Lesson",
//         slug: slugify(`lesson-${sidebar.length + 1}`),
//         oldSlug: null,
//         sections: [],
//       },
//     ]);
//   };

//   const addSection = (lessonIndex) => {
//     const updated = [...sidebar];
//     updated[lessonIndex].sections.push({
//       title: "New Section",
//       slug: slugify(`section-${updated[lessonIndex].sections.length + 1}`),
//       oldSlug: null,
//       subSections: [],
//     });
//     setSidebar(updated);
//   };

//   const addSubSection = (lessonIndex, sectionIndex) => {
//     const updated = [...sidebar];
//     updated[lessonIndex].sections[sectionIndex].subSections.push({
//       title: "New Sub Section",
//       slug: slugify(
//         `sub-${updated[lessonIndex].sections[sectionIndex].subSections.length + 1}`
//       ),
//       oldSlug: null,
//     });
//     setSidebar(updated);
//   };

//   /* ---------- UPDATERS ---------- */

//   const updateSidebarItem = (index, field, value) => {
//     setSidebar((prev) => {
//       const updated = [...prev];
//       const item = { ...updated[index] };

//       if (field === "title") item.title = value;
//       if (field === "slug") {
//         if (!item.oldSlug) item.oldSlug = item.slug;
//         item.slug = value;
//       }

//       updated[index] = item;
//       return updated;
//     });
//   };

//   const updateSection = (l, s, field, value) => {
//     setSidebar((prev) => {
//       const updated = [...prev];
//       const section = { ...updated[l].sections[s] };

//       if (field === "title") section.title = value;
//       if (field === "slug") {
//         if (!section.oldSlug) section.oldSlug = section.slug;
//         section.slug = value;
//       }

//       updated[l].sections[s] = section;
//       return updated;
//     });
//   };

//   const updateSubSection = (l, s, ss, field, value) => {
//     setSidebar((prev) => {
//       const updated = [...prev];
//       const sub = {
//         ...updated[l].sections[s].subSections[ss],
//       };

//       if (field === "title") sub.title = value;
//       if (field === "slug") {
//         if (!sub.oldSlug) sub.oldSlug = sub.slug;
//         sub.slug = value;
//       }

//       updated[l].sections[s].subSections[ss] = sub;
//       return updated;
//     });
//   };

//   /* ---------- SAVE ---------- */

//   const handlePublish = async (newData) => {
//     const payload = {
//       courseId,
//       sidebar: sidebar.map((lesson) => ({
//         title: lesson.title,
//         slug: lesson.slug,
//         oldSlug: lesson.oldSlug,
//         sections: lesson.sections.map((section) => ({
//           title: section.title,
//           slug: section.slug,
//           oldSlug: section.oldSlug,
//           subSections: (section.subSections || []).map((ss) => ({
//             title: ss.title,
//             slug: ss.slug,
//             oldSlug: ss.oldSlug,
//           })),
//         })),
//       })),
//       puckData: newData,
//     };

//     await fetch("/api/lms/content", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });

//     alert("Saved successfully");
//   };

//   return (
//     <div style={{ display: "flex", height: "100vh" }}>
//       {/* SIDEBAR */}
//       <div style={{ width: 340, padding: 16, overflowY: "auto" }}>
//         {sidebar.map((lesson, lIdx) => (
//           <div key={lIdx} className="mb-4 p-3 border rounded">
//             <input
//               value={lesson.title}
//               onChange={(e) =>
//                 updateSidebarItem(lIdx, "title", e.target.value)
//               }
//             />
//             <input
//               value={lesson.slug}
//               onChange={(e) =>
//                 updateSidebarItem(lIdx, "slug", e.target.value)
//               }
//             />

//             <Link href={`/admin/editor/${courseId}/${lesson.slug}`} target="_blank">
//               <Button size="sm" className="w-full mt-1">
//                 Edit Lesson
//               </Button>
//             </Link>

//             {lesson.sections.map((section, sIdx) => (
//               <div key={sIdx} className="ml-2 mt-2 p-2 border rounded">
//                 <input
//                   value={section.title}
//                   onChange={(e) =>
//                     updateSection(lIdx, sIdx, "title", e.target.value)
//                   }
//                 />
//                 <input
//                   value={section.slug}
//                   onChange={(e) =>
//                     updateSection(lIdx, sIdx, "slug", e.target.value)
//                   }
//                 />

//                 <Link
//                   href={`/admin/editor/${courseId}/${lesson.slug}/${section.slug}`}
//                   target="_blank"
//                 >
//                   <Button size="sm" className="w-full mt-1">
//                     Edit Section
//                   </Button>
//                 </Link>

//                 {section.subSections?.map((ss, ssIdx) => (
//                   <div key={ssIdx} className="ml-2 mt-2">
//                     <input
//                       value={ss.title}
//                       onChange={(e) =>
//                         updateSubSection(lIdx, sIdx, ssIdx, "title", e.target.value)
//                       }
//                     />
//                     <input
//                       value={ss.slug}
//                       onChange={(e) =>
//                         updateSubSection(lIdx, sIdx, ssIdx, "slug", e.target.value)
//                       }
//                     />

//                     <Link
//                       href={`/admin/editor/${courseId}/${lesson.slug}/${section.slug}/${ss.slug}`}
//                       target="_blank"
//                     >
//                       <Button size="sm" variant="outline" className="w-full mt-1">
//                         Edit Sub-Section
//                       </Button>
//                     </Link>
//                   </div>
//                 ))}

//                 <button
//                   onClick={() => addSubSection(lIdx, sIdx)}
//                   className="text-xs text-blue-600 mt-1"
//                 >
//                   ➕ Add Sub-Section
//                 </button>
//               </div>
//             ))}

//             <button
//               onClick={() => addSection(lIdx)}
//               className="text-xs text-blue-600 mt-2"
//             >
//               ➕ Add Section
//             </button>
//           </div>
//         ))}

//         <button onClick={addSidebarItem}>➕ Add Lesson</button>
//       </div>

//       {/* PUCK */}
//       <div style={{ flex: 1 }}>
//         <Puck config={puckConfig} data={puckData} onPublish={handlePublish} />
//       </div>
//     </div>
//   );
// }


"use client";

import { Puck } from "@measured/puck";
import "@measured/puck/puck.css";
import { puckConfig } from "../../../../src/lms/puckConfig";
import { useEffect, useMemo, useState, useContext } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserContext } from "@/context/userContext";
import AdminLoader from "@/src/account/common/AdminLoader";
import SignOut from "@/src/account/common/SignOut";

export default function CourseEditor() {
  const router = useRouter();
  const { courseId } = router.query;
  const { authenticated, loading: userLoading, isAdmin } = useContext(UserContext);

  const [puckData, setPuckData] = useState({ content: [] });
  const [sidebar, setSidebar] = useState([]);
  const [isCreating, setIsCreating] = useState(false); // ⭐ FIX: Add loading state
  const [updateTimeout, setUpdateTimeout] = useState(null); // ⭐ FIX: Add debouncing
  const [pendingLessons, setPendingLessons] = useState(new Set()); // ⭐ NEW: Track lessons not yet saved to DB
  const [pendingSections, setPendingSections] = useState(new Set()); // ⭐ NEW: Track sections not yet saved to DB
  const [pendingSubSections, setPendingSubSections] = useState(new Set()); // ⭐ NEW: Track sub-sections not yet saved to DB
  const [draggedItem, setDraggedItem] = useState(null); // ⭐ NEW: Track dragged item for reordering

  // ⭐ FIX: Helper function to create payload without any puckData to preserve existing content
  const createSidebarPayload = (sidebarData) => ({
    courseId,
    structureOnly: true, // ⭐ NEW: Flag to indicate this is structure-only update
    sidebar: sidebarData.map((lesson) => ({
      id: lesson.id, // ⭐ NEW: Include unique ID
      title: lesson.title,
      slug: lesson.slug,
      oldSlug: lesson.oldSlug,
      // ⭐ CRITICAL: Don't send puckData at all - let API preserve existing content
      sections: lesson.sections.map((section) => ({
        id: section.id, // ⭐ NEW: Include unique ID
        title: section.title,
        slug: section.slug,
        oldSlug: section.oldSlug,
        // ⭐ CRITICAL: Don't send puckData at all - let API preserve existing content
        subSections: (section.subSections || []).map((ss) => ({
          id: ss.id, // ⭐ NEW: Include unique ID
          title: ss.title,
          slug: ss.slug,
          oldSlug: ss.oldSlug,
          // ⭐ CRITICAL: Don't send puckData at all - let API preserve existing content
        })),
      })),
    })),
    // ⭐ CRITICAL: Don't send puckData at all from main editor
  });

  // ⭐ NEW: Generate unique ID
  const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // ⭐ NEW: Reordering functions
  const moveLesson = async (fromIndex, toIndex) => {
    const updated = [...sidebar];
    const [movedItem] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, movedItem);
    setSidebar(updated);
    
    // ⭐ FIX: Always save immediately, regardless of pending status
    try {
      const payload = createSidebarPayload(updated);
      const res = await fetch("/api/lms/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      if (res.ok) {
        console.log('✅ Lesson order saved successfully');
        alert('Lesson order updated successfully');
      } else {
        throw new Error('Failed to save order');
      }
    } catch (error) {
      console.error("Save order error:", error);
      alert('Failed to save lesson order. Please try again.');
      // Revert the change
      const reverted = [...updated];
      const [revertedItem] = reverted.splice(toIndex, 1);
      reverted.splice(fromIndex, 0, revertedItem);
      setSidebar(reverted);
    }
  };

  const moveSection = async (lessonIndex, fromIndex, toIndex) => {
    const updated = [...sidebar];
    const [movedItem] = updated[lessonIndex].sections.splice(fromIndex, 1);
    updated[lessonIndex].sections.splice(toIndex, 0, movedItem);
    setSidebar(updated);
    
    // ⭐ FIX: Always save immediately
    try {
      const payload = createSidebarPayload(updated);
      const res = await fetch("/api/lms/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      if (res.ok) {
        console.log('✅ Section order saved successfully');
        alert('Section order updated successfully');
      } else {
        throw new Error('Failed to save order');
      }
    } catch (error) {
      console.error("Save order error:", error);
      alert('Failed to save section order. Please try again.');
      // Revert the change
      const reverted = [...updated];
      const [revertedItem] = reverted[lessonIndex].sections.splice(toIndex, 1);
      reverted[lessonIndex].sections.splice(fromIndex, 0, revertedItem);
      setSidebar(reverted);
    }
  };

  const moveSubSection = async (lessonIndex, sectionIndex, fromIndex, toIndex) => {
    const updated = [...sidebar];
    const [movedItem] = updated[lessonIndex].sections[sectionIndex].subSections.splice(fromIndex, 1);
    updated[lessonIndex].sections[sectionIndex].subSections.splice(toIndex, 0, movedItem);
    setSidebar(updated);
    
    // ⭐ FIX: Always save immediately
    try {
      const payload = createSidebarPayload(updated);
      const res = await fetch("/api/lms/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      if (res.ok) {
        console.log('✅ Sub-section order saved successfully');
        alert('Sub-section order updated successfully');
      } else {
        throw new Error('Failed to save order');
      }
    } catch (error) {
      console.error("Save order error:", error);
      alert('Failed to save sub-section order. Please try again.');
      // Revert the change
      const reverted = [...updated];
      const [revertedItem] = reverted[lessonIndex].sections[sectionIndex].subSections.splice(toIndex, 1);
      reverted[lessonIndex].sections[sectionIndex].subSections.splice(fromIndex, 0, revertedItem);
      setSidebar(reverted);
    }
  };

  const slugify = useMemo(
    () => (text = "") =>
      text
        .toString()
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-"),
    []
  );

  useEffect(() => {
    if (!courseId) return;

    const fetchData = async () => {
      // ⭐ Use lite=true to fetch only sidebar structure without puckData
      // Add timestamp to bypass cache
      const timestamp = Date.now();
      const res = await fetch(`/api/lms/content?courseId=${courseId}&lite=true&t=${timestamp}`, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      const parsed = await res.json();

      if (parsed && !parsed.error) {
        // Main course page has no puckData, only sidebar structure
        setPuckData({ root: {}, content: [] });
        setSidebar(
          (parsed.sidebar || []).map((lesson) => ({
            ...lesson,
            id: lesson.id || generateId(), // ⭐ NEW: Ensure every lesson has an ID
            oldSlug: lesson.slug,
            isPending: false, // ⭐ NEW: Existing lessons are already saved
            sections: (lesson.sections || []).map((section) => ({
              ...section,
              id: section.id || generateId(), // ⭐ NEW: Ensure every section has an ID
              oldSlug: section.slug,
              isPending: false, // ⭐ NEW: Existing sections are already saved
              subSections: (section.subSections || []).map((ss) => ({
                ...ss,
                id: ss.id || generateId(), // ⭐ NEW: Ensure every subsection has an ID
                oldSlug: ss.slug,
                isPending: false, // ⭐ NEW: Existing sub-sections are already saved
              })),
            })),
          }))
        );
      }
    };

    fetchData();
  }, [courseId]);

  if (userLoading) return <AdminLoader />;
  if (!authenticated || !isAdmin) return <SignOut />;
  if (!courseId) return <p>Loading editor...</p>;

  /* ---------- ADDERS ---------- */
  const addSidebarItem = () => {
    // ⭐ NEW: Only create in UI, don't save to DB yet
    const newId = generateId();
    const newLesson = {
      id: newId, // ⭐ NEW: Unique ID
      title: "New Lesson",
      slug: slugify(`lesson-${sidebar.length + 1}`),
      oldSlug: null,
      sections: [],
      isPending: true, // ⭐ NEW: Mark as not yet saved to DB
    };

    setSidebar([...sidebar, newLesson]);
    setPendingLessons(prev => new Set([...prev, newId])); // ⭐ NEW: Track pending lesson
    console.log(`✅ Lesson "${newLesson.title}" created in UI (ID: ${newId})`);
  };

  // ⭐ NEW: Function to save lesson to database when "Edit Lesson" is clicked
  const saveLessonToDatabase = async (lessonIndex) => {
    const lesson = sidebar[lessonIndex];
    
    if (!lesson.isPending) {
      // Already saved, just redirect
      return `/admin/editor/${courseId}/${lesson.slug}`;
    }

    setIsCreating(true);

    try {
      // ⭐ FIX: Send ALL sidebar items to preserve order
      const payload = createSidebarPayload(sidebar);

      const res = await fetch("/api/lms/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        // Mark lesson as saved
        setSidebar(prev => prev.map((l, i) => 
          i === lessonIndex ? { ...l, isPending: false } : l
        ));
        setPendingLessons(prev => {
          const newSet = new Set(prev);
          newSet.delete(lesson.id);
          return newSet;
        });
        
        console.log(`✅ Lesson "${lesson.title}" saved to database (ID: ${lesson.id})`);
        return `/admin/editor/${courseId}/${lesson.slug}`;
      } else {
        const error = await res.json();
        alert("Failed to save lesson: " + (error.error || "Unknown error"));
        return null;
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Error saving lesson to database");
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  const addSection = async (lessonIndex) => {
    const newId = generateId();
    const newSection = {
      id: newId, // ⭐ NEW: Unique ID
      title: "New Section",
      slug: slugify(`section-${sidebar[lessonIndex].sections.length + 1}`),
      oldSlug: null,
      subSections: [],
      isPending: true, // ⭐ NEW: Mark as not yet saved to DB
    };

    const updated = [...sidebar];
    updated[lessonIndex].sections.push(newSection);
    setSidebar(updated);

    // ⭐ NEW: Track pending section
    setPendingSections(prev => new Set([...prev, newId]));
    console.log(`✅ Section "${newSection.title}" created in UI (ID: ${newId}) - will save when Edit Section is clicked`);
  };

  // ⭐ NEW: Function to save section to database when "Edit Section" is clicked
  const saveSectionToDatabase = async (lessonIndex, sectionIndex) => {
    const lesson = sidebar[lessonIndex];
    const section = lesson.sections[sectionIndex];
    
    if (!section.isPending) {
      // Already saved, just redirect
      return `/admin/editor/${courseId}/${lesson.slug}/${section.slug}`;
    }

    // Check if parent lesson is saved first
    if (lesson.isPending) {
      alert("Please save the lesson first before editing sections");
      return null;
    }

    setIsCreating(true);

    try {
      // ⭐ FIX: Send ALL sidebar items to preserve order
      const payload = createSidebarPayload(sidebar);

      const res = await fetch("/api/lms/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        // Mark section as saved
        setSidebar(prev => prev.map((l, lIdx) => 
          lIdx === lessonIndex ? {
            ...l,
            sections: l.sections.map((s, sIdx) => 
              sIdx === sectionIndex ? { ...s, isPending: false } : s
            )
          } : l
        ));
        setPendingSections(prev => {
          const newSet = new Set(prev);
          newSet.delete(section.id);
          return newSet;
        });
        
        console.log(`✅ Section "${section.title}" saved to database (ID: ${section.id})`);
        return `/admin/editor/${courseId}/${lesson.slug}/${section.slug}`;
      } else {
        const error = await res.json();
        alert("Failed to save section: " + (error.error || "Unknown error"));
        return null;
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Error saving section to database");
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  const addSubSection = async (lessonIndex, sectionIndex) => {
    const newId = generateId();
    const newSubSection = {
      id: newId, // ⭐ NEW: Unique ID
      title: "New Sub Section",
      slug: slugify(
        `sub-${sidebar[lessonIndex].sections[sectionIndex].subSections.length + 1}`
      ),
      oldSlug: null,
      isPending: true, // ⭐ NEW: Mark as not yet saved to DB
    };

    const updated = [...sidebar];
    updated[lessonIndex].sections[sectionIndex].subSections.push(newSubSection);
    setSidebar(updated);

    // ⭐ NEW: Track pending sub-section
    setPendingSubSections(prev => new Set([...prev, newId]));
    console.log(`✅ Sub-section "${newSubSection.title}" created in UI (ID: ${newId}) - will save when Edit Sub-Section is clicked`);
  };

  // ⭐ NEW: Function to save sub-section to database when "Edit Sub-Section" is clicked
  const saveSubSectionToDatabase = async (lessonIndex, sectionIndex, subSectionIndex) => {
    const lesson = sidebar[lessonIndex];
    const section = lesson.sections[sectionIndex];
    const subSection = section.subSections[subSectionIndex];
    
    if (!subSection.isPending) {
      // Already saved, just redirect
      return `/admin/editor/${courseId}/${lesson.slug}/${section.slug}/${subSection.slug}`;
    }

    // Check if parent lesson and section are saved first
    if (lesson.isPending) {
      alert("Please save the lesson first before editing sub-sections");
      return null;
    }
    if (section.isPending) {
      alert("Please save the section first before editing sub-sections");
      return null;
    }

    setIsCreating(true);

    try {
      // ⭐ FIX: Send ALL sidebar items to preserve order
      const payload = createSidebarPayload(sidebar);

      const res = await fetch("/api/lms/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        // Mark sub-section as saved
        setSidebar(prev => prev.map((l, lIdx) => 
          lIdx === lessonIndex ? {
            ...l,
            sections: l.sections.map((s, sIdx) => 
              sIdx === sectionIndex ? {
                ...s,
                subSections: s.subSections.map((ss, ssIdx) => 
                  ssIdx === subSectionIndex ? { ...ss, isPending: false } : ss
                )
              } : s
            )
          } : l
        ));
        setPendingSubSections(prev => {
          const newSet = new Set(prev);
          newSet.delete(subSection.id);
          return newSet;
        });
        
        console.log(`✅ Sub-section "${subSection.title}" saved to database (ID: ${subSection.id})`);
        return `/admin/editor/${courseId}/${lesson.slug}/${section.slug}/${subSection.slug}`;
      } else {
        const error = await res.json();
        alert("Failed to save sub-section: " + (error.error || "Unknown error"));
        return null;
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Error saving sub-section to database");
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  /* ---------- UPDATERS ---------- */
  const updateSidebarItem = async (index, field, value) => {
    const updated = [...sidebar];
    const item = { ...updated[index] };

    if (field === "title") item.title = value;
    if (field === "slug") {
      if (!item.oldSlug) item.oldSlug = item.slug;
      item.slug = value;
    }

    updated[index] = item;
    setSidebar(updated);

    // ⭐ NEW: Only auto-save if lesson is already saved to DB
    if (!item.isPending) {
      // ⭐ FIX: Debounce auto-save to prevent rapid API calls
      if (updateTimeout) {
        clearTimeout(updateTimeout);
      }

      const newTimeout = setTimeout(async () => {
        try {
          const payload = createSidebarPayload(updated);

          await fetch("/api/lms/content", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          console.log(`✅ Auto-saved lesson update (ID: ${item.id})`);
        } catch (error) {
          console.error("Auto-save error:", error);
        }
      }, 1000); // Wait 1 second after last change

      setUpdateTimeout(newTimeout);
    } else {
      console.log(`✅ Updated lesson "${item.title}" in UI (ID: ${item.id}) - will save when lesson is saved`);
    }
  };

  const updateSection = async (l, s, field, value) => {
    const updated = [...sidebar];
    const section = { ...updated[l].sections[s] };

    if (field === "title") section.title = value;
    if (field === "slug") {
      if (!section.oldSlug) section.oldSlug = section.slug;
      section.slug = value;
    }

    updated[l].sections[s] = section;
    setSidebar(updated);

    // ⭐ NEW: Only auto-save if parent lesson and section are already saved to DB
    if (!sidebar[l].isPending && !section.isPending) {
      // ⭐ FIX: Debounce auto-save
      if (updateTimeout) {
        clearTimeout(updateTimeout);
      }

      const newTimeout = setTimeout(async () => {
        try {
          const payload = createSidebarPayload(updated);

          await fetch("/api/lms/content", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          console.log(`✅ Auto-saved section update (ID: ${section.id})`);
        } catch (error) {
          console.error("Auto-save error:", error);
        }
      }, 1000);

      setUpdateTimeout(newTimeout);
    } else {
      console.log(`✅ Updated section "${section.title}" in UI (ID: ${section.id}) - will save when section is saved`);
    }
  };

  const updateSubSection = async (l, s, ss, field, value) => {
    const updated = [...sidebar];
    const sub = {
      ...updated[l].sections[s].subSections[ss],
    };

    if (field === "title") sub.title = value;
    if (field === "slug") {
      if (!sub.oldSlug) sub.oldSlug = sub.slug;
      sub.slug = value;
    }

    updated[l].sections[s].subSections[ss] = sub;
    setSidebar(updated);

    // ⭐ NEW: Only auto-save if parent lesson, section, and sub-section are already saved to DB
    if (!sidebar[l].isPending && !sidebar[l].sections[s].isPending && !sub.isPending) {
      // ⭐ FIX: Debounce auto-save
      if (updateTimeout) {
        clearTimeout(updateTimeout);
      }

      const newTimeout = setTimeout(async () => {
        try {
          // ⭐ FIX: Use createSidebarPayload helper to preserve existing puckData
          const payload = createSidebarPayload(updated);

          await fetch("/api/lms/content", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          console.log(`✅ Auto-saved subsection update (ID: ${sub.id})`);
        } catch (error) {
          console.error("Auto-save error:", error);
        }
      }, 1000);

      setUpdateTimeout(newTimeout);
    } else {
      console.log(`✅ Updated subsection "${sub.title}" in UI (ID: ${sub.id}) - will save when subsection is saved`);
    }
  };

  /* ---------- DELETION ---------- */
const deleteLesson = async (lessonIndex) => {
  if (!confirm("Are you sure you want to delete this lesson?")) return;

  const lessonSlug = sidebar[lessonIndex].slug;

  // 🔥 DB delete
  await fetch(
    `/api/lms/content?courseId=${courseId}&lessonSlug=${lessonSlug}`,
    { method: "DELETE" }
  );

  // ⚡ UI update
  setSidebar((prev) => prev.filter((_, idx) => idx !== lessonIndex));
};


const deleteSection = async (lessonIndex, sectionIndex) => {
  if (!confirm("Are you sure you want to delete this section?")) return;

  const lessonSlug = sidebar[lessonIndex].slug;
  const sectionSlug = sidebar[lessonIndex].sections[sectionIndex].slug;

  await fetch(
    `/api/lms/content?courseId=${courseId}&lessonSlug=${lessonSlug}&sectionSlug=${sectionSlug}`,
    { method: "DELETE" }
  );

  setSidebar((prev) => {
    const updated = [...prev];
    updated[lessonIndex].sections =
      updated[lessonIndex].sections.filter((_, i) => i !== sectionIndex);
    return updated;
  });
};


 const deleteSubSection = async (lessonIndex, sectionIndex, subSectionIndex) => {
  if (!confirm("Are you sure you want to delete this sub-section?")) return;

  const lessonSlug = sidebar[lessonIndex].slug;
  const sectionSlug = sidebar[lessonIndex].sections[sectionIndex].slug;
  const subSectionSlug =
    sidebar[lessonIndex].sections[sectionIndex].subSections[subSectionIndex].slug;

  await fetch(
    `/api/lms/content?courseId=${courseId}&lessonSlug=${lessonSlug}&sectionSlug=${sectionSlug}&subSectionSlug=${subSectionSlug}`,
    { method: "DELETE" }
  );

  setSidebar((prev) => {
    const updated = [...prev];
    updated[lessonIndex].sections[sectionIndex].subSections =
      updated[lessonIndex].sections[sectionIndex].subSections.filter(
        (_, i) => i !== subSectionIndex
      );
    return updated;
  });
};


  /* ---------- SAVE ---------- */
  const handlePublish = async (newData) => {
    try {
      // ⭐ FIX: Save main course page puckData using content API with special flag
      const payload = {
        courseId,
        mainCoursePuckData: newData, // Special field for main course page
        // Don't send sidebar to avoid touching lesson structure
      };

      const res = await fetch("/api/lms/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        // ⭐ FIX: Clear cache and notify other tabs
        if (typeof window !== 'undefined') {
          localStorage.setItem('lms-last-update', Date.now().toString());
          localStorage.setItem('lms-sidebar-updated', JSON.stringify({
            courseId,
            timestamp: Date.now()
          }));
          setTimeout(() => {
            localStorage.removeItem('lms-sidebar-updated');
          }, 1000);
        }
        alert("Main course page saved successfully!");
      } else {
        const error = await res.json();
        alert("Failed to save: " + (error.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Error saving content");
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* SIDEBAR */}
      <div style={{ width: 340, padding: 16, overflowY: "auto" }}>
        {sidebar.map((lesson, lIdx) => (
          <div 
            key={lesson.id || lIdx} 
            className="mb-4 p-3 border rounded relative"
            draggable
            onDragStart={(e) => {
              setDraggedItem({ type: 'lesson', index: lIdx });
              e.dataTransfer.effectAllowed = 'move';
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = 'move';
            }}
            onDrop={(e) => {
              e.preventDefault();
              if (draggedItem && draggedItem.type === 'lesson') {
                moveLesson(draggedItem.index, lIdx);
                setDraggedItem(null);
              }
            }}
            style={{
              cursor: 'grab',
              backgroundColor: draggedItem?.type === 'lesson' && draggedItem?.index === lIdx ? '#f0f0f0' : '#fff'
            }}
          >
            {/* Drag handle and reorder controls */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-gray-400 cursor-grab">⋮⋮</span>
                <span className="text-xs text-gray-500">Lesson {lIdx + 1}</span>
                {lIdx > 0 && (
                  <button
                    onClick={() => moveLesson(lIdx, lIdx - 1)}
                    className="text-xs text-blue-600 hover:text-blue-800"
                    title="Move Up"
                  >
                    ↑
                  </button>
                )}
                {lIdx < sidebar.length - 1 && (
                  <button
                    onClick={() => moveLesson(lIdx, lIdx + 1)}
                    className="text-xs text-blue-600 hover:text-blue-800"
                    title="Move Down"
                  >
                    ↓
                  </button>
                )}
              </div>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => deleteLesson(lIdx)}
                className="h-6 text-[10px] px-2"
              >
                Delete Lesson
              </Button>
            </div>

            <input
              value={lesson.title}
              onChange={(e) => updateSidebarItem(lIdx, "title", e.target.value)}
              style={{ width: "100%", marginBottom: "6px" }}
              placeholder="Lesson Title"
            />
            <input
              value={lesson.slug}
              onChange={(e) => updateSidebarItem(lIdx, "slug", e.target.value)}
              style={{ width: "100%", marginBottom: "6px" }}
              placeholder="Lesson Slug"
            />

            <div className="mb-2">
              <div className="text-[10px] text-zinc-500 mb-1">
                Slug: <span className="text-red-600 font-mono">/{lesson.slug}</span>
                {lesson.isPending && <span className="text-orange-500 ml-1">(Not Saved)</span>}
                {lesson.id && <span className="text-blue-500 ml-1">ID: {lesson.id.slice(-6)}</span>}
              </div>
              <button
                onClick={async () => {
                  const url = await saveLessonToDatabase(lIdx);
                  if (url) {
                    window.open(url, '_blank');
                  }
                }}
                disabled={isCreating}
                className={`w-full mt-1 px-3 py-1 text-sm rounded ${
                  lesson.isPending 
                    ? 'bg-orange-500 text-white hover:bg-orange-600' 
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                } ${isCreating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {isCreating ? 'Saving...' : lesson.isPending ? 'Save & Edit Lesson' : 'Edit Lesson'}
              </button>
            </div>

            {lesson.sections.map((section, sIdx) => (
              <div 
                key={section.id || sIdx} 
                className="ml-2 mt-2 p-2 border rounded relative"
                draggable
                onDragStart={(e) => {
                  setDraggedItem({ type: 'section', lessonIndex: lIdx, index: sIdx });
                  e.dataTransfer.effectAllowed = 'move';
                  e.stopPropagation();
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = 'move';
                  e.stopPropagation();
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (draggedItem && draggedItem.type === 'section' && draggedItem.lessonIndex === lIdx) {
                    moveSection(lIdx, draggedItem.index, sIdx);
                    setDraggedItem(null);
                  }
                }}
                style={{
                  cursor: 'grab',
                  backgroundColor: draggedItem?.type === 'section' && draggedItem?.lessonIndex === lIdx && draggedItem?.index === sIdx ? '#f0f0f0' : '#fff'
                }}
              >
                {/* Section drag handle and reorder controls */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 cursor-grab text-xs">⋮⋮</span>
                    <span className="text-xs text-gray-500">Section {sIdx + 1}</span>
                    {sIdx > 0 && (
                      <button
                        onClick={() => moveSection(lIdx, sIdx, sIdx - 1)}
                        className="text-xs text-blue-600 hover:text-blue-800"
                        title="Move Up"
                      >
                        ↑
                      </button>
                    )}
                    {sIdx < lesson.sections.length - 1 && (
                      <button
                        onClick={() => moveSection(lIdx, sIdx, sIdx + 1)}
                        className="text-xs text-blue-600 hover:text-blue-800"
                        title="Move Down"
                      >
                        ↓
                      </button>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteSection(lIdx, sIdx)}
                    className="h-5 text-[9px] px-1"
                  >
                    Delete
                  </Button>
                </div>
                <input
                  value={section.title}
                  onChange={(e) => updateSection(lIdx, sIdx, "title", e.target.value)}
                  style={{ width: "100%", marginBottom: "4px" }}
                  placeholder="Section Title"
                />
                <input
                  value={section.slug}
                  onChange={(e) => updateSection(lIdx, sIdx, "slug", e.target.value)}
                  style={{ width: "100%", marginBottom: "4px" }}
                  placeholder="Section Slug"
                />
                
                <div className="text-[10px] text-zinc-500 mt-1">
                  Slug: <span className="text-red-600">/{section.slug}</span>
                  {section.isPending && <span className="text-orange-500 ml-1">(Not Saved)</span>}
                  {section.id && <span className="text-blue-500 ml-1">ID: {section.id.slice(-6)}</span>}
                </div>

                <button
                  onClick={async () => {
                    const url = await saveSectionToDatabase(lIdx, sIdx);
                    if (url) {
                      window.open(url, '_blank');
                    }
                  }}
                  disabled={isCreating}
                  className={`w-full mt-1 px-3 py-1 text-sm rounded ${
                    section.isPending 
                      ? 'bg-orange-500 text-white hover:bg-orange-600' 
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  } ${isCreating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  {isCreating ? 'Saving...' : section.isPending ? 'Save & Edit Section' : 'Edit Section'}
                </button>

                {section.subSections?.map((ss, ssIdx) => (
                  <div 
                    key={ss.id || ssIdx} 
                    className="ml-2 mt-2 relative"
                    draggable
                    onDragStart={(e) => {
                      setDraggedItem({ type: 'subsection', lessonIndex: lIdx, sectionIndex: sIdx, index: ssIdx });
                      e.dataTransfer.effectAllowed = 'move';
                      e.stopPropagation();
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.dataTransfer.dropEffect = 'move';
                      e.stopPropagation();
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (draggedItem && draggedItem.type === 'subsection' && 
                          draggedItem.lessonIndex === lIdx && draggedItem.sectionIndex === sIdx) {
                        moveSubSection(lIdx, sIdx, draggedItem.index, ssIdx);
                        setDraggedItem(null);
                      }
                    }}
                    style={{
                      cursor: 'grab',
                      backgroundColor: draggedItem?.type === 'subsection' && 
                        draggedItem?.lessonIndex === lIdx && 
                        draggedItem?.sectionIndex === sIdx && 
                        draggedItem?.index === ssIdx ? '#f0f0f0' : 'transparent',
                      padding: '8px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '4px'
                    }}
                  >
                    {/* Sub-section drag handle and reorder controls */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 cursor-grab text-xs">⋮⋮</span>
                        <span className="text-xs text-gray-500">Sub {ssIdx + 1}</span>
                        {ssIdx > 0 && (
                          <button
                            onClick={() => moveSubSection(lIdx, sIdx, ssIdx, ssIdx - 1)}
                            className="text-xs text-blue-600 hover:text-blue-800"
                            title="Move Up"
                          >
                            ↑
                          </button>
                        )}
                        {ssIdx < section.subSections.length - 1 && (
                          <button
                            onClick={() => moveSubSection(lIdx, sIdx, ssIdx, ssIdx + 1)}
                            className="text-xs text-blue-600 hover:text-blue-800"
                            title="Move Down"
                          >
                            ↓
                          </button>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteSubSection(lIdx, sIdx, ssIdx)}
                        className="h-4 text-[8px] px-1"
                      >
                        Del
                      </Button>
                    </div>
                    <input
                      value={ss.title}
                      onChange={(e) =>
                        updateSubSection(lIdx, sIdx, ssIdx, "title", e.target.value)
                      }
                      style={{ width: "100%", marginBottom: "4px" }}
                      placeholder="Sub-Section Title"
                    />
                    <input
                      value={ss.slug}
                      onChange={(e) =>
                        updateSubSection(lIdx, sIdx, ssIdx, "slug", e.target.value)
                      }
                      style={{ width: "100%", marginBottom: "4px" }}
                      placeholder="Sub-Section Slug"
                    />

                    <div className="text-[10px] text-zinc-500 mt-1">
                      Slug: <span className="text-red-600">/{ss.slug}</span>
                      {ss.isPending && <span className="text-orange-500 ml-1">(Not Saved)</span>}
                      {ss.id && <span className="text-blue-500 ml-1">ID: {ss.id.slice(-6)}</span>}
                    </div>

                    <button
                      onClick={async () => {
                        const url = await saveSubSectionToDatabase(lIdx, sIdx, ssIdx);
                        if (url) {
                          window.open(url, '_blank');
                        }
                      }}
                      disabled={isCreating}
                      className={`w-full mt-1 px-3 py-1 text-sm rounded ${
                        ss.isPending 
                          ? 'bg-orange-500 text-white hover:bg-orange-600' 
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      } ${isCreating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      {isCreating ? 'Saving...' : ss.isPending ? 'Save & Edit Sub-Section' : 'Edit Sub-Section'}
                    </button>
                  </div>
                ))}

                <button
                  onClick={() => addSubSection(lIdx, sIdx)}
                  className="text-xs text-blue-600 mt-1"
                >
                  ➕ Add Sub-Section
                </button>
              </div>
            ))}

            <button
              onClick={() => addSection(lIdx)}
              className="text-xs text-blue-600 mt-2"
            >
              ➕ Add Section
            </button>
          </div>
        ))}

        <button 
          onClick={addSidebarItem}
          disabled={isCreating}
          style={{
            padding: '8px 16px',
            backgroundColor: isCreating ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isCreating ? 'not-allowed' : 'pointer'
          }}
        >
          {isCreating ? 'Creating...' : '➕ Add Lesson'}
        </button>
      </div>

      {/* PUCK */}
      <div style={{ flex: 1 }}>
        <Puck config={puckConfig} data={puckData} onPublish={handlePublish} />
      </div>
    </div>
  );
}
