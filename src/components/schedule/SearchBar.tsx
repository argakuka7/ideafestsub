"use client";

import { Icon } from "@iconify/react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <label className="group flex w-full items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm transition focus-within:border-[#E91E8C] focus-within:ring-4 focus-within:ring-[#E91E8C]/15">
      <Icon
        aria-hidden
        icon="lucide:search"
        className="h-5 w-5 shrink-0 text-gray-400 transition group-focus-within:text-[#E91E8C]"
      />
      <input
        aria-label="Search talks or speakers"
        className="min-w-0 flex-1 bg-transparent text-sm text-[#1A1A1A] outline-none placeholder:text-gray-400"
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search talks or speakers..."
        type="search"
        value={value}
      />
      {value ? (
        <button
          aria-label="Clear search"
          className="rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-[#1A1A1A]"
          onClick={() => onChange("")}
          type="button"
        >
          <Icon aria-hidden icon="lucide:x" className="h-4 w-4" />
        </button>
      ) : null}
    </label>
  );
}
