"use client";

import { useState } from "react";
import LeadForm from "@/components/common/LeadForm/LeadForm";
interface SectionProps {
  id?: string;
}
type Batch = {
  id: number;
  date: string;
  time: string;
  days: string;
};

function generateBatches(): Batch[] {
  const offsets = [1, 4, 6, 7];
  const today = new Date();

  return offsets.map((offset, index) => {
    const d = new Date(today);
    d.setDate(today.getDate() + offset);
    const day = d.getDay();

    return {
      id: index + 1,
      date: d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      time: "07:00 AM, 11:00 AM, 02:00 PM, 09:00 PM",
      days: day === 0 || day === 6 ? "Weekends" : "Weekdays",
    };
  });
}

export default function TrainingBatches({ id, course }: any) {
  const [selectedBatch, setSelectedBatch] = useState(1);
  const [showLeadForm, setShowLeadForm] = useState(false);

  const batches = generateBatches();

  return (
    <section id={id} className="w-full bg-gray-100 px-3 py-3 md:px-0">
      <div className="max-w-6xl  mx-auto">
 
 <div className="text-center">
        <h2 className="text-[#7f1d1d] md:text-3xl text-2xl font-bold">
          Upcoming Batches
        </h2>

        <svg
          className="mx-auto"
          width="340"
          height="6"
          viewBox="0 0 340 6"
          preserveAspectRatio="none"
        >
          <path
            d="M0 3 Q170 0 340 3 Q170 6 0 3 Z"
            fill="#7f1d1d"
          />
        </svg>
      </div>

        {/* MAIN CONTAINER */}
        <div className="bg-gray-100 rounded-xl shadow-lg p-4 md:p-6">

          {/* BATCH ROW */}
          <div className="flex gap-4  overflow-x-auto pb-3 no-scrollbar">
            {batches.map((batch) => (
              <label
                key={batch.id}
                className={`relative min-w-[260px] bg-slate-300 sm:min-w-[180px] md:min-w-[260px]
                flex-shrink-0 cursor-pointer rounded-xl border p-4 md:p-5 transition
                ${
                  selectedBatch === batch.id
                    ? "border-red-800 ring-2 ring-blue-200"
                    : "border-slate-200 hover:shadow-md"
                }`}
              >
                <input
                  type="radio"
                  className="hidden"
                  checked={selectedBatch === batch.id}
                  onChange={() => setSelectedBatch(batch.id)}
                />

                {selectedBatch === batch.id && (
                  <div className="absolute top-0 left-0 bg-red-900 text-white px-2 py-1 rounded-br-xl text-xs">
                    ✓ Selected
                  </div>
                )}

                <p className="font-semibold text-slate-700 mb-3 text-sm md:text-base">
                  {batch.days}
                </p>

                <div className="bg-slate-100 rounded-lg px-3 py-2 text-xs md:text-sm mb-2">
                  📅 {batch.date}
                </div>

                <div className="bg-slate-100 rounded-lg px-3 py-2 text-xs md:text-sm">
                  <div className="font-medium mb-1">⏰ Time</div>

                  <div className="flex flex-wrap gap-2 text-slate-700">
                    <span className="bg-white px-2 py-1 rounded">07:00 AM</span>
                    <span className="bg-white px-2 py-1 rounded">11:00 AM</span>
                  
                </div>
                <div className="flex flex-wrap mt-2 gap-2 text-slate-700"></div>
                  <span className="bg-white px-2 py-1 rounded">02:00 PM</span>
                    <span className="bg-white px-2 py-1 rounded">09:00 PM</span>
                  </div>
              </label>
            ))}
          </div>

          {/* BOTTOM ACTION STRIP */}
          <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50 border rounded-lg p-4">
            <p className="font-medium text-slate-700 text-center md:text-left text-sm md:text-base">
              Can't find a batch you were looking for?
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <button
                onClick={() => setShowLeadForm(true)}
                className="w-full sm:w-auto bg-gradient-to-tl from-[#C6151D] to-[#600A0E] text-white px-6 py-3 rounded-lg font-semibold text-sm md:text-base"
              >
                Enroll Now
              </button>

              <button
                onClick={() => setShowLeadForm(true)}
                className="w-full sm:w-auto border border-red-900 text-red-900 px-6 py-3 rounded-lg font-semibold text-sm md:text-base hover:bg-red-50 transition"
              >
                REQUEST CUSTOM TIME
              </button>
            </div>
          </div>
        </div>
      </div>

      {showLeadForm && (
        <LeadForm
          course={{ title: course?.title }}
          onClose={() => setShowLeadForm(false)}
          onSuccess={() => setShowLeadForm(false)}
        />
      )}
    </section>
  );
}
