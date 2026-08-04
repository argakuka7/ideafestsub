"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";
import { useMemo, useState } from "react";
import { SessionCard } from "@/components/schedule/SessionCard";
import { SessionModal } from "@/components/schedule/SessionModal";
import { SpeakerCard } from "@/components/speakers/SpeakerCard";
import { SpeakerModal } from "@/components/speakers/SpeakerModal";
import sessionsData from "@/data/sessions.json";
import speakersData from "@/data/speakers.json";
import { useBookmarks } from "@/lib/useBookmarks";
import type { DayData, Session, SpeakerEntry } from "@/lib/types";

const scheduleDays = sessionsData as DayData[];
const speakerEntries = speakersData as SpeakerEntry[];

const allSessionIds = new Set(
  scheduleDays.flatMap((day) => day.sessions.map((session) => session.id)),
);

export default function BookmarksPage() {
  const { bookmarks, mounted } = useBookmarks();
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [selectedSpeaker, setSelectedSpeaker] = useState<SpeakerEntry | null>(null);

  const savedByDay = useMemo(() => {
    const savedIds = new Set(bookmarks.filter((id) => allSessionIds.has(id)));
    return scheduleDays
      .map((day) => ({
        ...day,
        sessions: day.sessions
          .filter((session) => savedIds.has(session.id))
          .map((session) => ({ ...session, day: day.day, date: day.date })),
      }))
      .filter((day) => day.sessions.length > 0);
  }, [bookmarks]);

  const savedSpeakers = useMemo(() => {
    const speakerIds = new Set(
      bookmarks.filter((id) => !allSessionIds.has(id)),
    );
    return speakerEntries
      .filter((speaker) => speakerIds.has(speaker.id))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [bookmarks]);

  if (!mounted) return null;

  const hasSavedTalks = savedByDay.length > 0;
  const hasSavedSpeakers = savedSpeakers.length > 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-10">
      <p className="text-sm font-black uppercase tracking-[0.18em] text-[#E91E8C]">Your IDEATALKS</p>
      <h1 className="mt-1 text-3xl font-black tracking-tight text-[#1A1A1A] sm:text-4xl">Saved</h1>
      <p className="mt-2 text-sm text-gray-500 sm:text-base">Keep your must-see conversations and favorite speakers in one place.</p>

      {hasSavedSpeakers ? (
        <section className="mt-8">
          <div className="mb-4 flex items-center gap-3">
            <h2 className="text-lg font-black text-[#1A1A1A]">Saved speakers</h2>
            <span className="text-sm text-gray-400">{savedSpeakers.length}</span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {savedSpeakers.map((speaker) => (
              <SpeakerCard key={speaker.id} onClick={() => setSelectedSpeaker(speaker)} speaker={speaker} />
            ))}
          </div>
        </section>
      ) : null}

      {hasSavedTalks ? (
        <div className={hasSavedSpeakers ? "mt-10 space-y-10" : "mt-8 space-y-10"}>
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
      ) : null}

      {!hasSavedTalks && !hasSavedSpeakers ? (
        <div className="mt-8 rounded-3xl border border-dashed border-gray-300 bg-gray-50 px-6 py-16 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#E91E8C]/10 text-[#E91E8C]">
            <Icon aria-hidden icon="lucide:bookmark" className="h-7 w-7" />
          </span>
          <h2 className="mt-4 text-xl font-black text-[#1A1A1A]">No saved items yet</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-gray-500">Bookmark sessions or speakers to build your personal rundown.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link className="inline-flex rounded-full bg-[#E91E8C] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#c81775]" href="/">
              Browse Schedule
            </Link>
            <Link className="inline-flex rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-bold text-[#1A1A1A] transition hover:border-[#E91E8C] hover:text-[#E91E8C]" href="/speakers">
              Browse Speakers
            </Link>
          </div>
        </div>
      ) : null}
      <SessionModal onClose={() => setSelectedSession(null)} session={selectedSession} />
      <SpeakerModal onClose={() => setSelectedSpeaker(null)} speaker={selectedSpeaker} />
    </div>
  );
}
