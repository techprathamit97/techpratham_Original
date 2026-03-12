

"use client";

import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import Head from "next/head";
import { toast } from "sonner";
import { Edit, Trash2 } from "lucide-react";

import { UserContext } from "@/context/userContext";
import AdminSidebar from "@/src/account/common/AdminSidebar";
import AdminTopBar from "@/src/account/common/AdminTopBar";
import AdminLoader from "@/src/account/common/AdminLoader";
import SignOut from "@/src/account/common/SignOut";

/* ================= TYPES ================= */

type EventType = "placement" | "hiring" | "video";

interface EventData {
  _id?: string;
  type: EventType;
  title?: string;
  image?: string;
  videoUrl?: string;
}

/* ================= DEFAULT ================= */

const emptyEvent: EventData = {
  type: "placement",
  title: "",
  image: "",
  videoUrl: "",
};

/* ================= COMPONENT ================= */

export default function AdminEventsPage() {
  const { authenticated, loading, isAdmin, setCurrentTab } =
    useContext(UserContext);

  const [events, setEvents] = useState<EventData[]>([]);
  const [selectedEvent, setSelectedEvent] =
    useState<EventData>(emptyEvent);
  const [processing, setProcessing] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(false);

  /* ================= INIT ================= */

  useEffect(() => {
    setCurrentTab("events");
  }, [setCurrentTab]);

  useEffect(() => {
    if (authenticated) fetchEvents();
  }, [authenticated]);

  /* ================= API ================= */

  const fetchEvents = async () => {
    setLoadingEvents(true);
    try {
      const res = await fetch("/api/event");
      const data = await res.json();
      setEvents(data);
    } catch {
      toast.error("Failed to load items");
    } finally {
      setLoadingEvents(false);
    }
  };

  const saveEvent = async () => {
    if (
      (selectedEvent.type === "video" && !selectedEvent.videoUrl) ||
      (selectedEvent.type !== "video" && !selectedEvent.image)
    ) {
      toast.error("Required data missing");
      return;
    }

    setProcessing(true);
    try {
      const method = selectedEvent._id ? "PUT" : "POST";
      const url = selectedEvent._id
        ? `/api/event/${selectedEvent._id}`
        : `/api/event`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedEvent),
      });

      if (!res.ok) throw new Error("Save failed");

      toast.success("Saved successfully");
      setSelectedEvent(emptyEvent);
      fetchEvents();
    } catch {
      toast.error("Save failed");
    } finally {
      setProcessing(false);
    }
  };

  const deleteEvent = async (id?: string) => {
    if (!id) return;
    if (!confirm("Delete this item?")) return;

    setProcessing(true);
    try {
      await fetch(`/api/event/${id}`, { method: "DELETE" });
      toast.success("Deleted");
      fetchEvents();
    } catch {
      toast.error("Delete failed");
    } finally {
      setProcessing(false);
    }
  };

  /* ================= AWS IMAGE UPLOAD ================= */

  const uploadToAws = async (file: File) => {
    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch("/api/event-image-uploading", {
      method: "POST",
      body: fd,
    });

    const data = await res.json();
    return data.url as string;
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files?.[0]) return;

    setProcessing(true);
    try {
      const url = await uploadToAws(e.target.files[0]);
      setSelectedEvent((prev) => ({ ...prev, image: url }));
      toast.success("Image uploaded");
    } catch {
      toast.error("Upload failed");
    } finally {
      setProcessing(false);
    }
  };

  /* ================= GUARD ================= */

  if (loading) return <AdminLoader />;
  if (!authenticated || !isAdmin) return <SignOut />;
const videoEvents = events.filter((e) => e.type === "video");
const placementEvents = events.filter((e) => e.type === "placement");
const hiringEvents = events.filter((e) => e.type === "hiring");
  /* ================= UI ================= */

  return (
    <>
      <Head>
        <title>Admin · Promotions</title>
      </Head>

      <div className="flex h-screen bg-black text-white">
        <AdminSidebar />

        <div className="flex-1 p-6 overflow-auto">
          <AdminTopBar />

          <h1 className="text-3xl font-bold mb-6">
            Promotions Manager
          </h1>

          {/* ================= FORM ================= */}
          <div className="max-w-xl bg-gray-900 p-6 rounded-xl mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {selectedEvent._id ? "Edit Item" : "Create Item"}
            </h2>

            {/* TYPE */}
            <select
              value={selectedEvent.type}
              onChange={(e) =>
                setSelectedEvent({
                  type: e.target.value as EventType,
                  title: "",
                  image: "",
                  videoUrl: "",
                })
              }
              className="w-full mb-4 p-2 bg-gray-800 border border-gray-700 rounded"
            >
              <option value="placement">Placement Image</option>
              <option value="hiring">Hiring Image</option>
              <option value="video">YouTube Video</option>
            </select>

            {/* TITLE */}
            <input
              placeholder="Title (optional)"
              value={selectedEvent.title || ""}
              onChange={(e) =>
                setSelectedEvent({
                  ...selectedEvent,
                  title: e.target.value,
                })
              }
              className="w-full mb-4 p-2 bg-gray-800 border border-gray-700 rounded"
            />

            {/* VIDEO URL */}
            {selectedEvent.type === "video" && (
              <input
                placeholder="YouTube Embed URL"
                value={selectedEvent.videoUrl || ""}
                onChange={(e) =>
                  setSelectedEvent({
                    ...selectedEvent,
                    videoUrl: e.target.value,
                  })
                }
                className="w-full mb-4 p-2 bg-gray-800 border border-gray-700 rounded"
              />
            )}

            {/* IMAGE UPLOAD */}
            {selectedEvent.type !== "video" && (
              <>
                <div className="w-full h-48 mb-3 relative border border-gray-700 rounded overflow-hidden">
                  {selectedEvent.image ? (
                    <Image
                      src={selectedEvent.image}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      No Image
                    </div>
                  )}
                </div>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="mb-4"
                />
              </>
            )}

            {/* ACTIONS */}
            <button
              onClick={saveEvent}
              disabled={processing}
              className="w-full bg-green-600 hover:bg-green-700 p-2 rounded"
            >
              {processing ? "Saving..." : "Save"}
            </button>
          </div>

          {/* ================= LIST ================= */}
          <h2 className="text-xl font-semibold mb-4">
  Uploaded Items
</h2>

{loadingEvents ? (
  <p className="text-gray-400">Loading...</p>
) : (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-10">

    {/* ================= VIDEOS ================= */}
    <div>
      <h3 className="font-bold mb-3 text-white">🎥 Videos</h3>
      <div className="space-y-3">
        {videoEvents.map((ev) => (
          <div
            key={ev._id}
            className="bg-gray-200 text-black rounded-lg p-3 flex items-center gap-4"
          >
            <div className="flex-1">
              <p className="font-bold">{ev.title || "Video"}</p>
              <p className="text-xs break-all text-gray-600">
                {ev.videoUrl}
              </p>
            </div>

            <button
              onClick={() => setSelectedEvent(ev)}
              className="p-2 bg-blue-600 text-white rounded"
            >
              <Edit size={16} />
            </button>

            <button
              onClick={() => deleteEvent(ev._id)}
              className="p-2 bg-red-600 text-white rounded"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>

    {/* ================= PLACEMENTS ================= */}
    <div>
      <h3 className="font-bold mb-3 text-white">🎓 Placements</h3>
      <div className="space-y-3">
        {placementEvents.map((ev) => (
          <div
            key={ev._id}
            className="bg-gray-200 text-black rounded-lg p-3 flex items-center gap-4"
          >
            <div className="w-16 h-16 relative rounded overflow-hidden">
              <Image src={ev.image!} alt="" fill className="object-cover" />
            </div>

            <div className="flex-1">
              <p className="font-bold">{ev.title || "Placement"}</p>
            </div>

            <button
              onClick={() => setSelectedEvent(ev)}
              className="p-2 bg-blue-600 text-white rounded"
            >
              <Edit size={16} />
            </button>

            <button
              onClick={() => deleteEvent(ev._id)}
              className="p-2 bg-red-600 text-white rounded"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>

    {/* ================= HIRING ================= */}
    <div>
      <h3 className="font-bold mb-3 text-white">💼 Hiring</h3>
      <div className="space-y-3">
        {hiringEvents.map((ev) => (
          <div
            key={ev._id}
            className="bg-gray-200 text-black rounded-lg p-3 flex items-center gap-4"
          >
            <div className="w-16 h-16 relative rounded overflow-hidden">
              <Image src={ev.image!} alt="" fill className="object-cover" />
            </div>

            <div className="flex-1">
              <p className="font-bold">{ev.title || "Hiring"}</p>
            </div>

            <button
              onClick={() => setSelectedEvent(ev)}
              className="p-2 bg-blue-600 text-white rounded"
            >
              <Edit size={16} />
            </button>

            <button
              onClick={() => deleteEvent(ev._id)}
              className="p-2 bg-red-600 text-white rounded"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>

  </div>
)}

        </div>
      </div>
    </>
  );
}
