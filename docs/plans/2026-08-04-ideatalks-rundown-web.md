# IDEATALKS Rundown Web — Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Build a static Next.js web app that visualizes the IDEATALKS event rundown (multi-day schedule, speaker directory with AI-researched bios, bookmarks) and deploys to Netlify.

**Architecture:** Next.js 15 static export (`output: 'export'`) + Tailwind CSS 4. All data is static JSON parsed from the Google Sheets source. All interactivity (filter, search, bookmark, now-playing) runs client-side with localStorage. No backend, no API. Deploy via Netlify Git auto-deploy.

**Tech Stack:** Next.js 15, React 19, Tailwind CSS 4, TypeScript, Netlify

---

## Data Model

### `data/sessions.json`

```json
[
  {
    "day": 1,
    "date": "2026-08-07",
    "dayLabel": "Day 1",
    "sessions": [
      {
        "id": "d1-s1-r0",
        "sessionNumber": 1,
        "time": "13:30-14:20",
        "timeStart": "13:30",
        "timeEnd": "14:20",
        "room": "Room Origin",
        "roomShort": "Origin",
        "title": "How to Choose and Build the Right Person for your Business?",
        "track": "Bisnis",
        "speakers": [
          { "name": "Surya Pratama", "role": "Founder of Orenji Music School | Co-Founder of Arkas Ideas" },
          { "name": "Cynthia Cecilia", "role": "Co-Founder of Jobhun" },
          { "name": "Shinta Soebijandono", "role": "Government Relations for MJC Program" }
        ],
        "moderator": { "name": "Shinta Diana", "role": "Campaign Lead of Superstar Agency" },
        "status": "confirmed"
      }
    ]
  }
]
```

### `data/speakers.json`

Auto-generated from sessions. Each speaker:

```json
{
  "id": "surya-pratama",
  "name": "Surya Pratama",
  "role": "Founder of Orenji Music School | Co-Founder of Arkas Ideas",
  "tracks": ["Bisnis"],
  "sessionIds": ["d1-s1-r0"],
  "bio": "",
  "bioStatus": "pending"
}
```

### Track Color Map

```ts
const TRACK_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  "Bisnis":           { bg: "bg-red-50",    text: "text-red-700",    dot: "bg-red-500" },
  "FnB":              { bg: "bg-orange-50", text: "text-orange-700", dot: "bg-orange-500" },
  "Art & Culture":    { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500" },
  "Content":          { bg: "bg-blue-50",   text: "text-blue-700",   dot: "bg-blue-500" },
  "Teknologi":        { bg: "bg-green-50",  text: "text-green-700",  dot: "bg-green-500" },
  "Self Development": { bg: "bg-pink-50",   text: "text-pink-700",   dot: "bg-pink-500" },
  "Mental Health":    { bg: "bg-teal-50",   text: "text-teal-700",   dot: "bg-teal-500" },
  "Policy Making":    { bg: "bg-indigo-50", text: "text-indigo-700", dot: "bg-indigo-500" },
};
```

---

## Task 1: Scaffold Next.js + Tailwind Project

**Objective:** Create the base Next.js 15 static export project with Tailwind CSS 4.

**Files:**
- Create: `ideatalks-rundown/` (project root)

**Step 1: Create project**

```bash
cd /root
npx create-next-app@latest ideatalks-rundown \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --no-turbopack
```

**Step 2: Configure static export**

Edit `src/app/next.config.ts`:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
```

**Step 3: Add Netlify config**

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "out"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

**Step 4: Verify build**

```bash
cd /root/ideatalks-rundown
npm run build
# Verify: out/ directory created with index.html
```

**Step 5: Commit**

```bash
git init
git add -A
git commit -m "chore: scaffold next.js static export project"
```

---

## Task 2: Create Data Files (sessions.json + speakers.json)

**Objective:** Parse the Google Sheets CSV into structured JSON files with all Day 1 data (5 sessions × 8 rooms = 40 sessions).

**Files:**
- Create: `src/data/sessions.json`
- Create: `src/data/speakers.json`
- Create: `src/data/tracks.ts`

**Step 1: Create tracks.ts**

```ts
// src/data/tracks.ts
export const TRACK_COLORS: Record<string, { bg: string; text: string; dot: string; border: string }> = {
  "Bisnis":           { bg: "bg-red-50",    text: "text-red-700",    dot: "bg-red-500",    border: "border-red-200" },
  "FnB":              { bg: "bg-orange-50", text: "text-orange-700", dot: "bg-orange-500", border: "border-orange-200" },
  "Art & Culture":    { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500", border: "border-purple-200" },
  "Content":          { bg: "bg-blue-50",   text: "text-blue-700",   dot: "bg-blue-500",   border: "border-blue-200" },
  "Teknologi":        { bg: "bg-green-50",  text: "text-green-700",  dot: "bg-green-500",  border: "border-green-200" },
  "Self Development": { bg: "bg-pink-50",   text: "text-pink-700",   dot: "bg-pink-500",   border: "border-pink-200" },
  "Mental Health":    { bg: "bg-teal-50",   text: "text-teal-700",   dot: "bg-teal-500",   border: "border-teal-200" },
  "Policy Making":    { bg: "bg-indigo-50", text: "text-indigo-700", dot: "bg-indigo-500", border: "border-indigo-200" },
};

export const ALL_TRACKS = Object.keys(TRACK_COLORS);

export function getTrackStyle(track: string) {
  // Handle composite tracks like "Art & Culture x Bisnis"
  const primary = track.split(/[\/x&]/)[0].trim();
  return TRACK_COLORS[primary] ?? TRACK_COLORS["Bisnis"];
}
```

**Step 2: Create sessions.json**

Parse all 5 sessions from the spreadsheet data. Each session has 8 room entries. See data model above for structure. Include all sessions:

- Session 1: 13:30-14:20
- Session 2: 14:30-15:20
- Session 3: 15:30-16:20
- Session 4: 16:30-17:20
- Session 5: 17:30-18:20

Every room entry needs: `id`, `sessionNumber`, `time`, `timeStart`, `timeEnd`, `room`, `roomShort`, `title`, `track`, `speakers[]`, `moderator`, `status`.

**Step 3: Create speakers.json**

Dedupe all speakers across sessions. Generate slug IDs from names. Link sessionIds. `bioStatus: "pending"` for all.

**Step 4: Verify**

```bash
# Verify JSON is valid
node -e "const d = require('./src/data/sessions.json'); console.log(d[0].sessions.length, 'sessions in day 1')"
# Expected: 40 sessions (5 time slots × 8 rooms)
```

**Step 5: Commit**

```bash
git add src/data/
git commit -m "feat: add structured event data (sessions + speakers)"
```

---

## Task 3: Layout Shell + Navigation + Sticky Footer

**Objective:** Create the app shell with header, navigation, and sticky "Built by Argakuka" footer.

**Files:**
- Modify: `src/app/layout.tsx`
- Create: `src/components/Header.tsx`
- Create: `src/components/Footer.tsx`
- Create: `src/components/Navigation.tsx`

**Step 1: Layout**

```tsx
// src/app/layout.tsx
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "IDEATALKS — Event Rundown",
  description: "IDEATALKS 2026 event schedule, speakers, and sessions",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} min-h-screen flex flex-col bg-white`}>
        <Header />
        <main className="flex-1 pb-20">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

**Step 2: Header**

```tsx
// src/components/Header.tsx
import Link from "next/link";
import { Navigation } from "./Navigation";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-black tracking-tight">
              <span className="text-[#FF3B3B]">IDEA</span>
              <span className="text-[#8338EC]">TALKS</span>
            </span>
          </Link>
          <Navigation />
        </div>
      </div>
    </header>
  );
}
```

**Step 3: Navigation**

```tsx
// src/components/Navigation.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Schedule" },
  { href: "/speakers", label: "Speakers" },
  { href: "/bookmarks", label: "Saved" },
];

export function Navigation() {
  const pathname = usePathname();
  return (
    <nav className="flex items-center gap-1">
      {LINKS.map((link) => {
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
              active
                ? "bg-[#E91E8C] text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
```

**Step 4: Footer (sticky)**

```tsx
// src/components/Footer.tsx
export function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 bg-[#5C1A2B] text-white">
      <div className="mx-auto max-w-7xl px-4 py-2 flex items-center justify-between">
        <span className="text-xs text-white/70">IDEATALKS 2026 · ReHumanize</span>
        <a
          href="https://argakuka.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold text-white hover:text-[#FFD60A] transition-colors"
        >
          Built by Argakuka
        </a>
      </div>
    </footer>
  );
}
```

**Step 5: Verify build**

```bash
npm run build
# Check: out/index.html exists, no errors
```

**Step 6: Commit**

```bash
git add src/app/layout.tsx src/components/
git commit -m "feat: add layout shell, navigation, sticky argakuka footer"
```

---

## Task 4: Schedule Page — Day Toggle + Time Slot Grid

**Objective:** Build the main schedule page with day toggle, time slots, and room cards.

**Files:**
- Modify: `src/app/page.tsx`
- Create: `src/components/schedule/DayToggle.tsx`
- Create: `src/components/schedule/TimeSlot.tsx`
- Create: `src/components/schedule/SessionCard.tsx`
- Create: `src/lib/types.ts`

**Step 1: Types**

```ts
// src/lib/types.ts
export interface Speaker {
  name: string;
  role: string;
}

export interface Moderator {
  name: string;
  role: string;
}

export interface Session {
  id: string;
  day: number;
  date: string;
  sessionNumber: number;
  time: string;
  timeStart: string;
  timeEnd: string;
  room: string;
  roomShort: string;
  title: string;
  track: string;
  speakers: Speaker[];
  moderator?: Moderator;
  status: string;
}

export interface DayData {
  day: number;
  date: string;
  dayLabel: string;
  sessions: Session[];
}
```

**Step 2: DayToggle**

```tsx
// src/components/schedule/DayToggle.tsx
"use client";

interface Props {
  days: { day: number; dayLabel: string; date: string }[];
  activeDay: number;
  onChange: (day: number) => void;
}

export function DayToggle({ days, activeDay, onChange }: Props) {
  return (
    <div className="flex gap-2">
      {days.map((d) => (
        <button
          key={d.day}
          onClick={() => onChange(d.day)}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            activeDay === d.day
              ? "bg-[#1A1A1A] text-white shadow-lg"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {d.dayLabel}
          <span className="block text-[10px] font-normal opacity-70">
            {new Date(d.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
          </span>
        </button>
      ))}
    </div>
  );
}
```

**Step 3: SessionCard**

```tsx
// src/components/schedule/SessionCard.tsx
"use client";
import { Session } from "@/lib/types";
import { getTrackStyle } from "@/data/tracks";
import { BookmarkButton } from "./BookmarkButton";

interface Props {
  session: Session;
  isBookmarked: (id: string) => boolean;
  onToggleBookmark: (id: string) => void;
  onClick: (session: Session) => void;
}

export function SessionCard({ session, isBookmarked, onToggleBookmark, onClick }: Props) {
  const style = getTrackStyle(session.track);
  return (
    <div
      onClick={() => onClick(session)}
      className={`group relative cursor-pointer rounded-xl border ${style.border} ${style.bg} p-4 transition-all hover:shadow-md`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5">
          <span className={`inline-block w-2 h-2 rounded-full ${style.dot}`} />
          <span className={`text-[10px] font-bold uppercase tracking-wide ${style.text}`}>
            {session.track}
          </span>
        </div>
        <BookmarkButton
          active={isBookmarked(session.id)}
          onClick={(e) => { e.stopPropagation(); onToggleBookmark(session.id); }}
        />
      </div>

      <h3 className="text-sm font-bold text-gray-900 leading-snug mb-2 line-clamp-3">
        {session.title}
      </h3>

      <div className="space-y-0.5">
        {session.speakers.map((s, i) => (
          <p key={i} className="text-xs text-gray-600 line-clamp-1">
            {s.name}
          </p>
        ))}
      </div>

      <div className="mt-2 pt-2 border-t border-black/5">
        <p className="text-[10px] font-semibold text-gray-400">
          📍 {session.room}
        </p>
      </div>
    </div>
  );
}
```

**Step 4: TimeSlot**

```tsx
// src/components/schedule/TimeSlot.tsx
"use client";
import { Session } from "@/lib/types";
import { SessionCard } from "./SessionCard";

interface Props {
  time: string;
  sessions: Session[];
  isBookmarked: (id: string) => boolean;
  onToggleBookmark: (id: string) => void;
  onSessionClick: (session: Session) => void;
  isNowPlaying: boolean;
}

export function TimeSlot({ time, sessions, isBookmarked, onToggleBookmark, onSessionClick, isNowPlaying }: Props) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-3 sticky top-14 z-30 bg-white/95 backdrop-blur py-2">
        <div className={`flex items-center gap-2 ${isNowPlaying ? "animate-pulse" : ""}`}>
          {isNowPlaying && <span className="flex w-2 h-2 rounded-full bg-[#E91E8C]" />}
          <h2 className="text-base font-black text-gray-900">{time}</h2>
          {isNowPlaying && (
            <span className="text-[10px] font-bold text-[#E91E8C] uppercase">Now Playing</span>
          )}
        </div>
        <div className="flex-1 h-px bg-gray-200" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {sessions.map((session) => (
          <SessionCard
            key={session.id}
            session={session}
            isBookmarked={isBookmarked}
            onToggleBookmark={onToggleBookmark}
            onClick={onSessionClick}
          />
        ))}
      </div>
    </div>
  );
}
```

**Step 5: Main schedule page**

```tsx
// src/app/page.tsx
"use client";
import { useState, useMemo, useEffect } from "react";
import sessionsData from "@/data/sessions.json";
import { DayToggle } from "@/components/schedule/DayToggle";
import { TimeSlot } from "@/components/schedule/TimeSlot";
import { SearchBar } from "@/components/schedule/SearchBar";
import { TrackFilter } from "@/components/schedule/TrackFilter";
import { SessionModal } from "@/components/schedule/SessionModal";
import { useBookmarks } from "@/lib/useBookmarks";
import type { DayData, Session } from "@/lib/types";

export default function SchedulePage() {
  const days = sessionsData as DayData[];
  const [activeDay, setActiveDay] = useState(1);
  const [search, setSearch] = useState("");
  const [activeTracks, setActiveTracks] = useState<string[]>([]);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const { isBookmarked, toggleBookmark } = useBookmarks();

  const dayData = days.find((d) => d.day === activeDay);

  // Group by session number (time slot)
  const timeSlots = useMemo(() => {
    if (!dayData) return [];
    const grouped: Record<number, Session[]> = {};
    dayData.sessions.forEach((s) => {
      if (!grouped[s.sessionNumber]) grouped[s.sessionNumber] = [];
      grouped[s.sessionNumber].push(s);
    });
    return Object.entries(grouped).map(([num, sessions]) => ({
      sessionNumber: Number(num),
      time: sessions[0].time,
      sessions: sessions.filter((s) => {
        if (activeTracks.length && !activeTracks.some(t => s.track.includes(t))) return false;
        if (search) {
          const q = search.toLowerCase();
          const matchTitle = s.title.toLowerCase().includes(q);
          const matchSpeaker = s.speakers.some(sp => sp.name.toLowerCase().includes(q));
          if (!matchTitle && !matchSpeaker) return false;
        }
        return true;
      }),
    }));
  }, [dayData, activeTracks, search]);

  // Now playing logic
  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-6">
      {/* Day Toggle */}
      <div className="mb-4">
        <DayToggle days={days} activeDay={activeDay} onChange={setActiveDay} />
      </div>

      {/* Search + Filter */}
      <div className="mb-6 space-y-3">
        <SearchBar value={search} onChange={setSearch} />
        <TrackFilter active={activeTracks} onChange={setActiveTracks} />
      </div>

      {/* Time Slots */}
      {timeSlots.map((slot) => (
        <TimeSlot
          key={slot.sessionNumber}
          time={slot.time}
          sessions={slot.sessions}
          isBookmarked={isBookmarked}
          onToggleBookmark={toggleBookmark}
          onSessionClick={setSelectedSession}
          isNowPlaying={false}
        />
      ))}

      {/* Session Detail Modal */}
      {selectedSession && (
        <SessionModal
          session={selectedSession}
          isBookmarked={isBookmarked(selectedSession.id)}
          onToggleBookmark={() => toggleBookmark(selectedSession.id)}
          onClose={() => setSelectedSession(null)}
        />
      )}
    </div>
  );
}
```

**Step 6: Verify build**

```bash
npm run build
```

**Step 7: Commit**

```bash
git add -A
git commit -m "feat: schedule page with day toggle, time slots, session cards"
```

---

## Task 5: Search, Filter, Bookmark, Modal Components

**Objective:** Build the interactive components for search, track filter, bookmarks, and session detail modal.

**Files:**
- Create: `src/components/schedule/SearchBar.tsx`
- Create: `src/components/schedule/TrackFilter.tsx`
- Create: `src/components/schedule/BookmarkButton.tsx`
- Create: `src/components/schedule/SessionModal.tsx`
- Create: `src/lib/useBookmarks.ts`

**Step 1: useBookmarks hook**

```ts
// src/lib/useBookmarks.ts
"use client";
import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "ideatalks-bookmarks";

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setBookmarks(JSON.parse(stored));
    } catch {}
  }, []);

  const save = useCallback((ids: string[]) => {
    setBookmarks(ids);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(ids)); } catch {}
  }, []);

  const isBookmarked = useCallback((id: string) => bookmarks.includes(id), [bookmarks]);

  const toggleBookmark = useCallback((id: string) => {
    setBookmarks((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  return { bookmarks, isBookmarked, toggleBookmark };
}
```

**Step 2: SearchBar**

```tsx
// src/components/schedule/SearchBar.tsx
"use client";

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export function SearchBar({ value, onChange }: Props) {
  return (
    <div className="relative">
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search talks or speakers..."
        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E91E8C]/30 focus:border-[#E91E8C]"
      />
    </div>
  );
}
```

**Step 3: TrackFilter**

```tsx
// src/components/schedule/TrackFilter.tsx
"use client";
import { ALL_TRACKS, TRACK_COLORS } from "@/data/tracks";

interface Props {
  active: string[];
  onChange: (tracks: string[]) => void;
}

export function TrackFilter({ active, onChange }: Props) {
  const toggle = (track: string) => {
    if (active.includes(track)) {
      onChange(active.filter((t) => t !== track));
    } else {
      onChange([...active, track]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange([])}
        className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
          active.length === 0 ? "bg-[#1A1A1A] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
      >
        All Tracks
      </button>
      {ALL_TRACKS.map((track) => {
        const style = TRACK_COLORS[track];
        const isActive = active.includes(track);
        return (
          <button
            key={track}
            onClick={() => toggle(track)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-all ${
              isActive
                ? `${style.bg} ${style.text} ${style.border}`
                : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${style.dot}`} />
            {track}
          </button>
        );
      })}
    </div>
  );
}
```

**Step 4: BookmarkButton**

```tsx
// src/components/schedule/BookmarkButton.tsx
"use client";

interface Props {
  active: boolean;
  onClick: (e: React.MouseEvent) => void;
}

export function BookmarkButton({ active, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      aria-label="Bookmark session"
      className={`p-1 rounded-lg transition-colors ${
        active ? "text-[#E91E8C]" : "text-gray-300 hover:text-gray-500"
      }`}
    >
      <svg className="w-4 h-4" fill={active ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
      </svg>
    </button>
  );
}
```

**Step 5: SessionModal**

```tsx
// src/components/schedule/SessionModal.tsx
"use client";
import { Session } from "@/lib/types";
import { getTrackStyle } from "@/data/tracks";
import { BookmarkButton } from "./BookmarkButton";

interface Props {
  session: Session;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onClose: () => void;
}

export function SessionModal({ session, isBookmarked, onToggleBookmark, onClose }: Props) {
  const style = getTrackStyle(session.track);
  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl"
      >
        {/* Header */}
        <div className={`p-5 ${style.bg} rounded-t-3xl`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${style.dot}`} />
              <span className={`text-xs font-bold uppercase ${style.text}`}>{session.track}</span>
            </div>
            <div className="flex gap-2">
              <BookmarkButton active={isBookmarked} onClick={(e) => { e.stopPropagation(); onToggleBookmark(); }} />
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <h2 className="text-lg font-black text-gray-900 mt-3">{session.title}</h2>
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
            <span>🕒 {session.time}</span>
            <span>📍 {session.room}</span>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <div>
            <h3 className="text-xs font-bold uppercase text-gray-400 mb-2">Speakers</h3>
            <div className="space-y-3">
              {session.speakers.map((s, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF3B3B] to-[#8338EC] flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {s.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{s.name}</p>
                    <p className="text-xs text-gray-500">{s.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {session.moderator && (
            <div>
              <h3 className="text-xs font-bold uppercase text-gray-400 mb-2">Moderator</h3>
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-bold shrink-0">
                  {session.moderator.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{session.moderator.name}</p>
                  <p className="text-xs text-gray-500">{session.moderator.role}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

**Step 6: Verify build**

```bash
npm run build
```

**Step 7: Commit**

```bash
git add -A
git commit -m "feat: search, track filter, bookmarks, session detail modal"
```

---

## Task 6: Speaker Directory Page

**Objective:** Build `/speakers` page with grid of all speakers, search, filter, and bio modal.

**Files:**
- Create: `src/app/speakers/page.tsx`
- Create: `src/components/speakers/SpeakerCard.tsx`
- Create: `src/components/speakers/SpeakerModal.tsx`

**Step 1: SpeakerCard**

```tsx
// src/components/speakers/SpeakerCard.tsx
"use client";

interface Props {
  speaker: {
    id: string;
    name: string;
    role: string;
    tracks: string[];
    bioStatus: string;
    bio?: string;
  };
  onClick: () => void;
}

export function SpeakerCard({ speaker, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="text-left bg-[#5C1A2B]/5 rounded-xl p-4 border border-[#5C1A2B]/10 hover:bg-[#5C1A2B]/10 transition-all"
    >
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF3B3B] via-[#E91E8C] to-[#8338EC] flex items-center justify-center text-white font-black text-lg mb-3">
        {speaker.name.charAt(0)}
      </div>
      <h3 className="text-sm font-bold text-gray-900 leading-snug">{speaker.name}</h3>
      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{speaker.role}</p>
      <div className="flex flex-wrap gap-1 mt-2">
        {speaker.tracks.map((t) => (
          <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-white/80 text-gray-600 border border-gray-200">
            {t}
          </span>
        ))}
      </div>
    </button>
  );
}
```

**Step 2: SpeakerModal**

```tsx
// src/components/speakers/SpeakerModal.tsx
"use client";
import { getTrackStyle } from "@/data/tracks";

interface Props {
  speaker: {
    id: string;
    name: string;
    role: string;
    tracks: string[];
    bio?: string;
    bioStatus: string;
    sessionIds: string[];
  };
  onClose: () => void;
}

export function SpeakerModal({ speaker, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md max-h-[85vh] overflow-y-auto shadow-2xl"
      >
        <div className="bg-[#5C1A2B] p-6 rounded-t-3xl text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF3B3B] via-[#E91E8C] to-[#8338EC] flex items-center justify-center text-white font-black text-2xl mx-auto mb-3">
            {speaker.name.charAt(0)}
          </div>
          <h2 className="text-lg font-black text-white">{speaker.name}</h2>
          <p className="text-xs text-white/70 mt-1">{speaker.role}</p>
        </div>
        <div className="p-5 space-y-4">
          {speaker.bio ? (
            <p className="text-sm text-gray-700 leading-relaxed">{speaker.bio}</p>
          ) : (
            <p className="text-sm text-gray-400 italic">Bio coming soon</p>
          )}

          <div className="flex flex-wrap gap-1.5">
            {speaker.tracks.map((t) => {
              const style = getTrackStyle(t);
              return (
                <span key={t} className={`text-[10px] px-2 py-1 rounded-full font-bold ${style.bg} ${style.text}`}>
                  {t}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Step 3: Speakers page**

```tsx
// src/app/speakers/page.tsx
"use client";
import { useState, useMemo } from "react";
import speakersData from "@/data/speakers.json";
import { SpeakerCard } from "@/components/speakers/SpeakerCard";
import { SpeakerModal } from "@/components/speakers/SpeakerModal";
import { SearchBar } from "@/components/schedule/SearchBar";

export default function SpeakersPage() {
  const speakers = speakersData as any[];
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<any>(null);

  const filtered = useMemo(() => {
    if (!search) return speakers.sort((a, b) => a.name.localeCompare(b.name));
    const q = search.toLowerCase();
    return speakers
      .filter((s) => s.name.toLowerCase().includes(q) || s.role.toLowerCase().includes(q))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [speakers, search]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-6">
      <h1 className="text-2xl font-black text-gray-900 mb-1">Speakers</h1>
      <p className="text-sm text-gray-500 mb-4">{filtered.length} speakers</p>

      <div className="mb-6">
        <SearchBar value={search} onChange={setSearch} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {filtered.map((speaker) => (
          <SpeakerCard key={speaker.id} speaker={speaker} onClick={() => setSelected(speaker)} />
        ))}
      </div>

      {selected && (
        <SpeakerModal speaker={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
```

**Step 4: Verify build**

```bash
npm run build
```

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: speaker directory page with grid, search, bio modal"
```

---

## Task 7: Bookmarks Page

**Objective:** Build `/bookmarks` page showing bookmarked sessions grouped by day.

**Files:**
- Create: `src/app/bookmarks/page.tsx`
- Create: `src/components/schedule/BookmarkedSessionCard.tsx`

**Step 1: Bookmarks page**

```tsx
// src/app/bookmarks/page.tsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import sessionsData from "@/data/sessions.json";
import { useBookmarks } from "@/lib/useBookmarks";
import { SessionCard } from "@/components/schedule/SessionCard";
import type { DayData, Session } from "@/lib/types";

export default function BookmarksPage() {
  const days = sessionsData as DayData[];
  const { bookmarks, isBookmarked, toggleBookmark } = useBookmarks();
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const allSessions = days.flatMap((d) => d.sessions);
  const bookmarked = allSessions.filter((s) => bookmarks.includes(s.id));
  const byDay = days.map((d) => ({
    ...d,
    sessions: bookmarked.filter((s) => s.day === d.day),
  })).filter((d) => d.sessions.length > 0);

  if (!mounted) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-6">
      <h1 className="text-2xl font-black text-gray-900 mb-1">Saved Sessions</h1>
      <p className="text-sm text-gray-500 mb-6">
        {bookmarked.length === 0
          ? "No saved sessions yet"
          : `${bookmarked.length} session${bookmarked.length > 1 ? "s" : ""} saved`}
      </p>

      {bookmarked.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm mb-4">Bookmark sessions to find them here</p>
          <Link href="/" className="inline-flex px-5 py-2.5 rounded-full bg-[#E91E8C] text-white text-sm font-bold hover:bg-[#d11a7a]">
            Browse Schedule
          </Link>
        </div>
      ) : (
        byDay.map((d) => (
          <div key={d.day} className="mb-8">
            <h2 className="text-base font-black text-gray-900 mb-3">{d.dayLabel}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {d.sessions.map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  isBookmarked={isBookmarked}
                  onToggleBookmark={toggleBookmark}
                  onClick={setSelectedSession}
                />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
```

**Step 2: Verify build**

```bash
npm run build
```

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: bookmarks page with grouped saved sessions"
```

---

## Task 8: Now-Playing Logic

**Objective:** Add real-time "now playing" detection to highlight currently-running sessions.

**Files:**
- Modify: `src/app/page.tsx`

**Step 1: Add now-playing calculation**

Add to the schedule page component, before the return:

```tsx
// Inside SchedulePage component
const [currentTime, setCurrentTime] = useState("");

useEffect(() => {
  const update = () => {
    const now = new Date();
    setCurrentTime(`${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`);
  };
  update();
  const interval = setInterval(update, 60000); // Update every minute
  return () => clearInterval(interval);
}, []);

const isTimeSlotNowPlaying = (timeStart: string, timeEnd: string) => {
  if (!currentTime) return false;
  return currentTime >= timeStart && currentTime < timeEnd;
};
```

Then pass `isNowPlaying` to each TimeSlot using the slot's first session's `timeStart`/`timeEnd`.

**Step 2: Verify**

```bash
npm run build
```

**Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: real-time now-playing indicator"
```

---

## Task 9: Global Styles & Polish

**Objective:** Apply IdeaFest branding polish, mobile-first responsive tweaks, and ensure the sticky footer doesn't overlap content.

**Files:**
- Modify: `src/app/globals.css`

**Step 1: Global CSS**

```css
/* src/app/globals.css */
@import "tailwindcss";

html {
  -webkit-text-size-adjust: 100%;
  scroll-padding-top: 3.5rem;
}

body {
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
}

/* Hide scrollbar for filter chips */
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

/* Line clamp utilities */
.line-clamp-1, .line-clamp-2, .line-clamp-3 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.line-clamp-1 { -webkit-line-clamp: 1; }
.line-clamp-2 { -webkit-line-clamp: 2; }
.line-clamp-3 { -webkit-line-clamp: 3; }

/* Smooth modal entrance */
@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
.animate-slide-up { animation: slideUp 0.25s ease-out; }

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate-fade-in { animation: fadeIn 0.2s ease-out; }
```

**Step 2: Verify build**

```bash
npm run build
```

**Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "style: global styles, line-clamp, animations, mobile polish"
```

---

## Task 10: Speaker Bio Research Pipeline

**Objective:** AI-research all unique speakers from the data and generate short bios (2-3 sentences each).

**Files:**
- Modify: `src/data/speakers.json` (fill in `bio` field)

**Step 1: Extract unique speaker names**

Collect all speaker names + roles from `sessions.json`.

**Step 2: Research each speaker**

For each speaker, search the web using their name + role keywords. Generate a 2-3 sentence bio covering:
- Who they are (current role)
- Key achievements / companies founded
- Notable public presence (if any)

**Step 3: Update speakers.json**

Set `bioStatus: "researched"` and fill `bio` for each speaker.

**Step 4: Commit**

```bash
git add src/data/speakers.json
git commit -m "feat: add AI-researched speaker bios"
```

---

## Task 11: Netlify Deployment

**Objective:** Deploy the static export to Netlify.

**Step 1: Push to GitHub**

```bash
gh repo create ideatalks-rundown --public --source=. --push
```

**Step 2: Connect to Netlify**

Either:
- Netlify dashboard: New site from Git → select repo
- Or Netlify CLI:

```bash
npm i -g netlify-cli
netlify deploy --prod
```

**Build config (auto from netlify.toml):**
- Build command: `npm run build`
- Publish dir: `out`

**Step 3: Verify deployment**

- Check site URL loads
- Test day toggle, search, filter, bookmark
- Test mobile view

**Step 4: Commit & tag**

```bash
git tag v1.0.0
git push origin v1.0.0
```

---

## Pitfalls

1. **Static export + client components**: Every page using hooks (`useState`, `useEffect`, `usePathname`) must have `"use client"` at the top. Forgetting this = build error or hydration mismatch.
2. **localStorage SSR**: Guard localStorage access in `useEffect`. Accessing during render = crash in static export.
3. **`trailingSlash: true`**: Required for Netlify to serve `/speakers/` and `/bookmarks/` correctly from static export.
4. **Image optimization**: Disabled (`images: { unoptimized: true }`) because static export doesn't have the Next.js image server.
5. **Footer overlap**: The fixed footer needs `pb-20` on `<main>` to prevent content hiding behind it.
6. **Composite tracks**: Tracks like "Art & Culture x Bisnis" — the `getTrackStyle` function splits on `x/` and uses the primary track for coloring.
7. **Day 2+ data**: The JSON structure supports multi-day. When Day 2 data arrives, just append to `sessions.json`.
8. **`Date` in server components**: Static export pre-renders at build time. Any `new Date()` in render will be frozen at build time. Now-playing must be client-side only.
