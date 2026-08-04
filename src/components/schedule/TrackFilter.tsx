"use client";

import { ALL_TRACKS, TRACK_COLORS } from "@/data/tracks";

interface TrackFilterProps {
  activeTracks: string[];
  onChange: (tracks: string[]) => void;
}

export function TrackFilter({ activeTracks, onChange }: TrackFilterProps) {
  const toggleTrack = (track: string) => {
    onChange(
      activeTracks.includes(track)
        ? activeTracks.filter((activeTrack) => activeTrack !== track)
        : [...activeTracks, track],
    );
  };

  return (
    <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0" aria-label="Filter by track" role="group">
      <button
        aria-pressed={activeTracks.length === 0}
        className={`shrink-0 rounded-full border px-3 py-2 text-sm font-semibold transition ${
          activeTracks.length === 0
            ? "border-[#1A1A1A] bg-[#1A1A1A] text-white"
            : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:text-[#1A1A1A]"
        }`}
        onClick={() => onChange([])}
        type="button"
      >
        All Tracks
      </button>
      {ALL_TRACKS.map((track) => {
        const active = activeTracks.includes(track);
        const colors = TRACK_COLORS[track];

        return (
          <button
            aria-pressed={active}
            className={`flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold transition ${
              active
                ? `${colors.bg} ${colors.border} ${colors.text}`
                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
            }`}
            key={track}
            onClick={() => toggleTrack(track)}
            type="button"
          >
            <span aria-hidden="true" className={`h-2 w-2 rounded-full ${colors.dot}`} />
            {track}
          </button>
        );
      })}
    </div>
  );
}
