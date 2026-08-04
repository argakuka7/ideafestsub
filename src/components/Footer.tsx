export function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 bg-[#5C1A2B] text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6">
        <span className="text-xs text-white/70">IDEAFEST SUB 2026 · The Next Leap</span>
        <a
          href="https://argakuka.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold text-white transition-colors hover:text-[#FFD60A]"
        >
          Built by Argakuka
        </a>
      </div>
    </footer>
  );
}
