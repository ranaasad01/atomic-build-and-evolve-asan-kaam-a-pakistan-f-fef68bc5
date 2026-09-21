"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { navLinks, APP_NAME } from "@/lib/data";
import { Menu, X, CheckCircle, Bell } from 'lucide-react';

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
    if (href.startsWith("#")) {
      if (pathname === "/") {
        e.preventDefault();
        document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
      }
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
    return pathname.startsWith(href);
  };

  const primaryLinks = navLinks.filter(
    (l) => !["signIn", "profile"].includes(l.key)
  );
  const authLinks = navLinks.filter((l) =>
    ["signIn", "profile"].includes(l.key)
  );

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-[var(--card)] border-b border-[var(--border)] shadow-[0_2px_8px_rgba(26,26,46,0.08)]"
          : "bg-[var(--card)] border-b border-[var(--border)]"
      }`}
    >
      <div className="container">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 flex-shrink-0 group"
            aria-label={`${APP_NAME} — Home`}
          >
            <div className="w-8 h-8 rounded-[var(--radius)] bg-[var(--primary)] flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--primary-hover)] transition-colors">
              <CheckCircle className="w-4 h-4 text-white" aria-hidden="true" />
            </div>
            <span className="font-bold text-[var(--foreground)] text-base leading-tight">
              {APP_NAME}
            </span>
          </Link>

          {/* Desktop nav */}
          <nav
            className="hidden lg:flex items-center gap-1"
            aria-label="Main navigation"
          >
            {primaryLinks.map((link) => (
              <Link
                key={link.key}
                href={getHref(link.href)}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`px-3 py-1.5 rounded-[var(--radius)] text-sm font-medium transition-colors duration-150 whitespace-nowrap ${
                  isActive(link.href)
                    ? "bg-[var(--primary)] text-white"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--background)]"
                }`}
                aria-current={isActive(link.href) ? "page" : undefined}
              >
                {navT[link.key] ?? link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop right actions */}
          <div className="hidden lg:flex items-center gap-2">
            <Link
              href="/notifications"
              className="p-2 rounded-[var(--radius)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--background)] transition-colors relative"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" aria-hidden="true" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--accent)] rounded-full" />
            </Link>
            {authLinks.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                className={
                  link.key === "signIn"
                    ? "btn-primary text-sm px-4 py-2"
                    : "btn-secondary text-sm px-4 py-2"
                }
              >
                {navT[link.key] ?? link.label}
              </Link>
            ))}
          </div>

          {/* Mobile hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              href="/notifications"
              className="p-2 rounded-[var(--radius)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--background)] transition-colors relative"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" aria-hidden="true" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--accent)] rounded-full" />
            </Link>
            <button
              onClick={() => setIsOpen((v) => !v)}
              className="p-2 rounded-[var(--radius)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--background)] transition-colors"
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
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="lg:hidden overflow-hidden border-t border-[var(--border)] bg-[var(--card)]"
          >
            <nav
              className="container py-3 flex flex-col gap-1"
              aria-label="Mobile navigation"
            >
              {[...primaryLinks, ...authLinks].map((link) => (
                <Link
                  key={link.key}
                  href={getHref(link.href)}
                  onClick={(e) => {
                    handleNavClick(e, link.href);
                    setIsOpen(false);
                  }}
                  className={`px-3 py-2.5 rounded-[var(--radius)] text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? "bg-[var(--primary)] text-white"
                      : "text-[var(--foreground)] hover:bg-[var(--background)]"
                  }`}
                  aria-current={isActive(link.href) ? "page" : undefined}
                >
                  {navT[link.key] ?? link.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}