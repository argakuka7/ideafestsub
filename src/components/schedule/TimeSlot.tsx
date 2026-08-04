"use client";

import { SessionCard } from "@/components/schedule/SessionCard";
import type { Session } from "@/lib/types";

interface TimeSlotProps {
  isNowPlaying: boolean;
  onSelect: (session: Session) => void;
  sessions: Session[];
  time: string;
}

export function TimeSlot({ isNowPlaying, onSelect, sessions, time }: TimeSlotProps) {
  if (sessions.length === 0) return null;

  return (
    <section aria-label={`Sessions at ${time}`} className="scroll-mt-32">
      <div className="sticky top-14 z-30 -mx-4 mb-4 flex items-center gap-3 border-y border-gray-100 bg-white/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-xl sm:border sm:px-4">
        <div className={`h-2.5 w-2.5 rounded-full ${isNowPlaying ? "animate-pulse bg-[#E91E8C]" : "bg-gray-300"}`} />
        <h2 className="text-lg font-black tracking-tight text-[#1A1A1A]">{time}</h2>
        {isNowPlaying ? (
          <span className="rounded-full bg-[#E91E8C]/10 px-2.5 py-1 text-xs font-extrabold text-[#E91E8C]">
            Now playing
          </span>
        ) : null}
        <span className="ml-auto text-xs font-medium text-gray-400">{sessions.length} talks</span>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {sessions.map((session) => (
          <SessionCard key={session.id} onSelect={onSelect} session={session} />
        ))}
      </div>
    </section>
  );
}
