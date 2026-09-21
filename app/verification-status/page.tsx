"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Clock, AlertCircle, XCircle, CheckCircle, Upload, Lock, Star, TrendingUp, Zap, ChevronRight, FileText, Eye } from 'lucide-react';
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import { VerificationStatus } from "@/lib/data";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────

interface VerificationStep {
  id: string;
  label: string;
  labelUrdu: string;
  state: "completed" | "current" | "pending";
}

// ─── Mock state ──────────────────────────────────────────────────────────────

const MOCK_STATUS: VerificationStatus = "submitted";

function buildSteps(status: VerificationStatus): VerificationStep[] {
  const allSteps: VerificationStep[] = [
    { id: "phone", label: "Phone Verified", labelUrdu: "فون تصدیق", state: "pending" },
    { id: "cnic_submitted", label: "CNIC Submitted", labelUrdu: "شناختی کارڈ جمع", state: "pending" },
    { id: "cnic_verified", label: "CNIC Verified", labelUrdu: "شناختی کارڈ تصدیق", state: "pending" },
    { id: "profile", label: "Profile Complete", labelUrdu: "پروفائل مکمل", state: "pending" },
  ];

  if (status === "unverified") {
    allSteps[0].state = "current";
  } else if (status === "submitted") {
    allSteps[0].state = "completed";
    allSteps[1].state = "completed";
    allSteps[2].state = "current";
  } else if (status === "verified") {
    allSteps.forEach((s) => (s.state = "completed"));
  } else if (status === "restricted") {
    allSteps[0].state = "completed";
    allSteps[1].state = "current";
  }

  return allSteps;
}

const STATUS_CONFIG: Record<
  VerificationStatus,
  {
    icon: React.ElementType;
    label: string;
    labelUrdu: string;
    desc: string;
    colorClass: string;
    bgClass: string;
    borderClass: string;
  }
> = {
  verified: {
    icon: Shield,
    label: "Verified",
    labelUrdu: "تصدیق شدہ",
    desc: "Your identity has been confirmed. You can bid on tasks and accept paid work across all active cities.",
    colorClass: "text-emerald-700",
    bgClass: "bg-emerald-50",
    borderClass: "border-emerald-200",
  },
  submitted: {
    icon: Clock,
    label: "Under Review",
    labelUrdu: "جائزہ جاری ہے",
    desc: "Your CNIC documents have been received and are being reviewed by our team. This usually takes 1 to 2 business days.",
    colorClass: "text-amber-700",
    bgClass: "bg-amber-50",
    borderClass: "border-amber-200",
  },
  unverified: {
    icon: AlertCircle,
    label: "Not Verified",
    labelUrdu: "غیر تصدیق شدہ",
    desc: "You have not yet submitted your CNIC for verification. Complete verification to unlock bidding and earning on Asan Kaam.",
    colorClass: "text-[var(--muted-foreground)]",
    bgClass: "bg-[var(--background)]",
    borderClass: "border-[var(--border)]",
  },
  restricted: {
    icon: XCircle,
    label: "Restricted",
    labelUrdu: "محدود",
    desc: "Your account has been temporarily restricted. Please contact support to resolve this. You cannot bid on tasks until the restriction is lifted.",
    colorClass: "text-red-700",
    bgClass: "bg-red-50",
    borderClass: "border-red-200",
  },
};

const BENEFITS = [
  {
    icon: Star,
    title: "Higher Bid Acceptance",
    desc: "Verified taskers receive 3x more task assignments than unverified ones.",
  },
  {
    icon: TrendingUp,
    title: "Unlock Higher Budgets",
    desc: "Tasks above Rs 5,000 are only visible to verified taskers.",
  },
  {
    icon: Zap,
    title: "Priority in Search",
    desc: "Your profile appears higher in poster search results with a verified badge.",
  },
  {
    icon: Shield,
    title: "Trust Badge on Profile",
    desc: "A prominent verified shield on your public profile builds poster confidence.",
  },
];

// ─── Page ────────────────────────────────────────────────────────────────────

export default function VerificationStatusPage() {
  const [currentStatus, setCurrentStatus] =
    useState<VerificationStatus>(MOCK_STATUS);
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const config = STATUS_CONFIG[currentStatus];
  const StatusIcon = config.icon;
  const steps = buildSteps(currentStatus);
  const showUpload = currentStatus === "unverified" || currentStatus === "submitted";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!frontFile || !backFile) return;
    setSubmitted(true);
    setTimeout(() => {
      setCurrentStatus("submitted");
      setSubmitted(false);
    }, 1800);
  }

  return (
    <main className="min-h-screen bg-[var(--background)] pb-16">
      {/* ── Page Header ── */}
      <section className="bg-[var(--primary)] pt-10 pb-14 relative overflow-hidden">
        {/* Subtle geometric overlay */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #fff 0px, #fff 1px, transparent 1px, transparent 12px)",
          }}
          aria-hidden="true"
        />
        <div className="container relative z-10">
          <Reveal>
            <div className="flex flex-col gap-1">
              <p className="text-white/60 text-sm font-medium tracking-wide uppercase">
                Tasker Dashboard
              </p>
              <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                Verification Status
              </h1>
              <p
                className="text-white/70 text-lg mt-0.5"
                style={{ fontFamily: "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif" }}
                dir="rtl"
              >
                تصدیق کی حیثیت
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="container -mt-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Left column ── */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Status Card */}
            <Reveal>
              <div
                className={cn(
                  "card p-6 border-2 flex flex-col sm:flex-row items-start sm:items-center gap-5",
                  config.borderClass
                )}
              >
                <div
                  className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0",
                    config.bgClass
                  )}
                >
                  <StatusIcon
                    className={cn("w-8 h-8", config.colorClass)}
                    aria-hidden="true"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span
                      className={cn(
                        "text-xl font-bold",
                        config.colorClass
                      )}
                    >
                      {config.label}
                    </span>
                    <span
                      className={cn(
                        "text-sm px-2 py-0.5 rounded-full font-medium border",
                        config.bgClass,
                        config.colorClass,
                        config.borderClass
                      )}
                      style={{
                        fontFamily:
                          "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif",
                      }}
                      dir="rtl"
                    >
                      {config.labelUrdu}
                    </span>
                  </div>
                  <p className="text-[var(--muted-foreground)] text-sm leading-relaxed">
                    {config.desc}
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Verification Steps */}
            <Reveal delay={0.05}>
              <div className="card p-6">
                <h2 className="section-heading mb-5 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[var(--primary)]" aria-hidden="true" />
                  Verification Steps
                </h2>
                <ol className="relative flex flex-col gap-0">
                  {steps.map((step, idx) => {
                    const isLast = idx === steps.length - 1;
                    return (
                      <li key={step.id} className="flex gap-4">
                        {/* Connector line + icon */}
                        <div className="flex flex-col items-center">
                          <div
                            className={cn(
                              "w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-colors",
                              step.state === "completed"
                                ? "bg-emerald-500 border-emerald-500"
                                : step.state === "current"
                                ? "bg-[var(--primary)] border-[var(--primary)]"
                                : "bg-white border-[var(--border)]"
                            )}
                          >
                            {step.state === "completed" ? (
                              <CheckCircle
                                className="w-5 h-5 text-white"
                                aria-hidden="true"
                              />
                            ) : step.state === "current" ? (
                              <Clock
                                className="w-4 h-4 text-white"
                                aria-hidden="true"
                              />
                            ) : (
                              <span className="w-2 h-2 rounded-full bg-[var(--border)]" />
                            )}
                          </div>
                          {!isLast && (
                            <div
                              className={cn(
                                "w-0.5 flex-1 my-1 min-h-[2rem]",
                                step.state === "completed"
                                  ? "bg-emerald-300"
                                  : "bg-[var(--border)]"
                              )}
                            />
                          )}
                        </div>

                        {/* Step content */}
                        <div className="pb-6 flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={cn(
                                "font-semibold text-sm",
                                step.state === "completed"
                                  ? "text-emerald-700"
                                  : step.state === "current"
                                  ? "text-[var(--primary)]"
                                  : "text-[var(--muted-foreground)]"
                              )}
                            >
                              {step.label}
                            </span>
                            <span
                              className="text-xs text-[var(--muted-foreground)]"
                              style={{
                                fontFamily:
                                  "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif",
                              }}
                              dir="rtl"
                            >
                              {step.labelUrdu}
                            </span>
                            {step.state === "completed" && (
                              <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">
                                Done
                              </span>
                            )}
                            {step.state === "current" && (
                              <span className="text-xs bg-blue-50 text-[var(--primary)] border border-blue-200 px-2 py-0.5 rounded-full font-medium">
                                In Progress
                              </span>
                            )}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </Reveal>

            {/* CNIC Upload Section */}
            {showUpload && (
              <Reveal delay={0.1}>
                <div className="card p-6">
                  <h2 className="section-heading mb-1 flex items-center gap-2">
                    <Upload className="w-5 h-5 text-[var(--primary)]" aria-hidden="true" />
                    {currentStatus === "submitted"
                      ? "Documents Submitted"
                      : "Upload CNIC Documents"}
                  </h2>
                  <p className="text-[var(--muted-foreground)] text-sm mb-5">
                    {currentStatus === "submitted"
                      ? "Your documents are under review. You will be notified once verification is complete."
                      : "Upload a clear photo of the front and back of your CNIC (Computerised National Identity Card)."}
                  </p>

                  {currentStatus === "unverified" && (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                      {/* Front */}
                      <div>
                        <label className="block text-sm font-semibold text-[var(--foreground)] mb-1.5">
                          CNIC Front Side
                          <span className="text-[var(--destructive)] ml-1">*</span>
                        </label>
                        <label
                          className={cn(
                            "flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-6 cursor-pointer transition-colors",
                            frontFile
                              ? "border-emerald-400 bg-emerald-50"
                              : "border-[var(--border)] bg-[var(--background)] hover:border-[var(--primary)] hover:bg-blue-50"
                          )}
                        >
                          <input
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={(e) =>
                              setFrontFile(e.target.files?.[0] ?? null)
                            }
                          />
                          {frontFile ? (
                            <>
                              <CheckCircle className="w-7 h-7 text-emerald-500" />
                              <span className="text-sm font-medium text-emerald-700">
                                {frontFile.name}
                              </span>
                            </>
                          ) : (
                            <>
                              <Upload className="w-7 h-7 text-[var(--muted-foreground)]" />
                              <span className="text-sm text-[var(--muted-foreground)]">
                                Tap to upload front of CNIC
                              </span>
                            </>
                          )}
                        </label>
                      </div>

                      {/* Back */}
                      <div>
                        <label className="block text-sm font-semibold text-[var(--foreground)] mb-1.5">
                          CNIC Back Side
                          <span className="text-[var(--destructive)] ml-1">*</span>
                        </label>
                        <label
                          className={cn(
                            "flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-6 cursor-pointer transition-colors",
                            backFile
                              ? "border-emerald-400 bg-emerald-50"
                              : "border-[var(--border)] bg-[var(--background)] hover:border-[var(--primary)] hover:bg-blue-50"
                          )}
                        >
                          <input
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={(e) =>
                              setBackFile(e.target.files?.[0] ?? null)
                            }
                          />
                          {backFile ? (
                            <>
                              <CheckCircle className="w-7 h-7 text-emerald-500" />
                              <span className="text-sm font-medium text-emerald-700">
                                {backFile.name}
                              </span>
                            </>
                          ) : (
                            <>
                              <Upload className="w-7 h-7 text-[var(--muted-foreground)]" />
                              <span className="text-sm text-[var(--muted-foreground)]">
                                Tap to upload back of CNIC
                              </span>
                            </>
                          )}
                        </label>
                      </div>

                      {/* Privacy notice */}
                      <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl p-4">
                        <Lock
                          className="w-4 h-4 text-[var(--primary)] flex-shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                        <p className="text-xs text-[var(--primary)] leading-relaxed">
                          Your CNIC data is handled securely and used only for identity
                          verification. Integration with a licensed verification provider
                          is coming soon. No data is shared with third parties without
                          your consent.
                        </p>
                      </div>

                      <button
                        type="submit"
                        disabled={!frontFile || !backFile || submitted}
                        className={cn(
                          "btn-primary w-full sm:w-auto self-start",
                          (!frontFile || !backFile || submitted) &&
                            "opacity-50 cursor-not-allowed"
                        )}
                      >
                        {submitted ? (
                          <>
                            <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4" />
                            Submit for Verification
                          </>
                        )}
                      </button>
                    </form>
                  )}

                  {currentStatus === "submitted" && (
                    <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
                      <Eye
                        className="w-5 h-5 text-amber-600 flex-shrink-0"
                        aria-hidden="true"
                      />
                      <p className="text-sm text-amber-700">
                        Our team is reviewing your documents. You will receive a
                        notification once your verification is approved.
                      </p>
                    </div>
                  )}
                </div>
              </Reveal>
            )}
          </div>

          {/* ── Right column ── */}
          <div className="flex flex-col gap-6">
            {/* Benefits */}
            <Reveal delay={0.08}>
              <div className="card p-6">
                <h2 className="section-heading mb-4 flex items-center gap-2">
                  <Shield
                    className="w-5 h-5 text-[var(--accent)]"
                    aria-hidden="true"
                  />
                  Benefits of Verification
                </h2>
                <motion.ul
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="flex flex-col gap-4"
                >
                  {BENEFITS.map((benefit) => {
                    const BIcon = benefit.icon;
                    return (
                      <motion.li
                        key={benefit.title}
                        variants={fadeInUp}
                        className="flex items-start gap-3"
                      >
                        <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <BIcon
                            className="w-4 h-4 text-[var(--accent)]"
                            aria-hidden="true"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[var(--foreground)]">
                            {benefit.title}
                          </p>
                          <p className="text-xs text-[var(--muted-foreground)] leading-relaxed mt-0.5">
                            {benefit.desc}
                          </p>
                        </div>
                      </motion.li>
                    );
                  })}
                </motion.ul>
              </div>
            </Reveal>

            {/* Quick links */}
            <Reveal delay={0.12}>
              <div className="card p-5">
                <h2 className="text-sm font-semibold text-[var(--foreground)] mb-3 uppercase tracking-wide">
                  Quick Links
                </h2>
                <div className="flex flex-col gap-1">
                  {[
                    { label: "My Profile", href: "/tasker-profile" },
                    { label: "Balance & Ledger", href: "/tasker-balance-transaction-history" },
                    { label: "My Bids", href: "/my-bids-tasker" },
                    { label: "Ratings & Reviews", href: "/ratings-reviews" },
                  ].map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-[var(--background)] transition-colors group"
                    >
                      <span className="text-sm text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                        {link.label}
                      </span>
                      <ChevronRight
                        className="w-4 h-4 text-[var(--muted-foreground)] group-hover:text-[var(--primary)] transition-colors"
                        aria-hidden="true"
                      />
                    </Link>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Dev switcher (demo only) */}
            <Reveal delay={0.15}>
              <div className="card p-5 border-dashed">
                <p className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wide mb-3">
                  Demo: Switch Status
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {(["unverified", "submitted", "verified", "restricted"] as VerificationStatus[]).map(
                    (s) => (
                      <button
                        key={s}
                        onClick={() => setCurrentStatus(s)}
                        className={cn(
                          "text-xs px-2 py-1.5 rounded-lg border font-medium transition-colors capitalize",
                          currentStatus === s
                            ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                            : "bg-white text-[var(--muted-foreground)] border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                        )}
                      >
                        {s}
                      </button>
                    )
                  )}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </main>
  );
}
