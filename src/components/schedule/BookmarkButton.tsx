"use client";

interface BookmarkButtonProps {
  active: boolean;
  className?: string;
  onClick: () => void;
}

export function BookmarkButton({ active, className = "", onClick }: BookmarkButtonProps) {
  return (
    <button
      aria-label={active ? "Remove bookmark" : "Bookmark session"}
      aria-pressed={active}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition focus:outline-none focus:ring-4 focus:ring-[#E91E8C]/20 ${
        active
          ? "border-[#E91E8C]/20 bg-[#E91E8C]/10 text-[#E91E8C]"
          : "border-gray-200 bg-white/90 text-gray-500 hover:border-[#E91E8C]/30 hover:text-[#E91E8C]"
      } ${className}`}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      type="button"
    >
      <svg aria-hidden="true" className="h-4 w-4" fill={active ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 3.75A1.75 1.75 0 0 1 7.75 2h8.5A1.75 1.75 0 0 1 18 3.75v17.5l-6-3.6-6 3.6V3.75Z" />
      </svg>
    </button>
  );
}
