"use client";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <label className="group flex w-full items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm transition focus-within:border-[#E91E8C] focus-within:ring-4 focus-within:ring-[#E91E8C]/15">
      <svg
        aria-hidden="true"
        className="h-5 w-5 shrink-0 text-gray-400 transition group-focus-within:text-[#E91E8C]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="11" cy="11" r="6" />
        <path strokeLinecap="round" d="m16 16 4 4" />
      </svg>
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
          <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
      ) : null}
    </label>
  );
}
