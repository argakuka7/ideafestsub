"use client";

import { useEffect } from "react";
import { getTrackStyle } from "@/data/tracks";
import type { SpeakerEntry } from "@/lib/types";

interface SpeakerModalProps {
  speaker: SpeakerEntry | null;
  onClose: () => void;
}

export function SpeakerModal({ speaker, onClose }: SpeakerModalProps) {
  useEffect(() => {
    if (!speaker) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, speaker]);

  if (!speaker) return null;

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/50 p-0 sm:flex sm:items-center sm:justify-center sm:p-6"
      onClick={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="speaker-modal-title"
        className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:static sm:w-full sm:max-w-lg sm:rounded-3xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative overflow-hidden rounded-t-3xl bg-[#5C1A2B] px-6 pb-7 pt-8 text-white sm:rounded-t-3xl">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-xl leading-none transition hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            aria-label="Close speaker profile"
          >
            <span aria-hidden="true">×</span>
          </button>
          <div className="flex items-center gap-4 pr-9">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#FF3B3B] via-[#E91E8C] to-[#8338EC] text-3xl font-bold shadow-lg">
              {speaker.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 id="speaker-modal-title" className="text-2xl font-bold tracking-tight">
                {speaker.name}
              </h2>
              <p className="mt-1 text-sm leading-5 text-white/80">{speaker.role}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6 px-6 py-6">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-[#5C1A2B]">About</h3>
            <p className="mt-2 whitespace-pre-line leading-7 text-gray-700">
              {speaker.bio.trim() || "Bio coming soon"}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-[#5C1A2B]">Tracks</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {speaker.tracks.map((track) => {
                const style = getTrackStyle(track);

                return (
                  <span
                    key={track}
                    className={`rounded-full border px-3 py-1 text-sm font-medium ${style.bg} ${style.text} ${style.border}`}
                  >
                    {track}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
