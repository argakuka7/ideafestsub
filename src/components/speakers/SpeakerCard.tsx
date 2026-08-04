import { getTrackStyle } from "@/data/tracks";
import type { SpeakerEntry } from "@/lib/types";

interface SpeakerCardProps {
  speaker: SpeakerEntry;
  onClick: () => void;
}

export function SpeakerCard({ speaker, onClick }: SpeakerCardProps) {
  const style = getTrackStyle(speaker.tracks[0] ?? "");
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full flex-col rounded-2xl bg-[var(--cream)] p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--pink)]"
      aria-label={`View ${speaker.name}'s profile`}
    >
      <div className={`mb-3 flex h-20 w-20 items-center justify-center overflow-hidden ${style.dot}`}>
        <img
          src={speaker.avatar}
          alt={speaker.name}
          loading="lazy"
          width={80}
          height={80}
          className="h-full w-full object-cover grayscale"
        />
      </div>
      <h2 className="font-bold text-[#1A1A1A]">{speaker.name}</h2>
      <p className="mt-1 line-clamp-2 min-h-10 text-sm leading-5 text-gray-600">
        {speaker.role}
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {speaker.tracks.map((track) => {
          const style = getTrackStyle(track);

          return (
            <span
              key={track}
              className={`rounded-full border px-2 py-0.5 text-xs font-medium ${style.bg} ${style.text} ${style.border}`}
            >
              {track}
            </span>
          );
        })}
      </div>
    </button>
  );
}
