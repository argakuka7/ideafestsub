"use client";

import { Icon } from "@iconify/react";
import { BookmarkButton } from "@/components/schedule/BookmarkButton";
import { getTrackStyle } from "@/data/tracks";
import { useBookmarks } from "@/lib/useBookmarks";
import type { Session } from "@/lib/types";

interface SessionCardProps {
  session: Session;
  onSelect: (session: Session) => void;
}

export function SessionCard({ session, onSelect }: SessionCardProps) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const trackStyle = getTrackStyle(session.track);
  const bookmarked = isBookmarked(session.id);

  const selectSession = () => onSelect(session);

  return (
    <article
      className={`group relative flex min-h-52 cursor-pointer flex-col rounded-2xl border ${trackStyle.border} ${trackStyle.bg} p-4 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md`}
    >
      <button
        aria-label={`Open details for ${session.title}`}
        className="flex min-h-52 flex-col pr-1 text-left focus:outline-none focus:ring-4 focus:ring-[#E91E8C]/20"
        onClick={selectSession}
        type="button"
      >
        <div className="mb-3 flex items-start justify-between gap-3 pr-8">
          <span className={`inline-flex items-center gap-2 text-xs font-bold ${trackStyle.text}`}>
            <span aria-hidden="true" className={`h-2 w-2 rounded-full ${trackStyle.dot}`} />
            {session.track}
          </span>
        </div>
        <h3 className="line-clamp-3 text-base font-extrabold leading-snug text-[#1A1A1A]">
          {session.title}
        </h3>
        <div className="mt-3 space-y-1">
          {session.speakers.map((speaker) => (
            <p className="line-clamp-1 text-sm font-medium text-gray-600" key={speaker.name}>
              {speaker.name}
            </p>
          ))}
          {session.moderator ? (
            <p className="line-clamp-1 text-xs text-gray-400">
              <span className="font-semibold uppercase tracking-wide">Moderator</span> · {session.moderator.name}
            </p>
          ) : null}
        </div>
        <div className="mt-auto flex items-center gap-2 pt-4 text-xs font-semibold text-gray-500">
          <Icon aria-hidden icon="lucide:map-pin" className="h-4 w-4" />
          {session.room}
        </div>
      </button>
      <BookmarkButton
        active={bookmarked}
        className="absolute right-3 top-3"
        onClick={() => toggleBookmark(session.id)}
      />
    </article>
  );
}
