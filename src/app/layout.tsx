import type { Metadata } from "next";
import { Inter, Anton } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const anton = Anton({ subsets: ["latin"], weight: "400", variable: "--font-anton" });

export const metadata: Metadata = {
  title: "IDEATALKS — Event Rundown",
  description: "IdeaFest SUB 2026 · The Next Leap — event schedule, speakers, and sessions",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`scroll-smooth ${inter.variable} ${anton.variable}`}>
      <body className="min-h-screen bg-[var(--cream)] font-sans text-[#1A1A1A]">
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1 pb-20">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
