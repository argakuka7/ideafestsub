"use client";

import type { DayData } from "@/lib/types";

interface DayToggleProps {
  activeDay: number;
  days: Pick<DayData, "day" | "date" | "dayLabel">[];
  onChange: (day: number) => void;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", { day: "numeric", month: "short" }).format(
    new Date(`${date}T12:00:00`),
  );
}

export function DayToggle({ activeDay, days, onChange }: DayToggleProps) {
  return (
    <div className="inline-flex rounded-2xl bg-gray-100 p-1" role="tablist" aria-label="Schedule day">
      {days.map((day) => {
        const active = day.day === activeDay;

        return (
          <button
            aria-selected={active}
            className={`rounded-xl px-2.5 py-1.5 text-left text-xs transition sm:px-5 sm:py-2 sm:text-sm ${
              active
                ? "bg-[#1A1A1A] text-white shadow-sm"
                : "text-gray-500 hover:bg-white hover:text-[#1A1A1A]"
            }`}
            key={day.day}
            onClick={() => onChange(day.day)}
            role="tab"
            type="button"
          >
            <span className="block font-bold">{day.dayLabel}</span>
            <span className={`block text-xs ${active ? "text-white/65" : "text-gray-400"}`}>
              {formatDate(day.date)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
