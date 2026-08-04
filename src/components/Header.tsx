import Link from "next/link";
import { Navigation } from "./Navigation";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-14 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2" aria-label="IDEATALKS schedule">
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
