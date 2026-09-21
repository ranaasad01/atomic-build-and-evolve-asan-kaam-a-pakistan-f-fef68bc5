"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CheckCircle, Shield, Star, MapPin, Clock, Sparkles, Users, Briefcase, ChevronRight, MessageSquare, Zap } from 'lucide-react';
import { Reveal } from "@/components/Reveal";
import { fadeInUp, staggerContainer, scaleIn } from "@/lib/motion";
import { TASK_CATEGORIES, APP_NAME, APP_TAGLINE } from "@/lib/data";
type CITIES = any;
const CITIES: any = [];
type formatPkr = any;
const formatPkr: any = [];

const STATS = [
  { value: "15,000+", label: "Tasks Posted" },
  { value: "4,200+", label: "Verified Taskers" },
  { value: "4.8★", label: "Avg. Rating" },
  { value: "4", label: "Cities Live" },
];

const HOW_IT_WORKS_POSTER = [
  {
    step: "01",
    title: "Post Your Task",
    desc: "Describe what you need done, set your budget, pick a time window, and choose your city area.",
  },
  {
    step: "02",
    title: "Compare Bids",
    desc: "Verified taskers near you submit competitive bids. Review their ratings, profiles, and notes.",
  },
  {
    step: "03",
    title: "Get It Done",
    desc: "Assign the best tasker, track progress in-app, and release payment only when you're satisfied.",
  },
];

const HOW_IT_WORKS_TASKER = [
  {
    step: "01",
    title: "Verify & Top Up",
    desc: "Complete a quick CNIC verification and add a small prepaid balance to start bidding on tasks.",
  },
  {
    step: "02",
    title: "Bid on Nearby Tasks",
    desc: "Browse the live task feed filtered by your city, category, and budget. Submit your best offer.",
  },
  {
    step: "03",
    title: "Earn & Grow",
    desc: "Complete tasks, collect earnings, and build your reputation with 5-star reviews.",
  },
];

const TRUST_FEATURES = [
  {
    icon: Shield,
    title: "CNIC Verification",
    desc: "Every tasker goes through identity verification before they can accept paid work.",
  },
  {
    icon: MessageSquare,
    title: "Redacted Messaging",
    desc: "Our in-app chat automatically blocks phone numbers, emails, and social handles to keep transactions safe.",
  },
  {
    icon: Star,
    title: "Two-Way Reviews",
    desc: "Posters and taskers both rate each other after every completed task, building a trustworthy community.",
  },
  {
    icon: Zap,
    title: "Dispute Resolution",
    desc: "A dedicated support team mediates any disagreement so neither party is left without recourse.",
  },
];

const TESTIMONIALS = [
  {
    name: "Ayesha Siddiqui",
    city: "Karachi",
    role: "Poster",
    text: "I needed someone to stand in a queue at the NADRA office for 4 hours. Posted the task, got 6 bids within 20 minutes, and the tasker was there by 9 AM. Absolutely seamless.",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ayesha%20Siddiqui",
  },
  {
    name: "Bilal Raza",
    city: "Lahore",
    role: "Tasker",
    text: "I do 8 to 10 tasks a week on Asan Kaam between my university classes. The balance system is transparent and I always know exactly what commission will be deducted before I bid.",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bilal%20Raza",
  },
  {
    name: "Sana Mirza",
    city: "Islamabad",
    role: "Poster",
    text: "Had a leaky tap and a broken shelf on the same day. Found a verified handyman through Asan Kaam who fixed both for under Rs 1,500. Would not have found someone this quickly any other way.",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sana%20Mirza",
  },
];

const LIVE_CITIES = CITIES.filter((c) => c.isLive);

const FEATURED_CATEGORIES = TASK_CATEGORIES.slice(0, 6);

export default function HomePage() {
  const t = useTranslations();

  return (
    <main className="overflow-x-hidden">
      {/* ── HERO ── */}
      <Reveal>
        <section
          id="hero"
          className="relative min-h-[92vh] flex items-center bg-[var(--brand-dark)] overflow-hidden"
        >
          {/* Mesh glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 70% 60% at 60% 40%, rgba(var(--accent-rgb), 0.18) 0%, transparent 70%), radial-gradient(ellipse 40% 50% at 10% 80%, rgba(var(--accent-rgb), 0.10) 0%, transparent 60%)",
            }}
          />

          <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-24 lg:py-32 grid lg:grid-cols-2 gap-16 items-center">
            {/* Left copy */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-6"
            >
              <motion.div variants={fadeInUp}>
                <span className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  {t("hero.badge")}
                </span>
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.08] tracking-tight text-white text-balance"
              >
                {t("hero.headline1")}{" "}
                <span className="text-[var(--accent)]">{t("hero.headline2")}</span>{" "}
                {t("hero.headline3")}
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="max-w-lg text-lg leading-relaxed text-white/70"
              >
                {t("hero.subheadline")}
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="flex flex-wrap gap-3 pt-2"
              >
                <Link
                  href="/post-task"
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-7 py-3.5 text-sm font-bold text-[var(--brand-dark)] shadow-[0_4px_24px_rgba(var(--accent-rgb),0.35)] transition-all duration-300 hover:brightness-110 hover:shadow-[0_6px_32px_rgba(var(--accent-rgb),0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                >
                  {t("hero.ctaPoster")}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                >
                  {t("hero.ctaTasker")}
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </motion.div>

              {/* Trust pills */}
              <motion.div
                variants={fadeInUp}
                className="flex flex-wrap gap-3 pt-1"
              >
                {[t("hero.trust1"), t("hero.trust2"), t("hero.trust3")].map(
                  (pill) => (
                    <span
                      key={pill}
                      className="inline-flex items-center gap-1.5 rounded-full bg-white/8 px-3 py-1 text-xs text-white/60"
                    >
                      <CheckCircle className="h-3 w-3 text-[var(--accent)]" aria-hidden="true" />
                      {pill}
                    </span>
                  )
                )}
              </motion.div>
            </motion.div>

            {/* Right — task card mockup */}
            <motion.div
              variants={scaleIn}
              initial="hidden"
              animate="visible"
              className="hidden lg:flex flex-col gap-4"
            >
              {/* Mock task cards */}
              {[
                {
                  title: "Grocery run from Imtiaz, DHA Phase 6",
                  category: "Errands & Shopping",
                  budget: 800,
                  city: "Karachi",
                  bids: 7,
                  urgent: true,
                  timing: "Morning",
                },
                {
                  title: "Fix leaking kitchen tap — Gulberg III",
                  category: "Small Repairs",
                  budget: 1200,
                  city: "Lahore",
                  bids: 4,
                  urgent: false,
                  timing: "Flexible",
                },
                {
                  title: "NADRA queue standing — F-8 Markaz",
                  category: "Queue Standing",
                  budget: 600,
                  city: "Islamabad",
                  bids: 11,
                  urgent: false,
                  timing: "ASAP",
                },
              ].map((card, i) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, x: 32 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.12, duration: 0.5, ease: "easeOut" }}
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md shadow-[0_2px_16px_rgba(0,0,0,0.25)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="rounded-full bg-[var(--accent)]/15 px-2.5 py-0.5 text-[10px] font-semibold text-[var(--accent)]">
                          {card.category}
                        </span>
                        {card.urgent && (
                          <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] font-semibold text-red-400">
                            Urgent
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-white leading-snug truncate">
                        {card.title}
                      </p>
                      <div className="mt-2 flex items-center gap-3 text-xs text-white/50">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" aria-hidden="true" />
                          {card.city}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" aria-hidden="true" />
                          {card.timing}
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-base font-bold text-white">
                        {formatPkr(card.budget)}
                      </div>
                      <div className="text-[10px] text-white/40 mt-0.5">
                        {card.bids} bids
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </Reveal>

      {/* ── STATS ── */}
      <Reveal>
        <section className="bg-[var(--brand-surface)] border-y border-[var(--brand-border)]">
          <div className="mx-auto max-w-7xl px-6 py-14 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.07}>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-extrabold text-[var(--accent)] tracking-tight">
                    {s.value}
                  </div>
                  <div className="mt-1 text-sm text-[var(--brand-muted)]">{s.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      </Reveal>

      {/* ── HOW IT WORKS ── */}
      <Reveal>
        <section id="how-it-works" className="bg-[var(--brand-bg)] py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-16 text-center">
              <span className="inline-block rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/8 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-[var(--accent)] mb-4">
                {t("howItWorks.eyebrow")}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--brand-fg)] text-balance">
                {t("howItWorks.heading")}
              </h2>
              <p className="mt-4 max-w-xl mx-auto text-[var(--brand-muted)] leading-relaxed">
                {t("howItWorks.subheading")}
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
              {/* Poster flow */}
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--brand-dark)]">
                    <Briefcase className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-bold text-[var(--brand-fg)]">
                    {t("howItWorks.posterTitle")}
                  </h3>
                </div>
                <div className="flex flex-col gap-6">
                  {HOW_IT_WORKS_POSTER.map((step, i) => (
                    <Reveal key={step.step} delay={i * 0.1}>
                      <div className="flex gap-5">
                        <div className="shrink-0 flex flex-col items-center">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[var(--accent)] text-sm font-bold text-[var(--accent)]">
                            {step.step}
                          </div>
                          {i < HOW_IT_WORKS_POSTER.length - 1 && (
                            <div className="mt-2 h-full w-px bg-[var(--accent)]/20" />
                          )}
                        </div>
                        <div className="pb-6">
                          <h4 className="font-semibold text-[var(--brand-fg)] mb-1">
                            {step.title}
                          </h4>
                          <p className="text-sm text-[var(--brand-muted)] leading-relaxed">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>

              {/* Tasker flow */}
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--brand-surface)] border border-[var(--brand-border)] text-[var(--brand-fg)]">
                    <Users className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-bold text-[var(--brand-fg)]">
                    {t("howItWorks.taskerTitle")}
                  </h3>
                </div>
                <div className="flex flex-col gap-6">
                  {HOW_IT_WORKS_TASKER.map((step, i) => (
                    <Reveal key={step.step} delay={i * 0.1}>
                      <div className="flex gap-5">
                        <div className="shrink-0 flex flex-col items-center">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[var(--brand-border)] text-sm font-bold text-[var(--brand-muted)]">
                            {step.step}
                          </div>
                          {i < HOW_IT_WORKS_TASKER.length - 1 && (
                            <div className="mt-2 h-full w-px bg-[var(--brand-border)]" />
                          )}
                        </div>
                        <div className="pb-6">
                          <h4 className="font-semibold text-[var(--brand-fg)] mb-1">
                            {step.title}
                          </h4>
                          <p className="text-sm text-[var(--brand-muted)] leading-relaxed">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── CATEGORIES ── */}
      <Reveal>
        <section
          id="categories"
          className="bg-[var(--brand-surface)] border-y border-[var(--brand-border)] py-24 md:py-32"
        >
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <span className="inline-block rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/8 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-[var(--accent)] mb-3">
                  {t("categories.eyebrow")}
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--brand-fg)] text-balance">
                  {t("categories.heading")}
                </h2>
              </div>
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent)] hover:underline shrink-0"
              >
                {t("categories.viewAll")}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {FEATURED_CATEGORIES.map((cat, i) => (
                <Reveal key={cat.key} delay={i * 0.06}>
                  <Link
                    href={`/?category=${cat.key}`}
                    className="group flex flex-col items-center gap-3 rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-bg)] p-5 text-center transition-all duration-300 hover:border-[var(--accent)]/50 hover:shadow-[0_4px_24px_rgba(var(--accent-rgb),0.12)] hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] transition-colors group-hover:bg-[var(--accent)]/20">
                      <Sparkles className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <span className="text-xs font-semibold text-[var(--brand-fg)] leading-snug">
                      {cat.label}
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── TRUST & SAFETY ── */}
      <Reveal>
        <section id="trust" className="bg-[var(--brand-dark)] py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left copy */}
              <div>
                <span className="inline-block rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-[var(--accent)] mb-5">
                  {t("trust.eyebrow")}
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white text-balance mb-5">
                  {t("trust.heading")}
                </h2>
                <p className="text-white/60 leading-relaxed mb-8 max-w-md">
                  {t("trust.subheading")}
                </p>
                <Link
                  href="/verification-status"
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-bold text-[var(--brand-dark)] transition-all duration-300 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                >
                  {t("trust.cta")}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>

              {/* Right grid */}
              <div className="grid sm:grid-cols-2 gap-5">
                {TRUST_FEATURES.map((feat, i) => (
                  <Reveal key={feat.title} delay={i * 0.09}>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm hover:border-[var(--accent)]/30 transition-colors duration-300">
                      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent)]/15 text-[var(--accent)]">
                        <feat.icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <h3 className="font-semibold text-white mb-2">{feat.title}</h3>
                      <p className="text-sm text-white/55 leading-relaxed">{feat.desc}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── TESTIMONIALS ── */}
      <Reveal>
        <section id="reviews" className="bg-[var(--brand-bg)] py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-14 text-center">
              <span className="inline-block rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/8 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-[var(--accent)] mb-4">
                {t("testimonials.eyebrow")}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--brand-fg)] text-balance">
                {t("testimonials.heading")}
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {TESTIMONIALS.map((t_item, i) => (
                <Reveal key={t_item.name} delay={i * 0.1}>
                  <div className="flex flex-col h-full rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-surface)] p-7 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.10)] hover:shadow-[0_4px_32px_-8px_rgba(0,0,0,0.15)] transition-shadow duration-300">
                    <div className="flex gap-0.5 mb-4">
                      {Array.from({ length: t_item.rating }).map((_, si) => (
                        <Star
                          key={si}
                          className="h-4 w-4 fill-[var(--accent)] text-[var(--accent)]"
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                    <p className="text-sm text-[var(--brand-muted)] leading-relaxed flex-1 mb-6">
                      &ldquo;{t_item.text}&rdquo;
                    </p>
                    <div className="flex items-center gap-3">
                      <img
                        src={t_item.avatar}
                        alt={t_item.name}
                        className="h-10 w-10 rounded-full object-cover ring-2 ring-[var(--brand-border)]"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(t_item.name)}&background=random`;
                        }}
                      />
                      <div>
                        <div className="text-sm font-semibold text-[var(--brand-fg)]">
                          {t_item.name}
                        </div>
                        <div className="text-xs text-[var(--brand-muted)]">
                          {t_item.role} · {t_item.city}
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── CITIES ── */}
      <Reveal>
        <section
          id="cities"
          className="bg-[var(--brand-surface)] border-y border-[var(--brand-border)] py-24 md:py-32"
        >
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-12 text-center">
              <span className="inline-block rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/8 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-[var(--accent)] mb-4">
                {t("cities.eyebrow")}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--brand-fg)] text-balance">
                {t("cities.heading")}
              </h2>
              <p className="mt-4 max-w-lg mx-auto text-[var(--brand-muted)] leading-relaxed">
                {t("cities.subheading")}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {CITIES.map((city, i) => (
                <Reveal key={city.slug} delay={i * 0.07}>
                  <div
                    className={`relative rounded-2xl border p-6 text-center transition-all duration-300 ${
                      city.isLive
                        ? "border-[var(--accent)]/40 bg-[var(--accent)]/6 hover:border-[var(--accent)]/70 hover:-translate-y-1 cursor-pointer"
                        : "border-[var(--brand-border)] bg-[var(--brand-bg)] opacity-60 cursor-not-allowed"
                    }`}
                  >
                    <MapPin
                      className={`mx-auto mb-3 h-6 w-6 ${city.isLive ? "text-[var(--accent)]" : "text-[var(--brand-muted)]"}`}
                      aria-hidden="true"
                    />
                    <div
                      className={`font-bold text-base ${city.isLive ? "text-[var(--brand-fg)]" : "text-[var(--brand-muted)]"}`}
                    >
                      {city.name}
                    </div>
                    <div className="mt-2">
                      {city.isLive ? (
                        <span className="inline-block rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-600">
                          {t("cities.live")}
                        </span>
                      ) : (
                        <span className="inline-block rounded-full bg-[var(--brand-border)] px-2.5 py-0.5 text-[10px] font-semibold text-[var(--brand-muted)]">
                          {t("cities.comingSoon")}
                        </span>
                      )}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── FINAL CTA ── */}
      <Reveal>
        <section
          id="cta"
          className="relative bg-[var(--brand-dark)] py-24 md:py-32 overflow-hidden"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 60% 70% at 50% 50%, rgba(var(--accent-rgb), 0.14) 0%, transparent 70%)",
            }}
          />
          <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white text-balance mb-5">
              {t("cta.heading")}
            </h2>
            <p className="text-white/60 leading-relaxed mb-10 text-lg max-w-xl mx-auto">
              {t("cta.subheading")}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/post-task"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-8 py-4 text-sm font-bold text-[var(--brand-dark)] shadow-[0_4px_24px_rgba(var(--accent-rgb),0.35)] transition-all duration-300 hover:brightness-110 hover:shadow-[0_6px_32px_rgba(var(--accent-rgb),0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              >
                {t("cta.posterBtn")}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/verification-status"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-4 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              >
                {t("cta.taskerBtn")}
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </Reveal>
    </main>
  );
}