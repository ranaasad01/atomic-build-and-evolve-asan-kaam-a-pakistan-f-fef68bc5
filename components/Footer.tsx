"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { footerLinks, APP_NAME, APP_TAGLINE, ACTIVE_CITIES } from "@/lib/data";
import { CheckCircle, Shield, MapPin } from 'lucide-react';
import { fadeInUp, staggerContainer } from "@/lib/motion";

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

  return (
    <footer className="bg-[var(--foreground)] text-white mt-auto">
      <div className="container py-12 md:py-16">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12"
        >
          {/* Brand column */}
          <motion.div variants={fadeInUp} className="sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2 mb-3 group"
              aria-label={`${APP_NAME} — Home`}
            >
              <div className="w-8 h-8 rounded-[var(--radius)] bg-[var(--primary)] flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-4 h-4 text-white" aria-hidden="true" />
              </div>
              <span className="font-bold text-white text-base">{APP_NAME}</span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-4">
              {APP_TAGLINE}
            </p>
            <div className="flex items-center gap-1.5 text-white/50 text-xs mb-2">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
              <span>{footerT["activeCities"] ?? "Active cities"}:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {ACTIVE_CITIES.map((city) => (
                <span
                  key={city}
                  className="text-xs bg-white/10 text-white/70 px-2 py-0.5 rounded-full border border-white/10"
                >
                  {city}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Platform links */}
          <motion.div variants={fadeInUp}>
            <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wide">
              {footerT["platform"] ?? "Platform"}
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.platform.map((link) => (
                <li key={link.key}>
                  <Link
                    href={getHref(link.href)}
                    onClick={(e) => handleClick(e, link.href)}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    {navT[link.key] ?? link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Tasker links */}
          <motion.div variants={fadeInUp}>
            <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wide">
              {footerT["forTaskers"] ?? "For Taskers"}
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.tasker.map((link) => (
                <li key={link.key}>
                  <Link
                    href={getHref(link.href)}
                    onClick={(e) => handleClick(e, link.href)}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    {navT[link.key] ?? link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support links */}
          <motion.div variants={fadeInUp}>
            <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wide">
              {footerT["support"] ?? "Support"}
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.support.map((link) => (
                <li key={link.key}>
                  <Link
                    href={getHref(link.href)}
                    onClick={(e) => handleClick(e, link.href)}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    {navT[link.key] ?? link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-white/40 text-xs">
            <Shield className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{footerT["safeMessaging"] ?? "Safe in-app messaging. Your contact details stay private."}</span>
          </div>
          <p className="text-white/40 text-xs">
            &copy; {new Date().getFullYear()} {APP_NAME}.{" "}
            {footerT["rights"] ?? "All rights reserved."}
          </p>
        </div>
      </div>
    </footer>
  );
}