"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "ideatalks-bookmarks";
const CHANGE_EVENT = "ideatalks-bookmarks-change";

function readBookmarks(): string[] {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed)
      ? parsed.filter((value): value is string => typeof value === "string")
      : [];
  } catch {
    return [];
  }
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const syncBookmarks = () => setBookmarks(readBookmarks());

    syncBookmarks();
    setMounted(true);
    window.addEventListener("storage", syncBookmarks);
    window.addEventListener(CHANGE_EVENT, syncBookmarks);

    return () => {
      window.removeEventListener("storage", syncBookmarks);
      window.removeEventListener(CHANGE_EVENT, syncBookmarks);
    };
  }, []);

  const isBookmarked = useCallback(
    (id: string) => bookmarks.includes(id),
    [bookmarks],
  );

  const toggleBookmark = useCallback((id: string) => {
    setBookmarks((current) => {
      const next = current.includes(id)
        ? current.filter((bookmark) => bookmark !== id)
        : [...current, id];

      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        window.dispatchEvent(new Event(CHANGE_EVENT));
      } catch {
        // The schedule remains usable if storage is disabled or unavailable.
      }

      return next;
    });
  }, []);

  return { bookmarks, isBookmarked, mounted, toggleBookmark };
}
