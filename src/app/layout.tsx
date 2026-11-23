import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import Script from "next/script";
import { Header } from "@/components/Header";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-be-vietnam-pro",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VTea POS — Hệ thống Bán hàng Trà Sữa",
  description:
    "Ứng dụng VTea POS minh họa Next.js App Router, Server Components, Route Handlers và Cache Revalidation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={beVietnamPro.variable}>
      <body className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
        <Script id="vtea-analytics" strategy="afterInteractive">
          {`console.log('[VTea] Analytics script loaded');`}
        </Script>
      </body>
    </html>
  );
}
