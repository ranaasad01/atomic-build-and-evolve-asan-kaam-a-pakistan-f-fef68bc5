"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { navLinks, APP_NAME } from "@/lib/data";
import { Menu, X, Bell, Settings, Plus } from 'lucide-react';

// ── Inline crescent-and-star SVG logo mark ──────────────────────────────────
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
        d="M20 6a10 10 0 1 0 0 20 8 8 0 1 1 0-20z"
        fill="white"
      />
      {/* Star */}
      <polygon
        points="22,9 22.9,11.8 25.9,11.8 23.5,13.5 24.4,16.3 22,14.6 19.6,16.3 20.5,13.5 18.1,11.8 21.1,11.8"
        fill="#F5A623"
      />
    </svg>
  );
}

// ── Subtle Pakistani geometric pattern (SVG data URI) ────────────────────────
const PK_PATTERN_STYLE: React.CSSProperties = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231B6CA8' fill-opacity='0.08'%3E%3Cpath d='M20 0l4 8h8l-6 6 2 8-8-4-8 4 2-8-6-6h8z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
  backgroundSize: "40px 40px",
};

export default function Navbar() {
  const pathname = usePathname();
  const t = useTranslations();
  const navT = t.raw("nav") as Record<string, string>;

  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  function handleNavClick(
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) {
    if (href.startsWith("#") && pathname === "/") {
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }
  }

  function getHref(href: string): string {
    if (href.startsWith("#")) {
      return pathname === "/" ? href : "/" + href;
    }
    return href;
  }

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.startsWith("#")) return false;
    return pathname.startsWith(href);
  };

  // Primary nav: exclude signIn, profile, settings, notifications
  const primaryLinks = navLinks.filter(
    (l) => !["signIn", "profile", "settings", "notifications"].includes(l.key)
  );

  // All links for mobile menu
  const allMobileLinks = navLinks;

  // Group mobile links
  const posterMobileLinks = allMobileLinks.filter((l) =>
    ["browse", "post", "myTasks", "messages"].includes(l.key)
  );
  const taskerMobileLinks = allMobileLinks.filter((l) =>
    ["myBids", "balance", "profile", "verification", "ratings"].includes(l.key)
  );
  const otherMobileLinks = allMobileLinks.filter((l) =>
    ["notifications", "settings", "signIn"].includes(l.key)
  );

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-white border-b border-[var(--border)] transition-all duration-300 ${
        scrolled
          ? "shadow-[0_4px_20px_rgba(27,108,168,0.12)]"
          : "shadow-none"
      }`}
    >
      <div className="container">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* ── Logo ── */}
          <Link
            href="/"
            className="flex items-center gap-2.5 flex-shrink-0 group"
            aria-label={`${APP_NAME} — Home`}
          >
            <div className="w-9 h-9 rounded-xl bg-[var(--primary)] flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--primary-hover)] transition-colors shadow-[0_2px_8px_rgba(27,108,168,0.3)]">
              <CrescentStarIcon className="w-6 h-6" />
            </div>
            <div className="flex flex-col leading-none">
              <span
                className="font-bold text-[var(--foreground)] text-base tracking-tight"
                style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}
              >
                {APP_NAME}
              </span>
              {/* Urdu tagline — desktop only */}
              <span
                className="hidden md:block text-[10px] text-[var(--muted-foreground)] leading-tight mt-0.5"
                style={{ fontFamily: "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif", direction: "rtl" }}
              >
                آسان کام
              </span>
            </div>
          </Link>

          {/* ── Desktop nav ── */}
          <nav
            className="hidden lg:flex items-center gap-0.5"
            aria-label="Main navigation"
          >
            {primaryLinks
              .filter((l) => l.key !== "post")
              .map((link) => (
                <Link
                  key={link.key}
                  href={getHref(link.href)}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`relative px-3 py-1.5 text-sm font-medium transition-colors duration-150 whitespace-nowrap group ${
                    isActive(link.href)
                      ? "text-[var(--accent)] font-semibold"
                      : "text-[var(--foreground)] hover:text-[var(--primary)]"
                  }`}
                  aria-current={isActive(link.href) ? "page" : undefined}
                >
                  {navT[link.key] ?? link.label}
                  {/* Accent underline for active */}
                  {isActive(link.href) && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-[var(--accent)]" />
                  )}
                  {/* Hover underline */}
                  {!isActive(link.href) && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-[var(--primary)] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
                  )}
                </Link>
              ))}
          </nav>

          {/* ── Desktop right actions ── */}
          <div className="hidden lg:flex items-center gap-2">
            <Link
              href="/notifications"
              className={`p-2 rounded-lg transition-colors duration-150 ${
                isActive("/notifications")
                  ? "bg-[var(--primary)] text-white"
                  : "text-[var(--muted-foreground)] hover:text-[var(--primary)] hover:bg-[var(--background)]"
              }`}
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link
              href="/settings"
              className={`p-2 rounded-lg transition-colors duration-150 ${
                isActive("/settings")
                  ? "bg-[var(--primary)] text-white"
                  : "text-[var(--muted-foreground)] hover:text-[var(--primary)] hover:bg-[var(--background)]"
              }`}
              aria-label="Settings"
            >
              <Settings className="w-4 h-4" aria-hidden="true" />
            </Link>

            {/* Post a Task CTA */}
            <Link
              href="/post-task"
              className="btn-primary ml-1 text-sm px-4 py-2 rounded-lg flex items-center gap-1.5"
            >
              <span className="text-[var(--accent)] text-base leading-none" aria-hidden="true">✦</span>
              <span>{navT["post"] ?? "Post a Task"}</span>
            </Link>

            <Link
              href="/auth"
              className="btn-secondary text-sm px-4 py-2 rounded-lg"
            >
              {navT["signIn"] ?? "Sign In"}
            </Link>
          </div>

          {/* ── Mobile hamburger ── */}
          <button
            className="lg:hidden p-2 rounded-lg text-[var(--foreground)] hover:bg-[var(--background)] transition-colors"
            onClick={() => setIsOpen((v) => !v)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? (
              <X className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* ── Mobile slide-down menu ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="lg:hidden overflow-hidden border-t border-[var(--border)]"
          >
            {/* Pakistani geometric pattern background */}
            <div
              className="bg-white"
              style={PK_PATTERN_STYLE}
            >
              <div className="container py-4 space-y-5">

                {/* Post a Task — prominent CTA */}
                <Link
                  href="/post-task"
                  onClick={() => setIsOpen(false)}
                  className="btn-primary w-full justify-center text-sm py-2.5 rounded-xl"
                >
                  <Plus className="w-4 h-4" aria-hidden="true" />
                  <span>{navT["post"] ?? "Post a Task"}</span>
                </Link>

                {/* For Posters */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)] mb-2 px-1">
                    For Posters
                  </p>
                  <div className="space-y-0.5">
                    {posterMobileLinks.map((link) => (
                      <Link
                        key={link.key}
                        href={getHref(link.href)}
                        onClick={(e) => {
                          handleNavClick(e, link.href);
                          setIsOpen(false);
                        }}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                          isActive(link.href)
                            ? "bg-[var(--primary)] text-white"
                            : "text-[var(--foreground)] hover:bg-[var(--primary)]/10 hover:text-[var(--primary)]"
                        }`}
                        aria-current={isActive(link.href) ? "page" : undefined}
                      >
                        {isActive(link.href) && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] flex-shrink-0" />
                        )}
                        {navT[link.key] ?? link.label}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* For Taskers */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)] mb-2 px-1">
                    For Taskers
                  </p>
                  <div className="space-y-0.5">
                    {taskerMobileLinks.map((link) => (
                      <Link
                        key={link.key}
                        href={getHref(link.href)}
                        onClick={(e) => {
                          handleNavClick(e, link.href);
                          setIsOpen(false);
                        }}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                          isActive(link.href)
                            ? "bg-[var(--primary)] text-white"
                            : "text-[var(--foreground)] hover:bg-[var(--primary)]/10 hover:text-[var(--primary)]"
                        }`}
                        aria-current={isActive(link.href) ? "page" : undefined}
                      >
                        {isActive(link.href) && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] flex-shrink-0" />
                        )}
                        {navT[link.key] ?? link.label}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-[var(--border)]" />

                {/* Other links */}
                <div className="space-y-0.5">
                  {otherMobileLinks.map((link) => (
                    <Link
                      key={link.key}
                      href={getHref(link.href)}
                      onClick={(e) => {
                        handleNavClick(e, link.href);
                        setIsOpen(false);
                      }}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        isActive(link.href)
                          ? "bg-[var(--primary)] text-white"
                          : "text-[var(--muted-foreground)] hover:bg-[var(--primary)]/10 hover:text-[var(--primary)]"
                      }`}
                      aria-current={isActive(link.href) ? "page" : undefined}
                    >
                      {navT[link.key] ?? link.label}
                    </Link>
                  ))}
                </div>

                {/* Urdu brand footer inside menu */}
                <div className="flex items-center justify-between pt-1 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[var(--primary)] flex items-center justify-center">
                      <CrescentStarIcon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-semibold text-[var(--foreground)]">{APP_NAME}</span>
                  </div>
                  <span
                    className="text-xs text-[var(--muted-foreground)]"
                    style={{ fontFamily: "'Noto Nastaliq Urdu', serif", direction: "rtl" }}
                  >
                    آسان کام
                  </span>
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
