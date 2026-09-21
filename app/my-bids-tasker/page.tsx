"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Gavel, Clock, CheckCircle, XCircle, ChevronRight, Filter, Search, TrendingUp, AlertCircle, Star, MapPin, Calendar, Banknote, Eye, RotateCcw, ArrowUpRight, Inbox } from 'lucide-react';
import { Reveal } from "@/components/Reveal";
import { useTranslations } from "next-intl";
import { getStatusLabel, getStatusColor, TaskStatus, TaskCategory } from "@/lib/data";
type formatPkr = any;
const formatPkr: any = [];
type COMMISSION_RATE_DEFAULT = any;
const COMMISSION_RATE_DEFAULT: any = [];
import { cn } from "@/lib/utils";
import { staggerContainer, fadeInUp } from "@/lib/motion";

// ─── Inline mock data ────────────────────────────────────────────────────────

type BidStatus = "pending" | "accepted" | "rejected" | "withdrawn";

interface MyBid {
  id: string;
  taskId: string;
  taskTitle: string;
  taskCategory: TaskCategory;
  taskCity: string;
  taskArea: string;
  taskStatus: TaskStatus;
  bidAmountPkr: number;
  commissionEstimatePkr: number;
  netEarningPkr: number;
  note: string;
  bidStatus: BidStatus;
  submittedAt: string;
  taskBudgetPkr: number;
  isUrgent: boolean;
  posterName: string;
  totalBids: number;
}

const MOCK_BIDS: MyBid[] = [
  {
    id: "bid-001",
    taskId: "task-101",
    taskTitle: "Grocery pickup from Imtiaz Superstore, DHA Phase 6",
    taskCategory: "errands",
    taskCity: "Karachi",
    taskArea: "DHA Phase 6",
    taskStatus: "in_progress",
    bidAmountPkr: 450,
    commissionEstimatePkr: 54,
    netEarningPkr: 396,
    note: "I live nearby and can pick up within 2 hours. I have a bike.",
    bidStatus: "accepted",
    submittedAt: "2024-01-15T09:30:00Z",
    taskBudgetPkr: 500,
    isUrgent: true,
    posterName: "Ayesha K.",
    totalBids: 4,
  },
  {
    id: "bid-002",
    taskId: "task-102",
    taskTitle: "Help move furniture from F-7 apartment to G-9 house",
    taskCategory: "moving_delivery",
    taskCity: "Islamabad",
    taskArea: "F-7",
    taskStatus: "open",
    bidAmountPkr: 3200,
    commissionEstimatePkr: 384,
    netEarningPkr: 2816,
    note: "I have a pickup truck and two helpers available on weekends.",
    bidStatus: "pending",
    submittedAt: "2024-01-16T14:00:00Z",
    taskBudgetPkr: 3500,
    isUrgent: false,
    posterName: "Bilal M.",
    totalBids: 7,
  },
  {
    id: "bid-003",
    taskId: "task-103",
    taskTitle: "Deep clean 3-bedroom apartment before tenant handover",
    taskCategory: "cleaning",
    taskCity: "Lahore",
    taskArea: "Gulberg III",
    taskStatus: "completed",
    bidAmountPkr: 2800,
    commissionEstimatePkr: 336,
    netEarningPkr: 2464,
    note: "Professional cleaning experience, bring all supplies.",
    bidStatus: "accepted",
    submittedAt: "2024-01-10T11:00:00Z",
    taskBudgetPkr: 3000,
    isUrgent: false,
    posterName: "Sara N.",
    totalBids: 5,
  },
  {
    id: "bid-004",
    taskId: "task-104",
    taskTitle: "Fix leaking kitchen tap and replace bathroom faucet",
    taskCategory: "small_repairs",
    taskCity: "Rawalpindi",
    taskArea: "Satellite Town",
    taskStatus: "open",
    bidAmountPkr: 800,
    commissionEstimatePkr: 96,
    netEarningPkr: 704,
    note: "Experienced plumber, can come same day.",
    bidStatus: "rejected",
    submittedAt: "2024-01-14T16:45:00Z",
    taskBudgetPkr: 700,
    isUrgent: false,
    posterName: "Usman A.",
    totalBids: 9,
  },
  {
    id: "bid-005",
    taskId: "task-105",
    taskTitle: "Stand in queue at NADRA office for CNIC renewal",
    taskCategory: "queue_standing",
    taskCity: "Karachi",
    taskArea: "Saddar",
    taskStatus: "assigned",
    bidAmountPkr: 600,
    commissionEstimatePkr: 72,
    netEarningPkr: 528,
    note: "I know the NADRA process well, will keep you updated via messages.",
    bidStatus: "accepted",
    submittedAt: "2024-01-17T08:00:00Z",
    taskBudgetPkr: 650,
    isUrgent: true,
    posterName: "Fatima Z.",
    totalBids: 3,
  },
  {
    id: "bid-006",
    taskId: "task-106",
    taskTitle: "Set up new laptop, install software, configure email",
    taskCategory: "digital_help",
    taskCity: "Lahore",
    taskArea: "Model Town",
    taskStatus: "open",
    bidAmountPkr: 1200,
    commissionEstimatePkr: 144,
    netEarningPkr: 1056,
    note: "IT professional with 5 years experience, can visit your home.",
    bidStatus: "pending",
    submittedAt: "2024-01-18T10:30:00Z",
    taskBudgetPkr: 1500,
    isUrgent: false,
    posterName: "Hassan R.",
    totalBids: 6,
  },
  {
    id: "bid-007",
    taskId: "task-107",
    taskTitle: "Cook traditional Pakistani dinner for 10 guests",
    taskCategory: "household_assistance",
    taskCity: "Karachi",
    taskArea: "Clifton",
    taskStatus: "cancelled",
    bidAmountPkr: 4500,
    commissionEstimatePkr: 540,
    netEarningPkr: 3960,
    note: "Home cook specializing in traditional Karachi cuisine.",
    bidStatus: "withdrawn",
    submittedAt: "2024-01-12T13:00:00Z",
    taskBudgetPkr: 5000,
    isUrgent: false,
    posterName: "Nadia S.",
    totalBids: 8,
  },
  {
    id: "bid-008",
    taskId: "task-108",
    taskTitle: "Deliver documents from Blue Area to I-8 Markaz",
    taskCategory: "moving_delivery",
    taskCity: "Islamabad",
    taskArea: "Blue Area",
    taskStatus: "completion_requested",
    bidAmountPkr: 350,
    commissionEstimatePkr: 42,
    netEarningPkr: 308,
    note: "On bike, can deliver within 45 minutes.",
    bidStatus: "accepted",
    submittedAt: "2024-01-18T15:00:00Z",
    taskBudgetPkr: 400,
    isUrgent: true,
    posterName: "Kamran B.",
    totalBids: 2,
  },
];

// ─── Derived stats ────────────────────────────────────────────────────────────

const BID_FILTER_OPTIONS: { key: BidStatus | "all"; label: string }[] = [
  { key: "all", label: "All Bids" },
  { key: "pending", label: "Pending" },
  { key: "accepted", label: "Accepted" },
  { key: "rejected", label: "Rejected" },
  { key: "withdrawn", label: "Withdrawn" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getBidStatusConfig(status: BidStatus) {
  switch (status) {
    case "pending":
      return {
        label: "Pending",
        color: "bg-amber-100 text-amber-700 border-amber-200",
        icon: Clock,
      };
    case "accepted":
      return {
        label: "Accepted",
        color: "bg-emerald-100 text-emerald-700 border-emerald-200",
        icon: CheckCircle,
      };
    case "rejected":
      return {
        label: "Rejected",
        color: "bg-red-100 text-red-700 border-red-200",
        icon: XCircle,
      };
    case "withdrawn":
      return {
        label: "Withdrawn",
        color: "bg-slate-100 text-slate-600 border-slate-200",
        icon: RotateCcw,
      };
  }
}

function getCategoryLabel(cat: TaskCategory): string {
  const map: Record<TaskCategory, string> = {
    errands: "Errands",
    moving_delivery: "Moving & Delivery",
    cleaning: "Cleaning",
    small_repairs: "Small Repairs",
    queue_standing: "Queue Standing",
    digital_help: "Digital Help",
    household_assistance: "Household Help",
    other: "Other",
  };
  return map[cat] ?? cat;
}

function formatRelativeDate(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  accent?: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: "0 8px 24px -8px rgba(0,0,0,0.12)" }}
      transition={{ duration: 0.2 }}
      className="bg-white border border-black/5 rounded-2xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.08)] flex flex-col gap-3"
    >
      <div
        className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center",
          accent ?? "bg-[var(--brand-primary)]/10"
        )}
      >
        <Icon
          className={cn(
            "h-5 w-5",
            accent ? "text-white" : "text-[var(--brand-primary)]"
          )}
          aria-hidden="true"
        />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900 tracking-tight">
          {value}
        </p>
        <p className="text-sm text-slate-500 mt-0.5">{label}</p>
        {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
      </div>
    </motion.div>
  );
}

function BidCard({ bid }: { bid: MyBid }) {
  const bidCfg = getBidStatusConfig(bid.bidStatus);
  const BidIcon = bidCfg.icon;
  const taskStatusColor = getStatusColor(bid.taskStatus);
  const taskStatusLabel = getStatusLabel(bid.taskStatus);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="bg-white border border-black/5 rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_-6px_rgba(0,0,0,0.08)] overflow-hidden group"
    >
      {/* Top bar */}
      <div className="flex items-start justify-between gap-3 p-5 pb-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {bid.isUrgent && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold bg-red-50 text-red-600 border border-red-100 rounded-full px-2 py-0.5">
                <AlertCircle className="h-3 w-3" aria-hidden="true" />
                Urgent
              </span>
            )}
            <span className="text-xs text-slate-400 bg-slate-50 border border-slate-100 rounded-full px-2 py-0.5">
              {getCategoryLabel(bid.taskCategory)}
            </span>
          </div>
          <h3 className="font-semibold text-slate-900 text-base leading-snug line-clamp-2 group-hover:text-[var(--brand-primary)] transition-colors duration-200">
            {bid.taskTitle}
          </h3>
          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" aria-hidden="true" />
              {bid.taskArea}, {bid.taskCity}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" aria-hidden="true" />
              {formatRelativeDate(bid.submittedAt)}
            </span>
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3 text-amber-400" aria-hidden="true" />
              {bid.totalBids} bids total
            </span>
          </div>
        </div>

        {/* Bid status badge */}
        <span
          className={cn(
            "inline-flex items-center gap-1.5 text-xs font-semibold border rounded-full px-3 py-1 shrink-0",
            bidCfg.color
          )}
        >
          <BidIcon className="h-3.5 w-3.5" aria-hidden="true" />
          {bidCfg.label}
        </span>
      </div>

      {/* Financials */}
      <div className="mx-5 mb-4 bg-slate-50 border border-slate-100 rounded-xl p-4 grid grid-cols-3 gap-3">
        <div className="text-center">
          <p className="text-xs text-slate-400 mb-1">Your Bid</p>
          <p className="text-base font-bold text-slate-900">
            {formatPkr(bid.bidAmountPkr)}
          </p>
        </div>
        <div className="text-center border-x border-slate-200">
          <p className="text-xs text-slate-400 mb-1">
            Commission ({Math.round(COMMISSION_RATE_DEFAULT * 100)}%)
          </p>
          <p className="text-base font-bold text-red-500">
            -{formatPkr(bid.commissionEstimatePkr)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-slate-400 mb-1">You Earn</p>
          <p className="text-base font-bold text-emerald-600">
            {formatPkr(bid.netEarningPkr)}
          </p>
        </div>
      </div>

      {/* Bid note */}
      <div className="mx-5 mb-4">
        <p className="text-xs text-slate-500 italic line-clamp-2">
          &ldquo;{bid.note}&rdquo;
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-3 px-5 py-3 border-t border-black/5 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">
            Posted by{" "}
            <span className="font-medium text-slate-700">{bid.posterName}</span>
          </span>
          <span
            className={cn(
              "text-xs font-medium px-2 py-0.5 rounded-full border",
              taskStatusColor
            )}
          >
            {taskStatusLabel}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {bid.bidStatus === "accepted" && (
            <Link
              href={`/in-app-messaging-chat`}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--brand-primary)] hover:underline"
            >
              Message
              <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
            </Link>
          )}
          <Link
            href={`/task/${bid.taskId}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold bg-[var(--brand-primary)] text-white rounded-lg px-3 py-1.5 hover:opacity-90 transition-opacity"
          >
            <Eye className="h-3.5 w-3.5" aria-hidden="true" />
            View Task
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MyBidsTaskerPage() {
  const t = useTranslations();

  const [filterStatus, setFilterStatus] = useState<BidStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const totalBids = MOCK_BIDS.length;
  const acceptedBids = MOCK_BIDS.filter((b) => b.bidStatus === "accepted").length;
  const pendingBids = MOCK_BIDS.filter((b) => b.bidStatus === "pending").length;
  const totalPotentialEarnings = MOCK_BIDS.filter(
    (b) => b.bidStatus === "accepted"
  ).reduce((sum, b) => sum + b.netEarningPkr, 0);

  const filteredBids = MOCK_BIDS.filter((bid) => {
    const matchesStatus =
      filterStatus === "all" || bid.bidStatus === filterStatus;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      bid.taskTitle.toLowerCase().includes(q) ||
      bid.taskCity.toLowerCase().includes(q) ||
      bid.taskArea.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-slate-50">
      {/* ── Page header ── */}
      <Reveal>
        <section className="bg-white border-b border-black/5 py-10 md:py-14">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] text-xs font-semibold rounded-full px-3 py-1 mb-3">
                  <Gavel className="h-3.5 w-3.5" aria-hidden="true" />
                  {t("myBids.eyebrow")}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight text-balance">
                  {t("myBids.heading")}
                </h1>
                <p className="mt-2 text-slate-500 text-base leading-relaxed max-w-xl">
                  {t("myBids.subheading")}
                </p>
              </div>
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-[var(--brand-primary)] text-white font-semibold rounded-xl px-5 py-2.5 hover:opacity-90 transition-opacity text-sm shrink-0"
              >
                <Search className="h-4 w-4" aria-hidden="true" />
                {t("myBids.browseTasks")}
              </Link>
            </div>
          </div>
        </section>
      </Reveal>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* ── Stats ── */}
        <Reveal>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              {
                icon: Gavel,
                label: "Total Bids Placed",
                value: String(totalBids),
                sub: "All time",
                accent: undefined,
              },
              {
                icon: CheckCircle,
                label: "Bids Accepted",
                value: String(acceptedBids),
                sub: `${Math.round((acceptedBids / totalBids) * 100)}% success rate`,
                accent: undefined,
              },
              {
                icon: Clock,
                label: "Awaiting Response",
                value: String(pendingBids),
                sub: "Active bids",
                accent: undefined,
              },
              {
                icon: Banknote,
                label: "Confirmed Earnings",
                value: formatPkr(totalPotentialEarnings),
                sub: "After commission",
                accent: undefined,
              },
            ].map((stat, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <StatCard {...stat} />
              </motion.div>
            ))}
          </motion.div>
        </Reveal>

        {/* ── Filters ── */}
        <Reveal>
          <div className="bg-white border border-black/5 rounded-2xl p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
                aria-hidden="true"
              />
              <input
                type="text"
                placeholder={t("myBids.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/30 focus:border-[var(--brand-primary)] transition-all"
              />
            </div>

            {/* Status filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
              {BID_FILTER_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setFilterStatus(opt.key)}
                  className={cn(
                    "text-xs font-semibold rounded-full px-3 py-1.5 border transition-all duration-200",
                    filterStatus === opt.key
                      ? "bg-[var(--brand-primary)] text-white border-[var(--brand-primary)]"
                      : "bg-white text-slate-600 border-slate-200 hover:border-[var(--brand-primary)]/40 hover:text-[var(--brand-primary)]"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        {/* ── Bid list ── */}
        <Reveal>
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-slate-500">
                Showing{" "}
                <span className="font-semibold text-slate-800">
                  {filteredBids.length}
                </span>{" "}
                {filteredBids.length === 1 ? "bid" : "bids"}
              </p>
              {filteredBids.length !== MOCK_BIDS.length && (
                <button
                  onClick={() => {
                    setFilterStatus("all");
                    setSearchQuery("");
                  }}
                  className="text-xs text-[var(--brand-primary)] hover:underline font-medium"
                >
                  Clear filters
                </button>
              )}
            </div>

            <AnimatePresence mode="popLayout">
              {filteredBids.length > 0 ? (
                <motion.div
                  layout
                  className="space-y-4"
                >
                  {filteredBids.map((bid) => (
                    <BidCard key={bid.id} bid={bid} />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-20 text-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                    <Inbox className="h-8 w-8 text-slate-400" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-700 mb-1">
                    {t("myBids.emptyTitle")}
                  </h3>
                  <p className="text-sm text-slate-400 max-w-xs">
                    {t("myBids.emptyBody")}
                  </p>
                  <Link
                    href="/"
                    className="mt-5 inline-flex items-center gap-2 bg-[var(--brand-primary)] text-white font-semibold rounded-xl px-5 py-2.5 text-sm hover:opacity-90 transition-opacity"
                  >
                    <Search className="h-4 w-4" aria-hidden="true" />
                    {t("myBids.browseTasks")}
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Reveal>

        {/* ── Tips banner ── */}
        <Reveal>
          <section className="bg-[var(--brand-primary)]/5 border border-[var(--brand-primary)]/15 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--brand-primary)]/15 flex items-center justify-center shrink-0">
                <TrendingUp
                  className="h-5 w-5 text-[var(--brand-primary)]"
                  aria-hidden="true"
                />
              </div>
              <div>
                <h2 className="font-semibold text-slate-900 mb-1">
                  {t("myBids.tipsHeading")}
                </h2>
                <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside leading-relaxed">
                  <li>{t("myBids.tip1")}</li>
                  <li>{t("myBids.tip2")}</li>
                  <li>{t("myBids.tip3")}</li>
                </ul>
                <Link
                  href="/tasker-profile"
                  className="inline-flex items-center gap-1 mt-3 text-sm font-semibold text-[var(--brand-primary)] hover:underline"
                >
                  {t("myBids.viewProfile")}
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </section>
        </Reveal>
      </div>
    </main>
  );
}