



"use client";

import { Puck } from "@measured/puck";
import "@measured/puck/puck.css";

import { puckConfig } from "@/src/lms/puckConfig";
import { useRouter } from "next/router";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "@/context/userContext";
import AdminLoader from "@/src/account/common/AdminLoader";
import SignOut from "@/src/account/common/SignOut";

export default function EditorPage() {
  const router = useRouter();
  const { courseId, lessonId, sectionId } = router.query;
  const { authenticated, loading: userLoading, isAdmin } = useContext(UserContext);

  const [data, setData] = useState(null); // 👈 important
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady || !courseId || !lessonId) return;

    const fetchData = async () => {
      try {
        const query = new URLSearchParams({
          courseId,
          lessonId,
          ...(sectionId && { sectionId })
        });
        const res = await fetch(`/api/lms/puck?${query.toString()}`);
        const result = await res.json();
        setData(result || { root: {}, content: [] });
      } catch (error) {
        console.error("Fetch error:", error);
        setData({ root: {}, content: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router.isReady, courseId, lessonId, sectionId]);

  if (userLoading) return <AdminLoader />;
  if (!authenticated || !isAdmin) return <SignOut />;
  if (loading || !data) return <p>Loading editor...</p>;

  return (
    <Puck
      config={puckConfig}
      data={data}
      onPublish={async (newData) => {
        try {
          const res = await fetch("/api/lms/puck", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              courseId,
              lessonId,
              sectionId,
              puckData: newData
            })
          });

          if (res.ok) {
            setData(newData);
            
            // ⭐ FIX: Improved cache busting strategy
            if (typeof window !== 'undefined') {
              // Set timestamp for cache bypass
              localStorage.setItem('lms-last-update', Date.now().toString());
              
              // Send message to other tabs to refresh
              localStorage.setItem('lms-content-updated', JSON.stringify({
                courseId,
                lessonId,
                sectionId,
                timestamp: Date.now()
              }));
              
              // Remove the message after a short delay
              setTimeout(() => {
                localStorage.removeItem('lms-content-updated');
              }, 1000);
              
              // ⭐ FIX: Don't auto-open, just show success message with link
              const displayUrl = sectionId 
                ? `/e-book/${courseId}/${lessonId}/${sectionId}?t=${Date.now()}`
                : `/e-book/${courseId}/${lessonId}?t=${Date.now()}`;
              
              console.log('Content saved! View at:', displayUrl);
            }
            
            alert("Saved successfully to MongoDB");
          } else {
            const err = await res.json();
            alert(`Error: ${err.error}`);
          }
        } catch (error) {
          console.error("Save error:", error);
          alert("Failed to save content");
        }
      }}
    />
  );
}
