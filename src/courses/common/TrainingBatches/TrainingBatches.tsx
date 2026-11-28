"use client";

import { useMemo, useState } from "react";
import LeadForm from "@/components/common/LeadForm/LeadForm";

type Batch = {
  id: number;
  dayNum: string; // "29"
  weekday: string; // "Sun"
  monthYear: string; // "NOV 2026"
  days: string; // "Weekends" | "Weekdays"
};

type Zone = "IST" | "PST";

// Base class times, as minutes-since-midnight in IST.
// 07:00, 11:00, 14:00, 21:00
const IST_SLOTS = [7 * 60, 11 * 60, 14 * 60, 21 * 60];

// UTC offset (in minutes) that a given IANA time zone has on `date`.
// Using the real date lets PST follow daylight saving automatically.
function tzOffsetMinutes(timeZone: string, date: Date): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
  const parts = Object.fromEntries(
    dtf.formatToParts(date).map((p) => [p.type, p.value])
  );
  const hour = parts.hour === "24" ? 0 : Number(parts.hour);
  const asUTC = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    hour,
    Number(parts.minute)
  );
  return Math.round((asUTC - date.getTime()) / 60000);
}

// Format minutes-since-midnight as "hh:mm AM/PM".
function formatTime(minutes: number): string {
  const m = ((minutes % 1440) + 1440) % 1440;
  const hour24 = Math.floor(m / 60);
  const min = m % 60;
  const ampm = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${String(hour12).padStart(2, "0")}:${String(min).padStart(2, "0")} ${ampm}`;
}

function generateBatches(): Batch[] {
  const offsets = [1, 4, 6, 7];
  const today = new Date();

  return offsets.map((offset, index) => {
    const d = new Date(today);
    d.setDate(today.getDate() + offset);
    const day = d.getDay();

    return {
      id: index + 1,
      dayNum: String(d.getDate()).padStart(2, "0"),
      weekday: d.toLocaleDateString("en-US", { weekday: "short" }),
      monthYear: d
        .toLocaleDateString("en-US", { month: "short", year: "numeric" })
        .toUpperCase(),
      days: day === 0 || day === 6 ? "Weekends" : "Weekdays",
    };
  });
}

export default function TrainingBatches({ id, course }: any) {
  const [selectedBatch, setSelectedBatch] = useState(1);
  const [selectedTime, setSelectedTime] = useState(0);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [zone, setZone] = useState<Zone>("IST");

  const batches = generateBatches();

  // IST → PST conversion, derived from the real current date so PST follows DST.
  const times = useMemo(() => {
    if (zone === "IST") return IST_SLOTS.map(formatTime);
    const now = new Date();
    const delta =
      tzOffsetMinutes("America/Los_Angeles", now) -
      tzOffsetMinutes("Asia/Kolkata", now);
    return IST_SLOTS.map((m) => formatTime(m + delta));
  }, [zone]);

  return (
    <section id={id} className="w-full bg-gray-50 py-3 md:py-6">
      <div className="mx-auto w-full max-w-6xl px-4">
        {/* HEADER */}
        <div className="text-center">
          <div className="mb-3 flex items-center justify-center gap-2">
            <span className="h-0.5 w-8 bg-[#ff2a3b]" />
            <span className="text-xs font-bold tracking-[0.25em] text-slate-500">
              SCHEDULE
            </span>
          </div>
          <h2
            className="text-2xl font-bold text-[#1B1445] sm:text-3xl md:text-4xl"
            style={{ fontFamily: "var(--font-maitree)" }}
          >
            Upcoming Training Batches
          </h2>
        </div>

        {/* TIME ZONE TOGGLE */}
        <div className="mt-5 mb-8 flex flex-wrap items-center justify-center gap-3">
          <span className="text-sm font-medium text-slate-500">
            Show times in
          </span>
          <div className="inline-flex rounded-full bg-slate-100 p-1">
            {(["IST", "PST"] as Zone[]).map((z) => (
              <button
                key={z}
                type="button"
                onClick={() => setZone(z)}
                className={`rounded-full px-5 py-1.5 text-sm font-semibold transition ${
                  zone === z
                    ? "bg-[#ff2a3b] text-white shadow"
                    : "text-slate-500 hover:text-[#1B1445]"
                }`}
              >
                {z}
              </button>
            ))}
          </div>
        </div>

        {/* BATCH CARDS */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-4">
          {batches.map((batch) => {
            const selected = selectedBatch === batch.id;
            return (
              <div
                key={batch.id}
                className={`flex flex-col rounded-2xl bg-white shadow-md transition ${
                  selected
                    ? "ring-2 ring-[#ff2a3b]/50 shadow-lg"
                    : "ring-1 ring-slate-100 hover:shadow-lg"
                }`}
              >
                {/* COLORED BAND with calendar binding tabs */}
                <div
                  className={`relative rounded-t-2xl px-4 pb-3 pt-7 ${
                    selected ? "bg-[#1B1445]" : "bg-[#ff2a3b]"
                  }`}
                >
                  <div className="absolute inset-x-0 -top-2 flex justify-center gap-16">
                    <span className="h-5 w-2.5 rounded-full bg-white shadow-sm ring-1 ring-black/5" />
                    <span className="h-5 w-2.5 rounded-full bg-white shadow-sm ring-1 ring-black/5" />
                  </div>
                  <p className="text-center text-sm font-bold tracking-widest text-white">
                    {batch.monthYear}
                  </p>
                </div>

                {/* BODY */}
                <div className="flex flex-1 flex-col rounded-b-2xl px-4 py-4">
                  <p className="text-center text-5xl font-extrabold leading-none text-[#1B1445]">
                    {batch.dayNum}
                  </p>
                  <p className="mt-2 text-center text-sm text-slate-500">
                    {batch.weekday} ·{" "}
                    <span className="font-semibold text-slate-700">
                      {batch.days}
                    </span>
                  </p>

                  {/* TIME SLOTS (2 × 2) — click any slot to select it */}
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {times.map((t, i) => {
                      const activeTime = selected && selectedTime === i;
                      return (
                        <button
                          key={t}
                          type="button"
                          onClick={() => {
                            setSelectedBatch(batch.id);
                            setSelectedTime(i);
                          }}
                          className={`rounded-lg px-2 py-2 text-center text-xs font-semibold transition md:text-sm ${
                            activeTime
                              ? "bg-[#ff2a3b] text-white"
                              : "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-[#1B1445]"
                          }`}
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>

                  {/* SELECT BUTTON */}
                  <button
                    type="button"
                    onClick={() => setSelectedBatch(batch.id)}
                    className={`mt-4 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                      selected
                        ? "bg-[#ff2a3b] text-white"
                        : "border border-slate-300 text-[#1B1445] hover:border-[#ff2a3b] hover:text-[#ff2a3b]"
                    }`}
                  >
                    {selected ? "Selected" : "Select"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* BOTTOM ACTION STRIP */}
        <div className="mt-6 flex flex-col gap-4 rounded-xl border border-slate-200 bg-white px-5 py-4 md:flex-row md:items-center md:justify-between">
          <div className="text-center md:text-left">
            <p className="font-bold text-[#1B1445]">
              Can&apos;t find a batch you were looking for?
            </p>
            <p className="text-sm text-slate-500">
              Tell us a time that works for you.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => setShowLeadForm(true)}
              className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-[#1B1445] transition hover:border-[#ff2a3b] hover:text-[#ff2a3b]"
            >
              Request custom time
            </button>
            <button
              type="button"
              onClick={() => setShowLeadForm(true)}
              className="rounded-lg bg-[#ff2a3b] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#e01f2f]"
            >
              Enroll now →
            </button>
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
