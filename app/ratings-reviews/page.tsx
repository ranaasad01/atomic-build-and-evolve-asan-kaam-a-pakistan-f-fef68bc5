"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Star, CheckCircle, Shield, ThumbsUp, ThumbsDown, MessageSquare, Filter, ChevronDown, TrendingUp, Award, AlertCircle, User, Calendar, MapPin, Flag, X } from 'lucide-react';
import { Reveal } from "@/components/Reveal";
import { staggerContainer, fadeInUp } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { formatPKR, VerificationStatus } from "@/lib/data";

// ─── Types ───────────────────────────────────────────────────────────────────

type ReviewType = "received" | "given";
type RatingFilter = "all" | "5" | "4" | "3" | "2" | "1";

interface Review {
  id: string;
  type: ReviewType;
  otherPartyName: string;
  otherPartyInitials: string;
  otherPartyVerified: VerificationStatus;
  otherPartyCity: string;
  rating: number;
  comment: string;
  taskTitle: string;
  taskId: string;
  date: string;
  helpful: number;
  reported: boolean;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_REVIEWS: Review[] = [
  {
    id: "rv1",
    type: "received",
    otherPartyName: "Ayesha Siddiqui",
    otherPartyInitials: "AS",
    otherPartyVerified: "verified",
    otherPartyCity: "Karachi",
    rating: 5,
    comment:
      "Bilal was absolutely fantastic. He arrived on time, handled all the furniture with care, and even helped rearrange a few extra items without complaint. Will definitely hire again.",
    taskTitle: "Move sofa and wardrobe — DHA to Gulshan",
    taskId: "task-001",
    date: "12 Jun 2025",
    helpful: 8,
    reported: false,
  },
  {
    id: "rv2",
    type: "received",
    otherPartyName: "Tariq Hussain",
    otherPartyInitials: "TH",
    otherPartyVerified: "verified",
    otherPartyCity: "Lahore",
    rating: 5,
    comment:
      "Excellent work. Fixed the leaking tap and replaced the bathroom flush in one visit. Brought his own tools and cleaned up after himself. Very professional.",
    taskTitle: "Fix leaking tap and bathroom flush",
    taskId: "task-002",
    date: "4 Jun 2025",
    helpful: 5,
    reported: false,
  },
  {
    id: "rv3",
    type: "received",
    otherPartyName: "Sana Mirza",
    otherPartyInitials: "SM",
    otherPartyVerified: "verified",
    otherPartyCity: "Islamabad",
    rating: 4,
    comment:
      "Good job overall. The apartment was cleaned thoroughly. Took slightly longer than estimated but the quality was worth it. Would recommend.",
    taskTitle: "Deep clean 3-bedroom apartment before handover",
    taskId: "task-003",
    date: "28 May 2025",
    helpful: 3,
    reported: false,
  },
  {
    id: "rv4",
    type: "received",
    otherPartyName: "Kamran Shah",
    otherPartyInitials: "KS",
    otherPartyVerified: "submitted",
    otherPartyCity: "Rawalpindi",
    rating: 3,
    comment:
      "Task was completed but communication could have been better. Arrived 45 minutes late without prior notice. Work itself was acceptable.",
    taskTitle: "Grocery run from Imtiaz Store",
    taskId: "task-004",
    date: "19 May 2025",
    helpful: 1,
    reported: false,
  },
  {
    id: "rv5",
    type: "given",
    otherPartyName: "Nadia Farooq",
    otherPartyInitials: "NF",
    otherPartyVerified: "verified",
    otherPartyCity: "Karachi",
    rating: 5,
    comment:
      "Nadia was a great poster. Clear instructions, responsive on chat, and confirmed completion promptly. The task details were accurate and the budget was fair.",
    taskTitle: "CNIC renewal queue standing — NADRA F-8",
    taskId: "task-005",
    date: "10 Jun 2025",
    helpful: 2,
    reported: false,
  },
  {
    id: "rv6",
    type: "given",
    otherPartyName: "Usman Farooq",
    otherPartyInitials: "UF",
    otherPartyVerified: "submitted",
    otherPartyCity: "Lahore",
    rating: 4,
    comment:
      "Good poster. Task description was detailed and location was accurate. Payment was released quickly after completion. Minor delay in responding to messages.",
    taskTitle: "Laptop cleanup and antivirus installation",
    taskId: "task-006",
    date: "2 Jun 2025",
    helpful: 0,
    reported: false,
  },
  {
    id: "rv7",
    type: "received",
    otherPartyName: "Bilal Raza",
    otherPartyInitials: "BR",
    otherPartyVerified: "verified",
    otherPartyCity: "Lahore",
    rating: 5,
    comment:
      "Outstanding service. Installed the ceiling fan perfectly and even checked the wiring. Came fully prepared with tools. Highly recommended for any electrical work.",
    taskTitle: "Ceiling fan installation — 2 rooms",
    taskId: "task-007",
    date: "25 May 2025",
    helpful: 6,
    reported: false,
  },
  {
    id: "rv8",
    type: "received",
    otherPartyName: "Rabia Khan",
    otherPartyInitials: "RK",
    otherPartyVerified: "unverified",
    otherPartyCity: "Karachi",
    rating: 2,
    comment:
      "Disappointing experience. The task was only partially completed and the tasker left early. Had to hire someone else to finish the job.",
    taskTitle: "Ironing and folding laundry — 3 bags",
    taskId: "task-008",
    date: "15 May 2025",
    helpful: 4,
    reported: false,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function StarRow({
  rating,
  size = "sm",
}: {
  rating: number;
  size?: "sm" | "md" | "lg";
}) {
  const sz =
    size === "lg" ? "w-5 h-5" : size === "md" ? "w-4 h-4" : "w-3.5 h-3.5";
  return (
    <span className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={cn(
            sz,
            s <= rating ? "fill-[var(--accent)] text-[var(--accent)]" : "fill-none text-gray-300"
          )}
          aria-hidden="true"
        />
      ))}
    </span>
  );
}

function VerificationBadge({ status }: { status: VerificationStatus }) {
  if (status === "verified") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
        <CheckCircle className="w-3 h-3" aria-hidden="true" />
        تصدیق شدہ
      </span>
    );
  }
  if (status === "submitted") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
        <AlertCircle className="w-3 h-3" aria-hidden="true" />
        زیر جائزہ
      </span>
    );
  }
  if (status === "restricted") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
        <Shield className="w-3 h-3" aria-hidden="true" />
        محدود
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-200 text-gray-700 border border-gray-300">
      <User className="w-3 h-3" aria-hidden="true" />
      غیر تصدیق شدہ
    </span>
  );
}

function ratingDistribution(reviews: Review[]) {
  const dist: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    if (r.type === "received") dist[r.rating] = (dist[r.rating] ?? 0) + 1;
  });
  return dist;
}

function avgRating(reviews: Review[]): number {
  const received = reviews.filter((r) => r.type === "received");
  if (!received.length) return 0;
  return received.reduce((sum, r) => sum + r.rating, 0) / received.length;
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function RatingsReviewsPage() {
  const [activeTab, setActiveTab] = useState<ReviewType>("received");
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [helpfulMap, setHelpfulMap] = useState<Record<string, boolean>>({});
  const [reportedMap, setReportedMap] = useState<Record<string, boolean>>({});
  const [reportModal, setReportModal] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState("");
  const [reportSubmitted, setReportSubmitted] = useState(false);

  const receivedReviews = MOCK_REVIEWS.filter((r) => r.type === "received");
  const avg = avgRating(MOCK_REVIEWS);
  const dist = ratingDistribution(MOCK_REVIEWS);
  const totalReceived = receivedReviews.length;

  const filtered = useMemo(() => {
    return MOCK_REVIEWS.filter((r) => {
      if (r.type !== activeTab) return false;
      if (ratingFilter !== "all" && r.rating !== Number(ratingFilter)) return false;
      return true;
    });
  }, [activeTab, ratingFilter]);

  function handleHelpful(id: string) {
    setHelpfulMap((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function handleReport(id: string) {
    setReportModal(id);
    setReportReason("");
    setReportSubmitted(false);
  }

  function submitReport() {
    if (!reportReason.trim()) return;
    setReportedMap((prev) => ({ ...prev, [reportModal!]: true }));
    setReportSubmitted(true);
    setTimeout(() => setReportModal(null), 1800);
  }

  const RATING_LABELS: Record<RatingFilter, string> = {
    all: "تمام ریٹنگز",
    "5": "5 ستارے",
    "4": "4 ستارے",
    "3": "3 ستارے",
    "2": "2 ستارے",
    "1": "1 ستارہ",
  };

  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* ── PAGE HEADER ── */}
      <section className="bg-gradient-to-br from-[#1B6CA8] via-[#155a8a] to-[#0f3f63] pt-10 pb-16 relative overflow-hidden">
        {/* Decorative pattern */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, #F5A623 0%, transparent 50%), radial-gradient(circle at 80% 20%, #ffffff 0%, transparent 40%)",
          }}
          aria-hidden="true"
        />
        {/* Geometric accent */}
        <div
          className="absolute bottom-0 right-0 w-64 h-64 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)",
            backgroundSize: "12px 12px",
          }}
          aria-hidden="true"
        />

        <div className="container relative z-10">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1 mb-4">
                  <Star className="w-3.5 h-3.5 text-[var(--accent)] fill-[var(--accent)]" aria-hidden="true" />
                  <span className="text-white/80 text-xs font-medium tracking-wide uppercase">
                    ریٹنگز اور جائزے
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
                  Ratings &amp; Reviews
                </h1>
                <p className="text-white/70 text-sm leading-relaxed max-w-md">
                  آپ کی ساکھ آپ کی محنت کا آئینہ ہے۔ ہر جائزہ آپ کو بہتر مواقع دلاتا ہے۔
                </p>
              </div>

              {/* Summary stat */}
              <div className="flex items-center gap-4 bg-white/10 border border-white/20 rounded-2xl px-5 py-4 backdrop-blur-sm">
                <div className="text-center">
                  <p className="text-4xl font-bold text-white">{avg.toFixed(1)}</p>
                  <StarRow rating={Math.round(avg)} size="md" />
                  <p className="text-white/60 text-xs mt-1">{totalReceived} جائزے</p>
                </div>
                <div className="w-px h-12 bg-white/20" aria-hidden="true" />
                <div className="space-y-1">
                  {([5, 4, 3, 2, 1] as const).map((star) => (
                    <div key={star} className="flex items-center gap-2">
                      <span className="text-white/60 text-xs w-3">{star}</span>
                      <Star className="w-3 h-3 fill-[var(--accent)] text-[var(--accent)]" aria-hidden="true" />
                      <div className="w-20 h-1.5 bg-white/20 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[var(--accent)] rounded-full transition-all duration-500"
                          style={{
                            width: totalReceived
                              ? `${((dist[star] ?? 0) / totalReceived) * 100}%`
                              : "0%",
                          }}
                        />
                      </div>
                      <span className="text-white/50 text-xs">{dist[star] ?? 0}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="bg-[var(--card)] border-b border-[var(--border)] shadow-sm">
        <div className="container">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[var(--border)]"
          >
            {[
              { icon: Star, label: "اوسط ریٹنگ", value: `${avg.toFixed(1)} / 5`, accent: true },
              { icon: Award, label: "کل جائزے", value: `${totalReceived}`, accent: false },
              { icon: ThumbsUp, label: "5 ستارے", value: `${dist[5] ?? 0}`, accent: false },
              { icon: TrendingUp, label: "مددگار ووٹ", value: `${MOCK_REVIEWS.reduce((s, r) => s + r.helpful, 0)}`, accent: false },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                variants={fadeInUp}
                className="flex flex-col items-center justify-center py-4 px-3 gap-1"
              >
                <stat.icon
                  className={cn(
                    "w-4 h-4 mb-0.5",
                    stat.accent ? "text-[var(--accent)]" : "text-[var(--primary)]"
                  )}
                  aria-hidden="true"
                />
                <p className="text-lg font-bold text-[var(--foreground)]">{stat.value}</p>
                <p className="text-xs text-[var(--muted-foreground)] text-center">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <div className="container py-8">
        {/* Tabs + Filter row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          {/* Tabs */}
          <div className="flex bg-white border border-[var(--border)] rounded-xl p-1 gap-1 shadow-sm w-fit">
            {(["received", "given"] as ReviewType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setRatingFilter("all");
                }}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200",
                  activeTab === tab
                    ? "bg-[var(--primary)] text-white shadow-sm"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--background)]"
                )}
              >
                {tab === "received" ? "موصول جائزے" : "دیے گئے جائزے"}
              </button>
            ))}
          </div>

          {/* Rating filter */}
          <div className="relative">
            <button
              onClick={() => setFilterOpen((o) => !o)}
              className="flex items-center gap-2 bg-white border border-[var(--border)] rounded-xl px-4 py-2 text-sm font-medium text-[var(--foreground)] shadow-sm hover:border-[var(--primary)] transition-colors"
            >
              <Filter className="w-4 h-4 text-[var(--primary)]" aria-hidden="true" />
              {RATING_LABELS[ratingFilter]}
              <ChevronDown
                className={cn(
                  "w-4 h-4 text-[var(--muted-foreground)] transition-transform duration-200",
                  filterOpen && "rotate-180"
                )}
                aria-hidden="true"
              />
            </button>
            <AnimatePresence>
              {filterOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 top-full mt-2 bg-white border border-[var(--border)] rounded-xl shadow-lg z-20 min-w-[160px] overflow-hidden"
                >
                  {(["all", "5", "4", "3", "2", "1"] as RatingFilter[]).map((f) => (
                    <button
                      key={f}
                      onClick={() => {
                        setRatingFilter(f);
                        setFilterOpen(false);
                      }}
                      className={cn(
                        "w-full text-left px-4 py-2.5 text-sm transition-colors",
                        ratingFilter === f
                          ? "bg-[var(--primary)] text-white font-semibold"
                          : "text-[var(--foreground)] hover:bg-[var(--background)]"
                      )}
                    >
                      {RATING_LABELS[f]}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Reviews list */}
        {filtered.length === 0 ? (
          <Reveal>
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-full bg-[var(--primary)]/10 flex items-center justify-center mb-4">
                <MessageSquare className="w-7 h-7 text-[var(--primary)]" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-1">
                کوئی جائزہ نہیں ملا
              </h3>
              <p className="text-[var(--muted-foreground)] text-sm max-w-xs">
                {activeTab === "received"
                  ? "ابھی تک کوئی جائزہ موصول نہیں ہوا۔ مزید کام مکمل کریں۔"
                  : "آپ نے ابھی تک کوئی جائزہ نہیں دیا۔"}
              </p>
            </div>
          </Reveal>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {filtered.map((review) => (
              <motion.div
                key={review.id}
                variants={fadeInUp}
                className="bg-white border border-[var(--border)] rounded-2xl shadow-[0_1px_3px_rgba(26,26,46,0.06),0_4px_16px_-4px_rgba(26,26,46,0.08)] overflow-hidden"
              >
                {/* Card header */}
                <div className="flex items-start gap-4 p-5 pb-4">
                  {/* Avatar */}
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[var(--primary)] to-[#155a8a] flex items-center justify-center flex-shrink-0 shadow-sm">
                    <span className="text-white font-bold text-sm">
                      {review.otherPartyInitials}
                    </span>
                  </div>

                  {/* Name + meta */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-semibold text-[var(--foreground)] text-sm">
                        {review.otherPartyName}
                      </span>
                      <VerificationBadge status={review.otherPartyVerified} />
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--muted-foreground)]">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" aria-hidden="true" />
                        {review.otherPartyCity}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" aria-hidden="true" />
                        {review.date}
                      </span>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <StarRow rating={review.rating} size="sm" />
                    <span className="text-xs font-bold text-[var(--primary)]">
                      {review.rating}.0 / 5
                    </span>
                  </div>
                </div>

                {/* Task reference */}
                <div className="mx-5 mb-3 px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg">
                  <Link
                    href={`/task/${review.taskId}`}
                    className="text-xs text-[var(--primary)] font-medium hover:underline flex items-center gap-1.5"
                  >
                    <span className="text-[var(--muted-foreground)] font-normal">کام:</span>
                    {review.taskTitle}
                  </Link>
                </div>

                {/* Comment */}
                <div className="px-5 pb-4">
                  <p className="text-sm text-[var(--foreground)] leading-relaxed">
                    &ldquo;{review.comment}&rdquo;
                  </p>
                </div>

                {/* Footer actions */}
                <div className="flex items-center justify-between px-5 py-3 border-t border-[var(--border)] bg-[var(--background)]/50">
                  <button
                    onClick={() => handleHelpful(review.id)}
                    className={cn(
                      "flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all duration-200",
                      helpfulMap[review.id]
                        ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                        : "bg-white text-[var(--muted-foreground)] border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                    )}
                    aria-pressed={!!helpfulMap[review.id]}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" aria-hidden="true" />
                    مددگار ({review.helpful + (helpfulMap[review.id] ? 1 : 0)})
                  </button>

                  {reportedMap[review.id] ? (
                    <span className="text-xs text-[var(--muted-foreground)] flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" />
                      رپورٹ کر دیا گیا
                    </span>
                  ) : (
                    <button
                      onClick={() => handleReport(review.id)}
                      className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)] hover:text-red-600 transition-colors px-2 py-1.5 rounded-lg hover:bg-red-50"
                    >
                      <Flag className="w-3.5 h-3.5" aria-hidden="true" />
                      رپورٹ کریں
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Trust note */}
        <Reveal delay={0.1}>
          <div className="mt-8 flex items-start gap-3 bg-[var(--primary)]/5 border border-[var(--primary)]/20 rounded-2xl p-4">
            <Shield className="w-5 h-5 text-[var(--primary)] flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-[var(--primary)] mb-0.5">
                جائزوں کی حفاظت
              </p>
              <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
                تمام جائزے صرف مکمل شدہ کاموں کے بعد دیے جا سکتے ہیں۔ جھوٹے یا نامناسب جائزوں کو رپورٹ کریں — ہماری ٹیم 24 گھنٹے کے اندر جائزہ لے گی۔
              </p>
            </div>
          </div>
        </Reveal>
      </div>

      {/* ── REPORT MODAL ── */}
      <AnimatePresence>
        {reportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === e.currentTarget) setReportModal(null);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.22 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              {/* Modal header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)] bg-gradient-to-r from-[var(--primary)] to-[#155a8a]">
                <div className="flex items-center gap-2">
                  <Flag className="w-4 h-4 text-white" aria-hidden="true" />
                  <h2 className="font-semibold text-white text-sm">جائزہ رپورٹ کریں</h2>
                </div>
                <button
                  onClick={() => setReportModal(null)}
                  className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="بند کریں"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>

              {reportSubmitted ? (
                <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
                  <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
                    <CheckCircle className="w-7 h-7 text-emerald-600" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-[var(--foreground)] mb-1">رپورٹ موصول ہو گئی</h3>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    ہماری ٹیم 24 گھنٹے کے اندر جائزہ لے گی۔
                  </p>
                </div>
              ) : (
                <div className="p-5 space-y-4">
                  <p className="text-sm text-[var(--muted-foreground)]">
                    اس جائزے کو رپورٹ کرنے کی وجہ بتائیں:
                  </p>
                  <div className="space-y-2">
                    {[
                      "جھوٹی معلومات",
                      "نامناسب زبان",
                      "ہراسانی یا دھمکی",
                      "غلط شناخت",
                      "دیگر",
                    ].map((reason) => (
                      <button
                        key={reason}
                        onClick={() => setReportReason(reason)}
                        className={cn(
                          "w-full text-left px-4 py-2.5 rounded-xl border text-sm transition-all duration-150",
                          reportReason === reason
                            ? "border-[var(--primary)] bg-[var(--primary)]/5 text-[var(--primary)] font-semibold"
                            : "border-[var(--border)] text-[var(--foreground)] hover:border-[var(--primary)]/40"
                        )}
                      >
                        {reason}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setReportModal(null)}
                      className="flex-1 py-2.5 rounded-xl border border-[var(--border)] text-sm font-medium text-[var(--muted-foreground)] hover:bg-[var(--background)] transition-colors"
                    >
                      منسوخ
                    </button>
                    <button
                      onClick={submitReport}
                      disabled={!reportReason}
                      className={cn(
                        "flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
                        reportReason
                          ? "bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] shadow-sm"
                          : "bg-[var(--border)] text-[var(--muted-foreground)] cursor-not-allowed"
                      )}
                    >
                      رپورٹ بھیجیں
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
