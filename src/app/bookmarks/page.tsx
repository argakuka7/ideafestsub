"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { SessionCard } from "@/components/schedule/SessionCard";
import { SessionModal } from "@/components/schedule/SessionModal";
import sessionsData from "@/data/sessions.json";
import { useBookmarks } from "@/lib/useBookmarks";
import type { DayData, Session } from "@/lib/types";

const scheduleDays = sessionsData as DayData[];

export default function BookmarksPage() {
  const { bookmarks, mounted } = useBookmarks();
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  const savedByDay = useMemo(() => {
    const savedIds = new Set(bookmarks);
    return scheduleDays
      .map((day) => ({
        ...day,
        sessions: day.sessions
          .filter((session) => savedIds.has(session.id))
          .map((session) => ({ ...session, day: day.day, date: day.date })),
      }))
      .filter((day) => day.sessions.length > 0);
  }, [bookmarks]);

  if (!mounted) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-10">
      <p className="text-sm font-black uppercase tracking-[0.18em] text-[#E91E8C]">Your IDEATALKS</p>
      <h1 className="mt-1 text-3xl font-black tracking-tight text-[#1A1A1A] sm:text-4xl">Saved talks</h1>
      <p className="mt-2 text-sm text-gray-500 sm:text-base">Keep your must-see conversations together in one place.</p>

      {savedByDay.length ? (
        <div className="mt-8 space-y-10">
          {savedByDay.map((day) => (
            <section key={day.day}>
              <div className="mb-4 flex items-center gap-3">
                <h2 className="text-lg font-black text-[#1A1A1A]">{day.dayLabel}</h2>
                <span className="text-sm text-gray-400">
                  {new Intl.DateTimeFormat("en", { day: "numeric", month: "long" }).format(new Date(`${day.date}T12:00:00`))}
                </span>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {day.sessions.map((session) => (
                  <SessionCard key={session.id} onSelect={setSelectedSession} session={session} />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-3xl border border-dashed border-gray-300 bg-gray-50 px-6 py-16 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#E91E8C]/10 text-[#E91E8C]">
            <svg aria-hidden="true" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 3.75A1.75 1.75 0 0 1 7.75 2h8.5A1.75 1.75 0 0 1 18 3.75v17.5l-6-3.6-6 3.6V3.75Z" />
            </svg>
          </span>
          <h2 className="mt-4 text-xl font-black text-[#1A1A1A]">No saved talks yet</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-gray-500">Bookmark any session from the schedule to build your personal rundown.</p>
          <Link className="mt-6 inline-flex rounded-full bg-[#E91E8C] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#c81775]" href="/">
            Browse Schedule
          </Link>
        </div>
      )}
      <SessionModal onClose={() => setSelectedSession(null)} session={selectedSession} />
    </div>
  );
}
