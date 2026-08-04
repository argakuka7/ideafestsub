import type { ReactElement } from "react";

export function SmallLeapBadge({ className = "" }: { className?: string }): ReactElement {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-[var(--pink)] px-3 py-1 font-display text-xs tracking-[0.15em] text-white uppercase ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-white" aria-hidden="true" />
      #SMALLLEAP
    </span>
  );
}