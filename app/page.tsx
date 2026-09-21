"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle, Shield, Star, MapPin, MessageSquare, Zap, ShoppingBag, Truck, Sparkles, Wrench, Clock, Monitor, Home, Circle, ChevronRight, ArrowRight, Users, BadgeCheck } from 'lucide-react';
import { Reveal } from "@/components/Reveal";
import { fadeInUp, staggerContainer, scaleIn } from "@/lib/motion";
import {
  TASK_CATEGORIES,
  APP_NAME,
  ACTIVE_CITIES,
  COMING_SOON_CITIES,
  formatPKR as formatPkr,
} from "@/lib/data";

// ─── Static data ─────────────────────────────────────────────────────────────

const STATS = [
  { value: "15,000+", label: "Tasks Posted" },
  { value: "4,200+", label: "Verified Taskers" },
  { value: "4.8★", label: "Average Rating" },
  { value: "4", label: "Cities Live" },
];

const HOW_IT_WORKS_POSTER = [
  {
    step: "01",
    title: "Post Your Task",
    desc: "Describe what you need done, set your budget in PKR, pick a time window, and choose your city area.",
  },
  {
    step: "02",
    title: "Compare Bids",
    desc: "Verified taskers near you submit competitive bids. Review their ratings, profiles, and notes.",
  },
  {
    step: "03",
    title: "Get It Done",
    desc: "Assign the best tasker, track progress in-app, and confirm completion when you're satisfied.",
  },
];

const HOW_IT_WORKS_TASKER = [
  {
    step: "01",
    title: "Verify and Top Up",
    desc: "Complete a quick CNIC verification and add a small prepaid balance to start bidding on tasks.",
  },
  {
    step: "02",
    title: "Bid on Nearby Tasks",
    desc: "Browse the live task feed filtered by your city, category, and budget. Submit your best offer.",
  },
  {
    step: "03",
    title: "Earn and Grow",
    desc: "Complete tasks, collect earnings, and build your reputation with 5-star reviews from posters.",
  },
];

const TRUST_FEATURES = [
  {
    icon: Shield,
    title: "CNIC Verification",
    desc: "Every tasker goes through identity verification before they can accept paid work on the platform.",
  },
  {
    icon: MessageSquare,
    title: "Redacted Messaging",
    desc: "Our in-app chat automatically blocks phone numbers, emails, and social handles to keep both parties safe.",
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
  },
  {
    name: "Bilal Raza",
    city: "Lahore",
    role: "Tasker",
    text: "I do 8 to 10 tasks a week on Asan Kaam between my university classes. The balance system is transparent and I always know exactly what commission will be deducted before I bid.",
    rating: 5,
  },
  {
    name: "Sana Mirza",
    city: "Islamabad",
    role: "Poster",
    text: "Had a leaky tap and a broken shelf on the same day. Found a verified handyman through Asan Kaam who fixed both for under Rs 1,500. Would not have found someone this quickly any other way.",
    rating: 5,
  },
];

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  "Errands & Shopping": ShoppingBag,
  "Moving & Delivery": Truck,
  "Cleaning": Sparkles,
  "Small Repairs & Maintenance": Wrench,
  "Queue & Appointment Standing": Clock,
  "Digital Help": Monitor,
  "Household Assistance": Home,
  "Other": Circle,
};

const TRUST_PILLS = [
  { icon: BadgeCheck, label: "CNIC Verified Taskers" },
  { icon: CheckCircle, label: "PKR Pricing" },
  { icon: MessageSquare, label: "Safe Messaging" },
  { icon: MapPin, label: "Karachi · Lahore · Islamabad" },
];

// ─── Sample floating task card data ──────────────────────────────────────────
const SAMPLE_TASK = {
  title: "AC Servicing & Gas Refill",
  area: "DHA Phase 5, Karachi",
  budget: 3500,
  bids: 4,
  timing: "Today",
  urgent: true,
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"poster" | "tasker">("poster");

  const steps =
    activeTab === "poster" ? HOW_IT_WORKS_POSTER : HOW_IT_WORKS_TASKER;

  return (
    <main className="overflow-x-hidden">
      {/* ══════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════ */}
      <section
        className="relative min-h-[92vh] flex items-center overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #0D4F8C 0%, #1B6CA8 55%, #1a5f96 100%)",
        }}
      >
        {/* Islamic-pattern overlay */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cpath d='M30 0 L60 30 L30 60 L0 30 Z' fill='none' stroke='%23ffffff' stroke-width='1'/%3E%3Cpath d='M30 10 L50 30 L30 50 L10 30 Z' fill='none' stroke='%23ffffff' stroke-width='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: "60px 60px",
          }}
        />
        {/* Radial glow */}
        <div
          aria-hidden="true"
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-10"
          style={{
            background:
              "radial-gradient(circle, #F5A623 0%, transparent 70%)",
            transform: "translate(30%, -30%)",
          }}
        />

        <div className="container relative z-10 py-20 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: copy */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="text-white"
            >
              {/* Eyebrow */}
              <motion.div variants={fadeInUp} className="mb-5">
                <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/90 text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F5A623] animate-pulse" />
                  Pakistan Ka Apna Task Marketplace
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                variants={fadeInUp}
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-3"
              >
                Pakistan Ka Apna
                <br />
                <span className="text-[#F5A623]">Kaam Marketplace</span>
              </motion.h1>

              {/* Urdu sub-headline */}
              <motion.p
                variants={fadeInUp}
                className="text-2xl sm:text-3xl font-bold text-white/70 mb-5"
                style={{ fontFamily: "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif", direction: "rtl" }}
              >
                ہر کام، آسان
              </motion.p>

              {/* Sub-copy */}
              <motion.p
                variants={fadeInUp}
                className="text-white/75 text-base sm:text-lg leading-relaxed max-w-lg mb-8"
              >
                Post any everyday task — errands, repairs, cleaning, deliveries
                — and get competitive bids from verified local taskers in your
                city.
              </motion.p>

              {/* CTA buttons */}
              <motion.div
                variants={fadeInUp}
                className="flex flex-wrap gap-3 mb-8"
              >
                <Link
                  href="/post-task"
                  className="inline-flex items-center gap-2 bg-[#F5A623] hover:bg-[#e09610] text-[#1A1A2E] font-bold px-6 py-3 rounded-xl transition-all duration-200 shadow-[0_4px_16px_rgba(245,166,35,0.4)] hover:shadow-[0_6px_20px_rgba(245,166,35,0.5)] hover:-translate-y-0.5"
                >
                  Post a Task
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/home-task-feed"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 backdrop-blur-sm"
                >
                  Find Work Near You
                </Link>
              </motion.div>

              {/* Trust pills */}
              <motion.div
                variants={fadeInUp}
                className="flex flex-wrap gap-2"
              >
                {TRUST_PILLS.map((pill) => (
                  <span
                    key={pill.label}
                    className="inline-flex items-center gap-1.5 bg-white/10 border border-white/15 text-white/80 text-xs font-medium px-3 py-1.5 rounded-full"
                  >
                    <pill.icon className="w-3.5 h-3.5 text-[#F5A623]" />
                    {pill.label}
                  </span>
                ))}
              </motion.div>
            </motion.div>

            {/* Right: floating task card mockup */}
            <motion.div
              variants={scaleIn}
              initial="hidden"
              animate="visible"
              className="hidden lg:flex justify-center items-center"
            >
              <div className="relative">
                {/* Main card */}
                <div
                  className="w-80 rounded-2xl p-5 border border-white/20 shadow-[0_24px_64px_rgba(0,0,0,0.35)]"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    backdropFilter: "blur(20px)",
                  }}
                >
                  {/* Card header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="inline-flex items-center gap-1 bg-[#F5A623] text-[#1A1A2E] text-[10px] font-bold px-2 py-0.5 rounded-full mb-2">
                        <Zap className="w-2.5 h-2.5" /> URGENT
                      </span>
                      <h3 className="text-white font-bold text-sm leading-snug">
                        {SAMPLE_TASK.title}
                      </h3>
                    </div>
                    <span className="text-[#F5A623] font-extrabold text-lg whitespace-nowrap ml-3">
                      {formatPkr(SAMPLE_TASK.budget)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-white/60 text-xs mb-1">
                    <MapPin className="w-3 h-3" />
                    {SAMPLE_TASK.area}
                  </div>
                  <div className="flex items-center gap-1.5 text-white/60 text-xs mb-4">
                    <Clock className="w-3 h-3" />
                    {SAMPLE_TASK.timing}
                  </div>

                  {/* Bid row */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    <div className="flex items-center gap-1.5">
                      <div className="flex -space-x-1.5">
                        {["B", "A", "U"].map((initial) => (
                          <div
                            key={initial}
                            className="w-6 h-6 rounded-full bg-[#1B6CA8] border-2 border-white/20 flex items-center justify-center text-white text-[9px] font-bold"
                          >
                            {initial}
                          </div>
                        ))}
                      </div>
                      <span className="text-white/70 text-xs">
                        {SAMPLE_TASK.bids} bids
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30">
                      <CheckCircle className="w-2.5 h-2.5" /> Verified
                    </span>
                  </div>
                </div>

                {/* Floating mini card — bid notification */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  className="absolute -bottom-6 -left-8 bg-white rounded-xl px-4 py-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.2)] flex items-center gap-2.5"
                >
                  <div className="w-8 h-8 rounded-full bg-[#1B6CA8] flex items-center justify-center flex-shrink-0">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-[#1A1A2E] text-xs font-bold">New bid received!</p>
                    <p className="text-[#5A6478] text-[10px]">Muhammad Bilal — {formatPkr(3200)}</p>
                  </div>
                </motion.div>

                {/* Floating mini card — verified badge */}
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.5 }}
                  className="absolute -top-5 -right-6 bg-white rounded-xl px-3 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.2)] flex items-center gap-2"
                >
                  <BadgeCheck className="w-4 h-4 text-emerald-500" />
                  <span className="text-[#1A1A2E] text-xs font-bold">CNIC Verified</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0" aria-hidden="true">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60 L0 30 Q360 0 720 30 Q1080 60 1440 30 L1440 60 Z" fill="#F2F4F7" />
          </svg>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          STATS BAR
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-[#F5A623] py-8" style={{color:'#1A1A2E', backgroundColor:'#F5A623', fontWeight:700}}>
        <div className="container">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
          >
            {STATS.map((stat) => (
              <motion.divv
                key={statt.label}
                variants={fadeInUp}
                className="text-center"
              >
                <p className="text-3xl sm:text-4xl font-extrabold text-[#1A1A2E] tracking-tight">
                  {stat.value}
                </p>
                <p className="text-[#1A1A2E]/70 text-sm font-medium mt-1">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-[#F2F4F7]">
        <div className="container">
          <Reveal className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A2E] tracking-tight mb-2">
              Kaam Karna Hua Aasan
            </h2>
            <p
              className="text-xl text-[#5A6478] mb-6"
              style={{ fontFamily: "'Noto Nastaliq Urdu', serif", direction: "rtl" }}
            >
              دو طریقے، ایک پلیٹ فارم
            </p>

            {/* Tab toggle */}
            <div className="inline-flex bg-white border border-[#D6DCE8] rounded-xl p-1 shadow-sm">
              <button
                onClick={() => setActiveTab("poster")}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeTab === "poster"
                    ? "bg-[#1B6CA8] text-white shadow-sm"
                    : "text-[#5A6478] hover:text-[#1A1A2E]"
                }`}
              >
                I Need Help (Poster)
              </button>
              <button
                onClick={() => setActiveTab("tasker")}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeTab === "tasker"
                    ? "bg-[#1B6CA8] text-white shadow-sm"
                    : "text-[#5A6478] hover:text-[#1A1A2E]"
                }`}
              >
                I Want to Work (Tasker)
              </button>
            </div>
          </Reveal>

          {/* Steps */}
          <motion.div
            key={activeTab}
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-0 relative"
          >
            {steps.map((step, idx) => (
              <motion.div
                key={step.step}
                variants={fadeInUp}
                className="relative flex flex-col items-center text-center px-6 py-8"
              >
                {/* Connector line (desktop) */}
                {idx < steps.length - 1 && (
                  <div
                    aria-hidden="true"
                    className="hidden md:block absolute top-[2.75rem] left-[calc(50%+2.5rem)] right-0 h-px bg-[#D6DCE8] z-0"
                  />
                )}

                {/* Step number circle */}
                <div className="relative z-10 w-14 h-14 rounded-full bg-[#1B6CA8] text-white flex items-center justify-center text-xl font-extrabold mb-5 shadow-[0_4px_16px_rgba(27,108,168,0.3)]">
                  {step.step}
                </div>

                <div className="bg-white rounded-2xl p-6 border border-[#D6DCE8] shadow-[0_2px_12px_rgba(26,26,46,0.06)] w-full">
                  <h3 className="text-[#1A1A2E] font-bold text-lg mb-2">
                    {step.title}
                  </h3>
                  <p className="text-[#5A6478] text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA under steps */}
          <Reveal className="text-center mt-10">
            <Link
              href={activeTab === "poster" ? "/post-task" : "/home-task-feed"}
              className="inline-flex items-center gap-2 bg-[#1B6CA8] hover:bg-[#155a8a] text-white font-semibold px-7 py-3 rounded-xl transition-all duration-200 shadow-[0_4px_12px_rgba(27,108,168,0.25)]"
            >
              {activeTab === "poster" ? "Post Your First Task" : "Browse Tasks Near You"}
              <ChevronRight className="w-4 h-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          CATEGORIES
      ══════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container">
          <Reveal className="mb-12">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A2E] tracking-tight mb-2">
                  Kya Kaam Chahiye?
                </h2>
                <p className="text-[#5A6478] text-base">
                  From errands to repairs — post any practical task.
                </p>
              </div>
              <Link
                href="/home-task-feed"
                className="inline-flex items-center gap-1.5 text-[#1B6CA8] font-semibold text-sm hover:underline flex-shrink-0"
              >
                Browse all tasks <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </Reveal>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {TASK_CATEGORIES.map((cat) => {
              const Icon = CATEGORY_ICONS[cat] ?? Circle;
              return (
                <motion.div key={cat} variants={scaleIn}>
                  <Link
                    href={`/home-task-feed?category=${encodeURIComponent(cat)}`}
                    className="group flex flex-col items-center text-center p-5 rounded-2xl border border-[#D6DCE8] bg-[#F2F4F7] hover:bg-[#1B6CA8] hover:border-[#1B6CA8] transition-all duration-250 shadow-[0_1px_4px_rgba(26,26,46,0.06)] hover:shadow-[0_8px_24px_rgba(27,108,168,0.2)] hover:-translate-y-1"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white group-hover:bg-white/20 flex items-center justify-center mb-3 transition-colors duration-200 shadow-[0_1px_4px_rgba(26,26,46,0.08)]">
                      <Icon className="w-6 h-6 text-[#1B6CA8] group-hover:text-white transition-colors duration-200" />
                    </div>
                    <p className="text-[#1A1A2E] group-hover:text-white font-semibold text-sm leading-snug mb-1 transition-colors duration-200">
                      {cat}
                    </p>
                    <span className="text-[#1B6CA8] group-hover:text-white/70 text-xs font-medium transition-colors duration-200">
                      Browse →
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          TRUST SECTION
      ══════════════════════════════════════════════════════════ */}
      <section
        className="py-20 md:py-28"
        style={{ background: "linear-gradient(135deg, #0D2E4F 0%, #1A1A2E 100%)" }}
      >
        <div className="container">
          <Reveal className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
              Aapki Safety, Hamari Zimmedari
            </h2>
            <p
              className="text-xl text-white/50"
              style={{ fontFamily: "'Noto Nastaliq Urdu', serif", direction: "rtl" }}
            >
              آپ کی حفاظت، ہماری ذمہ داری
            </p>
          </Reveal>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {TRUST_FEATURES.map((feat) => (
              <motion.div
                key={feat.title}
                variants={fadeInUp}
                className="rounded-2xl p-6 border border-white/10 hover:border-[#F5A623]/40 transition-all duration-300 hover:-translate-y-1"
                style={{ background: "rgba(255,255,255,0.05)" }}
              >
                <div className="w-11 h-11 rounded-xl bg-[#1B6CA8]/40 flex items-center justify-center mb-4">
                  <feat.icon className="w-5 h-5 text-[#F5A623]" />
                </div>
                <h3 className="text-white font-bold text-base mb-2">
                  {feat.title}
                </h3>
                <p className="text-white/55 text-sm leading-relaxed">
                  {feat.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-[#F2F4F7]">
        <div className="container">
          <Reveal className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A2E] tracking-tight mb-2">
              Logon Ki Zubani
            </h2>
            <p
              className="text-xl text-[#5A6478]"
              style={{ fontFamily: "'Noto Nastaliq Urdu', serif", direction: "rtl" }}
            >
              لوگوں کی زبانی
            </p>
          </Reveal>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {TESTIMONIALS.map((t) => (
              <motion.div
                key={t.name}
                variants={fadeInUp}
                className="bg-white rounded-2xl p-6 border border-[#D6DCE8] shadow-[0_2px_12px_rgba(26,26,46,0.07)] flex flex-col"
              >
                {/* Quote mark */}
                <span className="text-5xl font-serif text-[#F5A623] leading-none mb-3 select-none">
                  &ldquo;
                </span>

                {/* Stars */}
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-[#F5A623] fill-[#F5A623]"
                    />
                  ))}
                </div>

                <p className="text-[#1A1A2E] text-sm leading-relaxed flex-1 mb-5">
                  {t.text}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-[#D6DCE8]">
                  <div>
                    <p className="text-[#1A1A2E] font-bold text-sm">{t.name}</p>
                    <p className="text-[#5A6478] text-xs flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {t.city}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      t.role === "Tasker"
                        ? "bg-[#1B6CA8]/10 text-[#1B6CA8]"
                        : "bg-[#F5A623]/15 text-[#b87a10]"
                    }`}
                  >
                    {t.role}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          CITIES
      ══════════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-20 bg-white border-t border-[#D6DCE8]">
        <div className="container">
          <Reveal className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A2E] tracking-tight mb-1">
              Apna Shehar Chunein
            </h2>
            <p className="text-[#5A6478] text-sm">
              We are live in 4 cities and expanding fast.
            </p>
          </Reveal>

          <Reveal>
            <div className="flex flex-wrap justify-center gap-3">
              {ACTIVE_CITIES.map((city) => (
                <Link
                  key={city}
                  href={`/home-task-feed?city=${city.toLowerCase()}`}
                  className="inline-flex items-center gap-2 bg-[#1B6CA8] hover:bg-[#155a8a] text-white font-semibold px-5 py-2.5 rounded-full transition-all duration-200 shadow-[0_2px_8px_rgba(27,108,168,0.25)] hover:shadow-[0_4px_14px_rgba(27,108,168,0.35)] hover:-translate-y-0.5"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  {city}
                </Link>
              ))}
              {COMING_SOON_CITIES.map((city) => (
                <span
                  key={city}
                  className="inline-flex items-center gap-2 bg-[#F2F4F7] border border-[#D6DCE8] text-[#5A6478] font-medium px-5 py-2.5 rounded-full cursor-default"
                >
                  <span className="w-2 h-2 rounded-full bg-[#D6DCE8]" />
                  {city}
                  <span className="text-[10px] font-semibold bg-[#D6DCE8] text-[#5A6478] px-1.5 py-0.5 rounded-full">
                    Soon
                  </span>
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════════════════════════ */}
      <section
        className="relative py-20 md:py-28 overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #0D4F8C 0%, #1B6CA8 55%, #1a5f96 100%)",
        }}
      >
        {/* Pattern overlay */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cpath d='M30 0 L60 30 L30 60 L0 30 Z' fill='none' stroke='%23ffffff' stroke-width='1'/%3E%3C/svg%3E")`,
            backgroundSize: "60px 60px",
          }}
        />

        <div className="container relative z-10 text-center">
          <Reveal>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-3">
              Aaj Hi Shuru Karein
            </h2>
            <p
              className="text-2xl text-white/60 mb-8"
              style={{ fontFamily: "'Noto Nastaliq Urdu', serif", direction: "rtl" }}
            >
              آج ہی شروع کریں
            </p>
            <p className="text-white/70 text-base max-w-xl mx-auto mb-10 leading-relaxed">
              Join thousands of Pakistanis already using {APP_NAME} to get
              everyday tasks done — or to earn flexible income on their own
              schedule.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/post-task"
                className="inline-flex items-center gap-2 bg-[#F5A623] hover:bg-[#e09610] text-[#1A1A2E] font-bold px-8 py-3.5 rounded-xl transition-all duration-200 shadow-[0_4px_16px_rgba(245,166,35,0.4)] hover:-translate-y-0.5"
              >
                Post Your First Task
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/auth"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 backdrop-blur-sm"
              >
                Join as a Tasker
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
