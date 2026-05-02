"use client";

import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import { Puck } from "@measured/puck";
import "@measured/puck/puck.css";
import { puckConfig } from "@/src/lms/puckConfig";
import { UserContext } from "@/context/userContext";
import AdminLoader from "@/src/account/common/AdminLoader";
import SignOut from "@/src/account/common/SignOut";

export default function SubSectionEditor() {
  const router = useRouter();
  const { courseId, lessonId, sectionId, subSectionId } = router.query;

  const [loading, setLoading] = useState(true);
  const [puckData, setPuckData] = useState({ root: {}, content: [] });

  // Assuming you want to get user info from context (optional)
  const userContext = useContext(UserContext);

  useEffect(() => {
    if (!courseId || !lessonId || !sectionId || !subSectionId) return;

    const fetchContent = async () => {
      setLoading(true);

      try {
        // ⭐ Use optimized puck API instead of loading entire course
        const query = new URLSearchParams({
          courseId,
          lessonId,
          sectionId,
          subSectionId
        });
        
        const res = await fetch(`/api/lms/puck?${query.toString()}`);
        if (!res.ok) {
          throw new Error("Failed to fetch content");
        }
        const data = await res.json();
        
        // ⭐ FIX: Handle case where subsection doesn't exist yet
        if (data.error && data.error.includes("not found")) {
          console.log("SubSection not found, initializing with empty data");
          setPuckData({ root: {}, content: [] });
        } else {
          setPuckData(data || { root: {}, content: [] });
        }
      } catch (error) {
        console.error("Error fetching content:", error);
        setPuckData({ root: {}, content: [] });
      }

      setLoading(false);
    };

    fetchContent();
  }, [courseId, lessonId, sectionId, subSectionId]);

const handlePublish = async (newData) => {
  if (!courseId || !lessonId || !sectionId || !subSectionId) {
    console.error("Missing required IDs");
    return;
  }

  try {
    // ⭐ Use optimized puck API for faster saves
    const res = await fetch('/api/lms/puck', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        courseId,
        lessonId,
        sectionId,
        subSectionId,
        puckData: newData
      })
    });

    const result = await res.json();
    if (!res.ok) {
      console.error("Failed to save puck data:", result.error);
      alert("Failed to save content: " + result.error);
    } else {
      setPuckData(newData);
      
      // ⭐ CACHE BUSTING: Force refetch on display page
      if (typeof window !== 'undefined') {
        // Send message to other tabs to refresh
        localStorage.setItem('lms-content-updated', JSON.stringify({
          courseId,
          lessonId,
          sectionId,
          subSectionId,
          timestamp: Date.now()
        }));
        
        // Remove the message after a short delay
        setTimeout(() => {
          localStorage.removeItem('lms-content-updated');
        }, 1000);
      }
      
      alert("Content saved successfully!");
    }
  } catch (error) {
    console.error("Error saving puck data:", error);
    alert("Error saving content.");
  }
};


  if (!courseId || !lessonId || !sectionId || !subSectionId || loading) {
    return <AdminLoader />;
  }

  return (
    <div className="w-full h-screen">
      <Puck
        config={puckConfig}
        data={puckData}
        onPublish={handlePublish}
      />
    </div>
  );
}
