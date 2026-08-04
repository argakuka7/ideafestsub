export function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 bg-[var(--navy)] text-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-2 sm:px-6">
        <span className="text-[11px] text-white/70">
          IDEAFEST SUB 2026 · The Next Leap
        </span>
        <div className="flex items-center gap-1 text-[11px] font-semibold">
          <span className="text-white/70">Built by</span>
          <a
            href="https://www.instagram.com/argakuka/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white transition-colors hover:text-[#FFD60A]"
          >
            @argakuka
          </a>
          <a
            href="https://argakuka.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white transition-colors hover:text-[#FFD60A]"
          >
            argakuka.com
          </a>
        </div>
      </div>
    </footer>
  );
}
