"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star, CheckCircle, MapPin, Shield, Edit, Award, ThumbsUp, AlertCircle, Briefcase, Calendar, User, TrendingUp, Wallet, Clock, ChevronRight } from 'lucide-react';
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import {
  VerificationStatus,
  TaskCategory,
  TaskStatus,
  COMMISSION_RATE,
  MIN_BALANCE_PKR,
  formatPKR,
  getVerificationLabel,
} from "@/lib/data";
import { cn } from "@/lib/utils";

const COMMISSION_RATE_DEFAULT = COMMISSION_RATE;
void COMMISSION_RATE_DEFAULT;
const BALANCE_MINIMUM_PKR = MIN_BALANCE_PKR;
const formatPkr = formatPKR;

function getVerificationColor(status: VerificationStatus): string {
  switch (status) {
    case "verified":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "submitted":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "restricted":
      return "bg-red-100 text-red-700 border-red-200";
    default:
      return "bg-gray-100 text-gray-600 border-gray-200";
  }
}

function getVerificationIcon(status: VerificationStatus) {
  switch (status) {
    case "verified":
      return CheckCircle;
    case "submitted":
      return Clock;
    case "restricted":
      return AlertCircle;
    default:
      return User;
  }
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface Review {
  id: string;
  posterName: string;
  posterInitials: string;
  rating: number;
  comment: string;
  taskTitle: string;
  date: string;
}

interface CompletedTask {
  id: string;
  title: string;
  category: TaskCategory;
  budgetPkr: number;
  city: string;
  completedAt: string;
  status: TaskStatus;
  earnedPkr: number;
}

interface ProfileData {
  id: string;
  name: string;
  city: string;
  area: string;
  bio: string;
  verificationStatus: VerificationStatus;
  rating: number;
  reviewCount: number;
  completedTasks: number;
  memberSince: string;
  categories: TaskCategory[];
  balancePkr: number;
  totalEarnedPkr: number;
  responseRate: number;
  avgResponseTimeMin: number;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_PROFILE: ProfileData = {
  id: "tasker-001",
  name: "Bilal Ahmed",
  city: "Karachi",
  area: "Gulshan-e-Iqbal",
  bio: "Experienced handyman and errand runner based in Karachi. I take pride in completing tasks on time and with full transparency. Available most mornings and evenings. Specialise in small repairs, household assistance, and local deliveries. Reliable, punctual, and always communicative.",
  verificationStatus: "verified",
  rating: 4.7,
  reviewCount: 38,
  completedTasks: 52,
  memberSince: "March 2024",
  categories: ["Small Repairs & Maintenance", "Household Assistance", "Moving & Delivery", "Errands & Shopping"],
  balancePkr: 2400,
  totalEarnedPkr: 47800,
  responseRate: 94,
  avgResponseTimeMin: 18,
};

const MOCK_REVIEWS: Review[] = [
  {
    id: "r1",
    posterName: "Sana Malik",
    posterInitials: "SM",
    rating: 5,
    comment:
      "Bilal fixed our leaking tap and a broken cabinet hinge in under an hour. Very professional and tidy. Will definitely hire again.",
    taskTitle: "Fix leaking tap and cabinet hinge",
    date: "12 Jun 2025",
  },
  {
    id: "r2",
    posterName: "Tariq Hussain",
    posterInitials: "TH",
    rating: 5,
    comment:
      "Picked up my documents from the NADRA office and delivered them safely. Kept me updated throughout. Highly recommended.",
    taskTitle: "NADRA document collection errand",
    date: "4 Jun 2025",
  },
  {
    id: "r3",
    posterName: "Ayesha Raza",
    posterInitials: "AR",
    rating: 4,
    comment:
      "Good work overall. Helped move furniture between two rooms. Took a bit longer than expected but was careful with everything.",
    taskTitle: "Furniture rearrangement — 2 rooms",
    date: "28 May 2025",
  },
  {
    id: "r4",
    posterName: "Kamran Shah",
    posterInitials: "KS",
    rating: 5,
    comment:
      "Installed a ceiling fan perfectly. Came prepared with his own tools. Very reasonable bid too.",
    taskTitle: "Ceiling fan installation",
    date: "19 May 2025",
  },
  {
    id: "r5",
    posterName: "Nadia Farooq",
    posterInitials: "NF",
    rating: 4,
    comment:
      "Helped with grocery shopping and delivered on time. Friendly and communicative throughout.",
    taskTitle: "Weekly grocery run — Imtiaz Store",
    date: "10 May 2025",
  },
];

const MOCK_COMPLETED_TASKS: CompletedTask[] = [
  {
    id: "ct1",
    title: "Fix leaking tap and cabinet hinge",
    category: "Small Repairs & Maintenance",
    budgetPkr: 1200,
    city: "Karachi",
    completedAt: "12 Jun 2025",
    status: "completed",
    earnedPkr: 1056,
  },
  {
    id: "ct2",
    title: "NADRA document collection errand",
    category: "Errands & Shopping",
    budgetPkr: 700,
    city: "Karachi",
    completedAt: "4 Jun 2025",
    status: "completed",
    earnedPkr: 616,
  },
  {
    id: "ct3",
    title: "Furniture rearrangement — 2 rooms",
    category: "Household Assistance",
    budgetPkr: 2000,
    city: "Karachi",
    completedAt: "28 May 2025",
    status: "completed",
    earnedPkr: 1760,
  },
  {
    id: "ct4",
    title: "Ceiling fan installation",
    category: "Small Repairs & Maintenance",
    budgetPkr: 1500,
    city: "Karachi",
    completedAt: "19 May 2025",
    status: "completed",
    earnedPkr: 1320,
  },
  {
    id: "ct5",
    title: "Weekly grocery run — Imtiaz Store",
    category: "Errands & Shopping",
    budgetPkr: 600,
    city: "Karachi",
    completedAt: "10 May 2025",
    status: "completed",
    earnedPkr: 528,
  },
];

// ─── Star renderer ────────────────────────────────────────────────────────────

function StarRow({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          style={{ width: size, height: size }}
          className={cn(
            "flex-shrink-0",
            i <= Math.round(rating)
              ? "fill-[var(--accent)] text-[var(--accent)]"
              : "fill-gray-200 text-gray-200"
          )}
        />
      ))}
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TaskerProfilePage() {
  const [activeTab, setActiveTab] = useState<"reviews" | "history">("reviews");
  const profile = MOCK_PROFILE;

  const initials = profile.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const VerifIcon = getVerificationIcon(profile.verificationStatus);
  const isBalanceSufficient = profile.balancePkr >= BALANCE_MINIMUM_PKR;

  const STATS = [
    {
      icon: Briefcase,
      label: "Mukammal Kaam",
      urdu: "مکمل کام",
      value: profile.completedTasks.toString(),
    },
    {
      icon: Star,
      label: "Rating",
      urdu: "ریٹنگ",
      value: profile.rating.toFixed(1),
    },
    {
      icon: ThumbsUp,
      label: "Response Rate",
      urdu: "جواب کی شرح",
      value: `${profile.responseRate}%`,
    },
    {
      icon: Calendar,
      label: "Member Since",
      urdu: "رکنیت",
      value: profile.memberSince,
    },
  ];

  return (
    <main className="min-h-screen bg-[var(--background)] pb-16">
      {/* ── PROFILE HEADER ── */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #1B6CA8 0%, #155a8a 55%, #0f3f63 100%)",
        }}
      >
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
        <div
          className="absolute bottom-0 left-0 right-0 h-1"
          style={{ background: "linear-gradient(90deg, #F5A623, #1B6CA8, #F5A623)" }}
          aria-hidden="true"
        />

        <div className="container relative z-10 py-8 md:py-12">
          {/* Edit button — top right */}
          <div className="flex justify-end mb-6">
            <Link
              href="/settings"
              className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white text-sm font-semibold px-4 py-2 rounded-full border border-white/20 transition-all duration-200 backdrop-blur-sm"
            >
              <Edit className="w-4 h-4" />
              Profile Edit Karein
            </Link>
          </div>

          {/* Avatar + identity */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5">
            {/* Avatar circle */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative flex-shrink-0"
            >
              <div
                className="w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center text-white font-bold text-3xl md:text-4xl border-4 border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.25)]"
                style={{ background: "linear-gradient(135deg, #1B6CA8, #0f3f63)" }}
              >
                {initials}
              </div>
              {/* Verification dot */}
              <span
                className={cn(
                  "absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center border-2 border-white shadow-md",
                  profile.verificationStatus === "verified"
                    ? "bg-emerald-500"
                    : profile.verificationStatus === "submitted"
                    ? "bg-amber-400"
                    : profile.verificationStatus === "restricted"
                    ? "bg-red-500"
                    : "bg-gray-400"
                )}
              >
                <VerifIcon className="w-3.5 h-3.5 text-white" />
              </span>
            </motion.div>

            {/* Name + meta */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="text-center sm:text-left"
            >
              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight leading-tight">
                {profile.name}
              </h1>

              {/* Verification badge */}
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-xs font-semibold border",
                  getVerificationColor(profile.verificationStatus)
                )}
              >
                <VerifIcon className="w-3.5 h-3.5" />
                {getVerificationLabel(profile.verificationStatus)}
              </span>

              {/* Location */}
              <div className="flex items-center justify-center sm:justify-start gap-1.5 mt-2.5 text-white/75 text-sm">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>
                  {profile.area}, {profile.city}
                </span>
              </div>

              {/* Rating */}
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                <StarRow rating={profile.rating} size={16} />
                <span className="text-white font-bold text-sm">
                  {profile.rating.toFixed(1)}
                </span>
                <span className="text-white/60 text-sm">
                  ({profile.reviewCount} reviews)
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── STATS ROW ── */}
      <section className="container -mt-1">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-5"
        >
          {STATS.map((stat) => (
            <motion.div
              key={stat.label}
              variants={fadeInUp}
              className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 flex flex-col items-center text-center shadow-[0_2px_8px_rgba(26,26,46,0.07)] hover:shadow-[0_4px_16px_rgba(27,108,168,0.12)] transition-shadow duration-200"
            >
              <div                           className="w-9 h-9 rounded-full bg-[#EBF4FB] flex items-center justify-center mb-2">
                <stat.icon className="text-[var(--primary)]" style={{ width: 18, height: 18 }} />
              </div>
              <p className="text-xl font-bold text-[var(--foreground)] leading-tight">
                {stat.value}
              </p>
              <p className="text-xs font-medium text-[var(--foreground)] mt-0.5 font-semibold">
                {stat.label}
              </p>
              <p className="text-[10px] text-[var(--muted-foreground)] mt-0.5 font-medium" dir="rtl">
                {stat.urdu}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <div className="container mt-5 space-y-4">
        {/* ── BIO ── */}
        <Reveal>
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5 shadow-[0_2px_8px_rgba(26,26,46,0.06)]">
            <div className="flex items-center gap-2 mb-3">
              <User className="w-5 h-5 text-[var(--primary)]" />
              <div>
                <h2 className="text-base font-bold text-[var(--foreground)] leading-tight">
                  Mere Baare Mein
                </h2>
                <p className="text-xs text-[var(--muted-foreground)]" dir="rtl">
                  میرے بارے میں
                </p>
              </div>
            </div>
            <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
              {profile.bio}
            </p>
          </div>
        </Reveal>

        {/* ── CATEGORIES ── */}
        <Reveal>
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5 shadow-[0_2px_8px_rgba(26,26,46,0.06)]">
            <div className="flex items-center gap-2 mb-3">
              <Briefcase className="w-5 h-5 text-[var(--primary)]" />
              <div>
                <h2 className="text-base font-bold text-[var(--foreground)] leading-tight">
                  Kaam Ki Categories
                </h2>
                <p className="text-xs text-[var(--muted-foreground)]" dir="rtl">
                  کام کی اقسام
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.categories.map((cat) => (
                <span
                  key={cat}
                  className="inline-flex items-center gap-1.5 bg-[#FFF8EC] text-[#B87A10] border border-[#F5A623]/30 text-xs font-semibold px-3 py-1.5 rounded-full"
                >
                  <Award className="w-3 h-3" />
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        {/* ── BALANCE INFO ── */}
        <Reveal>
          <div
            className={cn(
              "border rounded-xl p-5 shadow-[0_2px_8px_rgba(26,26,46,0.06)]",
              isBalanceSufficient
                ? "bg-emerald-50 border-emerald-200"
                : "bg-amber-50 border-amber-200"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center",
                    isBalanceSufficient ? "bg-emerald-100" : "bg-amber-100"
                  )}
                >
                  <Wallet
                    className={cn(
                      "w-4.5 h-4.5",
                      isBalanceSufficient ? "text-emerald-600" : "text-amber-600"
                    )}
                    style={{ width: 18, height: 18 }}
                  />
                </div>
                <div>
                  <p
                    className={cn(
                      "text-xs font-semibold uppercase tracking-wide",
                      isBalanceSufficient ? "text-emerald-700" : "text-amber-700"
                    )}
                  >
                    Platform Balance
                  </p>
                  <p
                    className={cn(
                      "text-xl font-bold",
                      isBalanceSufficient ? "text-emerald-800" : "text-amber-800"
                    )}
                  >
                    {formatPkr(profile.balancePkr)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={cn(
                    "text-xs",
                    isBalanceSufficient ? "text-emerald-600" : "text-amber-600"
                  )}
                >
                  Minimum required
                </p>
                <p
                  className={cn(
                    "text-sm font-bold",
                    isBalanceSufficient ? "text-emerald-700" : "text-amber-700"
                  )}
                >
                  {formatPkr(BALANCE_MINIMUM_PKR)}
                </p>
              </div>
            </div>

            {!isBalanceSufficient && (
              <div className="mt-3 flex items-center gap-2 bg-amber-100 rounded-lg px-3 py-2">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <p className="text-xs text-amber-700 font-medium">
                  Balance kam hai. Bidding ke liye top up karein.
                </p>
              </div>
            )}

            {isBalanceSufficient && (
              <div className="mt-3 flex items-center gap-2 bg-emerald-100 rounded-lg px-3 py-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <p className="text-xs text-emerald-700 font-medium">
                  Balance theek hai. Aap bid kar sakte hain.
                </p>
              </div>
            )}

            <div className="mt-3 flex justify-end">
              <Link
                href="/tasker-balance-transaction-history"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--primary)] hover:underline"
              >
                Balance history dekhein
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </Reveal>

        {/* ── TABS: REVIEWS / WORK HISTORY ── */}
        <Reveal>
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-[0_2px_8px_rgba(26,26,46,0.06)] overflow-hidden">
            {/* Tab bar */}
            <div className="flex border-b border-[var(--border)]">
              <button
                onClick={() => setActiveTab("reviews")}
                className={cn(
                  "flex-1 py-3.5 text-sm font-semibold transition-colors duration-150 flex items-center justify-center gap-2",
                  activeTab === "reviews"
                    ? "text-[var(--primary)] border-b-2 border-[var(--primary)] bg-[#EBF4FB]/40"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                )}
              >
                <Star className="w-4 h-4" />
                <span>Reviews</span>
                <span
                  className="text-[10px] font-medium text-[var(--muted-foreground)]"
                  dir="rtl"
                >
                  جائزے
                </span>
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={cn(
                  "flex-1 py-3.5 text-sm font-semibold transition-colors duration-150 flex items-center justify-center gap-2",
                  activeTab === "history"
                    ? "text-[var(--primary)] border-b-2 border-[var(--primary)] bg-[#EBF4FB]/40"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                )}
              >
                <TrendingUp className="w-4 h-4" />
                <span>Kaam History</span>
              </button>
            </div>

            {/* Reviews tab */}
            {activeTab === "reviews" && (
              <motion.div
                key="reviews"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="divide-y divide-[var(--border)]"
              >
                {MOCK_REVIEWS.map((review) => (
                  <motion.div
                    key={review.id}
                    variants={fadeInUp}
                    className="p-4 hover:bg-[var(--background)] transition-colors duration-150"
                  >
                    <div className="flex items-start gap-3">
                      {/* Poster avatar */}
                      <div className="w-9 h-9 rounded-full bg-[var(--primary)] flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm">
                        {review.posterInitials}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <p className="text-sm font-semibold text-[var(--foreground)]">
                            {review.posterName}
                          </p>
                          <span className="text-xs text-[var(--muted-foreground)]">
                            {review.date}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 mt-0.5">
                          <StarRow rating={review.rating} size={12} />
                          <span className="text-xs font-bold text-[var(--foreground)]">
                            {review.rating}.0
                          </span>
                        </div>

                        <p className="text-xs text-[var(--muted-foreground)] mt-0.5 font-medium">
                          {review.taskTitle}
                        </p>

                        <p className="text-sm text-[var(--foreground)] mt-1.5 leading-relaxed">
                          {review.comment}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Work history tab */}
            {activeTab === "history" && (
              <motion.div
                key="history"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="divide-y divide-[var(--border)]"
              >
                {MOCK_COMPLETED_TASKS.map((task) => (
                  <motion.div
                    key={task.id}
                    variants={fadeInUp}
                    className="p-4 hover:bg-[var(--background)] transition-colors duration-150"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[var(--foreground)] leading-snug">
                          {task.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className="inline-flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
                            <Briefcase className="w-3 h-3" />
                            {task.category}
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
                            <Calendar className="w-3 h-3" />
                            {task.completedAt}
                          </span>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold text-emerald-600">
                          +{formatPkr(task.earnedPkr)}
                        </p>
                        <p className="text-[10px] text-[var(--muted-foreground)] mt-0.5">
                          Budget: {formatPkr(task.budgetPkr)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Total earned summary */}
                <div className="p-4 bg-[#EBF4FB]/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-[var(--primary)]" />
                      <span className="text-sm font-semibold text-[var(--foreground)]">
                        Total Kamai
                      </span>
                    </div>
                    <span className="text-base font-bold text-[var(--primary)]">
                      {formatPkr(profile.totalEarnedPkr)}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </Reveal>

        {/* ── TRUST FOOTER ── */}
        <Reveal>
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 flex items-center gap-3 shadow-[0_2px_8px_rgba(26,26,46,0.06)]">
            <div className="w-9 h-9 rounded-full bg-[#EBF4FB] flex items-center justify-center flex-shrink-0">
              <Shield className="w-4.5 h-4.5 text-[var(--primary)]" style={{ width: 18, height: 18 }} />
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--foreground)]">
                Verified Tasker
              </p>
              <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
                Is tasker ki CNIC verification mukammal ho chuki hai. Aap safely kaam de sakte hain.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
