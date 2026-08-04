"use client";

import { useEffect, useMemo, useState } from "react";
import { DayToggle } from "@/components/schedule/DayToggle";
import { SearchBar } from "@/components/schedule/SearchBar";
import { SessionModal } from "@/components/schedule/SessionModal";
import { TimeSlot } from "@/components/schedule/TimeSlot";
import { TrackFilter } from "@/components/schedule/TrackFilter";
import sessionsData from "@/data/sessions.json";
import { Blob } from "@/components/motifs/Blob";
import { SmallLeapBadge } from "@/components/SmallLeapBadge";
import { Icon } from "@iconify/react";
import type { DayData, Session } from "@/lib/types";

const scheduleDays = sessionsData as DayData[];

export default function Home() {
  const [activeDay, setActiveDay] = useState(scheduleDays[0]?.day ?? 1);
  const [search, setSearch] = useState("");
  const [activeTracks, setActiveTracks] = useState<string[]>([]);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  const activeDayData = scheduleDays.find((day) => day.day === activeDay) ?? scheduleDays[0];

  const sessions = useMemo<Session[]>(() => {
    if (!activeDayData) return [];
    return activeDayData.sessions.map((session) => ({
      ...session,
      day: activeDayData.day,
      date: activeDayData.date,
    }));
  }, [activeDayData]);

  const normalizedSearch = search.trim().toLocaleLowerCase();

  useEffect(() => {
    if (!normalizedSearch) return;
    const firstDayWithMatch = scheduleDays.find((day) =>
      day.sessions.some((session) =>
        !normalizedSearch ||
        session.title.toLocaleLowerCase().includes(normalizedSearch) ||
        session.speakers.some((speaker) =>
          speaker.name.toLocaleLowerCase().includes(normalizedSearch),
        ) ||
        session.moderator?.name.toLocaleLowerCase().includes(normalizedSearch) === true,
      ),
    );
    if (firstDayWithMatch && firstDayWithMatch.day !== activeDay) {
      setActiveDay(firstDayWithMatch.day);
    }
  }, [normalizedSearch, activeDay]);

  const timeSlots = useMemo(() => {
    const matchingSessions = sessions.filter((session) => {
      const matchesTrack =
        activeTracks.length === 0 ||
        activeTracks.some((track) => session.track.includes(track));
      const matchesSearch =
        !normalizedSearch ||
        session.title.toLocaleLowerCase().includes(normalizedSearch) ||
        session.speakers.some((speaker) =>
          speaker.name.toLocaleLowerCase().includes(normalizedSearch),
        ) ||
        session.moderator?.name.toLocaleLowerCase().includes(normalizedSearch) === true;

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
  }, [activeTracks, sessions, normalizedSearch]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-10">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="relative">
            <Blob className="pointer-events-none absolute -top-12 -right-12 -z-10 h-44 w-44 opacity-90 sm:h-56 sm:w-56" color="#E91E8C" />
            <p className="mt-2 text-sm font-black uppercase tracking-[0.18em] text-[var(--pink)]">IDEAFEST SUB 2026 · THE NEXT LEAP</p>
            <h1 className="mt-2 font-display text-4xl leading-[0.95] tracking-tight text-[var(--cream)] drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)] sm:text-5xl md:text-7xl">Find your next<br />big idea.</h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
              Explore conversations across eight rooms, then save the talks you do not want to miss.
            </p>
            <div className="mt-5"><SmallLeapBadge /></div>
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
                isNowPlaying={false}
                key={slot.sessionNumber}
                onSelect={setSelectedSession}
                sessions={slot.sessions}
                time={slot.time}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-gray-50 px-6 py-16 text-center">
            <Icon aria-hidden icon="lucide:search" className="mx-auto h-10 w-10 text-gray-300" />
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
