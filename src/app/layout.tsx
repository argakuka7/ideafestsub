import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IDEATALKS — Event Rundown",
  description: "IDEATALKS 2026 event schedule, speakers, and sessions",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} min-h-screen bg-white text-[#1A1A1A]`}>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1 pb-20">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
