"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { footerLinks, APP_NAME, APP_TAGLINE, ACTIVE_CITIES } from "@/lib/data";
import { Shield } from 'lucide-react';
import { fadeInUp, staggerContainer } from "@/lib/motion";

// Crescent-star inline SVG — Pakistani cultural identity mark
function CrescentStarIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Crescent */}
      <path
        d="M16 4a12 12 0 1 0 0 24 9.5 9.5 0 1 1 0-19A12 12 0 0 0 16 4z"
        fill="#F5A623"
      />
      {/* Star */}
      <polygon
        points="22,10 23.2,13.6 27,13.6 24,15.8 25.2,19.4 22,17.2 18.8,19.4 20,15.8 17,13.6 20.8,13.6"
        fill="#F5A623"
      />
    </svg>
  );
}

export default function Footer() {
  const pathname = usePathname();
  const t = useTranslations();
  const navT = t.raw("nav") as Record<string, string>;
  const footerT = t.raw("footer") as Record<string, string>;

  function getHref(href: string): string {
    if (href.startsWith("#")) {
      return pathname === "/" ? href : "/" + href;
    }
    return href;
  }

  function handleClick(
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) {
    if (href.startsWith("#") && pathname === "/") {
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }
  }

  // Augment support links with the dispute link if not already present
  const supportLinks = footerLinks.support.some((l) => l.key === "dispute")
    ? footerLinks.support
    : [
        ...footerLinks.support,
        { label: "Dispute & Cancellation", href: "/dispute", key: "disputeNew" },
      ];

  const SECTION_HEADING =
    "text-[#F5A623] font-bold text-xs uppercase tracking-widest mb-5 flex items-center gap-2";

  const LINK_CLASS =
    "text-white/60 hover:text-white text-sm transition-colors duration-200 hover:underline decoration-[#F5A623] underline-offset-2";

  return (
    <footer
      className="bg-[#1A1A2E] text-white mt-auto"
      style={{ borderTop: "2px solid #F5A623" }}
    >
      {/* ── Main grid ── */}
      <div className="container py-12 md:py-16">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-14"
        >
          {/* ── Brand column ── */}
          <motion.div variants={fadeInUp} className="sm:col-span-2 lg:col-span-1">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 mb-4 group"
              aria-label={`${APP_NAME} — Home`}
            >
              <div className="w-9 h-9 rounded-[var(--radius)] bg-[var(--primary)] flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--primary-hover)] transition-colors">
                <CrescentStarIcon className="w-5 h-5" />
              </div>
              <span className="font-bold text-white text-lg tracking-tight">
                {APP_NAME}
              </span>
            </Link>

            {/* Urdu tagline */}
            <p
              className="text-white/50 text-sm mb-1 leading-relaxed"
              dir="rtl"
              lang="ur"
              style={{ fontFamily: "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif" }}
            >
              کام ڈھونڈو۔ کام کرو۔ آسان ہے۔
            </p>

            {/* English tagline */}
            <p className="text-white/50 text-xs mb-5 leading-relaxed">
              {APP_TAGLINE}
            </p>

            {/* Active cities */}
            <p className="text-[#F5A623] text-xs font-semibold uppercase tracking-wider mb-2">
              {footerT["activeCities"] ?? "Active cities"}
            </p>
            <div className="flex flex-wrap gap-2">
              {ACTIVE_CITIES.map((city) => (
                <span
                  key={city}
                  className="inline-flex items-center gap-1.5 text-xs bg-white/8 text-white/75 px-2.5 py-1 rounded-full border border-white/10"
                >
                  {/* Green live dot */}
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0"
                    aria-hidden="true"
                  />
                  {city}
                </span>
              ))}
            </div>

            {/* Safe messaging trust line */}
            <div className="flex items-start gap-2 mt-5 p-3 rounded-xl bg-white/5 border border-white/10">
              <Shield className="w-4 h-4 text-[#F5A623] flex-shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-white/55 text-xs leading-relaxed">
                {footerT["safeMessaging"] ??
                  "Safe in-app messaging. Your contact details stay private."}
              </p>
            </div>
          </motion.div>

          {/* ── Platform links ── */}
          <motion.div variants={fadeInUp}>
            <h3 className={SECTION_HEADING}>
              <span className="w-4 h-px bg-[#F5A623] inline-block" aria-hidden="true" />
              {footerT["platform"] ?? "Platform"}
            </h3>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.key}>
                  <Link
                    href={getHref(link.href)}
                    onClick={(e) => handleClick(e, link.href)}
                    className={LINK_CLASS}
                  >
                    {navT[link.key] ?? link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* ── For Taskers links ── */}
          <motion.div variants={fadeInUp}>
            <h3 className={SECTION_HEADING}>
              <span className="w-4 h-px bg-[#F5A623] inline-block" aria-hidden="true" />
              {footerT["forTaskers"] ?? "For Taskers"}
            </h3>
            <ul className="space-y-3">
              {footerLinks.tasker.map((link) => (
                <li key={link.key}>
                  <Link
                    href={getHref(link.href)}
                    onClick={(e) => handleClick(e, link.href)}
                    className={LINK_CLASS}
                  >
                    {navT[link.key] ?? link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* ── Support links ── */}
          <motion.div variants={fadeInUp}>
            <h3 className={SECTION_HEADING}>
              <span className="w-4 h-px bg-[#F5A623] inline-block" aria-hidden="true" />
              {footerT["support"] ?? "Support"}
            </h3>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.key}>
                  <Link
                    href={getHref(link.href)}
                    onClick={(e) => handleClick(e, link.href)}
                    className={LINK_CLASS}
                  >
                    {navT[link.key] ?? link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Bottom bar ── */}
      <div
        className="border-t border-white/10"
      >
        <div className="container py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-white/40 text-xs">
            {/* Copyright */}
            <p className="text-white/80">
              &copy; {new Date().getFullYear()} {APP_NAME}.
              {" "}{footerT["rights"] ?? "All rights reserved."} 🇵🇰
            </p>

            {/* Made with love */}
            <p className="font-medium text-white/80">
              Made with{" "}
              <span aria-label="love" role="img">❤️</span>
              {" "}in Pakistan{" "}
              <span aria-label="Pakistan flag" role="img">🇵🇰</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
