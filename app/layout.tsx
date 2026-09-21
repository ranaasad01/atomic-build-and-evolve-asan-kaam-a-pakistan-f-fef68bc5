import type { Metadata } from "next";
import "./globals.css";
import LocaleProvider from "@/components/LocaleProvider";
import LanguageToggle from "@/components/LanguageToggle";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  formatDetection: { telephone: false, date: false, email: false, address: false },
  title: {
    default: "Asan Kaam — Pakistan's Local Task Marketplace",
    template: "%s | Asan Kaam",
  },
  description:
    "Find verified taskers for everyday jobs in Karachi, Lahore, Islamabad and more. Post a task in minutes and get competitive bids in PKR.",
  keywords: [
    "task marketplace Pakistan",
    "local taskers",
    "Karachi tasks",
    "Lahore errands",
    "PKR gig economy",
  ],
  openGraph: {
    title: "Asan Kaam — Pakistan's Local Task Marketplace",
    description:
      "Post everyday tasks and get bids from verified nearby taskers. Safe, transparent, PKR-priced.",
    type: "website",
    locale: "en_PK",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[var(--background)] text-[var(--foreground)] antialiased min-h-screen flex flex-col">
        <LocaleProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <LanguageToggle />
        </LocaleProvider>
      </body>
    </html>
  );
}
