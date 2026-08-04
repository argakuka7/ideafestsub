import type { Metadata, Viewport } from "next";
import { Inter, Anton } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SilkBackground } from "@/components/SilkBackground";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const anton = Anton({ subsets: ["latin"], weight: "400", variable: "--font-anton" });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0E1E4A",
};

export const metadata: Metadata = {
  title: "IDEATALKS — Event Rundown",
  description: "IdeaFest SUB 2026 · The Next Leap — event schedule, speakers, and sessions",
  metadataBase: new URL("https://ideafestsub.netlify.app"),
  openGraph: {
    title: "IDEAFEST SUB 2026 · The Next Leap",
    description: "Find your next big idea. 7–9 August 2026 · Grand City Convex · Surabaya.",
    url: "https://ideafestsub.netlify.app",
    siteName: "IDEAFEST SUB 2026",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "IDEAFEST SUB 2026 · The Next Leap" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "IDEAFEST SUB 2026 · The Next Leap",
    description: "Find your next big idea. 7–9 August 2026 · Grand City Convex · Surabaya.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`scroll-smooth ${inter.variable} ${anton.variable}`}>
      <body className="min-h-screen overflow-x-hidden bg-transparent font-sans text-[#F5F1E8]">
        <SilkBackground />
        <div className="relative z-10 flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
