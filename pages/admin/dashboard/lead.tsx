"use client";

import React, { useContext, useEffect, useMemo, useState } from "react";
import Head from "next/head";
import { UserContext } from "@/context/userContext";
import AdminSidebar from "@/src/account/common/AdminSidebar";
import AdminTopBar from "@/src/account/common/AdminTopBar";
import AdminLoader from "@/src/account/common/AdminLoader";
import SignOut from "@/src/account/common/SignOut";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Button } from "@/components/ui/button";

interface Lead {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  course: string;
  message?: string;
  formType?: string;
  ipAddress?: string;
  createdAt: string;
  country?: string; // dynamically added
}

const DAYS_OPTIONS = [1, 3, 5, 10];

export default function LeadsAdmin() {
  const { authenticated, loading, isAdmin, setCurrentTab } = useContext(UserContext);

  const [data, setData] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  // daysFilter can be number or "" or "custom"
  const [daysFilter, setDaysFilter] = useState<number | "" | "custom">("");
  const [customDays, setCustomDays] = useState<number | "">("");
  const [showFullMessageIds, setShowFullMessageIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setCurrentTab("leads");
  }, [setCurrentTab]);

  useEffect(() => {
    if (authenticated) fetchLeads();
  }, [authenticated]);

  async function fetchLeads() {
    setIsLoading(true);
    try {
      const res = await fetch("/api/leads");
      if (!res.ok) throw new Error("Failed to fetch leads");
      const json = await res.json();

      // Check if response shape has data property
      const leads: Lead[] = Array.isArray(json)
        ? json
        : json.data && Array.isArray(json.data)
        ? json.data
        : [];

      // Fetch country for each lead IP (skip ::1 and Unknown IP)
   

      setData(leads);
    } catch (error) {
      console.error("Failed to fetch leads", error);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }

  // Show first 10 words with show more/less toggle
  const renderMessage = (lead: Lead) => {
    if (!lead.message) return "-";

    const words = lead.message.trim().split(/\s+/);
    const isLong = words.length > 10;
    const isExpanded = showFullMessageIds.has(lead._id);

    if (!isLong) return lead.message;

    const displayed = isExpanded ? lead.message : words.slice(0, 10).join(" ") + "...";

    return (
      <>
        <span>{displayed} </span>
        <button
          type="button"
          className="text-blue-400 underline cursor-pointer"
          onClick={() => {
            setShowFullMessageIds((prev) => {
              const newSet = new Set(prev);
              if (newSet.has(lead._id)) newSet.delete(lead._id);
              else newSet.add(lead._id);
              return newSet;
            });
          }}
        >
          {isExpanded ? "Show Less" : "Show More"}
        </button>
      </>
    );
  };

  // Compute filtered and sorted leads based on search and days filter
  const filteredData = useMemo(() => {
    if (!Array.isArray(data)) return [];

    const searchLower = search.toLowerCase();

    let cutoffDate: Date | null = null;
    let daysToFilter = daysFilter;

    // If daysFilter is "custom" and customDays is valid number > 0, use it
    if (daysFilter === "custom" && typeof customDays === "number" && customDays > 0) {
      daysToFilter = customDays;
    }

    if (typeof daysToFilter === "number" && daysToFilter > 0) {
      cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToFilter);
    }

    return data
      .filter((lead) => {
        // Filter by date cutoff if set
        if (cutoffDate) {
          const createdAtDate = new Date(lead.createdAt);
          if (createdAtDate < cutoffDate) return false;
        }

        // Filter by search term on multiple fields safely
        const fields = [
          lead.course,
          lead.fullName,
          lead.email,
          lead.formType,
          lead.ipAddress,
          lead.country,
        ].map((f) => (f || "").toLowerCase());

        return fields.some((field) => field.includes(searchLower));
      })
      // Sort descending by createdAt date
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [data, search, daysFilter, customDays]);

  // Download PDF report
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Leads Report", 14, 15);

    autoTable(doc, {
      startY: 25,
      head: [
        [
          "Name",
          "Email",
          "Phone",
          "Course",
          "Form Type",
          "Country",
          "Date",
        ],
      ],
      body: filteredData.map((item) => [
        item.fullName,
        item.email,
        item.phone,
        item.course ? item.course.replace(/<[^>]*>/g, "") : "-",
        item.formType || "-",
        item.country || "-",
        new Date(item.createdAt).toLocaleDateString(),
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [220, 53, 69] },
    });

    doc.save("leads-report.pdf");
  };

  if (loading || isLoading) return <AdminLoader />;

  if (!authenticated || !isAdmin) return <SignOut />;

  return (
    <>
      <Head>
        <title>Leads | Admin Dashboard</title>
      </Head>

      <div className="w-full min-h-screen flex bg-black">
        <AdminSidebar />

        <div className="flex flex-col w-full h-screen overflow-hidden">
          <AdminTopBar />

          <main className="p-6 flex-1 overflow-y-auto text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
              <h2 className="text-xl font-semibold">Leads</h2>

              <div className="flex flex-wrap gap-3 items-center">
                <input
                  type="text"
                  placeholder="Search by name, email, course, IP, country, form type"
                  className="p-2 rounded-md text-black"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                <select
                  className="p-2 rounded-md text-black"
                  value={daysFilter}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "custom") setDaysFilter("custom");
                    else if (val === "") setDaysFilter("");
                    else setDaysFilter(Number(val));
                    setCustomDays("");
                  }}
                >
                  <option value="">Filter by days</option>
                  {DAYS_OPTIONS.map((d) => (
                    <option key={d} value={d}>
                      Last {d} day{d > 1 ? "s" : ""}
                    </option>
                  ))}
                  <option value="custom">Custom</option>
                </select>

                {daysFilter === "custom" && (
                  <input
                    type="number"
                    min={1}
                    className="p-2 rounded-md text-black w-20"
                    placeholder="Days"
                    value={customDays}
                    onChange={(e) => {
                      const val = e.target.value;
                      const num = val === "" ? "" : Number(val);
                      if (num === "" || (typeof num === "number" && num > 0)) {
                        setCustomDays(num);
                      }
                    }}
                  />
                )}

                <Button
                  onClick={downloadPDF}
                  disabled={filteredData.length === 0}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Download PDF
                </Button>
              </div>
            </div>

            <div className="bg-[#1a1a1a] rounded-lg max-h-[70vh] overflow-auto">
              <table className="w-full text-sm text-white border-collapse">
                <thead className="bg-gray-800 sticky top-0 z-10">
                  <tr>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3">Course</th>
                    <th className="p-3">Message</th>
                    <th className="p-3">Form Type</th>
                    <th className="p-3">IP Address</th>
                    <th className="p-3">Country</th>
                    <th className="p-3">Date</th>
                  </tr>
                </thead>

                {filteredData.length > 0 ? (
                  <tbody>
                    {filteredData.map((lead) => (
                      <tr key={lead._id} className="border-t border-gray-700 align-top">
                        <td className="p-3">{lead.fullName || "-"}</td>
                        <td className="p-3">{lead.email || "-"}</td>
                        <td className="p-3">{lead.phone || "-"}</td>
                        <td className="p-3">{lead.course ? lead.course.replace(/<[^>]*>/g, "") : "-"}</td>
                        <td className="p-3 max-w-xs">{renderMessage(lead)}</td>
                        <td className="p-3">{lead.formType || "-"}</td>
                        <td className="p-3">{lead.ipAddress || "-"}</td>
                        <td className="p-3">{lead.country || "-"}</td>
                        <td className="p-3">{new Date(lead.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                ) : (
                  <tbody>
                    <tr>
                      <td colSpan={9} className="text-center p-6 text-white">
                        No leads found.
                      </td>
                    </tr>
                  </tbody>
                )}
              </table>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
