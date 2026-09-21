"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, CheckCircle, Clock, MapPin, Shield, Edit, Camera, Award, ThumbsUp, AlertCircle, ChevronRight, Briefcase, Calendar, User } from 'lucide-react';
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { fadeInUp, staggerContainer, scaleIn } from "@/lib/motion";
import { TASK_CATEGORIES, VerificationStatus, TaskCategory, TaskStatus, getStatusLabel, getStatusColor } from "@/lib/data";
type COMMISSION_RATE_DEFAULT = any;
const COMMISSION_RATE_DEFAULT: any = [];
type BALANCE_MINIMUM_PKR = any;
const BALANCE_MINIMUM_PKR: any = [];
type CITIES = any;
const CITIES: any = [];
type getVerificationLabel = any;
const getVerificationLabel: any = [];
type getVerificationColor = any;
const getVerificationColor: any = [];
type formatPkr = any;
const formatPkr: any = [];

// ─── Inline types & mock data ────────────────────────────────────────────────

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
  categories: ["small_repairs", "household_assistance", "moving_delivery", "errands"],
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
    comment: "Bilal fixed our leaking tap and a broken cabinet hinge in under an hour. Very professional and tidy. Will definitely hire again.",
    taskTitle: "Fix leaking tap and cabinet hinge",
    date: "12 Jun 2025",
  },
  {
    id: "r2",
    posterName: "Tariq Hussain",
    posterInitials: "TH",
    rating: 5,
    comment: "Picked up my documents from the NADRA office and delivered them safely. Kept me updated throughout. Highly recommended.",
    taskTitle: "NADRA document collection errand",
    date: "4 Jun 2025",
  },
  {
    id: "r3",
    posterName: "Ayesha Raza",
    posterInitials: "AR",
    rating: 4,
    comment: "Good work overall. Helped move furniture between two rooms. Took a bit longer than expected but was careful with everything.",
    taskTitle: "Furniture rearrangement — 2 rooms",
    date: "28 May 2025",
  },
  {
    id: "r4",
    posterName: "Kamran Shah",
    posterInitials: "KS",
    rating: 5,
    comment: "Installed a ceiling fan perfectly. Came prepared with his own tools. Very reasonable bid too.",
    taskTitle: "Ceiling fan installation",
    date: "19 May 2025",
  },
  {
    id: "r5",
    posterName: "Nadia Farooq",
    posterInitials: "NF",
    rating: 4,
    comment: "Helped with grocery shopping and delivery. Friendly and honest. Minor delay but communicated well.",
    taskTitle: "Weekly grocery run — DHA Phase 6",
    date: "10 May 2025",
  },
];

const MOCK_COMPLETED: CompletedTask[] = [
  {
    id: "t1",
    title: "Fix leaking tap and cabinet hinge",
    category: "small_repairs",
    budgetPkr: 800,
    city: "Karachi",
    completedAt: "12 Jun 2025",
    status: "completed",
    earnedPkr: 704,
  },
  {
    id: "t2",
    title: "NADRA document collection errand",
    category: "errands",
    budgetPkr: 500,
    city: "Karachi",
    completedAt: "4 Jun 2025",
    status: "completed",
    earnedPkr: 440,
  },
  {
    id: "t3",
    title: "Furniture rearrangement — 2 rooms",
    category: "moving_delivery",
    budgetPkr: 1200,
    city: "Karachi",
    completedAt: "28 May 2025",
    status: "completed",
    earnedPkr: 1056,
  },
  {
    id: "t4",
    title: "Ceiling fan installation",
    category: "small_repairs",
    budgetPkr: 600,
    city: "Karachi",
    completedAt: "19 May 2025",
    status: "completed",
    earnedPkr: 528,
  },
  {
    id: "t5",
    title: "Weekly grocery run — DHA Phase 6",
    category: "errands",
    budgetPkr: 400,
    city: "Karachi",
    completedAt: "10 May 2025",
    status: "completed",
    earnedPkr: 352,
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={size}
          className={
            s <= Math.round(rating)
              ? "fill-[var(--brand-accent)] text-[var(--brand-accent)]"
              : "fill-transparent text-neutral-300"
          }
        />
      ))}
    </span>
  );
}

function CategoryPill({ categoryKey }: { categoryKey: TaskCategory }) {
  const cat = TASK_CATEGORIES.find((c) => c.key === categoryKey);
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--brand-accent)]/10 px-3 py-1 text-xs font-medium text-[var(--brand-accent-dark)]">
      {cat?.label ?? categoryKey}
    </span>
  );
}

function VerificationBadge({ status }: { status: VerificationStatus }) {
  const label = getVerificationLabel(status);
  const color = getVerificationColor(status);
  const icons: Record<VerificationStatus, React.ReactNode> = {
    verified: <CheckCircle size={14} />,
    submitted: <Clock size={14} />,
    unverified: <AlertCircle size={14} />,
    restricted: <Shield size={14} />,
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${color}`}
    >
      {icons[status]}
      {label}
    </span>
  );
}

function InitialsAvatar({ initials, size = "md" }: { initials: string; size?: "sm" | "md" | "lg" }) {
  const sizeClass = size === "lg" ? "w-16 h-16 text-xl" : size === "md" ? "w-10 h-10 text-sm" : "w-8 h-8 text-xs";
  return (
    <div
      className={`${sizeClass} rounded-full bg-[var(--brand-accent)] flex items-center justify-center font-bold text-white flex-shrink-0`}
    >
      {initials}
    </div>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  icon,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
}) {
  return (
    <motion.div
      variants={scaleIn}
      className="rounded-2xl border border-black/5 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.08)] flex flex-col gap-3"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-neutral-500 uppercase tracking-wide">{label}</span>
        <span className="text-[var(--brand-accent)]">{icon}</span>
      </div>
      <div>
        <p className="text-2xl font-bold text-neutral-900 tracking-tight">{value}</p>
        {sub && <p className="text-xs text-neutral-400 mt-0.5">{sub}</p>}
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TaskerProfilePage() {
  const [activeTab, setActiveTab] = useState<"reviews" | "history">("reviews");
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(MOCK_PROFILE.bio);
  const [editBio, setEditBio] = useState(MOCK_PROFILE.bio);

  const profile = MOCK_PROFILE;
  const commissionRate = COMMISSION_RATE_DEFAULT;

  function handleSaveBio() {
    setBio(editBio);
    setIsEditing(false);
  }

  return (
    <main className="min-h-screen bg-neutral-50 pb-20">
      {/* ── Hero / Profile Header ── */}
      <Reveal>
        <section className="bg-white border-b border-black/5">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-24 h-24 rounded-2xl bg-[var(--brand-accent)] flex items-center justify-center text-3xl font-bold text-white shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
                  BA
                </div>
                <button
                  aria-label="Change profile photo"
                  className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white border border-black/10 shadow flex items-center justify-center text-neutral-500 hover:text-[var(--brand-accent)] transition-colors"
                >
                  <Camera size={14} />
                </button>
              </div>

              {/* Name + meta */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-1">
                  <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">{profile.name}</h1>
                  <VerificationBadge status={profile.verificationStatus} />
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-500 mb-3">
                  <span className="flex items-center gap-1.5">
                    <MapPin size={13} />
                    {profile.area}, {profile.city}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar size={13} />
                    Member since {profile.memberSince}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <StarRating rating={profile.rating} size={16} />
                  <span className="text-sm font-semibold text-neutral-800">{profile.rating.toFixed(1)}</span>
                  <span className="text-sm text-neutral-400">({profile.reviewCount} reviews)</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 flex-shrink-0">
                <Link
                  href="/verification-status"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
                >
                  <Shield size={14} />
                  Verification
                </Link>
                <Link
                  href="/tasker-balance-transaction-history"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--brand-accent)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--brand-accent-dark)] transition-colors shadow-[0_2px_8px_rgba(0,0,0,0.12)]"
                >
                  Balance
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-8 space-y-8">
        {/* ── Stats Grid ── */}
        <Reveal>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-4 gap-4"
          >
            <StatCard
              label="Tasks Done"
              value={String(profile.completedTasks)}
              sub="all time"
              icon={<Briefcase size={18} />}
            />
            <StatCard
              label="Total Earned"
              value={formatPkr(profile.totalEarnedPkr)}
              sub={`after ${(commissionRate * 100).toFixed(0)}% commission`}
              icon={<Award size={18} />}
            />
            <StatCard
              label="Response Rate"
              value={`${profile.responseRate}%`}
              sub={`avg ${profile.avgResponseTimeMin} min`}
              icon={<ThumbsUp size={18} />}
            />
            <StatCard
              label="Balance"
              value={formatPkr(profile.balancePkr)}
              sub={`min ${formatPkr(BALANCE_MINIMUM_PKR)} required`}
              icon={<Shield size={18} />}
            />
          </motion.div>
        </Reveal>

        {/* ── Bio ── */}
        <Reveal>
          <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.08)]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-neutral-900 flex items-center gap-2">
                <User size={16} className="text-[var(--brand-accent)]" />
                About Me
              </h2>
              {!isEditing && (
                <button
                  onClick={() => { setEditBio(bio); setIsEditing(true); }}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-[var(--brand-accent)] transition-colors"
                >
                  <Edit size={13} />
                  Edit
                </button>
              )}
            </div>
            {isEditing ? (
              <div className="space-y-3">
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  rows={5}
                  maxLength={500}
                  className="w-full rounded-xl border border-black/10 bg-neutral-50 px-4 py-3 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[var(--brand-accent)]/40 resize-none"
                />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-400">{editBio.length}/500 characters</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="rounded-xl border border-black/10 px-4 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveBio}
                      className="rounded-xl bg-[var(--brand-accent)] px-4 py-2 text-xs font-semibold text-white hover:bg-[var(--brand-accent-dark)] transition-colors"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-neutral-600 leading-relaxed">{bio}</p>
            )}
          </div>
        </Reveal>

        {/* ── Specialisations ── */}
        <Reveal>
          <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.08)]">
            <h2 className="text-base font-semibold text-neutral-900 mb-4 flex items-center gap-2">
              <Briefcase size={16} className="text-[var(--brand-accent)]" />
              Specialisations
            </h2>
            <div className="flex flex-wrap gap-2">
              {profile.categories.map((cat) => (
                <CategoryPill key={cat} categoryKey={cat} />
              ))}
            </div>
          </div>
        </Reveal>

        {/* ── Commission Info ── */}
        <Reveal>
          <div className="rounded-2xl border border-[var(--brand-accent)]/20 bg-[var(--brand-accent)]/5 p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex-1">
              <p className="text-sm font-semibold text-neutral-800 mb-1">Platform Commission</p>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Asan Kaam deducts a <span className="font-semibold text-neutral-700">{(commissionRate * 100).toFixed(0)}% commission</span> from your agreed task amount upon completion. Commission is reserved from your balance when you are assigned a task and released if the task is cancelled before starting.
              </p>
            </div>
            <div className="flex-shrink-0 text-center bg-white rounded-xl px-5 py-3 border border-black/5 shadow-sm">
              <p className="text-2xl font-bold text-[var(--brand-accent)]">{(commissionRate * 100).toFixed(0)}%</p>
              <p className="text-xs text-neutral-500">current rate</p>
            </div>
          </div>
        </Reveal>

        {/* ── Reviews / History Tabs ── */}
        <Reveal>
          <div className="rounded-2xl border border-black/5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.08)] overflow-hidden">
            {/* Tab bar */}
            <div className="flex border-b border-black/5">
              {(["reviews", "history"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-4 text-sm font-semibold transition-colors ${
                    activeTab === tab
                      ? "text-[var(--brand-accent)] border-b-2 border-[var(--brand-accent)] bg-[var(--brand-accent)]/5"
                      : "text-neutral-500 hover:text-neutral-700"
                  }`}
                >
                  {tab === "reviews" ? `Reviews (${MOCK_REVIEWS.length})` : `Work History (${MOCK_COMPLETED.length})`}
                </button>
              ))}
            </div>

            {/* Reviews tab */}
            {activeTab === "reviews" && (
              <div className="divide-y divide-black/5">
                {MOCK_REVIEWS.map((review, i) => (
                  <motion.div
                    key={review.id}
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: i * 0.06 }}
                    className="p-5 flex gap-4"
                  >
                    <InitialsAvatar initials={review.posterInitials} size="md" />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-neutral-800">{review.posterName}</span>
                        <StarRating rating={review.rating} size={13} />
                        <span className="text-xs text-neutral-400 ml-auto">{review.date}</span>
                      </div>
                      <p className="text-xs text-[var(--brand-accent-dark)] font-medium mb-1.5">{review.taskTitle}</p>
                      <p className="text-sm text-neutral-600 leading-relaxed">{review.comment}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* History tab */}
            {activeTab === "history" && (
              <div className="divide-y divide-black/5">
                {MOCK_COMPLETED.map((task, i) => {
                  const cat = TASK_CATEGORIES.find((c) => c.key === task.category);
                  const statusLabel = getStatusLabel(task.status);
                  const statusColor = getStatusColor(task.status);
                  return (
                    <motion.div
                      key={task.id}
                      variants={fadeInUp}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: i * 0.06 }}
                      className="p-5 flex items-center gap-4"
                    >
                      <div className="w-10 h-10 rounded-xl bg-[var(--brand-accent)]/10 flex items-center justify-center flex-shrink-0">
                        <Briefcase size={16} className="text-[var(--brand-accent)]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-neutral-800 truncate">{task.title}</p>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className="text-xs text-neutral-400">{cat?.label ?? task.category}</span>
                          <span className="text-neutral-200">·</span>
                          <span className="text-xs text-neutral-400">{task.city}</span>
                          <span className="text-neutral-200">·</span>
                          <span className="text-xs text-neutral-400">{task.completedAt}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                        <span className="text-sm font-bold text-neutral-900">{formatPkr(task.earnedPkr)}</span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColor}`}>
                          {statusLabel}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </Reveal>

        {/* ── Quick Links ── */}
        <Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                href: "/verification-status",
                icon: <Shield size={20} />,
                label: "Verification Status",
                sub: "Manage your ID verification",
              },
              {
                href: "/tasker-balance-transaction-history",
                icon: <Award size={20} />,
                label: "Balance & Ledger",
                sub: "View earnings and commissions",
              },
              {
                href: "/my-bids-tasker",
                icon: <Briefcase size={20} />,
                label: "My Bids",
                sub: "Track active and past bids",
              },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex items-center gap-4 rounded-2xl border border-black/5 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.08)] hover:border-[var(--brand-accent)]/30 hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-[var(--brand-accent)]/10 flex items-center justify-center text-[var(--brand-accent)] group-hover:bg-[var(--brand-accent)] group-hover:text-white transition-colors duration-300 flex-shrink-0">
                  {link.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-neutral-800 group-hover:text-[var(--brand-accent)] transition-colors">{link.label}</p>
                  <p className="text-xs text-neutral-400 mt-0.5">{link.sub}</p>
                </div>
                <ChevronRight size={16} className="ml-auto text-neutral-300 group-hover:text-[var(--brand-accent)] transition-colors flex-shrink-0" />
              </Link>
            ))}
          </div>
        </Reveal>
      </div>
    </main>
  );
}