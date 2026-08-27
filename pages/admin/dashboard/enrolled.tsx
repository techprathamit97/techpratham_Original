"use client";

import React, { useContext, useEffect, useState } from "react";
import Head from "next/head";
import { UserContext } from "@/context/userContext";
import AdminSidebar from "@/src/account/common/AdminSidebar";
import AdminTopBar from "@/src/account/common/AdminTopBar";
import AdminLoader from "@/src/account/common/AdminLoader";
import SignOut from "@/src/account/common/SignOut";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Button } from "@/components/ui/button";

interface Enrollment {
  _id: string;
  name: string;
  email: string;
  phone: string;
  course_title: string;
  createdAt: string;
}

export default function EnrollmentsAdmin() {
  const { authenticated, loading, isAdmin, setCurrentTab } =
    useContext(UserContext);

  const [data, setData] = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setCurrentTab("enrollments");
  }, []);

  useEffect(() => {
    if (authenticated) fetchEnrollments();
  }, [authenticated]);

  const fetchEnrollments = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/course/enrollment");
      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error("Failed to fetch enrollments", err);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Enrolled Students", 14, 15);

    autoTable(doc, {
      startY: 25,
      head: [["Name", "Email", "Phone", "Course", "Date"]],
      body: data.map(item => [
        item.name,
        item.email,
        item.phone,
        item.course_title.replace(/<[^>]*>/g, ""),
        new Date(item.createdAt).toLocaleDateString(),
      ]),
      styles: { fontSize: 9 },
    });

    doc.save("enrollments.pdf");
  };

  return (
    <>
      <Head>
        <title>Enrollments | Admin Dashboard</title>
      </Head>

      {loading ? (
        <AdminLoader />
      ) : !authenticated || !isAdmin ? (
        <SignOut />
      ) : (
        <div className="w-full min-h-screen flex">
  <AdminSidebar />

  <div className="flex flex-col w-full bg-black h-screen overflow-hidden">
    <AdminTopBar />

    <div className="p-6 flex-1 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">
          Enrolled Students
        </h2>

        <Button
          onClick={downloadPDF}
          className="bg-green-600 hover:bg-green-700"
        >
          Download PDF
        </Button>
      </div>

      <div className="bg-[#1a1a1a] rounded-lg max-h-[70vh] overflow-y-auto overflow-x-auto">
        <table className="w-full text-sm text-white">
          <thead className="bg-gray-800 sticky top-0 z-10">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Course</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>

          <tbody>
            {data.map(item => (
              <tr key={item._id} className="border-t border-gray-700">
                <td className="p-3">{item.name}</td>
                <td className="p-3">{item.email}</td>
                <td className="p-3">{item.phone}</td>
                <td className="p-3">
                  {item.course_title.replace(/<[^>]*>/g, "")}
                </td>
                <td className="p-3">
                  {new Date(item.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>

      )}
    </>
  );
}
