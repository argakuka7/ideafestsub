"use client";

import { useEffect, useMemo, useState } from "react";
import { DayToggle } from "@/components/schedule/DayToggle";
import { SearchBar } from "@/components/schedule/SearchBar";
import { SessionModal } from "@/components/schedule/SessionModal";
import { TimeSlot } from "@/components/schedule/TimeSlot";
import { TrackFilter } from "@/components/schedule/TrackFilter";
import sessionsData from "@/data/sessions.json";
import type { DayData, Session } from "@/lib/types";

const scheduleDays = sessionsData as DayData[];

function isCurrentSession(session: Session, now: Date | null) {
  if (!now) return false;

  const startsAt = new Date(`${session.date}T${session.timeStart}:00`);
  const endsAt = new Date(`${session.date}T${session.timeEnd}:00`);
  return now >= startsAt && now <= endsAt;
}

export default function Home() {
  const [activeDay, setActiveDay] = useState(scheduleDays[0]?.day ?? 1);
  const [search, setSearch] = useState("");
  const [activeTracks, setActiveTracks] = useState<string[]>([]);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const refreshTime = () => setNow(new Date());
    refreshTime();
    const interval = window.setInterval(refreshTime, 60_000);
    return () => window.clearInterval(interval);
  }, []);

  const activeDayData = scheduleDays.find((day) => day.day === activeDay) ?? scheduleDays[0];

  const sessions = useMemo<Session[]>(() => {
    if (!activeDayData) return [];
    return activeDayData.sessions.map((session) => ({
      ...session,
      day: activeDayData.day,
      date: activeDayData.date,
    }));
  }, [activeDayData]);

  const timeSlots = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase();
    const matchingSessions = sessions.filter((session) => {
      const matchesTrack =
        activeTracks.length === 0 ||
        activeTracks.some((track) => session.track.includes(track));
      const matchesSearch =
        !normalizedSearch ||
        session.title.toLocaleLowerCase().includes(normalizedSearch) ||
        session.speakers.some((speaker) =>
          speaker.name.toLocaleLowerCase().includes(normalizedSearch),
        );

      return matchesTrack && matchesSearch;
    });

    return Array.from(
      matchingSessions.reduce((slots, session) => {
        const slot = slots.get(session.sessionNumber) ?? [];
        slot.push(session);
        slots.set(session.sessionNumber, slot);
        return slots;
      }, new Map<number, Session[]>()),
    )
      .sort(([sessionNumberA], [sessionNumberB]) => sessionNumberA - sessionNumberB)
      .map(([sessionNumber, slotSessions]) => ({
        sessionNumber,
        time: slotSessions[0].time,
        sessions: slotSessions,
      }));
  }, [activeTracks, search, sessions]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-10">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#E91E8C]">IDEAFEST SUB 2026 · THE NEXT LEAP</p>
            <h1 className="mt-1 text-3xl font-black tracking-tight text-[#1A1A1A] sm:text-4xl">Find your next big idea.</h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-gray-500 sm:text-base">
              Explore conversations across eight rooms, then save the talks you do not want to miss.
            </p>
          </div>
          <DayToggle activeDay={activeDay} days={scheduleDays} onChange={setActiveDay} />
        </div>

        <div className="sticky top-14 z-40 -mx-4 border-y border-gray-100 bg-white/95 px-4 py-4 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0">
          <div className="space-y-3">
            <SearchBar onChange={setSearch} value={search} />
            <TrackFilter activeTracks={activeTracks} onChange={setActiveTracks} />
          </div>
        </div>

        {timeSlots.length ? (
          <div className="space-y-8">
            {timeSlots.map((slot) => (
              <TimeSlot
                isNowPlaying={slot.sessions.some((session) => isCurrentSession(session, now))}
                key={slot.sessionNumber}
                onSelect={setSelectedSession}
                sessions={slot.sessions}
                time={slot.time}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-gray-50 px-6 py-16 text-center">
            <svg aria-hidden="true" className="mx-auto h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="6" />
              <path strokeLinecap="round" d="m16 16 4 4" />
            </svg>
            <h2 className="mt-4 text-lg font-black text-[#1A1A1A]">No talks found</h2>
            <p className="mt-1 text-sm text-gray-500">Try a different search or clear one of your track filters.</p>
            <button
              className="mt-5 rounded-full bg-[#E91E8C] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#c81775]"
              onClick={() => {
                setSearch("");
                setActiveTracks([]);
              }}
              type="button"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
      <SessionModal onClose={() => setSelectedSession(null)} session={selectedSession} />
    </div>
  );
}
