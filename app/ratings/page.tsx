"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ThumbsUp, MessageSquare, Award, CheckCircle, User, Calendar, Briefcase, ChevronDown, Send } from 'lucide-react';
import { Reveal } from "@/components/Reveal";
import { staggerContainer, fadeInUp, scaleIn } from "@/lib/motion";
import { cn } from "@/lib/utils";

// ─── Mock Data ────────────────────────────────────────────────────────────────

interface Review {
  id: string;
  reviewerName: string;
  reviewerInitials: string;
  reviewerCity: string;
  reviewerRole: "poster" | "tasker";
  rating: number;
  taskTitle: string;
  comment: string;
  date: string;
  helpful: number;
  verified: boolean;
}

const MOCK_REVIEWS: Review[] = [
  {
    id: "r1",
    reviewerName: "Ayesha Siddiqui",
    reviewerInitials: "AS",
    reviewerCity: "Karachi",
    reviewerRole: "poster",
    rating: 5,
    taskTitle: "NADRA Queue Standing — F-8 Islamabad",
    comment:
      "Bilal was at the NADRA office before 8 AM and kept me updated every 30 minutes. Got the token in under 2 hours. Absolutely reliable — will hire again without hesitation.",
    date: "14 Jun 2025",
    helpful: 12,
    verified: true,
  },
  {
    id: "r2",
    reviewerName: "Tariq Mehmood",
    reviewerInitials: "TM",
    reviewerCity: "Lahore",
    reviewerRole: "poster",
    rating: 5,
    taskTitle: "Furniture Move — DHA Phase 5 to Johar Town",
    comment:
      "Came with a helper and a proper van. Wrapped everything carefully. Not a single scratch on the sofa or the wardrobe. Finished in 3 hours flat. Highly recommended.",
    date: "9 Jun 2025",
    helpful: 8,
    verified: true,
  },
  {
    id: "r3",
    reviewerName: "Sana Mirza",
    reviewerInitials: "SM",
    reviewerCity: "Islamabad",
    reviewerRole: "poster",
    rating: 4,
    taskTitle: "Deep Kitchen Cleaning — 3-Bedroom Flat",
    comment:
      "Very thorough job. Kitchen looks brand new. Took a little longer than quoted but the quality was worth it. Communication was good throughout.",
    date: "3 Jun 2025",
    helpful: 5,
    verified: true,
  },
  {
    id: "r4",
    reviewerName: "Kamran Iqbal",
    reviewerInitials: "KI",
    reviewerCity: "Rawalpindi",
    reviewerRole: "poster",
    rating: 5,
    taskTitle: "Laptop Cleanup and Antivirus Setup",
    comment:
      "Fixed my slow laptop in under an hour. Installed proper antivirus, cleaned up junk files, and even showed me how to keep it running fast. Very knowledgeable.",
    date: "28 May 2025",
    helpful: 9,
    verified: true,
  },
  {
    id: "r5",
    reviewerName: "Nadia Farooq",
    reviewerInitials: "NF",
    reviewerCity: "Karachi",
    reviewerRole: "poster",
    rating: 3,
    taskTitle: "Grocery Run — Imtiaz Store, Gulshan",
    comment:
      "Got all the items but missed two things from the list. Delivery was a bit late. Overall okay for the price but could improve on attention to detail.",
    date: "20 May 2025",
    helpful: 2,
    verified: false,
  },
  {
    id: "r6",
    reviewerName: "Usman Raza",
    reviewerInitials: "UR",
    reviewerCity: "Lahore",
    reviewerRole: "poster",
    rating: 4,
    taskTitle: "Ceiling Fan Installation",
    comment:
      "Came with his own tools and finished quickly. Fan is working perfectly. Cleaned up after himself too. Good experience overall.",
    date: "15 May 2025",
    helpful: 6,
    verified: true,
  },
];

const RATING_BREAKDOWN = [
  { stars: 5, count: 31, pct: 72 },
  { stars: 4, count: 8,  pct: 19 },
  { stars: 3, count: 2,  pct: 5  },
  { stars: 2, count: 1,  pct: 2  },
  { stars: 1, count: 1,  pct: 2  },
];

const AVERAGE_RATING = 4.7;
const TOTAL_REVIEWS = 43;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function StarRow({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={size}
          className={cn(
            s <= Math.round(rating)
              ? "fill-[var(--accent)] text-[var(--accent)]"
              : "fill-[var(--border)] text-[var(--border)]"
          )}
          aria-hidden="true"
        />
      ))}
    </span>
  );
}

function InteractiveStar({
  index,
  filled,
  hovered,
  onHover,
  onClick,
}: {
  index: number;
  filled: boolean;
  hovered: boolean;
  onHover: (i: number) => void;
  onClick: (i: number) => void;
}) {
  return (
    <button
      type="button"
      aria-label={`Rate ${index} star${index > 1 ? "s" : ""}`}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(0)}
      onClick={() => onClick(index)}
      className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded"
    >
      <Star
        size={28}
        className={cn(
          "transition-all duration-150",
          filled || hovered
            ? "fill-[var(--accent)] text-[var(--accent)] scale-110"
            : "fill-[var(--border)] text-[var(--border)]"
        )}
        aria-hidden="true"
      />
    </button>
  );
}

const STAR_LABELS: Record<number, string> = {
  1: "Poor",
  2: "Fair",
  3: "Good",
  4: "Very Good",
  5: "Excellent",
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RatingsPage() {
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<"recent" | "helpful" | "highest" | "lowest">("recent");
  const [helpfulMap, setHelpfulMap] = useState<Record<string, boolean>>({});
  const [showForm, setShowForm] = useState(false);

  // Leave-a-review form state
  const [formRating, setFormRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [formTask, setFormTask] = useState("");
  const [formComment, setFormComment] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState("");

  const filtered = MOCK_REVIEWS.filter((r) =>
    filterRating === null ? true : r.rating === filterRating
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "helpful") return b.helpful - a.helpful;
    if (sortBy === "highest") return b.rating - a.rating;
    if (sortBy === "lowest") return a.rating - b.rating;
    // recent: by id descending (mock)
    return b.id.localeCompare(a.id);
  });

  function toggleHelpful(id: string) {
    setHelpfulMap((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function handleSubmitReview(e: React.FormEvent) {
    e.preventDefault();
    if (formRating === 0) {
      setFormError("براہ کرم ایک ریٹنگ منتخب کریں۔ Please select a star rating.");
      return;
    }
    if (formComment.trim().length < 10) {
      setFormError("Please write at least 10 characters in your review.");
      return;
    }
    setFormError("");
    setFormSubmitted(true);
  }

  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* ── PAGE HEADER ── */}
      <section className="bg-gradient-to-br from-[#1B6CA8] via-[#155a8a] to-[#0f3f63] py-12 md:py-16 relative overflow-hidden">
        {/* Decorative pattern */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, #F5A623 0%, transparent 45%), radial-gradient(circle at 80% 20%, #ffffff 0%, transparent 40%)",
          }}
          aria-hidden="true"
        />
        {/* Geometric accent lines */}
        <div className="absolute top-0 right-0 w-64 h-64 opacity-[0.04]" aria-hidden="true">
          <svg viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="200" cy="56" r="120" stroke="white" strokeWidth="1" />
            <circle cx="200" cy="56" r="80" stroke="white" strokeWidth="1" />
            <circle cx="200" cy="56" r="40" stroke="white" strokeWidth="1" />
          </svg>
        </div>

        <div className="container relative z-10">
          <Reveal>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center flex-shrink-0">
                  <Star className="w-4 h-4 text-white fill-white" aria-hidden="true" />
                </div>
                <span className="text-white/60 text-sm font-medium tracking-wide uppercase">Community Feedback</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                Ratings &amp; Reviews
              </h1>
              <p
                className="text-white/70 text-lg font-medium"
                dir="rtl"
                lang="ur"
                style={{ fontFamily: "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif" }}
              >
                ریٹنگز اور جائزے
              </p>
              <p className="text-white/60 text-sm mt-1 max-w-lg">
                Real feedback from real tasks. Every review is tied to a completed job on Asan Kaam.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* ── LEFT COLUMN: Summary + Form ── */}
          <div className="lg:col-span-1 flex flex-col gap-6">

            {/* Rating Summary Card */}
            <Reveal>
              <div className="card p-6">
                {/* Crescent + star motif header */}
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-7 h-7 rounded-full bg-[var(--primary)] flex items-center justify-center flex-shrink-0">
                    <Award className="w-3.5 h-3.5 text-white" aria-hidden="true" />
                  </div>
                  <span className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">
                    Overall Rating
                  </span>
                </div>

                {/* Big average */}
                <div className="flex items-end gap-3 mb-4">
                  <span className="text-6xl font-bold text-[var(--foreground)] leading-none tracking-tight">
                    {AVERAGE_RATING}
                  </span>
                  <div className="flex flex-col gap-1 pb-1">
                    <StarRow rating={AVERAGE_RATING} size={18} />
                    <span className="text-xs text-[var(--muted-foreground)]">
                      {TOTAL_REVIEWS} reviews
                    </span>
                  </div>
                </div>

                {/* Breakdown bars */}
                <div className="flex flex-col gap-2.5">
                  {RATING_BREAKDOWN.map((row) => (
                    <button
                      key={row.stars}
                      type="button"
                      onClick={() =>
                        setFilterRating(filterRating === row.stars ? null : row.stars)
                      }
                      className={cn(
                        "flex items-center gap-2 group w-full text-left rounded-lg px-2 py-1 transition-colors",
                        filterRating === row.stars
                          ? "bg-[var(--primary)]/10"
                          : "hover:bg-[var(--background)]"
                      )}
                      aria-pressed={filterRating === row.stars}
                      aria-label={`Filter by ${row.stars} stars`}
                    >
                      <span className="text-xs font-semibold text-[var(--muted-foreground)] w-4 text-right flex-shrink-0">
                        {row.stars}
                      </span>
                      <Star
                        size={12}
                        className="fill-[var(--accent)] text-[var(--accent)] flex-shrink-0"
                        aria-hidden="true"
                      />
                      <div className="flex-1 h-2 bg-[var(--border)] rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-[var(--accent)] rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${row.pct}%` }}
                          transition={{ duration: 0.7, ease: "easeOut", delay: row.stars * 0.05 }}
                        />
                      </div>
                      <span className="text-xs text-[var(--muted-foreground)] w-8 text-right flex-shrink-0">
                        {row.pct}%
                      </span>
                    </button>
                  ))}
                </div>

                {filterRating !== null && (
                  <button
                    type="button"
                    onClick={() => setFilterRating(null)}
                    className="mt-3 text-xs text-[var(--primary)] font-medium hover:underline w-full text-center"
                  >
                    Clear filter
                  </button>
                )}
              </div>
            </Reveal>

            {/* Stats strip */}
            <Reveal delay={0.05}>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Avg Rating", value: `${AVERAGE_RATING}★`, icon: Star },
                  { label: "Total Reviews", value: TOTAL_REVIEWS, icon: MessageSquare },
                  { label: "5-Star Rate", value: "72%", icon: ThumbsUp },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="card p-3 flex flex-col items-center gap-1 text-center"
                  >
                    <stat.icon
                      size={16}
                      className="text-[var(--primary)]"
                      aria-hidden="true"
                    />
                    <span className="text-base font-bold text-[var(--foreground)]">
                      {stat.value}
                    </span>
                    <span className="text-[10px] text-[var(--muted-foreground)] leading-tight">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Leave a Review toggle */}
            <Reveal delay={0.1}>
              <div className="card overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowForm((v) => !v)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-[var(--background)] transition-colors"
                  aria-expanded={showForm}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[var(--accent)] flex items-center justify-center flex-shrink-0">
                      <Star className="w-3.5 h-3.5 text-white fill-white" aria-hidden="true" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-[var(--foreground)]">
                        Leave a Review
                      </p>
                      <p
                        className="text-xs text-[var(--muted-foreground)]"
                        dir="rtl"
                        lang="ur"
                        style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }}
                      >
                        جائزہ لکھیں
                      </p>
                    </div>
                  </div>
                  <ChevronDown
                    size={16}
                    className={cn(
                      "text-[var(--muted-foreground)] transition-transform duration-200",
                      showForm && "rotate-180"
                    )}
                    aria-hidden="true"
                  />
                </button>

                <AnimatePresence initial={false}>
                  {showForm && (
                    <motion.div
                      key="review-form"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 border-t border-[var(--border)]">
                        {formSubmitted ? (
                          <div className="flex flex-col items-center gap-3 py-6 text-center">
                            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                              <CheckCircle className="w-6 h-6 text-emerald-600" aria-hidden="true" />
                            </div>
                            <p className="font-semibold text-[var(--foreground)]">
                              Shukriya! Review submitted.
                            </p>
                            <p
                              className="text-sm text-[var(--muted-foreground)]"
                              dir="rtl"
                              lang="ur"
                              style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }}
                            >
                              آپ کا جائزہ موصول ہو گیا۔
                            </p>
                            <button
                              type="button"
                              onClick={() => {
                                setFormSubmitted(false);
                                setFormRating(0);
                                setFormTask("");
                                setFormComment("");
                                setShowForm(false);
                              }}
                              className="text-xs text-[var(--primary)] font-medium hover:underline mt-1"
                            >
                              Write another review
                            </button>
                          </div>
                        ) : (
                          <form onSubmit={handleSubmitReview} className="flex flex-col gap-4 pt-4">
                            {/* Star selector */}
                            <div>
                              <label className="block text-xs font-semibold text-[var(--muted-foreground)] mb-2 uppercase tracking-wide">
                                Your Rating
                              </label>
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((i) => (
                                  <InteractiveStar
                                    key={i}
                                    index={i}
                                    filled={i <= formRating}
                                    hovered={i <= hoverRating}
                                    onHover={setHoverRating}
                                    onClick={setFormRating}
                                  />
                                ))}
                                {(hoverRating > 0 || formRating > 0) && (
                                  <span className="ml-2 text-sm font-medium text-[var(--accent)]">
                                    {STAR_LABELS[hoverRating || formRating]}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Task title */}
                            <div>
                              <label
                                htmlFor="review-task"
                                className="block text-xs font-semibold text-[var(--muted-foreground)] mb-1.5 uppercase tracking-wide"
                              >
                                Task Title
                              </label>
                              <input
                                id="review-task"
                                type="text"
                                value={formTask}
                                onChange={(e) => setFormTask(e.target.value)}
                                placeholder="e.g. Grocery run from Imtiaz Store"
                                className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition"
                              />
                            </div>

                            {/* Comment */}
                            <div>
                              <label
                                htmlFor="review-comment"
                                className="block text-xs font-semibold text-[var(--muted-foreground)] mb-1.5 uppercase tracking-wide"
                              >
                                Your Review
                              </label>
                              <textarea
                                id="review-comment"
                                value={formComment}
                                onChange={(e) => setFormComment(e.target.value)}
                                placeholder="Share your experience with this tasker..."
                                rows={4}
                                className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition resize-none"
                              />
                              <p className="text-[10px] text-[var(--muted-foreground)] mt-1">
                                {formComment.length}/500 characters
                              </p>
                            </div>

                            {formError && (
                              <p className="text-xs text-[var(--destructive)] font-medium">
                                {formError}
                              </p>
                            )}

                            <button
                              type="submit"
                              className="btn-primary w-full gap-2"
                            >
                              <Send size={14} aria-hidden="true" />
                              Submit Review
                            </button>
                          </form>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          </div>

          {/* ── RIGHT COLUMN: Reviews List ── */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Toolbar */}
            <Reveal>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-[var(--foreground)]">
                    {filterRating !== null
                      ? `${filterRating}-Star Reviews (${sorted.length})`
                      : `All Reviews (${TOTAL_REVIEWS})`}
                  </h2>
                  {filterRating !== null && (
                    <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                      Showing {sorted.length} of {TOTAL_REVIEWS} reviews
                    </p>
                  )}
                </div>

                {/* Sort */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) =>
                      setSortBy(e.target.value as typeof sortBy)
                    }
                    className="appearance-none border border-[var(--border)] rounded-lg pl-3 pr-8 py-2 text-sm bg-[var(--card)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] cursor-pointer"
                    aria-label="Sort reviews"
                  >
                    <option value="recent">Most Recent</option>
                    <option value="helpful">Most Helpful</option>
                    <option value="highest">Highest Rated</option>
                    <option value="lowest">Lowest Rated</option>
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] pointer-events-none"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </Reveal>

            {/* Review Cards */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-4"
            >
              {sorted.length === 0 ? (
                <div className="card p-10 flex flex-col items-center gap-3 text-center">
                  <Star size={32} className="text-[var(--border)]" aria-hidden="true" />
                  <p className="font-semibold text-[var(--foreground)]">
                    No reviews for this rating yet.
                  </p>
                  <button
                    type="button"
                    onClick={() => setFilterRating(null)}
                    className="text-sm text-[var(--primary)] font-medium hover:underline"
                  >
                    Show all reviews
                  </button>
                </div>
              ) : (
                sorted.map((review) => (
                  <motion.div
                    key={review.id}
                    variants={fadeInUp}
                    className="card p-5 hover:shadow-[0_4px_20px_rgba(27,108,168,0.10)] transition-shadow duration-300"
                  >
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div
                        className="w-11 h-11 rounded-full bg-gradient-to-br from-[var(--primary)] to-[#0f3f63] flex items-center justify-center flex-shrink-0 text-white font-bold text-sm shadow-[0_2px_8px_rgba(27,108,168,0.25)]"
                        aria-hidden="true"
                      >
                        {review.reviewerInitials}
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Name + role + verified */}
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="font-semibold text-[var(--foreground)] text-sm">
                            {review.reviewerName}
                          </span>
                          <span className="text-xs text-[var(--muted-foreground)]">
                            {review.reviewerCity}
                          </span>
                          <span
                            className={cn(
                              "text-[10px] font-semibold px-2 py-0.5 rounded-full",
                              review.reviewerRole === "poster"
                                ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                                : "bg-[var(--accent)]/15 text-amber-700"
                            )}
                          >
                            {review.reviewerRole === "poster" ? "Poster" : "Tasker"}
                          </span>
                          {review.verified && (
                            <span className="flex items-center gap-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              <CheckCircle size={10} aria-hidden="true" />
                              Verified Task
                            </span>
                          )}
                        </div>

                        {/* Stars + date */}
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <StarRow rating={review.rating} size={14} />
                          <span className="flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
                            <Calendar size={11} aria-hidden="true" />
                            {review.date}
                          </span>
                        </div>

                        {/* Task title chip */}
                        <div className="flex items-center gap-1.5 mb-3">
                          <Briefcase
                            size={12}
                            className="text-[var(--primary)] flex-shrink-0"
                            aria-hidden="true"
                          />
                          <span className="text-xs text-[var(--primary)] font-medium truncate">
                            {review.taskTitle}
                          </span>
                        </div>

                        {/* Comment */}
                        <p className="text-sm text-[var(--foreground)] leading-relaxed">
                          {review.comment}
                        </p>

                        {/* Helpful */}
                        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-[var(--border)]">
                          <button
                            type="button"
                            onClick={() => toggleHelpful(review.id)}
                            className={cn(
                              "flex items-center gap-1.5 text-xs font-medium transition-colors rounded-lg px-2 py-1",
                              helpfulMap[review.id]
                                ? "text-[var(--primary)] bg-[var(--primary)]/10"
                                : "text-[var(--muted-foreground)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/5"
                            )}
                            aria-pressed={!!helpfulMap[review.id]}
                          >
                            <ThumbsUp size={12} aria-hidden="true" />
                            Helpful
                            <span className="font-bold">
                              ({review.helpful + (helpfulMap[review.id] ? 1 : 0)})
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>

            {/* Pakistani trust note */}
            <Reveal delay={0.1}>
              <div className="card p-4 border-l-4 border-[var(--primary)] bg-[var(--primary)]/5 flex items-start gap-3">
                <CheckCircle
                  size={18}
                  className="text-[var(--primary)] flex-shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-sm font-semibold text-[var(--foreground)]">
                    Every review is tied to a real completed task.
                  </p>
                  <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                    Asan Kaam only allows reviews after a task is marked complete by both parties. Fake reviews are removed.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </main>
  );
}
