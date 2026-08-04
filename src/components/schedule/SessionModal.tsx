"use client";

import { useEffect } from "react";
import { Icon } from "@iconify/react";
import { BookmarkButton } from "@/components/schedule/BookmarkButton";
import { getTrackStyle } from "@/data/tracks";
import { useBookmarks } from "@/lib/useBookmarks";
import type { Session } from "@/lib/types";

interface SessionModalProps {
  session: Session | null;
  onClose: () => void;
}

export function SessionModal({ session, onClose }: SessionModalProps) {
  const { isBookmarked, toggleBookmark } = useBookmarks();

  useEffect(() => {
    if (!session) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [onClose, session]);

  if (!session) return null;

  const trackStyle = getTrackStyle(session.track);
  const bookmarked = isBookmarked(session.id);

  return (
    <div className="animate-fade-in fixed inset-0 z-[70] flex items-end bg-black/45 p-0 sm:items-center sm:justify-center sm:p-6" onMouseDown={onClose}>
      <section
        aria-describedby="session-details"
        aria-labelledby="session-title"
        aria-modal="true"
        className="animate-slide-up max-h-[90vh] w-full overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:max-w-2xl sm:rounded-3xl"
        onMouseDown={(event) => event.stopPropagation()}
        role="dialog"
      >
        <div className={`${trackStyle.bg} ${trackStyle.border} border-b px-5 pb-6 pt-5 sm:px-7 sm:pb-7 sm:pt-7`}>
          <div className="mb-5 flex items-center justify-between gap-3">
            <span className={`inline-flex items-center gap-2 text-xs font-extrabold ${trackStyle.text}`}>
              <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full ${trackStyle.dot}`} />
              {session.track}
            </span>
            <div className="flex items-center gap-2">
              <BookmarkButton active={bookmarked} onClick={() => toggleBookmark(session.id)} />
              <button
                aria-label="Close session details"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white/80 text-gray-600 transition hover:bg-white hover:text-[#1A1A1A] focus:outline-none focus:ring-4 focus:ring-[#E91E8C]/20"
                onClick={onClose}
                type="button"
              >
                <Icon aria-hidden icon="lucide:x" className="h-5 w-5" />
              </button>
            </div>
          </div>
          <h2 className="text-2xl font-black leading-tight text-[#1A1A1A] sm:text-3xl" id="session-title">
            {session.title}
          </h2>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-gray-600">
            <span className="inline-flex items-center gap-2">
              <Icon aria-hidden icon="lucide:clock" className="h-4 w-4" />
              {session.time}
            </span>
            <span className="inline-flex items-center gap-2">
              <Icon aria-hidden icon="lucide:map-pin" className="h-4 w-4" />
              {session.room}
            </span>
          </div>
        </div>

        <div className="space-y-7 px-5 py-6 sm:px-7 sm:py-7" id="session-details">
          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.14em] text-gray-500">Speakers</h3>
            <ul className="mt-4 space-y-4">
              {session.speakers.map((speaker, index) => (
                <li className="flex items-center gap-3" key={speaker.name}>
                  <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-base font-black text-white ${index % 2 === 0 ? "from-[#E91E8C] to-[#8338EC]" : "from-[#FF7A59] to-[#E91E8C]"}`}>
                    {speaker.name.charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <p className="font-bold text-[#1A1A1A]">{speaker.name}</p>
                    <p className="line-clamp-2 mt-0.5 text-sm leading-snug text-gray-500">{speaker.role}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {session.moderator ? (
            <div className="rounded-2xl bg-gray-50 p-4">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-gray-500">Moderator</p>
              <div className="mt-3 flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#1A1A1A] to-gray-500 text-sm font-black text-white">
                  {session.moderator.name.charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="font-bold text-[#1A1A1A]">{session.moderator.name}</p>
                  <p className="line-clamp-1 mt-0.5 text-sm text-gray-500">{session.moderator.role}</p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
