"use client";

import { Icon } from "@iconify/react";

interface BookmarkButtonProps {
  active: boolean;
  className?: string;
  onClick: () => void;
}

export function BookmarkButton({ active, className = "", onClick }: BookmarkButtonProps) {
  return (
    <button
      aria-label={active ? "Remove bookmark" : "Add bookmark"}
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
      <Icon icon={active ? "lucide:bookmark-check" : "lucide:bookmark"} className="h-4 w-4" />
    </button>
  );
}
