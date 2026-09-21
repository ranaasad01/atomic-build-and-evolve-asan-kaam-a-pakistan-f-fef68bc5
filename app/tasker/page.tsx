"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Clock, Shield, Banknote, Star, ChevronDown, ChevronRight, Wallet, BadgeCheck, Headphones, TrendingUp, ArrowRight, Zap } from 'lucide-react';
import { Reveal } from "@/components/Reveal";
import { staggerContainer, fadeInUp, scaleIn } from "@/lib/motion";
import { COMMISSION_RATE, MIN_BALANCE_PKR, formatPKR } from "@/lib/data";

const COMMISSION_PCT = Math.round(COMMISSION_RATE * 100);

// ─── Benefits ────────────────────────────────────────────────────────────────
const BENEFITS = [
  {
    icon: Clock,
    title: "Apne Waqt Par Kaam",
    urdu: "اپنے وقت پر کام",
    desc: "Morning, evening, weekends — you choose when you work. No fixed shifts, no boss.",
    color: "bg-blue-50 text-[var(--primary)]",
  },
  {
    icon: Banknote,
    title: "PKR Mein Kamaai",
    urdu: "پی کے آر میں کمائی",
    desc: `Earn directly in Pakistani Rupees. Every bid, every commission, every balance top-up shown clearly before you commit.`,
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: BadgeCheck,
    title: "Verified Badge",
    urdu: "تصدیق شدہ بیج",
    desc: "Complete a quick CNIC check and earn your verified badge. Verified taskers get more bids and higher trust from posters.",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: Headphones,
    title: "In-App Support",
    urdu: "ان ایپ سپورٹ",
    desc: "Disputes, cancellations, or questions — our support team is reachable inside the app. You are never left alone.",
    color: "bg-purple-50 text-purple-600",
  },
];

// ─── Verification Steps ───────────────────────────────────────────────────────
const VERIFICATION_STEPS = [
  {
    num: "01",
    title: "Sign Up",
    urdu: "سائن اپ کریں",
    desc: "Create your Asan Kaam account and select the Tasker role.",
  },
  {
    num: "02",
    title: "Submit CNIC",
    urdu: "شناختی کارڈ جمع کریں",
    desc: "Upload a clear photo of your CNIC front and back. Reviewed within 24 hours.",
  },
  {
    num: "03",
    title: "Top Up Balance",
    urdu: "بیلنس ڈالیں",
    desc: `Add a minimum prepaid balance of ${formatPKR(MIN_BALANCE_PKR)} to unlock bidding on tasks.`,
  },
  {
    num: "04",
    title: "Start Bidding",
    urdu: "بولی لگانا شروع کریں",
    desc: "Browse the live task feed, submit competitive bids, and earn your first review.",
  },
];

// ─── FAQ ─────────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: "Commission kitni kategi?",
    urdu: "کمیشن کتنی کٹے گی؟",
    a: `Asan Kaam sirf successfully completed tasks par ${COMMISSION_PCT}% commission leta hai. Yeh commission task complete hone ke baad balance se deduct hoti hai. Bid karne se pehle aapko exact commission estimate dikhaya jata hai.`,
  },
  {
    q: "Minimum balance kyun chahiye?",
    urdu: "کم از کم بیلنس کیوں چاہیے؟",
    a: `Bidding shuru karne ke liye ${formatPKR(MIN_BALANCE_PKR)} ka prepaid balance zaroori hai. Yeh platform ki quality aur serious taskers ko ensure karta hai. Balance aapka hai — sirf commission deduct hoti hai jab task complete ho.`,
  },
  {
    q: "Kya main apna phone number poster ko de sakta hoon?",
    urdu: "کیا میں اپنا فون نمبر پوسٹر کو دے سکتا ہوں؟",
    a: "Task accept hone se pehle personal contact share karna platform rules ke khilaf hai. Asan Kaam ka in-app messaging system safe aur recorded hai — dono parties ke liye behtar protection.",
  },
];

// ─── Earnings Example ─────────────────────────────────────────────────────────
const EARNINGS_EXAMPLE = {
  taskBudget: 3500,
  commission: Math.round(3500 * COMMISSION_RATE),
  taskerEarns: 3500 - Math.round(3500 * COMMISSION_RATE),
};

export default function TaskerPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <main className="overflow-x-hidden">
      {/* ── HERO ── */}
      <section className="relative min-h-[88vh] flex items-center overflow-hidden bg-[#0f2744]">
        {/* Deep blue gradient background */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #0f2744 0%, #1B6CA8 55%, #1a5c94 100%)",
          }}
          aria-hidden="true"
        />

        {/* Geometric pattern overlay — Pakistani tile-inspired */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
          aria-hidden="true"
        />

        {/* Accent glow */}
        <div
          className="absolute top-1/4 right-0 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: "#F5A623" }}
          aria-hidden="true"
        />
        <div
          className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full opacity-10 blur-3xl"
          style={{ background: "#F5A623" }}
          aria-hidden="true"
        />

        <div className="container relative z-10 py-20 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Copy */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="text-white"
            >
              {/* Urdu headline */}
              <motion.div variants={fadeInUp} className="mb-3">
                <span
                  className="text-3xl md:text-4xl font-bold leading-snug block"
                  style={{ fontFamily: "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif", direction: "rtl" }}
                >
                  ٹاسکر بنیں، کمائیں
                </span>
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 leading-tight"
              >
                Tasker Banein,{" "}
                <span style={{ color: "#F5A623" }}>Kamaein</span>
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-white/75 text-lg md:text-xl leading-relaxed mb-8 max-w-lg"
              >
                Pakistan ke sabse trusted local task marketplace par apni skills
                se kamaai karein. Flexible hours, PKR payments, aur full in-app
                support — sab kuch ek jagah.
              </motion.p>

              <motion.div variants={fadeInUp} className="flex flex-wrap gap-3">
                <Link
                  href="/auth"
                  className="btn-primary text-base px-6 py-3 rounded-xl shadow-lg"
                  style={{ background: "#F5A623", color: "#1A1A2E" }}
                >
                  Abhi Register Karein
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/home-task-feed"
                  className="btn-secondary text-base px-6 py-3 rounded-xl border-white/40 text-white hover:bg-white/10"
                >
                  Tasks Dekhein
                </Link>
              </motion.div>

              {/* Trust pills */}
              <motion.div
                variants={fadeInUp}
                className="flex flex-wrap gap-2 mt-8"
              >
                {[
                  "CNIC Verified",
                  `${COMMISSION_PCT}% Commission Only`,
                  "PKR Payments",
                  "In-App Support",
                ].map((pill) => (
                  <span
                    key={pill}
                    className="inline-flex items-center gap-1.5 text-xs font-medium bg-white/10 border border-white/20 text-white/80 px-3 py-1 rounded-full"
                  >
                    <CheckCircle className="w-3 h-3 text-[#F5A623]" aria-hidden="true" />
                    {pill}
                  </span>
                ))}
              </motion.div>
            </motion.div>

            {/* Right: Earnings card */}
            <motion.div
              variants={scaleIn}
              initial="hidden"
              animate="visible"
              className="hidden lg:block"
            >
              <div
                className="rounded-2xl p-6 border border-white/15"
                style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(16px)" }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-full bg-[#F5A623]/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-[#F5A623]" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">Aaj ki Kamaai</p>
                    <p className="text-white/50 text-xs">Live earnings snapshot</p>
                  </div>
                </div>

                <div className="space-y-3 mb-5">
                  {[
                    { label: "Grocery Run — Gulshan", amount: 600, status: "Completed" },
                    { label: "Furniture Move — DHA", amount: 4500, status: "In Progress" },
                    { label: "NADRA Queue — F-8", amount: 800, status: "Assigned" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3 border border-white/10"
                    >
                      <div>
                        <p className="text-white text-sm font-medium leading-tight">{item.label}</p>
                        <p className="text-white/50 text-xs mt-0.5">{item.status}</p>
                      </div>
                      <span className="text-[#F5A623] font-bold text-sm">
                        {formatPKR(item.amount)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/10 pt-4 flex items-center justify-between">
                  <span className="text-white/60 text-sm">Total aaj</span>
                  <span className="text-white font-bold text-xl">{formatPKR(5900)}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── BENEFITS ── */}
      <section className="py-20 md:py-28 bg-[var(--background)]">
        <div className="container">
          <Reveal>
            <div className="text-center mb-14">
              <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[var(--primary)] bg-blue-50 px-3 py-1 rounded-full mb-3">
                Kyun Asan Kaam?
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] tracking-tight">
                Tasker Banne Ke Fayde
              </h2>
              <p className="text-[var(--muted-foreground)] mt-3 max-w-xl mx-auto">
                Flexible, transparent, aur Pakistan ke liye banaya gaya.
              </p>
            </div>
          </Reveal>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {BENEFITS.map((b) => (
              <motion.div
                key={b.title}
                variants={fadeInUp}
                className="card p-6 rounded-2xl flex flex-col gap-4 hover:shadow-[0_4px_24px_rgba(27,108,168,0.12)] transition-shadow duration-300"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${b.color}`}>
                  <b.icon className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-bold text-[var(--foreground)] text-base leading-tight">{b.title}</p>
                  <p
                    className="text-xs text-[var(--muted-foreground)] mt-0.5"
                    style={{ direction: "rtl", fontFamily: "'Noto Nastaliq Urdu', serif" }}
                  >
                    {b.urdu}
                  </p>
                </div>
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── HOW EARNINGS WORK ── */}
      <section
        className="py-20 md:py-28"
        style={{ background: "linear-gradient(135deg, #0f2744 0%, #1B6CA8 100%)" }}
      >
        <div className="container">
          <Reveal>
            <div className="text-center mb-14">
              <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#F5A623] bg-[#F5A623]/10 border border-[#F5A623]/20 px-3 py-1 rounded-full mb-3">
                Kamaai Ka Tarika
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                Commission Kaise Kaam Karti Hai
              </h2>
              <p className="text-white/60 mt-3 max-w-xl mx-auto">
                Koi hidden fees nahi. Sirf completed tasks par commission.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Left: Flow steps */}
            <Reveal>
              <div className="space-y-4">
                {[
                  {
                    icon: Wallet,
                    step: "Balance Top-Up",
                    desc: `Bidding shuru karne ke liye ${formatPKR(MIN_BALANCE_PKR)} ka minimum prepaid balance add karein.`,
                    color: "bg-blue-400/20 text-blue-200",
                  },
                  {
                    icon: Zap,
                    step: "Assignment Par Reservation",
                    desc: `Jab poster aapko select kare, commission amount (${COMMISSION_PCT}%) temporarily reserve ho jati hai.`,
                    color: "bg-amber-400/20 text-amber-200",
                  },
                  {
                    icon: CheckCircle,
                    step: "Completion Par Deduction",
                    desc: "Task verify hone ke baad commission deduct hoti hai. Baaki earnings aapki hain.",
                    color: "bg-emerald-400/20 text-emerald-200",
                  },
                  {
                    icon: Shield,
                    step: "Cancellation Par Release",
                    desc: "Agar task cancel ya dispute ho, reserved commission wapas balance mein aa jati hai.",
                    color: "bg-purple-400/20 text-purple-200",
                  },
                ].map((item, i) => (
                  <div
                    key={item.step}
                    className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-2xl p-5"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color}`}>
                      <item.icon className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">
                        <span className="text-white/40 mr-2 font-mono">0{i + 1}</span>
                        {item.step}
                      </p>
                      <p className="text-white/60 text-sm mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Right: Example card */}
            <Reveal delay={0.15}>
              <div className="bg-white/8 border border-white/15 rounded-2xl p-7" style={{ background: "rgba(255,255,255,0.07)" }}>
                <p className="text-white/50 text-xs uppercase tracking-widest mb-5">Misaal — Example Task</p>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70 text-sm">Task Budget</span>
                    <span className="text-white font-bold">{formatPKR(EARNINGS_EXAMPLE.taskBudget)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70 text-sm">Platform Commission ({COMMISSION_PCT}%)</span>
                    <span className="text-red-300 font-semibold">- {formatPKR(EARNINGS_EXAMPLE.commission)}</span>
                  </div>
                  <div className="border-t border-white/15 pt-3 flex justify-between items-center">
                    <span className="text-white font-semibold">Aapki Kamaai</span>
                    <span className="text-[#F5A623] font-bold text-xl">{formatPKR(EARNINGS_EXAMPLE.taskerEarns)}</span>
                  </div>
                </div>

                <div className="bg-[#F5A623]/10 border border-[#F5A623]/20 rounded-xl p-4">
                  <p className="text-[#F5A623] text-xs font-semibold mb-1">Yaad Rakhein</p>
                  <p className="text-white/70 text-xs leading-relaxed">
                    Commission rate configurable hai aur bid karne se pehle exact amount dikhaya jata hai. Koi surprise nahi.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── VERIFICATION STEPS ── */}
      <section className="py-20 md:py-28 bg-[var(--card)]">
        <div className="container">
          <Reveal>
            <div className="text-center mb-14">
              <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[var(--primary)] bg-blue-50 px-3 py-1 rounded-full mb-3">
                Verification Process
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] tracking-tight">
                Verified Tasker Kaise Banein
              </h2>
              <p className="text-[var(--muted-foreground)] mt-3 max-w-xl mx-auto">
                Sirf 4 asaan steps mein apna verified badge hasil karein.
              </p>
            </div>
          </Reveal>

          {/* Stepper */}
          <div className="relative">
            {/* Connector line (desktop) */}
            <div
              className="hidden md:block absolute top-10 left-0 right-0 h-0.5 bg-[var(--border)] z-0"
              style={{ marginLeft: "calc(12.5% + 20px)", marginRight: "calc(12.5% + 20px)" }}
              aria-hidden="true"
            />

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10"
            >
              {VERIFICATION_STEPS.map((step, i) => (
                <motion.div
                  key={step.num}
                  variants={fadeInUp}
                  className="flex flex-col items-center text-center"
                >
                  {/* Step circle */}
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center mb-5 border-4 font-bold text-xl"
                    style={{
                      background: i === 0 ? "var(--primary)" : "var(--card)",
                      borderColor: i === 0 ? "var(--primary)" : "var(--border)",
                      color: i === 0 ? "#fff" : "var(--primary)",
                      boxShadow: i === 0 ? "0 4px 20px rgba(27,108,168,0.3)" : "none",
                    }}
                  >
                    {step.num}
                  </div>
                  <h3 className="font-bold text-[var(--foreground)] text-base mb-1">{step.title}</h3>
                  <p
                    className="text-xs text-[var(--muted-foreground)] mb-2"
                    style={{ direction: "rtl", fontFamily: "'Noto Nastaliq Urdu', serif" }}
                  >
                    {step.urdu}
                  </p>
                  <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <Reveal delay={0.2}>
            <div className="mt-12 text-center">
              <Link
                href="/verification-status"
                className="btn-secondary inline-flex items-center gap-2"
              >
                Verification Status Dekhein
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section
        className="py-12"
        style={{ background: "#F5A623" }}
      >
        <div className="container">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
          >
            {[
              { value: "4,200+", label: "Active Taskers" },
              { value: "15,000+", label: "Tasks Completed" },
              { value: "4.8★", label: "Avg. Tasker Rating" },
              { value: "4", label: "Cities Live" },
            ].map((stat) => (
              <motion.div key={stat.label} variants={fadeInUp}>
                <p className="text-3xl md:text-4xl font-bold text-[#1A1A2E]">{stat.value}</p>
                <p className="text-sm font-medium text-[#1A1A2E]/70 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 md:py-28 bg-[var(--background)]">
        <div className="container max-w-2xl">
          <Reveal>
            <div className="text-center mb-12">
              <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[var(--primary)] bg-blue-50 px-3 py-1 rounded-full mb-3">
                Aksar Pooche Jane Wale Sawalat
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] tracking-tight">
                FAQ
              </h2>
            </div>
          </Reveal>

          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <div className="card rounded-2xl overflow-hidden">
                  <button
                    className="w-full flex items-start justify-between gap-4 p-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    aria-expanded={openFaq === i}
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-[var(--foreground)] text-sm leading-snug">{faq.q}</p>
                      <p
                        className="text-xs text-[var(--muted-foreground)] mt-0.5"
                        style={{ direction: "rtl", fontFamily: "'Noto Nastaliq Urdu', serif" }}
                      >
                        {faq.urdu}
                      </p>
                    </div>
                    <motion.div
                      animate={{ rotate: openFaq === i ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                      className="flex-shrink-0 mt-0.5"
                    >
                      <ChevronDown
                        className="w-5 h-5 text-[var(--muted-foreground)]"
                        aria-hidden="true"
                      />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {openFaq === i && (
                      <motion.div
                        key="answer"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-5 text-sm text-[var(--muted-foreground)] leading-relaxed border-t border-[var(--border)] pt-4">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        className="py-20 md:py-28"
        style={{ background: "linear-gradient(135deg, #0f2744 0%, #1B6CA8 100%)" }}
      >
        <div className="container text-center">
          <Reveal>
            <div className="max-w-2xl mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-[#F5A623]/20 flex items-center justify-center mx-auto mb-6">
                <Star className="w-8 h-8 text-[#F5A623]" aria-hidden="true" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
                Aaj Hi Shuru Karein
              </h2>
              <p
                className="text-xl text-white/70 mb-3"
                style={{ fontFamily: "'Noto Nastaliq Urdu', serif", direction: "rtl" }}
              >
                آج ہی شروع کریں
              </p>
              <p className="text-white/60 mb-8 leading-relaxed">
                Hazaron Pakistanis pehle se Asan Kaam par kaam kar rahe hain.
                Apni skills se kamaai shuru karein — registration bilkul free hai.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link
                  href="/auth"
                  className="btn-primary text-base px-8 py-3 rounded-xl shadow-lg"
                  style={{ background: "#F5A623", color: "#1A1A2E" }}
                >
                  Abhi Register Karein
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/home-task-feed"
                  className="btn-secondary text-base px-8 py-3 rounded-xl border-white/30 text-white hover:bg-white/10"
                >
                  Tasks Browse Karein
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
