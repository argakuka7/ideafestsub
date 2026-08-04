"use client";

import { useMemo, useState } from "react";
import { SpeakerCard } from "@/components/speakers/SpeakerCard";
import { SpeakerModal } from "@/components/speakers/SpeakerModal";
import speakers from "@/data/speakers.json";
import type { SpeakerEntry } from "@/lib/types";

const speakerEntries = speakers as SpeakerEntry[];

export default function SpeakersPage() {
  const [query, setQuery] = useState("");
  const [selectedSpeaker, setSelectedSpeaker] = useState<SpeakerEntry | null>(null);

  const filteredSpeakers = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();

    return [...speakerEntries]
      .filter((speaker) => {
        if (!normalizedQuery) return true;

        return [speaker.name, speaker.role, ...speaker.tracks]
          .join(" ")
          .toLocaleLowerCase()
          .includes(normalizedQuery);
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [query]);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="max-w-2xl">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#E91E8C]">IDEATALKS 2026</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-[#5C1A2B] sm:text-4xl">
          Meet the speakers
        </h1>
        <p className="mt-3 text-gray-600">
          Explore the people sharing ideas, stories, and practical insights at IDEATALKS.
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative block max-w-md flex-1">
          <span className="sr-only">Search speakers</span>
          <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-gray-400" aria-hidden="true">
            ⌕
          </span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name, role, or track"
            className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm text-[#1A1A1A] shadow-sm outline-none transition placeholder:text-gray-400 focus:border-[#E91E8C] focus:ring-2 focus:ring-[#E91E8C]/20"
          />
        </label>
        <p className="text-sm font-medium text-gray-600" aria-live="polite">
          {filteredSpeakers.length} speakers
        </p>
      </div>

      {filteredSpeakers.length > 0 ? (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">
          {filteredSpeakers.map((speaker) => (
            <SpeakerCard
              key={speaker.id}
              speaker={speaker}
              onClick={() => setSelectedSpeaker(speaker)}
            />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl bg-[#5C1A2B]/5 px-6 py-12 text-center">
          <p className="font-semibold text-[#5C1A2B]">No speakers found</p>
          <p className="mt-1 text-sm text-gray-600">Try a different name, role, or track.</p>
        </div>
      )}

      <SpeakerModal speaker={selectedSpeaker} onClose={() => setSelectedSpeaker(null)} />
    </section>
  );
}
