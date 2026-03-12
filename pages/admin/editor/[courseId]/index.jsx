
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
      const res = await fetch(`/api/lms/content?courseId=${courseId}&lite=true`);
      const parsed = await res.json();

      if (parsed && !parsed.error) {
        // Main course page has no puckData, only sidebar structure
        setPuckData({ root: {}, content: [] });
        setSidebar(
          (parsed.sidebar || []).map((lesson) => ({
            ...lesson,
            oldSlug: lesson.slug,
            sections: (lesson.sections || []).map((section) => ({
              ...section,
              oldSlug: section.slug,
              subSections: (section.subSections || []).map((ss) => ({
                ...ss,
                oldSlug: ss.slug,
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
    setSidebar([
      ...sidebar,
      {
        title: "New Lesson",
        slug: slugify(`lesson-${sidebar.length + 1}`),
        oldSlug: null,
        sections: [],
      },
    ]);
  };

  const addSection = (lessonIndex) => {
    const updated = [...sidebar];
    updated[lessonIndex].sections.push({
      title: "New Section",
      slug: slugify(`section-${updated[lessonIndex].sections.length + 1}`),
      oldSlug: null,
      subSections: [],
    });
    setSidebar(updated);
  };

  const addSubSection = (lessonIndex, sectionIndex) => {
    const updated = [...sidebar];
    updated[lessonIndex].sections[sectionIndex].subSections.push({
      title: "New Sub Section",
      slug: slugify(
        `sub-${updated[lessonIndex].sections[sectionIndex].subSections.length + 1}`
      ),
      oldSlug: null,
    });
    setSidebar(updated);
  };

  /* ---------- UPDATERS ---------- */
  const updateSidebarItem = (index, field, value) => {
    setSidebar((prev) => {
      const updated = [...prev];
      const item = { ...updated[index] };

      if (field === "title") item.title = value;
      if (field === "slug") {
        if (!item.oldSlug) item.oldSlug = item.slug;
        item.slug = value;
      }

      updated[index] = item;
      return updated;
    });
  };

  const updateSection = (l, s, field, value) => {
    setSidebar((prev) => {
      const updated = [...prev];
      const section = { ...updated[l].sections[s] };

      if (field === "title") section.title = value;
      if (field === "slug") {
        if (!section.oldSlug) section.oldSlug = section.slug;
        section.slug = value;
      }

      updated[l].sections[s] = section;
      return updated;
    });
  };

  const updateSubSection = (l, s, ss, field, value) => {
    setSidebar((prev) => {
      const updated = [...prev];
      const sub = {
        ...updated[l].sections[s].subSections[ss],
      };

      if (field === "title") sub.title = value;
      if (field === "slug") {
        if (!sub.oldSlug) sub.oldSlug = sub.slug;
        sub.slug = value;
      }

      updated[l].sections[s].subSections[ss] = sub;
      return updated;
    });
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
    const payload = {
      courseId,
      sidebar: sidebar.map((lesson) => ({
        title: lesson.title,
        slug: lesson.slug,
        oldSlug: lesson.oldSlug,
        sections: lesson.sections.map((section) => ({
          title: section.title,
          slug: section.slug,
          oldSlug: section.oldSlug,
          subSections: (section.subSections || []).map((ss) => ({
            title: ss.title,
            slug: ss.slug,
            oldSlug: ss.oldSlug,
          })),
        })),
      })),
      puckData: newData,
    };

    await fetch("/api/lms/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    alert("Saved successfully");
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* SIDEBAR */}
      <div style={{ width: 340, padding: 16, overflowY: "auto" }}>
        {sidebar.map((lesson, lIdx) => (
          <div key={lIdx} className="mb-4 p-3 border rounded relative">
            <input
              value={lesson.title}
              onChange={(e) => updateSidebarItem(lIdx, "title", e.target.value)}
              style={{ width: "70%" }}
            />
            <input
              value={lesson.slug}
              onChange={(e) => updateSidebarItem(lIdx, "slug", e.target.value)}
              style={{ width: "70%", marginTop: 4 }}
            />
            <Button
              size="sm"
              variant="destructive"
              onClick={() => deleteLesson(lIdx)}
              style={{ position: "absolute", top: 8, right: 8 }}
            >
              Delete Lesson
            </Button>

            <Link href={`/admin/editor/${courseId}/${lesson.slug}`} target="_blank">
              <Button size="sm" className="w-full mt-1">
                Edit Lesson
              </Button>
            </Link>

            {lesson.sections.map((section, sIdx) => (
              <div key={sIdx} className="ml-2 mt-2 p-2 border rounded relative">
                <input
                  value={section.title}
                  onChange={(e) => updateSection(lIdx, sIdx, "title", e.target.value)}
                  style={{ width: "70%" }}
                />
                <input
                  value={section.slug}
                  onChange={(e) => updateSection(lIdx, sIdx, "slug", e.target.value)}
                  style={{ width: "70%", marginTop: 4 }}
                />
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteSection(lIdx, sIdx)}
                  style={{ position: "absolute", top: 8, right: 8 }}
                >
                  Delete Section
                </Button>

                <Link
                  href={`/admin/editor/${courseId}/${lesson.slug}/${section.slug}`}
                  target="_blank"
                >
                  <Button size="sm" className="w-full mt-1">
                    Edit Section
                  </Button>
                </Link>

                {section.subSections?.map((ss, ssIdx) => (
                  <div key={ssIdx} className="ml-2 mt-2 relative">
                    <input
                      value={ss.title}
                      onChange={(e) =>
                        updateSubSection(lIdx, sIdx, ssIdx, "title", e.target.value)
                      }
                      style={{ width: "70%" }}
                    />
                    <input
                      value={ss.slug}
                      onChange={(e) =>
                        updateSubSection(lIdx, sIdx, ssIdx, "slug", e.target.value)
                      }
                      style={{ width: "70%", marginTop: 4 }}
                    />

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteSubSection(lIdx, sIdx, ssIdx)}
                      style={{ position: "absolute", top: 0, right: 0 }}
                    >
                      Delete Sub-Section
                    </Button>

                    <Link
                      href={`/admin/editor/${courseId}/${lesson.slug}/${section.slug}/${ss.slug}`}
                      target="_blank"
                    >
                      <Button size="sm" variant="outline" className="w-full mt-1">
                        Edit Sub-Section
                      </Button>
                    </Link>
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

        <button onClick={addSidebarItem}>➕ Add Lesson</button>
      </div>

      {/* PUCK */}
      <div style={{ flex: 1 }}>
        <Puck config={puckConfig} data={puckData} onPublish={handlePublish} />
      </div>
    </div>
  );
}
